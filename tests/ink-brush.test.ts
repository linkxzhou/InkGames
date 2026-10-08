import { describe, expect, it } from 'vitest';
import { InkBrush, strokeSegments } from '../src/core/ink-brush';

const style = { mode: 'brush' as const, size: 1.5, effect: 'mix' as const, seed: 42 };

describe('水墨笔尖', () => {
  it('同一种子和路径得到同一组笔毫', () => {
    const points = [{ x: 40, y: 80 }, { x: 70, y: 78 }, { x: 110, y: 90 }, { x: 150, y: 84 }];
    expect(strokeSegments(points, style)).toEqual(strokeSegments(points, style));
  });

  it('弹簧笔尖不会在一个采样里跳到指针上', () => {
    const brush = new InkBrush(style);
    brush.begin({ x: 0, y: 0 });
    const marks = brush.sample({ x: 80, y: 0 });
    expect(marks.length).toBeGreaterThan(0);
    const last = marks[marks.length - 1];
    expect(last).toBeDefined();
    expect(last!.x1).toBeGreaterThan(0);
    expect(last!.x1).toBeLessThan(80);
  });

  it('飞白在快速运笔时会丢掉一部分笔毫', () => {
    const points = [];
    for (let i = 0; i <= 12; i++) points.push({ x: i * 24, y: 40 });
    const solid = strokeSegments(points, style);
    const dry = strokeSegments(points, { ...style, effect: 'flyingWhite', seed: 7 });
    expect(solid.length).toBeGreaterThan(dry.length);
  });
});