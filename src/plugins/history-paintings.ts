import { inkCos, inkSin, TWO_PI } from '../core/ink-random';
import type { PropBrush } from './prop-brushes';
import { strokesFrom, type Gesture, type PropPlacement, type PropStroke } from './prop-paintings';

/**
 * Brushes for history props that are not already in PROP_BRUSHES.
 * Columns match inkEngine/index.html: mode, size, effect, blend, colour, hand speed.
 */
const brush = (
  mode: PropBrush['mode'], size: PropBrush['size'], effect: PropBrush['effect'], color: PropBrush['color'], speed: number,
  pressure?: number,
): PropBrush => (pressure === undefined
  ? { mode, size, effect, blend: 'mix', color, speed }
  : { mode, size, effect, blend: 'mix', color, speed, pressure });

export const HISTORY_BRUSHES = {
  dagger: {
    scroll: brush('brush', 'extra-large', 'wet', 'terra_cotta', 14),
    roll: brush('brush', 'small', 'mix', 'brown', 8),
    map: brush('pen', 'ultra-small', 'sharpen', 'black', 12),
    blade: brush('brush', 'small', 'flyingWhite', 'black', 10),
    edge: brush('brush', 'ultra-small', 'sharpen', 'sage_gray', 8),
    hilt: brush('marker', 'small', 'mix', 'wine_red', 4),
  },
  slip: {
    strip: brush('brush', 'large', 'wet', 'brown', 10, 0.35),
    tie: brush('brush', 'small', 'mix', 'black', 8),
    column: brush('pen', 'ultra-small', 'mix', 'black', 10),
  },
  ding: {
    belly: brush('brush', 'huge', 'wet', 'sage_gray', 8, 0.45),
    leg: brush('brush', 'medium', 'mix', 'black', 6),
    handle: brush('brush', 'small', 'mix', 'black', 6),
    face: brush('pen', 'ultra-small', 'sharpen', 'black', 5),
  },
  chariot: {
    box: brush('brush', 'large', 'wet', 'brown', 10),
    wheel: brush('brush', 'medium', 'mix', 'black', 7),
    spoke: brush('pen', 'ultra-small', 'sharpen', 'black', 8),
    shaft: brush('brush', 'small', 'mix', 'terra_cotta', 12),
  },
  crossbow: {
    stock: brush('brush', 'medium', 'mix', 'brown', 10),
    prod: brush('brush', 'small', 'sharpen', 'black', 8),
    string: brush('pen', 'ultra-small', 'mix', 'black', 14),
    bolt: brush('brush', 'ultra-small', 'flyingWhite', 'sage_gray', 16),
  },
  warship: {
    hull: brush('brush', 'extra-large', 'wet', 'gray_brown', 12),
    mast: brush('brush', 'small', 'mix', 'black', 10),
    sail: brush('brush', 'large', 'wet', 'light_gray_new', 9),
    oar: brush('pen', 'ultra-small', 'mix', 'black', 10),
  },
  beacon: {
    tower: brush('brush', 'extra-large', 'wet', 'gray_brown', 7, 0.35),
    battlement: brush('brush', 'medium', 'mix', 'black', 6),
    flame: brush('gothic', 'huge', 'wet', 'wine_red', 6, 0.4),
    smoke: brush('brush', 'extra-large', 'effect4', 'light_gray_new', 10),
  },
  wall: {
    course: brush('brush', 'extra-large', 'wet', 'gray_brown', 14),
    merlon: brush('brush', 'medium', 'mix', 'black', 6),
    joint: brush('pen', 'ultra-small', 'sharpen', 'black', 12),
  },
  seal: {
    body: brush('brush', 'huge', 'wet', 'wine_red', 5, 0.5),
    knob: brush('brush', 'medium', 'wet', 'wine_red', 4, 0.4),
    legend: brush('pen', 'ultra-small', 'sharpen', 'white', 5),
  },
  inkstone: {
    slab: brush('brush', 'extra-large', 'wet', 'black', 8),
    pool: brush('brush', 'medium', 'wet', 'sage_gray', 5),
    brush: brush('brush', 'small', 'mix', 'terra_cotta', 8),
    hair: brush('brushSP', 'small', 'wet', 'black', 5),
  },
  lantern: {
    frame: brush('brush', 'extra-large', 'wet', 'wine_red', 6, 0.4),
    rib: brush('pen', 'small', 'sharpen', 'wine_red', 7),
    tassel: brush('brushSP', 'medium', 'wet', 'wine_red', 6),
    flame: brush('gothic', 'medium', 'wet', 'gold_orange', 4),
  },
  cannon: {
    tube: brush('brush', 'large', 'wet', 'black', 8),
    band: brush('brush', 'small', 'mix', 'sage_gray', 5),
    wheel: brush('brush', 'medium', 'mix', 'brown', 6),
    fuse: brush('gothic', 'small', 'wet', 'red', 4),
  },
  treasure: {
    hull: brush('brush', 'huge', 'wet', 'brown', 12),
    sail: brush('brush', 'extra-large', 'wet', 'light_gray_new', 9),
    mast: brush('brush', 'small', 'mix', 'black', 10),
    flag: brush('brush', 'medium', 'wet', 'red', 6),
  },
} as const;

export type HistoryPaintingId = keyof typeof HISTORY_BRUSHES;

type Pt = readonly [number, number];
const line = (a: Pt, b: Pt): Pt[] => [a, b];

function loop(cx: number, cy: number, rx: number, ry: number, n = 16): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TWO_PI;
    out.push([cx + rx * inkCos(a), cy + ry * inkSin(a)]);
  }
  return out;
}

function quad(a: Pt, b: Pt, c: Pt, n = 10): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push([u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]);
  }
  return out;
}

const PAINT: Record<HistoryPaintingId, () => readonly Gesture[]> = {
  dagger: () => [
    { part: 'scroll', path: quad([-120, -20], [-40, -70], [110, -16]) },
    { part: 'scroll', path: quad([-110, 16], [10, -10], [120, 24]) },
    { part: 'roll', path: loop(-124, 0, 16, 28, 12) },
    { part: 'roll', path: loop(124, 4, 14, 26, 12) },
    { part: 'map', path: line([-70, -8], [40, -28]) },
    { part: 'map', path: line([-40, 6], [70, -4]) },
    { part: 'blade', path: line([8, 36], [18, 110]) },
    { part: 'edge', path: line([2, 40], [14, 108]) },
    { part: 'hilt', path: line([-8, 112], [28, 118]) },
  ],
  slip: () => [
    { part: 'strip', path: line([-70, -90], [-62, 100]) },
    { part: 'strip', path: line([-8, -96], [2, 104]) },
    { part: 'strip', path: line([54, -88], [64, 98]) },
    { part: 'tie', path: line([-86, -70], [80, -64]) },
    { part: 'tie', path: line([-84, 72], [82, 78]) },
    { part: 'column', path: line([-66, -40], [-66, 40]) },
    { part: 'column', path: line([0, -48], [2, 46]) },
    { part: 'column', path: line([60, -42], [58, 44]) },
  ],
  ding: () => [
    { part: 'belly', path: loop(0, 10, 78, 52, 18) },
    { part: 'belly', path: quad([-70, 20], [0, 70], [72, 18]) },
    { part: 'leg', path: line([-40, 52], [-48, 110]) },
    { part: 'leg', path: line([0, 58], [2, 118]) },
    { part: 'leg', path: line([42, 52], [50, 110]) },
    { part: 'handle', path: quad([-78, -10], [-110, -40], [-70, -54]) },
    { part: 'handle', path: quad([78, -10], [110, -40], [70, -54]) },
    { part: 'face', path: line([-24, 0], [24, 8]) },
    { part: 'face', path: loop(0, -4, 16, 12, 8) },
  ],
  chariot: () => [
    { part: 'box', path: quad([-70, -20], [-10, -60], [70, -16]) },
    { part: 'box', path: line([-74, -16], [-74, 24]) },
    { part: 'box', path: line([74, -12], [74, 28]) },
    { part: 'wheel', path: loop(-48, 48, 28, 28, 14) },
    { part: 'wheel', path: loop(48, 50, 28, 28, 14) },
    { part: 'spoke', path: line([-48, 20], [-48, 76]) },
    { part: 'spoke', path: line([20, 50], [76, 50]) },
    { part: 'shaft', path: line([74, 0], [150, -20]) },
  ],
  crossbow: () => [
    { part: 'stock', path: line([-90, 10], [70, 6]) },
    { part: 'prod', path: quad([-20, 8], [-10, -50], [36, 10]) },
    { part: 'string', path: line([-16, -36], [8, 8]) },
    { part: 'string', path: line([32, -28], [8, 8]) },
    { part: 'bolt', path: line([8, 4], [78, -6]) },
  ],
  warship: () => [
    { part: 'hull', path: quad([-130, 20], [0, 70], [140, 16]) },
    { part: 'hull', path: line([-120, 16], [130, 10]) },
    { part: 'mast', path: line([-30, 10], [-24, -110]) },
    { part: 'mast', path: line([40, 12], [46, -90]) },
    { part: 'sail', path: quad([-70, -90], [-20, -40], [10, -86]) },
    { part: 'sail', path: quad([16, -70], [50, -24], [86, -66]) },
    { part: 'oar', path: line([-80, 30], [-130, 54]) },
    { part: 'oar', path: line([90, 28], [140, 50]) },
  ],
  beacon: () => [
    { part: 'tower', path: line([-28, 110], [-16, -20]) },
    { part: 'tower', path: line([28, 110], [16, -20]) },
    { part: 'battlement', path: line([-36, -20], [36, -24]) },
    { part: 'flame', path: quad([-10, -28], [0, -80], [16, -30]) },
    { part: 'flame', path: quad([4, -30], [18, -70], [8, -24]) },
    { part: 'smoke', path: quad([0, -70], [30, -120], [10, -150]) },
  ],
  wall: () => [
    { part: 'course', path: line([-160, 40], [160, 36]) },
    { part: 'course', path: line([-160, 10], [160, 6]) },
    { part: 'course', path: line([-160, -20], [160, -24]) },
    { part: 'merlon', path: line([-120, -24], [-120, -70]) },
    { part: 'merlon', path: line([-70, -24], [-70, -78]) },
    { part: 'merlon', path: line([-10, -24], [-10, -72]) },
    { part: 'merlon', path: line([50, -24], [50, -80]) },
    { part: 'merlon', path: line([110, -24], [110, -68]) },
    { part: 'joint', path: line([-160, 70], [160, 66]) },
  ],
  seal: () => [
    { part: 'body', path: line([-46, -40], [46, -40]) },
    { part: 'body', path: line([46, -40], [46, 46]) },
    { part: 'body', path: line([46, 46], [-46, 46]) },
    { part: 'body', path: line([-46, 46], [-46, -40]) },
    { part: 'knob', path: loop(0, -62, 16, 12, 10) },
    { part: 'legend', path: line([-18, -8], [18, 6]) },
    { part: 'legend', path: line([-8, -22], [6, 24]) },
  ],
  inkstone: () => [
    { part: 'slab', path: quad([-90, -20], [0, 40], [100, -10]) },
    { part: 'slab', path: line([-96, -16], [-80, 36]) },
    { part: 'pool', path: loop(-20, 4, 28, 16, 12) },
    { part: 'brush', path: line([40, -40], [110, 20]) },
    { part: 'hair', path: line([104, 12], [124, 36]) },
  ],
  lantern: () => [
    { part: 'frame', path: loop(0, 0, 36, 52, 16) },
    { part: 'rib', path: line([0, -48], [0, 50]) },
    { part: 'rib', path: line([-28, -10], [28, 8]) },
    { part: 'tassel', path: quad([0, 50], [-8, 80], [4, 110]) },
    { part: 'flame', path: quad([-6, -8], [0, -28], [8, -6]) },
  ],
  cannon: () => [
    { part: 'tube', path: line([-80, -10], [70, -28]) },
    { part: 'tube', path: line([-76, 12], [66, -6]) },
    { part: 'band', path: line([20, -24], [24, -2]) },
    { part: 'wheel', path: loop(-40, 36, 22, 22, 12) },
    { part: 'wheel', path: loop(24, 40, 22, 22, 12) },
    { part: 'fuse', path: quad([60, -20], [80, -40], [70, -8]) },
  ],
  treasure: () => [
    { part: 'hull', path: quad([-150, 30], [0, 80], [160, 24]) },
    { part: 'mast', path: line([-60, 20], [-54, -120]) },
    { part: 'mast', path: line([10, 22], [16, -130]) },
    { part: 'mast', path: line([80, 18], [84, -100]) },
    { part: 'sail', path: quad([-100, -90], [-50, -30], [-16, -96]) },
    { part: 'sail', path: quad([-20, -100], [20, -36], [58, -104]) },
    { part: 'sail', path: quad([48, -78], [78, -30], [112, -74]) },
    { part: 'flag', path: quad([16, -130], [40, -118], [18, -108]) },
  ],
};

/** Horizontal wet passes so a prop has a body of ink, not only an outline. */
function bands(part: string, x0: number, x1: number, y0: number, y1: number, rows: number): Gesture[] {
  const out: Gesture[] = [];
  for (let i = 0; i < rows; i++) {
    const t = rows === 1 ? 0.5 : i / (rows - 1);
    const y = y0 + (y1 - y0) * t;
    const inset = (i % 2) * ((x1 - x0) * 0.08);
    const left: Pt = [x0 + inset, y];
    const right: Pt = [x1 - inset, y + ((i % 3) - 1) * 3];
    out.push({ part, path: i % 2 === 0 ? [left, right] : [right, left] });
  }
  return out;
}

const MASS: Readonly<Record<HistoryPaintingId, readonly Gesture[]>> = {
  dagger: bands('scroll', -100, 100, -36, 28, 5),
  slip: bands('strip', -78, 72, -70, 80, 6),
  ding: bands('belly', -70, 70, -24, 48, 6),
  chariot: [...bands('box', -68, 68, -36, 16, 4), ...bands('wheel', -70, 70, 28, 70, 2)],
  crossbow: bands('stock', -80, 64, -8, 22, 3),
  warship: [...bands('hull', -120, 130, 4, 52, 4), ...bands('sail', -64, 4, -88, -36, 4)],
  beacon: [...bands('tower', -24, 24, -10, 100, 5), ...bands('flame', -16, 18, -78, -24, 4)],
  wall: bands('course', -150, 150, -16, 56, 5),
  seal: bands('body', -40, 40, -32, 40, 6),
  inkstone: bands('slab', -80, 90, -16, 28, 4),
  lantern: bands('frame', -28, 28, -40, 42, 6),
  cannon: bands('tube', -74, 64, -22, 8, 4),
  treasure: [...bands('hull', -140, 150, 8, 64, 5), ...bands('sail', -90, 50, -96, -40, 4)],
};

export function paintHistoryShape(id: HistoryPaintingId, at: PropPlacement): PropStroke[] {
  const table = HISTORY_BRUSHES[id] as unknown as Readonly<Record<string, PropBrush>>;
  return strokesFrom(id, table, [...MASS[id], ...PAINT[id]()], at);
}
