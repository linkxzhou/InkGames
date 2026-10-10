/**
 * 密度场 D、含水量 W、颜料和历史最大密度。
 * 平流用 curl，扩散被纸纤维拉成各向异性，水干了墨就冻住。
 * 着色分成墨核、晕带、水痕三层，再乘纸纹颗粒。不是从 inkEngine 着色器抄的。
 */

const NOISE = `
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}
vec2 curl(vec2 p) {
  float e = 0.012;
  float n1 = fbm(p + vec2(0.0, e));
  float n2 = fbm(p - vec2(0.0, e));
  float n3 = fbm(p + vec2(e, 0.0));
  float n4 = fbm(p - vec2(e, 0.0));
  return vec2(n1 - n2, n4 - n3);
}
float blob(vec2 p, float r, float seed, float water, vec2 dir) {
  float ang = atan(p.y, p.x);
  float wob = sin(ang * 3.0 + seed) * 0.28 + sin(ang * 5.0 - seed * 1.4) * 0.14;
  float rr = length(p) / max(r * (1.0 + wob), 0.001);
  float core = exp(-rr * rr * 1.15);
  float halo = exp(-rr * rr * 0.22) * 0.62;
  float ink = core + halo;
  float across = p.x * dir.y - p.y * dir.x;
  float stripe = sin(across / max(r, 0.004) * 11.0 + seed);
  float fw = smoothstep(-0.2, 0.55, stripe);
  float dry = smoothstep(0.35, 0.05, water);
  ink *= mix(1.0, fw, dry * 0.85);
  return ink;
}
`;

export const FX_VERT = `
precision highp float;
in vec3 position;
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const FX_CLEAR = `
precision highp float;
in vec2 vUv;
out vec4 finalColor;
void main() { finalColor = vec4(0.0); }
`;

export const FX_SIM = `
precision highp float;
in vec2 vUv;
out vec4 finalColor;
uniform sampler2D uState;
uniform vec2 uResolution;
uniform float uDt;
uniform float uTime;
uniform float uFlow;
uniform float uDiffuse;
uniform float uEvap;
uniform float uFade;
uniform float uRecede;
uniform float uClear;
uniform float uDensity;
uniform float uOriginX;
uniform float uOriginY;
uniform float uSeed;
uniform int uOverlay;
uniform vec4 uA[16];
uniform vec4 uB[16];
${NOISE}
float subject(vec2 fx) {
  vec2 p = fx - vec2(0.58, 0.62);
  float trunk = 1.0 - smoothstep(0.02, 0.05, abs(p.x));
  float crown = 1.0 - smoothstep(0.12, 0.22, length((p - vec2(0.0, -0.12)) * vec2(1.0, 1.2)));
  float ridge = fbm(vec2(fx.x * 1.6, 2.0));
  float mount = smoothstep(0.5 + ridge * 0.06, 0.34, fx.y);
  return clamp(max(mount, max(trunk, crown)), 0.0, 1.0);
}
void main() {
  if (uClear > 0.5) {
    finalColor = vec4(0.0);
    return;
  }
  vec2 fx = vec2(vUv.x, 1.0 - vUv.y);
  vec2 vel = curl(fx * 1.6 + vec2(uTime * 0.05, uSeed)) * uFlow * 0.85;
  vel += curl(fx * 3.4 - vec2(uTime * 0.03, 1.7)) * uFlow * 0.28;
  for (int i = 0; i < 16; i++) {
    vec4 a = uA[i];
    if (a.w <= 0.001) continue;
    vec2 sp = vec2(a.x, 1.0 - a.y);
    vec2 d = vUv - sp;
    float inf = exp(-dot(d, d) / max(a.z * a.z * 4.0, 0.00008));
    vel += uB[i].zw * inf * 0.8;
  }
  vec2 back = clamp(vUv - vel * uDt, vec2(0.001), vec2(0.999));
  vec4 prev = texture(uState, back);
  vec2 texel = 1.0 / uResolution;
  float fiber = fbm(fx * vec2(28.0, 7.0));
  float wet = prev.g;
  float reach = 1.3 + wet * clamp(uDiffuse, 0.0, 1.0) * 6.5;
  vec2 stepUV = texel * vec2(reach * (1.2 + fiber), reach * (0.55 + fiber * 0.25));
  float blur = 0.0;
  blur += texture(uState, clamp(vUv + vec2(stepUV.x, 0.0), vec2(0.0), vec2(1.0))).r;
  blur += texture(uState, clamp(vUv - vec2(stepUV.x, 0.0), vec2(0.0), vec2(1.0))).r;
  blur += texture(uState, clamp(vUv + vec2(0.0, stepUV.y), vec2(0.0), vec2(1.0))).r;
  blur += texture(uState, clamp(vUv - vec2(0.0, stepUV.y), vec2(0.0), vec2(1.0))).r;
  blur += texture(uState, clamp(vUv + stepUV, vec2(0.0), vec2(1.0))).r;
  blur += texture(uState, clamp(vUv - stepUV, vec2(0.0), vec2(1.0))).r;
  blur += texture(uState, clamp(vUv + vec2(stepUV.x, -stepUV.y), vec2(0.0), vec2(1.0))).r;
  blur += texture(uState, clamp(vUv + vec2(-stepUV.x, stepUV.y), vec2(0.0), vec2(1.0))).r;
  blur *= 0.125;
  float diff = uDiffuse * max(wet, 0.15);
  if (uOverlay == 9) diff *= mix(0.15, 1.0, subject(fx));
  float D = mix(prev.r, blur, clamp(diff, 0.0, 0.78));
  float W = prev.g * (1.0 - clamp(uEvap * uDt, 0.0, 0.5));
  float pigment = prev.b;
  D *= (1.0 - clamp(uFade, 0.0, 0.5));
  if (uRecede > 0.001) {
    float edge = uRecede * 0.85;
    float keep = smoothstep(edge, edge + 0.1, length(fx - vec2(uOriginX, uOriginY)) + (fbm(fx * 5.0) - 0.5) * 0.16);
    float hole = step(0.78, fbm(fx * 8.0 + 2.0));
    D *= mix(1.0, keep, smoothstep(0.0, 0.2, uRecede));
    D *= mix(1.0, 1.0 - hole * 0.9, clamp(uRecede, 0.0, 1.0));
  }
  for (int i = 0; i < 16; i++) {
    vec4 a = uA[i];
    if (a.w <= 0.001) continue;
    vec4 b = uB[i];
    vec2 sp = vec2(a.x, 1.0 - a.y);
    vec2 dir = b.zw;
    float dl = length(dir);
    if (dl > 0.0001) dir /= dl;
    else dir = vec2(1.0, 0.0);
    float ink = blob(vUv - sp, a.z, uSeed + float(i) * 1.7, b.x, dir);
    float add = ink * a.w * uDensity;
    if (uOverlay == 9) add *= subject(fx);
    D = max(D, add);
    W = max(W, ink * b.x);
    pigment = mix(pigment, b.y, clamp(add * 1.4, 0.0, 1.0));
  }
  // 转场盖满时仍留不规则纸孔，避免整幅死黑。
  if (uOverlay == 0 && uDiffuse > 0.85) {
    float veins = fbm(fx * vec2(3.4, 6.8));
    float fine = fbm(fx * vec2(10.0, 16.0));
    float soak = smoothstep(0.16, 0.78, veins * 0.68 + fine * 0.32);
    D *= mix(0.06, 1.0, soak);
    W *= mix(0.25, 1.0, soak);
  }
  float maxD = max(prev.a * 0.997, D);
  finalColor = vec4(clamp(D, 0.0, 1.0), clamp(W, 0.0, 1.0), clamp(pigment, 0.0, 1.0), clamp(maxD, 0.0, 1.0));
}
`;

export const FX_COMP = `
precision highp float;
in vec2 vUv;
out vec4 finalColor;
uniform sampler2D uState;
uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
uniform float uFlash;
uniform float uAge;
uniform float uShake;
uniform float uTint;
uniform float uTransparent;
uniform float uOriginX;
uniform float uOriginY;
uniform float uSeed;
uniform int uOverlay;
${NOISE}
vec3 paperColor(vec2 fx) {
  float fiber = fbm(fx * vec2(80.0, 14.0));
  float speckle = hash(fx * uResolution);
  vec3 fresh = vec3(0.937, 0.910, 0.855);
  vec3 old = vec3(0.851, 0.780, 0.635);
  vec3 paper = mix(fresh, old, clamp(uAge, 0.0, 1.0) * (0.35 + fiber * 0.65));
  paper *= 0.94 + speckle * 0.08 + fiber * 0.04;
  return paper;
}
vec3 inkTone(float d, float pigment) {
  vec3 black = mix(vec3(0.42, 0.40, 0.38), vec3(0.055, 0.051, 0.047), smoothstep(0.18, 0.78, d));
  vec3 zhu = mix(vec3(0.824, 0.282, 0.227), vec3(0.55, 0.12, 0.1), smoothstep(0.25, 0.85, d));
  vec3 qing = mix(vec3(0.62, 0.68, 0.72), vec3(0.184, 0.290, 0.369), smoothstep(0.2, 0.8, d));
  vec3 zhe = mix(vec3(0.75, 0.62, 0.45), vec3(0.604, 0.416, 0.243), smoothstep(0.2, 0.8, d));
  vec3 gold = mix(vec3(0.90, 0.80, 0.55), vec3(0.784, 0.647, 0.353), smoothstep(0.2, 0.75, d));
  float p = pigment;
  if (uTint >= 0.0) p = mix(p, uTint, 0.82);
  vec3 col = black;
  col = mix(col, zhu, smoothstep(0.08, 0.22, p) * (1.0 - smoothstep(0.30, 0.46, p)));
  col = mix(col, qing, smoothstep(0.36, 0.50, p) * (1.0 - smoothstep(0.58, 0.72, p)));
  col = mix(col, zhe, smoothstep(0.62, 0.76, p) * (1.0 - smoothstep(0.84, 0.94, p)));
  col = mix(col, gold, smoothstep(0.88, 0.98, p));
  return col;
}
float stroke(vec2 p, vec2 a, vec2 b, float w) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  float d = length(pa - ba * h);
  float taper = mix(1.0, 0.35, h);
  return smoothstep(w * taper, w * taper * 0.25, d);
}
float ridge(float x, float layer) {
  float n = fbm(vec2(x * (1.5 + layer * 0.35) + layer * 3.7 + uTime * (0.012 + layer * 0.004), 2.0 + layer));
  float n2 = fbm(vec2(x * (5.0 + layer), 9.0 + layer * 2.0));
  return 0.58 - layer * 0.11 + n * 0.07 + n2 * 0.025;
}
float figure(vec2 fx) {
  vec2 p = fx - vec2(uOriginX, uOriginY);
  float n = fbm(fx * 8.0 + uSeed);
  float head = length((p - vec2(0.01 * n, -0.28)) / vec2(0.07, 0.08));
  float torso = length((p - vec2(0.0, -0.02)) / vec2(0.09, 0.18));
  vec2 c = p - vec2((n - 0.5) * 0.03, 0.12);
  float cloak = max(abs(c.x) * 1.35 + c.y * 0.15, abs(c.y) * 0.8);
  cloak = cloak / 0.28;
  float shape = 1.0 - smoothstep(0.82, 1.15, min(head, min(torso, cloak)) + (n - 0.5) * 0.35);
  float grain = smoothstep(0.22, 0.62, fbm(fx * vec2(26.0, 48.0)));
  return shape * mix(0.35, 1.0, grain);
}
float easeOut(float t) {
  float u = 1.0 - clamp(t, 0.0, 1.0);
  return 1.0 - u * u * u;
}
void main() {
  vec2 shake = vec2(sin(uTime * 48.0), cos(uTime * 37.0)) * uShake * 0.004;
  vec2 uv = clamp(vUv + shake, vec2(0.0), vec2(1.0));
  vec2 fx = vec2(uv.x, 1.0 - uv.y);
  vec4 state = texture(uState, uv);
  float D = state.r;
  float W = state.g;
  float grain = fbm(fx * vec2(55.0, 14.0));
  float speckle = fbm(fx * vec2(140.0, 36.0));
  float shaped = D * mix(0.78, 1.18, grain) * mix(0.92, 1.06, speckle);
  float deposit = smoothstep(0.28, 0.8, fbm(fx * vec2(6.2, 15.0)));
  float coreKeep = smoothstep(0.22, 0.55, D);
  shaped *= mix(mix(0.45, 1.0, deposit), 1.0, coreKeep);
  float dry = smoothstep(0.55, 0.08, W);
  float stripe = sin(fx.y * 70.0 + fbm(fx * 12.0) * 4.0);
  shaped *= mix(1.0, smoothstep(-0.15, 0.4, stripe), dry * smoothstep(0.15, 0.4, D) * 0.55);
  float cover = shaped / (shaped + 0.09);
  float g = length(vec2(dFdx(shaped), dFdy(shaped))) * uResolution.y * 0.35;
  float tide = smoothstep(0.25, 1.6, g) * smoothstep(0.015, 0.08, shaped) * (1.0 - smoothstep(0.28, 0.62, shaped));
  vec3 tone = inkTone(clamp(shaped, 0.0, 1.0), state.b);
  vec3 paper = paperColor(fx);
  vec3 col = mix(paper, tone, clamp(cover, 0.0, 1.0));
  col = mix(col, tone * 0.62, tide * 0.85);
  float extra = 0.0;
  vec3 extraCol = vec3(0.08, 0.07, 0.06);
  if (uOverlay == 1) {
    float fogN = fbm(vec2(fx.x * 1.15 + uTime * 0.04, fx.y * 0.35));
    float fog2 = fbm(vec2(fx.x * 0.6 - uTime * 0.02, 3.2));
    float veil = fogN * 0.6 + fog2 * 0.4;
    col = mix(col, vec3(0.86, 0.84, 0.80), 0.28 + (1.0 - uProgress) * 0.45);
    extra = 0.22;
    for (int layer = 0; layer < 5; layer++) {
      float L = float(layer);
      float x = fx.x + uTime * (0.006 + L * 0.003);
      float ridge = 0.14 + L * 0.14;
      ridge += sin(x * (1.6 + L * 0.28) + L * 1.4) * (0.07 + L * 0.01);
      ridge += sin(x * (3.8 + L * 0.45) + L * 2.2) * 0.032;
      ridge += (fbm(vec2(x * (2.2 + L * 0.25), 1.6 + L)) - 0.5) * 0.07;
      float depth = fx.y - ridge;
      float crest = smoothstep(-0.008, 0.02, depth);
      float body = crest * exp(-max(depth, 0.0) * (2.6 + L * 0.25));
      float along = depth * 22.0 + fbm(vec2(x * 1.4, L)) * 2.0;
      float across = x * (8.0 + L * 0.6) + depth * 0.8;
      float hemp = fbm(vec2(across, along));
      float fiber = smoothstep(0.42, 0.8, hemp);
      float fiber2 = smoothstep(0.58, 0.88, fbm(vec2(across * 1.7 + 3.0, along * 0.55 + L)));
      float washFloor = 0.5 + fiber * 0.65 + fiber2 * 0.4;
      float appear = smoothstep(L * 0.05, 0.16 + L * 0.08, uProgress);
      float foot = smoothstep(0.05, 0.22, depth);
      float fogEat = foot * mix(0.35, 0.9, veil) * (0.45 + (1.0 - uProgress) * 0.55);
      float wash = body * appear * washFloor * (1.0 - fogEat);
      float ridgeInk = smoothstep(0.0, 0.03, depth) * (1.0 - smoothstep(0.04, 0.14, depth));
      wash = clamp(wash + ridgeInk * appear * 0.85, 0.0, 1.0);
      vec3 farC = vec3(0.42, 0.50, 0.56);
      vec3 nearC = vec3(0.035, 0.03, 0.028);
      vec3 mcol = mix(farC, nearC, clamp(L / 4.0, 0.0, 1.0));
      mcol = mix(mcol, mcol * 0.45, clamp(fiber * 0.8 + ridgeInk, 0.0, 1.0));
      col = mix(col, mcol, clamp(wash, 0.0, 0.94));
      extra = max(extra, wash);
    }
  } else if (uOverlay == 2) {
    float river = 0.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float base = 0.36 + fi * 0.14;
      float wave = sin(fx.x * (2.0 + fi * 0.35) + uTime * (0.32 + fi * 0.08)) * 0.035;
      wave += (fbm(vec2(fx.x * 1.5 + uTime * 0.05, fi * 1.7)) - 0.5) * 0.06;
      float dist = fx.y - base - wave;
      float band = exp(-dist * dist / (0.0015 + fi * 0.0004));
      float brk = 0.62 + 0.38 * fbm(vec2(fx.x * 2.2 + uTime * 0.04, fi));
      river = max(river, band * brk);
    }
    float curlx = fract(uTime * 0.1);
    vec2 q = fx - vec2(0.12 + curlx * 0.7, 0.58);
    float crest = stroke(q, vec2(-0.28, 0.1), vec2(0.02, -0.08), 0.07);
    crest += stroke(q, vec2(0.02, -0.08), vec2(0.3, 0.05), 0.04);
    float ink = clamp(river * 0.9 + crest * 0.85, 0.0, 1.0);
    extra = ink;
    extraCol = vec3(0.1, 0.2, 0.3);
    col = mix(col, extraCol, ink * 0.88);
  } else if (uOverlay == 3) {
    float press = smoothstep(0.0, 0.22, uProgress);
    float slam = 1.0;
    if (uProgress > 0.22 && uProgress < 0.34) slam = 0.96;
    else if (uProgress >= 0.34) slam = 1.0;
    float approach = mix(1.38, 1.0, smoothstep(0.0, 0.24, uProgress)) * slam;
    vec2 p = (fx - vec2(uOriginX, uOriginY)) * approach * 0.68;
    p += (vec2(fbm(p * 8.0 + 2.0), fbm(p * 8.0 + 6.0)) - 0.5) * 0.012;
    float box = max(abs(p.x) * (1.0 + fbm(vec2(p.y * 18.0, 3.0)) * 0.08), abs(p.y));
    float border = smoothstep(0.205, 0.175, box) * smoothstep(0.13, 0.155, box);
    float gap = smoothstep(0.55, 0.82, fbm(vec2(atan(p.y, p.x) * 1.4, 5.0)));
    border *= mix(0.2, 1.0, 1.0 - gap);
    float s1 = stroke(p, vec2(-0.09, 0.07), vec2(0.01, -0.01), 0.02);
    float s2 = stroke(p, vec2(-0.02, -0.09), vec2(0.08, 0.02), 0.016);
    float s3 = stroke(p, vec2(0.07, 0.08), vec2(-0.05, 0.0), 0.013);
    float s4 = stroke(p, vec2(-0.06, 0.0), vec2(0.02, 0.06), 0.01);
    float grain = mix(0.45, 1.0, smoothstep(0.2, 0.7, fbm(p * 22.0 + uSeed)));
    float chip = smoothstep(0.72, 0.9, fbm(p * 7.0));
    float ink = (border + s1 + s2 + s3 + s4) * grain * (1.0 - chip * 0.85) * press;
    float bleed = smoothstep(0.23, 0.15, box) * smoothstep(0.1, 0.14, box) * smoothstep(0.35, 0.8, uProgress) * 0.4;
    extra = ink + bleed;
    extraCol = mix(vec3(0.824, 0.282, 0.227), vec3(0.718, 0.196, 0.173), smoothstep(0.3, 0.7, uProgress));
    col = mix(col, extraCol, clamp(extra, 0.0, 1.0));
  } else if (uOverlay == 4) {
    float open = easeOut(uProgress) * 0.46;
    float ax = abs(fx.x - 0.5);
    float paperM = smoothstep(open, open - 0.004, ax);
    float roller = smoothstep(0.018, 0.0, abs(ax - open)) * step(ax, open + 0.02);
    vec3 sheet = paperColor(fx) * vec3(1.02, 1.0, 0.96);
    float lag = smoothstep(0.15, 0.85, uProgress);
    float mini = 0.0;
    float pk = 0.28 + sin(fx.x * 2.4) * 0.06 + fbm(vec2(fx.x * 2.2, 2.0)) * 0.08;
    mini = smoothstep(pk, pk + 0.03, fx.y) * exp(-(fx.y - pk) * 1.8) * lag * paperM;
    float hemp = fbm(vec2(fx.x * 7.0, (fx.y - pk) * 24.0));
    mini *= 0.55 + smoothstep(0.4, 0.8, hemp) * 0.7;
    float pk2 = 0.48 + sin(fx.x * 3.1 + 1.2) * 0.04;
    float far = smoothstep(pk2, pk2 + 0.025, fx.y) * exp(-(fx.y - pk2) * 2.4) * lag * paperM * 0.45;
    col = mix(col, sheet, paperM * 0.92);
    col = mix(col, vec3(0.28, 0.36, 0.42), far);
    col = mix(col, vec3(0.08, 0.07, 0.06), clamp(mini, 0.0, 0.92));
    col = mix(col, vec3(0.45, 0.32, 0.18), roller);
    extra = max(paperM, roller);
  } else if (uOverlay == 5 || uOverlay == 6) {
    vec2 p = fx - vec2(uOriginX, uOriginY);
    float dist = length(p);
    float rings = 0.0;
    for (int i = 0; i < 4; i++) {
      float delay = float(i) * 0.12;
      float local = clamp((uProgress - delay) / 0.7, 0.0, 1.0);
      if (local <= 0.0) continue;
      float rad = local * (uOverlay == 6 ? 0.82 : 0.58);
      float w = uOverlay == 6 ? 0.08 + local * 0.05 : 0.04 + float(i) * 0.012;
      float bandQ = abs(dist - rad) / max(w, 0.001);
      float band = exp(-bandQ * bandQ);
      float brk = fbm(vec2(atan(p.y, p.x) * 2.2 + float(i), rad * 8.0));
      band *= mix(0.4, 1.0, smoothstep(0.25, 0.7, brk));
      float fade = 1.0 - smoothstep(0.62, 1.0, local);
      rings = max(rings, band * fade * (uOverlay == 6 ? 0.95 : 0.7 - float(i) * 0.08));
    }
    extra = rings;
    extraCol = uOverlay == 6 ? vec3(0.07, 0.06, 0.05) : vec3(0.25, 0.32, 0.38);
    col = mix(col, extraCol, clamp(extra, 0.0, 1.0));
  } else if (uOverlay == 7) {
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float spd = 0.05 + hash(vec2(fi, 2.0)) * 0.07;
      float x = fract(uSeed * 0.17 + fi * 0.15 + uTime * spd);
      float y = 0.1 + hash(vec2(fi, 4.0)) * 0.7 + sin(uTime * 0.6 + fi * 1.3) * 0.02;
      float depth = hash(vec2(fi, 8.0));
      float sz = mix(0.16, 0.34, depth);
      vec2 q = (fx - vec2(x, y)) / sz;
      float tilt = (hash(vec2(fi, 9.0)) - 0.5) * 0.8;
      float flap = sin(uTime * (5.0 + depth * 4.0) + fi * 1.7);
      vec2 wingL = vec2(-0.55, tilt + flap * 0.28);
      vec2 wingR = vec2(0.42, -tilt * 0.4 + flap * 0.18);
      float dry = smoothstep(0.35, 0.75, fbm(q * 6.0 + fi));
      float wing = stroke(q, wingL, vec2(-0.05, 0.02), 0.32) * mix(0.7, 1.0, dry);
      if (hash(vec2(fi, 1.0)) > 0.25) {
        wing = max(wing, stroke(q, wingR, vec2(0.05, -0.02), 0.18) * mix(0.55, 1.0, dry));
      }
      float body = exp(-dot(q - vec2(0.0, 0.02), q - vec2(0.0, 0.02)) / 0.08);
      body *= mix(0.7, 1.0, fbm(q * 9.0));
      float halo = exp(-dot(q, q) / 0.45) * 0.28;
      float bird = max(max(wing, body), halo) * mix(0.62, 1.0, depth);
      col = mix(col, vec3(0.07, 0.06, 0.05), clamp(bird, 0.0, 0.92));
      extra = max(extra, bird);
    }
  } else if (uOverlay == 8) {
    float stain = smoothstep(0.62, 0.78, fbm(fx * 3.4 + 4.0));
    stain *= uAge;
    float ring = smoothstep(0.04, 0.0, abs(length(fx - vec2(0.3, 0.4)) - 0.12 * uAge));
    col = mix(col, vec3(0.55, 0.42, 0.24), stain * 0.45 + ring * uAge * 0.35);
    float crack = step(0.78, fbm(vec2(fx.x * 30.0, fx.y * 4.0)));
    col = mix(col, paper, crack * uAge * 0.35);
    extra = uAge;
  } else if (uOverlay == 9) {
    vec2 p = fx - vec2(0.58, 0.62);
    float trunk = smoothstep(0.045, 0.012, abs(p.x)) * step(-0.05, p.y) * step(p.y, 0.32);
    float crown = smoothstep(0.2, 0.06, length((p - vec2(0.0, -0.12)) * vec2(1.0, 1.25)));
    float ridgeM = fbm(vec2(fx.x * 1.6, 2.2));
    float mount = smoothstep(0.55 + ridgeM * 0.08, 0.32, fx.y) * exp(-(fx.y - 0.42) * 1.8);
    mount *= mix(0.55, 1.0, smoothstep(0.4, 0.75, fbm(vec2(fx.x * 8.0, fx.y * 30.0))));
    float image = clamp(max(mount * 0.7, max(trunk, crown)), 0.0, 1.0);
    float show = smoothstep(0.12, 0.28, D);
    float colorLag = smoothstep(0.45, 0.8, D);
    vec3 gray = vec3(0.25, 0.24, 0.22);
    vec3 paint = mix(vec3(0.2, 0.28, 0.32), vec3(0.35, 0.28, 0.16), mount);
    paint = mix(paint, vec3(0.1, 0.16, 0.1), crown);
    vec3 shown = mix(gray, paint, colorLag);
    col = mix(col, shown, image * show);
    extra = image * show;
  } else if (uOverlay == 10 || uOverlay == 13) {
    float fig = figure(fx);
    float n = fbm(fx * 7.0 + uOriginX);
    float dir = fx.x + fx.y * 0.3;
    float eat = n * 0.55 + dir * 0.35;
    float keep = uOverlay == 13
      ? smoothstep(uProgress - 0.08, uProgress + 0.05, 1.0 - eat)
      : 1.0 - smoothstep(uProgress * 1.15 - 0.15, uProgress * 1.15 + 0.05, eat);
    float edge = smoothstep(0.15, 0.55, fig) * keep;
    col = mix(col, vec3(0.07, 0.06, 0.05), clamp(edge, 0.0, 1.0));
    extra = edge;
  } else if (uOverlay == 11) {
    float mist = fbm(vec2(fx.x * 1.4 + uTime * 0.03, fx.y * 1.6));
    col = mix(col, vec3(0.72, 0.74, 0.76), mist * 0.45);
    extra = mist * 0.35;
    for (int i = 0; i < 22; i++) {
      float fi = float(i);
      float depth = hash(vec2(fi, 3.0));
      float x = fract(hash(vec2(fi, 1.2)) + uTime * (0.1 + depth * 0.16));
      float y = fract(hash(vec2(fi, 6.0)) + uTime * (0.28 + depth * 0.4));
      vec2 q = fx - vec2(x, y);
      q.x += q.y * 0.22;
      float len = 0.14 + depth * 0.16;
      float thick = 0.01 + depth * 0.008;
      float line = exp(-abs(q.x) / thick) * step(0.0, q.y) * step(q.y, len);
      line *= 0.45 + depth * 0.55;
      col = mix(col, vec3(0.16, 0.18, 0.2), clamp(line, 0.0, 0.85));
      extra = max(extra, line);
    }
  }
  if (uFlash > 0.001) col = mix(col, vec3(0.97, 0.95, 0.9), clamp(uFlash, 0.0, 1.0));
  if (uTransparent > 0.5) {
    float a = clamp(cover + extra * 0.85, 0.0, 1.0);
    if (uOverlay == 1 || uOverlay == 4 || uOverlay == 7 || uOverlay == 11) a = clamp(extra, 0.0, 1.0);
    finalColor = vec4(col * a, a);
  } else {
    finalColor = vec4(col, 1.0);
  }
}
`;
