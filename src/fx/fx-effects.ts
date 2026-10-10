/**
 * 二十四种水墨动态的时间表。坐标手写，y 向下。
 * 参考片只用来对节奏，这里不读任何素材像素。
 */
import { inkCos, inkSin, TWO_PI } from '../core/ink-random';
import { valueNoise } from '../core/ink-noise';
import { clamp01, easeInOutSine, easeOutCubic, easeOutExpo, easeOutQuart } from './fx-ease';
import type { FxParticle, FxSpec, FxStep, InkSplat } from './fx-types';

interface Poly {
  pts: readonly (readonly [number, number])[];
  t0: number;
  t1: number;
  width0: number;
  width1: number;
  water0: number;
  water1: number;
  amount: number;
  pigment: number;
}

function pointAt(pts: readonly (readonly [number, number])[], s: number): readonly [number, number] {
  let total = 0;
  const seg: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const ax = pts[i - 1]?.[0] ?? 0;
    const ay = pts[i - 1]?.[1] ?? 0;
    const bx = pts[i]?.[0] ?? ax;
    const by = pts[i]?.[1] ?? ay;
    const d = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
    seg.push(d);
    total += d;
  }
  let walk = clamp01(s) * total;
  for (let i = 0; i < seg.length; i++) {
    const d = seg[i] ?? 0;
    const ax = pts[i]?.[0] ?? 0;
    const ay = pts[i]?.[1] ?? 0;
    const bx = pts[i + 1]?.[0] ?? ax;
    const by = pts[i + 1]?.[1] ?? ay;
    if (walk <= d || i === seg.length - 1) {
      const u = d > 0 ? walk / d : 0;
      return [ax + (bx - ax) * u, ay + (by - ay) * u];
    }
    walk -= d;
  }
  return pts[pts.length - 1] ?? [0, 0];
}

function tangent(pts: readonly (readonly [number, number])[], s: number): readonly [number, number] {
  const a = pointAt(pts, Math.max(0, s - 0.02));
  const b = pointAt(pts, Math.min(1, s + 0.02));
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.sqrt(dx * dx + dy * dy) || 1;
  return [dx / d, dy / d];
}

function brush(ctx: FxStep, poly: Poly): void {
  const span = poly.t1 - poly.t0;
  if (span <= 0 || ctx.t < poly.t0) return;
  const raw = clamp01((ctx.t - poly.t0) / span);
  const prevRaw = clamp01(raw - ctx.dt / (span * ctx.duration));
  const head = easeInOutSine(raw);
  const from = easeInOutSine(prevRaw);
  if (raw >= 1 && prevRaw >= 1) return;
  const samples = 2;
  for (let i = 1; i <= samples; i++) {
    const s = from + (head - from) * (i / samples);
    const p = pointAt(poly.pts, s);
    const dir = tangent(poly.pts, s);
    const w = poly.width0 + (poly.width1 - poly.width0) * s;
    const water = poly.water0 + (poly.water1 - poly.water0) * s;
    ctx.stamp({
      x: p[0], y: p[1], radius: w, amount: poly.amount,
      water, pigment: poly.pigment, vx: dir[0], vy: dir[1],
    });
  }
}

function splat(ctx: FxStep, s: InkSplat): void {
  ctx.stamp(s);
}

function alive(list: readonly FxParticle[]): FxParticle[] {
  return list.filter(p => p.life > 0);
}

function stepDrop(ctx: FxStep): void {
  ctx.flow = 0.55;
  ctx.diffuse = 0.62;
  ctx.evaporate = ctx.t < 0.45 ? 0.15 : 0.55;
  const fall = clamp01(ctx.t / 0.1);
  const y = 0.16 + fall * 0.46;
  if (ctx.t < 0.12) {
    splat(ctx, { x: 0.5, y, radius: 0.012, amount: 0.95, water: 0.2, pigment: 0, vx: 0, vy: 0.4 });
  }
  if (ctx.t >= 0.1) {
    const grow = easeOutExpo(clamp01((ctx.t - 0.1) / 0.72));
    splat(ctx, {
      x: 0.5, y: 0.64 + grow * 0.02, radius: 0.02 + grow * 0.05,
      amount: 0.9 - grow * 0.25, water: 0.95, pigment: 0, vx: 0, vy: 0.05,
    });
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * TWO_PI + 0.35 + ctx.time * 0.35;
      const rad = 0.015 + grow * (0.1 + (i % 3) * 0.025);
      const tip = 0.55 + grow * 0.45;
      splat(ctx, {
        x: 0.5 + inkCos(ang) * rad,
        y: 0.64 + inkSin(ang) * rad * 0.72 + grow * 0.05,
        radius: 0.01 + (1 - tip) * 0.012,
        amount: 0.55 * (1 - grow * 0.35),
        water: 0.8,
        pigment: 0,
        vx: inkCos(ang + 1.4) * 0.25,
        vy: inkSin(ang + 1.4) * 0.25 + 0.08,
      });
    }
  }
}

function stepSplash(ctx: FxStep): void {
  ctx.flow = 0.2;
  ctx.diffuse = ctx.t < 0.25 ? 0.15 : 0.55;
  ctx.evaporate = ctx.t > 0.55 ? 0.8 : 0.2;
  if ((ctx.mem[0] ?? 0) < 1 && ctx.t < 0.2) {
    const born = ctx.mem[0] ?? 0;
    const want = 36;
    while (ctx.particles.length < want && ctx.t > born / want * 0.16) {
      const i = ctx.particles.length;
      const roll = ctx.rng.next();
      const big = roll * roll;
      const ang = -0.35 + ctx.rng.range(-0.35, 0.35);
      const speed = 0.25 + ctx.rng.next() * 0.85 * (0.4 + big);
      ctx.particles.push({
        x: 0.36 + ctx.rng.range(-0.02, 0.03),
        y: 0.5 + ctx.rng.range(-0.03, 0.03),
        vx: inkCos(ang) * speed,
        vy: inkSin(ang) * speed * 0.65,
        radius: 0.006 + big * 0.028,
        amount: 0.55 + big * 0.45,
        water: 0.15,
        pigment: ctx.rng.next() < 0.16 ? 0.25 : 0,
        life: 0.35 + ctx.rng.next() * 0.3,
      });
      if (i > want) break;
    }
    ctx.mem[0] = ctx.particles.length;
  }
  if (ctx.t < 0.08) {
    splat(ctx, { x: 0.34, y: 0.48, radius: 0.07, amount: 1, water: 0.7, pigment: 0, vx: 0.2, vy: 0 });
    splat(ctx, { x: 0.4, y: 0.54, radius: 0.045, amount: 0.85, water: 0.65, pigment: 0, vx: 0.15, vy: 0.05 });
    splat(ctx, { x: 0.3, y: 0.44, radius: 0.03, amount: 0.7, water: 0.5, pigment: 0, vx: 0.1, vy: -0.04 });
  }
  for (const p of ctx.particles) {
    if (p.life <= 0) continue;
    p.life -= ctx.dt;
    if (ctx.t < 0.28) {
      p.x += p.vx * ctx.dt;
      p.y += p.vy * ctx.dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
    } else {
      p.water = 0.65;
      p.radius += ctx.dt * 0.012;
    }
  }
  const list = ctx.particles;
  const start = list.length === 0 ? 0 : Math.floor(ctx.time * 60) % list.length;
  for (let n = 0; n < Math.min(12, list.length); n++) {
    const p = list[(start + n) % list.length];
    if (!p || p.life <= 0) continue;
    splat(ctx, {
      x: p.x, y: p.y, radius: p.radius, amount: p.amount,
      water: p.water, pigment: p.pigment, vx: p.vx, vy: p.vy,
    });
  }
  ctx.particles = alive(ctx.particles);
  if (ctx.t > 0.78) ctx.fade = 0.012;
}

function stepWipe(ctx: FxStep): void {
  ctx.flow = 0.35;
  ctx.diffuse = ctx.t < 0.5 ? 0.85 : 0.2;
  ctx.evaporate = ctx.t < 0.48 ? 0.05 : 0.35;
  const seeds: readonly (readonly [number, number])[] = [[0.12, 0.16], [0.86, 0.22], [0.2, 0.84], [0.72, 0.78]];
  if (ctx.t < 0.5) {
    const grow = easeOutCubic(clamp01(ctx.t / 0.48));
    for (const [x, y] of seeds) {
      splat(ctx, {
        x, y, radius: 0.02 + grow * 0.16, amount: 0.85, water: 1,
        pigment: 0, vx: (0.5 - x) * -0.1, vy: (0.5 - y) * -0.1,
      });
    }
  }
  if (ctx.t > 0.52) ctx.recede = easeOutCubic(clamp01((ctx.t - 0.52) / 0.48));
}

function stepTitle(ctx: FxStep): void {
  ctx.flow = 0.05;
  ctx.diffuse = 0.22;
  ctx.evaporate = 0.45;
  const ox = 0.38;
  const oy = 0.46;
  brush(ctx, {
    pts: [[ox, oy - 0.18], [ox + 0.005, oy], [ox, oy + 0.1], [ox - 0.045, oy + 0.16]],
    t0: 0.06, t1: 0.3, width0: 0.02, width1: 0.008, water0: 0.75, water1: 0.18, amount: 0.98, pigment: 0,
  });
  brush(ctx, {
    pts: [[ox, oy - 0.02], [ox - 0.08, oy + 0.05], [ox - 0.17, oy + 0.16]],
    t0: 0.36, t1: 0.55, width0: 0.016, width1: 0.005, water0: 0.5, water1: 0.08, amount: 0.9, pigment: 0,
  });
  brush(ctx, {
    pts: [[ox + 0.01, oy], [ox + 0.1, oy + 0.05], [ox + 0.2, oy + 0.13], [ox + 0.24, oy + 0.145]],
    t0: 0.6, t1: 0.82, width0: 0.022, width1: 0.004, water0: 0.45, water1: 0.05, amount: 0.95, pigment: 0,
  });
  if (ctx.t > 0.86 && ctx.t < 0.94) {
    splat(ctx, { x: 0.64, y: 0.64, radius: 0.028, amount: 0.8, water: 0.28, pigment: 0.25, vx: 0, vy: 1 });
  }
  if (ctx.fadeOut && ctx.t > 0.8) ctx.fade = 0.03;
}

function stepMist(ctx: FxStep): void {
  ctx.flow = 0.15;
  ctx.evaporate = 0.4;
  ctx.diffuse = 0.2;
}

function stepSmoke(ctx: FxStep): void {
  ctx.flow = 0.9;
  ctx.diffuse = 0.35;
  ctx.evaporate = 0.25;
  ctx.fade = 0.006;
  for (let i = 0; i < 3; i++) {
    const n = valueNoise(ctx.time * 0.8 + i, i * 2.2, 9);
    splat(ctx, {
      x: 0.48 + (n - 0.5) * 0.12,
      y: 0.72 - (ctx.time * 0.04 % 0.2),
      radius: 0.03 + n * 0.03,
      amount: 0.35 + n * 0.25,
      water: 0.7,
      pigment: 0,
      vx: (n - 0.5) * 0.4,
      vy: -0.35,
    });
  }
}

function stepDissolve(ctx: FxStep): void {
  ctx.flow = 0.7;
  ctx.diffuse = 0.25;
  ctx.evaporate = 0.3;
  ctx.fade = ctx.t > 0.7 ? 0.01 : 0;
  if (ctx.particles.length < 16 && ctx.t < 0.7 && ctx.rng.next() < 0.8) {
    const side = ctx.t;
    ctx.particles.push({
      x: 0.5 + (side - 0.2) * 0.35 + ctx.rng.range(-0.05, 0.05),
      y: 0.42 + ctx.rng.range(-0.18, 0.2),
      vx: 0.15 + ctx.rng.next() * 0.35,
      vy: ctx.rng.range(-0.15, 0.05),
      radius: 0.006 + ctx.rng.next() * 0.012,
      amount: 0.45,
      water: 0.35,
      pigment: ctx.t > 0.45 ? 0.5 : 0,
      life: 0.7,
    });
  }
  for (const p of ctx.particles) {
    p.life -= ctx.dt;
    p.x += p.vx * ctx.dt;
    p.y += p.vy * ctx.dt;
    p.vx += ctx.dt * 0.05;
    p.radius *= 0.995;
    splat(ctx, { x: p.x, y: p.y, radius: p.radius, amount: p.amount * clamp01(p.life), water: p.water, pigment: p.pigment, vx: p.vx, vy: p.vy });
  }
  ctx.particles = alive(ctx.particles);
}

function stepReveal(ctx: FxStep): void {
  ctx.flow = 0.25;
  ctx.diffuse = 0.9;
  ctx.evaporate = ctx.t < 0.7 ? 0.08 : 0.7;
  const grow = easeOutCubic(ctx.t);
  splat(ctx, { x: 0.62, y: 0.52, radius: 0.02 + grow * 0.08, amount: 0.75, water: 1, pigment: 0, vx: 0, vy: 0 });
  splat(ctx, { x: 0.4, y: 0.4, radius: 0.015 + grow * 0.06, amount: 0.55, water: 0.9, pigment: 0, vx: 0, vy: 0 });
}

function stepRiver(ctx: FxStep): void {
  ctx.flow = 0.3;
  ctx.diffuse = 0.2;
  ctx.evaporate = 0.5;
  if (ctx.rng.next() < 0.4) {
    splat(ctx, {
      x: (ctx.time * 0.12) % 1,
      y: 0.66 + valueNoise(ctx.time, 2, 4) * 0.04,
      radius: 0.008,
      amount: 0.35,
      water: 0.2,
      pigment: 0.5,
      vx: 1, vy: 0,
    });
  }
}

function stepStreak(ctx: FxStep): void {
  ctx.flow = 0.02;
  ctx.diffuse = 0.02;
  ctx.evaporate = 1.2;
  const u = easeInOutSine(clamp01(ctx.t / 0.72));
  const x = 0.08 + u * 0.84;
  const y = 0.58 - u * 0.12;
  const hairs = u > 0.62 ? 3 : 1;
  for (let i = 0; i < hairs; i++) {
    const off = (i - 1) * 0.012 * u;
    splat(ctx, {
      x, y: y + off,
      radius: (0.04 - u * 0.03) * (i === 1 || hairs === 1 ? 1 : 0.45),
      amount: 0.95 * (1 - u * 0.35),
      water: 0.42 * (1 - u),
      pigment: 0,
      vx: 1, vy: -0.15,
    });
  }
}

function stepRain(ctx: FxStep): void {
  ctx.flow = 0.1;
  ctx.diffuse = 0.45;
  ctx.evaporate = 0.7;
  ctx.fade = 0.01;
  if (ctx.particles.length < 10 && ctx.rng.next() < 0.7) {
    ctx.particles.push({
      x: ctx.rng.next(),
      y: 0.72 + ctx.rng.range(0, 0.2),
      vx: 0, vy: 0,
      radius: 0.008,
      amount: 0.4,
      water: 0.7,
      pigment: 0.5,
      life: 0.45,
    });
  }
  for (const p of ctx.particles) {
    p.life -= ctx.dt;
    p.radius += ctx.dt * 0.02;
    p.amount *= 0.985;
    splat(ctx, { x: p.x, y: p.y, radius: p.radius, amount: p.amount, water: p.water, pigment: p.pigment, vx: 0, vy: 1 });
  }
  ctx.particles = alive(ctx.particles);
}

function stepSeal(ctx: FxStep): void {
  ctx.flash = 0;
  ctx.shake = 0;
  if (ctx.t > 0.2 && ctx.t < 0.36) ctx.shake = 1 - (ctx.t - 0.2) / 0.16;
  if (ctx.t > 0.22 && ctx.t < 0.3) ctx.flash = 0.18;
  ctx.diffuse = 0.15;
  ctx.evaporate = 0.3;
  if (ctx.t > 0.24 && ctx.t < 0.55) {
    splat(ctx, { x: 0.5, y: 0.5, radius: 0.07, amount: 0.25, water: 0.22, pigment: 0.25, vx: 0, vy: 0 });
  }
}

function stepBamboo(ctx: FxStep): void {
  ctx.flow = 0.02;
  ctx.diffuse = 0.12;
  ctx.evaporate = 0.6;
  const x = 0.72;
  for (let i = 0; i < 5; i++) {
    const y0 = 0.9 - i * 0.13;
    const y1 = y0 - 0.11;
    brush(ctx, {
      pts: [[x, y0], [x + 0.004, (y0 + y1) / 2], [x, y1]],
      t0: 0.04 + i * 0.1, t1: 0.12 + i * 0.1,
      width0: 0.012, width1: 0.008, water0: 0.45, water1: 0.15, amount: 0.9, pigment: 0,
    });
    brush(ctx, {
      pts: [[x - 0.02, y1], [x + 0.02, y1]],
      t0: 0.12 + i * 0.1, t1: 0.15 + i * 0.1,
      width0: 0.008, width1: 0.008, water0: 0.2, water1: 0.1, amount: 1, pigment: 0,
    });
  }
  brush(ctx, {
    pts: [[x, 0.48], [x + 0.08, 0.4], [x + 0.14, 0.34]],
    t0: 0.62, t1: 0.74, width0: 0.007, width1: 0.003, water0: 0.3, water1: 0.05, amount: 0.8, pigment: 0,
  });
  const leaves: readonly (readonly [number, number, number, number])[] = [
    [0.78, 0.36, 0.86, 0.28],
    [0.8, 0.38, 0.9, 0.36],
    [0.76, 0.4, 0.7, 0.32],
  ];
  leaves.forEach((leaf, i) => {
    brush(ctx, {
      pts: [[leaf[0], leaf[1]], [leaf[2], leaf[3]]],
      t0: 0.76 + i * 0.06, t1: 0.84 + i * 0.06,
      width0: 0.012, width1: 0.002, water0: 0.4, water1: 0.05, amount: 0.85, pigment: 0,
    });
  });
}

function stepPlum(ctx: FxStep): void {
  ctx.flow = 0.04;
  ctx.diffuse = 0.1;
  ctx.evaporate = 0.55;
  brush(ctx, {
    pts: [[0.05, 0.72], [0.22, 0.6], [0.4, 0.5], [0.58, 0.36], [0.7, 0.28]],
    t0: 0.04, t1: 0.38, width0: 0.02, width1: 0.006, water0: 0.15, water1: 0.05, amount: 0.9, pigment: 0,
  });
  brush(ctx, {
    pts: [[0.4, 0.5], [0.48, 0.42], [0.52, 0.32]],
    t0: 0.4, t1: 0.52, width0: 0.008, width1: 0.003, water0: 0.2, water1: 0.05, amount: 0.7, pigment: 0,
  });
  const flowers: readonly (readonly [number, number, number])[] = [
    [0.28, 0.58, 0.5], [0.44, 0.46, 0.6], [0.56, 0.34, 0.7], [0.68, 0.26, 0.8],
  ];
  for (const [x, y, t0] of flowers) {
    const k = (ctx.t - t0) / 0.1;
    if (k <= 0 || k >= 1.2) continue;
    const petal = Math.floor(k * 5);
    if (petal >= 0 && petal < 5) {
      const ang = -1.1 + petal * 1.25;
      splat(ctx, {
        x: x + inkCos(ang) * 0.016, y: y + inkSin(ang) * 0.014,
        radius: 0.011, amount: 0.7, water: 0.4, pigment: 0.25, vx: inkCos(ang), vy: inkSin(ang),
      });
    }
    if (k > 0.85) splat(ctx, { x, y, radius: 0.004, amount: 1, water: 0.05, pigment: 0, vx: 0, vy: -1 });
  }
}

function stepFlame(ctx: FxStep): void {
  ctx.flow = 0.85;
  ctx.diffuse = 0.3;
  ctx.evaporate = 0.45;
  ctx.fade = 0.01;
  for (let i = 0; i < 5; i++) {
    const phase = (ctx.time * 0.7 + i * 0.17) % 1;
    const rise = phase;
    const x = 0.5 + inkSin(i * 1.7 + ctx.time * 3) * 0.06 + (i - 2) * 0.035;
    const y = 0.78 - rise * 0.42;
    const curl = inkSin(rise * 6 + i) * 0.04 * rise;
    splat(ctx, {
      x: x + curl, y,
      radius: 0.03 * (1 - rise * 0.75),
      amount: 0.75 * (1 - rise * 0.5),
      water: 0.15 * (1 - rise),
      pigment: rise < 0.45 ? 0.25 : 0,
      vx: curl * 4,
      vy: -0.8,
    });
  }
}

function stepBolt(ctx: FxStep): void {
  ctx.diffuse = 0.05;
  ctx.evaporate = 0.4;
  ctx.flash = ctx.t < 0.08 ? 1 - ctx.t / 0.08 : 0;
  const spine: readonly (readonly [number, number])[] = [
    [0.56, 0.06], [0.46, 0.22], [0.6, 0.36], [0.42, 0.52], [0.58, 0.68], [0.48, 0.9],
  ];
  brush(ctx, {
    pts: spine, t0: 0.06, t1: 0.22, width0: 0.016, width1: 0.006, water0: 0.12, water1: 0.04, amount: 1, pigment: 0,
  });
  brush(ctx, {
    pts: [[0.6, 0.36], [0.72, 0.42], [0.78, 0.4]],
    t0: 0.16, t1: 0.26, width0: 0.008, width1: 0.002, water0: 0.08, water1: 0.02, amount: 0.8, pigment: 0,
  });
  if (ctx.t > 0.24 && ctx.t < 0.4) {
    splat(ctx, { x: 0.48, y: 0.9, radius: 0.02 + (ctx.t - 0.24), amount: 0.6, water: 0.4, pigment: 0, vx: 0.2, vy: 0.1 });
  }
  if (ctx.t > 0.45) ctx.fade = 0.03;
}

function stepSlash(ctx: FxStep): void {
  ctx.diffuse = 0.03;
  ctx.evaporate = 1.1;
  const u = easeInOutSine(clamp01(ctx.t / 0.72));
  if (ctx.t > 0.8) {
    ctx.fade = 0.045;
    return;
  }
  const ang = -1.05 + u * 2.2;
  const x = 0.5 + inkCos(ang) * 0.22;
  const y = 0.5 + inkSin(ang) * 0.11;
  const tx = inkCos(ang + 1.5708);
  const ty = inkSin(ang + 1.5708);
  const belly = 1 - Math.abs(u - 0.42) * 1.7;
  const width = 0.007 + (belly > 0 ? belly * 0.018 : 0);
  for (let i = 0; i < 3; i++) {
    const along = (i - 1) * 0.018;
    splat(ctx, {
      x: x + tx * along,
      y: y + ty * along,
      radius: width * (i === 1 ? 1 : 0.45),
      amount: i === 1 ? 0.95 : 0.4,
      water: 0.05 + (1 - u) * 0.2,
      pigment: 0,
      vx: tx,
      vy: ty,
    });
  }
}

function stepScroll(ctx: FxStep): void {
  ctx.flow = 0;
}

function stepRipple(ctx: FxStep): void {
  ctx.diffuse = 0.4;
  ctx.evaporate = 0.35;
  ctx.flow = 0.15;
  if (ctx.t < 0.35) {
    const g = easeOutCubic(ctx.t / 0.35);
    splat(ctx, { x: 0.5, y: 0.5, radius: 0.012 + g * 0.02, amount: 0.7, water: 0.9, pigment: 0.5, vx: 0, vy: 0 });
  }
}

function stepCondense(ctx: FxStep): void {
  ctx.flow = 0.4;
  ctx.diffuse = 0.2;
  ctx.evaporate = 0.25;
  const pull = clamp01((ctx.t - 0.05) / 0.7);
  if (ctx.particles.length < 16) {
    for (let i = ctx.particles.length; i < 16; i++) {
      const ang = (i / 16) * TWO_PI + (i % 3) * 0.35;
      const rad = 0.1 + (i % 5) * 0.038;
      ctx.particles.push({
        x: 0.5 + inkCos(ang) * rad + ((i * 5) % 7) * 0.008 - 0.02,
        y: 0.52 + inkSin(ang) * rad * 0.8 + ((i * 3) % 5) * 0.01,
        vx: 0, vy: 0,
        radius: 0.007 + (i % 4) * 0.007,
        amount: 0.35 + (i % 3) * 0.15,
        water: 0.4 + (i % 2) * 0.3,
        pigment: 0,
        life: 2,
      });
    }
  }
  if (ctx.t > 0.72) {
    brush(ctx, {
      pts: [[0.42, 0.34], [0.4, 0.5], [0.46, 0.7], [0.58, 0.68], [0.6, 0.4], [0.5, 0.32]],
      t0: 0.74, t1: 0.92, width0: 0.008, width1: 0.004, water0: 0.15, water1: 0.05, amount: 0.9, pigment: 0,
    });
  }
  for (const p of ctx.particles) {
    const dx = 0.5 - p.x;
    const dy = 0.52 - p.y;
    p.vx = dx * (0.4 + pull * 1.6) + inkCos(ctx.time + p.x * 8) * 0.15 * (1 - pull);
    p.vy = dy * (0.4 + pull * 1.6) + inkSin(ctx.time + p.y * 8) * 0.15 * (1 - pull);
    p.x += p.vx * ctx.dt;
    p.y += p.vy * ctx.dt;
    splat(ctx, { x: p.x, y: p.y, radius: p.radius * (1 - pull * 0.4), amount: p.amount, water: p.water, pigment: 0, vx: p.vx, vy: p.vy });
  }
}

function stepAge(ctx: FxStep): void {
  ctx.age = easeOutCubic(ctx.t);
  ctx.diffuse = 0.08;
  ctx.evaporate = 0.2;
  brush(ctx, {
    pts: [[0.15, 0.45], [0.32, 0.36], [0.5, 0.42], [0.7, 0.32], [0.88, 0.4]],
    t0: 0, t1: 0.08, width0: 0.02, width1: 0.012, water0: 0.4, water1: 0.2, amount: 0.8, pigment: 0,
  });
  brush(ctx, {
    pts: [[0.2, 0.62], [0.35, 0.7], [0.48, 0.6]],
    t0: 0.02, t1: 0.12, width0: 0.014, width1: 0.006, water0: 0.35, water1: 0.15, amount: 0.7, pigment: 0,
  });
}

function stepFlock(ctx: FxStep): void {
  ctx.flow = 0.05;
}

function stepMap(ctx: FxStep): void {
  ctx.flow = 0.15;
  ctx.diffuse = 0.35;
  ctx.evaporate = 0.4;
  brush(ctx, {
    pts: [[0.15, 0.3], [0.32, 0.38], [0.48, 0.48], [0.6, 0.62], [0.78, 0.7]],
    t0: 0.08, t1: 0.4, width0: 0.008, width1: 0.006, water0: 0.7, water1: 0.45, amount: 0.55, pigment: 0.5,
  });
  brush(ctx, {
    pts: [[0.28, 0.28], [0.4, 0.24], [0.55, 0.3], [0.7, 0.22]],
    t0: 0.36, t1: 0.62, width0: 0.016, width1: 0.01, water0: 0.2, water1: 0.08, amount: 0.75, pigment: 0,
  });
  const towns: readonly (readonly [number, number])[] = [[0.34, 0.4], [0.52, 0.5], [0.66, 0.36]];
  towns.forEach(([x, y], i) => {
    const t0 = 0.64 + i * 0.08;
    if (ctx.t > t0 && ctx.t < t0 + 0.08) {
      splat(ctx, { x, y, radius: 0.012, amount: 0.9, water: 0.25, pigment: 0.25, vx: 0, vy: 0 });
    }
  });
  if (ctx.t > 0.5 && ctx.t < 0.85) {
    const g = easeOutCubic((ctx.t - 0.5) / 0.35);
    splat(ctx, { x: 0.46, y: 0.46, radius: 0.04 + g * 0.08, amount: 0.28, water: 0.8, pigment: 0.25, vx: 0, vy: 0 });
  }
}

function stepShock(ctx: FxStep): void {
  ctx.flow = 0.8;
  ctx.diffuse = 0.2;
  ctx.evaporate = 0.6;
  ctx.flash = ctx.t < 0.05 ? 0.35 : 0;
  if (ctx.t < 0.12) {
    splat(ctx, { x: 0.5, y: 0.52, radius: 0.02 + ctx.t, amount: 1, water: 0.4, pigment: 0, vx: 0, vy: 0 });
  }
  const rad = easeOutQuart(clamp01(ctx.t / 0.7)) * 0.4;
  if (ctx.t > 0.05 && ctx.t < 0.55 && ctx.rng.next() < 0.8) {
    const ang = ctx.rng.next() * TWO_PI;
    splat(ctx, {
      x: 0.5 + inkCos(ang) * rad,
      y: 0.52 + inkSin(ang) * rad * 0.85,
      radius: 0.008,
      amount: 0.45,
      water: 0.2,
      pigment: 0,
      vx: inkCos(ang),
      vy: inkSin(ang),
    });
  }
}

export const FX_SPECS: readonly FxSpec[] = [
  { id: 'drop', label: '墨滴晕开', use: '章节开场、受伤、菜单底', technique: '径向脉冲加切向卷须，湿扩散后蒸发冻住', duration: 4.5, loop: false, placeable: true, overlay: 0, step: stepDrop },
  { id: 'splash', label: '泼墨爆溅', use: '受击、暴击、确认', technique: '主墨团加幂律粒子，着纸后才给水', duration: 1.2, loop: false, placeable: true, overlay: 0, step: stepSplash },
  { id: 'wipe', label: '晕染转场', use: '场景切换、读档', technique: '多点注入扩散成遮罩，再从中心退潮', duration: 1.4, loop: false, placeable: false, overlay: 0, step: stepWipe },
  { id: 'title', label: '笔锋显字', use: '标题、章节名', technique: '笔顺回放，起笔顿、收笔飞白', duration: 3.4, loop: false, placeable: false, overlay: 0, step: stepTitle },
  { id: 'mist', label: '云雾出山', use: '开场、大地图', technique: '分层山脊噪声，雾阈值随时间下降', duration: 6, loop: true, placeable: false, overlay: 1, step: stepMist },
  { id: 'smoke', label: '墨烟云涌', use: '仙术、传送、乌云', technique: 'curl 平流持续注入', duration: 4, loop: true, placeable: true, overlay: 0, step: stepSmoke },
  { id: 'dissolve', label: '墨散成尘', use: '死亡、撤退、字幕消失', technique: '剪影被噪声吃掉，碎屑被风带走', duration: 1.6, loop: false, placeable: true, overlay: 10, step: stepDissolve },
  { id: 'reveal', label: '晕染显影', use: '立绘、图鉴', technique: '扩散被主体形状挡住，先灰后彩', duration: 2.6, loop: false, placeable: false, overlay: 9, step: stepReveal },
  { id: 'river', label: '墨浪江河', use: '江河、水战', technique: '断续水纹线加一笔浪头', duration: 4, loop: true, placeable: false, overlay: 2, step: stepRiver },
  { id: 'streak', label: '飞白疾扫', use: '标题底、快切', technique: '干笔条纹，末端分叉', duration: 0.9, loop: false, placeable: false, overlay: 0, step: stepStreak },
  { id: 'rain', label: '墨雨烟雨', use: '天气、离别', technique: '视差雨丝，落点写入密度场', duration: 4, loop: true, placeable: false, overlay: 11, step: stepRain },
  { id: 'seal', label: '朱砂印章', use: '落款、任务完成', technique: 'SDF 印面，按压过冲，纸纹吃色', duration: 0.7, loop: false, placeable: true, overlay: 3, anchorX: 0.68, anchorY: 0.62, step: stepSeal },
  { id: 'bamboo', label: '墨竹生长', use: '章节卡、加载', technique: '节、枝、叶按笔序回放', duration: 3.4, loop: false, placeable: false, overlay: 0, step: stepBamboo },
  { id: 'plum', label: '墨梅绽放', use: '冬景、登场', technique: '干枝之后逐瓣点朱', duration: 4, loop: false, placeable: false, overlay: 0, step: stepPlum },
  { id: 'flame', label: '墨焰', use: '火攻、烽火', technique: '上升卷曲的笔触，内朱外墨', duration: 3.2, loop: true, placeable: true, overlay: 0, step: stepFlame },
  { id: 'bolt', label: '墨雷闪电', use: '雷雨、惊变', technique: '闪白后干笔折线，落点泼溅', duration: 0.65, loop: false, placeable: true, overlay: 0, step: stepBolt },
  { id: 'slash', label: '刀光墨痕', use: '普通攻击、剑气', technique: '月牙笔触，刃口实、后缘飞白', duration: 0.42, loop: false, placeable: true, overlay: 0, step: stepSlash },
  { id: 'scroll', label: '卷轴展开', use: '书信、地图、圣旨', technique: '两端轴分开，纸面滞后显山', duration: 1.3, loop: false, placeable: false, overlay: 4, step: stepScroll },
  { id: 'ripple', label: '墨晕涟漪', use: '点击、踏水、雨点', technique: '断笔圆环，中心一小团湿墨', duration: 1.5, loop: false, placeable: true, overlay: 5, step: stepRipple },
  { id: 'condense', label: '墨聚成形', use: '登场、召唤', technique: '粒子沿剪影收拢，最后勾一笔边', duration: 2, loop: false, placeable: true, overlay: 13, step: stepCondense },
  { id: 'age', label: '墨褪纸旧', use: '回忆、旧地图', technique: '纸色走赭，水渍和断笔随 age 长出', duration: 4.5, loop: false, placeable: false, overlay: 8, step: stepAge },
  { id: 'flock', label: '墨鸟群飞', use: '空镜、季节', technique: '八只两笔鸟，远淡近浓', duration: 5, loop: true, placeable: false, overlay: 7, step: stepFlock },
  { id: 'map', label: '墨染舆图', use: '大地图、势力', technique: '河道先走，再皴山，最后点城', duration: 4, loop: false, placeable: false, overlay: 0, step: stepMap },
  { id: 'shock', label: '墨晕冲击波', use: '范围技能、落地', technique: '破碎墨环加径向残点', duration: 0.7, loop: false, placeable: true, overlay: 6, step: stepShock },
];
