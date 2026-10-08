import { Application } from 'pixi.js';
import { INK_BLACK, INK_INDIGO, InkWash, type InkStrokeStyle } from '@inkgames/engine';

export interface CompareStroke {
  readonly points: ReadonlyArray<readonly [number, number]>;
  readonly brush: { readonly mode: string; readonly size: string | number; readonly effect: number };
  readonly pigment: readonly [number, number, number];
  readonly color: string;
}

const strokes: CompareStroke[] = [
  {
    points: Array.from({ length: 22 }, (_, i) => [70 + i * 16, 150 + (i % 3) * 3] as const),
    brush: { mode: 'brush', size: 'large', effect: 0 },
    pigment: [0.07, 0.07, 0.08],
    color: 'black',
  },
  {
    points: curve(90, 300, 320, 210, 680, 360, 26),
    brush: { mode: 'brush', size: 'large', effect: 0 },
    pigment: [0.1, 0.16, 0.32],
    color: 'blue_dark',
  },
  {
    points: Array.from({ length: 16 }, (_, i) => [480 + i * 18, 90 + i * 12] as const),
    brush: { mode: 'brush', size: 'medium', effect: 2 },
    pigment: [0.07, 0.07, 0.08],
    color: 'black',
  },
];

const mount = document.querySelector<HTMLElement>('#mount');
if (!mount) throw new Error('Missing compare mount');
const app = new Application();
await app.init({ width: 800, height: 600, preference: 'webgl', autoStart: false, backgroundColor: 0xdedede, antialias: false, resolution: 1 });
mount.appendChild(app.canvas);
const wash = new InkWash(app, { width: 800, height: 600, scale: 1, seed: 1234567890, paper: 'neutral' });
app.stage.addChild(wash.view);
for (const stroke of strokes) {
  const style: InkStrokeStyle = {
    mode: 'brush',
    size: stroke.brush.size === 'medium' ? 1 : 2,
    effect: stroke.brush.effect === 2 ? 'flyingWhite' : 'mix',
    pigment: stroke.pigment[2] > 0.2 ? INK_INDIGO : INK_BLACK,
    seed: 1234567890,
  };
  // The second stroke carries its own indigo; don't collapse it into INK_BLACK.
  const pigment = { r: stroke.pigment[0], g: stroke.pigment[1], b: stroke.pigment[2] };
  wash.strokePath(stroke.points.map(([x, y]) => ({ x, y })), { ...style, pigment }, 'erasable', 22);
}
app.render();

declare global {
  interface Window {
    __compareReady?: boolean;
    __compareStrokes?: CompareStroke[];
  }
}
window.__compareStrokes = strokes;
window.__compareReady = true;

function curve(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, steps: number): Array<readonly [number, number]> {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    points.push([u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1] as const);
  }
  return points;
}
