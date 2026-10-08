import { Application } from 'pixi.js';
import {
  INK_BLENDS, INK_BRUSH_MODES, INK_EFFECTS, INK_STAGE_PAPER, InkWash, inkPointerPath, paintProp,
  type InkBrushMode, type InkColorName, type InkPoint, type PropPaintingId, type PropPlacement, type PropStroke,
} from '@inkgames/engine';

/** A stroke in inkEngine API terms: what the host page passes to setBrush / setColor / strokePath. */
interface EngineStroke {
  readonly part: string;
  readonly brush: { readonly mode: number; readonly size: string | number; readonly effect: number; readonly blend: number };
  readonly color: InkColorName;
  readonly points: readonly InkPoint[];
  readonly seed: number;
}

interface CompareScene {
  readonly width: number;
  readonly height: number;
  readonly background: readonly [number, number, number];
  readonly seed: number;
  readonly strokes: readonly EngineStroke[];
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
  };
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

const mount = document.querySelector<HTMLElement>('#mount');
if (!mount) throw new Error('Missing compare mount');
const width = 640;
const height = 480;
const seed = 1234567890;
const app = new Application();
await app.init({ width, height, preference: 'webgl', autoStart: false, antialias: false, resolution: 1, backgroundColor: 0x222222 });
mount.appendChild(app.canvas);
const wash = new InkWash(app, { width, height, seed, background: INK_STAGE_PAPER, paper: true });
app.stage.addChild(wash.view);
const strokes = paintProp(id, PLACEMENT[id]);
for (const stroke of strokes) wash.paint(stroke);
app.render();

window.__compareScene = { width, height, background: INK_STAGE_PAPER, seed, strokes: strokes.map(toEngine) };
window.__compareReady = true;
