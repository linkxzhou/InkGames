import {
  Body, Bodies, Composite, Engine as MatterEngine, Query,
  type Body as MatterBody, type IBodyDefinition,
} from 'matter-js';
import { sampleBodyLink, type BodyLink, type SampledPose } from './body-link';
import { advanceFixedClock, FIXED_DT } from './fixed-clock';
import { footingKind, walkTangent, type FootingKind } from './slope';
import { contactsToStamps, terrainBounds, type InkStamp, type TerrainBounds, type TerrainPoint } from './terrain-field';

export const ACTOR_RADIUS = 18;
export const MOVE_SPEED = 5;
export const JUMP_VY = -12;
export const KNOCKBACK_CAP = 12;
export const KNOCKBACK_LOCK = 22;
export const ATTACK_STEPS = 14;

const CAT_GROUND = 0x0001;
const CAT_ONEWAY = 0x0002;
const CAT_ACTOR = 0x0004;
const CAT_BAMBOO = 0x0008;

interface LivePair {
  isActive: boolean;
  bodyA: MatterBody;
  bodyB: MatterBody;
  collision: {
    normal: { x: number; y: number };
    supports: Array<{ x: number; y: number } | null>;
  };
}

interface OneWay {
  readonly body: MatterBody;
  readonly topY: number;
}

interface BambooRig {
  id: number;
  intact: boolean;
  whole?: MatterBody;
  root?: MatterBody;
  upper?: MatterBody;
}

export interface Footing {
  readonly kind: FootingKind | 'air';
  readonly nx: number;
  readonly ny: number;
}

export interface SweepHit {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

/**
 * Pixel, Y-down Matter world for the side-scroller. InkWorld stays untouched for the ten cards.
 * No Matter.Runner: the caller feeds fixed steps.
 */
export class Playfield {
  readonly physics = MatterEngine.create({ enableSleeping: false });
  readonly actor: MatterBody;
  readonly actorRadius = ACTOR_RADIUS;
  private readonly links = new Map<number, BodyLink>();
  private readonly oneWays: OneWay[] = [];
  private readonly bamboos = new Map<number, BambooRig>();
  private readonly terrain: TerrainPoint[] = [];
  private readonly hitOnce = new Set<number>();
  private nextId = 1;
  private movement = 0;
  private facing = 1;
  private lock = 0;
  private attackSteps = 0;
  private dropSteps = 0;
  private previousFeetY = 0;
  private accumulator = 0;
  private alphaValue = 1;
  private oneWayOpen = false;
  private footingValue: Footing = { kind: 'air', nx: 0, ny: -1 };
  private contactPoints: TerrainPoint[] = [];
  private paused = false;

  constructor() {
    this.physics.gravity.y = 1;
    this.actor = Bodies.circle(180, 180, ACTOR_RADIUS, {
      friction: 0.05,
      frictionAir: 0.01,
      restitution: 0,
      label: 'actor',
      collisionFilter: { category: CAT_ACTOR, mask: CAT_GROUND | CAT_ONEWAY | CAT_BAMBOO, group: 0 },
    });
    Body.setInertia(this.actor, Infinity);
    Composite.add(this.physics.world, this.actor);
    this.previousFeetY = this.actor.position.y + ACTOR_RADIUS;
    this.track(this.actor, 40);
  }

  get alpha(): number { return this.alphaValue; }
  get inputLock(): number { return this.lock; }
  get footing(): Footing { return this.footingValue; }
  get oneWayEnabled(): boolean { return this.oneWayOpen; }
  get contacts(): readonly TerrainPoint[] { return this.contactPoints; }
  get terrainPoints(): readonly TerrainPoint[] { return this.terrain; }

  get pausedClock(): boolean { return this.paused; }
  set pausedClock(value: boolean) { this.paused = value; }

  track(body: MatterBody, z: number): BodyLink {
    const link: BodyLink = {
      bodyId: body.id,
      z,
      previousX: body.position.x,
      previousY: body.position.y,
      currentX: body.position.x,
      currentY: body.position.y,
    };
    this.links.set(body.id, link);
    return link;
  }

  link(bodyId: number): BodyLink | undefined { return this.links.get(bodyId); }

  sample(bodyId: number, alpha: number): SampledPose | undefined {
    const link = this.links.get(bodyId);
    return link ? sampleBodyLink(link, alpha) : undefined;
  }

  placeActor(x: number, y: number): void {
    Body.setPosition(this.actor, { x, y });
    Body.setVelocity(this.actor, { x: 0, y: 0 });
    this.previousFeetY = y + ACTOR_RADIUS;
    const link = this.links.get(this.actor.id);
    if (link) {
      link.previousX = x;
      link.previousY = y;
      link.currentX = x;
      link.currentY = y;
    }
  }

  /** A/D. Ignored while knockback still holds the input. */
  move(direction: number): void {
    this.movement = Math.max(-1, Math.min(1, direction));
    if (this.movement !== 0) this.facing = this.movement > 0 ? 1 : -1;
  }

  jump(): void {
    if (this.lock > 0 || this.footingValue.kind !== 'walk') return;
    Body.setVelocity(this.actor, { x: this.actor.velocity.x, y: JUMP_VY });
  }

  /** Down + jump. Clears the one-way mask for a few steps. */
  dropThrough(): void {
    this.dropSteps = 10;
  }

  hurt(vx: number, vy: number): void {
    const length = Math.sqrt(vx * vx + vy * vy);
    const scale = length > KNOCKBACK_CAP ? KNOCKBACK_CAP / length : 1;
    Body.setVelocity(this.actor, { x: vx * scale, y: vy * scale });
    this.lock = KNOCKBACK_LOCK;
  }

  attack(): void {
    this.attackSteps = ATTACK_STEPS;
    this.hitOnce.clear();
  }

  get attacking(): boolean { return this.attackSteps > 0; }

  /**
   * Hand-authored polyline. Each segment is its own static body so the contact normal
   * follows the slope. Mesh relief in z is not added here.
   */
  addPolyline(points: readonly TerrainPoint[], thickness = 28): MatterBody[] {
    const bodies: MatterBody[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (!a || !b) continue;
      const body = segmentBody(a.x, a.y, b.x, b.y, thickness, 'ground');
      if (!body) continue;
      body.collisionFilter.category = CAT_GROUND;
      body.collisionFilter.mask = CAT_ACTOR | CAT_BAMBOO;
      Composite.add(this.physics.world, body);
      bodies.push(body);
    }
    for (const point of points) this.terrain.push(point);
    return bodies;
  }

  addOneWay(x: number, y: number, width: number): MatterBody {
    const body = Bodies.rectangle(x, y, width, 14, {
      isStatic: true,
      friction: 0.8,
      label: 'one-way',
      collisionFilter: { category: CAT_ONEWAY, mask: CAT_ACTOR, group: 0 },
    });
    Composite.add(this.physics.world, body);
    this.oneWays.push({ body, topY: body.bounds.min.y });
    return body;
  }

  addBamboo(x: number, baseY: number, height: number): number {
    const id = this.nextId++;
    const body = Bodies.rectangle(x, baseY - height / 2, 18, height, {
      isStatic: true,
      label: 'bamboo',
      friction: 0.4,
      collisionFilter: { category: CAT_BAMBOO, mask: CAT_ACTOR | CAT_GROUND, group: 0 },
    });
    Composite.add(this.physics.world, body);
    this.track(body, 0);
    this.bamboos.set(id, { id, intact: true, whole: body });
    return id;
  }

  bambooIntact(id: number): boolean { return this.bamboos.get(id)?.intact ?? false; }

  bambooBodies(id: number): MatterBody[] {
    const rig = this.bamboos.get(id);
    if (!rig) return [];
    if (rig.intact && rig.whole) return [rig.whole];
    return [rig.root, rig.upper].filter((body): body is MatterBody => body !== undefined);
  }

  /** Split one static stalk into a static root and a dynamic upper piece. */
  cutBamboo(id: number): boolean {
    const rig = this.bamboos.get(id);
    if (!rig?.intact || !rig.whole) return false;
    const whole = rig.whole;
    const height = whole.bounds.max.y - whole.bounds.min.y;
    const rootH = height * 0.35;
    const upperH = height - rootH;
    const x = whole.position.x;
    const baseY = whole.bounds.max.y;
    Composite.remove(this.physics.world, whole);
    this.links.delete(whole.id);
    const root = Bodies.rectangle(x, baseY - rootH / 2, 18, rootH, {
      isStatic: true,
      label: 'bamboo-root',
      collisionFilter: { category: CAT_BAMBOO, mask: CAT_ACTOR, group: 0 },
    });
    const upper = Bodies.rectangle(x, baseY - rootH - upperH / 2, 16, upperH, {
      isStatic: false,
      label: 'bamboo-upper',
      friction: 0.2,
      frictionAir: 0.02,
      collisionFilter: { category: CAT_BAMBOO, mask: CAT_GROUND | CAT_ACTOR, group: 0 },
    });
    Body.setVelocity(upper, { x: this.facing * 3, y: -4 });
    Composite.add(this.physics.world, [root, upper]);
    this.track(root, 0);
    this.track(upper, 0);
    rig.intact = false;
    rig.whole = undefined;
    rig.root = root;
    rig.upper = upper;
    return true;
  }

  bounds(): TerrainBounds { return terrainBounds(this.terrain); }

  stamps(limit = 8): InkStamp[] {
    if (this.terrain.length < 2) return [];
    return contactsToStamps(this.contactPoints, terrainBounds(this.terrain), limit);
  }

  step(dt: number): void {
    if (this.paused) {
      this.alphaValue = 1;
      return;
    }
    if (!Number.isFinite(dt) || dt < 0) throw new Error('Invalid frame dt');
    const clock = advanceFixedClock(this.accumulator, dt);
    this.accumulator = clock.accumulator;
    this.alphaValue = clock.alpha;
    for (let i = 0; i < clock.steps; i++) this.stepOnce();
  }

  stepOnce(): void {
    this.applyOneWayMask();
    this.footingValue = this.readFooting();
    this.applyMove();
    MatterEngine.update(this.physics, FIXED_DT * 1000);
    this.readContacts();
    this.syncLinks();
    this.previousFeetY = this.actor.position.y + ACTOR_RADIUS;
    if (this.lock > 0) this.lock -= 1;
    if (this.attackSteps > 0) {
      this.sweep();
      this.attackSteps -= 1;
    }
    if (this.dropSteps > 0) this.dropSteps -= 1;
  }

  private applyOneWayMask(): void {
    const above = this.oneWays.some(platform => this.previousFeetY <= platform.topY + 6);
    this.oneWayOpen = above && this.dropSteps === 0;
    const mask = CAT_GROUND | CAT_BAMBOO | (this.oneWayOpen ? CAT_ONEWAY : 0);
    this.actor.collisionFilter.mask = mask;
    this.actor.collisionFilter.category = CAT_ACTOR;
  }

  private applyMove(): void {
    if (this.lock > 0) return;
    const footing = this.footingValue;
    if (footing.kind === 'walk' && this.movement !== 0) {
      const tangent = walkTangent(footing.nx, footing.ny);
      if (Math.abs(tangent.x) > 1e-4) {
        const scale = (this.movement * MOVE_SPEED) / tangent.x;
        Body.setVelocity(this.actor, { x: tangent.x * scale, y: tangent.y * scale });
      }
      return;
    }
    if (footing.kind === 'wall') {
      const into = this.actor.velocity.x * footing.nx + this.actor.velocity.y * footing.ny;
      if (into < 0) {
        Body.setVelocity(this.actor, {
          x: this.actor.velocity.x - into * footing.nx,
          y: this.actor.velocity.y - into * footing.ny,
        });
      }
    }
    if (this.movement !== 0 && footing.kind !== 'walk') {
      Body.setVelocity(this.actor, { x: this.movement * MOVE_SPEED, y: this.actor.velocity.y });
    }
  }

  private readFooting(): Footing {
    let bestDot = -2;
    let best: Footing = { kind: 'air', nx: 0, ny: -1 };
    for (const pair of this.pairs()) {
      if (!this.involves(pair, this.actor)) continue;
      if (!this.isGround(pair)) continue;
      const normal = this.normalTowardActor(pair);
      const kind = footingKind(normal.x, normal.y);
      const dot = -normal.y;
      if (kind === 'walk' && dot > bestDot) {
        bestDot = dot;
        best = { kind, nx: normal.x, ny: normal.y };
      } else if (best.kind === 'air') {
        best = { kind, nx: normal.x, ny: normal.y };
        bestDot = dot;
      }
    }
    return best;
  }

  private readContacts(): void {
    const found: TerrainPoint[] = [];
    for (const pair of this.pairs()) {
      if (!this.involves(pair, this.actor) || !this.isGround(pair)) continue;
      const support = pair.collision.supports[0];
      if (support) found.push({ x: support.x, y: support.y });
      if (found.length >= 8) break;
    }
    this.contactPoints = found;
  }

  private sweep(): void {
    const reach = 72;
    const start = { x: this.actor.position.x, y: this.actor.position.y };
    const end = { x: start.x + this.facing * reach, y: start.y };
    const targets = [...this.bamboos.values()].flatMap(rig => this.bambooBodies(rig.id));
    if (!targets.length) return;
    const hits = Query.ray(targets, start, end, 12);
    for (const hit of hits) {
      const part = hit.bodyA;
      const body = part.parent ?? part;
      if (this.hitOnce.has(body.id)) continue;
      this.hitOnce.add(body.id);
      for (const rig of this.bamboos.values()) {
        const mine = this.bambooBodies(rig.id).some(candidate => candidate.id === body.id || candidate.id === part.id);
        if (mine) this.cutBamboo(rig.id);
      }
    }
  }

  lastSweep(): readonly SweepHit[] {
    return [...this.hitOnce].map(id => {
      const body = Composite.get(this.physics.world, id, 'body') as MatterBody | null;
      return { id, x: body?.position.x ?? 0, y: body?.position.y ?? 0 };
    });
  }

  private syncLinks(): void {
    for (const link of this.links.values()) {
      const body = Composite.get(this.physics.world, link.bodyId, 'body') as MatterBody | null;
      if (!body) continue;
      link.previousX = link.currentX;
      link.previousY = link.currentY;
      link.currentX = body.position.x;
      link.currentY = body.position.y;
    }
  }

  private pairs(): LivePair[] {
    return (this.physics.pairs.list as unknown as LivePair[]).filter(pair => pair.isActive);
  }

  private involves(pair: LivePair, body: MatterBody): boolean {
    return pair.bodyA.id === body.id || pair.bodyB.id === body.id || pair.bodyA.parent?.id === body.id || pair.bodyB.parent?.id === body.id;
  }

  private isGround(pair: LivePair): boolean {
    const label = (body: MatterBody) => body.label;
    return label(pair.bodyA) === 'ground' || label(pair.bodyB) === 'ground'
      || label(pair.bodyA) === 'one-way' || label(pair.bodyB) === 'one-way';
  }

  private normalTowardActor(pair: LivePair): { x: number; y: number } {
    const actorIsA = pair.bodyA.id === this.actor.id || pair.bodyA.parent?.id === this.actor.id;
    const n = pair.collision.normal;
    return actorIsA ? { x: n.x, y: n.y } : { x: -n.x, y: -n.y };
  }
}

function segmentBody(x0: number, y0: number, x1: number, y1: number, thickness: number, label: string): MatterBody | undefined {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < 1) return undefined;
  const nx = (-dy / length) * (thickness / 2);
  const ny = (dx / length) * (thickness / 2);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const verts = [
    { x: x0 + nx, y: y0 + ny },
    { x: x1 + nx, y: y1 + ny },
    { x: x1 - nx, y: y1 - ny },
    { x: x0 - nx, y: y0 - ny },
  ];
  const options: IBodyDefinition = { isStatic: true, friction: 0.9, restitution: 0, label };
  const body = Bodies.fromVertices(cx, cy, [verts], options);
  return body ?? undefined;
}
