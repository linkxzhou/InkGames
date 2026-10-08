/**
 * p5.js-compatible seeded random and Perlin-style noise.
 * The inkEngine brush port draws from these in the same order as thirdparty/inkEngine, so a stroke
 * started from the same seed takes the same random decisions. Ported with attribution under the
 * owner-stated inkField authorization (see THIRD_PARTY_NOTICES.md).
 *
 * Sine and cosine are polynomials: src never calls Math.sin/cos (AGENTS.md), and the curves agree
 * with the library functions to about 1e-9, so p5's scaled-cosine noise and the brush offsets match.
 */

const M = 4294967296;
const A = 1664525;
const C = 1013904223;
const PI = 3.141592653589793;
const HALF_PI = 1.5707963267948966;
export const TWO_PI = 6.283185307179586;

/** sin(x) via range reduction and a degree-13 Taylor polynomial on [-π/2, π/2]. */
export function inkSin(x: number): number {
  let r = x - TWO_PI * Math.round(x / TWO_PI);
  if (r > HALF_PI) r = PI - r;
  else if (r < -HALF_PI) r = -PI - r;
  const r2 = r * r;
  return r * (1 + r2 * (-1 / 6 + r2 * (1 / 120 + r2 * (-1 / 5040 + r2 * (1 / 362880
    + r2 * (-1 / 39916800 + r2 * (1 / 6227020800)))))));
}

export function inkCos(x: number): number {
  return inkSin(x + HALF_PI);
}

/** p5 randomSeed()/random(): Numerical Recipes LCG, 2^32 modulus. */
export class P5Random {
  private state = 0;

  constructor(seed = 0) {
    this.seed(seed);
  }

  seed(value: number): void {
    this.state = value >>> 0;
  }

  /** [0, 1). A·state + C stays below 2^53, so the double arithmetic is exact like p5's. */
  next(): number {
    this.state = (A * this.state + C) % M;
    return this.state / M;
  }

  /** random() → [0,1); random(n) → [0,n); random(a, b) swaps when a > b, like p5. */
  random(min?: number, max?: number): number {
    const r = this.next();
    if (min === undefined) return r;
    if (max === undefined) return r * min;
    return min > max ? r * (min - max) + max : r * (max - min) + min;
  }
}

const YWRAPB = 4;
const YWRAP = 1 << YWRAPB;
const ZWRAPB = 8;
const ZWRAP = 1 << ZWRAPB;
const SIZE = 4095;
const OCTAVES = 4;
const FALLOFF = 0.5;

function scaledCosine(i: number): number {
  return 0.5 * (1 - inkCos(i * PI));
}

/** p5 noise()/noiseSeed() with the default 4 octaves and 0.5 falloff. */
export class P5Noise {
  private readonly perlin = new Float64Array(SIZE + 1);

  constructor(seed = 0) {
    this.seed(seed);
  }

  seed(value: number): void {
    const lcg = new P5Random(value);
    for (let i = 0; i <= SIZE; i++) this.perlin[i] = lcg.next();
  }

  noise(xIn: number, yIn = 0, zIn = 0): number {
    const perlin = this.perlin;
    let x = xIn < 0 ? -xIn : xIn;
    let y = yIn < 0 ? -yIn : yIn;
    let z = zIn < 0 ? -zIn : zIn;
    let xi = Math.floor(x);
    let yi = Math.floor(y);
    let zi = Math.floor(z);
    x -= xi;
    y -= yi;
    z -= zi;
    let r = 0;
    let ampl = 0.5;
    for (let o = 0; o < OCTAVES; o++) {
      let of = xi + (yi << YWRAPB) + (zi << ZWRAPB);
      const rxf = scaledCosine(x);
      const ryf = scaledCosine(y);
      let n1 = perlin[of & SIZE] ?? 0;
      n1 += rxf * ((perlin[(of + 1) & SIZE] ?? 0) - n1);
      let n2 = perlin[(of + YWRAP) & SIZE] ?? 0;
      n2 += rxf * ((perlin[(of + YWRAP + 1) & SIZE] ?? 0) - n2);
      n1 += ryf * (n2 - n1);
      of += ZWRAP;
      n2 = perlin[of & SIZE] ?? 0;
      n2 += rxf * ((perlin[(of + 1) & SIZE] ?? 0) - n2);
      let n3 = perlin[(of + YWRAP) & SIZE] ?? 0;
      n3 += rxf * ((perlin[(of + YWRAP + 1) & SIZE] ?? 0) - n3);
      n2 += ryf * (n3 - n2);
      n1 += scaledCosine(z) * (n2 - n1);
      r += n1 * ampl;
      ampl *= FALLOFF;
      xi <<= 1;
      x *= 2;
      yi <<= 1;
      y *= 2;
      zi <<= 1;
      z *= 2;
      if (x >= 1) { xi++; x--; }
      if (y >= 1) { yi++; y--; }
      if (z >= 1) { zi++; z--; }
    }
    return r;
  }
}

/** p5 map() without clamping. */
export function remap(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** x^0.6 by Newton's method on y^5 = x^3, so the pressure ladder avoids Math.pow. */
export function pow06(x: number): number {
  if (!(x > 0)) return 0;
  const target = x * x * x;
  let y = x < 1 ? 1 - 0.6 * (1 - x) : 1 + 0.6 * (x - 1);
  for (let i = 0; i < 40; i++) {
    const y4 = y * y * y * y;
    const next = y - (y4 * y - target) / (5 * y4);
    if (Math.abs(next - y) < 1e-12) return next;
    y = next;
  }
  return y;
}
