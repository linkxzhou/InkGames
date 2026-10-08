export interface HostPort {
  readonly canvas?: HTMLCanvasElement;
  now(): number;
  requestFrame(callback: (timestamp: number) => void): number;
  cancelFrame(handle: number): void;
  /** 上下文丢失/恢复时由宿主上报；引擎据此暂停与恢复唯一时钟（plan/07 §8.2）。 */
  onContextLost?(handler: () => void): void;
  onContextRestored?(handler: () => void): void;
}

export interface ServiceToken<T> {
  readonly key: symbol;
  readonly id: string;
  /** 仅用于类型推断，运行时不存在 */
  readonly __type?: T;
}

export function createToken<T>(id: string): ServiceToken<T> {
  if (!id) throw new Error('Service token id is required');
  return Object.freeze({ id, key: Symbol(id) });
}

export interface Dependency<T = unknown> {
  readonly token: ServiceToken<T>;
  readonly range: string;
}

export interface ProvidedService<T = unknown> {
  readonly token: ServiceToken<T>;
  readonly version: string;
}

export type FixedPhase = 'input' | 'commands' | 'geometry' | 'collision' | 'physics' | 'gameplay';
export type RenderPhase = 'gpu' | 'scene' | 'ink' | 'ui';

export interface PluginManifest {
  readonly id: string;
  readonly version: string;
  readonly requires?: readonly Dependency[];
  readonly optional?: readonly Dependency[];
  readonly provides?: readonly ProvidedService[];
  readonly fixedPhase?: FixedPhase;
  readonly renderPhase?: RenderPhase;
  readonly before?: readonly string[];
  readonly after?: readonly string[];
}

export interface Stamped<T = unknown> {
  readonly step: number;
  readonly order: number;
  readonly kind: string;
  readonly payload: T;
}

export interface CommandPort {
  enqueue<T>(kind: string, payload: T): void;
  on<T>(kind: string, handler: (command: Stamped<T>) => void): () => void;
  onAny(handler: (command: Stamped) => void): () => void;
}

export interface EventPort {
  emit<T>(kind: string, payload: T): void;
  on<T>(kind: string, handler: (event: Stamped<T>) => void): () => void;
  onAny(handler: (event: Stamped) => void): () => void;
}

export interface ResourcePort {
  add(cleanup: () => void | Promise<void>): void;
}

export interface RegistrationContext {
  provide<T>(token: ServiceToken<T>, value: T): void;
  readonly resources: ResourcePort;
  readonly commands: CommandPort;
  readonly events: EventPort;
}

export interface InitContext {
  get<T>(token: ServiceToken<T>): T;
  optional<T>(token: ServiceToken<T>): T | undefined;
  readonly resources: ResourcePort;
  readonly commands: CommandPort;
  readonly events: EventPort;
}

export interface FixedContext extends InitContext {
  readonly step: number;
  readonly dt: number;
}

export interface RenderContext extends InitContext {
  readonly step: number;
  readonly alpha: number;
}

export interface EnginePlugin {
  readonly manifest: PluginManifest;
  register(context: RegistrationContext): void;
  init(context: InitContext): Promise<void> | void;
  start?(context: InitContext): void;
  fixedUpdate?(context: FixedContext): void;
  render?(context: RenderContext): void;
  stop?(): void;
  dispose?(): Promise<void> | void;
}

export interface EngineOptions {
  readonly host: HostPort;
  readonly plugins?: readonly EnginePlugin[];
  readonly fixedHz?: number;
  readonly maxStepsPerFrame?: number;
  readonly maxFrameTime?: number;
  readonly onGap?: (lostSeconds: number, step: number) => void;
  /** 上下文恢复后回调：宿主/应用在此重建 GPU 资源（plan/07 §8.2）。 */
  readonly onContextRestored?: () => void;
}
