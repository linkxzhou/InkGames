/**
 * Vector ink sheets (`inkgames.vector-ink`).
 *
 * Game scenes and opening storyboards share this file format with the gallery.
 * Paths are hand-authored outlines. The compiler only does arithmetic and
 * square roots, then emits `InkStrokeRequest`s for the inkEngine-derived brush.
 * It never reads a reference bitmap.
 */

import { INK_EFFECTS, INK_SIZES, type InkBrushSettings, type InkEffect, type InkPoint, type InkSizeName } from './ink-brush';
import { INK_COLOR_NAMES, type InkColorName } from './ink-palette';
import type { InkStrokeRequest } from './ink-stroke';

export type VectorInkRole = 'contour' | 'fill' | 'hatch' | 'accent' | 'wash';

export interface VectorInkPath {
  readonly id: string;
  readonly role: VectorInkRole;
  readonly color: InkColorName;
  /** SVG path data: M/L/H/V/C/Q/Z, absolute or relative. Arcs are rejected. */
  readonly d: string;
  readonly size?: InkSizeName;
  readonly effect?: InkEffect;
  /** Parallel or inset copies. Clamped to 1..4. */
  readonly layers?: number;
  readonly seed?: number;
}

export interface VectorInkSheet {
  readonly format: 'inkgames.vector-ink';
  readonly version: 1;
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly paths: readonly VectorInkPath[];
}

/** Target sheet in pixels. Paths are scaled from the file's width and height. */
export interface VectorInkFit {
  readonly width: number;
  readonly height: number;
}

export interface InkRasterScore {
  readonly rgbMean: number;
  readonly rgbMax: number;
  /** Mean SSIM of 16px luminance windows. 1 is identical. */
  readonly ssim: number;
  /** Mean absolute difference of luminance gradient magnitudes. */
  readonly edgeMean: number;
}

interface Pt { readonly x: number; readonly y: number; }
interface Poly { readonly points: Pt[]; readonly closed: boolean; }

const ROLES: readonly VectorInkRole[] = ['contour', 'fill', 'hatch', 'accent', 'wash'];
const SIZES = Object.keys(INK_SIZES);
const EFFECTS = Object.keys(INK_EFFECTS);

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRole(value: string): value is VectorInkRole {
  return (ROLES as readonly string[]).includes(value);
}

function isSize(value: string): value is InkSizeName {
  return SIZES.includes(value);
}

function isEffect(value: string): value is InkEffect {
  return EFFECTS.includes(value);
}

function isColor(value: string): value is InkColorName {
  return (INK_COLOR_NAMES as readonly string[]).includes(value);
}

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

function q(value: number): number {
  return Math.round(value * 4) / 4;
}

/** Parse a vector-ink JSON value. Rejects arcs and anything that is not a path sheet. */
export function parseVectorInk(value: unknown): VectorInkSheet {
  if (!isRecord(value)) fail('矢量墨稿不是对象');
  if (value.format !== 'inkgames.vector-ink') fail('矢量墨稿格式不对');
  if (value.version !== 1) fail('矢量墨稿版本不对');
  if (typeof value.id !== 'string' || value.id.length === 0) fail('矢量墨稿缺少编号');
  if (typeof value.width !== 'number' || !(value.width > 0)) fail('矢量墨稿宽度不对');
  if (typeof value.height !== 'number' || !(value.height > 0)) fail('矢量墨稿高度不对');
  if (!Array.isArray(value.paths) || value.paths.length === 0) fail('矢量墨稿缺少路径');
  const paths: VectorInkPath[] = [];
  const seen = new Set<string>();
  for (const raw of value.paths) {
    if (!isRecord(raw)) fail('矢量路径不是对象');
    if (typeof raw.id !== 'string' || raw.id.length === 0) fail('矢量路径缺少编号');
    if (seen.has(raw.id)) fail(`矢量路径重复 ${raw.id}`);
    seen.add(raw.id);
    if (typeof raw.role !== 'string' || !isRole(raw.role)) fail(`未知墨路 ${String(raw.id)}`);
    if (typeof raw.color !== 'string' || !isColor(raw.color)) fail(`未知墨色 ${String(raw.id)}`);
    if (typeof raw.d !== 'string' || raw.d.trim().length === 0) fail(`路径 ${String(raw.id)} 是空的`);
    const path: VectorInkPath = { id: raw.id, role: raw.role, color: raw.color, d: raw.d };
    let next: VectorInkPath = path;
    if (raw.size !== undefined) {
      if (typeof raw.size !== 'string' || !isSize(raw.size)) fail(`未知笔宽 ${raw.id}`);
      next = { ...next, size: raw.size };
    }
    if (raw.effect !== undefined) {
      if (typeof raw.effect !== 'string' || !isEffect(raw.effect)) fail(`未知墨效 ${raw.id}`);
      next = { ...next, effect: raw.effect };
    }
    if (raw.layers !== undefined) {
      if (typeof raw.layers !== 'number' || raw.layers < 1 || raw.layers > 4) fail(`墨层数不对 ${raw.id}`);
      next = { ...next, layers: Math.round(raw.layers) };
    }
    if (raw.seed !== undefined) {
      if (typeof raw.seed !== 'number' || !Number.isFinite(raw.seed)) fail(`种子不对 ${raw.id}`);
      next = { ...next, seed: raw.seed };
    }
    parseDraw(next.d, next.id);
    paths.push(next);
  }
  return { format: 'inkgames.vector-ink', version: 1, id: value.id, width: value.width, height: value.height, paths };
}

function parseDraw(d: string, id: string): Poly[] {
  const polys: Poly[] = [];
  let i = 0;
  let op = '';
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let current: Pt[] | null = null;
  let closed = false;

  const skip = (): void => {
    while (i < d.length) {
      const ch = d[i];
      if (ch !== ' ' && ch !== ',' && ch !== '\n' && ch !== '\t' && ch !== '\r') break;
      i += 1;
    }
  };
  const hasNum = (): boolean => {
    skip();
    const ch = d[i] ?? '';
    return /[+-.\d]/.test(ch);
  };
  const readNum = (): number => {
    skip();
    const match = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(d.slice(i));
    if (!match) fail(`路径 ${id} 写不开`);
    i += match[0].length;
    return Number(match[0]);
  };
  const flush = (): void => {
    if (current && current.length >= 2) polys.push({ points: current, closed });
    current = null;
    closed = false;
  };
  const lineTo = (x: number, y: number): void => {
    if (!current) fail(`路径 ${id} 写不开`);
    current.push({ x, y });
    cx = x;
    cy = y;
  };
  const cubic = (x1: number, y1: number, x2: number, y2: number, x: number, y: number): void => {
    const x0 = cx;
    const y0 = cy;
    for (let s = 1; s <= 10; s++) {
      const t = s / 10;
      const u = 1 - t;
      lineTo(
        u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x,
        u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y,
      );
    }
  };
  const quad = (x1: number, y1: number, x: number, y: number): void => {
    const x0 = cx;
    const y0 = cy;
    for (let s = 1; s <= 8; s++) {
      const t = s / 8;
      const u = 1 - t;
      lineTo(u * u * x0 + 2 * u * t * x1 + t * t * x, u * u * y0 + 2 * u * t * y1 + t * t * y);
    }
  };

  while (i < d.length) {
    skip();
    if (i >= d.length) break;
    const ch = d[i] ?? '';
    if (/[A-Za-z]/.test(ch)) {
      op = ch;
      i += 1;
    } else if (!op) {
      fail(`路径 ${id} 写不开`);
    }
    const rel = op === op.toLowerCase();
    const cmd = op.toUpperCase();
    if (cmd === 'S' || cmd === 'T' || cmd === 'A') fail(`路径 ${id} 不用圆弧`);
    if (cmd === 'Z') {
      if (!current) fail(`路径 ${id} 写不开`);
      lineTo(sx, sy);
      closed = true;
      flush();
      cx = sx;
      cy = sy;
      continue;
    }
    if (!hasNum()) fail(`路径 ${id} 写不开`);
    if (cmd === 'M') {
      flush();
      const x = readNum() + (rel ? cx : 0);
      const y = readNum() + (rel ? cy : 0);
      current = [{ x, y }];
      closed = false;
      cx = x;
      cy = y;
      sx = x;
      sy = y;
      op = rel ? 'l' : 'L';
      while (hasNum()) lineTo(readNum() + (rel ? cx : 0), readNum() + (rel ? cy : 0));
    } else if (cmd === 'L') {
      lineTo(readNum() + (rel ? cx : 0), readNum() + (rel ? cy : 0));
    } else if (cmd === 'H') {
      lineTo(readNum() + (rel ? cx : 0), cy);
    } else if (cmd === 'V') {
      lineTo(cx, readNum() + (rel ? cy : 0));
    } else if (cmd === 'C') {
      const ox = cx;
      const oy = cy;
      cubic(
        readNum() + (rel ? ox : 0), readNum() + (rel ? oy : 0),
        readNum() + (rel ? ox : 0), readNum() + (rel ? oy : 0),
        readNum() + (rel ? ox : 0), readNum() + (rel ? oy : 0),
      );
    } else if (cmd === 'Q') {
      const ox = cx;
      const oy = cy;
      quad(readNum() + (rel ? ox : 0), readNum() + (rel ? oy : 0), readNum() + (rel ? ox : 0), readNum() + (rel ? oy : 0));
    } else {
      fail(`路径 ${id} 写不开`);
    }
  }
  flush();
  if (polys.length === 0) fail(`路径 ${id} 是空的`);
  return polys;
}

function signedArea(points: readonly Pt[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    if (!a || !b) continue;
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

function leftNormal(dx: number, dy: number): Pt {
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: -dy / len, y: dx / len };
}

function ringOf(points: readonly Pt[]): Pt[] {
  const out = points.slice();
  const a = out[0];
  const b = out[out.length - 1];
  if (a && b && out.length >= 2 && Math.abs(a.x - b.x) < 0.8 && Math.abs(a.y - b.y) < 0.8) out.pop();
  return out;
}

/** Inward offset when the shoelace area is positive (y-down, clockwise on screen). */
function offsetPoly(points: readonly Pt[], dist: number, closed: boolean): Pt[] {
  const src = ringOf(points);
  const n = src.length;
  if (n < 2) return src;
  const inward = signedArea(src) >= 0 ? 1 : -1;
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const curr = src[i];
    if (!curr) continue;
    if (!closed || n < 3) {
      const a = src[Math.max(0, i - 1)];
      const b = src[Math.min(n - 1, i + 1)];
      if (!a || !b) continue;
      const edge = i === 0 ? leftNormal((b.x - curr.x), (b.y - curr.y)) : leftNormal(curr.x - a.x, curr.y - a.y);
      out.push({ x: curr.x + edge.x * dist * inward, y: curr.y + edge.y * dist * inward });
      continue;
    }
    const prev = src[(i - 1 + n) % n];
    const next = src[(i + 1) % n];
    if (!prev || !next) continue;
    const n0 = leftNormal(curr.x - prev.x, curr.y - prev.y);
    const n1 = leftNormal(next.x - curr.x, next.y - curr.y);
    let bx = n0.x + n1.x;
    let by = n0.y + n1.y;
    const bl = Math.sqrt(bx * bx + by * by);
    if (bl < 1e-4) {
      bx = n0.x;
      by = n0.y;
    } else {
      bx /= bl;
      by /= bl;
    }
    const dot = bx * n0.x + by * n0.y;
    const miter = dot > 0.35 ? dist / dot : dist;
    const use = Math.min(miter, dist * 2);
    out.push({ x: curr.x + bx * use * inward, y: curr.y + by * use * inward });
  }
  return out;
}

function resample(points: readonly Pt[], step: number, max: number): Pt[] {
  const first = points[0];
  if (!first) return [];
  const out: Pt[] = [{ x: first.x, y: first.y }];
  const pace = step > 1 ? step : 1;
  for (let i = 1; i < points.length; i++) {
    const next = points[i];
    if (!next) continue;
    let prev = out[out.length - 1];
    if (!prev) continue;
    let dx = next.x - prev.x;
    let dy = next.y - prev.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    while (dist >= pace && out.length < max) {
      const t = pace / dist;
      const x = prev.x + dx * t;
      const y = prev.y + dy * t;
      out.push({ x, y });
      prev = out[out.length - 1];
      if (!prev) break;
      dx = next.x - prev.x;
      dy = next.y - prev.y;
      dist = Math.sqrt(dx * dx + dy * dy);
    }
  }
  const last = points[points.length - 1];
  const tail = out[out.length - 1];
  if (last && tail && out.length < max && (Math.abs(last.x - tail.x) > 0.5 || Math.abs(last.y - tail.y) > 0.5)) {
    out.push({ x: last.x, y: last.y });
  }
  return out;
}

function inside(points: readonly Pt[], x: number, y: number): boolean {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const pi = points[i];
    const pj = points[j];
    if (!pi || !pj || pi.y === pj.y) continue;
    if ((pi.y > y) !== (pj.y > y) && x < ((pj.x - pi.x) * (y - pi.y)) / (pj.y - pi.y) + pi.x) hit = !hit;
  }
  return hit;
}

function interiorColumns(points: readonly Pt[]): Pt[][] {
  const ring = ringOf(points);
  if (ring.length < 3) return [];
  let minX = ring[0]?.x ?? 0;
  let maxX = minX;
  let minY = ring[0]?.y ?? 0;
  let maxY = minY;
  for (const p of ring) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const columns: Pt[][] = [];
  // Large wet strokes are only a few dozen pixels wide, so the columns have to overlap.
  const n = Math.max(2, Math.min(16, Math.round((maxX - minX) / 18)));
  for (let c = 1; c <= n; c++) {
    const x = minX + ((maxX - minX) * c) / (n + 1);
    const run: Pt[] = [];
    const span = maxY - minY;
    const samples = span > 12 ? 28 : 8;
    for (let s = 0; s <= samples; s++) {
      const y = minY + (span * s) / samples;
      if (inside(ring, x, y)) run.push({ x, y });
      else if (run.length >= 2) break;
    }
    if (run.length >= 2) columns.push(resample(run, 8, 16));
  }
  return columns;
}

function hatchLines(points: readonly Pt[], closed: boolean, seed: number): Pt[][] {
  const ring = closed ? [...ringOf(points), ringOf(points)[0]].filter((p): p is Pt => p !== undefined) : points;
  const lines: Pt[][] = [];
  let walked = 0;
  let nextAt = 10;
  for (let i = 1; i < ring.length && lines.length < 6; i++) {
    const a = ring[i - 1];
    const b = ring[i];
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) {
      walked += dist;
      continue;
    }
    while (lines.length < 6 && nextAt <= walked + dist) {
      const t = (nextAt - walked) / dist;
      const x = a.x + dx * t;
      const y = a.y + dy * t;
      const tx = dx / dist;
      const ty = dy / dist;
      const jitter = ((seed + lines.length * 5) % 7) - 3;
      const half = 16;
      lines.push([
        { x: x - tx * half - ty * jitter, y: y - ty * half + tx * jitter },
        { x: x - tx * 4 - ty * jitter, y: y - ty * 4 + tx * jitter },
        { x: x + tx * half - ty * jitter, y: y + ty * half + tx * jitter },
      ]);
      nextAt += 18;
    }
    walked += dist;
  }
  if (lines.length === 0 && ring.length >= 2) {
    const a = ring[0];
    const b = ring[ring.length - 1];
    if (a && b) lines.push([a, b]);
  }
  return lines;
}

function pressureOf(count: number, seed: number, profile: 'tail' | 'dry' | 'wet'): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = count <= 1 ? 0.5 : i / (count - 1);
    const wobble = ((seed + i * 3) % 5) * 0.02;
    let value = 0.4;
    if (profile === 'wet') value = 0.22 + wobble;
    else if (profile === 'dry') value = 0.42 - t * 0.22 + wobble;
    else {
      const env = t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1;
      value = 0.18 + env * 0.28 + wobble;
    }
    out.push(Math.round(Math.min(0.48, Math.max(0.12, value)) * 100) / 100);
  }
  return out;
}

function brushFor(path: VectorInkPath): InkBrushSettings {
  if (path.role === 'contour') return { mode: 'brush', size: path.size ?? 'medium', effect: path.effect ?? 'flyingWhite', blend: 'mix' };
  if (path.role === 'fill') return { mode: 'brush', size: path.size ?? 'extra-large', effect: path.effect ?? 'wet', blend: 'mix' };
  if (path.role === 'hatch') return { mode: 'brush', size: path.size ?? 'small', effect: path.effect ?? 'flyingWhite', blend: 'mix' };
  if (path.role === 'accent') return { mode: 'brush', size: path.size ?? 'medium', effect: path.effect ?? 'wet', blend: 'mix' };
  return { mode: 'brush', size: path.size ?? 'extra-large', effect: path.effect ?? 'wet', blend: 'mix' };
}

function request(path: VectorInkPath, points: readonly Pt[], seed: number, profile: 'tail' | 'dry' | 'wet', effect?: InkEffect): InkStrokeRequest | undefined {
  const sampled = resample(points, profile === 'wet' ? 7 : profile === 'dry' ? 5 : 9, 24);
  if (sampled.length < 2) return undefined;
  const brush = brushFor(path);
  const withEffect = effect ? { ...brush, effect } : brush;
  // Fills and washes stay at the named size. Pressure at or above 0.3 steps the size up,
  // and size 4 and above drops the main stroke.
  const pressed = profile === 'wet' ? undefined : pressureOf(sampled.length, seed, profile);
  const ink: InkPoint[] = sampled.map((p, index) => {
    const point: InkPoint = { x: q(p.x), y: q(p.y) };
    const pressure = pressed?.[index];
    return pressure === undefined ? point : { ...point, pressure };
  });
  return { brush: withEffect, color: path.color, points: ink, seed: seed % 1000000 };
}

function scalePoly(poly: Poly, sx: number, sy: number): Poly {
  return { closed: poly.closed, points: poly.points.map(p => ({ x: p.x * sx, y: p.y * sy })) };
}

function compilePoly(path: VectorInkPath, poly: Poly, seed: number): InkStrokeRequest[] {
  const layers = path.layers ?? (path.role === 'fill' ? 2 : path.role === 'contour' ? 2 : 1);
  const out: InkStrokeRequest[] = [];
  const push = (stroke: InkStrokeRequest | undefined): void => {
    if (stroke) out.push(stroke);
  };
  if (path.role === 'hatch') {
    for (const line of hatchLines(poly.points, poly.closed, seed)) push(request(path, line, seed + out.length * 13, 'dry'));
    return out;
  }
  if (path.role === 'fill' && poly.closed) {
    for (let layer = 0; layer < layers; layer++) {
      const inset = offsetPoly(poly.points, 8 + layer * 12, true);
      const close = inset[0];
      if (inset.length >= 3 && close) {
        push(request(path, [...inset, close], seed + layer * 17, 'wet', layer === layers - 1 ? 'effect4' : path.effect ?? 'wet'));
      }
    }
    for (const column of interiorColumns(poly.points)) {
      push(request({ ...path, size: 'extra-large' }, column, seed + 200 + out.length, 'wet', 'wet'));
    }
    return out;
  }
  for (let layer = 0; layer < layers; layer++) {
    const shifted = layer === 0 ? poly.points : offsetPoly(poly.points, 3 + layer * 2, poly.closed);
    const ring = poly.closed ? [...shifted, shifted[0] ?? { x: 0, y: 0 }] : shifted;
    const profile = path.role === 'contour' ? 'tail' : 'wet';
    const effect = path.role === 'wash' && layer > 0 ? 'effect4' : undefined;
    push(request(path, ring, seed + layer * 17, profile, effect));
  }
  return out;
}

/** Turn a sheet into brush strokes. `fit` scales the file onto a plate. */
export function compileVectorInk(sheet: VectorInkSheet, fit?: VectorInkFit): InkStrokeRequest[] {
  const width = fit?.width ?? sheet.width;
  const height = fit?.height ?? sheet.height;
  const sx = width / sheet.width;
  const sy = height / sheet.height;
  const strokes: InkStrokeRequest[] = [];
  for (const path of sheet.paths) {
    const seed = path.seed ?? hashId(path.id);
    for (const poly of parseDraw(path.d, path.id)) {
      strokes.push(...compilePoly(path, scalePoly(poly, sx, sy), seed));
    }
  }
  return strokes;
}

function luma(data: ArrayLike<number>, index: number): number {
  const o = index * 4;
  return ((data[o] ?? 0) * 2 + (data[o + 1] ?? 0) * 5 + (data[o + 2] ?? 0)) / 8;
}

/** RGB mean/max plus a windowed SSIM and an edge-magnitude difference. Paper should already be composited. */
export function scoreInkRgba(ours: ArrayLike<number>, ref: ArrayLike<number>, width: number, height: number): InkRasterScore {
  const pixels = width * height;
  let sum = 0;
  let max = 0;
  for (let i = 0; i < pixels; i++) {
    const o = i * 4;
    const d = Math.abs((ours[o] ?? 0) - (ref[o] ?? 0))
      + Math.abs((ours[o + 1] ?? 0) - (ref[o + 1] ?? 0))
      + Math.abs((ours[o + 2] ?? 0) - (ref[o + 2] ?? 0));
    sum += d;
    if (d > max) max = d;
  }
  const window = width >= 16 && height >= 16 ? 16 : Math.min(width, height);
  let ssimSum = 0;
  let windows = 0;
  const c1 = 6.5025;
  const c2 = 58.5225;
  for (let y = 0; y + window <= height; y += window) {
    for (let x = 0; x + window <= width; x += window) {
      let mx = 0;
      let my = 0;
      const n = window * window;
      for (let yy = 0; yy < window; yy++) {
        for (let xx = 0; xx < window; xx++) {
          const i = (y + yy) * width + (x + xx);
          mx += luma(ours, i);
          my += luma(ref, i);
        }
      }
      mx /= n;
      my /= n;
      let vx = 0;
      let vy = 0;
      let cov = 0;
      for (let yy = 0; yy < window; yy++) {
        for (let xx = 0; xx < window; xx++) {
          const i = (y + yy) * width + (x + xx);
          const dx = luma(ours, i) - mx;
          const dy = luma(ref, i) - my;
          vx += dx * dx;
          vy += dy * dy;
          cov += dx * dy;
        }
      }
      vx /= n;
      vy /= n;
      cov /= n;
      ssimSum += ((2 * mx * my + c1) * (2 * cov + c2)) / ((mx * mx + my * my + c1) * (vx + vy + c2));
      windows += 1;
    }
  }
  let edgeSum = 0;
  let edgeCount = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const go = Math.abs(luma(ours, i + 1) - luma(ours, i - 1)) + Math.abs(luma(ours, i + width) - luma(ours, i - width));
      const gr = Math.abs(luma(ref, i + 1) - luma(ref, i - 1)) + Math.abs(luma(ref, i + width) - luma(ref, i - width));
      edgeSum += Math.abs(go - gr);
      edgeCount += 1;
    }
  }
  return {
    rgbMean: pixels > 0 ? sum / pixels : 0,
    rgbMax: max,
    ssim: windows > 0 ? ssimSum / windows : 0,
    edgeMean: edgeCount > 0 ? edgeSum / edgeCount : 0,
  };
}
