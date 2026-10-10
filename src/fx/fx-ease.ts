/** 笔和湿墨的时间曲线。只用乘法和已有的多项式正弦，避免在 CPU 上调用 Math.sin / Math.pow。 */
import { inkCos } from '../core/ink-random';

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function easeOutCubic(t: number): number {
  const u = 1 - clamp01(t);
  return 1 - u * u * u;
}

export function easeInQuad(t: number): number {
  const u = clamp01(t);
  return u * u;
}

export function easeOutQuart(t: number): number {
  const u = 1 - clamp01(t);
  const u2 = u * u;
  return 1 - u2 * u2;
}

export function easeInOutSine(t: number): number {
  return 0.5 - 0.5 * inkCos(Math.PI * clamp01(t));
}

/** 接近 easeOutExpo 的“先快后慢”，用 (1-t)^8，湿墨扩散够用。 */
export function easeOutExpo(t: number): number {
  const u = 1 - clamp01(t);
  const u2 = u * u;
  const u4 = u2 * u2;
  return 1 - u4 * u4;
}
