import { InkRng } from '../core/ink-noise';
import { FX_SPECS } from './fx-effects';
import { FX_SPLAT_CAP } from './fx-types';
import type { FxParticle, FxSpec, FxStep, InkFx, InkFxFrame, InkFxInfo, InkFxParams, InkSplat } from './fx-types';

export type { FxSpec, InkFx, InkFxFrame, InkFxInfo, InkFxParams, InkSplat } from './fx-types';
export { INK_FX_PIGMENTS } from './fx-types';

const DEFAULTS: InkFxParams = {
  speed: 1,
  density: 1,
  pigment: -1,
  keep: false,
  fadeOut: false,
  originX: 0.5,
  originY: 0.5,
};

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

function quiet(spec: FxSpec, originX: number, originY: number): InkFxFrame {
  return {
    splats: [],
    flow: 0,
    diffuse: 0,
    evaporate: 0,
    fade: 0,
    flash: 0,
    recede: 0,
    age: spec.overlay === 8 ? 1 : 0,
    shake: 0,
    clear: false,
    overlay: spec.overlay,
    pigment: -1,
    originX,
    originY,
  };
}

class FxController implements InkFx {
  readonly id: string;
  readonly label: string;
  readonly duration: number;
  readonly loop: boolean;
  private time = 0;
  private speed = 1;
  private density = 1;
  private pigment = -1;
  private fadeOut = false;
  private originX = 0.5;
  private originY = 0.5;
  private keep = false;
  private pendingClear = true;
  private disposed = false;
  private done = false;
  private readonly rng: InkRng;
  private particles: FxParticle[] = [];
  private readonly mem = [0, 0, 0, 0, 0, 0, 0, 0];

  constructor(private readonly spec: FxSpec) {
    this.id = spec.id;
    this.label = spec.label;
    this.duration = spec.duration;
    this.loop = spec.loop;
    this.rng = new InkRng(hashId(spec.id) || 1);
    this.originX = spec.anchorX ?? 0.5;
    this.originY = spec.anchorY ?? 0.5;
  }

  get progress(): number {
    if (this.duration <= 0) return 1;
    return Math.min(1, this.time / this.duration);
  }

  get finished(): boolean {
    return this.done || this.disposed;
  }

  start(params?: Partial<InkFxParams>): void {
    const next = { ...DEFAULTS, ...params };
    this.speed = next.speed < 0.2 ? 0.2 : next.speed > 3 ? 3 : next.speed;
    this.density = next.density < 0 ? 0 : next.density > 1 ? 1 : next.density;
    this.pigment = next.pigment;
    this.fadeOut = next.fadeOut;
    this.keep = next.keep;
    this.originX = params?.originX ?? this.spec.anchorX ?? 0.5;
    this.originY = params?.originY ?? this.spec.anchorY ?? 0.5;
    this.time = 0;
    this.done = false;
    this.disposed = false;
    this.pendingClear = !this.keep;
    this.particles = [];
    for (let i = 0; i < this.mem.length; i++) this.mem[i] = 0;
    this.rng.next();
  }

  update(dt: number): InkFxFrame {
    if (this.disposed) return quiet(this.spec, this.originX, this.originY);
    if (this.done && !this.loop) return quiet(this.spec, this.originX, this.originY);
    const stepDt = dt > 0.05 ? 0.05 : dt < 0 ? 0 : dt;
    this.time += stepDt * this.speed;
    if (this.loop) {
      if (this.time >= this.duration) this.time %= this.duration;
    } else if (this.time >= this.duration) {
      this.time = this.duration;
      this.done = true;
    }
    const splats: InkSplat[] = [];
    const ctx: FxStep = {
      t: this.progress,
      time: this.time,
      dt: stepDt * this.speed,
      duration: this.duration,
      density: this.density,
      pigment: this.pigment,
      fadeOut: this.fadeOut,
      rng: this.rng,
      particles: this.particles,
      mem: this.mem,
      flow: 0,
      diffuse: 0.2,
      evaporate: 0.3,
      fade: 0,
      flash: 0,
      recede: 0,
      age: 0,
      shake: 0,
      stamp: splat => {
        if (splats.length >= FX_SPLAT_CAP) return;
        const shifted = this.spec.placeable
          ? { ...splat, x: splat.x + (this.originX - 0.5), y: splat.y + (this.originY - 0.5) }
          : splat;
        const pigment = this.pigment >= 0 ? this.pigment : shifted.pigment;
        splats.push({ ...shifted, amount: shifted.amount * this.density, pigment });
      },
    };
    this.spec.step(ctx);
    this.particles = ctx.particles;
    const clear = this.pendingClear;
    this.pendingClear = false;
    return {
      splats,
      flow: ctx.flow,
      diffuse: ctx.diffuse,
      evaporate: ctx.evaporate,
      fade: ctx.fade,
      flash: ctx.flash,
      recede: ctx.recede,
      age: ctx.age,
      shake: ctx.shake,
      clear,
      overlay: this.spec.overlay,
      pigment: this.pigment,
      originX: this.originX,
      originY: this.originY,
    };
  }

  dispose(): void {
    this.disposed = true;
    this.particles = [];
  }
}

export function listInkFx(): readonly InkFxInfo[] {
  return FX_SPECS.map(spec => ({
    id: spec.id,
    label: spec.label,
    use: spec.use,
    technique: spec.technique,
    duration: spec.duration,
    loop: spec.loop,
    placeable: spec.placeable,
  }));
}

export function createInkFx(id: string): InkFx {
  const spec = FX_SPECS.find(item => item.id === id);
  if (!spec) throw new Error(`未知水墨特效 ${id}`);
  const fx = new FxController(spec);
  fx.start();
  return fx;
}
