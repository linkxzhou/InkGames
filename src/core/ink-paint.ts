import {
  DataTexture, LinearFilter, NoColorSpace, NormalBlending, RGBAFormat, UnsignedByteType, Vector2, Vector3, Vector4,
  type RawShaderMaterial, type Texture, type WebGLRenderer, type WebGLRenderTarget,
} from './three-gl';
import {
  INK_TIP_OFFSET, InkBrushEngine, type InkBrushSettings, type InkDrawOp, type InkPoint, type InkShaderState,
} from './ink-brush';
import { inkColorRgb } from './ink-palette';
import { P5Random, TWO_PI } from './ink-random';
import { InkPass, whiteTexture, type InkUniform } from './ink-pass';
import { rasterInkOps, type PixelRect } from './ink-raster';
import {
  INK_COMPOSITE_FRAGMENT, INK_ENCODE_FRAGMENT, INK_FEEDBACK_FRAGMENT, INK_FORCE_MAP_FRAGMENT,
  INK_REALTIME_FRAGMENT, INK_TYPE_MAP_FRAGMENT,
} from './ink-shaders';
import type { InkColor } from './ink-stroke';

export interface InkBounds { minX: number; minY: number; maxX: number; maxY: number }

export interface InkPaintOptions {
  readonly width: number;
  readonly height: number;
  readonly seed?: number;
  readonly paper?: boolean;
  readonly background?: readonly [number, number, number];
  readonly transparent?: boolean;
  /** 纸纹像素。不传就用平涂底色。`InkSurface` 会传入 `inkPaperPixels`。 */
  readonly paperPixels?: (
    width: number,
    height: number,
    background: readonly [number, number, number],
    seed: number,
  ) => Uint8Array;
  /** 默认记下刚提交的一笔，给 flow 用。背景不需要这张纹理。 */
  readonly recordLastStroke?: boolean;
}

const EMPTY: InkBounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

/**
 * 湿墨：落笔、力场、反馈、编码、类型图、合成、湿墨预览。
 * 不含 flow / distort / metallic。漫水在 ink-wash.ts。
 */
export class InkPaintSheet {
  readonly width: number;
  readonly height: number;
  readonly pass: InkPass;
  readonly background: readonly [number, number, number];
  readonly wet: WebGLRenderTarget;
  readonly pingPong: WebGLRenderTarget;
  readonly scratch: WebGLRenderTarget;
  readonly final: WebGLRenderTarget;
  readonly typeMap: WebGLRenderTarget;
  readonly display: WebGLRenderTarget;
  readonly force: WebGLRenderTarget;
  readonly lastStroke: WebGLRenderTarget | undefined;
  readonly composite: RawShaderMaterial;
  readonly forceMap: RawShaderMaterial;
  readonly forceSeeds: readonly number[];
  private readonly engine = new InkBrushEngine();
  private readonly seed: number;
  private readonly base: DataTexture;
  private readonly blank: DataTexture;
  private readonly feedback: RawShaderMaterial;
  private readonly encode: RawShaderMaterial;
  private readonly typeEncode: RawShaderMaterial;
  private readonly realtime: RawShaderMaterial;
  private readonly materials: RawShaderMaterial[];
  private stroke: InkBounds = { ...EMPTY };
  private storedPath: InkBounds = { ...EMPTY };
  private storedRect: PixelRect | undefined;
  private strokeFrames = 0;
  private frames = 2;
  private serial = 0;
  private storedSeed = 0;
  private live: { down: boolean; cursor: InkPoint; pmouse: InkPoint; pending: InkPoint | undefined; lift: number } | undefined;
  private disposedFlag = false;

  constructor(renderer: WebGLRenderer, options: InkPaintOptions) {
    this.width = Math.max(2, Math.round(options.width));
    this.height = Math.max(2, Math.round(options.height));
    this.seed = options.seed ?? 1234567890;
    this.background = options.background ?? [214, 206, 188];
    this.pass = new InkPass(renderer, this.width, this.height);
    const make = (): WebGLRenderTarget => this.pass.target();
    this.wet = make();
    this.pingPong = make();
    this.scratch = make();
    this.final = make();
    this.typeMap = make();
    this.display = make();
    this.force = make();
    this.lastStroke = options.recordLastStroke === false ? undefined : make();
    this.blank = whiteTexture();
    this.base = this.makeBase(options);
    const params = this.forceParams();
    this.forceSeeds = params.seeds;
    const w = this.width;
    const h = this.height;
    const bg = this.background;
    this.feedback = this.pass.material(INK_FEEDBACK_FRAGMENT, {
      tex0: tex(this.wet.texture), forceMap: tex(this.force.texture),
      force: num(1), indiffusionStrength: num(0.45), brushMode: num(1), baseBrushSize: num(2), useSharpen: num(0),
      effect3Brightness: num(0.2), brushColorMode: num(0), brushCategory: num(0), mouseCount: num(0),
      mouseCountAccumulated: num(0), strokeSeed: num(0),
    }, NormalBlending);
    this.feedback.transparent = true;
    this.feedback.premultipliedAlpha = false;
    this.encode = this.pass.material(INK_ENCODE_FRAGMENT, {
      baseTex: tex(this.final.texture), strokeTex: tex(this.wet.texture), typeMapTex: tex(this.typeMap.texture),
      brushColorMode: num(0), brushCategory: num(0), whiteMaxOpacity: num(0.95), hueShift: num(0), satShift: num(0),
      briShift: num(0), keyBlendMode: num(0), useSharpen: num(0),
      canvasBackgroundColor: vec3(bg[0] / 255, bg[1] / 255, bg[2] / 255),
      customBrushColor: vec3(26 / 255, 26 / 255, 26 / 255),
      useSpectralMix: num(0),
    });
    this.typeEncode = this.pass.material(INK_TYPE_MAP_FRAGMENT, {
      baseTex: tex(this.typeMap.texture), strokeTex: tex(this.wet.texture),
      brushCategory: num(0), whiteMaxOpacity: num(0.95),
    });
    this.composite = this.pass.material(INK_COMPOSITE_FRAGMENT, {
      baseTex: tex(this.base), encodedTex: tex(this.final.texture), typeMapTex: tex(this.typeMap.texture),
      useSharpen: num(0), brushColorMode: num(0),
    });
    this.realtime = this.pass.material(INK_REALTIME_FRAGMENT, {
      baseTex: tex(this.scratch.texture), addTex: tex(this.wet.texture), encodedTex: tex(this.final.texture),
      brushColorMode: num(0), brushCategory: num(0), brushColor: vec3(26 / 255, 26 / 255, 26 / 255),
      whiteMaxOpacity: num(0.95), hueShift: num(0), satShift: num(0), briShift: num(0), useSharpen: num(0),
    });
    this.forceMap = this.pass.material(INK_FORCE_MAP_FRAGMENT, {
      tex0: tex(this.blank),
      _x5: num(0), _x6: num(0), _x7: num(0), _x8: num(0), _x9: num(0), _x10: num(0),
      randomSeed2: num(params.seeds[1] ?? 200), randomSeed3: num(params.seeds[2] ?? 300), randomSeed4: num(params.seeds[3] ?? 400),
      scale2: num(params.scales[1] ?? 0.005), scale3: num(params.scales[2] ?? 0.015),
      amplitude2: num(params.amplitudes[1] ?? 0.4), amplitude3: num(params.amplitudes[2] ?? 0.3),
      phase2: num(params.phases[1] ?? 0), phase3: num(params.phases[2] ?? 0),
      vortexScale2: num(params.vortexScales[1] ?? 0.012), clusterScale2: num(params.clusterScales[1] ?? 0.0008),
      canvasCenter: vec2(w / 2, h / 2),
      time: num(0),
    });
    this.materials = [this.feedback, this.encode, this.typeEncode, this.composite, this.realtime, this.forceMap];
    const full = this.fullRect();
    const white: readonly [number, number, number] = [1, 1, 1];
    this.pass.fill(this.wet, full, white);
    this.pass.fill(this.pingPong, full, white);
    this.pass.fill(this.final, full, white);
    if (this.lastStroke) this.pass.fill(this.lastStroke, full, white);
    this.pass.fill(this.typeMap, full, [0, 0, 0]);
    this.pass.draw(this.forceMap, this.force, full);
    this.pass.draw(this.composite, this.display, full);
  }

  get disposed(): boolean { return this.disposedFlag; }
  get texture(): Texture { return this.display.texture; }
  get frameCount(): number { return this.frames; }
  set frameCount(value: number) { this.frames = value; }
  get lastRect(): PixelRect | undefined { return this.storedRect; }
  get pathBounds(): InkBounds { return this.storedPath; }
  get strokeSeed(): number { return this.storedSeed; }

  setBrush(settings: InkBrushSettings): void {
    this.engine.configure(settings);
  }

  setColor(color: InkColor): void {
    this.engine.setColor(color);
  }

  /** 落笔并提交。不含收笔后的 flow / distort / metallic。 */
  paint(stroke: { brush: InkBrushSettings; color: InkColor; points: readonly InkPoint[]; seed?: number }): void {
    this.setBrush(stroke.brush);
    this.setColor(stroke.color);
    this.strokePath(stroke.points, stroke.seed);
  }

  /** 画完一笔并提交。不跑 flow / distort / metallic。 */
  strokePath(points: readonly InkPoint[], seed?: number): void {
    if (this.disposedFlag || !points.length) return;
    this.finishLive();
    const pointer = pointerPath(points, this.engine.mode === 3);
    const first = pointer[0];
    if (!first) return;
    this.storedPath = { ...EMPTY };
    for (const point of pointer) grow(this.storedPath, point.x, point.y, point.x, point.y);
    this.pressAt(first, seed);
    let previous = first;
    for (let i = 1; i < pointer.length; i++) {
      const point = pointer[i];
      if (!point) continue;
      this.engine.applyPressure(point.pressure);
      this.runFrame(true, round2Point(point), previous, false);
      previous = point;
    }
    const last = pointer[pointer.length - 1] ?? first;
    this.runFrame(true, round2Point(last), pointer[pointer.length - 2] ?? first, false);
    this.engine.release();
    for (let guard = 0; guard < 200 && this.engine.pendingCommit; guard++) {
      this.runFrame(false, round2Point(last), last, false);
    }
  }

  beginStroke(x: number, y: number, seed = 0): void {
    if (this.disposedFlag) return;
    this.finishLive();
    const point = pointerPath([{ x, y }], this.engine.mode === 3)[0] ?? { x, y };
    this.live = { down: true, cursor: point, pmouse: point, pending: point, lift: 0 };
    this.pressAt(point, seed, true);
  }

  addPoint(x: number, y: number): void {
    if (!this.live?.down) return;
    this.live.pending = pointerPath([{ x, y }], this.engine.mode === 3)[0] ?? { x, y };
  }

  endStroke(): void {
    if (this.live?.down) this.live.lift = 1;
  }

  update(): void {
    const live = this.live;
    if (!live || this.disposedFlag) return;
    if (live.down && live.lift > 0) {
      live.lift = 0;
      live.down = false;
      this.engine.release();
    }
    if (live.down) {
      const next = live.pending ?? live.cursor;
      live.pmouse = live.cursor;
      live.cursor = next;
      live.pending = undefined;
      this.engine.applyPressure(next.pressure);
    }
    this.runFrame(live.down, round2Point(live.cursor), live.pmouse, true);
    if (!this.engine.pendingCommit) this.live = undefined;
  }

  readTarget(target: WebGLRenderTarget): Uint8Array {
    const pixels = new Uint8Array(this.width * this.height * 4);
    this.pass.read(target, pixels);
    return pixels;
  }

  blitBuffer(target: WebGLRenderTarget, pixels: Uint8Array): void {
    const texture = new DataTexture(pixels, this.width, this.height, RGBAFormat, UnsignedByteType);
    texture.flipY = false;
    texture.colorSpace = NoColorSpace;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    this.pass.blitTexture(texture, target, this.fullRect());
    texture.dispose();
  }

  clear(): void {
    if (this.disposedFlag) return;
    this.live = undefined;
    if (this.engine.pendingCommit) this.engine.committed();
    const full = this.fullRect();
    const white: readonly [number, number, number] = [1, 1, 1];
    this.pass.fill(this.wet, full, white);
    this.pass.fill(this.pingPong, full, white);
    this.pass.fill(this.final, full, white);
    this.pass.fill(this.typeMap, full, [0, 0, 0]);
    this.pass.draw(this.composite, this.display, full);
    this.stroke = { ...EMPTY };
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const material of this.materials) material.dispose();
    const targets = [this.wet, this.pingPong, this.scratch, this.final, this.typeMap, this.display, this.force, this.lastStroke];
    for (const target of targets) target?.dispose();
    this.base.dispose();
    this.blank.dispose();
    this.pass.dispose();
  }

  clampRect(rect: PixelRect | undefined): PixelRect | undefined {
    if (!rect) return undefined;
    const x0 = Math.max(0, Math.floor(rect.x));
    const y0 = Math.max(0, Math.floor(rect.y));
    const x1 = Math.min(this.width, Math.ceil(rect.x + rect.w));
    const y1 = Math.min(this.height, Math.ceil(rect.y + rect.h));
    if (x1 <= x0 || y1 <= y0) return undefined;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  fullRect(): PixelRect {
    return { x: 0, y: 0, w: this.width, h: this.height };
  }

  private pressAt(pointer: InkPoint, seed: number | undefined, live = false): void {
    if (this.engine.pendingCommit) this.commit();
    this.serial += 1;
    this.storedRect = undefined;
    this.stroke = { ...EMPTY };
    this.strokeFrames = 0;
    this.engine.applyPressure(pointer.pressure);
    const cursor = round2Point(pointer);
    this.storedSeed = seed ?? ((this.seed + this.serial * 7919) >>> 0);
    this.engine.press(cursor.x, cursor.y, this.storedSeed);
    this.runFrame(true, cursor, pointer, live);
  }

  private runFrame(down: boolean, cursor: InkPoint, pmouse: InkPoint, live: boolean): void {
    const step = this.engine.frame(down, cursor.x, cursor.y, pmouse.x, pmouse.y);
    this.frames += 1;
    this.strokeFrames += 1;
    if (step.ops.length) this.drawOps(step.ops);
    const rect = this.strokeRect();
    if (step.force !== undefined && rect) {
      set1(this.forceMap, 'time', this.frames / 60);
      this.pass.draw(this.forceMap, this.force, rect);
      applyShaderState(this.feedback, this.engine.shaderState());
      set1(this.feedback, 'force', step.force);
      this.pass.draw(this.feedback, this.pingPong, rect);
      this.pass.copy(this.pingPong, this.wet, rect);
      if (live) this.showLive(rect);
    }
    if (step.commit) this.commit();
  }

  private drawOps(ops: readonly InkDrawOp[]): void {
    const bounds: InkBounds = { ...EMPTY };
    for (const op of ops) {
      if (op.kind === 'line') {
        const reach = op.w / 2 + 1;
        grow(bounds, Math.min(op.x0, op.x1) - reach, Math.min(op.y0, op.y1) - reach, Math.max(op.x0, op.x1) + reach, Math.max(op.y0, op.y1) + reach);
      } else if (op.kind === 'dot') {
        grow(bounds, op.x0 - op.w / 2 - 1, op.y0 - op.w / 2 - 1, op.x0 + op.w / 2 + 1, op.y0 + op.w / 2 + 1);
      } else {
        const reach = (op.w + op.h) / 2 + op.lw + 1;
        grow(bounds, op.x0 - reach, op.y0 - reach, op.x0 + reach, op.y0 + reach);
      }
    }
    const rect = this.clampRect(toRect(bounds, 0));
    if (!rect) return;
    grow(this.stroke, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    this.pass.blitStamp(rasterInkOps(ops, rect), rect, this.wet);
  }

  private strokeRect(): PixelRect | undefined {
    const spread = this.engine.effect >= 4 ? 3 * this.strokeFrames : 0;
    return this.clampRect(toRect(this.stroke, 3 + spread));
  }

  private commit(): void {
    const rect = this.strokeRect();
    const state = this.engine.shaderState();
    this.engine.committed();
    if (!rect) return;
    applyShaderState(this.encode, state);
    const custom = state.customBrushColor;
    set3(this.encode, 'customBrushColor', custom[0] / 255, custom[1] / 255, custom[2] / 255);
    this.pass.draw(this.encode, this.scratch, rect);
    this.pass.copy(this.scratch, this.final, rect);
    set1(this.typeEncode, 'brushCategory', state.brushCategory);
    set1(this.typeEncode, 'whiteMaxOpacity', state.whiteMaxOpacity);
    this.pass.draw(this.typeEncode, this.scratch, rect);
    this.pass.copy(this.scratch, this.typeMap, rect);
    if (this.lastStroke) {
      this.pass.fill(this.lastStroke, this.fullRect(), [1, 1, 1]);
      this.pass.copy(this.wet, this.lastStroke, rect);
    }
    this.pass.fill(this.wet, rect, [1, 1, 1]);
    this.pass.draw(this.composite, this.display, rect);
    this.storedRect = rect;
    this.stroke = { ...EMPTY };
  }

  private showLive(rect: PixelRect): void {
    const state = this.engine.shaderState();
    this.pass.draw(this.composite, this.scratch, rect);
    applyShaderState(this.realtime, state);
    const rgb = state.brushColorMode === 33 ? state.customBrushColor : inkColorRgb(state.brushColorMode);
    set3(this.realtime, 'brushColor', rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    bind(this.realtime, 'baseTex', this.scratch.texture);
    this.pass.draw(this.realtime, this.display, rect);
  }

  private finishLive(): void {
    if (!this.live) return;
    if (this.live.down) this.engine.release();
    for (let guard = 0; guard < 200 && this.engine.pendingCommit; guard++) {
      this.runFrame(false, round2Point(this.live.cursor), this.live.cursor, false);
    }
    this.live = undefined;
  }

  private makeBase(options: InkPaintOptions): DataTexture {
    const rgb = this.background;
    let pixels: Uint8Array;
    if (options.transparent) pixels = solid(this.width, this.height, [255, 255, 255]);
    else if (options.paper !== false && options.paperPixels) {
      try {
        pixels = options.paperPixels(this.width, this.height, rgb, this.seed);
      } catch {
        pixels = solid(this.width, this.height, rgb);
      }
    } else pixels = solid(this.width, this.height, rgb);
    const texture = new DataTexture(pixels, this.width, this.height, RGBAFormat, UnsignedByteType);
    texture.flipY = false;
    texture.colorSpace = NoColorSpace;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }

  private forceParams(): {
    seeds: number[]; scales: number[]; amplitudes: number[]; phases: number[]; vortexScales: number[]; clusterScales: number[];
  } {
    const rng = new P5Random(this.seed);
    const seeds: number[] = [];
    const scales: number[] = [];
    const amplitudes: number[] = [];
    const phases: number[] = [];
    const vortexScales: number[] = [];
    const clusterScales: number[] = [];
    for (let i = 0; i < 4; i++) seeds.push(rng.random(100 + i * 100, 200 + i * 100));
    for (let i = 0; i < 3; i++) {
      scales.push(rng.random(0.001 + i * 0.002, 0.003 + i * 0.005));
      amplitudes.push(rng.random(0.1 + i * 0.1, 0.4 + i * 0.2));
      phases.push(rng.random(0, TWO_PI));
    }
    for (let i = 0; i < 2; i++) {
      vortexScales.push(rng.random(0.005 + i * 0.003, 0.015 + i * 0.003));
      clusterScales.push(rng.random(0.0005 + i * 0.0003, 0.002 + i * 0.0005));
    }
    return { seeds, scales, amplitudes, phases, vortexScales, clusterScales };
  }
}

export function num(value: number): InkUniform { return { value }; }
export function vec2(x: number, y: number): InkUniform { return { value: new Vector2(x, y) }; }
export function vec3(x: number, y: number, z: number): InkUniform { return { value: new Vector3(x, y, z) }; }
export function vec4(x: number, y: number, z: number, w: number): InkUniform { return { value: new Vector4(x, y, z, w) }; }
export function tex(texture: Texture): InkUniform { return { value: texture }; }

export function set1(material: RawShaderMaterial, name: string, value: number): void {
  const slot = material.uniforms[name];
  if (slot && typeof slot.value === 'number') slot.value = value;
}

export function set2(material: RawShaderMaterial, name: string, x: number, y: number): void {
  const slot = material.uniforms[name];
  if (slot?.value instanceof Vector2) slot.value.set(x, y);
}

export function set3(material: RawShaderMaterial, name: string, x: number, y: number, z: number): void {
  const slot = material.uniforms[name];
  if (slot?.value instanceof Vector3) slot.value.set(x, y, z);
}

export function set4(material: RawShaderMaterial, name: string, x: number, y: number, z: number, w: number): void {
  const slot = material.uniforms[name];
  if (slot?.value instanceof Vector4) slot.value.set(x, y, z, w);
}

export function bind(material: RawShaderMaterial, name: string, texture: Texture): void {
  const slot = material.uniforms[name];
  if (slot) slot.value = texture;
}

function applyShaderState(material: RawShaderMaterial, state: InkShaderState): void {
  set1(material, 'brushMode', state.brushMode);
  set1(material, 'baseBrushSize', state.baseBrushSize);
  set1(material, 'useSharpen', state.useSharpen);
  set1(material, 'effect3Brightness', state.effect3Brightness);
  set1(material, 'indiffusionStrength', state.indiffusionStrength);
  set1(material, 'brushColorMode', state.brushColorMode);
  set1(material, 'brushCategory', state.brushCategory);
  set1(material, 'mouseCount', state.mouseCount);
  set1(material, 'mouseCountAccumulated', state.mouseCountAccumulated);
  set1(material, 'strokeSeed', state.strokeSeed);
  set1(material, 'whiteMaxOpacity', state.whiteMaxOpacity);
  set1(material, 'hueShift', state.hueShift);
  set1(material, 'satShift', state.satShift);
  set1(material, 'briShift', state.briShift);
  set1(material, 'keyBlendMode', state.keyBlendMode);
  set1(material, 'useSpectralMix', state.useSpectralMix);
}

function pointerPath(points: readonly InkPoint[], gothic: boolean): InkPoint[] {
  const shift = gothic ? 0 : -INK_TIP_OFFSET;
  return points.map(point => (point.pressure === undefined
    ? { x: point.x + shift, y: point.y + shift }
    : { x: point.x + shift, y: point.y + shift, pressure: point.pressure }));
}

function grow(bounds: InkBounds, minX: number, minY: number, maxX: number, maxY: number): void {
  if (minX < bounds.minX) bounds.minX = minX;
  if (minY < bounds.minY) bounds.minY = minY;
  if (maxX > bounds.maxX) bounds.maxX = maxX;
  if (maxY > bounds.maxY) bounds.maxY = maxY;
}

function toRect(bounds: InkBounds, margin: number): PixelRect | undefined {
  if (!(bounds.maxX >= bounds.minX)) return undefined;
  return {
    x: bounds.minX - margin, y: bounds.minY - margin,
    w: bounds.maxX - bounds.minX + margin * 2, h: bounds.maxY - bounds.minY + margin * 2,
  };
}

function round2Point(point: InkPoint): InkPoint {
  return { x: Math.round(point.x * 100) / 100, y: Math.round(point.y * 100) / 100 };
}

function solid(width: number, height: number, rgb: readonly [number, number, number]): Uint8Array {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
    data[i + 3] = 255;
  }
  return data;
}
