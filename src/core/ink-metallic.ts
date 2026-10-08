/**
 * inkEngine scanBugBites + createBugShape (the lightning silhouettes the demo actually draws).
 * When shapeType is omitted, createBugShape draws random(0, 2) and then overwrites it with
 * floor(random(2, 4)), so every bite is lightning or the wider lightning. Offsets are multiplied
 * by 0 in the original, so each bite sits on its target. Ported with attribution under the
 * owner-stated inkField authorization (THIRD_PARTY_NOTICES.md).
 *
 * Bite positions follow the same random calls only when the scanned pixels match. A few gray levels
 * of difference against inkEngine moves the darkest samples, and the shapes move with them.
 */

import { inkAtan2, inkCos, inkSin, P5Noise, P5Random, TWO_PI } from './ink-random';

const PI = 3.141592653589793;
const HALF_PI = 1.5707963267948966;

export interface InkBite {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly size: number;
  /** Offsets from (x, y), one closed outline, as drawBugShape would stroke it. */
  readonly vertices: readonly { readonly x: number; readonly y: number }[];
}

interface Sample { readonly x: number; readonly y: number; readonly brightness: number }

interface BranchConfig {
  readonly branchAngle: number;
  readonly branchOffsetX: number;
  readonly branchOffsetY: number;
  readonly numLRand: number;
  readonly numStepsRand: number;
  readonly stepSize: number;
  readonly noiseScale: number;
  readonly noiseStrength: number;
  readonly thickness: number;
  readonly stepRandoms: readonly { readonly stepVariation: number; readonly subBranchRand: number; readonly subBranchLengthRand: number; readonly subBranchAngle: number }[];
  readonly thicknessRandoms: readonly number[];
}

/**
 * Dark pixels inside `frame` (top-left origin, the rectangle that was read), step 4, margin 20,
 * brightness r+g+b < 700, channel delta from the canvas background > 80, alpha > 100.
 * Ten targets, weighted toward the darkest, then 2–5 bites each.
 */
export function scanInkBites(
  pixels: Uint8Array | Uint8ClampedArray,
  frameWidth: number,
  frameHeight: number,
  frameX: number,
  frameY: number,
  sheetWidth: number,
  sheetHeight: number,
  background: readonly [number, number, number],
  seed: number,
  bugsSize = 10,
  tint: readonly [number, number, number] = [0.72, 0.5, 0.35],
): InkBite[] {
  const margin = 20;
  const found: Sample[] = [];
  const step = 4;
  const x0 = Math.max(margin, frameX);
  const y0 = Math.max(margin, frameY);
  const x1 = Math.min(sheetWidth - margin, frameX + frameWidth);
  const y1 = Math.min(sheetHeight - margin, frameY + frameHeight);
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const local = ((y - frameY) * frameWidth + (x - frameX)) * 4;
      const r = pixels[local] ?? 255;
      const g = pixels[local + 1] ?? 255;
      const b = pixels[local + 2] ?? 255;
      const a = pixels[local + 3] ?? 255;
      const brightness = r + g + b;
      const delta = Math.abs(r - background[0]) + Math.abs(g - background[1]) + Math.abs(b - background[2]);
      if (a > 100 && brightness < 700 && delta > 80) found.push({ x, y, brightness });
    }
  }
  if (found.length < 10) return [];
  found.sort((p, q) => p.brightness - q.brightness);
  const rng = new P5Random(seed);
  const pool = found.slice(0, Math.max(Math.floor(found.length * 0.5), 10));
  const targets: Sample[] = [];
  for (let i = 0; i < 10 && pool.length > 0; i++) {
    let total = 0;
    const weights: number[] = [];
    for (let j = 0; j < pool.length; j++) {
      const w = 1 - j / pool.length;
      const weight = w * w;
      weights.push(weight);
      total += weight;
    }
    let pick = rng.random(0, total);
    let index = 0;
    for (let j = 0; j < weights.length; j++) {
      pick -= weights[j] ?? 0;
      if (pick <= 0) { index = j; break; }
    }
    const chosen = pool.splice(index, 1)[0];
    if (chosen) targets.push(chosen);
  }
  const bites: InkBite[] = [];
  const dark = tint[0] < 0.2 && tint[1] < 0.15 && tint[2] < 0.1;
  for (const target of targets) {
    const numBites = Math.floor(rng.random(2, 5));
    const looks: { readonly colorRand1: number; readonly colorRand2: number; readonly colorRand3: number; readonly shapeSeedRand: number }[] = [];
    for (let bite = 0; bite < numBites; bite++) {
      // Thirty placement samples. The offset is multiplied by 0, so the values are only drawn.
      for (let k = 0; k < 30; k++) {
        rng.random(0, 1);
        rng.random(0, TWO_PI);
        rng.random(-0.25, 0.25);
      }
      const colorRand1 = rng.random(0, 1);
      const colorRand2 = rng.random(0, 1);
      const colorRand3 = rng.random(0, 1);
      // sizeRand1..3 are drawn by the original even though this path never reads them.
      rng.random(0, 1);
      rng.random(0, 1);
      rng.random(0, 1);
      looks.push({ colorRand1, colorRand2, colorRand3, shapeSeedRand: rng.random(0, 10000) });
    }
    for (let bite = 0; bite < numBites; bite++) {
      const look = looks[bite];
      if (!look) continue;
      // The original multiplies the offset by 0, so the bite is the target point.
      const sx = clamp(Math.floor(target.x), margin, sheetWidth - margin);
      const sy = clamp(Math.floor(target.y), margin, sheetHeight - margin);
      const shapeSeed = Math.floor(target.x * 1000 + target.y * 333 + look.shapeSeedRand);
      const vertices = lightningOutline(rng, bugsSize, shapeSeed);
      const r = dark ? Math.floor(38 + look.colorRand1 * (51 - 38)) : 230 + look.colorRand1 * (255 - 230);
      const g = dark ? Math.floor(31 + look.colorRand2 * (38 - 31)) : 160 + look.colorRand2 * (220 - 160);
      const b = dark ? Math.floor(20 + look.colorRand3 * (26 - 20)) : 0;
      bites.push({ x: sx, y: sy, r, g, b, size: bugsSize, vertices });
    }
  }
  return bites;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** createBugShape's discarded draw, then lightning or the wider lightning, reseeding like p5.randomSeed. */
function lightningOutline(rng: P5Random, size: number, shapeSeed: number): { x: number; y: number }[] {
  rng.random(0, 2);
  const shapeType = Math.floor(rng.random(2, 4));
  rng.seed(shapeSeed);
  const noise = new P5Noise(shapeSeed);
  return shapeType === 2 ? lightning(rng, noise, size, shapeSeed, false) : lightning(rng, noise, size * 3, shapeSeed, true);
}

function lightning(rng: P5Random, noise: P5Noise, size: number, seed: number, alt: boolean): { x: number; y: number }[] {
  const preCount = alt ? 3 : 2;
  const stepSlots = alt ? 75 : 30;
  const thickSlots = alt ? 800 : 300;
  const branches = Math.floor(rng.random(alt ? 1 : 1, alt ? 4 : 3));
  const configs: BranchConfig[] = [];
  for (let i = 0; i < preCount; i++) {
    const branchAngle = rng.random(0, TWO_PI);
    const branchOffsetX = rng.random(-size * 0.2, size * 0.2);
    const branchOffsetY = rng.random(-size * 0.2, size * 0.2);
    const numLRand = rng.random(0, 1);
    const numStepsRand = rng.random(5, 15);
    const stepSize = size * rng.random(0.2, 0.35);
    const noiseScale = rng.random(0.1, 0.2) * (alt ? 0.5 : 1);
    const noiseStrength = rng.random(0.2, 0.4) * (alt ? 0.5 : 1);
    const thickness = size * rng.random(0.5, 0.7) * (alt ? 0.3 : 1);
    const stepRandoms = [];
    for (let step = 0; step < stepSlots; step++) {
      stepRandoms.push({
        stepVariation: rng.random(0.7, 1.3),
        subBranchRand: rng.random(),
        subBranchLengthRand: rng.random(3, 8),
        subBranchAngle: rng.random(-PI / 3, PI / 3),
      });
    }
    const thicknessRandoms = [];
    for (let t = 0; t < thickSlots; t++) thicknessRandoms.push(rng.random(0.9, 1.1));
    configs.push({
      branchAngle, branchOffsetX, branchOffsetY, numLRand, numStepsRand, stepSize,
      noiseScale, noiseStrength, thickness, stepRandoms, thicknessRandoms,
    });
  }
  const vertices: { x: number; y: number }[] = [];
  for (let b = 0; b < branches; b++) {
    const cfg = configs[b];
    if (!cfg) continue;
    const copies = cfg.numLRand > 0.2 ? 1 : (alt ? 5 : 2);
    const steps = Math.floor(cfg.numStepsRand) * copies;
    const path: { x: number; y: number }[] = [{ x: cfg.branchOffsetX, y: cfg.branchOffsetY }];
    let x = cfg.branchOffsetX;
    let y = cfg.branchOffsetY;
    let angle = cfg.branchAngle;
    for (let step = 0; step < steps; step++) {
      const roll = cfg.stepRandoms[step];
      if (!roll) break;
      const n1 = noise.noise(step * cfg.noiseScale, seed * 0.01);
      noise.noise(step * cfg.noiseScale + 100, seed * 0.01);
      angle += (n1 - 0.5) * PI * cfg.noiseStrength;
      const travel = cfg.stepSize * roll.stepVariation;
      x += inkCos(angle) * travel;
      y += inkSin(angle) * travel;
      path.push({ x, y });
      if (roll.subBranchRand < 0.1 && step > 3 && step < steps - 3) {
        const length = Math.floor(roll.subBranchLengthRand);
        const sub = angle + roll.subBranchAngle;
        let sx = x;
        let sy = y;
        for (let k = 0; k < length; k++) {
          const n = noise.noise(step * cfg.noiseScale + k * 0.5, seed * 0.01 + 200);
          const heading = sub + (n - 0.5) * PI * 0.5;
          sx += inkCos(heading) * cfg.stepSize * 0.6;
          sy += inkSin(heading) * cfg.stepSize * 0.6;
          path.push({ x: sx, y: sy });
        }
      }
    }
    const left: { x: number; y: number }[] = [];
    const right: { x: number; y: number }[] = [];
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const prev = path[i - 1];
      const next = path[i + 1];
      if (!point) continue;
      let normal: number;
      if (i === 0 && next) normal = inkAtan2(next.y - point.y, next.x - point.x) + HALF_PI;
      else if (i === path.length - 1 && prev) normal = inkAtan2(point.y - prev.y, point.x - prev.x) + HALF_PI;
      else if (prev && next) {
        const a = inkAtan2(point.y - prev.y, point.x - prev.x);
        const c = inkAtan2(next.y - point.y, next.x - point.x);
        normal = (a + c) / 2 + HALF_PI;
      } else normal = 0;
      const along = 0.5 + 0.5 * inkSin((i / path.length) * PI);
      const jitter = cfg.thicknessRandoms[Math.min(i, cfg.thicknessRandoms.length - 1)] ?? 1;
      const half = cfg.thickness * along * jitter / 2;
      left.push({ x: point.x + inkCos(normal) * half, y: point.y + inkSin(normal) * half });
      right.push({ x: point.x - inkCos(normal) * half, y: point.y - inkSin(normal) * half });
    }
    vertices.push(...left);
    for (let i = right.length - 1; i >= 0; i--) {
      const v = right[i];
      if (v) vertices.push(v);
    }
  }
  return vertices;
}
