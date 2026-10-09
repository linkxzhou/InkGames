import { describe, expect, it } from 'vitest';
import { poseAt, validatePresentation } from '../src/core/ink-presentation';

const clipA = { x: 0, y: 0, width: 100, height: 100 };
const clipB = { x: 10, y: 10, width: 20, height: 20 };
const base = {
  format: 'inkgames.presentation', version: 1, id: 'clip', fps: 30, durationFrames: 200,
  canvas: { width: 1280, height: 720 },
  layers: [{ id: 'crack', keys: [
    { at: 0, x: 0, y: 0, clip: clipA },
    { at: 100, x: 0, y: 0, clip: clipB },
  ] }],
};

describe('layer clipping', () => {
  it('validates and keeps authored clip rectangles', () => {
    const layer = validatePresentation(base).layers[0];
    if (!layer) throw new Error('missing layer');
    expect(layer.keys[0]?.clip).toEqual(clipA);
    expect(layer.keys[1]?.clip).toEqual(clipB);
  });
  it('switches clips at the key instead of interpolating them', () => {
    const layer = validatePresentation(base).layers[0];
    if (!layer) throw new Error('missing layer');
    expect(poseAt(layer, 0).clip).toEqual(clipA);
    expect(poseAt(layer, 50).clip).toEqual(clipA);
    expect(poseAt(layer, 100).clip).toEqual(clipB);
    expect(poseAt(layer, 150).clip).toEqual(clipB);
  });
  it('rejects zero-sized clips', () => {
    expect(() => validatePresentation({ ...base, layers: [{ id: 'x', keys: [{ at: 0, x: 0, y: 0, clip: { x: 0, y: 0, width: 0, height: 10 } }] }] })).toThrow();
  });
});
