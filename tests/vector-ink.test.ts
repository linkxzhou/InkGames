import { describe, expect, it } from 'vitest';
import { compileVectorInk, parseVectorInk, scoreInkRgba, type VectorInkSheet } from '../src/core/vector-ink';
import chaos1 from '../assets/gallery/chaos-1.json';
import chaos2 from '../assets/gallery/chaos-2.json';
import chaos3 from '../assets/gallery/chaos-3.json';
import chaos4 from '../assets/gallery/chaos-4.json';
import chuhan from '../assets/gallery/chuhan.json';

function sheet(paths: VectorInkSheet['paths'], width = 100, height = 100): VectorInkSheet {
  return { format: 'inkgames.vector-ink', version: 1, id: 't', width, height, paths };
}

describe('vector ink', () => {
  it('parses lines, cubics and relative commands', () => {
    const parsed = parseVectorInk(sheet([
      { id: 'box', role: 'contour', color: 'black', d: 'M10 10 L 40 10 L 40 30 Z' },
      { id: 'rel', role: 'contour', color: 'dark_gray', d: 'm0 0 l 20 0 l 0 10 z' },
      { id: 'curve', role: 'wash', color: 'sage_gray', d: 'M0 0 C 10 20 20 20 30 0' },
    ]));
    expect(parsed.paths).toHaveLength(3);
    const strokes = compileVectorInk(parsed);
    const curve = strokes.find(stroke => stroke.color === 'sage_gray');
    expect(curve?.points[0]).toEqual({ x: 0, y: 0 });
    expect(curve?.points[curve.points.length - 1]?.x).toBeGreaterThan(25);
  });

  it('rejects arcs, bad roles and empty sheets', () => {
    expect(() => parseVectorInk(sheet([{ id: 'a', role: 'contour', color: 'black', d: 'M0 0 A 10 10 0 0 1 10 0' }]))).toThrow(/圆弧/);
    expect(() => parseVectorInk({ ...sheet([{ id: 'a', role: 'contour', color: 'black', d: 'M0 0 L 1 1' }]), format: 'other' })).toThrow(/格式/);
    expect(() => parseVectorInk(sheet([{ id: 'a', role: 'contour', color: 'black', d: 'M0 0 L 1 1' }, { id: 'a', role: 'contour', color: 'black', d: 'M0 0 L 2 2' }]))).toThrow(/重复/);
    expect(() => parseVectorInk(sheet([{ id: 'a', role: 'splash' as 'contour', color: 'black', d: 'M0 0 L 1 1' }]))).toThrow(/墨路/);
    expect(() => parseVectorInk(sheet([{ id: 'a', role: 'contour', color: 'nope' as 'black', d: 'M0 0 L 1 1' }]))).toThrow(/墨色/);
  });

  it('draws contours with flying-white pressure and keeps fills inside', () => {
    const strokes = compileVectorInk(sheet([
      { id: 'edge', role: 'contour', color: 'black', d: 'M10 50 L 90 50' },
      { id: 'mass', role: 'fill', color: 'dark_gray', layers: 2, d: 'M10 10 L 90 10 L 90 90 L 10 90 Z' },
      { id: 'hair', role: 'hatch', color: 'black', d: 'M5 20 L 95 20' },
    ]));
    const contour = strokes.filter(stroke => stroke.brush.effect === 'flyingWhite' && stroke.points.length > 4);
    expect(contour.length).toBeGreaterThan(0);
    const pressures = contour[0]?.points.map(point => point.pressure ?? -1) ?? [];
    expect(new Set(pressures).size).toBeGreaterThan(1);
    expect(Math.max(...pressures)).toBeLessThan(0.5);
    const fills = strokes.filter(stroke => stroke.brush.effect === 'wet' || stroke.brush.effect === 'effect4');
    expect(fills.length).toBeGreaterThanOrEqual(3);
    for (const stroke of fills) {
      for (const point of stroke.points) {
        expect(point.x).toBeGreaterThanOrEqual(8);
        expect(point.x).toBeLessThanOrEqual(92);
        expect(point.y).toBeGreaterThanOrEqual(8);
        expect(point.y).toBeLessThanOrEqual(92);
      }
    }
    const hatches = strokes.filter(stroke => stroke.brush.size === 'small');
    expect(hatches.length).toBeGreaterThan(2);
    const hatch = hatches[0];
    if (!hatch) throw new Error('missing hatch');
    const a = hatch.points[0];
    const b = hatch.points[hatch.points.length - 1];
    if (!a || !b) throw new Error('short hatch');
    expect(Math.abs(b.x - a.x)).toBeGreaterThan(Math.abs(b.y - a.y));
  });

  it('scales onto the plate and repeats exactly', () => {
    const parsed = parseVectorInk(sheet([{ id: 'edge', role: 'accent', color: 'wine_red', d: 'M0 0 L 100 0' }]));
    const once = compileVectorInk(parsed, { width: 50, height: 50 });
    const twice = compileVectorInk(parsed, { width: 50, height: 50 });
    expect(twice).toEqual(once);
    expect(once[0]?.points[0]).toEqual({ x: 0, y: 0 });
    expect(once[0]?.points[once[0].points.length - 1]?.x).toBe(50);
    expect(once[0]?.color).toBe('wine_red');
    expect(once[0]?.brush.effect).toBe('wet');
  });

  it('compiles the five gallery sheets with contour, fill and hatch', () => {
    for (const raw of [chaos1, chaos2, chaos3, chaos4, chuhan]) {
      const parsed = parseVectorInk(raw);
      const strokes = compileVectorInk(parsed, { width: 720, height: 720 });
      expect(strokes.length).toBeGreaterThan(24);
      expect(strokes.length).toBeLessThan(360);
      expect(strokes.some(stroke => stroke.brush.effect === 'flyingWhite')).toBe(true);
      expect(strokes.some(stroke => stroke.brush.effect === 'wet')).toBe(true);
      expect(strokes.some(stroke => stroke.brush.size === 'small')).toBe(true);
      expect(new Set(strokes.map(stroke => stroke.seed)).size).toBeGreaterThan(8);
    }
  });

  it('scores identical rasters as a perfect match and separates a blank', () => {
    const data = new Uint8Array(16 * 16 * 4);
    for (let i = 0; i < 16 * 16; i++) {
      data[i * 4] = i % 16 < 8 ? 20 : 210;
      data[i * 4 + 1] = 20;
      data[i * 4 + 2] = 20;
      data[i * 4 + 3] = 255;
    }
    const same = scoreInkRgba(data, data, 16, 16);
    expect(same.rgbMean).toBe(0);
    expect(same.ssim).toBeCloseTo(1);
    expect(same.edgeMean).toBe(0);
    const blank = new Uint8Array(16 * 16 * 4).fill(214);
    const diff = scoreInkRgba(data, blank, 16, 16);
    expect(diff.rgbMean).toBeGreaterThan(same.rgbMean);
    expect(diff.ssim).toBeLessThan(0.95);
    expect(diff.edgeMean).toBeGreaterThan(0);
  });
});
