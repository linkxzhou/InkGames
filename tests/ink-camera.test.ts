import { describe, expect, it } from 'vitest';
import { INK_LAYER_Z, inkCameraDistance, inkLayerScale } from '../src/core/ink-camera';
import { scanInkBites } from '../src/core/ink-metallic';
import { inkAtan2, inkCos, inkSin } from '../src/core/ink-random';

describe('分层镜头', () => {
  it('z = 0 是 1:1，正深度放大，负深度缩小', () => {
    const height = 720;
    const distance = height * Math.sqrt(3) / 2;
    expect(inkCameraDistance(height)).toBeCloseTo(distance, 8);
    expect(inkLayerScale(height, 0)).toBeCloseTo(1, 8);
    expect(inkLayerScale(height, INK_LAYER_Z.actor)).toBeCloseTo(distance / (distance - 40), 8);
    expect(inkLayerScale(height, INK_LAYER_Z.far)).toBeCloseTo(distance / (distance + 80), 8);
    expect(inkLayerScale(height, INK_LAYER_Z.actor)).toBeGreaterThan(1);
    expect(inkLayerScale(height, INK_LAYER_Z.far)).toBeLessThan(1);
  });
});

describe('虫蚀扫描', () => {
  it('同一张图、同一个种子，咬痕坐标不变', () => {
    const width = 80;
    const height = 80;
    const pixels = new Uint8Array(width * height * 4);
    pixels.fill(222);
    for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255;
    for (let y = 24; y < 56; y++) {
      for (let x = 24; x < 56; x++) {
        const i = (y * width + x) * 4;
        pixels[i] = 20;
        pixels[i + 1] = 20;
        pixels[i + 2] = 20;
      }
    }
    const once = scanInkBites(pixels, width, height, 0, 0, width, height, [222, 222, 222], 100, 10);
    const twice = scanInkBites(pixels, width, height, 0, 0, width, height, [222, 222, 222], 100, 10);
    expect(once.length).toBeGreaterThan(0);
    expect(twice.map(bite => [bite.x, bite.y, bite.vertices.length])).toEqual(
      once.map(bite => [bite.x, bite.y, bite.vertices.length]),
    );
  });
});

describe('多项式 atan2', () => {
  it('与库函数相差很小', () => {
    for (const [y, x] of [[0, 1], [1, 0], [1, 1], [-1, 1], [1, -1], [-2, -0.5]]) {
      expect(inkAtan2(y, x)).toBeCloseTo(Math.atan2(y, x), 3);
    }
    expect(inkSin(0.4)).toBeCloseTo(Math.sin(0.4), 8);
    expect(inkCos(0.4)).toBeCloseTo(Math.cos(0.4), 8);
  });
});
