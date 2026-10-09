import { Application } from 'pixi.js';
import { Container } from 'pixi.js';
import {
  INK_BLENDS, INK_BRUSH_MODES, INK_EFFECTS, INK_LAYER_Z, InkWash, inkLayerScale, inkPointerPath,
  type InkBrushMode, type InkColorName, type InkFinish, type InkPoint, type PropPaintingId, type PropStroke,
} from '@inkgames/engine';
import { compareSheet, PROPS } from './strokes';

/** A stroke in inkEngine API terms: what the host page passes to setBrush / setColor / strokePath. */
interface EngineStroke {
  readonly part: string;
  readonly brush: { readonly mode: number; readonly size: string | number; readonly effect: number; readonly blend: number };
  readonly color: InkColorName;
  readonly points: readonly InkPoint[];
  readonly seed: number;
  readonly finish?: InkFinish;
}

interface CompareScene {
  readonly width: number;
  readonly height: number;
  readonly background: readonly [number, number, number];
  readonly seed: number;
  readonly strokes: readonly EngineStroke[];
  /** When set, inkEngine should draw finalOut at this depth (p5 z, positive toward the camera). */
  readonly cameraZ?: number;
}

declare global {
  interface Window {
    __compareReady?: boolean;
    __compareScene?: CompareScene;
  }
}

function toEngine(stroke: PropStroke): EngineStroke {
  return {
    part: stroke.part,
    brush: {
      mode: INK_BRUSH_MODES[stroke.brush.mode],
      size: stroke.brush.size,
      effect: INK_EFFECTS[stroke.brush.effect],
      blend: INK_BLENDS[stroke.brush.blend],
    },
    color: stroke.color,
    points: inkPointerPath(stroke.points, stroke.brush.mode as InkBrushMode),
    seed: stroke.seed,
    ...(stroke.finish ? { finish: stroke.finish } : {}),
  };
}

const query = new URLSearchParams(location.search);
const sheet = compareSheet(location.search);
const id: PropPaintingId = sheet.id;
const nav = document.querySelector<HTMLElement>('#props');
for (const prop of PROPS) {
  const link = document.createElement('a');
  link.href = `?prop=${prop}`;
  link.textContent = prop;
  nav?.appendChild(link);
}
const caption = document.querySelector<HTMLElement>('#caption');
if (caption) caption.textContent = `InkGames 水墨层 · ${id} · 笔刷来自 PROP_BRUSHES，与 inkEngine 宿主页用同一组指针路径和种子`;

const scene = query.get('scene');
const modes = scene === 'modes';
const camera = sheet.camera;
const mount = document.querySelector<HTMLElement>('#mount');
if (!mount) throw new Error('Missing compare mount');
const width = sheet.width;
const height = sheet.height;
const background = sheet.background;
const seed = sheet.seed;
const app = new Application();
await app.init({ width, height, preference: 'webgl', autoStart: false, antialias: false, resolution: 1, backgroundColor: 0x222222 });
mount.appendChild(app.canvas);
const wash = new InkWash(app, { width, height, seed, background, paper: true });
const strokes = sheet.strokes;
for (const stroke of strokes) wash.paint(stroke);
if (camera) {
  // The whole painting sits on finalOut. inkEngine draws that buffer at layerZ[0]; here that depth is the actor plane.
  const scale = inkLayerScale(height, INK_LAYER_Z.actor);
  const rig = new Container();
  rig.pivot.set(width / 2, height / 2);
  rig.scale.set(scale);
  rig.position.set(width / 2, height / 2);
  rig.addChild(wash.view);
  app.stage.addChild(rig);
} else {
  app.stage.addChild(wash.view);
}
app.render();
if (caption) {
  if (modes) caption.textContent = 'InkGames 水墨层 · inkEngine 七种笔刷，同一指针路径与种子';
  else if (scene === 'flow') caption.textContent = 'InkGames 水墨层 · flow，blend 0，4 次迭代';
  else if (scene === 'distort') caption.textContent = 'InkGames 水墨层 · distort，整幅，displacement 20 / 50';
  else if (scene === 'metallic') caption.textContent = 'InkGames 水墨层 · metallic，虫蚀';
  else if (camera) caption.textContent = 'InkGames 水墨层 · 分层镜头，整幅在 z = 40';
}

window.__compareScene = {
  width, height, background, seed, strokes: strokes.map(toEngine),
  ...(camera ? { cameraZ: INK_LAYER_Z.actor } : {}),
};
window.__compareReady = true;
