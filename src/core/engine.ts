import { FIXED_PHASES, RENDER_PHASES, resolvePlugins } from './plugin-graph';
import type { CommandPort, EngineOptions, EnginePlugin, EventPort, FixedContext, InitContext, RegistrationContext, RenderContext, ResourcePort, ServiceToken, Stamped } from './types';

type Handler = (message: Stamped<unknown>) => void;

class ResourceScope implements ResourcePort {
  private cleanups: Array<() => void | Promise<void>> = [];
  add(cleanup: () => void | Promise<void>): void { this.cleanups.push(cleanup); }
  async dispose(): Promise<void> {
    const errors: unknown[] = [];
    for (const cleanup of this.cleanups.splice(0).reverse()) {
      try { await cleanup(); } catch (error) { errors.push(error); }
    }
    if (errors.length) throw new AggregateError(errors, 'Resource cleanup failed');
  }
}

class MessageBus implements CommandPort, EventPort {
  private handlers = new Map<string, Set<Handler>>();
  private pending: Stamped<unknown>[] = [];
  private next: Stamped<unknown>[] = [];
  private order = 0;
  private step = 0;
  private dispatching = false;
  private flushed = false;

  setStep(step: number): void {
    this.step = step;
    this.flushed = false;
    this.pending.push(...this.next);
    this.next = [];
  }
  enqueue<T>(kind: string, payload: T): void { this.push(kind, payload); }
  emit<T>(kind: string, payload: T): void { this.push(kind, payload); }
  private push<T>(kind: string, payload: T): void {
    if (!kind) throw new Error('Message kind is required');
    const nextStep = this.dispatching || this.flushed;
    const message = { kind, payload, step: nextStep ? this.step + 1 : this.step, order: this.order++ };
    (nextStep ? this.next : this.pending).push(message);
  }
  on<T>(kind: string, handler: (message: Stamped<T>) => void): () => void {
    const handlers = this.handlers.get(kind) ?? new Set<Handler>();
    handlers.add(handler as Handler);
    this.handlers.set(kind, handlers);
    return () => { handlers.delete(handler as Handler); if (!handlers.size) this.handlers.delete(kind); };
  }
  onAny(handler: Handler): () => void { return this.on('*', handler); }
  flush(): void {
    const current = this.pending;
    this.pending = [];
    this.dispatching = true;
    this.flushed = true;
    try {
      for (const message of current) {
        for (const handler of this.handlers.get(message.kind) ?? []) handler(message);
        for (const handler of this.handlers.get('*') ?? []) handler(message);
      }
    } finally {
      this.dispatching = false;
    }
  }
  clear(): void { this.pending = []; this.next = []; this.handlers.clear(); }
}

export class Engine {
  readonly commands = new MessageBus();
  readonly events = new MessageBus();
  private readonly plugins: EnginePlugin[];
  private readonly scopes = new Map<string, ResourceScope>();
  private readonly services = new Map<symbol, unknown>();
  private readonly owners = new Map<symbol, string>();
  private readonly fixedDt: number;
  private readonly maxSteps: number;
  private readonly maxFrameTime: number;
  private state: 'new' | 'ready' | 'running' | 'paused' | 'disposed' = 'new';
  private frameHandle: number | undefined;
  private lastTime: number | undefined;
  private accumulator = 0;
  private stepIndex = 0;
  private registered: EnginePlugin[] = [];
  private started: EnginePlugin[] = [];
  private failure: unknown;
  private phase = 'new';

  constructor(private readonly options: EngineOptions) {
    this.plugins = resolvePlugins(options.plugins ?? []);
    this.fixedDt = 1 / (options.fixedHz ?? 60);
    this.maxSteps = options.maxStepsPerFrame ?? 4;
    this.maxFrameTime = options.maxFrameTime ?? 0.25;
    if (!Number.isFinite(this.fixedDt) || this.fixedDt <= 0 || !Number.isInteger(this.maxSteps) || this.maxSteps < 1 || !Number.isFinite(this.maxFrameTime) || this.maxFrameTime <= 0) throw new Error('Invalid engine timing options');
    for (const plugin of this.plugins) for (const provided of plugin.manifest.provides ?? []) this.owners.set(provided.token.key, plugin.manifest.id);
  }

  get currentStep(): number { return this.stepIndex; }
  get status(): string { return this.state; }
  get lastError(): unknown { return this.failure; }

  async init(): Promise<void> {
    if (this.state !== 'new') throw new Error(`Cannot initialize engine in state ${this.state}`);
    let current = '';
    try {
      for (const plugin of this.plugins) {
        current = plugin.manifest.id;
        this.phase = `register:${current}`;
        const scope = new ResourceScope();
        this.scopes.set(current, scope);
        this.registered.push(plugin);
        const registration: RegistrationContext = {
          provide: (token, value) => {
            if (this.owners.get(token.key) !== current) throw new Error(`${current} did not declare service ${token.id}`);
            if (this.services.has(token.key)) throw new Error(`Service ${token.id} already registered`);
            this.services.set(token.key, value);
          }, resources: scope, commands: this.commands, events: this.events,
        };
        plugin.register(registration);
      }
      for (const plugin of this.plugins) {
        current = plugin.manifest.id;
        this.phase = `init:${current}`;
        for (const provided of plugin.manifest.provides ?? []) if (!this.services.has(provided.token.key)) throw new Error(`${current} did not register ${provided.token.id}`);
        for (const dependency of plugin.manifest.requires ?? []) if (!this.services.has(dependency.token.key)) throw new Error(`${current} cannot access ${dependency.token.id}`);
        await plugin.init(this.context(plugin));
      }
      this.state = 'ready';
      this.hookContextLoss();
    } catch (error) {
      this.failure = new Error(`Plugin ${current} initialization failed`, { cause: error });
      try { await this.dispose(); } catch (cleanupError) { this.failure = new AggregateError([this.failure, cleanupError], 'Initialization and cleanup failed'); }
      throw this.failure;
    }
  }

  /**
   * 上下文丢失时统一暂停时钟（不产生半步），恢复后自动继续。
   * GPU 资源的重建归各插件：它们必须在 dispose() 之后仍能被重新 init()，
   * 或由宿主在恢复事件里重建引擎（v0.1 的做法是后者，见 apps/inkcross）。
   */
  private hookContextLoss(): void {
    const host = this.options.host;
    host.onContextLost?.(() => {
      this.contextLost = true;
      if (this.state === 'running') this.pause();
    });
    host.onContextRestored?.(() => {
      if (!this.contextLost) return;
      this.contextLost = false;
      this.options.onContextRestored?.();
    });
  }
  private contextLost = false;
  get contextWasLost(): boolean { return this.contextLost; }

  private context(plugin: EnginePlugin): InitContext {
    const id = plugin.manifest.id;
    const allowed = new Set([...plugin.manifest.requires ?? [], ...plugin.manifest.optional ?? [], ...plugin.manifest.provides ?? []].map(item => item.token.key));
    const get = <T>(token: ServiceToken<T>): T => {
      if (!allowed.has(token.key)) throw new Error(`${id} did not declare dependency ${token.id}`);
      if (!this.services.has(token.key)) throw new Error(`Missing service ${token.id}`);
      return this.services.get(token.key) as T;
    };
    return { get, optional: <T>(token: ServiceToken<T>) => this.services.has(token.key) ? get(token) : undefined,
      resources: this.scopes.get(id)!, commands: this.commands, events: this.events };
  }

  start(): void {
    if (this.state !== 'ready' && this.state !== 'paused') throw new Error(`Cannot start engine in state ${this.state}`);
    const wasPaused = this.state === 'paused';
    try {
      if (!this.started.length) for (const plugin of this.plugins) {
        this.phase = `start:${plugin.manifest.id}`;
        this.started.push(plugin);
        plugin.start?.(this.context(plugin));
      }
      this.state = 'running';
      this.lastTime = wasPaused ? this.options.host.now() : undefined;
      this.schedule();
    } catch (error) { this.fail(this.phase, error); throw this.failure; }
  }

  pause(): void {
    if (this.state !== 'running') return;
    this.state = 'paused';
    if (this.frameHandle !== undefined) this.options.host.cancelFrame(this.frameHandle);
    this.frameHandle = undefined;
    this.lastTime = undefined;
  }

  private schedule(): void {
    this.phase = 'requestFrame';
    this.frameHandle = this.options.host.requestFrame(timestamp => {
      this.frameHandle = undefined;
      if (this.state !== 'running') return;
      try {
        this.tick(timestamp);
        if (this.state === 'running') this.schedule();
      } catch (error) { this.fail(this.phase, error); }
    });
  }

  tick(timestamp = this.options.host.now()): void {
    if (this.state !== 'running') throw new Error(`Cannot tick engine in state ${this.state}`);
    if (!Number.isFinite(timestamp)) throw new Error('Invalid frame timestamp');
    if (this.lastTime === undefined) { this.lastTime = timestamp; return; }
    const elapsed = Math.max(0, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;
    let gap = Math.max(0, elapsed - this.maxFrameTime);
    this.accumulator += Math.min(elapsed, this.maxFrameTime);
    let steps = 0;
    while (this.accumulator + 1e-10 >= this.fixedDt && steps < this.maxSteps) {
      this.fixedStep();
      this.accumulator = Math.max(0, this.accumulator - this.fixedDt);
      steps++;
    }
    if (this.accumulator + 1e-10 >= this.fixedDt) {
      const lostSteps = Math.floor((this.accumulator + 1e-10) / this.fixedDt);
      this.accumulator = Math.max(0, this.accumulator - lostSteps * this.fixedDt);
      gap += lostSteps * this.fixedDt;
    }
    if (gap > 0) this.options.onGap?.(gap, this.stepIndex);
    const alpha = Math.max(0, Math.min(1, this.accumulator / this.fixedDt));
    for (const phase of RENDER_PHASES) for (const plugin of this.plugins) if (plugin.manifest.renderPhase === phase) {
      this.phase = `render:${plugin.manifest.id}`;
      try { plugin.render?.({ ...this.context(plugin), step: this.stepIndex, alpha } as RenderContext); }
      catch (error) { throw new Error(`${plugin.manifest.id}.render failed`, { cause: error }); }
    }
  }

  private fixedStep(): void {
    this.commands.setStep(this.stepIndex);
    this.events.setStep(this.stepIndex);
    for (const phase of FIXED_PHASES) {
      if (phase === 'commands') { this.phase = 'commands'; this.commands.flush(); }
      for (const plugin of this.plugins) if (plugin.manifest.fixedPhase === phase) {
        this.phase = `fixedUpdate:${plugin.manifest.id}`;
        try { plugin.fixedUpdate?.({ ...this.context(plugin), step: this.stepIndex, dt: this.fixedDt } as FixedContext); }
        catch (error) { throw new Error(`${plugin.manifest.id}.fixedUpdate failed at step ${this.stepIndex}`, { cause: error }); }
      }
    }
    this.phase = 'events';
    this.events.flush();
    this.stepIndex++;
  }

  private fail(phase: string, error: unknown): void {
    this.failure = new Error(`Engine ${phase} failed at step ${this.stepIndex}`, { cause: error });
    if (this.state === 'running') this.pause();
    else { this.state = 'paused'; this.lastTime = undefined; }
  }

  async dispose(): Promise<void> {
    if (this.state === 'disposed') return;
    this.pause();
    this.state = 'disposed';
    const errors: unknown[] = [];
    for (const plugin of this.started.reverse()) try { plugin.stop?.(); } catch (error) { errors.push(error); }
    this.started = [];
    for (const plugin of this.registered.reverse()) try { await plugin.dispose?.(); } catch (error) { errors.push(error); }
    this.registered = [];
    for (const scope of [...this.scopes.values()].reverse()) try { await scope.dispose(); } catch (error) { errors.push(error); }
    this.scopes.clear();
    this.services.clear();
    this.commands.clear();
    this.events.clear();
    if (errors.length) throw new AggregateError(errors, 'Engine cleanup failed');
  }
}
