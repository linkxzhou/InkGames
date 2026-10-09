import { INK_TIP_OFFSET, type InkBrushSettings, type InkPoint } from './ink-brush';
import type { InkColorName } from './ink-palette';

/**
 * Renderer-neutral stroke contracts. The three.js layer (`InkSurface`,
 * `InkScene`) and the prop tables depend on these, so they must not live in a
 * renderer-specific module.
 */

export type InkColor = InkColorName | readonly [number, number, number];

/** flow.frag after the stroke commits. iterations is inkEngine's flowIterations at release. */
export interface InkFlowFinish {
  readonly blendType: number;
  readonly iterations: number;
  /** Replay seed. inkEngine's live button uses Math.random; a recording stores this instead. */
  readonly seed?: number;
}

/** distort.frag. extent 'frame' is inkEngine's full-canvas pass; 'stroke' keeps the rest of the sheet still. */
export interface InkDistortFinish {
  readonly displacementB?: number;
  readonly displacementC?: number;
  readonly extent?: 'frame' | 'stroke';
}

/** metallic.frag on bites scanned from this stroke. tint defaults to the panel value [0.72, 0.5, 0.35]. */
export interface InkMetallicFinish {
  readonly size?: number;
  readonly tint?: readonly [number, number, number];
}

/** Optional post passes, matching the order inkEngine composites them: metallic, then distort, then flow. */
export interface InkFinish {
  readonly flow?: InkFlowFinish;
  readonly distort?: InkDistortFinish;
  readonly metallic?: InkMetallicFinish;
}

/** A stroke the way inkEngine/index.html paints one: panel settings, a colour, one pointer sample per frame. */
export interface InkStrokeRequest {
  readonly brush: InkBrushSettings;
  readonly color: InkColor;
  /** Where the tip should land, one sample per frame (the surface adds inkEngine's tip offset). */
  readonly points: readonly InkPoint[];
  /** p5 random state at pen-down; the host reproduces it with p.randomSeed(seed). */
  readonly seed?: number;
  /** flow / distort / metallic, applied once the stroke has committed. */
  readonly finish?: InkFinish;
}

/** Pointer positions inkEngine needs so its tip lands on `points` (gothic has no tip offset). */
export function inkPointerPath(points: readonly InkPoint[], mode: InkBrushSettings['mode']): InkPoint[] {
  const shift = mode === 'gothic' ? 0 : -INK_TIP_OFFSET;
  return points.map(point => (point.pressure === undefined
    ? { x: point.x + shift, y: point.y + shift }
    : { x: point.x + shift, y: point.y + shift, pressure: point.pressure }));
}
