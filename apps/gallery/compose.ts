import {
  paintHistoryProp, paintProp,
  type InkColorName, type InkEffect, type InkSizeName, type InkSurface, type PropStroke,
} from '@inkgames/engine';

/** Square plate, same aspect as the reference PNGs. */
export const PLATE = 720;

interface Pt { readonly x: number; readonly y: number; }
type SizeName = 'small' | 'medium' | 'large' | 'extra-large';

function lay(surface: InkSurface, strokes: readonly PropStroke[]): void {
  for (const stroke of strokes) {
    surface.paint({
      brush: stroke.brush,
      color: stroke.color,
      points: stroke.points,
      seed: stroke.seed,
      ...(stroke.finish ? { finish: stroke.finish } : {}),
    });
  }
}

function mark(
  surface: InkSurface,
  color: InkColorName,
  points: readonly Pt[],
  seed: number,
  size: InkSizeName = 'large',
  effect: InkEffect = 'wet',
  mode: 'brush' | 'fly' | 'gothic' | 'brushSP' | 'pen' = 'brush',
): void {
  if (points.length < 2) return;
  surface.paint({ brush: { mode, size, effect, blend: 'mix' }, color, points, seed });
}

function quad(a: Pt, b: Pt, c: Pt, n = 14): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * b.x + t * t * c.x,
      y: u * u * a.y + 2 * u * t * b.y + t * t * c.y,
    });
  }
  return out;
}

function cubic(a: Pt, b: Pt, c: Pt, d: Pt, n = 16): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push({
      x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
      y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
    });
  }
  return out;
}

/** Four-cubic oval. Kappa keeps it round without a trig call. */
function oval(cx: number, cy: number, rx: number, ry: number): Pt[] {
  const k = 0.5522847498;
  const kx = rx * k;
  const ky = ry * k;
  return [
    ...cubic({ x: cx + rx, y: cy }, { x: cx + rx, y: cy - ky }, { x: cx + kx, y: cy - ry }, { x: cx, y: cy - ry }),
    ...cubic({ x: cx, y: cy - ry }, { x: cx - kx, y: cy - ry }, { x: cx - rx, y: cy - ky }, { x: cx - rx, y: cy }),
    ...cubic({ x: cx - rx, y: cy }, { x: cx - rx, y: cy + ky }, { x: cx - kx, y: cy + ry }, { x: cx, y: cy + ry }),
    ...cubic({ x: cx, y: cy + ry }, { x: cx + kx, y: cy + ry }, { x: cx + rx, y: cy + ky }, { x: cx + rx, y: cy }, 10),
  ];
}

function ridge(cx: number, base: number, top: number, half: number): Pt[] {
  return [
    { x: cx - half, y: base },
    { x: cx - half * 0.42, y: top + (base - top) * 0.28 },
    { x: cx - half * 0.08, y: top },
    { x: cx + half * 0.16, y: top + (base - top) * 0.18 },
    { x: cx + half * 0.55, y: top + (base - top) * 0.42 },
    { x: cx + half, y: base },
  ];
}

interface FigureOptions {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly lean?: number;
  /** 0 standing, 1 arms raised, 2 seated. */
  readonly pose?: number;
  readonly seed?: number;
  readonly mirror?: boolean;
}

/** A body built from wet washes, a dry contour, and a vermilion sash. */
function figure(surface: InkSurface, options: FigureOptions): void {
  const pose = options.pose ?? 0;
  const h = options.height;
  const lean = options.lean ?? 0;
  const flip = options.mirror ? -1 : 1;
  const seed = options.seed ?? 1;
  const x = options.x;
  const foot = options.y;
  const headY = foot - h * (pose === 2 ? 0.72 : 0.86);
  const shoulder = foot - h * (pose === 2 ? 0.58 : 0.62);
  const hip = foot - h * (pose === 2 ? 0.28 : 0.34);
  const hem = pose === 2 ? foot - h * 0.08 : foot;
  const robeW = h * (pose === 2 ? 0.42 : 0.34);
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const side = (t - 0.5) * 2;
    const x0 = x + flip * (side * robeW * 0.55 + lean * 8);
    const x1 = x + flip * (side * robeW + lean * 18);
    const color: InkColorName = i % 4 === 0 ? 'black' : i % 4 === 1 ? 'dark_gray' : i % 4 === 2 ? 'sage_gray' : 'gray_brown';
    const size: SizeName = i % 3 === 0 ? 'extra-large' : 'large';
    mark(surface, color, quad(
      { x: x0, y: shoulder + (i % 3) * 4 },
      { x: x + flip * (side * robeW * 0.8 + lean * 12), y: (shoulder + hip) / 2 },
      { x: x1, y: hem - (i % 2) * 6 },
    ), seed + i, size, i % 5 === 0 ? 'effect4' : 'wet');
  }
  mark(surface, 'black', quad(
    { x: x - flip * robeW * 0.95, y: shoulder + 8 },
    { x: x - flip * robeW * 0.2, y: hip },
    { x: x + flip * robeW * 0.15, y: hem },
  ), seed + 20, 'medium', 'flyingWhite');
  mark(surface, 'black', quad(
    { x: x + flip * robeW * 0.9, y: shoulder + 6 },
    { x: x + flip * robeW * 0.2, y: hip + 10 },
    { x: x - flip * 4, y: hem - 4 },
  ), seed + 21, 'small', 'flyingWhite');
  mark(surface, 'wine_red', [
    { x: x - flip * robeW * 0.7, y: shoulder + h * 0.08 },
    { x: x + flip * 6, y: shoulder + h * 0.16 },
    { x: x + flip * robeW * 0.55, y: shoulder + h * 0.1 },
  ], seed + 22, 'medium', 'wet');
  mark(surface, 'black', oval(x + flip * lean * 4, headY, h * 0.075, h * 0.09), seed + 23, 'medium', 'wet');
  mark(surface, 'dark_gray', oval(x + flip * lean * 4, headY - h * 0.02, h * 0.09, h * 0.05), seed + 24, 'small', 'flyingWhite');
  const arm = pose === 1 ? -h * 0.42 : pose === 2 ? -h * 0.02 : -h * 0.08;
  mark(surface, 'dark_gray', quad(
    { x: x - flip * 8, y: shoulder },
    { x: x - flip * h * 0.22, y: shoulder + arm },
    { x: x - flip * h * (pose === 1 ? 0.34 : 0.28), y: shoulder + arm * 0.35 },
  ), seed + 25, 'medium', 'wet');
  mark(surface, 'black', quad(
    { x: x + flip * 10, y: shoulder + 4 },
    { x: x + flip * h * 0.24, y: shoulder + (pose === 1 ? -h * 0.36 : h * 0.02) },
    { x: x + flip * h * (pose === 1 ? 0.16 : 0.32), y: shoulder + (pose === 1 ? -h * 0.5 : h * 0.12) },
  ), seed + 26, 'medium', 'mix');
  if (pose !== 2) {
    mark(surface, 'black', quad(
      { x: x - flip * robeW * 0.2, y: hip },
      { x: x - flip * robeW * 0.38, y: foot - h * 0.08 },
      { x: x - flip * robeW * 0.22, y: foot },
    ), seed + 27, 'medium', 'wet');
    mark(surface, 'dark_gray', quad(
      { x: x + flip * robeW * 0.12, y: hip },
      { x: x + flip * robeW * 0.28, y: foot - h * 0.1 },
      { x: x + flip * robeW * 0.16, y: foot },
    ), seed + 28, 'small', 'flyingWhite');
  }
}

function peaks(surface: InkSurface, y: number, seed: number, dark: boolean): void {
  const color: InkColorName = dark ? 'dark_gray' : 'light_gray_new';
  const size: SizeName = dark ? 'extra-large' : 'extra-large';
  const tops = dark
    ? [[80, 150], [210, 90], [360, 120], [520, 70], [660, 130]]
    : [[40, 180], [180, 120], [320, 160], [470, 100], [640, 150]];
  tops.forEach(([cx, lift], index) => {
    const path = ridge(cx ?? 0, y, y - (lift ?? 80), dark ? 120 : 150);
    mark(surface, color, path, seed + index, size, dark ? 'wet' : 'effect4');
    mark(surface, dark ? 'black' : 'sage_gray', path, seed + 40 + index, 'small', 'flyingWhite');
  });
}

function mist(surface: InkSurface, y: number, seed: number): void {
  for (let i = 0; i < 3; i++) {
    const path: Pt[] = [];
    for (let x = -20; x <= PLATE + 20; x += 36) {
      path.push({ x, y: y + (i * 14) + ((x / 80) % 2) * 8 });
    }
    mark(surface, i === 1 ? 'light_gray_new' : 'sage_gray', path, seed + i, 'extra-large', 'effect4');
  }
}

function splash(surface: InkSurface, x: number, y: number, seed: number, count = 8): void {
  for (let i = 0; i < count; i++) {
    const dx = ((i * 37) % 17) - 8;
    const dy = ((i * 19) % 13) - 6;
    mark(surface, i % 3 === 0 ? 'black' : 'dark_gray', [
      { x: x + dx * 4, y: y + dy * 3 },
      { x: x + dx * 9, y: y + dy * 8 - 18 },
      { x: x + dx * 3 + 10, y: y + 16 + (i % 4) * 6 },
    ], seed + i, i % 2 === 0 ? 'large' : 'medium', 'wet', 'gothic');
  }
}

function pine(surface: InkSurface, x: number, y: number, h: number, seed: number): void {
  mark(surface, 'black', [
    { x, y }, { x: x + 6, y: y - h * 0.45 }, { x: x - 4, y: y - h },
  ], seed, 'medium', 'mix');
  for (let i = 0; i < 7; i++) {
    const ty = y - h * 0.35 - i * h * 0.09;
    const span = h * 0.22 - i * 6;
    mark(surface, 'dark_gray', [
      { x: x - span, y: ty + 10 }, { x, y: ty }, { x: x + span, y: ty + 12 },
    ], seed + 3 + i, 'medium', 'flyingWhite');
  }
}

function sky(surface: InkSurface, seed: number): void {
  const bands = [46, 92, 138, 190, 250];
  bands.forEach((y, index) => {
    const path: Pt[] = [];
    const reach = index % 2 === 0 ? PLATE - 40 : 80;
    const from = index % 2 === 0 ? 30 : PLATE - 30;
    const step = index % 2 === 0 ? 48 : -48;
    for (let x = from; index % 2 === 0 ? x < reach : x > 80; x += step) {
      path.push({ x, y: y + ((x / 60) % 3) * 10 });
    }
    mark(surface, index % 2 === 0 ? 'black' : 'dark_gray', path, seed + index, index === 0 ? 'extra-large' : 'large', 'wet');
  });
  splash(surface, 180, 80, seed + 20, 6);
  splash(surface, 520, 120, seed + 40, 7);
  mist(surface, 230, seed + 60);
}

function stones(surface: InkSurface): void {
  const specs: readonly { x: number; y: number; c: InkColorName; s: number }[] = [
    { x: 140, y: 520, c: 'wine_red', s: 31 },
    { x: 250, y: 560, c: 'blue_dark', s: 32 },
    { x: 390, y: 540, c: 'gold_orange', s: 33 },
    { x: 500, y: 580, c: 'green', s: 34 },
    { x: 600, y: 530, c: 'terra_cotta', s: 35 },
  ];
  for (const spec of specs) {
    mark(surface, spec.c, oval(spec.x, spec.y, 46, 32), spec.s, 'extra-large', 'wet');
    mark(surface, 'black', oval(spec.x, spec.y, 48, 34), spec.s + 10, 'small', 'flyingWhite');
    splash(surface, spec.x, spec.y - 10, spec.s + 20, 3);
  }
}

/** 上古-混沌-1: layered ranges, a large seated figure, pine, waterfall, water, and mist gaps. */
export function paintChaos1(surface: InkSurface): void {
  peaks(surface, 300, 11, false);
  mist(surface, 250, 21);
  peaks(surface, 390, 31, true);
  pine(surface, 92, 560, 220, 41);
  figure(surface, { x: 300, y: 600, height: 280, pose: 2, lean: -0.2, seed: 51 });
  for (let i = 0; i < 6; i++) {
    mark(surface, i % 2 === 0 ? 'sage_gray' : 'light_gray_new', [
      { x: 430 + (i % 3) * 8, y: 180 },
      { x: 448 + i * 4, y: 340 },
      { x: 424 + (i % 2) * 12, y: 520 },
    ], 70 + i, 'large', i % 2 === 0 ? 'wet' : 'flyingWhite');
  }
  lay(surface, paintHistoryProp('water', { x: 0, y: 600, scale: 1, width: PLATE }));
  splash(surface, 250, 430, 90, 5);
}

/** 上古-混沌-2: one large figure holding the sky, faint ranges, wide 留白. */
export function paintChaos2(surface: InkSurface): void {
  mist(surface, 120, 8);
  peaks(surface, 560, 18, false);
  figure(surface, { x: 360, y: 620, height: 460, pose: 1, lean: 0.1, seed: 28 });
  mark(surface, 'light_gray_new', [
    { x: 80, y: 80 }, { x: 250, y: 48 }, { x: 470, y: 70 }, { x: 660, y: 40 },
  ], 48, 'extra-large', 'effect4');
  splash(surface, 360, 160, 58, 4);
}

/** 上古-混沌-3: two figures, rocks, water along the bottom. */
export function paintChaos3(surface: InkSurface): void {
  peaks(surface, 280, 12, false);
  mist(surface, 240, 22);
  mark(surface, 'dark_gray', oval(160, 430, 90, 50), 33, 'extra-large', 'wet');
  mark(surface, 'black', oval(150, 440, 70, 36), 34, 'medium', 'flyingWhite');
  mark(surface, 'gray_brown', oval(520, 470, 110, 46), 35, 'extra-large', 'effect4');
  mark(surface, 'black', ridge(500, 500, 390, 120), 36, 'small', 'flyingWhite');
  figure(surface, { x: 250, y: 560, height: 250, pose: 0, lean: -0.3, seed: 44 });
  figure(surface, { x: 470, y: 540, height: 180, pose: 2, lean: 0.4, seed: 64, mirror: true });
  lay(surface, paintHistoryProp('water', { x: 0, y: 600, scale: 1, width: PLATE }));
}

/** 上古-混沌-4: a figure mending the sky, five coloured stones. */
export function paintChaos4(surface: InkSurface): void {
  for (let i = 0; i < 4; i++) {
    const path: Pt[] = [];
    for (let x = 20; x < PLATE; x += 40) path.push({ x, y: 70 + i * 28 + (x % 80) / 10 });
    mark(surface, i % 2 === 0 ? 'sage_gray' : 'light_gray_new', path, 80 + i, 'extra-large', 'wet');
  }
  figure(surface, { x: 340, y: 430, height: 300, pose: 1, seed: 90 });
  stones(surface);
  splash(surface, 360, 200, 110, 6);
}

/** 楚汉: smoky sky, two foreground generals, an army, banners, splash, river. */
export function paintChuhan(surface: InkSurface): void {
  sky(surface, 200);
  peaks(surface, 340, 220, false);
  mist(surface, 300, 240);
  lay(surface, paintProp('war-horse', { x: 210, y: 500, scale: 0.95, pose: 0 }));
  lay(surface, paintProp('war-horse', { x: 520, y: 510, scale: 0.9, pose: 1, mirror: true }));
  figure(surface, { x: 230, y: 470, height: 230, pose: 0, lean: -0.15, seed: 260 });
  figure(surface, { x: 500, y: 478, height: 220, pose: 0, lean: 0.2, seed: 280, mirror: true });
  lay(surface, paintProp('banner', { x: 120, y: 300, scale: 0.62, pose: -0.4 }));
  lay(surface, paintProp('banner', { x: 600, y: 290, scale: 0.58, pose: 0.5, mirror: true }));
  lay(surface, paintProp('spear', { x: 300, y: 390, scale: 0.55 }));
  lay(surface, paintProp('sword', { x: 430, y: 400, scale: 0.5, mirror: true }));
  for (let i = 0; i < 8; i++) {
    const x = 70 + i * 78;
    figure(surface, { x, y: 400, height: 70 + (i % 3) * 8, pose: 0, seed: 300 + i * 3, lean: i % 2 === 0 ? -0.2 : 0.2 });
    if (i % 2 === 0) lay(surface, paintProp('banner', { x, y: 330, scale: 0.22, pose: i % 4 === 0 ? -0.3 : 0.3 }));
  }
  lay(surface, paintHistoryProp('water', { x: 0, y: 620, scale: 1, width: PLATE }));
  splash(surface, 360, 180, 360, 10);
  splash(surface, 240, 420, 380, 6);
  splash(surface, 520, 400, 400, 6);
  mark(surface, 'wine_red', oval(660, 80, 18, 22), 420, 'large', 'wet');
}
