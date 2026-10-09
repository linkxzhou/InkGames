/**
 * Versioned presentation data for procedural ink layers.
 * Shapes and identities live with the chapter in apps/; only evaluation lives here.
 */

export interface ClipRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }

export interface LayerKey {
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly rotation?: number;
  readonly opacity?: number;
  /** Scene-space rectangular mask; clipped layers draw nothing outside it. */
  readonly clip?: ClipRect;
  /** Draw order, switched at the key (not interpolated); higher draws in front. */
  readonly order?: number;
}

export interface PresentationLayer {
  readonly id: string;
  readonly keys: readonly LayerKey[];
}

export interface PresentationImpulse {
  readonly layer: string;
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
}

export interface InkPresentation {
  readonly format: 'inkgames.presentation';
  readonly version: 1;
  readonly id: string;
  readonly canvas: { readonly width: number; readonly height: number };
  /** Display rate; the story clock stays at 60 and is mapped by time. */
  readonly fps: number;
  readonly durationFrames: number;
  readonly layers: readonly PresentationLayer[];
  /** One-shot wet-spread impulses; applied once each, forward only. */
  readonly impulses: readonly PresentationImpulse[];
}

export interface LayerPose {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly rotation: number;
  readonly opacity: number;
  readonly clip?: ClipRect;
  readonly order?: number;
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} 必须是对象`);
  return value as Record<string, unknown>;
}
function number(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${label} 必须是有限数字`);
  return value;
}
function optional(row: Record<string, unknown>, key: string, label: string): number | undefined {
  return row[key] === undefined ? undefined : number(row[key], `${label}.${key}`);
}
function clipOf(value: unknown, label: string): ClipRect {
  const row = record(value, `clip@${label}`);
  const rect = {
    x: number(row.x, `clip.x@${label}`),
    y: number(row.y, `clip.y@${label}`),
    width: number(row.width, `clip.width@${label}`),
    height: number(row.height, `clip.height@${label}`),
  };
  if (rect.width <= 0 || rect.height <= 0) throw new Error(`clip 尺寸必须为正：${label}`);
  return rect;
}

export function validatePresentation(value: unknown): InkPresentation {
  const row = record(value, 'presentation');
  if (row.format !== 'inkgames.presentation') throw new Error('presentation.format');
  if (row.version !== 1) throw new Error('presentation.version');
  if (typeof row.id !== 'string' || !row.id) throw new Error('presentation.id');
  const canvas = record(row.canvas, 'canvas');
  const width = number(canvas.width, 'canvas.width');
  const height = number(canvas.height, 'canvas.height');
  if (width <= 0 || height <= 0) throw new Error('canvas 尺寸必须为正');
  const fps = number(row.fps, 'fps');
  if (fps <= 0 || fps > 60) throw new Error('fps 必须在 (0, 60]');
  const durationFrames = number(row.durationFrames, 'durationFrames');
  if (!Number.isInteger(durationFrames) || durationFrames <= 0) throw new Error('durationFrames');
  if (!Array.isArray(row.layers) || row.layers.length === 0) throw new Error('layers 不能为空');
  const seen = new Set<string>();
  const layers: PresentationLayer[] = [];
  for (const raw of row.layers) {
    const layer = record(raw, 'layer');
    if (typeof layer.id !== 'string' || !layer.id) throw new Error('layer.id');
    if (seen.has(layer.id)) throw new Error(`layer.id 重复：${layer.id}`);
    seen.add(layer.id);
    if (!Array.isArray(layer.keys) || layer.keys.length === 0) throw new Error(`layer.keys 为空：${layer.id}`);
    const keys: LayerKey[] = [];
    let previous = -1;
    for (const rawKey of layer.keys) {
      const key = record(rawKey, `key@${layer.id}`);
      const at = number(key.at, `key.at@${layer.id}`);
      if (!Number.isInteger(at) || at < 0) throw new Error(`key.at 必须是非负整数：${layer.id}`);
      if (at <= previous) throw new Error(`key.at 必须严格递增：${layer.id}`);
      previous = at;
      const x = number(key.x, `key.x@${layer.id}`);
      const y = number(key.y, `key.y@${layer.id}`);
      const scale = optional(key, 'scale', `key@${layer.id}`) ?? 1;
      const rotation = optional(key, 'rotation', `key@${layer.id}`) ?? 0;
      const opacity = optional(key, 'opacity', `key@${layer.id}`) ?? 1;
      if (scale <= 0) throw new Error(`key.scale 必须为正：${layer.id}`);
      if (opacity < 0 || opacity > 1) throw new Error(`key.opacity 必须在 [0,1]：${layer.id}`);
      const clip = key.clip === undefined ? undefined : clipOf(key.clip, `${layer.id}@${at}`);
      const order = key.order === undefined ? undefined : number(key.order, `key.order@${layer.id}`);
      keys.push({ at, x, y, scale, opacity, ...(rotation === 0 ? {} : { rotation }), ...(clip === undefined ? {} : { clip }), ...(order === undefined ? {} : { order }) });
    }
    layers.push({ id: layer.id, keys });
  }
  const ids = new Set(layers.map(layer => layer.id));
  const impulses: PresentationImpulse[] = [];
  if (row.impulses !== undefined) {
    if (!Array.isArray(row.impulses)) throw new Error('impulses 必须是数组');
    for (const raw of row.impulses) {
      const entry = record(raw, 'impulse');
      if (typeof entry.layer !== 'string' || !ids.has(entry.layer)) throw new Error(`impulse.layer 未指向已声明图层：${String(entry.layer)}`);
      const at = number(entry.at, 'impulse.at');
      if (!Number.isInteger(at) || at < 0) throw new Error('impulse.at 必须是非负整数');
      const radius = number(entry.radius, 'impulse.radius');
      if (radius <= 0) throw new Error('impulse.radius 必须为正');
      impulses.push({ layer: entry.layer, at, x: number(entry.x, 'impulse.x'), y: number(entry.y, 'impulse.y'), radius });
    }
  }
  return { format: 'inkgames.presentation', version: 1, id: row.id, canvas: { width, height }, fps, durationFrames, layers, impulses };
}

/** Polynomial ease so evaluation stays deterministic and never calls Math.sin. */
function smoothstep(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * (3 - 2 * x);
}

/** Pose at a frame; clamped before the first key and after the last. */
export function poseAt(layer: PresentationLayer, frame: number): LayerPose {
  const keys = layer.keys;
  const first = keys[0];
  if (!first) throw new Error(`layer.keys 为空：${layer.id}`);
  const at = (key: LayerKey): LayerPose => ({ x: key.x, y: key.y, scale: key.scale ?? 1, rotation: key.rotation ?? 0, opacity: key.opacity ?? 1, ...(key.clip === undefined ? {} : { clip: key.clip }), ...(key.order === undefined ? {} : { order: key.order }) });
  if (frame <= first.at) return at(first);
  const last = keys[keys.length - 1] ?? first;
  if (frame >= last.at) return at(last);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (!a || !b || frame < a.at || frame >= b.at) continue;
    const k = smoothstep((frame - a.at) / (b.at - a.at));
    const aScale = a.scale ?? 1, bScale = b.scale ?? 1;
    const aRotation = a.rotation ?? 0, bRotation = b.rotation ?? 0;
    const aOpacity = a.opacity ?? 1, bOpacity = b.opacity ?? 1;
    // Clip rectangles switch at the next key instead of interpolating, so a
    // mask never produces a half-open shape between two authored states.
    const clip = k >= 1 ? b.clip : a.clip;
    const order = k >= 1 ? b.order : a.order;
    return {
      x: a.x + (b.x - a.x) * k,
      y: a.y + (b.y - a.y) * k,
      scale: aScale + (bScale - aScale) * k,
      rotation: aRotation + (bRotation - aRotation) * k,
      opacity: aOpacity + (bOpacity - aOpacity) * k,
      ...(clip === undefined ? {} : { clip }),
      ...(order === undefined ? {} : { order }),
    };
  }
  return at(last);
}
