import { describe, expect, it } from 'vitest';
import { clampDropletCount, DROPLET_CAP } from '../src/core/bamboo-rig';
import { CLASSIC_NOISE_GLSL } from '../src/core/classic-noise';
import { cunOutlineWidth } from '../src/core/cun-material';
import { Playfield } from '../src/core/playfield';

describe('slice cpu helpers', () => {
  it('thickens the cun outline as the camera comes closer', () => {
    const far = cunOutlineWidth(600, 1400);
    const mid = cunOutlineWidth(600, 600);
    const near = cunOutlineWidth(600, 220);
    expect(near).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(far);
    expect(near).toBeLessThanOrEqual(7);
    expect(far).toBeGreaterThanOrEqual(1.2);
  });

  it('never spawns more than 256 ink droplets', () => {
    expect(clampDropletCount(400, 0)).toBe(DROPLET_CAP);
    expect(clampDropletCount(40, 250)).toBe(6);
    expect(clampDropletCount(10, DROPLET_CAP)).toBe(0);
  });

  it('keeps the classic Perlin license notice in the shader source', () => {
    expect(CLASSIC_NOISE_GLSL).toContain('Stefan Gustavson');
    expect(CLASSIC_NOISE_GLSL).toContain('MIT');
    expect(CLASSIC_NOISE_GLSL).toContain('float cnoise');
  });

  it('splits a washed bridge into two rigid pieces', () => {
    const field = new Playfield();
    const id = field.addBridge(200, 400, 120);
    expect(field.bridgePieces(id)).toBe(1);
    expect(field.washBridge(200, 400, 20)).toEqual([id]);
    expect(field.bridgePieces(id)).toBe(2);
    expect(field.bridgeLayout()).toHaveLength(2);
  });
});
