import { describe, expect, it } from 'vitest';
import { poseAt, validatePresentation } from '../src/core/ink-presentation';
import { chaosPresentation, chaosShapes } from '../apps/history/chaos-data';

const valid = {
  format: 'inkgames.presentation', version: 1, id: 'demo', fps: 30, durationFrames: 300,
  canvas: { width: 1280, height: 720 },
  layers: [{ id: 'a', keys: [{ at: 0, x: 0, y: 0 }, { at: 100, x: 100, y: 50, scale: 2, opacity: 0 }] }],
};

describe('presentation data', () => {
  it('validates the authored chaos presentation', () => {
    const value = validatePresentation(chaosPresentation());
    expect(value.fps).toBe(30);
    expect(value.durationFrames).toBe(5400);
    expect(value.layers.map(layer => layer.id)).toContain('pangu');
  });
  it('rejects malformed presentations', () => {
    expect(() => validatePresentation({ ...valid, fps: 0 })).toThrow();
    expect(() => validatePresentation({ ...valid, format: 'other' })).toThrow();
    expect(() => validatePresentation({ ...valid, layers: [{ id: 'a', keys: [{ at: 5, x: 0, y: 0 }, { at: 5, x: 1, y: 1 }] }] })).toThrow();
    expect(() => validatePresentation({ ...valid, layers: [{ id: 'a', keys: [{ at: 0, x: 0, y: 0, opacity: 2 }] }] })).toThrow();
    expect(() => validatePresentation({ ...valid, layers: [{ id: 'a', keys: [{ at: 0, x: 0, y: 0 }] }, { id: 'a', keys: [{ at: 0, x: 0, y: 0 }] }] })).toThrow();
  });
  it('clamps and interpolates poses deterministically', () => {
    const layer = validatePresentation(valid).layers[0];
    if (!layer) throw new Error('missing layer');
    expect(poseAt(layer, -20)).toEqual({ x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    expect(poseAt(layer, 200)).toEqual({ x: 100, y: 50, scale: 2, rotation: 0, opacity: 0 });
    const mid = poseAt(layer, 50);
    expect(mid.x).toBeCloseTo(50);
    expect(mid.opacity).toBeCloseTo(.5);
    expect(poseAt(layer, 50)).toEqual(mid);
  });
  it('authors only unique shape ids inside the canvas budget', () => {
    const ids = chaosShapes().map(shape => shape.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const shape of chaosShapes()) {
      expect(shape.width).toBeGreaterThan(0);
      expect(shape.strokes.length).toBeGreaterThan(0);
    }
  });
  it('keeps impulses bound to declared layers', () => {
    const value = validatePresentation(chaosPresentation());
    expect(value.impulses.length).toBeGreaterThan(0);
    const ids = new Set(value.layers.map(layer => layer.id));
    for (const impulse of value.impulses) {
      expect(ids.has(impulse.layer)).toBe(true);
      expect(impulse.radius).toBeGreaterThan(0);
    }
    expect(() => validatePresentation({ ...valid, impulses: [{ layer: 'missing', at: 0, x: 0, y: 0, radius: 4 }] })).toThrow();
    expect(() => validatePresentation({ ...valid, impulses: [{ layer: 'a', at: 0, x: 0, y: 0, radius: 0 }] })).toThrow();
  });
  it('switches draw order at keys instead of interpolating it', () => {
    const layer = validatePresentation({
      ...valid,
      layers: [{ id: 'a', keys: [{ at: 0, x: 0, y: 0, order: 1 }, { at: 100, x: 0, y: 0, order: 9 }] }],
    }).layers[0];
    if (!layer) throw new Error('missing layer');
    expect(poseAt(layer, 0).order).toBe(1);
    expect(poseAt(layer, 50).order).toBe(1);
    expect(poseAt(layer, 100).order).toBe(9);
  });
});
