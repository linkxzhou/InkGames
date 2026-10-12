import {
  DataTexture, LinearFilter, NoColorSpace, RGBAFormat, UnsignedByteType,
  type RawShaderMaterial, type Texture, type WebGLRenderer, type WebGLRenderTarget,
} from './three-gl';
import { type InkBite, scanInkBites } from './ink-metallic';
import { inkPaperPixels } from './ink-paper';
import { inkCos, inkSin } from './ink-random';
import { whiteTexture } from './ink-pass';
import type { PixelRect } from './ink-raster';
import { INK_DISTORT_FRAGMENT, INK_FLOW_FRAGMENT, INK_METALLIC_FRAGMENT } from './ink-shaders';
import type { InkBrushSettings, InkPoint } from './ink-brush';
import type { InkColor, InkFinish, InkStrokeRequest } from './ink-stroke';
import { InkPaintSheet, type InkPaintOptions, bind, set1, set2, set3, set4, tex, vec2, vec3, vec4 } from './ink-paint';
import { InkWash } from './ink-wash';

export interface InkSurfaceOptions extends InkPaintOptions {}

/** CPU copy of the committed sheet. Row 0 is the top, matching the y-down pass. */
export interface InkSurfaceSnapshot {
  readonly width: number;
  readonly height: number;
  readonly frameCount: number;
  readonly final: Uint8Array;
  readonly typeMap: Uint8Array;
  readonly wet: Uint8Array;
}

/**
 * inkEngine's sheet on three.js render targets.
 * Wet paint and wash live in InkPaintSheet / InkWash. Flow, distort and metallic stay here.
 * Collision is not read back from these targets.
 */
export class InkSurface {
  private readonly sheet: InkPaintSheet;
  private readonly washPass: InkWash;
  private readonly bugsMask: WebGLRenderTarget;
  private readonly bugsData: WebGLRenderTarget;
  private readonly blank: DataTexture;
  private readonly distort: RawShaderMaterial;
  private readonly flow: RawShaderMaterial;
  private readonly metallic: RawShaderMaterial;
  private pendingFinish: InkFinish | undefined;
  private disposed = false;

  constructor(renderer: WebGLRenderer, options: InkSurfaceOptions) {
    this.sheet = new InkPaintSheet(renderer, {
      ...options,
      paperPixels: options.paper === false ? undefined : (options.paperPixels ?? inkPaperPixels),
    });
    this.washPass = new InkWash(this.sheet);
    const make = (): WebGLRenderTarget => this.sheet.pass.target();
    this.bugsMask = make();
    this.bugsData = make();
    this.blank = whiteTexture();
    const w = this.sheet.width;
    const h = this.sheet.height;
    const bg = this.sheet.background;
    const seeds = this.sheet.forceSeeds;
    this.distort = this.sheet.pass.material(INK_DISTORT_FRAGMENT, {
      tex0: tex(this.sheet.display.texture), forceMap: tex(this.sheet.force.texture),
      time: num(0), distortEnabled: num(1), displacementB: num(20), displacementC: num(50), showFbmMask: num(0),
      fbmSeed1: num(seeds[0] || 100), fbmSeed2: num(seeds[1] || 200),
      fbmSeed3: num(seeds[2] || 300), fbmSeed4: num(seeds[3] || 400),
      backgroundColor: vec3(bg[0] / 255, bg[1] / 255, bg[2] / 255),
      rsEnabled: num(0), rsFrequency: num(300), rsWaveSpeed: num(1), rsStrength: num(0.5), rsGradientMix: num(0.1), rsScale: num(100),
      cellularEnabled: num(0), cellularScale: num(15), cellularSeed: num(0.5), whiteDotDensity: num(0), grainAmount: num(0),
    });
    const last = this.sheet.lastStroke?.texture ?? this.blank;
    this.flow = this.sheet.pass.material(INK_FLOW_FRAGMENT, {
      tex0: tex(this.sheet.final.texture), lastStrokeTex: tex(last),
      lastStrokeOnly: num(0), blendType: num(0), blendVol: num(100), radSeed: num(0),
      strokeBounds: vec4(0, 0, 1, 1), pixD: num(1), blendA: num(0.01), blendB: num(25), directVol: num(10), snoiseVol: num(3),
      gobalStyle: num(0), vline: num(5), hline: num(5), cellT: num(1), colorDeep: num(0.015), whiteDot: num(0.01),
      doBigShape: num(0), doMask: num(0.5), multiDir: num(0), drawTime: num(1), seed: num(0), iTime: num(0), pixelScale: num(1),
      isTypeMapMode: num(0),
    });
    this.metallic = this.sheet.pass.material(INK_METALLIC_FRAGMENT, {
      tex0: tex(this.sheet.display.texture), bugsMask: tex(this.blank), bugsData: tex(this.blank),
      time: num(0), resolution: vec2(w, h), metallicStrength: num(0.85), flowSpeed: num(1),
      lightPos: vec2(0.5, 0.4), specularPower: num(12), fresnelStrength: num(0.5),
      metalTint: vec3(0.72, 0.5, 0.35),
    });
  }

  get width(): number { return this.sheet.width; }
  get height(): number { return this.sheet.height; }
  get texture(): Texture { return this.sheet.texture; }

  setBrush(settings: InkBrushSettings): void {
    this.sheet.setBrush(settings);
  }

  setColor(color: InkColor): void {
    this.sheet.setColor(color);
  }

  paint(stroke: InkStrokeRequest): void {
    this.setBrush(stroke.brush);
    this.setColor(stroke.color);
    this.pendingFinish = stroke.finish;
    this.strokePath(stroke.points, stroke.seed);
    this.pendingFinish = undefined;
  }

  strokePath(points: readonly InkPoint[], seed?: number): void {
    this.sheet.strokePath(points, seed);
    const finish = this.pendingFinish;
    if (finish) this.applyFinish(finish);
  }

  beginStroke(x: number, y: number, seed = 0): void {
    this.sheet.beginStroke(x, y, seed);
  }

  addPoint(x: number, y: number): void {
    this.sheet.addPoint(x, y);
  }

  endStroke(): void {
    this.sheet.endStroke();
  }

  update(): void {
    this.sheet.update();
  }

  wash(x: number, y: number, radius: number): void {
    this.washPass.wash(x, y, radius);
  }

  snapshot(): InkSurfaceSnapshot {
    return {
      width: this.sheet.width,
      height: this.sheet.height,
      frameCount: this.sheet.frameCount,
      final: this.sheet.readTarget(this.sheet.final),
      typeMap: this.sheet.readTarget(this.sheet.typeMap),
      wet: this.sheet.readTarget(this.sheet.wet),
    };
  }

  restore(snapshot: InkSurfaceSnapshot): void {
    if (this.disposed || snapshot.width !== this.width || snapshot.height !== this.height) return;
    this.sheet.blitBuffer(this.sheet.final, snapshot.final);
    this.sheet.blitBuffer(this.sheet.typeMap, snapshot.typeMap);
    this.sheet.blitBuffer(this.sheet.wet, snapshot.wet);
    this.sheet.frameCount = snapshot.frameCount;
    this.sheet.pass.draw(this.sheet.composite, this.sheet.display, this.sheet.fullRect());
  }

  /** Flow, distort, or metallic on the last committed stroke. Used by cutscene effect cues. */
  replayEffect(finish: InkFinish): void {
    if (this.disposed) return;
    this.applyFinish(finish);
  }

  clear(): void {
    if (this.disposed) return;
    this.sheet.clear();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.distort.dispose();
    this.flow.dispose();
    this.metallic.dispose();
    this.washPass.dispose();
    this.bugsMask.dispose();
    this.bugsData.dispose();
    this.blank.dispose();
    this.sheet.dispose();
  }

  private applyFinish(finish: InkFinish): void {
    const rect = finish.distort?.extent === 'frame' ? this.sheet.fullRect() : this.effectRect();
    if (!rect) return;
    if (finish.metallic) this.applyMetallic(rect, finish.metallic.tint ?? [0.72, 0.5, 0.35], finish.metallic.size ?? 10);
    if (finish.distort) this.applyDistort(rect, finish.distort.displacementB ?? 20, finish.distort.displacementC ?? 50);
    if (finish.flow) this.applyFlow(finish.flow.blendType, finish.flow.iterations, finish.flow.seed);
  }

  private effectRect(): PixelRect | undefined {
    const ink = this.sheet.lastRect;
    if (!ink) return undefined;
    const mirrorY = this.sheet.height - (ink.y + ink.h);
    const y = Math.min(ink.y, mirrorY);
    const y1 = Math.max(ink.y + ink.h, mirrorY + ink.h);
    return this.sheet.clampRect({ x: ink.x - 24, y: y - 24, w: ink.w + 48, h: y1 - y + 48 });
  }

  private applyFlow(blendType: number, iterations: number, seed: number | undefined): void {
    const bounds = this.pathBoundsNormalized();
    const rect = this.effectRect();
    const last = this.sheet.lastStroke;
    if (!bounds || !rect || !last) return;
    const count = Math.max(0, Math.floor(iterations));
    const flowSeed = seed ?? (this.sheet.strokeSeed % 1000000);
    set1(this.flow, 'blendType', blendType);
    set1(this.flow, 'blendVol', 100 * (1 + count * 0.1));
    set1(this.flow, 'radSeed', flowSeed * 0.001);
    set4(this.flow, 'strokeBounds', bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    set1(this.flow, 'seed', flowSeed * 0.0001);
    set1(this.flow, 'iTime', this.sheet.frameCount / 60);
    set1(this.flow, 'isTypeMapMode', 0);
    bind(this.flow, 'tex0', this.sheet.final.texture);
    bind(this.flow, 'lastStrokeTex', last.texture);
    this.sheet.pass.draw(this.flow, this.sheet.scratch, rect);
    this.sheet.pass.copy(this.sheet.scratch, this.sheet.final, rect);
    set1(this.flow, 'isTypeMapMode', 1);
    bind(this.flow, 'tex0', this.sheet.typeMap.texture);
    this.sheet.pass.draw(this.flow, this.sheet.scratch, rect);
    this.sheet.pass.copy(this.sheet.scratch, this.sheet.typeMap, rect);
    this.sheet.pass.draw(this.sheet.composite, this.sheet.display, rect);
  }

  private applyDistort(rect: PixelRect, displacementB: number, displacementC: number): void {
    set1(this.sheet.forceMap, 'time', this.sheet.frameCount / 60);
    this.sheet.pass.draw(this.sheet.forceMap, this.sheet.force, rect);
    bind(this.distort, 'tex0', this.sheet.display.texture);
    set1(this.distort, 'time', (this.sheet.frameCount / 60) * 0.005);
    set1(this.distort, 'displacementB', displacementB);
    set1(this.distort, 'displacementC', displacementC);
    this.sheet.pass.draw(this.distort, this.sheet.scratch, rect);
    this.sheet.pass.copy(this.sheet.scratch, this.sheet.display, rect);
  }

  private applyMetallic(rect: PixelRect, tint: readonly [number, number, number], size: number): void {
    const pixels = this.sheet.readTarget(this.sheet.display);
    const focus = this.sheet.lastRect ?? rect;
    const crop = new Uint8Array(focus.w * focus.h * 4);
    for (let y = 0; y < focus.h; y++) {
      const src = ((focus.y + y) * this.sheet.width + focus.x) * 4;
      crop.set(pixels.subarray(src, src + focus.w * 4), y * focus.w * 4);
    }
    const bites = scanInkBites(
      crop, focus.w, focus.h, focus.x, focus.y, this.sheet.width, this.sheet.height, this.sheet.background,
      this.sheet.strokeSeed, size, tint,
    );
    if (!bites.length) return;
    this.paintBites(bites);
    const t = this.sheet.frameCount / 600;
    bind(this.metallic, 'tex0', this.sheet.display.texture);
    set1(this.metallic, 'time', this.sheet.frameCount * 1000 / 60);
    set2(this.metallic, 'lightPos', 0.5 + inkSin(t * 0.7) * 0.3, 0.4 + inkCos(t * 0.5) * 0.25);
    set3(this.metallic, 'metalTint', tint[0], tint[1], tint[2]);
    const cover = this.sheet.clampRect({ x: rect.x - 48, y: rect.y - 48, w: rect.w + 96, h: rect.h + 96 }) ?? rect;
    this.sheet.pass.draw(this.metallic, this.sheet.scratch, cover);
    this.sheet.pass.copy(this.sheet.scratch, this.sheet.display, cover);
  }

  private paintBites(bites: readonly InkBite[]): void {
    const mask = document.createElement('canvas');
    const data = document.createElement('canvas');
    mask.width = data.width = this.sheet.width;
    mask.height = data.height = this.sheet.height;
    const maskCtx = mask.getContext('2d');
    const dataCtx = data.getContext('2d');
    if (!maskCtx || !dataCtx) return;
    for (const bite of bites) {
      paintBite(maskCtx, bite, `rgb(${Math.round(bite.r)},${Math.round(bite.g)},${Math.round(bite.b)})`);
      const r = Math.round(clamp01(bite.x / this.sheet.width) * 255);
      const g = Math.round(clamp01(bite.y / this.sheet.height) * 255);
      const b = Math.round(clamp01(bite.size / this.sheet.width) * 255);
      paintBite(dataCtx, bite, `rgb(${r},${g},${b})`);
    }
    this.paintCanvas(mask, this.bugsMask, 'bugsMask');
    this.paintCanvas(data, this.bugsData, 'bugsData');
  }

  private paintCanvas(canvas: HTMLCanvasElement, target: WebGLRenderTarget, uniform: string): void {
    const image = canvas.getContext('2d')?.getImageData(0, 0, this.sheet.width, this.sheet.height);
    if (!image) return;
    const texture = new DataTexture(new Uint8Array(image.data.buffer), this.sheet.width, this.sheet.height, RGBAFormat, UnsignedByteType);
    texture.flipY = false;
    texture.colorSpace = NoColorSpace;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    this.sheet.pass.blitTexture(texture, target, this.sheet.fullRect());
    bind(this.metallic, uniform, target.texture);
    texture.dispose();
  }

  private pathBoundsNormalized(): { minX: number; minY: number; maxX: number; maxY: number } | undefined {
    const b = this.sheet.pathBounds;
    if (!(b.maxX >= b.minX)) return undefined;
    const pad = 20;
    return {
      minX: Math.max(0, b.minX - pad) / this.sheet.width,
      minY: Math.max(0, b.minY - pad) / this.sheet.height,
      maxX: Math.min(1, b.maxX + pad) / this.sheet.width,
      maxY: Math.min(1, b.maxY + pad) / this.sheet.height,
    };
  }
}

function num(value: number): { value: number } { return { value }; }

function paintBite(ctx: CanvasRenderingContext2D, bite: InkBite, style: string): void {
  ctx.fillStyle = style;
  ctx.beginPath();
  const first = bite.vertices[0];
  if (!first || bite.vertices.length < 3) {
    ctx.rect(bite.x - bite.size / 2, bite.y - bite.size / 2, bite.size, bite.size);
    ctx.fill();
    return;
  }
  ctx.moveTo(bite.x + first.x, bite.y + first.y);
  for (let i = 1; i < bite.vertices.length; i++) {
    const vertex = bite.vertices[i];
    if (vertex) ctx.lineTo(bite.x + vertex.x, bite.y + vertex.y);
  }
  ctx.closePath();
  ctx.fill();
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
