import {
  DataTexture, LinearFilter, NoColorSpace, NormalBlending, RGBAFormat, UnsignedByteType, Vector2, Vector3, Vector4,
  type RawShaderMaterial, type Texture, type WebGLRenderer, type WebGLRenderTarget,
} from 'three';
import {
  INK_TIP_OFFSET, InkBrushEngine, type InkBrushSettings, type InkDrawOp, type InkPoint, type InkShaderState,
} from './ink-brush';
import { type InkBite, scanInkBites } from './ink-metallic';
import { inkColorRgb } from './ink-palette';
import { inkPaperPixels } from './ink-paper';
import { inkCos, inkSin, P5Random, TWO_PI } from './ink-random';
import { InkPass, whiteTexture, type InkUniform } from './ink-pass';
import { rasterInkOps, type PixelRect } from './ink-raster';
import {
  INK_COMPOSITE_FRAGMENT, INK_DISTORT_FRAGMENT, INK_ENCODE_FRAGMENT, INK_FEEDBACK_FRAGMENT,
  INK_FLOW_FRAGMENT, INK_FORCE_MAP_FRAGMENT, INK_METALLIC_FRAGMENT, INK_REALTIME_FRAGMENT,
  INK_TYPE_MAP_FRAGMENT,
} from './ink-shaders';
import type { InkColor, InkFinish, InkStrokeRequest } from './ink-wash';

export interface InkSurfaceOptions {
  readonly width: number;
  readonly height: number;
  readonly seed?: number;
  readonly paper?: boolean;
  readonly background?: readonly [number, number, number];
  readonly transparent?: boolean;
}

/** CPU copy of the committed sheet. Row 0 is the top, matching the y-down pass. */
export interface InkSurfaceSnapshot {
  readonly width: number;
  readonly height: number;
  readonly frameCount: number;
  readonly final: Uint8Array;
  readonly typeMap: Uint8Array;
  readonly wet: Uint8Array;
}

interface Bounds { minX: number; minY: number; maxX: number; maxY: number }

const EMPTY: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

const WASH = `
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uSource;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uTypeMode;
void main() {
  vec4 color = texture(uSource, vec2(vPixel.x / uCanvas.x, vPixel.y / uCanvas.y));
  float wipe = smoothstep(uRadius, uRadius * 0.35, length(vPixel - uCenter));
  if (uTypeMode > 0.5) finalColor = wipe > 0.6 ? vec4(0.0, 0.0, 0.0, 1.0) : color;
  else finalColor = vec4(mix(color.rgb, vec3(1.0), wipe), 1.0);
}
`;

/**
 * inkEngine's sheet on three.js render targets.
 * The brush stays in InkBrushEngine. Pass order matches InkWash: stamp, one feedback,
 * falling force after lift, then encode, type map, composite. Live wet ink uses realtime.
 * Collision is not read back from these targets.
 */
export class InkSurface {
  readonly width: number;
  readonly height: number;
  private readonly pass: InkPass;
  private readonly engine = new InkBrushEngine();
  private readonly seed: number;
  private readonly background: readonly [number, number, number];
  private readonly wet: WebGLRenderTarget;
  private readonly pingPong: WebGLRenderTarget;
  private readonly scratch: WebGLRenderTarget;
  private readonly final: WebGLRenderTarget;
  private readonly typeMap: WebGLRenderTarget;
  private readonly display: WebGLRenderTarget;
  private readonly force: WebGLRenderTarget;
  private readonly lastStroke: WebGLRenderTarget;
  private readonly bugsMask: WebGLRenderTarget;
  private readonly bugsData: WebGLRenderTarget;
  private readonly base: DataTexture;
  private readonly blank: DataTexture;
  private readonly feedback: RawShaderMaterial;
  private readonly encode: RawShaderMaterial;
  private readonly typeEncode: RawShaderMaterial;
  private readonly composite: RawShaderMaterial;
  private readonly realtime: RawShaderMaterial;
  private readonly forceMap: RawShaderMaterial;
  private readonly distort: RawShaderMaterial;
  private readonly flow: RawShaderMaterial;
  private readonly metallic: RawShaderMaterial;
  private readonly washColor: RawShaderMaterial;
  private readonly washType: RawShaderMaterial;
  private readonly forceSeeds: readonly number[];
  private readonly materials: RawShaderMaterial[];
  private stroke: Bounds = { ...EMPTY };
  private pathBounds: Bounds = { ...EMPTY };
  private lastRect: PixelRect | undefined;
  private strokeFrames = 0;
  private frameCount = 2;
  private serial = 0;
  private pendingFinish: InkFinish | undefined;
  private strokeSeed = 0;
  private live: { down: boolean; cursor: InkPoint; pmouse: InkPoint; pending: InkPoint | undefined; lift: number } | undefined;
  private disposed = false;

  constructor(renderer: WebGLRenderer, options: InkSurfaceOptions) {
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
    this.lastStroke = make();
    this.bugsMask = make();
    this.bugsData = make();
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
    this.distort = this.pass.material(INK_DISTORT_FRAGMENT, {
      tex0: tex(this.display.texture), forceMap: tex(this.force.texture),
      time: num(0), distortEnabled: num(1), displacementB: num(20), displacementC: num(50), showFbmMask: num(0),
      fbmSeed1: num(this.forceSeeds[0] || 100), fbmSeed2: num(this.forceSeeds[1] || 200),
      fbmSeed3: num(this.forceSeeds[2] || 300), fbmSeed4: num(this.forceSeeds[3] || 400),
      backgroundColor: vec3(bg[0] / 255, bg[1] / 255, bg[2] / 255),
      rsEnabled: num(0), rsFrequency: num(300), rsWaveSpeed: num(1), rsStrength: num(0.5), rsGradientMix: num(0.1), rsScale: num(100),
      cellularEnabled: num(0), cellularScale: num(15), cellularSeed: num(0.5), whiteDotDensity: num(0), grainAmount: num(0),
    });
    this.flow = this.pass.material(INK_FLOW_FRAGMENT, {
      tex0: tex(this.final.texture), lastStrokeTex: tex(this.lastStroke.texture),
      lastStrokeOnly: num(0), blendType: num(0), blendVol: num(100), radSeed: num(0),
      strokeBounds: vec4(0, 0, 1, 1), pixD: num(1), blendA: num(0.01), blendB: num(25), directVol: num(10), snoiseVol: num(3),
      gobalStyle: num(0), vline: num(5), hline: num(5), cellT: num(1), colorDeep: num(0.015), whiteDot: num(0.01),
      doBigShape: num(0), doMask: num(0.5), multiDir: num(0), drawTime: num(1), seed: num(0), iTime: num(0), pixelScale: num(1),
      isTypeMapMode: num(0),
    });
    this.metallic = this.pass.material(INK_METALLIC_FRAGMENT, {
      tex0: tex(this.display.texture), bugsMask: tex(this.blank), bugsData: tex(this.blank),
      time: num(0), resolution: vec2(w, h), metallicStrength: num(0.85), flowSpeed: num(1),
      lightPos: vec2(0.5, 0.4), specularPower: num(12), fresnelStrength: num(0.5),
      metalTint: vec3(0.72, 0.5, 0.35),
    });
    this.washColor = this.pass.material(WASH, {
      uSource: tex(this.final.texture), uCenter: vec2(0, 0), uRadius: num(24), uTypeMode: num(0),
    });
    this.washType = this.pass.material(WASH, {
      uSource: tex(this.typeMap.texture), uCenter: vec2(0, 0), uRadius: num(24), uTypeMode: num(1),
    });
    this.materials = [
      this.feedback, this.encode, this.typeEncode, this.composite, this.realtime, this.forceMap,
      this.distort, this.flow, this.metallic, this.washColor, this.washType,
    ];
    const full = this.fullRect();
    const white: readonly [number, number, number] = [1, 1, 1];
    this.pass.fill(this.wet, full, white);
    this.pass.fill(this.pingPong, full, white);
    this.pass.fill(this.final, full, white);
    this.pass.fill(this.lastStroke, full, white);
    this.pass.fill(this.typeMap, full, [0, 0, 0]);
    this.pass.draw(this.forceMap, this.force, full);
    this.pass.draw(this.composite, this.display, full);
  }

  get texture(): Texture { return this.display.texture; }

  setBrush(settings: InkBrushSettings): void {
    this.engine.configure(settings);
  }

  setColor(color: InkColor): void {
    this.engine.setColor(color);
  }

  paint(stroke: InkStrokeRequest): void {
    this.setBrush(stroke.brush);
    this.setColor(stroke.color);
    this.pendingFinish = stroke.finish;
    this.strokePath(stroke.points, stroke.seed);
    this.pendingFinish = undefined;
  }

  strokePath(points: readonly InkPoint[], seed?: number): void {
    if (this.disposed || !points.length) return;
    this.finishLive();
    const pointer = pointerPath(points, this.engine.mode === 3);
    const first = pointer[0];
    if (!first) return;
    this.pathBounds = { ...EMPTY };
    for (const point of pointer) grow(this.pathBounds, point.x, point.y, point.x, point.y);
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
    const finish = this.pendingFinish;
    if (finish) this.applyFinish(finish);
  }

  beginStroke(x: number, y: number, seed = 0): void {
    if (this.disposed) return;
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
    if (!live || this.disposed) return;
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

  wash(x: number, y: number, radius: number): void {
    if (this.disposed) return;
    const rect = this.clampRect({
      x: Math.floor(x - radius - 2), y: Math.floor(y - radius - 2),
      w: Math.ceil(radius * 2 + 4), h: Math.ceil(radius * 2 + 4),
    });
    if (!rect) return;
    set2(this.washColor, 'uCenter', x, y);
    set2(this.washType, 'uCenter', x, y);
    set1(this.washColor, 'uRadius', Math.max(1, radius));
    set1(this.washType, 'uRadius', Math.max(1, radius));
    this.pass.draw(this.washColor, this.scratch, rect);
    this.pass.copy(this.scratch, this.final, rect);
    this.pass.draw(this.washType, this.scratch, rect);
    this.pass.copy(this.scratch, this.typeMap, rect);
    this.pass.draw(this.composite, this.display, rect);
  }

  snapshot(): InkSurfaceSnapshot {
    return {
      width: this.width,
      height: this.height,
      frameCount: this.frameCount,
      final: this.readTarget(this.final),
      typeMap: this.readTarget(this.typeMap),
      wet: this.readTarget(this.wet),
    };
  }

  restore(snapshot: InkSurfaceSnapshot): void {
    if (this.disposed || snapshot.width !== this.width || snapshot.height !== this.height) return;
    this.blitBuffer(this.final, snapshot.final);
    this.blitBuffer(this.typeMap, snapshot.typeMap);
    this.blitBuffer(this.wet, snapshot.wet);
    this.frameCount = snapshot.frameCount;
    this.pass.draw(this.composite, this.display, this.fullRect());
  }

  /** Flow, distort, or metallic on the last committed stroke. Used by cutscene effect cues. */
  replayEffect(finish: InkFinish): void {
    if (this.disposed) return;
    this.applyFinish(finish);
  }

  clear(): void {
    if (this.disposed) return;
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
    if (this.disposed) return;
    this.disposed = true;
    for (const material of this.materials) material.dispose();
    for (const target of [this.wet, this.pingPong, this.scratch, this.final, this.typeMap, this.display, this.force, this.lastStroke, this.bugsMask, this.bugsData]) {
      target.dispose();
    }
    this.base.dispose();
    this.blank.dispose();
    this.pass.dispose();
  }

  private pressAt(pointer: InkPoint, seed: number | undefined, live = false): void {
    if (this.engine.pendingCommit) this.commit();
    this.serial += 1;
    this.lastRect = undefined;
    this.stroke = { ...EMPTY };
    this.strokeFrames = 0;
    this.engine.applyPressure(pointer.pressure);
    const cursor = round2Point(pointer);
    this.strokeSeed = seed ?? ((this.seed + this.serial * 7919) >>> 0);
    this.engine.press(cursor.x, cursor.y, this.strokeSeed);
    this.runFrame(true, cursor, pointer, live);
  }

  private runFrame(down: boolean, cursor: InkPoint, pmouse: InkPoint, live: boolean): void {
    const step = this.engine.frame(down, cursor.x, cursor.y, pmouse.x, pmouse.y);
    this.frameCount += 1;
    this.strokeFrames += 1;
    if (step.ops.length) this.drawOps(step.ops);
    const rect = this.strokeRect();
    if (step.force !== undefined && rect) {
      set1(this.forceMap, 'time', this.frameCount / 60);
      this.pass.draw(this.forceMap, this.force, rect);
      this.applyShaderState(this.feedback, this.engine.shaderState());
      set1(this.feedback, 'force', step.force);
      this.pass.draw(this.feedback, this.pingPong, rect);
      this.pass.copy(this.pingPong, this.wet, rect);
      if (live) this.showLive(rect);
    }
    if (step.commit) this.commit();
  }

  private drawOps(ops: readonly InkDrawOp[]): void {
    const bounds: Bounds = { ...EMPTY };
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
    this.applyShaderState(this.encode, state);
    const custom = state.customBrushColor;
    set3(this.encode, 'customBrushColor', custom[0] / 255, custom[1] / 255, custom[2] / 255);
    this.pass.draw(this.encode, this.scratch, rect);
    this.pass.copy(this.scratch, this.final, rect);
    set1(this.typeEncode, 'brushCategory', state.brushCategory);
    set1(this.typeEncode, 'whiteMaxOpacity', state.whiteMaxOpacity);
    this.pass.draw(this.typeEncode, this.scratch, rect);
    this.pass.copy(this.scratch, this.typeMap, rect);
    this.pass.fill(this.lastStroke, this.fullRect(), [1, 1, 1]);
    this.pass.copy(this.wet, this.lastStroke, rect);
    this.pass.fill(this.wet, rect, [1, 1, 1]);
    this.pass.draw(this.composite, this.display, rect);
    this.lastRect = rect;
    this.stroke = { ...EMPTY };
  }

  private showLive(rect: PixelRect): void {
    const state = this.engine.shaderState();
    this.pass.draw(this.composite, this.scratch, rect);
    this.applyShaderState(this.realtime, state);
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

  private applyShaderState(material: RawShaderMaterial, state: InkShaderState): void {
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

  private applyFinish(finish: InkFinish): void {
    const rect = finish.distort?.extent === 'frame' ? this.fullRect() : this.effectRect();
    if (!rect) return;
    if (finish.metallic) this.applyMetallic(rect, finish.metallic.tint ?? [0.72, 0.5, 0.35], finish.metallic.size ?? 10);
    if (finish.distort) this.applyDistort(rect, finish.distort.displacementB ?? 20, finish.distort.displacementC ?? 50);
    if (finish.flow) this.applyFlow(finish.flow.blendType, finish.flow.iterations, finish.flow.seed);
  }

  private effectRect(): PixelRect | undefined {
    const ink = this.lastRect;
    if (!ink) return undefined;
    const mirrorY = this.height - (ink.y + ink.h);
    const y = Math.min(ink.y, mirrorY);
    const y1 = Math.max(ink.y + ink.h, mirrorY + ink.h);
    return this.clampRect({ x: ink.x - 24, y: y - 24, w: ink.w + 48, h: y1 - y + 48 });
  }

  private applyFlow(blendType: number, iterations: number, seed: number | undefined): void {
    const bounds = this.pathBoundsNormalized();
    const rect = this.effectRect();
    if (!bounds || !rect) return;
    const count = Math.max(0, Math.floor(iterations));
    const flowSeed = seed ?? (this.strokeSeed % 1000000);
    set1(this.flow, 'blendType', blendType);
    set1(this.flow, 'blendVol', 100 * (1 + count * 0.1));
    set1(this.flow, 'radSeed', flowSeed * 0.001);
    set4(this.flow, 'strokeBounds', bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    set1(this.flow, 'seed', flowSeed * 0.0001);
    set1(this.flow, 'iTime', this.frameCount / 60);
    set1(this.flow, 'isTypeMapMode', 0);
    bind(this.flow, 'tex0', this.final.texture);
    this.pass.draw(this.flow, this.scratch, rect);
    this.pass.copy(this.scratch, this.final, rect);
    set1(this.flow, 'isTypeMapMode', 1);
    bind(this.flow, 'tex0', this.typeMap.texture);
    this.pass.draw(this.flow, this.scratch, rect);
    this.pass.copy(this.scratch, this.typeMap, rect);
    this.pass.draw(this.composite, this.display, rect);
  }

  private applyDistort(rect: PixelRect, displacementB: number, displacementC: number): void {
    set1(this.forceMap, 'time', this.frameCount / 60);
    this.pass.draw(this.forceMap, this.force, rect);
    bind(this.distort, 'tex0', this.display.texture);
    set1(this.distort, 'time', (this.frameCount / 60) * 0.005);
    set1(this.distort, 'displacementB', displacementB);
    set1(this.distort, 'displacementC', displacementC);
    this.pass.draw(this.distort, this.scratch, rect);
    this.pass.copy(this.scratch, this.display, rect);
  }

  private applyMetallic(rect: PixelRect, tint: readonly [number, number, number], size: number): void {
    const pixels = this.readTarget(this.display);
    const focus = this.lastRect ?? rect;
    const crop = new Uint8Array(focus.w * focus.h * 4);
    for (let y = 0; y < focus.h; y++) {
      const src = ((focus.y + y) * this.width + focus.x) * 4;
      crop.set(pixels.subarray(src, src + focus.w * 4), y * focus.w * 4);
    }
    const bites = scanInkBites(
      crop, focus.w, focus.h, focus.x, focus.y, this.width, this.height, this.background,
      this.strokeSeed, size, tint,
    );
    if (!bites.length) return;
    this.paintBites(bites);
    const t = this.frameCount / 600;
    bind(this.metallic, 'tex0', this.display.texture);
    set1(this.metallic, 'time', this.frameCount * 1000 / 60);
    set2(this.metallic, 'lightPos', 0.5 + inkSin(t * 0.7) * 0.3, 0.4 + inkCos(t * 0.5) * 0.25);
    set3(this.metallic, 'metalTint', tint[0], tint[1], tint[2]);
    const cover = this.clampRect({ x: rect.x - 48, y: rect.y - 48, w: rect.w + 96, h: rect.h + 96 }) ?? rect;
    this.pass.draw(this.metallic, this.scratch, cover);
    this.pass.copy(this.scratch, this.display, cover);
  }

  private paintBites(bites: readonly InkBite[]): void {
    const mask = document.createElement('canvas');
    const data = document.createElement('canvas');
    mask.width = data.width = this.width;
    mask.height = data.height = this.height;
    const maskCtx = mask.getContext('2d');
    const dataCtx = data.getContext('2d');
    if (!maskCtx || !dataCtx) return;
    for (const bite of bites) {
      paintBite(maskCtx, bite, `rgb(${Math.round(bite.r)},${Math.round(bite.g)},${Math.round(bite.b)})`);
      const r = Math.round(clamp01(bite.x / this.width) * 255);
      const g = Math.round(clamp01(bite.y / this.height) * 255);
      const b = Math.round(clamp01(bite.size / this.width) * 255);
      paintBite(dataCtx, bite, `rgb(${r},${g},${b})`);
    }
    this.paintCanvas(mask, this.bugsMask, 'bugsMask');
    this.paintCanvas(data, this.bugsData, 'bugsData');
  }

  private paintCanvas(canvas: HTMLCanvasElement, target: WebGLRenderTarget, uniform: string): void {
    const image = canvas.getContext('2d')?.getImageData(0, 0, this.width, this.height);
    if (!image) return;
    const texture = new DataTexture(new Uint8Array(image.data.buffer), this.width, this.height, RGBAFormat, UnsignedByteType);
    texture.flipY = false;
    texture.colorSpace = NoColorSpace;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    this.pass.blitTexture(texture, target, this.fullRect());
    bind(this.metallic, uniform, target.texture);
    texture.dispose();
  }

  private pathBoundsNormalized(): { minX: number; minY: number; maxX: number; maxY: number } | undefined {
    const b = this.pathBounds;
    if (!(b.maxX >= b.minX)) return undefined;
    const pad = 20;
    return {
      minX: Math.max(0, b.minX - pad) / this.width,
      minY: Math.max(0, b.minY - pad) / this.height,
      maxX: Math.min(1, b.maxX + pad) / this.width,
      maxY: Math.min(1, b.maxY + pad) / this.height,
    };
  }

  private readTarget(target: WebGLRenderTarget): Uint8Array {
    const pixels = new Uint8Array(this.width * this.height * 4);
    // The pass writes sheet row 0 at the GL bottom, and readPixels starts there, so the buffer is already top-first.
    this.pass.read(target, pixels);
    return pixels;
  }

  private blitBuffer(target: WebGLRenderTarget, pixels: Uint8Array): void {
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

  private makeBase(options: InkSurfaceOptions): DataTexture {
    const rgb = this.background;
    let pixels: Uint8Array;
    if (options.transparent) pixels = solid(this.width, this.height, [255, 255, 255]);
    else if (options.paper === false) pixels = solid(this.width, this.height, rgb);
    else {
      try {
        pixels = inkPaperPixels(this.width, this.height, rgb, this.seed);
      } catch {
        pixels = solid(this.width, this.height, rgb);
      }
    }
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

  private fullRect(): PixelRect {
    return { x: 0, y: 0, w: this.width, h: this.height };
  }

  private clampRect(rect: PixelRect | undefined): PixelRect | undefined {
    if (!rect) return undefined;
    const x0 = Math.max(0, Math.floor(rect.x));
    const y0 = Math.max(0, Math.floor(rect.y));
    const x1 = Math.min(this.width, Math.ceil(rect.x + rect.w));
    const y1 = Math.min(this.height, Math.ceil(rect.y + rect.h));
    if (x1 <= x0 || y1 <= y0) return undefined;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
}

function pointerPath(points: readonly InkPoint[], gothic: boolean): InkPoint[] {
  const shift = gothic ? 0 : -INK_TIP_OFFSET;
  return points.map(point => (point.pressure === undefined
    ? { x: point.x + shift, y: point.y + shift }
    : { x: point.x + shift, y: point.y + shift, pressure: point.pressure }));
}

function num(value: number): InkUniform { return { value }; }
function vec2(x: number, y: number): InkUniform { return { value: new Vector2(x, y) }; }
function vec3(x: number, y: number, z: number): InkUniform { return { value: new Vector3(x, y, z) }; }
function vec4(x: number, y: number, z: number, w: number): InkUniform { return { value: new Vector4(x, y, z, w) }; }
function tex(texture: Texture): InkUniform { return { value: texture }; }

function set1(material: RawShaderMaterial, name: string, value: number): void {
  const slot = material.uniforms[name];
  if (slot && typeof slot.value === 'number') slot.value = value;
}

function set2(material: RawShaderMaterial, name: string, x: number, y: number): void {
  const slot = material.uniforms[name];
  if (slot?.value instanceof Vector2) slot.value.set(x, y);
}

function set3(material: RawShaderMaterial, name: string, x: number, y: number, z: number): void {
  const slot = material.uniforms[name];
  if (slot?.value instanceof Vector3) slot.value.set(x, y, z);
}

function set4(material: RawShaderMaterial, name: string, x: number, y: number, z: number, w: number): void {
  const slot = material.uniforms[name];
  if (slot?.value instanceof Vector4) slot.value.set(x, y, z, w);
}

function bind(material: RawShaderMaterial, name: string, texture: Texture): void {
  const slot = material.uniforms[name];
  if (slot) slot.value = texture;
}

function grow(bounds: Bounds, minX: number, minY: number, maxX: number, maxY: number): void {
  if (minX < bounds.minX) bounds.minX = minX;
  if (minY < bounds.minY) bounds.minY = minY;
  if (maxX > bounds.maxX) bounds.maxX = maxX;
  if (maxY > bounds.maxY) bounds.maxY = maxY;
}

function toRect(bounds: Bounds, margin: number): PixelRect | undefined {
  if (!(bounds.maxX >= bounds.minX)) return undefined;
  return {
    x: bounds.minX - margin, y: bounds.minY - margin,
    w: bounds.maxX - bounds.minX + margin * 2, h: bounds.maxY - bounds.minY + margin * 2,
  };
}

function round2Point(point: InkPoint): InkPoint {
  return { x: Math.round(point.x * 100) / 100, y: Math.round(point.y * 100) / 100 };
}

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
