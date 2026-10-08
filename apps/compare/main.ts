import { Application } from 'pixi.js';
import { Container } from 'pixi.js';
import {
  INK_BLENDS, INK_BRUSH_MODES, INK_EFFECTS, INK_LAYER_Z, INK_STAGE_PAPER, InkWash, inkLayerScale, inkPointerPath, paintProp,
  type InkBrushMode, type InkColorName, type InkFinish, type InkPoint, type PropPaintingId, type PropPlacement, type PropStroke,
} from '@inkgames/engine';

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

/** Where each prop sits on the 640×480 comparison sheet (scale 1, the same size as in the demos). */
const PLACEMENT: Readonly<Record<PropPaintingId, PropPlacement>> = {
  sword: { x: 300, y: 320 },
  blade: { x: 280, y: 330 },
  spear: { x: 300, y: 260 },
  bow: { x: 300, y: 240 },
  shield: { x: 320, y: 250 },
  'war-horse': { x: 330, y: 250 },
  banner: { x: 200, y: 250, pose: 1 },
  'ink-bomb': { x: 320, y: 300, scale: 1.25 },
  'water-brush': { x: 320, y: 300 },
  boat: { x: 330, y: 250 },
  water: { x: 0, y: 200, width: 640 },
  landscape: { x: 0, y: 330, width: 640 },
  figure: { x: 320, y: 260 },
};

const PROPS: readonly PropPaintingId[] = [
  'sword', 'blade', 'spear', 'bow', 'shield', 'war-horse', 'banner', 'ink-bomb', 'water-brush', 'boat', 'water', 'landscape',
];

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

/** One wet stroke used to show flow, distort, or metallic on its own. */
function effectStroke(finish: InkFinish): PropStroke[] {
  const points = Array.from({ length: 36 }, (_, k) => ({ x: 70 + k * 14, y: 200 + (k % 6) * 3 }));
  return [{
    prop: 'landscape', part: 'ground',
    brush: { mode: 'brush', size: 'large', effect: 'wet', blend: 'mix' },
    color: 'black', points, seed: 100, finish,
  }];
}

/** A stroke that crosses the sheet, so scaling the whole layer about the centre crops the ends. */
function cameraStrokes(): PropStroke[] {
  const across = Array.from({ length: 48 }, (_, k) => ({ x: 30 + (740 * k) / 47, y: 300 }));
  const corner = Array.from({ length: 16 }, (_, k) => ({ x: 36 + k * 10, y: 48 + k * 8 }));
  return [
    { prop: 'landscape', part: 'ground', brush: { mode: 'brush', size: 'large', effect: 'mix', blend: 'mix' }, color: 'black', points: across, seed: 100 },
    { prop: 'landscape', part: 'post', brush: { mode: 'brush', size: 'medium', effect: 'mix', blend: 'mix' }, color: 'terra_cotta', points: corner, seed: 101 },
  ];
}

const query = new URLSearchParams(location.search);
const requested = query.get('prop') as PropPaintingId | null;
const id: PropPaintingId = requested && PROPS.includes(requested) ? requested : 'sword';
const nav = document.querySelector<HTMLElement>('#props');
for (const prop of PROPS) {
  const link = document.createElement('a');
  link.href = `?prop=${prop}`;
  link.textContent = prop;
  nav?.appendChild(link);
}
const caption = document.querySelector<HTMLElement>('#caption');
if (caption) caption.textContent = `InkGames 水墨层 · ${id} · 笔刷来自 PROP_BRUSHES，与 inkEngine 宿主页用同一组指针路径和种子`;

/** The seven inkEngine brush modes on inkEngine's default 222 gray: one stroke each, same pointer path and seed. */
function modeStrokes(): PropStroke[] {
  const modes: InkBrushMode[] = ['brush', 'marker', 'gothic', 'pen', 'dots', 'fly', 'brushSP'];
  return modes.map((mode, i) => {
    const shift = mode === 'gothic' ? 0 : -10;
    const points = Array.from({ length: 40 }, (_, k) => ({ x: 80 + (620 * k) / 39 + shift, y: 60 + i * 75 + shift }));
    return {
      prop: 'landscape', part: mode, brush: { mode, size: mode === 'gothic' ? 'medium' : 'large', effect: 'mix', blend: 'mix' },
      color: 'black', points, seed: 100 + i,
    };
  });
}

const scene = query.get('scene');
const modes = scene === 'modes';
const effect = scene === 'flow' || scene === 'distort' || scene === 'metallic';
const camera = scene === 'camera';
const mount = document.querySelector<HTMLElement>('#mount');
if (!mount) throw new Error('Missing compare mount');
const width = modes || effect || camera ? 800 : 640;
const height = modes ? 600 : 480;
const background: readonly [number, number, number] = modes || effect || camera ? [222, 222, 222] : INK_STAGE_PAPER;
const seed = 1234567890;
const app = new Application();
await app.init({ width, height, preference: 'webgl', autoStart: false, antialias: false, resolution: 1, backgroundColor: 0x222222 });
mount.appendChild(app.canvas);
const wash = new InkWash(app, { width, height, seed, background, paper: true });
const strokes = scene === 'modes' ? modeStrokes()
  : scene === 'flow' ? effectStroke({ flow: { blendType: 0, iterations: 4, seed: 100 } })
  : scene === 'distort' ? effectStroke({ distort: { displacementB: 20, displacementC: 50, extent: 'frame' } })
  : scene === 'metallic' ? effectStroke({ metallic: { size: 18 } })
  : scene === 'camera' ? cameraStrokes()
  : paintProp(id, PLACEMENT[id]);
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
