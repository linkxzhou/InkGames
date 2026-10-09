/** Gameplay fixed step. 60 Hz, frame gap clamped to 0.08s, at most 4 steps. */

export const FIXED_DT = 1 / 60;
export const MAX_FRAME_SEC = 0.08;
export const MAX_FIXED_STEPS = 4;

export interface FixedClock {
  readonly accumulator: number;
  readonly steps: number;
  readonly alpha: number;
  /** True when leftover time was dropped because the catch-up cap was hit. */
  readonly capped: boolean;
}

/**
 * Advance the accumulator. When a fifth step would have run, the remainder is
 * dropped and alpha is 1 so the view snaps to the body instead of extrapolating.
 */
export function advanceFixedClock(accumulator: number, dt: number): FixedClock {
  const gap = Math.min(Math.max(dt, 0), MAX_FRAME_SEC);
  let acc = accumulator + gap;
  let steps = 0;
  while (acc >= FIXED_DT && steps < MAX_FIXED_STEPS) {
    acc -= FIXED_DT;
    steps += 1;
  }
  if (steps === MAX_FIXED_STEPS && acc >= FIXED_DT) {
    return { accumulator: 0, steps, alpha: 1, capped: true };
  }
  return { accumulator: acc, steps, alpha: acc / FIXED_DT, capped: false };
}
