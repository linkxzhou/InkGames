import type { InkColorName } from './ink-palette';
import { INK_COLOR_NAMES } from './ink-palette';
import type { StrokeCue } from './narrative-types';
import { actionStroke, paintProp, type PropPlacement, type PropStroke } from '../plugins/prop-paintings';
import type { PropPaintingId } from '../plugins/prop-brushes';

const PROPS: readonly string[] = [
  'sword', 'blade', 'spear', 'bow', 'shield', 'war-horse', 'banner', 'ink-bomb', 'water-brush', 'boat',
  'water', 'landscape', 'figure',
];

function isProp(id: string): id is PropPaintingId {
  return PROPS.includes(id);
}

function isColor(name: string): name is InkColorName {
  return (INK_COLOR_NAMES as readonly string[]).includes(name);
}

function placementOf(raw: Readonly<Record<string, number | boolean>>): PropPlacement {
  const placement: {
    x: number; y: number; scale?: number; mirror?: boolean; pose?: number; variant?: number; width?: number;
  } = {
    x: typeof raw.x === 'number' ? raw.x : 0,
    y: typeof raw.y === 'number' ? raw.y : 0,
  };
  if (typeof raw.scale === 'number') placement.scale = raw.scale;
  if (typeof raw.mirror === 'boolean') placement.mirror = raw.mirror;
  if (typeof raw.pose === 'number') placement.pose = raw.pose;
  if (typeof raw.variant === 'number') placement.variant = raw.variant;
  if (typeof raw.width === 'number') placement.width = raw.width;
  return placement;
}

function catmull(points: readonly (readonly [number, number])[]): (readonly [number, number])[] {
  if (points.length < 3) return points.slice();
  const out: (readonly [number, number])[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)] ?? points[i] ?? [0, 0];
    const p1 = points[i] ?? [0, 0];
    const p2 = points[i + 1] ?? p1;
    const p3 = points[Math.min(points.length - 1, i + 2)] ?? p2;
    const steps = 8;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push([x, y]);
    }
  }
  const last = points[points.length - 1];
  if (last) out.push(last);
  return out;
}

/** Pointer samples along a polyline. Speed is pixels per sample. */
export function samplePolyline(points: readonly (readonly [number, number])[], speed: number): { x: number; y: number }[] {
  const first = points[0];
  if (!first) return [];
  const step = speed > 0.5 ? speed : 0.5;
  const out = [{ x: first[0], y: first[1] }];
  for (let i = 1; i < points.length; i++) {
    const next = points[i];
    const prev = out[out.length - 1];
    if (!next || !prev) continue;
    let x0 = prev.x;
    let y0 = prev.y;
    let dx = next[0] - x0;
    let dy = next[1] - y0;
    let dist = Math.sqrt(dx * dx + dy * dy);
    while (dist >= step) {
      const t = step / dist;
      x0 += dx * t;
      y0 += dy * t;
      out.push({ x: x0, y: y0 });
      dx = next[0] - x0;
      dy = next[1] - y0;
      dist = Math.sqrt(dx * dx + dy * dy);
    }
  }
  return out;
}

export function resolveStrokeCue(cue: StrokeCue): PropStroke[] {
  const source = cue.source;
  if ('recording' in source) return [];
  if ('prop' in source) {
    if (!isProp(source.prop)) return [];
    const parts = source.parts;
    return paintProp(source.prop, placementOf(source.placement)).filter(stroke => !parts || parts.includes(stroke.part));
  }
  const dot = source.brush.indexOf('.');
  if (dot <= 0) return [];
  const prop = source.brush.slice(0, dot);
  const part = source.brush.slice(dot + 1);
  if (!isProp(prop)) return [];
  const path = source.path.type === 'catmull' ? catmull(source.path.points) : source.path.points;
  const stroke = actionStroke(prop, part, path, cue.seed ?? 0);
  if (!stroke) return [];
  const points = samplePolyline(path, source.speed);
  const color = isColor(source.color) ? source.color : stroke.color;
  return [{ ...stroke, points, color, seed: cue.seed ?? stroke.seed }];
}
