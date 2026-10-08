import { Filter, GlProgram, type TextureSource } from 'pixi.js';
import {
  INK_COMPOSITE_FRAGMENT, INK_ENCODE_FRAGMENT, INK_FEEDBACK_FRAGMENT, INK_FORCE_MAP_FRAGMENT,
  INK_REALTIME_FRAGMENT, INK_TYPE_MAP_FRAGMENT,
} from './ink-shaders';

/**
 * Pixi filters around the inkEngine shader ports in ink-shaders.ts.
 * Every pass is drawn as a sprite over a pixel rectangle of the sheet; vPixel is that fragment's
 * position in the target texture, so a pass can run on the stroke's rectangle instead of the
 * whole canvas while computing exactly what inkEngine's full-screen pass would.
 */
const vertex = `
in vec2 aPosition;
out vec2 vTextureCoord;
out vec2 vPixel;
uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
void main(void) {
  vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
  vPixel = position;
  position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
  position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
  gl_Position = vec4(position, 0.0, 1.0);
  vTextureCoord = aPosition * (uOutputFrame.zw * uInputSize.zw);
}`;

const washFragment = `
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uSource;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uTypeMode;
void main(void) {
  vec4 color = texture(uSource, vPixel / uCanvas);
  float wipe = smoothstep(uRadius, uRadius * 0.35, length(vPixel - uCenter));
  if (uTypeMode > 0.5) finalColor = wipe > 0.6 ? vec4(0.0, 0.0, 0.0, 1.0) : color;
  else finalColor = vec4(mix(color.rgb, vec3(1.0), wipe), 1.0);
}`;

type UniformType = 'f32' | 'i32' | 'vec2<f32>' | 'vec3<f32>';

interface UniformSpec {
  readonly value: number | Float32Array;
  readonly type: UniformType;
}

export interface InkFilter {
  readonly filter: Filter;
  set(name: string, value: number): void;
  setVec(name: string, ...values: number[]): void;
  bind(name: string, source: TextureSource): void;
}

function makeFilter(name: string, fragment: string, uniforms: Record<string, UniformSpec>, textures: Record<string, TextureSource>, width: number, height: number): InkFilter {
  const group: Record<string, UniformSpec> = {
    uCanvas: { value: new Float32Array([width, height]), type: 'vec2<f32>' },
    ...uniforms,
  };
  const filter = new Filter({
    glProgram: GlProgram.from({ vertex, fragment, name, preferredFragmentPrecision: 'highp' }),
    resources: { ...textures, inkUniforms: group },
    padding: 0, antialias: 'off', resolution: 1,
  });
  const values = (filter.resources.inkUniforms as { uniforms: Record<string, number | Float32Array> }).uniforms;
  return {
    filter,
    set(key, value) {
      if (typeof values[key] === 'number') values[key] = value;
    },
    setVec(key, ...vector) {
      const target = values[key];
      if (target instanceof Float32Array) vector.forEach((v, i) => { target[i] = v; });
    },
    bind(key, source) { filter.resources[key] = source; },
  };
}

const f = (value = 0): UniformSpec => ({ value, type: 'f32' });
const v3 = (a = 0, b = 0, c = 0): UniformSpec => ({ value: new Float32Array([a, b, c]), type: 'vec3<f32>' });

export function createFeedbackFilter(wet: TextureSource, force: TextureSource, width: number, height: number): InkFilter {
  return makeFilter('ink-feedback', INK_FEEDBACK_FRAGMENT, {
    force: f(1), indiffusionStrength: f(0.45), brushMode: f(1), baseBrushSize: f(2), useSharpen: f(0),
    effect3Brightness: f(0.2), brushColorMode: f(0), brushCategory: f(0), mouseCount: f(0),
    mouseCountAccumulated: f(0), strokeSeed: f(0),
  }, { tex0: wet, forceMap: force }, width, height);
}

export function createEncodeFilter(final: TextureSource, wet: TextureSource, typeMap: TextureSource, width: number, height: number): InkFilter {
  return makeFilter('ink-encode', INK_ENCODE_FRAGMENT, {
    brushColorMode: f(0), brushCategory: f(0), whiteMaxOpacity: f(0.95), hueShift: f(0), satShift: f(0),
    briShift: f(0), keyBlendMode: { value: 0, type: 'i32' }, useSharpen: f(0),
    canvasBackgroundColor: v3(222 / 255, 222 / 255, 222 / 255), customBrushColor: v3(26 / 255, 26 / 255, 26 / 255),
    useSpectralMix: f(0),
  }, { baseTex: final, strokeTex: wet, typeMapTex: typeMap }, width, height);
}

export function createTypeMapFilter(typeMap: TextureSource, wet: TextureSource, width: number, height: number): InkFilter {
  return makeFilter('ink-type-map', INK_TYPE_MAP_FRAGMENT, {
    brushCategory: f(0), whiteMaxOpacity: f(0.95),
  }, { baseTex: typeMap, strokeTex: wet }, width, height);
}

export function createCompositeFilter(base: TextureSource, final: TextureSource, typeMap: TextureSource, width: number, height: number): InkFilter {
  return makeFilter('ink-composite', INK_COMPOSITE_FRAGMENT, {}, { baseTex: base, encodedTex: final, typeMapTex: typeMap }, width, height);
}

export function createRealtimeFilter(base: TextureSource, wet: TextureSource, final: TextureSource, width: number, height: number): InkFilter {
  return makeFilter('ink-realtime', INK_REALTIME_FRAGMENT, {
    brushColorMode: f(0), brushCategory: f(0), brushColor: v3(26 / 255, 26 / 255, 26 / 255),
    whiteMaxOpacity: f(0.95), hueShift: f(0), satShift: f(0), briShift: f(0),
  }, { baseTex: base, addTex: wet, encodedTex: final }, width, height);
}

/** Force field parameters as randomizeForceMap draws them; index 0 of each set is the one inkEngine never uploads. */
export interface ForceMapParams {
  readonly seeds: readonly number[];
  readonly scales: readonly number[];
  readonly amplitudes: readonly number[];
  readonly phases: readonly number[];
  readonly vortexScales: readonly number[];
  readonly clusterScales: readonly number[];
}

export function createForceMapFilter(params: ForceMapParams, width: number, height: number): InkFilter {
  // mapFrag declares randomSeed1/scale1/amplitude1/phase1/vortexScale1/clusterScale1 under names the
  // original minifier changed (_x5.._x10), so inkEngine leaves them at 0. Same here.
  return makeFilter('ink-force-map', INK_FORCE_MAP_FRAGMENT, {
    _x5: f(0), _x6: f(0), _x7: f(0), _x8: f(0), _x9: f(0), _x10: f(0),
    randomSeed2: f(params.seeds[1] ?? 200), randomSeed3: f(params.seeds[2] ?? 300), randomSeed4: f(params.seeds[3] ?? 400),
    scale2: f(params.scales[1] ?? 0.005), scale3: f(params.scales[2] ?? 0.015),
    amplitude2: f(params.amplitudes[1] ?? 0.4), amplitude3: f(params.amplitudes[2] ?? 0.3),
    phase2: f(params.phases[1] ?? 0), phase3: f(params.phases[2] ?? 0),
    vortexScale2: f(params.vortexScales[1] ?? 0.012), clusterScale2: f(params.clusterScales[1] ?? 0.0008),
    canvasCenter: { value: new Float32Array([width / 2, height / 2]), type: 'vec2<f32>' },
    time: f(0),
  }, {}, width, height);
}

export function createWashFilter(source: TextureSource, width: number, height: number): InkFilter {
  return makeFilter('ink-wash-erase', washFragment, {
    uCenter: { value: new Float32Array([0, 0]), type: 'vec2<f32>' }, uRadius: f(24), uTypeMode: f(0),
  }, { uSource: source }, width, height);
}
