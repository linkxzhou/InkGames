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

/** Frame-clock budgets: a cutscene keeps wall-clock time unless work overruns. */
export const FRAME_CLOCK_MAX_GAP_SEC = 2;
export const FRAME_CLOCK_MAX_STEPS = 90;

export interface FrameStep {
  readonly frame: number;
  /** Fractional frame carried to the next call so time is never lost to rounding. */
  readonly carry: number;
  /** Frames of timeline consumed this host frame; may be more than one. */
  readonly steps: number;
  /** True when the gap exceeded the work budget and the surplus was dropped. */
  readonly dropped: boolean;
}

/**
 * Advance a 60 Hz frame timeline by real elapsed time.
 *
 * Unlike `advanceFixedClock`, this does not cap at a few steps per host frame: a
 * slow host runs several steps to stay on the wall clock, which is what a
 * cutscene needs. The fractional remainder is carried, otherwise a display that
 * delivers slightly less than 16.67 ms per callback would round down to zero on
 * roughly half of them and the cutscene would play at half speed.
 */
export function advanceFrameClock(frame: number, carry: number, dt: number, durationFrames: number, budget = FRAME_CLOCK_MAX_STEPS): FrameStep {
  const gap = Math.min(Math.max(dt, 0), FRAME_CLOCK_MAX_GAP_SEC);
  const total = Math.max(carry, 0) + gap / FIXED_DT;
  const wanted = Math.floor(total + 1e-9);
  const steps = Math.min(wanted, Math.max(budget, 0));
  const limit = Math.max(durationFrames - 1, 0);
  const next = Math.min(frame + steps, limit);
  const dropped = wanted > steps;
  // At the end of the timeline the excess is dropped rather than carried forever.
  const rest = dropped || next >= limit ? 0 : total - wanted;
  return { frame: next, carry: Math.max(rest, 0), steps, dropped };
}
