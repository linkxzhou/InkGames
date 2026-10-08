import { Filter, GlProgram, type TextureSource } from 'pixi.js';

/**
 * Shared Pixi v8 filter vertex. Matches the engine's other fullscreen filters.
 * Fragment shaders below are GLSL 300 ES ports of inkEngine passes
 * (`feedback.frag` via `runFeedbackPass`, `typeMapEncode.frag`, composite multiply).
 * Attribution: thirdparty/inkEngine, owner-stated written authorization; the instrument is not in the repo.
 */
const vertex = `
in vec2 aPosition;
out vec2 vTextureCoord;
uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
vec4 filterVertexPosition(void) {
  vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
  position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
  position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
  return vec4(position, 0.0, 1.0);
}
vec2 filterTextureCoord(void) {
  return aPosition * (uOutputFrame.zw * uInputSize.zw);
}
void main(void) {
  gl_Position = filterVertexPosition();
  vTextureCoord = filterTextureCoord();
}`;

const copyFragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main(void) {
  finalColor = texture(uTexture, vTextureCoord);
}`;

const depositFragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform sampler2D uStamp;
void main(void) {
  // Stamp alpha is bristle coverage (source-over of black hairs). Multiply it into the wet sheet
  // so overlaps get darker instead of replacing one another.
  float cover = clamp(texture(uStamp, vTextureCoord).a, 0.0, 1.0);
  finalColor = vec4(texture(uTexture, vTextureCoord).rgb * (1.0 - cover * 0.92), 1.0);
}`;

// Dark-priority spread is min(current, force-offset sample), then a short bleed.
// The mix branch follows feedback.frag's useSharpen < 0.5 path; other effects are reduced ports.
const feedbackFragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform sampler2D uForceMap;
uniform float uForce;
uniform float uDiffusion;
uniform float uEffect;
uniform vec2 uTexel;

float luma(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main(void) {
  vec2 uv = vTextureCoord;
  vec4 current = texture(uTexture, uv);
  if (uv.x < 0.002 || uv.x > 0.998 || uv.y < 0.002 || uv.y > 0.998) {
    finalColor = current;
    return;
  }
  vec2 flow = (texture(uForceMap, uv).xy - 0.5) * uForce * 0.2;
  vec4 shifted = texture(uTexture, uv + flow * uTexel);
  vec4 spread = min(current, shifted);
  float ink = 1.0 - luma(current.rgb);
  if (ink < 0.01) {
    finalColor = current;
    return;
  }
  float inkS = 1.0 - luma(spread.rgb);
  if (inkS > 0.01 && uForce > 0.5 && uEffect < 0.5) {
    vec2 dir = -normalize(flow + vec2(0.0001));
    vec4 acc = vec4(0.0);
    float wsum = 0.0;
    vec2 o0 = vec2(0.0, 1.0);
    vec2 o1 = vec2(0.0, -1.0);
    vec2 o2 = vec2(-1.0, 0.0);
    vec2 o3 = vec2(1.0, 0.0);
    vec4 s0 = texture(uTexture, uv + o0 * uTexel * 1.6);
    vec4 s1 = texture(uTexture, uv + o1 * uTexel * 1.6);
    vec4 s2 = texture(uTexture, uv + o2 * uTexel * 1.6);
    vec4 s3 = texture(uTexture, uv + o3 * uTexel * 1.6);
    float i0 = 1.0 - luma(s0.rgb);
    float i1 = 1.0 - luma(s1.rgb);
    float i2 = 1.0 - luma(s2.rgb);
    float i3 = 1.0 - luma(s3.rgb);
    float w0 = (1.0 + abs(inkS - i0) * 2.0) * (1.0 + max(0.0, dot(o0, dir)));
    float w1 = (1.0 + abs(inkS - i1) * 2.0) * (1.0 + max(0.0, dot(o1, dir)));
    float w2 = (1.0 + abs(inkS - i2) * 2.0) * (1.0 + max(0.0, dot(o2, dir)));
    float w3 = (1.0 + abs(inkS - i3) * 2.0) * (1.0 + max(0.0, dot(o3, dir)));
    acc = s0 * w0 * 0.5 + s1 * w1 * 0.5 + s2 * w2 * 0.5 + s3 * w3 * 0.5;
    wsum = w0 + w1 + w2 + w3;
    acc /= max(wsum, 0.0001);
    spread = mix(spread, acc, smoothstep(0.05, 0.6, inkS) * uDiffusion);
    float grain = hash(uv * 100.0) * 0.17 - 0.12;
    spread.rgb += grain * (1.0 - inkS * 0.5) * inkS;
    float dirShade = dot(normalize(flow + vec2(0.001)), vec2(1.0, 1.0)) * 0.5 + 0.5;
    if (inkS > 0.1) spread.rgb *= mix(0.90, 1.06, dirShade);
    if (inkS < 0.5) spread.rgb += (0.3 - inkS) * 0.15;
  } else if (uEffect < 1.5 && inkS > 0.08) {
    vec3 blur = texture(uTexture, uv + vec2(0.0, uTexel.y)).rgb;
    blur += texture(uTexture, uv + vec2(0.0, -uTexel.y)).rgb;
    blur += texture(uTexture, uv + vec2(uTexel.x, 0.0)).rgb;
    blur += texture(uTexture, uv + vec2(-uTexel.x, 0.0)).rgb;
    vec3 sharp = spread.rgb * 5.0 - blur;
    spread.rgb += sharp * 0.08 * inkS;
  } else if (uEffect < 2.5 && inkS > 0.05) {
    float fiber = noise(uv * vec2(90.0, 28.0));
    float gap = smoothstep(0.62, 0.84, fiber);
    spread.rgb += gap * 0.55 * inkS;
  } else if (inkS > 0.08) {
    float streak = noise(uv * vec2(18.0, 70.0));
    float band = smoothstep(0.45, 0.8, streak);
    spread.rgb = mix(spread.rgb, spread.rgb * 0.72, band * 0.45 * inkS);
    spread.rgb += (noise(uv * 40.0) - 0.5) * 0.04 * inkS;
  }
  finalColor = clamp(spread, 0.0, 1.0);
}`;

const commitFragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform sampler2D uWet;
uniform vec3 uPigment;
float luma(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }
void main(void) {
  vec3 dry = texture(uTexture, vTextureCoord).rgb;
  vec3 wet = texture(uWet, vTextureCoord).rgb;
  float darkness = clamp(1.0 - luma(wet), 0.0, 1.0);
  vec3 tinted = mix(vec3(1.0), uPigment, darkness);
  finalColor = vec4(min(dry, tinted), 1.0);
}`;

const typeFragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform sampler2D uWet;
uniform float uCategory;
uniform float uStrokeId;
float luma(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }
void main(void) {
  vec4 previous = texture(uTexture, vTextureCoord);
  float darkness = clamp(1.0 - luma(texture(uWet, vTextureCoord).rgb), 0.0, 1.0);
  if (darkness > 0.08 && previous.r < 0.1) {
    finalColor = vec4(uCategory, darkness, uStrokeId, 1.0);
  } else {
    finalColor = previous;
  }
}`;

const washFragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform vec2 uCenter;
uniform vec2 uSize;
uniform float uRadius;
void main(void) {
  vec3 ink = texture(uTexture, vTextureCoord).rgb;
  float dist = length(vTextureCoord * uSize - uCenter);
  float wipe = smoothstep(uRadius, uRadius * 0.35, dist);
  finalColor = vec4(mix(ink, vec3(1.0), wipe), 1.0);
}`;

const compositeFragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform sampler2D uInk;
uniform sampler2D uWet;
uniform sampler2D uLocked;
uniform sampler2D uType;
uniform vec3 uPigment;
uniform vec2 uTexel;
float luma(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }
void main(void) {
  vec3 paper = texture(uTexture, vTextureCoord).rgb;
  vec3 dry = min(texture(uInk, vTextureCoord).rgb, texture(uLocked, vTextureCoord).rgb);
  vec3 wet = texture(uWet, vTextureCoord).rgb;
  float darkness = clamp(1.0 - luma(wet), 0.0, 1.0);
  vec3 shown = min(dry, mix(vec3(1.0), uPigment, darkness));
  float center = luma(shown);
  float around = luma(texture(uInk, vTextureCoord + vec2(uTexel.x, 0.0)).rgb);
  around += luma(texture(uInk, vTextureCoord - vec2(uTexel.x, 0.0)).rgb);
  around += luma(texture(uInk, vTextureCoord + vec2(0.0, uTexel.y)).rgb);
  around += luma(texture(uInk, vTextureCoord - vec2(0.0, uTexel.y)).rgb);
  around *= 0.25;
  float edge = clamp(center - around, 0.0, 0.25);
  shown *= 1.0 - edge * 0.85;
  vec3 multiplied = paper * shown;
  vec3 screened = vec3(1.0) - (vec3(1.0) - paper) * (vec3(1.0) - shown);
  float whiteInk = texture(uType, vTextureCoord).r;
  finalColor = vec4(whiteInk > 0.75 ? screened : multiplied, 1.0);
}`;

function program(fragment: string, name: string): GlProgram {
  return GlProgram.from({ vertex, fragment, name });
}

export function createCopyFilter(): Filter {
  return new Filter({ glProgram: program(copyFragment, 'ink-copy'), padding: 0, antialias: 'off', resolution: 1 });
}

export function createDepositFilter(stamp: TextureSource): Filter {
  return new Filter({
    glProgram: program(depositFragment, 'ink-deposit'),
    resources: { uStamp: stamp },
    padding: 0, antialias: 'off', resolution: 1,
  });
}

export function createFeedbackFilter(force: TextureSource, width: number, height: number): Filter {
  return new Filter({
    glProgram: program(feedbackFragment, 'ink-feedback'),
    resources: {
      uForceMap: force,
      inkFeedback: {
        uForce: { value: 1, type: 'f32' },
        uDiffusion: { value: 0.45, type: 'f32' },
        uEffect: { value: 0, type: 'f32' },
        uTexel: { value: new Float32Array([1 / width, 1 / height]), type: 'vec2<f32>' },
      },
    },
    padding: 2, antialias: 'off', resolution: 1,
  });
}

export function createCommitFilter(wet: TextureSource): Filter {
  return new Filter({
    glProgram: program(commitFragment, 'ink-commit'),
    resources: {
      uWet: wet,
      inkCommit: {
        uPigment: { value: new Float32Array([0.08, 0.08, 0.08]), type: 'vec3<f32>' },
      },
    },
    padding: 0, antialias: 'off', resolution: 1,
  });
}

export function createTypeFilter(wet: TextureSource): Filter {
  return new Filter({
    glProgram: program(typeFragment, 'ink-type'),
    resources: {
      uWet: wet,
      inkType: {
        uCategory: { value: 0.5, type: 'f32' },
        uStrokeId: { value: 0, type: 'f32' },
      },
    },
    padding: 0, antialias: 'off', resolution: 1,
  });
}

export function createWashFilter(width: number, height: number): Filter {
  return new Filter({
    glProgram: program(washFragment, 'ink-wash-erase'),
    resources: {
      inkWash: {
        uCenter: { value: new Float32Array([0, 0]), type: 'vec2<f32>' },
        uSize: { value: new Float32Array([width, height]), type: 'vec2<f32>' },
        uRadius: { value: 24, type: 'f32' },
      },
    },
    padding: 0, antialias: 'off', resolution: 1,
  });
}

export function createCompositeFilter(
  ink: TextureSource, wet: TextureSource, locked: TextureSource, typeMap: TextureSource, width: number, height: number,
): Filter {
  return new Filter({
    glProgram: program(compositeFragment, 'ink-composite'),
    resources: {
      uInk: ink, uWet: wet, uLocked: locked, uType: typeMap,
      inkComposite: {
        uPigment: { value: new Float32Array([0.08, 0.08, 0.08]), type: 'vec3<f32>' },
        uTexel: { value: new Float32Array([1 / width, 1 / height]), type: 'vec2<f32>' },
      },
    },
    padding: 1, antialias: 'off', resolution: 1,
  });
}

export function setPigment(filter: Filter, group: string, rgb: readonly [number, number, number]): void {
  const uniforms = (filter.resources[group] as { uniforms: { uPigment: Float32Array } }).uniforms;
  uniforms.uPigment[0] = rgb[0];
  uniforms.uPigment[1] = rgb[1];
  uniforms.uPigment[2] = rgb[2];
}

export function setNumber(filter: Filter, group: string, name: string, value: number): void {
  const uniforms = (filter.resources[group] as { uniforms: Record<string, number | Float32Array> }).uniforms;
  uniforms[name] = value;
}
