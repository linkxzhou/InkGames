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
  float wob = sin(ang * 3.0 + seed) * 0.22 + sin(ang * 7.0 - seed * 2.0) * 0.1;
  float rr = length(p) / max(r * (1.0 + wob), 0.0006);
  float core = exp(-rr * rr * 2.6);
  float halo = exp(-rr * rr * 0.72) * 0.42;
  float ink = core + halo;
  float across = p.x * dir.y - p.y * dir.x;
  float stripe = sin(across / max(r, 0.0016) * 16.0 + seed);
  float fw = smoothstep(-0.15, 0.45, stripe);
  float dry = smoothstep(0.42, 0.06, water);
  ink *= mix(1.0, fw, dry * 0.92);
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
  vec2 p = fx - vec2(0.62, 0.58);
  float trunk = 1.0 - smoothstep(0.012, 0.02, abs(p.x) + max(p.y - 0.02, 0.0) * 0.15);
  float crown = 1.0 - smoothstep(0.07, 0.1, length((p - vec2(0.0, -0.08)) * vec2(1.0, 1.35)));
  float ridge = fbm(vec2(fx.x * 2.2, 3.0));
  float mount = smoothstep(0.42 + ridge * 0.08, 0.4 + ridge * 0.08, fx.y);
  mount *= exp(-(fx.y - 0.36) * 3.2);
  return clamp(max(mount, max(trunk, crown)), 0.0, 1.0);
}
void main() {
  if (uClear > 0.5) {
    finalColor = vec4(0.0);
    return;
  }
  vec2 fx = vec2(vUv.x, 1.0 - vUv.y);
  vec2 vel = curl(fx * 2.4 + vec2(uTime * 0.07, uSeed)) * uFlow * 0.22;
  for (int i = 0; i < 16; i++) {
    vec4 a = uA[i];
    if (a.w <= 0.001) continue;
    vec2 sp = vec2(a.x, 1.0 - a.y);
    vec2 d = vUv - sp;
    float inf = exp(-dot(d, d) / max(a.z * a.z * 6.0, 0.00002));
    vel += uB[i].zw * inf * 0.35;
  }
  vec2 back = clamp(vUv - vel * uDt, vec2(0.001), vec2(0.999));
  vec4 prev = texture(uState, back);
  vec2 texel = 1.0 / uResolution;
  float fiber = fbm(fx * vec2(46.0, 9.0));
  vec4 e = texture(uState, clamp(vUv + vec2(texel.x * (1.35 + fiber), 0.0), vec2(0.0), vec2(1.0)));
  vec4 w = texture(uState, clamp(vUv - vec2(texel.x * (1.35 + fiber), 0.0), vec2(0.0), vec2(1.0)));
  vec4 n = texture(uState, clamp(vUv + vec2(0.0, texel.y * (0.55 + fiber * 0.3)), vec2(0.0), vec2(1.0)));
  vec4 s = texture(uState, clamp(vUv - vec2(0.0, texel.y * (0.55 + fiber * 0.3)), vec2(0.0), vec2(1.0)));
  float blur = (e.r + w.r + n.r + s.r) * 0.25;
  float wet = prev.g;
  float diff = uDiffuse * wet;
  if (uOverlay == 9) diff *= mix(0.08, 1.0, subject(fx));
  float D = mix(prev.r, blur, clamp(diff, 0.0, 0.85));
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
    D = max(D, add);
    W = max(W, ink * b.x);
    pigment = mix(pigment, b.y, clamp(add * 1.4, 0.0, 1.0));
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
  vec2 p = fx - vec2(uOriginX, uOriginY + 0.02);
  float n = fbm(fx * 11.0 + uSeed);
  float head = length((p - vec2(0.01 * n, -0.2)) / vec2(0.04, 0.05));
  float torso = length((p - vec2(0.0, -0.02)) / vec2(0.05, 0.11));
  vec2 c = p - vec2((n - 0.5) * 0.02, 0.08);
  float cloak = max(abs(c.x) * 1.7 + c.y * 0.2, abs(c.y) * 0.85);
  cloak = cloak / 0.18;
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
  float n = (fbm(fx * 26.0) - 0.5) * 0.16 + (fbm(fx * 64.0) - 0.5) * 0.05;
  float shaped = D + n * smoothstep(0.04, 0.35, D);
  float grain = fbm(fx * vec2(96.0, 20.0));
  shaped *= mix(0.78, 1.12, grain);
  float dry = smoothstep(0.5, 0.08, W);
  float stripe = sin(fx.y * 90.0 + fbm(fx * 18.0) * 5.0);
  shaped *= mix(1.0, smoothstep(-0.2, 0.35, stripe), dry * smoothstep(0.25, 0.55, D) * 0.75);
  float body = smoothstep(0.1, 0.34, shaped);
  float core = smoothstep(0.48, 0.82, shaped);
  float g = length(vec2(dFdx(D), dFdy(D))) * uResolution.y;
  float tide = smoothstep(0.15, 0.7, g) * smoothstep(0.08, 0.22, D) * (1.0 - smoothstep(0.45, 0.7, D));
  vec3 tone = inkTone(clamp(shaped + core * 0.25, 0.0, 1.0), state.b);
  vec3 paper = paperColor(fx);
  float cover = clamp(body + tide * 0.55, 0.0, 1.0);
  vec3 col = mix(paper, tone, cover);
  col = mix(col, tone * 0.72, tide * 0.65);
  float extra = 0.0;
  vec3 extraCol = vec3(0.08, 0.07, 0.06);
  if (uOverlay == 1) {
    float fogN = fbm(vec2(fx.x * 1.6 + uTime * 0.03, fx.y * 0.8));
    for (int layer = 0; layer < 4; layer++) {
      float L = float(layer);
      float peak = ridge(fx.x, L);
      float below = smoothstep(peak - 0.004, peak + 0.03, fx.y);
      float fade = exp(-(fx.y - peak) * (5.4 - L * 0.35));
      float appear = smoothstep(0.08 + (3.0 - L) * 0.12, 0.55 + (3.0 - L) * 0.06, uProgress);
      float cun = fbm(vec2(fx.x * (18.0 + L * 6.0), fx.y * 80.0 + L));
      float hemp = smoothstep(0.46, 0.74, cun);
      float crest = smoothstep(0.012, 0.0, abs(fx.y - peak)) * smoothstep(0.35, 0.7, fbm(vec2(fx.x * 40.0, L)));
      float ink = below * fade * appear * mix(0.02, 0.85, hemp);
      ink = max(ink, crest * appear * 0.9);
      float band = smoothstep(0.72, 0.28, fogN + (1.0 - uProgress) * 0.85 + max(fx.y - peak, 0.0) * 1.4);
      ink *= band;
      vec3 mcol = mix(vec3(0.28, 0.36, 0.42), vec3(0.08, 0.07, 0.06), clamp(1.0 - L / 3.0, 0.0, 1.0));
      col = mix(col, mcol, clamp(ink, 0.0, 0.82));
      extra = max(extra, ink * 0.85);
    }
    float mist = smoothstep(0.25, 0.8, fogN) * (0.55 - uProgress * 0.25);
    col = mix(col, paper, clamp(mist, 0.0, 0.65));
  } else if (uOverlay == 2) {
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float base = 0.58 + fi * 0.055;
      float wave = sin(fx.x * (7.0 + fi) + uTime * (0.6 + fi * 0.15) + fi) * (0.012 + fi * 0.002);
      wave += (fbm(vec2(fx.x * 4.0 + uTime * 0.1, fi)) - 0.5) * 0.02;
      float width = (0.003 + fi * 0.0012) * (0.45 + fbm(vec2(fx.x * 9.0, fi)) * 0.9);
      float line = smoothstep(width, 0.0, abs(fx.y - base - wave));
      float brk = smoothstep(0.28, 0.62, fbm(vec2(fx.x * 14.0, fi * 3.0)));
      float crest = 0.0;
      if (i == 2) {
        float curlx = fract(uTime * 0.18);
        vec2 q = fx - vec2(0.25 + curlx * 0.5, base - 0.02);
        crest = stroke(q, vec2(-0.06, 0.03), vec2(0.02, -0.02), 0.01);
        crest += stroke(q, vec2(0.02, -0.02), vec2(0.07, 0.01), 0.006);
      }
      extra = max(extra, max(line * brk, crest) * (0.35 + (1.0 - fi / 6.0) * 0.5));
    }
    extraCol = vec3(0.18, 0.28, 0.36);
    col = mix(col, extraCol, clamp(extra, 0.0, 0.85));
  } else if (uOverlay == 3) {
    float press = smoothstep(0.0, 0.22, uProgress);
    float slam = 1.0;
    if (uProgress > 0.22 && uProgress < 0.34) slam = 0.96;
    else if (uProgress >= 0.34) slam = 1.0;
    float approach = mix(1.38, 1.0, smoothstep(0.0, 0.24, uProgress)) * slam;
    vec2 p = (fx - vec2(uOriginX, uOriginY)) * approach;
    p += (vec2(fbm(p * 8.0 + 2.0), fbm(p * 8.0 + 6.0)) - 0.5) * 0.012;
    float box = max(abs(p.x) * (1.0 + fbm(vec2(p.y * 18.0, 3.0)) * 0.08), abs(p.y));
    float border = smoothstep(0.205, 0.175, box) * smoothstep(0.13, 0.155, box);
    float gap = smoothstep(0.55, 0.82, fbm(vec2(atan(p.y, p.x) * 1.4, 5.0)));
    border *= mix(0.2, 1.0, 1.0 - gap);
    float s1 = stroke(p, vec2(-0.09, 0.07), vec2(0.01, -0.01), 0.02);
    float s2 = stroke(p, vec2(-0.02, -0.09), vec2(0.08, 0.02), 0.016);
    float s3 = stroke(p, vec2(0.07, 0.08), vec2(-0.05, 0.0), 0.013);
    float s4 = stroke(p, vec2(-0.06, 0.0), vec2(0.02, 0.06), 0.01);
    float grain = smoothstep(0.18, 0.58, fbm(p * 36.0 + uSeed));
    float chip = smoothstep(0.72, 0.9, fbm(p * 7.0));
    float ink = (border + s1 + s2 + s3 + s4) * grain * (1.0 - chip * 0.85) * press;
    float bleed = smoothstep(0.23, 0.15, box) * smoothstep(0.1, 0.14, box) * smoothstep(0.35, 0.8, uProgress) * 0.4;
    extra = ink + bleed;
    extraCol = mix(vec3(0.824, 0.282, 0.227), vec3(0.718, 0.196, 0.173), smoothstep(0.3, 0.7, uProgress));
    col = mix(col, extraCol, clamp(extra, 0.0, 1.0));
  } else if (uOverlay == 4) {
    float open = easeOut(uProgress) * 0.42;
    float ax = abs(fx.x - 0.5);
    float paperM = smoothstep(open, open - 0.004, ax);
    float roller = smoothstep(0.018, 0.0, abs(ax - open)) * step(ax, open + 0.02);
    vec3 sheet = paperColor(fx) * vec3(1.02, 1.0, 0.96);
    float lag = smoothstep(0.15, 0.85, uProgress);
    float mini = 0.0;
    float pk = 0.42 + fbm(vec2(fx.x * 3.0, 2.0)) * 0.05;
    mini = smoothstep(pk, pk + 0.01, fx.y) * exp(-(fx.y - pk) * 8.0) * lag * paperM;
    col = mix(col, sheet, paperM * 0.92);
    col = mix(col, vec3(0.12, 0.1, 0.08), mini);
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
      float rad = local * local * (uOverlay == 6 ? 0.62 : 0.34);
      float w = uOverlay == 6 ? 0.02 + local * 0.02 : 0.006 + float(i) * 0.001;
      float band = smoothstep(w, 0.0, abs(dist - rad));
      float brk = fbm(vec2(atan(p.y, p.x) * 3.0 + float(i), rad * 12.0));
      band *= smoothstep(0.22, 0.55, brk);
      float fade = 1.0 - smoothstep(0.55, 1.0, local);
      rings = max(rings, band * fade * (uOverlay == 6 ? 1.0 : 0.55 - float(i) * 0.08));
    }
    extra = rings;
    extraCol = uOverlay == 6 ? vec3(0.07, 0.06, 0.05) : vec3(0.25, 0.32, 0.38);
    col = mix(col, extraCol, clamp(extra, 0.0, 1.0));
  } else if (uOverlay == 7) {
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float spd = 0.05 + hash(vec2(fi, 2.0)) * 0.07;
      float x = fract(uSeed * 0.17 + fi * 0.15 + uTime * spd);
      float y = 0.16 + hash(vec2(fi, 4.0)) * 0.5 + sin(uTime * 0.6 + fi * 1.3) * 0.015;
      float depth = hash(vec2(fi, 8.0));
      float sz = mix(0.05, 0.11, depth);
      vec2 q = (fx - vec2(x, y)) / sz;
      float tilt = (hash(vec2(fi, 9.0)) - 0.5) * 0.8;
      float flap = sin(uTime * (5.0 + depth * 4.0) + fi * 1.7);
      vec2 wingL = vec2(-0.55, tilt + flap * 0.28);
      vec2 wingR = vec2(0.42, -tilt * 0.4 + flap * 0.18);
      float dry = smoothstep(0.35, 0.75, fbm(q * 6.0 + fi));
      float wing = stroke(q, wingL, vec2(-0.05, 0.02), 0.11) * mix(0.25, 1.0, dry);
      if (hash(vec2(fi, 1.0)) > 0.25) {
        wing = max(wing, stroke(q, wingR, vec2(0.05, -0.02), 0.08) * mix(0.2, 0.9, dry));
      }
      float body = exp(-dot(q - vec2(0.0, 0.02), q - vec2(0.0, 0.02)) / 0.03);
      body *= mix(0.55, 1.0, fbm(q * 9.0));
      float bird = max(wing, body * 0.85) * mix(0.28, 1.0, depth);
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
    vec2 p = fx - vec2(0.62, 0.58);
    float trunk = smoothstep(0.02, 0.008, abs(p.x)) * step(0.0, p.y + 0.02) * step(p.y, 0.22);
    float crown = smoothstep(0.1, 0.04, length((p - vec2(0.0, -0.06)) * vec2(1.0, 1.3)));
    float ridgeM = fbm(vec2(fx.x * 2.2, 3.0));
    float mount = smoothstep(0.46 + ridgeM * 0.06, 0.4, fx.y) * exp(-(fx.y - 0.38) * 3.0);
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
    float mist = fbm(vec2(fx.x * 1.6 + uTime * 0.03, fx.y * 2.0)) * 0.22;
    col = mix(col, vec3(0.78, 0.77, 0.74), mist * (0.35 + fx.y * 0.2));
    for (int i = 0; i < 18; i++) {
      float fi = float(i);
      float depth = hash(vec2(fi, 3.0));
      float x = fract(hash(vec2(fi, 1.2)) + uTime * (0.12 + depth * 0.2));
      float y = fract(hash(vec2(fi, 6.0)) + uTime * (0.35 + depth * 0.45));
      vec2 q = fx - vec2(x, y);
      q.x += q.y * 0.18;
      float len = 0.03 + depth * 0.04;
      float line = smoothstep(0.002 + depth * 0.001, 0.0, abs(q.x)) * step(0.0, q.y) * step(q.y, len);
      col = mix(col, vec3(0.22, 0.24, 0.26), line * (0.18 + depth * 0.35));
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
