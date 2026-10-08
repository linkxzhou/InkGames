import type { BrushPoint, InkBrushOptions } from './ink-brush';
import type { InkPigment } from './ink-wash';

/** One ink stroke of a prop. Points are already in stage pixels. */
export interface MotifStroke {
  readonly points: readonly BrushPoint[];
  readonly mode: InkBrushOptions['mode'];
  readonly size: number;
  readonly effect: InkBrushOptions['effect'];
  readonly pigment: InkPigment;
}

const BLACK: InkPigment = { r: 0.07, g: 0.07, b: 0.08 };
const INDIGO: InkPigment = { r: 0.12, g: 0.16, b: 0.28 };
const CINNABAR: InkPigment = { r: 0.42, g: 0.16, b: 0.12 };
const PINE: InkPigment = { r: 0.16, g: 0.24, b: 0.2 };
const TEA: InkPigment = { r: 0.38, g: 0.28, b: 0.16 };

interface RawStroke {
  readonly points: readonly (readonly [number, number])[];
  readonly mode?: InkBrushOptions['mode'];
  readonly size?: number;
  readonly effect?: InkBrushOptions['effect'];
  readonly pigment?: InkPigment;
}

/** Place a local drawing. shearX leans x by local y so a sword can tilt without sin/cos. */
function place(ox: number, oy: number, scale: number, shearX: number, raw: readonly RawStroke[]): MotifStroke[] {
  return raw.map(stroke => ({
    points: stroke.points.map(([x, y]) => ({
      x: ox + (x + y * shearX) * scale,
      y: oy + y * scale,
    })),
    mode: stroke.mode ?? 'pen',
    size: stroke.size ?? 0.45,
    effect: stroke.effect ?? 'mix',
    pigment: stroke.pigment ?? BLACK,
  }));
}

function curve(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, steps: number): Array<readonly [number, number]> {
  const points: Array<readonly [number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    points.push([u * u * ax + 2 * u * t * bx + t * t * cx, u * u * ay + 2 * u * t * by + t * t * cy]);
  }
  return points;
}

/** Jian: long blade, crossguard, wrapped grip, pommel. Tip is up. */
export function swordMotif(ox: number, oy: number, scale = 1, shearX = 0): MotifStroke[] {
  return place(ox, oy, scale, shearX, [
    { points: [[0, -168], [-8, -40], [-4, 6]], mode: 'brush', size: 0.72, effect: 'flyingWhite' },
    { points: [[0, -168], [8, -40], [4, 6]], mode: 'brush', size: 0.72, effect: 'flyingWhite' },
    { points: [[0, -140], [0, -4]], mode: 'pen', size: 0.28, effect: 'sharpen', pigment: TEA },
    { points: [[-40, 12], [-10, 18], [10, 18], [40, 12]], mode: 'brush', size: 0.85 },
    { points: [[-40, 12], [-48, 28], [-30, 24]], size: 0.4 },
    { points: [[40, 12], [48, 28], [30, 24]], size: 0.4 },
    { points: [[0, 20], [0, 86]], mode: 'brush', size: 0.5, pigment: TEA },
    { points: [[-8, 34], [8, 34]], size: 0.28 },
    { points: [[-8, 52], [8, 52]], size: 0.28 },
    { points: [[-8, 70], [8, 70]], size: 0.28 },
    { points: [[0, 88], [-12, 104], [0, 118], [12, 104], [0, 88]], mode: 'brush', size: 0.42 },
  ]);
}

/** Dao: single curved edge, clipped tip, disc guard, wrapped handle. */
export function bladeMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  return place(ox, oy, scale, 0, [
    { points: curve(-10, 24, -30, -70, 70, -160, 14), mode: 'brush', size: 1.15, effect: 'wet' },
    { points: curve(16, 24, 10, -50, 78, -148, 14), mode: 'brush', size: 0.7, effect: 'flyingWhite' },
    { points: [[70, -160], [96, -132], [78, -148]], mode: 'brush', size: 0.55 },
    { points: curve(-22, 36, 8, 28, 36, 36, 8), mode: 'brush', size: 0.8 },
    { points: curve(-22, 52, 8, 60, 36, 52, 8), mode: 'pen', size: 0.35 },
    { points: [[8, 48], [8, 108]], mode: 'brush', size: 0.48, pigment: TEA },
    { points: [[-6, 64], [22, 64]], size: 0.26 },
    { points: [[-6, 82], [22, 82]], size: 0.26 },
    { points: [[8, 110], [-6, 126], [8, 140], [22, 126], [8, 110]], mode: 'brush', size: 0.4 },
  ]);
}

/** Qiang: shaft, leaf head, tassel under the socket. */
export function spearMotif(ox: number, oy: number, scale = 1, shearX = 0): MotifStroke[] {
  return place(ox, oy, scale, shearX, [
    { points: [[0, 150], [0, -16]], mode: 'brush', size: 0.42, pigment: TEA },
    { points: [[0, -108], [-18, -36], [0, -8]], mode: 'brush', size: 0.6, effect: 'flyingWhite' },
    { points: [[0, -108], [18, -36], [0, -8]], mode: 'brush', size: 0.6, effect: 'flyingWhite' },
    { points: [[0, -96], [0, -16]], mode: 'pen', size: 0.24, effect: 'sharpen' },
    { points: curve(0, -6, -22, 18, -6, 42, 6), mode: 'pen', size: 0.32, pigment: CINNABAR },
    { points: curve(0, -6, 16, 16, 4, 46, 6), mode: 'pen', size: 0.32, pigment: CINNABAR },
    { points: curve(0, -4, -4, 20, 14, 34, 5), mode: 'pen', size: 0.28, pigment: CINNABAR },
  ]);
}

/** Recurve bow, string, nocked arrow with head and fletching. */
export function bowMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  return place(ox, oy, scale, 0, [
    { points: curve(0, 0, 36, -70, -16, -150, 12), mode: 'brush', size: 0.7, pigment: TEA },
    { points: curve(0, 0, 36, 70, -16, 150, 12), mode: 'brush', size: 0.7, pigment: TEA },
    { points: [[-16, -150], [-30, 0], [-16, 150]], mode: 'pen', size: 0.22 },
    { points: [[-30, 0], [108, 0]], mode: 'pen', size: 0.28, effect: 'flyingWhite' },
    { points: [[108, 0], [86, -10], [108, 0], [86, 10]], mode: 'brush', size: 0.36 },
    { points: [[-8, 0], [-26, -14]], size: 0.24 },
    { points: [[-8, 0], [-26, 14]], size: 0.24 },
  ]);
}

/** Heater shield: rim, inner panel, boss ring, grip. Not a filled disc. */
export function shieldMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  const ring: Array<readonly [number, number]> = [];
  const oct = [[1, 0], [0.707, 0.707], [0, 1], [-0.707, 0.707], [-1, 0], [-0.707, -0.707], [0, -1], [0.707, -0.707], [1, 0]];
  for (const [dx, dy] of oct) ring.push([dx * 18, dy * 16]);
  return place(ox, oy, scale, 0, [
    { points: [[-78, -90], [78, -90], [86, -10], [0, 120], [-86, -10], [-78, -90]], mode: 'brush', size: 0.85 },
    { points: [[-56, -68], [56, -68], [60, -6], [0, 88], [-60, -6], [-56, -68]], mode: 'pen', size: 0.4, pigment: INDIGO },
    { points: [[0, -70], [0, 70]], mode: 'pen', size: 0.3, effect: 'sharpen' },
    { points: ring, mode: 'brush', size: 0.4, pigment: CINNABAR },
    { points: [[-24, 8], [24, 8]], mode: 'brush', size: 0.45, pigment: TEA },
  ]);
}

/** Pole, finial, and a cloth with folds. lean shifts the fly edge (pixels at scale 1). */
export function bannerMotif(ox: number, oy: number, scale = 1, lean = 0): MotifStroke[] {
  const fly = (x: number, y: number): readonly [number, number] => [x + lean * (x / 180), y];
  return place(ox, oy, scale, 0, [
    { points: [[0, 170], [0, -170]], mode: 'brush', size: 0.55, pigment: TEA },
    { points: [[0, -170], [-10, -188], [0, -202], [10, -188], [0, -170]], mode: 'pen', size: 0.35 },
    { points: [fly(8, -150), fly(50, -162), fly(110, -140), fly(170, -156), fly(188, -136)], mode: 'brush', size: 0.65, pigment: CINNABAR },
    { points: [fly(8, -36), fly(60, -18), fly(120, -40), fly(176, -22)], mode: 'brush', size: 0.6, pigment: CINNABAR },
    { points: [fly(188, -136), fly(176, -80), fly(176, -22)], mode: 'brush', size: 0.5, pigment: CINNABAR },
    { points: [[8, -150], [8, -36]], mode: 'pen', size: 0.3 },
    { points: [fly(58, -158), fly(64, -28)], mode: 'pen', size: 0.28, effect: 'flyingWhite', pigment: TEA },
    { points: [fly(120, -146), fly(112, -32)], mode: 'pen', size: 0.28, effect: 'flyingWhite', pigment: TEA },
  ]);
}

/** Side-view horse: belly, neck, head, mane, tail, four legs. stride lifts diagonal pairs. */
export function horseMotif(ox: number, oy: number, scale = 1, stride = 0): MotifStroke[] {
  return place(ox, oy, scale, 0, [
    { points: curve(-100, -8, -20, -48, 70, -6, 10), mode: 'brush', size: 0.95 },
    { points: curve(-88, 18, 0, 40, 62, 16, 8), mode: 'brush', size: 0.7 },
    { points: [[58, -16], [92, -58], [100, -78]], mode: 'brush', size: 0.6 },
    { points: [[100, -78], [138, -74], [154, -54], [128, -42], [96, -52]], mode: 'brush', size: 0.55 },
    { points: [[108, -80], [116, -108], [124, -78]], mode: 'pen', size: 0.32 },
    { points: [[70, -40], [78, -62]], size: 0.24, pigment: PINE },
    { points: [[78, -34], [88, -58]], size: 0.24, pigment: PINE },
    { points: [[86, -28], [98, -54]], size: 0.24, pigment: PINE },
    { points: curve(-102, -6, -150, -28, -136, 36, 7), mode: 'brush', size: 0.4, effect: 'flyingWhite', pigment: PINE },
    { points: [[-70, 16], [-82, 78 + stride]], mode: 'brush', size: 0.4 },
    { points: [[-28, 28], [-16, 84 - stride]], mode: 'brush', size: 0.4 },
    { points: [[36, 20], [24, 82 + stride]], mode: 'brush', size: 0.4 },
    { points: [[62, 12], [78, 76 - stride]], mode: 'brush', size: 0.4 },
    { points: [[-88, 78 + stride], [-70, 84 + stride]], size: 0.28 },
    { points: [[72, 76 - stride], [90, 80 - stride]], size: 0.28 },
  ]);
}

/** Hull, gunwale, stern, bow, cabin. Sits on the water, not a crescent blob. */
export function boatMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  return place(ox, oy, scale, 0, [
    { points: curve(-120, 8, -20, 48, 130, 4, 12), mode: 'brush', size: 0.9, pigment: TEA },
    { points: [[-108, 0], [118, -8]], mode: 'brush', size: 0.55 },
    { points: [[-108, 0], [-118, -46]], mode: 'pen', size: 0.4 },
    { points: [[118, -8], [142, -22]], mode: 'brush', size: 0.45 },
    { points: [[-8, -6], [-8, -42], [46, -48], [54, -8]], mode: 'pen', size: 0.4, pigment: INDIGO },
    { points: [[-18, -42], [58, -52]], mode: 'brush', size: 0.4, pigment: INDIGO },
    { points: [[24, -8], [70, 16], [36, 8]], mode: 'pen', size: 0.32, pigment: TEA },
  ]);
}

/**
 * A sheet of water: stacked wet strokes, darker toward the bottom, crests as shorter flying-white lines.
 * This is the water body, not a ring of dots.
 */
export function waterBody(x0: number, x1: number, surfaceY: number, depth = 150): MotifStroke[] {
  const strokes: MotifStroke[] = [];
  const rows = 7;
  for (let row = 0; row < rows; row++) {
    const y = surfaceY + (depth * row) / (rows - 1);
    const points: BrushPoint[] = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const x = x0 + ((x1 - x0) * i) / steps;
      const wobble = ((i % 4) - 1.5) * 7 - (row % 2) * 3;
      points.push({ x, y: y + wobble });
    }
    const deep = row / (rows - 1);
    strokes.push({
      points,
      mode: 'brush',
      size: 0.55 + deep * 0.9,
      effect: 'wet',
      pigment: {
        r: 0.1 + deep * 0.04,
        g: 0.18 + (1 - deep) * 0.08,
        b: 0.26 + (1 - deep) * 0.06,
      },
    });
  }
  for (let crest = 0; crest < 4; crest++) {
    const y = surfaceY + 18 + crest * 28;
    const left = x0 + 80 + crest * 140;
    strokes.push({
      points: curve(left, y, left + 70, y - 16, left + 150, y + 4, 8).map(([x, py]) => ({ x, y: py })),
      mode: 'pen',
      size: 0.35,
      effect: 'flyingWhite',
      pigment: { r: 0.75, g: 0.8, b: 0.82 },
    });
  }
  return strokes;
}

/** Ceramic ink pot: belly, neck, lid, fuse. Reads as a vessel, not a disc. */
export function inkBombMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  return place(ox, oy, scale, 0, [
    { points: curve(0, -78, -48, -20, -10, 62, 12), mode: 'brush', size: 0.85 },
    { points: curve(0, -78, 48, -20, 10, 62, 12), mode: 'brush', size: 0.85 },
    { points: [[-10, 62], [0, 74], [10, 62]], mode: 'brush', size: 0.5 },
    { points: [[-36, 8], [36, 6]], mode: 'pen', size: 0.3, effect: 'sharpen', pigment: TEA },
    { points: [[-28, 28], [28, 26]], mode: 'pen', size: 0.28, pigment: TEA },
    { points: [[-10, -78], [-8, -108], [8, -108], [10, -78]], mode: 'brush', size: 0.45 },
    { points: [[-16, -112], [16, -112]], mode: 'brush', size: 0.4, pigment: CINNABAR },
    { points: curve(8, -112, 28, -140, 48, -124, 6), mode: 'pen', size: 0.3, pigment: TEA },
    { points: [[48, -124], [58, -140], [40, -132]], mode: 'pen', size: 0.28, pigment: CINNABAR },
    { points: [[0, 74], [2, 102], [12, 116]], mode: 'brush', size: 0.4, effect: 'wet' },
  ]);
}

/** Water brush: handle, ferrule, splayed hairs, a wet tip. */
export function waterBrushMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  return place(ox, oy, scale, 0.15, [
    { points: [[0, 70], [0, -10]], mode: 'brush', size: 0.55, pigment: TEA },
    { points: [[-10, -10], [10, -10], [7, -32], [-7, -32], [-10, -10]], mode: 'pen', size: 0.4 },
    { points: [[-7, -32], [-18, -78]], mode: 'brush', size: 0.4, effect: 'wet', pigment: INDIGO },
    { points: [[0, -32], [2, -88]], mode: 'brush', size: 0.45, effect: 'wet', pigment: INDIGO },
    { points: [[7, -32], [20, -74]], mode: 'brush', size: 0.4, effect: 'wet', pigment: INDIGO },
    { points: [[-16, -80], [18, -86], [4, -96]], mode: 'brush', size: 0.7, effect: 'wet', pigment: INDIGO },
  ]);
}

/** Straw target: square face, cross, stand. Hit-tests still use the center point. */
export function targetMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  return place(ox, oy, scale, 0, [
    { points: [[-22, -22], [22, -22], [22, 22], [-22, 22], [-22, -22]], mode: 'pen', size: 0.4 },
    { points: [[-12, -12], [12, -12], [12, 12], [-12, 12], [-12, -12]], size: 0.28, pigment: CINNABAR },
    { points: [[0, -22], [0, 22]], size: 0.22 },
    { points: [[-22, 0], [22, 0]], size: 0.22 },
  ]);
}

/** Round archery butt: two rings and a stand, so it is a target face rather than a blot. */
export function buttMotif(ox: number, oy: number, scale = 1): MotifStroke[] {
  const ring = (radius: number): Array<readonly [number, number]> => {
    const oct = [[1, 0], [0.707, 0.707], [0, 1], [-0.707, 0.707], [-1, 0], [-0.707, -0.707], [0, -1], [0.707, -0.707], [1, 0]];
    return oct.map(([x, y]) => [x * radius, y * radius * 0.92]);
  };
  return place(ox, oy, scale, 0, [
    { points: ring(36), mode: 'brush', size: 0.45, pigment: TEA },
    { points: ring(18), mode: 'pen', size: 0.32, pigment: CINNABAR },
    { points: [[0, 34], [0, 78]], mode: 'brush', size: 0.35, pigment: TEA },
    { points: [[-16, 78], [16, 78]], size: 0.3, pigment: TEA },
  ]);
}

/** Spilled ink: three wet strokes, not a filled circle. */
export function spillMotif(ox: number, oy: number, pigment: InkPigment): MotifStroke[] {
  return [
    { points: curve(ox - 36, oy, ox, oy - 28, ox + 40, oy + 6, 8).map(([x, y]) => ({ x, y })), mode: 'brush', size: 1.1, effect: 'wet', pigment },
    { points: curve(ox - 20, oy + 10, ox + 10, oy + 24, ox + 28, oy - 4, 6).map(([x, y]) => ({ x, y })), mode: 'brush', size: 0.8, effect: 'wet', pigment },
    { points: curve(ox - 8, oy - 6, ox + 16, oy + 8, ox + 8, oy + 18, 5).map(([x, y]) => ({ x, y })), mode: 'pen', size: 0.45, effect: 'wet', pigment },
  ];
}

/** Short hoof or wake mark. A stroke, not a dot. */
export function dashMotif(x0: number, y0: number, x1: number, y1: number, pigment: InkPigment, effect: InkBrushOptions['effect']): MotifStroke[] {
  return [{
    points: [{ x: x0, y: y0 }, { x: (x0 + x1) / 2, y: (y0 + y1) / 2 - 4 }, { x: x1, y: y1 }],
    mode: 'pen',
    size: 0.4,
    effect,
    pigment,
  }];
}

/** Splash as short radial strokes. Directions are the same constants the shield ring used. */
export function splashMotif(ox: number, oy: number, radius: number, pigment: InkPigment): MotifStroke[] {
  const oct = [[1, 0], [0.707, 0.707], [0, 1], [-0.707, 0.707], [-1, 0], [-0.707, -0.707], [0, -1], [0.707, -0.707]];
  return oct.map(([dx, dy], index) => ({
    points: [
      { x: ox + dx * radius * 0.25, y: oy + dy * radius * 0.2 },
      { x: ox + dx * radius, y: oy + dy * radius * 0.72 },
    ],
    mode: index % 2 === 0 ? 'brush' as const : 'pen' as const,
    size: 0.55,
    effect: 'wet' as const,
    pigment,
  }));
}

/** Rotate a motif so +x in local space points along (dx, dy). No trig: the basis is the normalized velocity. */
export function aimMotif(strokes: readonly MotifStroke[], ox: number, oy: number, dx: number, dy: number): MotifStroke[] {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  return strokes.map(stroke => ({
    ...stroke,
    points: stroke.points.map(point => ({
      x: ox + point.x * ux + point.y * px,
      y: oy + point.x * uy + point.y * py,
    })),
  }));
}

/** Arrow drawn along +x in local space, for a flying shaft. */
export function arrowMotif(scale = 1): MotifStroke[] {
  return place(0, 0, scale, 0, [
    { points: [[-22, 0], [16, 0]], mode: 'pen', size: 0.35 },
    { points: [[22, 0], [8, -7]], mode: 'brush', size: 0.32 },
    { points: [[22, 0], [8, 7]], mode: 'brush', size: 0.32 },
    { points: [[-14, 0], [-24, -8]], size: 0.24 },
    { points: [[-14, 0], [-24, 8]], size: 0.24 },
  ]);
}
