import { Body, Bodies, Composite, Engine as MatterEngine, Events, type IBodyDefinition, type IEventCollision } from 'matter-js';

export interface InkBridge {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly locked: boolean;
}

export interface InkProjectile {
  readonly id: number;
  readonly body: Body;
}

export interface InkImpact {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

export class InkWorld {
  readonly physics = MatterEngine.create({ enableSleeping: false });
  readonly player = Bodies.circle(180, 135, 18, { friction: 0.6, restitution: 0.05, label: 'player' });
  private readonly platforms = new Map<number, Body[]>();
  private readonly bridges = new Map<number, InkBridge[]>();
  private readonly shots = new Map<number, InkProjectile>();
  private readonly shotAge = new Map<number, number>();
  private readonly pendingImpacts: InkImpact[] = [];
  private nextId = 1;
  private movement = 0;
  private action: 'attack' | 'hurt' | undefined;
  private actionSteps = 0;
  private stateValue: 'idle' | 'run' | 'jump' | 'attack' | 'hurt' = 'jump';

  get state(): 'idle' | 'run' | 'jump' | 'attack' | 'hurt' { return this.stateValue; }

  constructor() {
    this.physics.gravity.y = 1;
    Composite.add(this.physics.world, [
      this.player,
      Bodies.rectangle(640, 630, 1280, 50, { isStatic: true, label: 'ground' }),
      Bodies.rectangle(25, 360, 50, 720, { isStatic: true, label: 'left-wall' }),
      Bodies.rectangle(1255, 360, 50, 720, { isStatic: true, label: 'right-wall' }),
    ]);
    Events.on(this.physics, 'collisionStart', this.handleCollision);
  }

  private readonly handleCollision = (event: IEventCollision<MatterEngine>): void => {
    for (const pair of event.pairs) {
      for (const body of [pair.bodyA, pair.bodyB]) {
        const shot = this.shots.get(body.id);
        if (!shot) continue;
        const other = body === pair.bodyA ? pair.bodyB : pair.bodyA;
        if (other === this.player) continue;
        this.pendingImpacts.push({ id: shot.id, x: body.position.x, y: body.position.y });
        this.shots.delete(body.id);
        this.shotAge.delete(body.id);
        Composite.remove(this.physics.world, body);
      }
    }
  };

  get strokes(): readonly InkBridge[] { return [...this.bridges.values()].flat(); }
  get projectiles(): readonly InkProjectile[] { return [...this.shots.values()]; }

  launchProjectile(fromX: number, fromY: number, toX: number, toY: number): number {
    if (![fromX, fromY, toX, toY].every(Number.isFinite)) throw new Error('Invalid projectile coordinates');
    const body = Bodies.circle(fromX, fromY, 8, {
      label: 'ink-projectile', restitution: 0, friction: 0.1,
      collisionFilter: { group: -1 },
    });
    const id = this.nextId++;
    this.shots.set(body.id, { id, body });
    this.shotAge.set(body.id, 0);
    Composite.add(this.physics.world, body);
    const dx = toX - fromX;
    const dy = toY - fromY;
    const length = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    Body.setVelocity(body, { x: dx / length * 14, y: dy / length * 14 - 3 });
    return id;
  }

  drainImpacts(): InkImpact[] { return this.pendingImpacts.splice(0); }

  addBridge(x: number, y: number, width: number, locked = false): number {
    if (!Number.isFinite(x + y + width) || width <= 0) throw new Error('Invalid bridge');
    const id = this.nextId++;
    const bridge: InkBridge = { id, x, y, width, locked };
    this.bridges.set(id, [bridge]);
    this.replaceBodies(id, [bridge]);
    return id;
  }

  private replaceBodies(id: number, segments: readonly InkBridge[]): void {
    for (const body of this.platforms.get(id) ?? []) Composite.remove(this.physics.world, body);
    const bodies = segments.map(segment => Bodies.rectangle(segment.x, segment.y, segment.width, 12,
      { isStatic: true, label: `bridge-${id}` }));
    this.platforms.set(id, bodies);
    Composite.add(this.physics.world, bodies);
  }

  bodyFor(id: number): Body | undefined { return this.platforms.get(id)?.[0]; }

  eraseBridge(x: number, y: number, radius: number): number[] {
    const changed: number[] = [];
    if (!(radius > 0)) return changed;
    for (const [id, segments] of this.bridges) {
      const updated: InkBridge[] = [];
      let affected = false;
      for (const segment of segments) {
        if (segment.locked || Math.abs(segment.y - y) > radius + 6) { updated.push(segment); continue; }
        const left = segment.x - segment.width / 2;
        const right = segment.x + segment.width / 2;
        const halfY = Math.abs(segment.y - y);
        const reach = Math.sqrt(Math.max(0, (radius + 6) * (radius + 6) - halfY * halfY));
        const cutLeft = Math.max(left, x - reach);
        const cutRight = Math.min(right, x + reach);
        if (cutRight <= cutLeft) { updated.push(segment); continue; }
        affected = true;
        if (cutLeft - left > 3) updated.push({ ...segment, x: (left + cutLeft) / 2, width: cutLeft - left });
        if (right - cutRight > 3) updated.push({ ...segment, x: (cutRight + right) / 2, width: right - cutRight });
      }
      if (!affected) continue;
      this.bridges.set(id, updated);
      this.replaceBodies(id, updated);
      changed.push(id);
    }
    return changed;
  }

  move(direction: number): void {
    this.movement = Math.max(-1, Math.min(1, direction));
    const velocity = this.player.velocity;
    Body.setVelocity(this.player, { x: this.movement * 5, y: velocity.y });
  }

  private get grounded(): boolean {
    const { x, y } = this.player.position;
    return (y >= 585 && Math.abs(this.player.velocity.y) < 2) || this.strokes.some(segment =>
      x >= segment.x - segment.width / 2 - 12 && x <= segment.x + segment.width / 2 + 12 &&
      y >= segment.y - 30 && y <= segment.y - 14 && Math.abs(this.player.velocity.y) < 2);
  }

  jump(): void {
    if (this.grounded) Body.setVelocity(this.player, { x: this.player.velocity.x, y: -12 });
  }

  attack(): void { this.action = 'attack'; this.actionSteps = 14; this.stateValue = 'attack'; }
  hurt(): void { this.action = 'hurt'; this.actionSteps = 22; this.stateValue = 'hurt'; }

  step(dt: number): void {
    if (!Number.isFinite(dt) || dt <= 0) throw new Error('Invalid physics step');
    MatterEngine.update(this.physics, dt * 1000);
    for (const [bodyId, shot] of this.shots) {
      const age = (this.shotAge.get(bodyId) ?? 0) + 1;
      if (age < 150 && shot.body.position.x >= -50 && shot.body.position.x <= 1330 &&
          shot.body.position.y >= -50 && shot.body.position.y <= 770) {
        this.shotAge.set(bodyId, age);
        continue;
      }
      Composite.remove(this.physics.world, shot.body);
      this.shots.delete(bodyId);
      this.shotAge.delete(bodyId);
    }
    if (this.actionSteps > 0) {
      this.actionSteps--;
      this.stateValue = this.action ?? 'idle';
    } else {
      this.action = undefined;
      this.stateValue = !this.grounded ? 'jump' : this.movement ? 'run' : 'idle';
    }
  }

  addBody(x: number, y: number, radius: number, options: IBodyDefinition = {}): Body {
    const body = Bodies.circle(x, y, radius, options);
    Composite.add(this.physics.world, body);
    return body;
  }

  removeBody(body: Body): void { Composite.remove(this.physics.world, body); }

  resetPlayer(): void {
    for (const shot of this.shots.values()) Composite.remove(this.physics.world, shot.body);
    this.shots.clear();
    this.shotAge.clear();
    this.pendingImpacts.length = 0;
    Body.setPosition(this.player, { x: 180, y: 135 });
    Body.setVelocity(this.player, { x: 0, y: 0 });
    this.movement = 0;
    this.action = undefined;
    this.actionSteps = 0;
    this.stateValue = 'jump';
  }

  dispose(): void {
    Events.off(this.physics, 'collisionStart', this.handleCollision);
    this.shots.clear();
    this.shotAge.clear();
    this.pendingImpacts.length = 0;
    Composite.clear(this.physics.world, false);
    MatterEngine.clear(this.physics);
    this.platforms.clear();
    this.bridges.clear();
  }
}
