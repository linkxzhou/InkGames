import type { InkBlend, InkBrushMode, InkEffect, InkSizeName } from '../core/ink-brush';
import type { InkFinish } from '../core/ink-stroke';
import type { InkColorName } from '../core/ink-palette';

/**
 * One row of the prop brush table: the inkEngine/index.html panel (笔刷 / 尺寸 / 墨效 / 混色 / 颜色)
 * plus the painter's hand.
 *
 * - Wetness and diffusion come from `effect`: mix (0) spreads ink inside the mark, wet (3) darkens and
 *   mottles it, effect4 (4) and hair (5) bleed outward along the force field.
 * - Dryness and flying white come from `effect: 'flyingWhite'` and from `speed`: a faster hand thins the
 *   tip (strokeWidth = size − speed) and leaves more gaps between bristles.
 * - Ink load is `pressure` (stylus 0..1). From the 8th frame, ≥ 0.3 moves one step up inkEngine's size
 *   ladder, ≥ 0.5 two, ≥ 0.7 three; leave it out for a mouse.
 * inkEngine fixes the in-diffusion strength at 0.45 for every stroke, so it is not a column.
 */
export interface PropBrush {
  readonly mode: InkBrushMode;
  readonly size: InkSizeName;
  readonly effect: InkEffect;
  readonly blend: InkBlend;
  readonly color: InkColorName;
  /** Pointer travel per frame, in sheet pixels. */
  readonly speed: number;
  readonly pressure?: number;
  /** flow / distort / metallic, applied after this part's stroke commits. */
  readonly finish?: InkFinish;
}

export type PropPaintingId =
  | 'sword' | 'blade' | 'spear' | 'bow' | 'shield' | 'war-horse' | 'banner' | 'ink-bomb' | 'water-brush' | 'boat'
  | 'water' | 'landscape' | 'figure';

const brush = (
  mode: InkBrushMode, size: InkSizeName, effect: InkEffect, color: InkColorName, speed: number, pressure?: number, blend: InkBlend = 'mix',
): PropBrush => (pressure === undefined ? { mode, size, effect, blend, color, speed } : { mode, size, effect, blend, color, speed, pressure });

function withFinish(row: PropBrush, finish: InkFinish): PropBrush {
  return { ...row, finish };
}

/**
 * Every brush the ten demos paint with, per prop and part. Tune here; prop-paintings.ts only holds paths.
 */
export const PROP_BRUSHES = {
  sword: {
    blade: withFinish(brush('brush', 'medium', 'wet', 'sage_gray', 7), { metallic: { size: 14 } }),
    edge: brush('brush', 'ultra-small', 'flyingWhite', 'black', 15),
    ridge: brush('pen', 'small', 'sharpen', 'black', 11),
    guard: brush('brush', 'medium', 'mix', 'black', 5),
    grip: brush('marker', 'small', 'mix', 'terra_cotta', 4),
    wrap: brush('brush', 'ultra-small', 'sharpen', 'black', 3),
    pommel: brush('brush', 'small', 'mix', 'black', 2, 0.6),
    tassel: brush('brushSP', 'small', 'wet', 'red', 6),
    slash: brush('fly', 'medium', 'flyingWhite', 'black', 22),
    splash: brush('gothic', 'small', 'wet', 'black', 9),
  },
  blade: {
    blade: withFinish(brush('brush', 'large', 'wet', 'sage_gray', 8), { metallic: { size: 16 } }),
    edge: brush('fly', 'small', 'flyingWhite', 'black', 16),
    spine: brush('brush', 'ultra-small', 'sharpen', 'black', 12),
    guard: brush('brush', 'medium', 'mix', 'black', 3, 0.5),
    grip: brush('marker', 'small', 'mix', 'wine_red', 4),
    pommel: brush('brush', 'small', 'mix', 'black', 2, 0.6),
    pool: brush('brush', 'extra-large', 'wet', 'blue', 7),
    poolWarm: brush('brush', 'extra-large', 'wet', 'red', 7),
    slash: brush('brush', 'large', 'wet', 'black', 20),
  },
  spear: {
    shaft: brush('brush', 'medium', 'mix', 'terra_cotta', 11),
    head: withFinish(brush('brush', 'medium', 'mix', 'black', 4), { metallic: { size: 12 } }),
    socket: brush('marker', 'small', 'mix', 'black', 3),
    tassel: brush('brush', 'medium', 'wet', 'red', 5, 0.5),
    target: brush('brush', 'large', 'wet', 'gray_brown', 3),
    thrust: brush('fly', 'small', 'flyingWhite', 'black', 24),
    hit: brush('gothic', 'small', 'wet', 'red', 8),
  },
  bow: {
    limb: brush('brush', 'medium', 'mix', 'brown', 8),
    tip: brush('brush', 'small', 'sharpen', 'black', 3),
    grip: brush('marker', 'small', 'mix', 'terra_cotta', 3),
    string: brush('brush', 'ultra-small', 'sharpen', 'black', 16),
    shaft: brush('brush', 'ultra-small', 'mix', 'black', 14),
    arrowhead: brush('brush', 'small', 'sharpen', 'black', 3, 0.4),
    fletch: brush('fly', 'small', 'flyingWhite', 'wine_red', 6),
    butt: brush('brush', 'extra-large', 'wet', 'gray_brown', 10),
    ring: brush('brush', 'small', 'mix', 'red', 9),
    hit: brush('gothic', 'small', 'wet', 'black', 8),
  },
  shield: {
    wash: brush('brush', 'huge', 'wet', 'gray_brown', 8),
    rim: brush('brush', 'medium', 'mix', 'black', 9),
    boss: brush('brush', 'large', 'mix', 'black', 2, 0.6),
    emblem: brush('brush', 'small', 'wet', 'red', 5),
    rivet: brush('dots', 'small', 'mix', 'black', 6),
    threat: brush('fly', 'small', 'flyingWhite', 'black', 14),
    block: brush('gothic', 'small', 'wet', 'black', 8),
  },
  'war-horse': {
    halo: brush('brush', 'extra-large', 'effect4', 'light_gray_new', 10),
    wash: brush('brush', 'extra-large', 'wet', 'gray_brown', 9, 0.22),
    body: brush('brush', 'large', 'wet', 'dark_gray', 7, 0.22),
    shade: brush('brush', 'small', 'wet', 'black', 6, 0.35),
    contour: brush('brush', 'medium', 'flyingWhite', 'black', 7),
    neck: brush('brush', 'medium', 'wet', 'dark_gray', 6, 0.28),
    head: brush('brush', 'medium', 'flyingWhite', 'black', 4, 0.35),
    ear: brush('brush', 'small', 'sharpen', 'black', 3),
    leg: brush('brush', 'medium', 'flyingWhite', 'black', 5, 0.3),
    hoof: brush('brush', 'small', 'mix', 'black', 2, 0.6),
    mane: brush('brushSP', 'medium', 'flyingWhite', 'black', 8),
    tail: brush('fly', 'large', 'flyingWhite', 'black', 11),
    dust: brush('gothic', 'small', 'wet', 'gray_brown', 10),
  },
  banner: {
    pole: brush('brush', 'small', 'flyingWhite', 'black', 9),
    finial: brush('brush', 'small', 'mix', 'black', 2, 0.6),
    // wine_red is the palette's vermilion; plain `red` thins to pink under a wet extra-large stroke.
    field: brush('brush', 'huge', 'wet', 'wine_red', 6, 0.42),
    cloth: brush('brush', 'extra-large', 'wet', 'brick_red', 7, 0.3),
    grain: brush('brush', 'medium', 'flyingWhite', 'wine_red', 8),
    bleed: brush('brush', 'extra-large', 'effect4', 'wine_red', 8),
    fold: brush('brush', 'small', 'wet', 'red', 6, 0.55),
    hem: brush('brush', 'small', 'mix', 'black', 9),
    streamer: brush('brushSP', 'medium', 'wet', 'wine_red', 8),
    gust: brush('fly', 'small', 'flyingWhite', 'sage_gray', 18),
  },
  'ink-bomb': {
    belly: brush('brush', 'large', 'wet', 'black', 6, 0.4),
    shoulder: brush('brush', 'large', 'mix', 'black', 5),
    neck: brush('brush', 'large', 'mix', 'black', 3),
    rim: brush('brush', 'medium', 'mix', 'black', 4),
    stopper: brush('marker', 'medium', 'mix', 'terra_cotta', 3),
    cord: brush('pen', 'small', 'mix', 'black', 5),
    glaze: brush('fly', 'small', 'flyingWhite', 'white', 5),
    fuse: brush('brush', 'small', 'mix', 'black', 4),
    spark: brush('gothic', 'small', 'mix', 'red', 3),
    burst: brush('gothic', 'large', 'wet', 'black', 12),
    spill: brush('brush', 'extra-large', 'effect4', 'black', 8),
  },
  'water-brush': {
    handle: brush('brush', 'medium', 'mix', 'terra_cotta', 8),
    node: brush('brush', 'ultra-small', 'sharpen', 'black', 3),
    ferrule: brush('marker', 'medium', 'mix', 'black', 3),
    hair: brush('brushSP', 'large', 'wet', 'blue', 4),
    tip: brush('brush', 'small', 'wet', 'blue', 4),
    drip: brush('dots', 'small', 'wet', 'blue', 4),
    stroke: brush('brush', 'extra-large', 'effect4', 'dusty_rose', 12),
  },
  boat: {
    hull: brush('brush', 'extra-large', 'wet', 'light_gray_new', 9),
    keel: brush('brush', 'ultra-small', 'sharpen', 'black', 12),
    canopy: brush('brush', 'large', 'wet', 'gray_brown', 8),
    canopyLine: brush('brush', 'ultra-small', 'mix', 'black', 9),
    oar: brush('brush', 'ultra-small', 'mix', 'black', 12),
    boatman: brush('brush', 'small', 'mix', 'black', 4),
    wake: brush('fly', 'small', 'flyingWhite', 'light_gray_new', 12),
  },
  water: {
    surface: withFinish(brush('brush', 'extra-large', 'effect4', 'dusty_rose', 16), { flow: { blendType: 0, iterations: 4 } }),
    current: brush('fly', 'extra-large', 'mix', 'light_gray_new', 14),
    deep: withFinish(brush('brush', 'extra-large', 'wet', 'light_gray_new', 16), { distort: { displacementB: 20, displacementC: 50, extent: 'stroke' } }),
    tint: brush('brush', 'extra-large', 'wet', 'dusty_rose', 18),
    crest: brush('fly', 'small', 'flyingWhite', 'white', 12),
    ripple: brush('brush', 'ultra-small', 'mix', 'sage_gray', 9),
  },
  landscape: {
    farHill: brush('brush', 'extra-large', 'wet', 'light_gray_new', 12),
    nearHill: brush('brush', 'extra-large', 'wet', 'sage_gray', 16),
    ground: brush('brush', 'large', 'mix', 'black', 16),
    grass: brush('gothic', 'small', 'mix', 'sage_gray', 14),
    post: brush('marker', 'medium', 'mix', 'terra_cotta', 6),
  },
  figure: {
    head: brush('brush', 'medium', 'mix', 'black', 2, 0.5),
    robe: brush('brush', 'large', 'wet', 'dark_gray', 6),
    limb: brush('brush', 'small', 'mix', 'black', 6),
    sash: brush('brush', 'small', 'wet', 'red', 5),
  },
} as const satisfies Readonly<Record<PropPaintingId, Readonly<Record<string, PropBrush>>>>;

export type PropPart<Id extends PropPaintingId> = keyof (typeof PROP_BRUSHES)[Id] & string;
