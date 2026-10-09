import { INK_SIZES, type InkBrushSettings, type InkPoint } from '../core/ink-brush';
import type { InkColorName } from '../core/ink-palette';
import type { InkFinish } from '../core/ink-stroke';
import { inkCos, inkSin, TWO_PI } from '../core/ink-random';
import { PROP_BRUSHES, type PropBrush, type PropPaintingId } from './prop-brushes';

/**
 * How each prop is painted: gesture paths per part, sampled the way a hand moves a pointer in
 * inkEngine/index.html (one sample per frame at the preset speed, slower at both ends), with the
 * part's brush from PROP_BRUSHES. Coordinates are sheet pixels at scale 1; y grows downwards.
 */

/** One stroke, ready for InkSurface.paint() or for the inkEngine host (setBrush/setColor/strokePath). */
export interface PropStroke {
  readonly prop: string;
  readonly part: string;
  readonly brush: InkBrushSettings;
  readonly color: InkColorName;
  /** Tip positions, one per frame. */
  readonly points: readonly InkPoint[];
  readonly seed: number;
  /** Copied from the brush table when the part opts into flow, distort, or metallic. */
  readonly finish?: InkFinish;
}

export interface PropPlacement {
  readonly x: number;
  readonly y: number;
  /** Path scale. Below 1 the brush shrinks with it (numeric inkEngine size). */
  readonly scale?: number;
  /** Mirror left-right. */
  readonly mirror?: boolean;
  /** Pose or wind: horse stride 0/1, banner lean −1..1, figure pose 0/1. */
  readonly pose?: number;
  /** Changes stroke seeds so repeated paintings are not identical. */
  readonly variant?: number;
  /** Water body: right edge of the sheet. */
  readonly width?: number;
}

type Pt = readonly [number, number];

export interface Gesture {
  readonly part: string;
  readonly path: readonly Pt[];
  readonly pressure?: number;
}

function quad(a: Pt, b: Pt, c: Pt, n = 12): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push([u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]);
  }
  return out;
}

function cubic(a: Pt, b: Pt, c: Pt, d: Pt, n = 16): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const k0 = u * u * u;
    const k1 = 3 * u * u * t;
    const k2 = 3 * u * t * t;
    const k3 = t * t * t;
    out.push([k0 * a[0] + k1 * b[0] + k2 * c[0] + k3 * d[0], k0 * a[1] + k1 * b[1] + k2 * c[1] + k3 * d[1]]);
  }
  return out;
}

/** Ellipse arc, turns in 0..1 (0 = +x, clockwise on screen). */
function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number, n = 18): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (from + (to - from) * (i / n)) * TWO_PI;
    out.push([cx + rx * inkCos(a), cy + ry * inkSin(a)]);
  }
  return out;
}

function line(a: Pt, b: Pt): Pt[] {
  return [a, b];
}

/** Gentle waves across a span: the river and the cloth. phase in turns. */
function wave(x0: number, x1: number, y: number, amplitude: number, wavelength: number, phase: number, n = 40): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    out.push([x, y + amplitude * inkSin(((x - x0) / wavelength + phase) * TWO_PI)]);
  }
  return out;
}

const PAINTERS: Readonly<Record<PropPaintingId, (pose: number) => readonly Gesture[]>> = {
  sword: () => [
    { part: 'blade', path: line([3, -12], [32, -262]) },
    { part: 'edge', path: quad([-9, -6], [16, -150], [36, -294]) },
    { part: 'edge', path: quad([12, -4], [36, -150], [36, -294]) },
    { part: 'ridge', path: line([2, -16], [31, -250]) },
    { part: 'guard', path: quad([-42, 8], [0, -6], [44, 2]) },
    { part: 'grip', path: line([-1, 12], [-9, 76]) },
    { part: 'wrap', path: line([-9, 26], [7, 28]) },
    { part: 'wrap', path: line([-10, 42], [6, 44]) },
    { part: 'wrap', path: line([-12, 58], [4, 60]) },
    { part: 'pommel', path: arc(-10, 86, 6, 5, 0, 1, 10) },
    { part: 'tassel', path: quad([-11, 92], [-30, 120], [-4, 150]) },
    { part: 'tassel', path: quad([-9, 92], [-14, 124], [8, 146]) },
  ],
  blade: () => [
    { part: 'blade', path: quad([4, -10], [8, -160], [66, -266]) },
    { part: 'edge', path: quad([20, -6], [30, -150], [70, -272]) },
    { part: 'spine', path: quad([-8, -8], [-12, -160], [66, -270]) },
    { part: 'guard', path: arc(4, 2, 26, 9, 0, 1, 16) },
    { part: 'grip', path: line([3, 12], [-4, 82]) },
    { part: 'pommel', path: arc(-5, 90, 5, 5, 0, 1, 8) },
  ],
  spear: () => [
    { part: 'shaft', path: line([-180, 160], [146, -116]) },
    { part: 'head', path: quad([146, -116], [190, -122], [210, -172]) },
    { part: 'head', path: quad([146, -116], [164, -156], [210, -172]) },
    { part: 'head', path: line([152, -122], [204, -166]) },
    { part: 'socket', path: line([136, -122], [154, -104]) },
    { part: 'tassel', path: quad([138, -108], [150, -78], [134, -52]) },
    { part: 'tassel', path: quad([134, -110], [124, -82], [110, -64]) },
    { part: 'tassel', path: quad([140, -106], [164, -86], [160, -60]) },
  ],
  bow: () => [
    { part: 'limb', path: quad([0, -12], [56, -110], [-14, -198]) },
    { part: 'limb', path: quad([0, 12], [56, 110], [-14, 198]) },
    { part: 'tip', path: line([-14, -198], [-2, -212]) },
    { part: 'tip', path: line([-14, 198], [-2, 212]) },
    { part: 'grip', path: line([2, -20], [2, 22]) },
    { part: 'string', path: line([-16, -204], [-16, 204]) },
    { part: 'shaft', path: line([-26, 0], [172, 0]) },
    { part: 'arrowhead', path: [[150, -10], [178, 0], [150, 10]] },
    { part: 'fletch', path: line([-18, -2], [-52, -16]) },
    { part: 'fletch', path: line([-18, 2], [-52, 16]) },
  ],
  shield: () => [
    { part: 'wash', path: line([-34, -96], [-26, 96]) },
    { part: 'wash', path: line([30, -96], [24, 96]) },
    { part: 'rim', path: quad([-74, -86], [0, -136], [74, -86]) },
    { part: 'rim', path: quad([74, -86], [70, 60], [0, 150]) },
    { part: 'rim', path: quad([-74, -86], [-70, 60], [0, 150]) },
    { part: 'emblem', path: line([-30, 26], [30, 24]) },
    { part: 'emblem', path: line([0, -4], [-2, 66]) },
    { part: 'boss', path: arc(0, -30, 7, 6, 0, 1, 10) },
    { part: 'rivet', path: quad([-58, -74], [0, -112], [58, -74]) },
  ],
  'war-horse': (stride) => {
    // Galloping to the right. Two gaits: legs stretched (0) and gathered (1).
    const legs: Gesture[] = stride % 2 === 0
      ? [
        { part: 'leg', path: [[74, 24], [104, 60], [146, 70]] },
        { part: 'leg', path: [[56, 28], [70, 74], [52, 112]] },
        { part: 'leg', path: [[-78, 26], [-112, 64], [-160, 74]] },
        { part: 'leg', path: [[-58, 30], [-48, 76], [-70, 116]] },
        { part: 'hoof', path: line([146, 70], [156, 74]) },
        { part: 'hoof', path: line([52, 112], [62, 116]) },
        { part: 'hoof', path: line([-160, 74], [-170, 78]) },
        { part: 'hoof', path: line([-70, 116], [-60, 120]) },
      ]
      : [
        { part: 'leg', path: [[74, 26], [92, 72], [80, 116]] },
        { part: 'leg', path: [[56, 28], [86, 58], [118, 92]] },
        { part: 'leg', path: [[-78, 28], [-92, 74], [-76, 118]] },
        { part: 'leg', path: [[-58, 30], [-96, 66], [-134, 96]] },
        { part: 'hoof', path: line([80, 116], [90, 120]) },
        { part: 'hoof', path: line([118, 92], [128, 96]) },
        { part: 'hoof', path: line([-76, 118], [-66, 122]) },
        { part: 'hoof', path: line([-134, 96], [-144, 100]) },
      ];
    return [
      { part: 'halo', path: quad([-124, 4], [-10, -16], [100, -6]) },
      { part: 'body', path: quad([-104, -18], [-20, -46], [72, -30]) },
      { part: 'body', path: quad([-94, 18], [-6, 34], [70, 14]) },
      { part: 'body', path: quad([-98, 0], [-14, -10], [72, -8]) },
      { part: 'body', path: quad([70, -10], [-14, 12], [-96, 6]) },
      { part: 'body', path: quad([-110, -16], [-130, 8], [-90, 32]) },
      { part: 'body', path: quad([66, -32], [92, -4], [68, 24]) },
      { part: 'neck', path: quad([62, -28], [98, -66], [114, -114]) },
      { part: 'head', path: quad([108, -118], [146, -104], [164, -74]) },
      { part: 'ear', path: line([110, -122], [104, -144]) },
      { part: 'mane', path: quad([108, -130], [86, -90], [58, -52]) },
      { part: 'tail', path: cubic([-112, -18], [-152, -34], [-180, -8], [-204, 36]) },
      ...legs,
    ];
  },
  banner: (lean) => {
    const sway = Math.max(-1, Math.min(1, lean));
    const reach = 214 + sway * 34;
    const phase = 0.15 + sway * 0.2;
    return [
      { part: 'pole', path: line([0, 220], [0, -222]) },
      { part: 'finial', path: arc(0, -232, 6, 8, 0, 1, 10) },
      { part: 'cloth', path: wave(14, reach, -182, 7, 160, phase) },
      { part: 'cloth', path: wave(reach - 4, 14, -152, 8, 160, phase + 0.06) },
      { part: 'cloth', path: wave(14, reach - 8, -122, 9, 160, phase + 0.12) },
      { part: 'cloth', path: wave(reach - 12, 14, -92, 10, 160, phase + 0.18) },
      { part: 'bleed', path: quad([reach - 4, -188], [reach + 8 + sway * 10, -140], [reach - 12, -84]) },
      { part: 'fold', path: [[72, -194], [80 + sway * 8, -140], [70 + sway * 10, -82]] },
      { part: 'fold', path: [[140 + sway * 12, -194], [134 + sway * 16, -140], [144 + sway * 20, -82]] },
      { part: 'hem', path: wave(8, reach + 6, -198, 7, 160, phase - 0.04, 24) },
      { part: 'hem', path: wave(8, reach - 8, -76, 10, 160, phase + 0.2, 24) },
      { part: 'streamer', path: quad([reach - 6, -80], [reach + 26 + sway * 30, -40], [reach + 10 + sway * 60, 0]) },
    ];
  },
  'ink-bomb': () => [
    // An ink jar: heavy belly, shoulder, neck and lip, stopper, cord, a white glaze glint, a lit fuse.
    { part: 'belly', path: arc(0, 22, 36, 30, 0.62, 1.6, 22) },
    { part: 'belly', path: arc(0, 24, 16, 12, 0.1, 1.08, 12) },
    { part: 'shoulder', path: quad([-40, -6], [0, -40], [40, -6]) },
    { part: 'neck', path: line([0, -34], [0, -62]) },
    { part: 'rim', path: quad([-26, -68], [0, -76], [26, -68]) },
    { part: 'stopper', path: line([-10, -84], [12, -86]) },
    { part: 'cord', path: quad([-30, -48], [0, -36], [30, -48]) },
    { part: 'glaze', path: arc(-8, 8, 44, 38, 0.55, 0.78, 8) },
    { part: 'fuse', path: cubic([6, -88], [20, -122], [46, -112], [54, -142]) },
    { part: 'spark', path: line([50, -146], [62, -158]) },
  ],
  'water-brush': () => [
    { part: 'handle', path: line([0, 190], [-8, -40]) },
    { part: 'node', path: line([-12, 130], [10, 128]) },
    { part: 'node', path: line([-14, 54], [8, 52]) },
    { part: 'ferrule', path: line([-8, -40], [-10, -74]) },
    { part: 'hair', path: quad([-12, -76], [-28, -120], [-6, -168]) },
    { part: 'hair', path: quad([-6, -76], [12, -122], [-4, -170]) },
    { part: 'tip', path: line([-8, -150], [-4, -184]) },
    { part: 'drip', path: line([-2, -190], [8, -232]) },
  ],
  boat: () => [
    { part: 'hull', path: quad([-150, -4], [0, 34], [164, -12]) },
    { part: 'keel', path: quad([-160, -14], [-10, 34], [176, -24]) },
    { part: 'keel', path: quad([-150, -20], [0, 4], [168, -30]) },
    { part: 'canopy', path: quad([-70, -22], [0, -80], [64, -26]) },
    { part: 'canopyLine', path: quad([-76, -20], [0, -96], [70, -24]) },
    { part: 'canopyLine', path: line([-30, -60], [-34, -14]) },
    { part: 'canopyLine', path: line([22, -64], [20, -18]) },
    { part: 'boatman', path: line([118, -30], [114, -84]) },
    { part: 'boatman', path: [[98, -86], [116, -104], [136, -86]] },
    { part: 'oar', path: line([128, -66], [212, 34]) },
    { part: 'wake', path: line([-190, 22], [-60, 30]) },
    { part: 'wake', path: line([40, 30], [200, 22]) },
  ],
  water: () => [],
  landscape: () => [],
  figure: (pose) => (pose % 2 === 0
    ? [
      { part: 'robe', path: line([0, -20], [2, 26]) },
      { part: 'head', path: arc(0, -38, 5, 5, 0, 1, 8) },
      { part: 'limb', path: quad([-4, 24], [-10, 44], [-12, 62]) },
      { part: 'limb', path: quad([6, 24], [12, 44], [14, 62]) },
      { part: 'limb', path: quad([-6, -16], [-18, 0], [-20, 14]) },
      { part: 'limb', path: quad([8, -16], [22, -6], [30, -12]) },
      { part: 'sash', path: line([-10, 4], [12, 6]) },
    ]
    : [
      { part: 'robe', path: line([2, -20], [-6, 26]) },
      { part: 'head', path: arc(6, -38, 5, 5, 0, 1, 8) },
      { part: 'limb', path: quad([-6, 24], [-22, 40], [-30, 58]) },
      { part: 'limb', path: quad([4, 24], [18, 40], [26, 60]) },
      { part: 'limb', path: quad([-4, -16], [-16, -4], [-24, 6]) },
      { part: 'limb', path: quad([8, -16], [26, -18], [40, -24]) },
      { part: 'sash', path: line([-10, 4], [12, 2]) },
    ]),
};

/** The river: long wet horizontal strokes, light on top and deeper below, white flying-white crests. */
function waterGestures(width: number): Gesture[] {
  const x0 = -30;
  const x1 = width + 30;
  const crests: Gesture[] = [];
  for (let i = 0; i * 230 < width; i++) {
    const cx = 60 + i * 230 + (i % 2) * 70;
    crests.push({ part: 'crest', path: wave(cx, cx + 120, 22 + (i % 3) * 18, 4, 120, 0.25 + i * 0.1, 10) });
  }
  const ripples: Gesture[] = [];
  for (let i = 0; i * 300 < width; i++) {
    const rx = 150 + i * 300;
    ripples.push({ part: 'ripple', path: wave(rx, rx + 70, 92 + (i % 2) * 30, 3, 70, 0.1 * i, 8) });
  }
  return [
    { part: 'surface', path: wave(x0, x1, 0, 6, 420, 0.1) },
    { part: 'tint', path: wave(x1, x0, 24, 7, 380, 0.4) },
    { part: 'current', path: wave(x0, x1, 48, 6, 460, 0.7) },
    { part: 'tint', path: wave(x1, x0, 72, 8, 420, 0.15) },
    { part: 'current', path: wave(x0, x1, 98, 6, 520, 0.2) },
    { part: 'tint', path: wave(x1, x0, 122, 7, 480, 0.55) },
    { part: 'deep', path: wave(x0, x1, 146, 6, 520, 0.85) },
    ...crests,
    ...ripples,
  ];
}

/** Far hills, near hills, ground line and a few grass tufts. */
function landscapeGestures(width: number): Gesture[] {
  // Each far peak is painted as its own inverted-V: wash up one flank and down the other, a dry ridge on top.
  const peaks: Gesture[] = [];
  for (let i = 0; i * 190 < width + 120; i++) {
    const cx = -20 + i * 190 + (i % 2) * 40;
    const top = -170 - ((i * 53) % 4) * 22;
    const half = 110 + ((i * 37) % 3) * 30;
    peaks.push({ part: 'farHill', path: [[cx - half, -60], [cx - half * 0.35, top + 40], [cx - 6, top], [cx + half * 0.4, top + 50], [cx + half, -64]] });
    peaks.push({ part: 'farHill', path: [[cx + half * 0.55, -62], [cx + 4, top + 46], [cx - half * 0.5, -60]] });
  }
  const near: Pt[] = [];
  for (let i = 0; i <= 10; i++) {
    const x = -40 + ((width + 80) * i) / 10;
    near.push([x, -36 - ((i * 53) % 4) * 14 + ((i + 1) % 3) * 8]);
  }
  const grass: Gesture[] = [];
  for (let i = 0; i * 260 < width; i++) {
    const gx = 120 + i * 260 + (i % 2) * 50;
    grass.push({ part: 'grass', path: line([gx, 6], [gx + 46, 2]) });
  }
  return [
    ...peaks,
    { part: 'nearHill', path: near.slice().reverse() },
    { part: 'nearHill', path: near.map(([x, y]) => [x - 20, y + 26] as const) },
    { part: 'ground', path: wave(-30, width + 30, 120, 2, 600, 0.3, 30) },
    ...grass,
  ];
}

function fnv(text: string): number {
  let n = 2166136261;
  for (let i = 0; i < text.length; i++) n = Math.imul(n ^ text.charCodeAt(i), 16777619);
  return n >>> 0;
}

/** One pointer sample per frame: slow on landing, full speed, slower again before lifting. */
function sampleAtSpeed(path: readonly Pt[], speed: number): Pt[] {
  const lengths: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    if (!a || !b) continue;
    lengths.push((lengths[i - 1] ?? 0) + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = lengths[lengths.length - 1] ?? 0;
  const first = path[0];
  if (!first) return [];
  if (total < 1e-6) return [first, first, first];
  const at = (s: number): Pt => {
    let k = 1;
    while (k < lengths.length - 1 && (lengths[k] ?? 0) < s) k++;
    const a = path[k - 1] ?? first;
    const b = path[k] ?? a;
    const l0 = lengths[k - 1] ?? 0;
    const l1 = lengths[k] ?? l0;
    const t = l1 > l0 ? (s - l0) / (l1 - l0) : 0;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  const out: Pt[] = [first];
  let s = 0;
  let frame = 0;
  while (s < total && frame < 380) {
    const landing = Math.min(1, 0.35 + 0.22 * frame);
    const lifting = Math.min(1, 0.45 + (total - s) / (2.5 * speed));
    s = Math.min(total, s + Math.max(0.6, speed * landing * lifting));
    out.push(at(s));
    frame++;
  }
  while (out.length < 3) out.push(out[out.length - 1] ?? first);
  return out;
}

function settingsFor(preset: PropBrush, scale: number): InkBrushSettings {
  const size = scale >= 0.999 ? preset.size : Math.max(0.1, INK_SIZES[preset.size] * scale);
  return { mode: preset.mode, size, effect: preset.effect, blend: preset.blend };
}

/** Strokes for one prop, in painting order (washes first, line work on top). */
export function paintProp(id: PropPaintingId, at: PropPlacement): PropStroke[] {
  const gestures = id === 'water'
    ? waterGestures(at.width ?? 1280)
    : id === 'landscape'
      ? landscapeGestures(at.width ?? 1280)
      : PAINTERS[id](at.pose ?? 0);
  return strokesFrom(id, PROP_BRUSHES[id] as Readonly<Record<string, PropBrush>>, gestures, at);
}

/** Shared by the ten-card table and the history props that are not in that table. */
export function strokesFrom(
  id: string,
  table: Readonly<Record<string, PropBrush>>,
  gestures: readonly Gesture[],
  at: PropPlacement,
): PropStroke[] {
  const scale = at.scale ?? 1;
  const flip = at.mirror ? -1 : 1;
  return gestures.flatMap((gesture, index) => {
    const preset = table[gesture.part];
    if (!preset) return [];
    // Small copies move the hand proportionally slower (their brush shrinks too); large ones keep the
    // preset speed in sheet pixels so the stroke texture matches the table.
    const local = sampleAtSpeed(gesture.path, scale >= 1 ? preset.speed / scale : preset.speed);
    const pressure = gesture.pressure ?? preset.pressure;
    const points = local.map(([lx, ly]) => {
      const x = at.x + flip * lx * scale;
      const y = at.y + ly * scale;
      return pressure === undefined ? { x, y } : { x, y, pressure };
    });
    const seed = fnv(`${id}:${gesture.part}:${index}:${at.variant ?? 0}:${at.pose ?? 0}`);
    // Bite and flow radii are in sheet pixels. On a hand-sized copy they cover the whole sprite.
    const raw = scale < 0.75 ? undefined : preset.finish;
    const finish = raw?.flow
      ? { ...raw, flow: { ...raw.flow, seed: raw.flow.seed ?? (seed % 1000000) } }
      : raw;
    return [{
      prop: id,
      part: gesture.part,
      brush: settingsFor(preset, scale),
      color: preset.color,
      points,
      seed,
      ...(finish ? { finish } : {}),
    }];
  });
}

/** One action stroke (a slash, a hit splash, a wake) with a prop's brush. */
export function actionStroke(id: PropPaintingId, part: string, path: readonly Pt[], variant = 0): PropStroke | undefined {
  const preset = (PROP_BRUSHES[id] as Readonly<Record<string, PropBrush>>)[part];
  if (!preset) return undefined;
  const points = sampleAtSpeed(path, preset.speed).map(([x, y]) => (preset.pressure === undefined ? { x, y } : { x, y, pressure: preset.pressure }));
  const seed = fnv(`${id}:${part}:action:${variant}`);
  const finish = preset.finish?.flow
    ? { ...preset.finish, flow: { ...preset.finish.flow, seed: preset.finish.flow.seed ?? (seed % 1000000) } }
    : preset.finish;
  return { prop: id, part, brush: settingsFor(preset, 1), color: preset.color, points, seed, ...(finish ? { finish } : {}) };
}
