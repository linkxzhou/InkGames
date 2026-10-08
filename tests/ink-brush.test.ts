import { describe, expect, it } from 'vitest';
import { INK_BRUSH_MODES, INK_SIZES, InkBrushEngine, type InkBrushMode, type InkDrawOp } from '../src/core/ink-brush';
import { inkCos, inkSin, P5Noise, P5Random, pow06 } from '../src/core/ink-random';
import { INK_PALETTE, inkColorId } from '../src/core/ink-palette';

/** Pointer path from (80,60) to (700,60) in 40 frames, the stroke used to check the port against inkEngine. */
function trace(mode: InkBrushMode, size: 'medium' | 'large' = 'large', seed = 100): { strokeSeed: number; counts: number[]; ops: InkDrawOp[][] } {
  const engine = new InkBrushEngine();
  engine.configure({ mode, size, effect: 'mix', blend: 'mix' });
  engine.setColor('black');
  const n = 40;
  const points = Array.from({ length: n }, (_, i) => ({ x: 80 + (620 * i) / (n - 1), y: 60 }));
  const first = points[0]!;
  engine.press(first.x, first.y, seed);
  const ops: InkDrawOp[][] = [];
  let previous = first;
  for (const point of points) {
    ops.push([...engine.frame(true, Math.round(point.x * 100) / 100, point.y, previous.x, previous.y).ops]);
    previous = point;
  }
  return { strokeSeed: engine.shaderState().strokeSeed, counts: ops.map(frame => frame.filter(op => op.kind === 'line').length), ops };
}

describe('p5 兼容的随机与噪声', () => {
  it('LCG 与 p5 randomSeed 的序列一致', () => {
    const rng = new P5Random(100);
    // p5: randomSeed(100); random() → (1664525·100 + 1013904223) mod 2^32 / 2^32
    expect(rng.next()).toBeCloseTo((1664525 * 100 + 1013904223) / 4294967296, 12);
    expect(new P5Random(7).random(5, 1)).toBeGreaterThanOrEqual(1);
  });

  it('多项式正余弦与 Math 版本相差不到 1e-8', () => {
    for (let x = -20; x <= 20; x += 0.37) {
      expect(Math.abs(inkSin(x) - Math.sin(x))).toBeLessThan(1e-8);
      expect(Math.abs(inkCos(x) - Math.cos(x))).toBeLessThan(1e-8);
    }
    expect(pow06(5)).toBeCloseTo(5 ** 0.6, 9);
  });

  it('噪声在 [0, 1) 内且可复现', () => {
    const a = new P5Noise(42);
    const b = new P5Noise(42);
    for (let i = 0; i < 50; i++) {
      const v = a.noise(i * 0.13, i * 0.07);
      expect(v).toBe(b.noise(i * 0.13, i * 0.07));
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('inkEngine 笔刷移植', () => {
  it('面板取值与 inkEngine/index.html 一致', () => {
    expect(INK_BRUSH_MODES).toEqual({ brush: 1, marker: 2, gothic: 3, pen: 4, dots: 5, fly: 6, brushSP: 7 });
    expect(INK_SIZES.large).toBe(2);
    expect(INK_SIZES.huge).toBe(10);
    expect(INK_PALETTE).toHaveLength(36);
    expect(inkColorId('blue_dark')).toBe(9);
    expect(inkColorId('red')).toBe(30);
  });

  it('同一种子得到同一组笔触', () => {
    expect(trace('brush').ops).toEqual(trace('brush').ops);
    expect(trace('brush', 'large', 101).ops).not.toEqual(trace('brush').ops);
  });

  // inkEngine (thirdparty/inkEngine) with p.randomSeed(100) before this stroke reports strokeSeed 347340893
  // and these per-frame line counts once its dashed cursor-path overlay is subtracted. Checked in
  // headless Chromium on 2026-10-08; see docs/12.
  it('笔锋随机流与 inkEngine 对齐（大笔、哥特、小笔）', () => {
    const brush = trace('brush');
    expect(brush.strokeSeed).toBe(347340893);
    expect(brush.counts.slice(0, 12)).toEqual([11, 5, 35, 21, 134, 120, 123, 108, 125, 124, 126, 118]);
    expect(trace('gothic', 'medium').counts.slice(0, 12)).toEqual([0, 9, 16, 21, 24, 27, 28, 29, 40, 46, 54, 57]);
    expect(trace('marker').counts.slice(0, 12)).toEqual([0, 0, 0, 0, 0, 27, 28, 22, 19, 25, 24, 22]);
    expect(trace('fly').counts.slice(0, 8)).toEqual([17, 23, 42, 42, 59, 68, 68, 58]);
  });

  it('笔尖弹簧阻尼：落在指针左上 10px，且不会一帧跳到指针', () => {
    const { ops } = trace('brush');
    const lines = ops.flat().filter(op => op.kind === 'line');
    expect(Math.min(...lines.map(op => op.y0))).toBeGreaterThan(30);
    expect(Math.max(...lines.map(op => op.y0))).toBeLessThan(70);
    expect(Math.max(...(ops[2] ?? []).map(op => op.x0))).toBeLessThan(120);
  });

  it('速写笔只撒点，小笔会盖白底再描边', () => {
    const pen = trace('pen').ops.flat();
    expect(pen.length).toBeGreaterThan(0);
    expect(pen.every(op => op.kind === 'dot')).toBe(true);
    const marker = trace('marker').ops.flat();
    expect(marker.some(op => op.kind === 'rect')).toBe(true);
  });
});
