import type { EnginePlugin } from '../core/types';
import { withGLState } from './gl-state';
import { InkToken, RendererToken, SceneToken, type Renderer2D, type Scene2D } from './tokens';

const vertex = `#version 300 es
layout(location=0) in vec2 a;
layout(location=1) in vec4 body;
out vec2 local;
out vec4 tag;
uniform vec2 uSize;
void main(){
  local=a;
  tag=body;
  vec2 pixel=vec2(body.x,uSize.y-body.y)+a*body.z*1.06;
  gl_Position=vec4(pixel/uSize*2.-1.,0.,1.);
}`;

const fragment = `#version 300 es
precision highp float;
in vec2 local;
in vec4 tag;
out vec4 o;
uniform vec3 uInk;
uniform vec3 uGoal;
void main(){
  float r=length(local);
  float alpha=smoothstep(1.0,0.93,r);
  if(alpha<=0.002) discard;
  vec3 color=tag.w>0.5?uGoal:uInk;
  color=mix(color*0.7,color,smoothstep(0.7,1.0,r));
  o=vec4(color,alpha);
}`;

const capacity = 4096;

function compile(gl: WebGL2RenderingContext, kind: number, source: string): WebGLShader {
  const shader = gl.createShader(kind);
  if (!shader) throw new Error('Could not allocate scene shader');
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader);
    throw new Error(`Scene shader failed: ${message}`);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, vertex);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!program) throw new Error('Could not allocate scene program');
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program); gl.deleteProgram(program);
    throw new Error(`Scene program failed: ${message}`);
  }
  return program;
}

/**
 * 基础 2D 实体渲染：球体（circles）与标记（markers，如终点印章）。
 *
 * 只依赖 RendererToken 与 SceneToken；InkToken 是**可选**依赖，仅用来决定是否需要自己铺纸底，
 * 因此卸载水墨插件后关卡依然可见（plan/07 §7 架构验收、G2 “无墨也能跑”）。
 * 绘制在 ink 阶段、且排在水墨之后，保证实体不被全屏墨层覆盖。
 */
export function createSceneRendererPlugin(): EnginePlugin {
  let paint: (() => void) | undefined;
  return {
    manifest: {
      id: 'scene-renderer', version: '1.0.0',
      requires: [{ token: RendererToken, range: '^1.0.0' }, { token: SceneToken, range: '^1.0.0' }],
      // 可选依赖兼作排序约束：墨水插件在场时，拓扑排序会把它排在墨层之后（避免实体被全屏墨层覆盖）；
      // 墨水缺失时无此边，插件自行铺纸底。不用 after/before —— 它们引用不存在的 id 会直接抛错。
      optional: [{ token: InkToken, range: '^1.0.0' }],
      renderPhase: 'ink',
    },
    register() {},
    init(ctx) {
      const renderer: Renderer2D = ctx.get(RendererToken);
      const gl = renderer.gl;
      const ownsBackdrop = !ctx.optional(InkToken);
      const instances = new Float32Array(capacity * 4);
      paint = withGLState(gl, () => {
        const program = link(gl);
        const vao = gl.createVertexArray(), quad = gl.createBuffer(), buffer = gl.createBuffer();
        if (!vao || !quad || !buffer) throw new Error('Could not allocate scene renderer buffers');
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 16, 0);
        gl.vertexAttribDivisor(1, 1);
        gl.bindVertexArray(null);
        const size = gl.getUniformLocation(program, 'uSize');
        const inkColor = gl.getUniformLocation(program, 'uInk');
        const goalColor = gl.getUniformLocation(program, 'uGoal');
        ctx.resources.add(() => {
          gl.deleteProgram(program); gl.deleteBuffer(quad); gl.deleteBuffer(buffer); gl.deleteVertexArray(vao);
        });
        return () => {
          const scene: Scene2D = ctx.get(SceneToken);
          gl.disable(gl.DEPTH_TEST); gl.disable(gl.SCISSOR_TEST); gl.disable(gl.STENCIL_TEST);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
          if (ownsBackdrop) {
            gl.clearColor(0.945, 0.925, 0.882, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          let count = 0;
          for (const circle of scene.circles) {
            if (count >= capacity) break;
            instances.set([circle.x, circle.y, circle.radius, 0], count * 4); count++;
          }
          for (const marker of scene.markers) {
            if (count >= capacity) break;
            instances.set([marker.x, marker.y, marker.radius, 1], count * 4); count++;
          }
          if (!count) return;
          gl.useProgram(program);
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.uniform2f(size, renderer.canvas.width, renderer.canvas.height);
          gl.uniform3f(inkColor, 0.13, 0.15, 0.17);
          gl.uniform3f(goalColor, 0.52, 0.22, 0.18);
          gl.bindVertexArray(vao);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, instances.subarray(0, count * 4), gl.STREAM_DRAW);
          gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
          gl.disable(gl.BLEND);
        };
      });
    },
    render(ctx) {
      if (!paint) return;
      const gl = ctx.get(RendererToken).gl;
      withGLState(gl, paint);
    },
  };
}
