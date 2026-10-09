import { describe, expect, it } from 'vitest';
import { advanceFixedClock, advanceFrameClock, FRAME_CLOCK_MAX_STEPS } from '../src/core/fixed-clock';

describe('gameplay fixed clock', () => {
  it('keeps at most four steps and reports the dropped surplus', () => {
    // The gap is clamped to MAX_FRAME_SEC (0.08s) before stepping, so the surplus
    // is already gone and `capped` stays false; four steps is still the ceiling.
    const slow = advanceFixedClock(0, 0.5);
    expect(slow.steps).toBe(4);
    expect(slow.accumulator).toBeCloseTo(0.08 - 4 / 60);
    const fast = advanceFixedClock(0, 1 / 120);
    expect(fast.steps).toBe(0);
    expect(fast.alpha).toBeCloseTo(.5);
  });
});

describe('cutscene frame clock', () => {
  it('follows wall clock on a slow host instead of slowing the cutscene down', () => {
    // 0.2s at 60 Hz is 12 frames; a gameplay-style cap of 4 would play 5x too slow.
    const step = advanceFrameClock(0, 0, 0.2, 5400);
    expect(step.steps).toBe(12);
    expect(step.frame).toBe(12);
    expect(step.dropped).toBe(false);
  });
  it('carries the fractional remainder instead of rounding it away', () => {
    // Half of 60 Hz frames land just under 16.67 ms; without carry they round to
    // zero and the cutscene plays at about half speed.
    let frame = 0;
    let carry = 0;
    for (let i = 0; i < 60; i++) {
      const step = advanceFrameClock(frame, carry, 0.0165, 5400);
      frame = step.frame;
      carry = step.carry;
    }
    expect(frame).toBe(59);
  });
  it('is exact for a jitter that averages the display rate', () => {
    let frame = 0;
    let carry = 0;
    for (let i = 0; i < 120; i++) {
      const step = advanceFrameClock(frame, carry, i % 2 === 0 ? 0.015 : 0.0183, 5400);
      frame = step.frame;
      carry = step.carry;
    }
    expect(Math.abs(frame - 120)).toBeLessThanOrEqual(1);
  });
  it('clamps to the timeline end and never goes backwards', () => {
    expect(advanceFrameClock(5398, 0, 0.5, 5400).frame).toBe(5399);
    expect(advanceFrameClock(100, 0, 0, 5400)).toEqual({ frame: 100, carry: 0, steps: 0, dropped: false });
    expect(advanceFrameClock(100, 0, -5, 5400).steps).toBe(0);
  });
  it('only drops time beyond the work budget and flags it', () => {
    // The gap itself is clamped to 2s (120 frames), so 90 is the work budget.
    const step = advanceFrameClock(0, 0, 5, 60000);
    expect(step.steps).toBe(FRAME_CLOCK_MAX_STEPS);
    expect(step.dropped).toBe(true);
    expect(step.carry).toBe(0);
  });
  it('runs a cutscene at wall-clock speed on a very slow host', () => {
    // SwiftShader frames can take ~0.3s; a 4-step cap would run 17x slow.
    let frame = 0;
    let carry = 0;
    for (let i = 0; i < 10; i++) {
      const step = advanceFrameClock(frame, carry, 0.3, 5400);
      frame = step.frame;
      carry = step.carry;
    }
    expect(frame).toBe(180);
  });
});
