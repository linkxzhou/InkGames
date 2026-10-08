import { withGLState } from './gl-state';
import type { Point, Stroke, InkVisual } from './tokens';

const vertex = `#version 300 es
layout(location=0) in vec2 a; out vec2 uv;
void main(){uv=a*0.5+0.5;gl_Position=vec4(a,0.,1.);}`;
const splatVertex = `#version 300 es
layout(location=0) in vec2 a;
layout(location=1) in vec4 stamp;
out vec2 local;
out float strength;
uniform vec2 uSize;
uniform float uScale;
void main(){
  local=a;
  strength=stamp.w;
  vec2 center=vec2(stamp.x,uSize.y-stamp.y);
  vec2 pixel=center+a*stamp.z*uScale*3.;
  gl_Position=vec4(pixel/uSize*2.-1.,0.,1.);
}`;
const splatFragment = `#version 300 es
precision highp float;
in vec2 local;
in float strength;
out vec4 o;
uniform float uValueScale;
uniform float uFiber;
void main(){
  // 三层剖面：窄芯（笔心浓墨）+ 宽裙（洇散光晕）+ 分叉旁瓣（毛笔边缘起伏）。
  // 早先是单瓣 exp(-r²·9)，幅度又高，叠加后直接饱和成「实心黑条 + 硬边」，
  // 既无中间调也没有水在纸上散开的光晕——那是「不像水墨」的主要来源。
  float r2=dot(local,local);
  float core=exp(-r2*4.5);
  float skirt=exp(-r2*0.55)*0.18;
  float lobes=exp(-dot(local-vec2(0.55,0.2),local-vec2(0.55,0.2))*7.)
             +exp(-dot(local+vec2(0.5,0.28),local+vec2(0.5,0.28))*7.);
  // 飞白沿笔尖局部坐标生成：条纹沿笔向拉长，随笔尖扫过形成断续白丝（而非屏幕噪点）。
  float bristle=fract(sin(floor(local.x*9.)*127.1+floor(local.y*3.)*311.7)*43758.5453);
  float dry=smoothstep(0.42,0.72,bristle);
  float ink=(core+skirt+lobes*0.22)*strength*uValueScale;
  o=vec4(ink*(1.-dry*uFiber),0.,0.,1.);
}`;
const shaders = {
  splat: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uTex;uniform vec2 uPoint,uSize;uniform float uRadius,uValue,uMode;
void main(){vec2 d=(uv-uPoint)*uSize;float grain=fract(sin(dot(floor(uv*uSize*0.5),vec2(91.7,161.3)))*16317.2);
float v=exp(-dot(d,d)/max(1.,uRadius*uRadius))*uValue*(1.-step(.72,grain)*.55);
float old=texture(uTex,uv).r;o=vec4(uMode>0.5?max(old,v):old+v,0.,0.,1.);}`,
  velocity: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uVelocity,uWet;uniform vec2 uTexel;uniform float uDt;
void main(){vec2 v=texture(uVelocity,uv).xy;vec2 next=texture(uVelocity,uv-v*uDt*uTexel).xy;
float wet=smoothstep(.005,.2,texture(uWet,uv).r);o=vec4(next*exp(-uDt)*wet,0.,1.);}`,
  divergence: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uVelocity;uniform vec2 uTexel;
void main(){vec2 x=vec2(uTexel.x,0.),y=vec2(0.,uTexel.y);
float d=(texture(uVelocity,uv+x).x-texture(uVelocity,uv-x).x+texture(uVelocity,uv+y).y-texture(uVelocity,uv-y).y)*.5;
o=vec4(d,0.,0.,1.);}`,
  pressure: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uPressure,uDivergence;uniform vec2 uTexel;
void main(){vec2 x=vec2(uTexel.x,0.),y=vec2(0.,uTexel.y);
float p=(texture(uPressure,uv+x).r+texture(uPressure,uv-x).r+texture(uPressure,uv+y).r+texture(uPressure,uv-y).r-texture(uDivergence,uv).r)*.25;
o=vec4(p,0.,0.,1.);}`,
  project: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uVelocity,uPressure;uniform vec2 uTexel;
void main(){vec2 x=vec2(uTexel.x,0.),y=vec2(0.,uTexel.y);
vec2 grad=vec2(texture(uPressure,uv+x).r-texture(uPressure,uv-x).r,texture(uPressure,uv+y).r-texture(uPressure,uv-y).r)*.5;
o=vec4(texture(uVelocity,uv).xy-grad,0.,1.);}`,
  wet: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uWet,uVelocity;uniform vec2 uTexel,uVelTexel;uniform float uDt,uDry,uAbsorbency;
void main(){vec2 v=texture(uVelocity,uv).xy;vec2 src=uv-v*uVelTexel*uDt*.6;
vec2 x=vec2(uTexel.x,0.),y=vec2(0.,uTexel.y);
float w=texture(uWet,src).r;float around=(texture(uWet,src+x).r+texture(uWet,src-x).r+texture(uWet,src+y).r+texture(uWet,src-y).r)*.25;
o=vec4(mix(w,around,clamp(uAbsorbency*.12,0.,.25))*exp(-uDry*uDt),0.,0.,1.);}`,
  settle: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uInk,uWet,uFixed;uniform float uDt,uMode;
void main(){float ink=texture(uInk,uv).r;
float dry=(1.-smoothstep(.01,.22,texture(uWet,uv).r))*(1.-exp(-uDt*.8));
float deposited=ink*dry;
o=vec4(uMode>.5?texture(uFixed,uv).r+deposited:ink-deposited,0.,0.,1.);}`,
  pigment: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uInk,uWet,uVelocity;uniform vec2 uTexel,uVelTexel;uniform float uDt,uAbsorbency,uFiber;
float hash(vec2 p){return fract(sin(dot(p,vec2(113.,217.)))*19471.6);}
void main(){float w=texture(uWet,uv).r;float mob=smoothstep(.02,.45,w);vec2 src=uv-texture(uVelocity,uv).xy*uVelTexel*uDt*mob;
vec2 x=vec2(uTexel.x,0.),y=vec2(0.,uTexel.y);
float grain=hash(floor(uv/uTexel*0.28));
float fiber=1.+(grain-.5)*uFiber*.4;
float n=(texture(uInk,src+x).r+texture(uInk,src-x).r+texture(uInk,src+y).r+texture(uInk,src-y).r)*.25;
float moved=mix(texture(uInk,src).r,n,clamp(.18*uAbsorbency*mob*fiber,0.,.5));
o=vec4(mix(texture(uInk,uv).r,moved,mob),0.,0.,1.);}`,
  display: `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D uInk,uWet,uFixed;uniform vec3 uPaper;uniform float uFiber,uTexelSize;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){float ink=texture(uInk,uv).r,wet=texture(uWet,uv).r,deposited=texture(uFixed,uv).r;
// 宣纸：多尺度纤维颗粒 + 缓慢起伏的纸面深浅，避免纯色底看上去像打印纸。
vec2 grainUv=uv*vec2(900.,650.);
float grain=noise(grainUv)*0.6+noise(grainUv*0.27)*0.4;
vec3 paper=uPaper*(0.945+grain*uFiber*0.12);
// 边缘沉积：湿墨下笔后水分向四周排出，将墨带到边界，形成比笔心更深的干边。
vec2 dx=vec2(uTexelSize,0.),dy=vec2(0.,uTexelSize);
float lap=texture(uInk,uv+dx).r+texture(uInk,uv-dx).r+texture(uInk,uv+dy).r+texture(uInk,uv-dy).r;
float rim=max(0.,lap*0.25-ink)*4.;
// 密度场与灰度场分开：光学密度叠加（Beer–Lambert）。增益取 0.9 使淡墨有明显灰阶，
// 浓墨仍能压到近黑——过大的增益会把所有笔画一律压成全黑，丢掉墨分五色。
float density=(ink+deposited)*(1.+wet*0.25)+rim*1.1;
// 纸纤维疏密让浓度轻微起伏，模拟吸墨不匀。
density*=0.93+grain*0.14;
o=vec4(paper*exp(-density*0.9),1.);}`,
} as const;

type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
interface Pair { read: Target; write: Target; swap(): void }

/** IEEE 754 半精度 → float（readPixels 以 HALF_FLOAT 读回时使用）。 */
function halfToFloat(bits: number): number {
  const sign = (bits & 0x8000) ? -1 : 1;
  const exponent = (bits >> 10) & 0x1f;
  const fraction = bits & 0x03ff;
  if (exponent === 0) return sign * fraction * 2 ** -24;
  if (exponent === 0x1f) return fraction ? NaN : sign * Infinity;
  return sign * (1 + fraction / 1024) * 2 ** (exponent - 15);
}

function compile(gl: WebGL2RenderingContext, kind: number, source: string): WebGLShader {
  const shader = gl.createShader(kind);
  if (!shader) throw new Error('Shader allocation failed');
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(message ?? 'Shader compilation failed');
  }
  return shader;
}
function link(gl: WebGL2RenderingContext, fragment: string, vertexSource = vertex): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, vertexSource), fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!program) throw new Error('Program allocation failed');
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program); gl.deleteProgram(program); throw new Error(message ?? 'Program link failed');
  }
  return program;
}

export class InkFluid implements InkVisual {
  private readonly gl: WebGL2RenderingContext;
  private readonly vao: WebGLVertexArrayObject;
  private readonly buffer: WebGLBuffer;
  private readonly splatBuffer: WebGLBuffer;
  private readonly splatVao: WebGLVertexArrayObject;
  private readonly programs: Record<keyof typeof shaders, WebGLProgram>;
  private readonly splatProgram: WebGLProgram;
  private readonly floatBlend: boolean;
  private readonly uniformLocations = new Map<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
  private velocity: Pair;
  private wet: Pair;
  private pigment: Pair;
  private fixedInk: Pair;
  private pressure: Pair;
  private divergence: Target;
  private width: number;
  private height: number;
  private readonly simWidth: number;
  private readonly simHeight: number;
  private tone: [number, number, number] = [0.96, 0.95, 0.92];
  private absorbency = 1;
  private fiber = 0.4;
  private readonly strokes = new Map<number, Stroke>();
  private readonly boundsByStroke = new Map<number, { x: number; y: number; radius: number }>();
  private active = false;
  private readonly maxPixels = 2048 * 2048;
  constructor(gl: WebGL2RenderingContext, private readonly canvas: HTMLCanvasElement, size = 128) {
    this.gl = gl;
    this.width = canvas.width; this.height = canvas.height;
    if (this.width <= 0 || this.height <= 0 || this.width * this.height > this.maxPixels) throw new Error('Ink canvas exceeds 2048² pixel budget');
    if (!gl.getExtension('EXT_color_buffer_float')) throw new Error('EXT_color_buffer_float required');
    this.floatBlend = !!gl.getExtension('EXT_float_blend');
    const vao = gl.createVertexArray(), buffer = gl.createBuffer();
    const splatVao = gl.createVertexArray(), splatBuffer = gl.createBuffer();
    if (!vao || !buffer || !splatVao || !splatBuffer) throw new Error('Fullscreen triangle allocation failed');
    this.vao = vao; this.buffer = buffer; this.splatVao = splatVao; this.splatBuffer = splatBuffer;
    this.programs = Object.fromEntries(Object.entries(shaders).map(([name, source]) => [name, link(gl, source)])) as Record<keyof typeof shaders, WebGLProgram>;
    this.splatProgram = link(gl, splatFragment, splatVertex);
    gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(splatVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, splatBuffer);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 16, 0);
    gl.vertexAttribDivisor(1, 1);
    const scale = Math.min(1, size / Math.max(1, Math.min(this.width, this.height)));
    this.simWidth = Math.max(2, Math.round(this.width * scale));
    this.simHeight = Math.max(2, Math.round(this.height * scale));
    this.velocity = this.pair(gl.RG16F, gl.RG, this.simWidth, this.simHeight);
    this.pressure = this.pair(gl.R16F, gl.RED, this.simWidth, this.simHeight);
    this.divergence = this.target(gl.R16F, gl.RED, this.simWidth, this.simHeight);
    this.wet = this.pair(gl.R16F, gl.RED, this.width, this.height);
    this.pigment = this.pair(gl.R16F, gl.RED, this.width, this.height);
    this.fixedInk = this.pair(gl.R16F, gl.RED, this.width, this.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  private target(internal: number, format: number, w: number, h: number): Target {
    const gl = this.gl, tex = gl.createTexture(), fbo = gl.createFramebuffer();
    if (!tex || !fbo) throw new Error('Fluid target allocation failed');
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Fluid framebuffer incomplete');
    gl.viewport(0,0,w,h); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h };
  }
  private pair(internal: number, format: number, w: number, h: number): Pair {
    const a = this.target(internal,format,w,h), b = this.target(internal,format,w,h);
    return { read:a,write:b,swap() { [this.read,this.write]=[this.write,this.read]; } };
  }
  private uniform(program: WebGLProgram, name: string): WebGLUniformLocation | null {
    let locations = this.uniformLocations.get(program);
    if (!locations) { locations = new Map(); this.uniformLocations.set(program, locations); }
    if (!locations.has(name)) locations.set(name, this.gl.getUniformLocation(program, name));
    return locations.get(name) ?? null;
  }
  private pass(name: keyof typeof shaders, output: Target | null, textures: Record<string, Target>, values: Record<string, number | number[]> = {}): void {
    const gl = this.gl, program = this.programs[name];
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.SCISSOR_TEST); gl.disable(gl.STENCIL_TEST);
    gl.colorMask(true,true,true,true);
    gl.bindVertexArray(this.vao); gl.useProgram(program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, output?.fbo ?? null);
    gl.viewport(0,0,output?.w ?? this.canvas.width,output?.h ?? this.canvas.height);
    let unit = 0;
    for (const [uniform,target] of Object.entries(textures)) {
      gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,target.tex);
      gl.uniform1i(this.uniform(program,uniform),unit++);
    }
    for (const [uniform,value] of Object.entries(values)) {
      const location = this.uniform(program,uniform);
      if (typeof value === 'number') gl.uniform1f(location,value);
      else if (value.length === 2) gl.uniform2fv(location,value);
      else if (value.length === 3) gl.uniform3fv(location,value);
    }
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  private stamp(field: Pair, point: Point, radius: number, value: number, max = false): void {
    const target = field.write;
    this.pass('splat',target,{uTex:field.read},{uPoint:[point.x/this.width,1-point.y/this.height],uSize:[this.width,this.height],uRadius:radius,uValue:value,uMode:max?1:0});
    field.swap();
  }
  draw(stroke: Stroke): void {
    this.strokes.set(stroke.id, stroke);
    this.active = true;
    withGLState(this.gl, () => {
      this.paint(stroke);
      // 必须记录包围盒：redrawStrokes 依赖它来清除该笔的旧区域。
      // 漏记会让局部重绘变成“只重绘不清理”，墨量按笔画数翻倍（plan/09 §10 对账实测 ≈ 99%）。
      const bounds = this.boundsOf(stroke);
      if (bounds) this.boundsByStroke.set(stroke.id, bounds);
    });
  }
  private paint(stroke: Stroke): void {
    const stamps: number[] = [];
    for (const fragment of stroke.fragments) for (let i=1;i<fragment.length;i++) {
      const a=fragment[i-1],b=fragment[i],distance=Math.hypot(b.x-a.x,b.y-a.y);
      const count=Math.max(1,Math.min(1000,Math.ceil(distance/Math.max(1,a.radius))));
      for(let j=0;j<=count;j++) {
        const x=a.x+(b.x-a.x)*j/count,y=a.y+(b.y-a.y)*j/count;
        stamps.push(x,y,a.radius,0.55);
        if (!this.floatBlend) {
          this.stamp(this.pigment,{x,y},a.radius,0.55);
          this.stamp(this.wet,{x,y},a.radius*2,0.6,true);
        }
      }
    }
    if (this.floatBlend && stamps.length) this.paintBatch(new Float32Array(stamps));
  }
  private paintBatch(stamps: Float32Array): void {
    const gl=this.gl, program=this.splatProgram;
    gl.bindVertexArray(this.splatVao);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.splatBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,stamps,gl.STREAM_DRAW);
    gl.useProgram(program);
    gl.uniform2f(this.uniform(program,'uSize'),this.width,this.height);
    gl.viewport(0,0,this.width,this.height);
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.SCISSOR_TEST);gl.disable(gl.STENCIL_TEST);
    gl.enable(gl.BLEND);
    gl.colorMask(true,false,false,false);
    gl.blendFunc(gl.ONE,gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.pigment.read.fbo);
    gl.uniform1f(this.uniform(program,'uValueScale'),1);
    gl.uniform1f(this.uniform(program,'uScale'),1);
    gl.uniform1f(this.uniform(program,'uFiber'),this.fiber);
    gl.drawArraysInstanced(gl.TRIANGLES,0,3,stamps.length/4);
    gl.blendEquation(gl.MAX);
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.wet.read.fbo);
    gl.uniform1f(this.uniform(program,'uValueScale'),1.6);
    gl.uniform1f(this.uniform(program,'uScale'),2);
    gl.drawArraysInstanced(gl.TRIANGLES,0,3,stamps.length/4);
    gl.disable(gl.BLEND);
    // 必须把 blend equation 还原：`pass()` 开头只 disable(BLEND)，不会重置方程式，
    // 残留 MAX 会让随后的 erase()/clear() 变成“取最大值”而非清除（plan/09 §10 冒烟暴露）。
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.colorMask(true,true,true,true);
  }
  /**
   * 迫使全场从当前笔画集合重建（走 `rebuild` 路径）。
   * 仅供等价性对账使用：与 `redrawStroke` 的局部重绘路径比较同一几何的墨量是否一致。
   */
  forceRebuild(): void { this.rebuild(); }
  /**
   * 迫使某笔走局部重绘路径（走 `redrawStroke`）。
   */
  forceRedraw(strokeId: number): boolean {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return false;
    this.redrawStrokes([stroke]);
    return true;
  }
  forceRedrawBatch(strokeIds: readonly number[]): number {
    const batch: Stroke[] = [];
    for (const id of strokeIds) {
      const stroke = this.strokes.get(id);
      if (stroke) batch.push(stroke);
    }
    if (!batch.length) return 0;
    this.redrawStrokes(batch);
    return batch.length;
  }
  /**
   * 读出当前墨量总量（活动墨 pigment + 已固化 fixedInk 的半浮点和），用于 plan/08 §3.1 的
   * 「同输入下每 60 步 pigment 总和差 < 0.5%」对账回归。
   *
   * 这是**调试/测试用**的 GPU 回读：`readPixels` 会同步阻塞，禁止进入每帧热路径，
   * 也不得用它的结果决定游戏胜负（plan/07 §3）。
   */
  measureInk(): { total: number; active: number; fixed: number } {
    const read = (target: Target) => {
      const gl = this.gl;
      const pixels = new Uint16Array(target.w * target.h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.readPixels(0, 0, target.w, target.h, gl.RED, gl.HALF_FLOAT, pixels);
      const buffer = new Uint16Array(pixels.buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) sum += halfToFloat(buffer[i]);
      return sum;
    };
    return withGLState(this.gl, () => {
      const active = read(this.pigment.read);
      const fixed = read(this.fixedInk.read);
      return { total: active + fixed, active, fixed };
    });
  }
  /**
   * 局部擦除：在路径包围盒内清掉活动墨、湿场和已经沉进 fixedInk 的墨。
   * 只清包围盒，盒子外的湿墨仍会在后续步里回渗。若留下 fixedInk，帧率一高桥面就会在擦完后仍是一整条深色。
   * 返回被清理的世界坐标包围盒，供插件决定是否需要重绘相交笔画。
   */
  erase(path: readonly Point[], radius: number): { x: number; y: number; w: number; h: number } | undefined {
    if (!path.length || radius <= 0) return undefined;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const point of path) {
      minX = Math.min(minX, point.x - radius); maxX = Math.max(maxX, point.x + radius);
      minY = Math.min(minY, point.y - radius); maxY = Math.max(maxY, point.y + radius);
    }
    const left = Math.max(0, Math.floor(minX));
    const right = Math.min(this.width, Math.ceil(maxX));
    const bottom = Math.max(0, Math.floor(this.height - maxY));
    const top = Math.min(this.height, Math.ceil(this.height - minY));
    if (right <= left || top <= bottom) return undefined;
    withGLState(this.gl, () => {
      const gl = this.gl;
      gl.colorMask(true, true, true, true);
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(left, bottom, right - left, top - bottom);
      gl.clearColor(0, 0, 0, 0);
      for (const field of [this.pigment, this.wet, this.fixedInk]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, field.read.fbo);
        gl.viewport(0, 0, field.read.w, field.read.h);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.disable(gl.SCISSOR_TEST);
    });
    return { x: left, y: this.height - top, w: right - left, h: top - bottom };
  }
  /**
   * 批量局部重绘：对改动过的笔画，连同所有与它们相交的笔画一起，**在清掉旧区域后各重绘一次**。
   *
   * 为什么必须批量：逐笔调用 `redrawStroke` 时，每一笔都会把相交邻居再画一遍，
   * 邻居被画 N 次 → 墨量按 N 倍累加（plan/09 §10 对账实测 ≈ 99% 偏差）。
   * 这里的做法是先把整组的旧包围盒清掉，再对去重后的笔画集合各 `paint` 一次。
   */
  redrawStrokes(changed: readonly Stroke[]): void {
    if (!changed.length) return;
    for (const stroke of changed) this.strokes.set(stroke.id, stroke);
    withGLState(this.gl, () => {
      // 1) 收集需要重绘的笔画（改动笔自身 + 与它们相交的笔），去重。
      const group = new Map<number, Stroke>();
      const bounds = new Map<number, { x: number; y: number; radius: number }>();
      for (const stroke of changed) {
        const own = this.boundsOf(stroke);
        if (own) bounds.set(stroke.id, own);
        group.set(stroke.id, stroke);
      }
      for (const stroke of changed) {
        const own = bounds.get(stroke.id) ?? this.boundsByStroke.get(stroke.id);
        if (!own) continue;
        for (const other of this.strokes.values()) {
          if (group.has(other.id) || !other.fragments.length) continue;
          const otherBounds = this.boundsByStroke.get(other.id) ?? this.boundsOf(other);
          if (!otherBounds) continue;
          if (otherBounds.x + otherBounds.radius < own.x - own.radius ||
              otherBounds.x - otherBounds.radius > own.x + own.radius ||
              otherBounds.y + otherBounds.radius < own.y - own.radius ||
              otherBounds.y - otherBounds.radius > own.y + own.radius) continue;
          group.set(other.id, other);
          bounds.set(other.id, otherBounds);
        }
      }
      // 2) 一次清掉整组旧区域（含已删除笔画的历史包围盒）。
      const rectangles: { left: number; right: number; bottom: number; top: number }[] = [];
      for (const id of group.keys()) {
        const rect = this.boundsByStroke.get(id);
        if (rect) rectangles.push(this.rectOf(rect));
      }
      for (const stroke of changed) {
        const rect = this.boundsByStroke.get(stroke.id);
        if (rect) rectangles.push(this.rectOf(rect));
      }
      this.clearRectangles(rectangles);
      // 3) 去重后各重绘一次。
      for (const [id, stroke] of group) {
        if (!stroke.fragments.length) { this.boundsByStroke.delete(id); continue; }
        this.paint(stroke);
        this.boundsByStroke.set(id, bounds.get(id) ?? this.boundsOf(stroke)!);
      }
    });
    this.active = true;
  }
  private rectOf(bounds: { x: number; y: number; radius: number }) {
    return {
      left: Math.max(0, Math.floor(bounds.x - bounds.radius)),
      right: Math.min(this.width, Math.ceil(bounds.x + bounds.radius)),
      top: Math.min(this.height, Math.ceil(this.height - bounds.y + bounds.radius)),
      bottom: Math.max(0, Math.floor(this.height - bounds.y - bounds.radius)),
    };
  }
  private clearRectangles(rectangles: { left: number; right: number; bottom: number; top: number }[]): void {
    if (!rectangles.length) return;
    const gl = this.gl;
    gl.colorMask(true, true, true, true);
    gl.enable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    for (const rect of rectangles) {
      gl.scissor(rect.left, rect.bottom, Math.max(0, rect.right - rect.left), Math.max(0, rect.top - rect.bottom));
      for (const field of [this.pigment, this.wet, this.fixedInk]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, field.read.fbo);
        gl.viewport(0, 0, field.read.w, field.read.h);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
    gl.disable(gl.SCISSOR_TEST);
  }
  /** 单笔局部重绘（便捷入口，内部走批量实现）。 */
  redrawStroke(stroke: Stroke): void { this.redrawStrokes([stroke]); }
  private boundsOf(stroke: Stroke): { x: number; y: number; radius: number } | undefined {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, maxRadius = 0;
    for (const fragment of stroke.fragments) for (const point of fragment) {
      minX = Math.min(minX, point.x - point.radius); maxX = Math.max(maxX, point.x + point.radius);
      minY = Math.min(minY, point.y - point.radius); maxY = Math.max(maxY, point.y + point.radius);
      maxRadius = Math.max(maxRadius, point.radius);
    }
    if (!Number.isFinite(minX)) return undefined;
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, radius: Math.max((maxX - minX) / 2, (maxY - minY) / 2) };
  }
  rebuild(strokes?: readonly Stroke[]): void {
    if (strokes) {
      this.strokes.clear();
      for (const stroke of strokes) this.strokes.set(stroke.id,stroke);
    }
    withGLState(this.gl, () => {
      for (const field of [this.pigment,this.wet,this.fixedInk]) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,field.read.fbo);
        this.gl.viewport(0,0,field.read.w,field.read.h);
        this.gl.colorMask(true,true,true,true);
        this.gl.disable(this.gl.SCISSOR_TEST);
        this.gl.clearColor(0,0,0,0); this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      }
      for (const stroke of this.strokes.values()) { this.paint(stroke); const bounds = this.boundsOf(stroke); if (bounds) this.boundsByStroke.set(stroke.id, bounds); }
    });
    this.active = [...this.strokes.values()].some(stroke => stroke.fragments.length > 0);
  }
  step(dt: number): void {
    if (!this.active) return;
    withGLState(this.gl, () => {
      const sim=[1/this.simWidth,1/this.simHeight],dye=[1/this.width,1/this.height];
      this.pass('velocity',this.velocity.write,{uVelocity:this.velocity.read,uWet:this.wet.read},{uTexel:sim,uDt:dt}); this.velocity.swap();
      this.pass('divergence',this.divergence,{uVelocity:this.velocity.read},{uTexel:sim});
      for(let i=0;i<14;i++) {this.pass('pressure',this.pressure.write,{uPressure:this.pressure.read,uDivergence:this.divergence},{uTexel:sim});this.pressure.swap();}
      this.pass('project',this.velocity.write,{uVelocity:this.velocity.read,uPressure:this.pressure.read},{uTexel:sim});this.velocity.swap();
      this.pass('wet',this.wet.write,{uWet:this.wet.read,uVelocity:this.velocity.read},{uTexel:dye,uVelTexel:sim,uDt:dt,uDry:0.8,uAbsorbency:this.absorbency});this.wet.swap();
      this.pass('pigment',this.pigment.write,{uInk:this.pigment.read,uWet:this.wet.read,uVelocity:this.velocity.read},{uTexel:dye,uVelTexel:sim,uDt:dt,uAbsorbency:this.absorbency,uFiber:this.fiber});this.pigment.swap();
      this.pass('settle',this.fixedInk.write,{uInk:this.pigment.read,uWet:this.wet.read,uFixed:this.fixedInk.read},{uDt:dt,uMode:1});this.fixedInk.swap();
      this.pass('settle',this.pigment.write,{uInk:this.pigment.read,uWet:this.wet.read,uFixed:this.fixedInk.read},{uDt:dt,uMode:0});this.pigment.swap();
    });
  }
  render(): void {
    withGLState(this.gl, () => this.pass('display',null,{uInk:this.pigment.read,uWet:this.wet.read,uFixed:this.fixedInk.read},{uPaper:this.tone,uFiber:this.fiber,uTexelSize:1/this.width}));
  }
  resize(width: number, height: number): void {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || width * height > this.maxPixels) throw new Error('Invalid ink canvas size');
    if (width === this.width && height === this.height) return;
    withGLState(this.gl, () => {
      const gl = this.gl;
      const wet = this.pair(gl.R16F, gl.RED, width, height);
      const pigment = this.pair(gl.R16F, gl.RED, width, height);
      const fixedInk = this.pair(gl.R16F, gl.RED, width, height);
      for (const [oldField, newField] of [[this.wet, wet], [this.pigment, pigment], [this.fixedInk, fixedInk]] as const) {
        for (const side of ['read', 'write'] as const) {
          gl.bindFramebuffer(gl.READ_FRAMEBUFFER, oldField[side].fbo);
          gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, newField[side].fbo);
          gl.disable(gl.SCISSOR_TEST);
          gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        }
        for (const target of [oldField.read, oldField.write]) { gl.deleteFramebuffer(target.fbo); gl.deleteTexture(target.tex); }
      }
      this.wet = wet; this.pigment = pigment; this.fixedInk = fixedInk;
      this.width = width; this.height = height;
    });
  }
  setPaper(paper: Partial<{tone:[number,number,number];absorbency:number;fiber:number}>): void {
    if (paper.tone) this.tone=paper.tone;
    if (paper.absorbency !== undefined) this.absorbency=Math.max(0,Math.min(2,paper.absorbency));
    if (paper.fiber !== undefined) this.fiber=Math.max(0,Math.min(1,paper.fiber));
  }
  dispose(): void {
    const gl=this.gl;
    for (const field of [this.velocity,this.pressure,this.wet,this.pigment,this.fixedInk]) for (const target of [field.read,field.write]) {
      gl.deleteFramebuffer(target.fbo); gl.deleteTexture(target.tex);
    }
    gl.deleteFramebuffer(this.divergence.fbo);gl.deleteTexture(this.divergence.tex);
    for(const program of Object.values(this.programs)) gl.deleteProgram(program);
    gl.deleteProgram(this.splatProgram);gl.deleteBuffer(this.splatBuffer);gl.deleteVertexArray(this.splatVao);
    gl.deleteBuffer(this.buffer);gl.deleteVertexArray(this.vao);
  }
}
