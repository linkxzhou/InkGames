import { Application, BufferImageSource, Graphics, RenderTexture, Sprite, Texture } from 'pixi.js';
import { strokeSegments, InkBrush, type BrushPoint, type BrushSegment, type InkBrushOptions } from './ink-brush';
import { valueNoise } from './ink-noise';
import {
  createCommitFilter, createCompositeFilter, createCopyFilter, createDepositFilter, createFeedbackFilter,
  createTypeFilter, createWashFilter, setNumber, setPigment,
} from './ink-wash-filters';

export interface InkPigment { readonly r: number; readonly g: number; readonly b: number }

export interface InkStrokeStyle extends InkBrushOptions {
  readonly pigment: InkPigment;
}

export interface InkWashOptions {
  readonly width: number;
  readonly height: number;
  /** Simulation resolution relative to width/height. 0.5 keeps SwiftShader interactive. */
  readonly scale?: number;
  readonly seed?: number;
  /** neutral matches inkEngine's default 222 gray; xuan is the warmer game sheet. */
  readonly paper?: 'neutral' | 'xuan';
}

type InkLayer = 'erasable' | 'locked';

const EFFECT_ID: Record<InkStrokeStyle['effect'], number> = {
  mix: 0, sharpen: 1, flyingWhite: 2, wet: 3,
};

/**
 * Pixi render-texture ink sheet.
 * Wet grayscale marks are stamped with dark-priority min(), diffused by the feedback filter,
 * then tinted into a committed RGB layer. Collision stays on the CPU; this object is display only.
 */
export class InkWash {
  readonly view: Sprite;
  private readonly seed: number;
  private readonly width: number;
  private readonly height: number;
  private readonly simW: number;
  private readonly simH: number;
  private readonly scale: number;
  private readonly pen = new Graphics();
  private readonly quad: Sprite;
  private readonly wet: RenderTexture;
  private readonly scratch: RenderTexture;
  private readonly stamp: RenderTexture;
  private readonly committed: RenderTexture;
  private readonly locked: RenderTexture;
  private readonly typeMap: RenderTexture;
  private readonly paperTexture: Texture;
  private readonly forceTexture: Texture;
  private readonly copyFilter = createCopyFilter();
  private readonly depositFilter;
  private readonly feedbackFilter;
  private readonly commitFilter;
  private readonly typeFilter;
  private readonly washFilter;
  private readonly compositeFilter;
  private brush: InkBrush | undefined;
  private strokeStyle: InkStrokeStyle | undefined;
  private wetActive = false;
  private releasing = false;
  private idle = 0;
  private strokeSerial = 1;
  private disposed = false;

  constructor(private readonly app: Application, options: InkWashOptions) {
    this.width = options.width;
    this.height = options.height;
    this.scale = options.scale ?? 1;
    this.simW = Math.max(2, Math.round(options.width * this.scale));
    this.simH = Math.max(2, Math.round(options.height * this.scale));
    this.seed = options.seed ?? 1;
    const make = () => RenderTexture.create({ width: this.simW, height: this.simH, resolution: 1 });
    this.wet = make();
    this.scratch = make();
    this.stamp = make();
    this.committed = make();
    this.locked = make();
    this.typeMap = make();
    this.paperTexture = this.makeImage(this.paperPixels(options.paper ?? 'xuan'), 'linear');
    this.forceTexture = this.makeImage(this.forcePixels(), 'linear');
    this.view = new Sprite(this.paperTexture);
    this.view.width = this.width;
    this.view.height = this.height;
    this.quad = new Sprite(this.wet);
    this.quad.width = this.simW;
    this.quad.height = this.simH;
    this.depositFilter = createDepositFilter(this.stamp.source);
    this.feedbackFilter = createFeedbackFilter(this.forceTexture.source, this.simW, this.simH);
    this.commitFilter = createCommitFilter(this.wet.source);
    this.typeFilter = createTypeFilter(this.wet.source);
    this.washFilter = createWashFilter(this.simW, this.simH);
    this.compositeFilter = createCompositeFilter(
      this.committed.source, this.wet.source, this.locked.source, this.typeMap.source, this.simW, this.simH,
    );
    this.view.filters = [this.compositeFilter];
    this.fill(this.wet, 0xffffff);
    this.fill(this.committed, 0xffffff);
    this.fill(this.locked, 0xffffff);
    this.fill(this.stamp, 0xffffff);
    this.fill(this.typeMap, 0x000000);
  }

  strokePath(points: readonly BrushPoint[], style: InkStrokeStyle, layer: InkLayer = 'erasable', settleFrames = 12): void {
    this.finishLive();
    if (points.length < 2) return;
    const segments = strokeSegments(points, style);
    this.blitSegments(segments);
    this.diffuse(style, settleFrames);
    this.commit(style, layer);
  }

  blot(x: number, y: number, radius: number, style: InkStrokeStyle, layer: InkLayer = 'erasable', settleFrames = 10): void {
    this.finishLive();
    const cx = x * this.scale;
    const cy = y * this.scale;
    const cr = Math.max(1, radius * this.scale);
    this.pen.clear();
    this.pen.circle(cx, cy, cr).fill({ color: 0x000000, alpha: 0.55 });
    this.pen.circle(cx + cr * 0.35, cy - cr * 0.2, cr * 0.55).fill({ color: 0x000000, alpha: 0.35 });
    this.pen.circle(cx - cr * 0.4, cy + cr * 0.15, cr * 0.42).fill({ color: 0x000000, alpha: 0.28 });
    this.app.renderer.render({ container: this.pen, target: this.stamp, clear: true });
    this.deposit();
    this.diffuse(style, settleFrames);
    this.commit(style, layer);
  }

  beginStroke(point: BrushPoint, style: InkStrokeStyle): void {
    this.finishLive();
    this.brush = new InkBrush(style);
    this.brush.setExpectedLength(48);
    this.strokeStyle = style;
    this.wetActive = true;
    this.releasing = false;
    this.idle = 0;
    this.brush.begin(point);
    setPigment(this.compositeFilter, 'inkComposite', [style.pigment.r, style.pigment.g, style.pigment.b]);
    setNumber(this.feedbackFilter, 'inkFeedback', 'uEffect', EFFECT_ID[style.effect]);
  }

  addPoint(point: BrushPoint): void {
    if (!this.brush || !this.strokeStyle) return;
    this.blitSegments(this.brush.sample(point));
    this.idle = 0;
    this.releasing = false;
  }

  endStroke(): void {
    if (!this.wetActive) return;
    this.releasing = true;
    this.idle = 0;
  }

  /** One diffusion step. Call from the render frame, not from inside a fixed step. */
  update(): void {
    if (!this.wetActive || !this.strokeStyle) return;
    this.feedbackOnce(this.strokeStyle.effect);
    this.idle += 1;
    if (this.releasing && this.idle >= 14) this.finishLive();
  }

  wash(x: number, y: number, radius: number): void {
    const center = (this.washFilter.resources.inkWash as { uniforms: { uCenter: Float32Array; uRadius: number } }).uniforms;
    center.uCenter[0] = x * this.scale;
    center.uCenter[1] = y * this.scale;
    center.uRadius = Math.max(1, radius * this.scale);
    this.quad.texture = this.committed;
    this.quad.filters = [this.washFilter];
    this.app.renderer.render({ container: this.quad, target: this.scratch, clear: true });
    this.copy(this.scratch, this.committed);
    this.quad.filters = [];
  }

  clear(): void {
    this.finishLive();
    this.fill(this.wet, 0xffffff);
    this.fill(this.committed, 0xffffff);
    this.fill(this.locked, 0xffffff);
    this.fill(this.typeMap, 0x000000);
    this.strokeSerial = 1;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.view.filters = [];
    this.quad.filters = [];
    this.view.removeFromParent();
    this.view.destroy();
    this.quad.destroy();
    this.pen.destroy();
    for (const texture of [this.wet, this.scratch, this.stamp, this.committed, this.locked, this.typeMap]) texture.destroy(true);
    this.paperTexture.destroy(true);
    this.forceTexture.destroy(true);
    for (const filter of [
      this.copyFilter, this.depositFilter, this.feedbackFilter, this.commitFilter, this.typeFilter, this.washFilter, this.compositeFilter,
    ]) filter.destroy();
  }

  private finishLive(): void {
    if (this.wetActive && this.strokeStyle) this.commit(this.strokeStyle, 'erasable');
    this.wetActive = false;
    this.releasing = false;
    this.brush = undefined;
    this.strokeStyle = undefined;
  }

  private blitSegments(segments: readonly BrushSegment[]): void {
    if (!segments.length) return;
    this.pen.clear();
    for (const segment of segments) {
      this.pen.moveTo(segment.x0 * this.scale, segment.y0 * this.scale).lineTo(segment.x1 * this.scale, segment.y1 * this.scale)
        .stroke({ width: Math.max(0.9, segment.width * this.scale), color: 0x000000, alpha: segment.alpha, cap: 'round' });
    }
    this.app.renderer.render({ container: this.pen, target: this.stamp, clear: true });
    this.deposit();
  }

  private deposit(): void {
    this.quad.texture = this.wet;
    this.quad.filters = [this.depositFilter];
    this.app.renderer.render({ container: this.quad, target: this.scratch, clear: true });
    this.copy(this.scratch, this.wet);
    this.quad.filters = [];
  }

  private diffuse(style: InkStrokeStyle, frames: number): void {
    setPigment(this.compositeFilter, 'inkComposite', [style.pigment.r, style.pigment.g, style.pigment.b]);
    for (let i = 0; i < frames; i++) this.feedbackOnce(style.effect);
  }

  private feedbackOnce(effect: InkStrokeStyle['effect']): void {
    setNumber(this.feedbackFilter, 'inkFeedback', 'uEffect', EFFECT_ID[effect]);
    setNumber(this.feedbackFilter, 'inkFeedback', 'uDiffusion', effect === 'wet' ? 0.62 : 0.45);
    this.quad.texture = this.wet;
    this.quad.filters = [this.feedbackFilter];
    this.app.renderer.render({ container: this.quad, target: this.scratch, clear: true });
    this.copy(this.scratch, this.wet);
    this.quad.filters = [];
  }

  private commit(style: InkStrokeStyle, layer: InkLayer): void {
    const target = layer === 'locked' ? this.locked : this.committed;
    setPigment(this.commitFilter, 'inkCommit', [style.pigment.r, style.pigment.g, style.pigment.b]);
    this.quad.texture = target;
    this.quad.filters = [this.commitFilter];
    this.app.renderer.render({ container: this.quad, target: this.scratch, clear: true });
    this.copy(this.scratch, target);
    const luma = style.pigment.r * 0.299 + style.pigment.g * 0.587 + style.pigment.b * 0.114;
    setNumber(this.typeFilter, 'inkType', 'uCategory', luma > 0.75 ? 1 : 0.5);
    setNumber(this.typeFilter, 'inkType', 'uStrokeId', (this.strokeSerial++ % 250) / 255);
    this.quad.texture = this.typeMap;
    this.quad.filters = [this.typeFilter];
    this.app.renderer.render({ container: this.quad, target: this.scratch, clear: true });
    this.copy(this.scratch, this.typeMap);
    this.quad.filters = [];
    this.fill(this.wet, 0xffffff);
    setPigment(this.compositeFilter, 'inkComposite', [0.08, 0.08, 0.08]);
  }

  private copy(from: RenderTexture, to: RenderTexture): void {
    this.quad.texture = from;
    this.quad.filters = [this.copyFilter];
    this.app.renderer.render({ container: this.quad, target: to, clear: true });
  }

  private fill(target: RenderTexture, color: number): void {
    this.pen.clear();
    this.pen.rect(0, 0, this.simW, this.simH).fill(color);
    this.app.renderer.render({ container: this.pen, target, clear: true });
  }

  private makeImage(pixels: Uint8Array, scale: 'linear' | 'nearest'): Texture {
    const source = new BufferImageSource({
      resource: pixels, width: this.simW, height: this.simH,
      format: 'rgba8unorm', alphaMode: 'no-premultiply-alpha', scaleMode: scale,
    });
    return new Texture({ source });
  }

  private paperPixels(kind: 'neutral' | 'xuan'): Uint8Array {
    const tone = kind === 'neutral' ? [222, 222, 222] : [236, 228, 210];
    const data = new Uint8Array(this.simW * this.simH * 4);
    for (let y = 0; y < this.simH; y++) {
      for (let x = 0; x < this.simW; x++) {
        const fiber = valueNoise(x * 0.12, y * 0.035, this.seed);
        const speckle = valueNoise(x * 0.85, y * 0.85, this.seed + 11);
        const grain = (fiber - 0.5) * 34 + (speckle > 0.78 ? -22 : speckle < 0.08 ? 12 : 0);
        const i = (y * this.simW + x) * 4;
        data[i] = clampByte((tone[0] ?? 222) + grain);
        data[i + 1] = clampByte((tone[1] ?? 222) + grain);
        data[i + 2] = clampByte((tone[2] ?? 222) + grain * 0.8);
        data[i + 3] = 255;
      }
    }
    return data;
  }

  private forcePixels(): Uint8Array {
    const data = new Uint8Array(this.simW * this.simH * 4);
    for (let y = 0; y < this.simH; y++) {
      for (let x = 0; x < this.simW; x++) {
        const nx = valueNoise(x * 0.008 / this.scale, y * 0.008 / this.scale, this.seed + 2);
        const ny = valueNoise(x * 0.008 / this.scale + 19, y * 0.008 / this.scale + 7, this.seed + 5);
        const i = (y * this.simW + x) * 4;
        data[i] = clampByte(128 + (nx - 0.5) * 90);
        data[i + 1] = clampByte(128 + (ny - 0.5) * 90);
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
    }
    return data;
  }
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export const INK_BLACK: InkPigment = { r: 0.07, g: 0.07, b: 0.08 };
export const INK_INDIGO: InkPigment = { r: 0.12, g: 0.16, b: 0.28 };
export const INK_CINNABAR: InkPigment = { r: 0.42, g: 0.16, b: 0.12 };
export const INK_PINE: InkPigment = { r: 0.16, g: 0.24, b: 0.2 };
export const INK_TEA: InkPigment = { r: 0.38, g: 0.28, b: 0.16 };
