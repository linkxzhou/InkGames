import { describe, expect, it } from 'vitest';
import { createInkFx, listInkFx } from '../src/fx/ink-fx';
import type { InkFxFrame } from '../src/fx/fx-types';

function run(id: string, seconds: number, speed = 1): InkFxFrame[] {
  const fx = createInkFx(id);
  fx.start({ speed, density: 1, pigment: -1 });
  const frames: InkFxFrame[] = [];
  const steps = Math.max(1, Math.round(seconds / (1 / 60)));
  for (let i = 0; i < steps; i++) frames.push(fx.update(1 / 60));
  return frames;
}

describe('ink motion fx', () => {
  it('lists all twenty-four effects in spec order', () => {
    const ids = listInkFx().map(item => item.id);
    expect(ids).toEqual([
      'drop', 'splash', 'wipe', 'title', 'mist', 'smoke', 'dissolve', 'reveal',
      'river', 'streak', 'rain', 'seal', 'bamboo', 'plum', 'flame', 'bolt',
      'slash', 'scroll', 'ripple', 'condense', 'age', 'flock', 'map', 'shock',
    ]);
  });

  it('starts at zero, reaches the end, and can restart', () => {
    const fx = createInkFx('ripple');
    expect(fx.progress).toBe(0);
    expect(fx.finished).toBe(false);
    fx.update(0.2);
    expect(fx.progress).toBeGreaterThan(0);
    const frames = run('ripple', 1.6);
    const last = createInkFx('ripple');
    last.start();
    for (let i = 0; i < 100; i++) last.update(1 / 60);
    expect(last.finished).toBe(true);
    expect(last.progress).toBe(1);
    last.start();
    expect(last.progress).toBe(0);
    expect(last.finished).toBe(false);
    expect(frames.length).toBeGreaterThan(10);
  });

  it('scales time with speed and survives dispose', () => {
    const slow = createInkFx('seal');
    const fast = createInkFx('seal');
    slow.start({ speed: 1 });
    fast.start({ speed: 2 });
    slow.update(0.1);
    fast.update(0.1);
    expect(fast.progress).toBeCloseTo(slow.progress * 2, 5);
    slow.dispose();
    slow.dispose();
    expect(slow.finished).toBe(true);
    expect(() => slow.update(0.1)).not.toThrow();
  });

  it('rejects an unknown effect', () => {
    expect(() => createInkFx('not-a-brush')).toThrow(/未知水墨特效/);
  });

  it('drops the ink lower as the bloom opens', () => {
    const early = run('drop', 0.05).at(-1);
    const later = run('drop', 0.45).at(-1);
    const earlyY = early?.splats[0]?.y ?? 1;
    const laterY = later?.splats[0]?.y ?? 0;
    expect(earlyY).toBeLessThan(0.4);
    expect(laterY).toBeGreaterThan(0.55);
  });

  it('throws the splash toward the attack', () => {
    const frames = run('splash', 0.18);
    let vx = 0;
    let n = 0;
    for (const frame of frames) {
      for (const splat of frame.splats) {
        if (splat.vx > 0.05) {
          vx += splat.vx;
          n += 1;
        }
      }
    }
    expect(n).toBeGreaterThan(4);
    expect(vx / n).toBeGreaterThan(0);
  });

  it('recedes the wipe after the cover', () => {
    const mid = run('wipe', 0.3).at(-1);
    const end = run('wipe', 1.25).at(-1);
    expect(mid?.recede ?? 1).toBe(0);
    expect(end?.recede ?? 0).toBeGreaterThan(0.5);
  });

  it('shakes the seal on impact and writes the title in order', () => {
    const beforeHit = run('seal', 0.1).at(-1);
    expect(beforeHit?.shake ?? 1).toBe(0);
    const seal = run('seal', 0.16).at(-1);
    expect(seal?.shake ?? 0).toBeGreaterThan(0.4);
    const before = run('title', 0.04).at(-1);
    const during = run('title', 0.5);
    expect(before?.splats.length ?? 1).toBe(0);
    expect(during.some(frame => frame.splats.length > 0)).toBe(true);
  });

  it('keeps every effect inside its lifetime', () => {
    for (const info of listInkFx()) {
      const fx = createInkFx(info.id);
      fx.start({ density: 0.5 });
      const steps = Math.ceil((info.duration + 0.1) * 60);
      for (let i = 0; i < steps; i++) {
        const frame = fx.update(1 / 60);
        expect(frame.splats.length).toBeLessThanOrEqual(16);
        for (const splat of frame.splats) {
          expect(Number.isFinite(splat.x + splat.y + splat.radius)).toBe(true);
        }
      }
      if (!info.loop) expect(fx.finished).toBe(true);
      else expect(fx.finished).toBe(false);
      fx.dispose();
    }
  });
});
