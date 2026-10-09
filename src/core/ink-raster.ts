import type { InkDrawOp } from './ink-brush';

export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** CPU stamp of one frame of brush ops. Row 0 is the top of the rectangle. Alpha 0 is untouched paper. */
export function rasterInkOps(ops: readonly InkDrawOp[], rect: PixelRect): Uint8Array {
  const data = new Uint8Array(rect.w * rect.h * 4);
  for (const op of ops) {
    if (op.kind === 'line') rasterLine(data, rect, op);
    else if (op.kind === 'dot') rasterDot(data, rect, op);
    else rasterMarker(data, rect, op);
  }
  return data;
}

function rasterLine(data: Uint8Array, rect: PixelRect, op: InkDrawOp): void {
  const radius = Math.max(op.w / 2, 0.4);
  const minX = Math.max(0, Math.floor(Math.min(op.x0, op.x1) - radius - rect.x));
  const maxX = Math.min(rect.w - 1, Math.ceil(Math.max(op.x0, op.x1) + radius - rect.x));
  const minY = Math.max(0, Math.floor(Math.min(op.y0, op.y1) - radius - rect.y));
  const maxY = Math.min(rect.h - 1, Math.ceil(Math.max(op.y0, op.y1) + radius - rect.y));
  const dx = op.x1 - op.x0;
  const dy = op.y1 - op.y0;
  const len2 = dx * dx + dy * dy;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = rect.x + x + 0.5;
      const py = rect.y + y + 0.5;
      const t = len2 < 1e-6 ? 0 : clamp01(((px - op.x0) * dx + (py - op.y0) * dy) / len2);
      const cx = op.x0 + dx * t;
      const cy = op.y0 + dy * t;
      const dist = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
      if (dist <= radius) over(data, (y * rect.w + x) * 4, op.r, op.g, op.b, op.a);
    }
  }
}

function rasterDot(data: Uint8Array, rect: PixelRect, op: InkDrawOp): void {
  const radius = Math.max(op.w / 2, 0.4);
  const minX = Math.max(0, Math.floor(op.x0 - radius - rect.x));
  const maxX = Math.min(rect.w - 1, Math.ceil(op.x0 + radius - rect.x));
  const minY = Math.max(0, Math.floor(op.y0 - radius - rect.y));
  const maxY = Math.min(rect.h - 1, Math.ceil(op.y0 + radius - rect.y));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = rect.x + x + 0.5 - op.x0;
      const py = rect.y + y + 0.5 - op.y0;
      if (px * px + py * py <= radius * radius) over(data, (y * rect.w + x) * 4, op.r, op.g, op.b, op.a);
    }
  }
}

function rasterMarker(data: Uint8Array, rect: PixelRect, op: InkDrawOp): void {
  const ax = op.x1;
  const ay = op.y1;
  const hw = op.w / 2;
  const hh = op.h / 2;
  const reach = hw + hh + op.lw + 1;
  const minX = Math.max(0, Math.floor(op.x0 - reach - rect.x));
  const maxX = Math.min(rect.w - 1, Math.ceil(op.x0 + reach - rect.x));
  const minY = Math.max(0, Math.floor(op.y0 - reach - rect.y));
  const maxY = Math.min(rect.h - 1, Math.ceil(op.y0 + reach - rect.y));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = rect.x + x + 0.5 - op.x0;
      const py = rect.y + y + 0.5 - op.y0;
      const lx = px * ax + py * ay;
      const ly = px * -ay + py * ax;
      if (Math.abs(lx) > hw || Math.abs(ly) > hh) continue;
      const edge = hw - Math.abs(lx) < op.lw || hh - Math.abs(ly) < op.lw;
      if (edge) over(data, (y * rect.w + x) * 4, op.r, op.g, op.b, op.a);
      else over(data, (y * rect.w + x) * 4, 255, 255, 255, 255);
    }
  }
}

function over(data: Uint8Array, index: number, r: number, g: number, b: number, a: number): void {
  const sa = Math.max(0, Math.min(255, a)) / 255;
  const dr = data[index] ?? 0;
  const dg = data[index + 1] ?? 0;
  const db = data[index + 2] ?? 0;
  const da = (data[index + 3] ?? 0) / 255;
  const outA = sa + da * (1 - sa);
  if (outA <= 0) return;
  data[index] = Math.round((r * sa + dr * da * (1 - sa)) / outA);
  data[index + 1] = Math.round((g * sa + dg * da * (1 - sa)) / outA);
  data[index + 2] = Math.round((b * sa + db * da * (1 - sa)) / outA);
  data[index + 3] = Math.round(outA * 255);
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
