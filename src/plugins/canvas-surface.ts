import type { EnginePlugin } from '../core/types';
import { createToken } from '../core/types';
import { withGLState } from './gl-state';
import { RendererToken, type Renderer2D } from './tokens';

export interface CanvasSurface {
  readonly context: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
  /** 标记本帧内容已更新；下一次 render 会上传纹理。 */
  invalidate(): void;
  /** 请求改尺寸；真正的纹理重建发生在下一次 render（render 阶段独占 GL）。 */
  resize(width: number, height: number): void;
}

export const CanvasSurfaceToken = createToken<CanvasSurface>('inkgames.canvas-surface');

const vertex = `#version 300 es
layout(location=0) in vec2 a;
out vec2 uv;
void main(){ uv=a*0.5+0.5; gl_Position=vec4(a,0.0,1.0); }`;

const fragment = `#version 300 es
precision mediump float;
in vec2 uv;
out vec4 color;
uniform sampler2D tex;
void main(){ color=texture(tex,vec2(uv.x,1.0-uv.y)); }`;

function compile(gl: WebGL2RenderingContext, kind: number, source: string): WebGLShader {
  const shader = gl.createShader(kind);
  if (!shader) throw new Error('Could not allocate surface shader');
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader);
    throw new Error(`Surface shader failed: ${message}`);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, vertex);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!program) throw new Error('Could not allocate surface program');
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program); gl.deleteProgram(program);
    throw new Error(`Surface program failed: ${message}`);
  }
  return program;
}

/**
 * 2D 画布叠层（通用能力）：把一张 CPU Canvas2D 上传为纹理，在 `ui` 阶段贴到屏幕。
 *
 * 让应用用熟悉的 Canvas2D 画 HUD 或 2D 演示，同时由**引擎**持有并登记全部 GPU 资源
 * （AGENTS.md §2：一切 GPU handle 经 ctx.resources.add() 登记），应用里不再出现裸 GL 代码。
 * 与 docs/01「UI/调试归通用插件」、docs/07「ui-overlay」的职责划分一致。
 *
 * 已知代价：每帧整幅上传（width × height × 4 字节），尚未做脏区上传。
 * 高频使用前应在真实 GPU 上做基准（plan/09 §8 未完成项）。
 */
export function createCanvasSurfacePlugin(width: number, height: number): EnginePlugin {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error('Canvas surface requires positive integer dimensions');
  }
  let dirty = true;
  let present: (() => void) | undefined;
  const pendingResize: [number, number][] = [];
  return {
    manifest: {
      id: 'canvas-surface', version: '1.0.0',
      requires: [{ token: RendererToken, range: '^1.0.0' }],
      provides: [{ token: CanvasSurfaceToken, version: '1.0.0' }],
      renderPhase: 'ui',
    },
    register(ctx) {
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas surface requires a 2D context');
      ctx.provide(CanvasSurfaceToken, {
        context,
        get width() { return canvas.width; },
        get height() { return canvas.height; },
        invalidate() { dirty = true; },
        resize(w, h) { pendingResize.push([w, h]); },
      });
    },
    init(ctx) {
      const renderer: Renderer2D = ctx.get(RendererToken);
      const gl = renderer.gl;
      const canvas = ctx.get(CanvasSurfaceToken).context.canvas;
      withGLState(gl, () => {
        const program = link(gl);
        const vao = gl.createVertexArray(), buffer = gl.createBuffer(), texture = gl.createTexture();
        if (!vao || !buffer || !texture) throw new Error('Could not allocate surface resources');
        const allocate = (target: WebGLTexture, w: number, h: number) => {
          gl.bindTexture(gl.TEXTURE_2D, target);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        };
        allocate(texture, canvas.width, canvas.height);
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        const sampler = gl.getUniformLocation(program, 'tex');
        // 纹理会在 resize 时被替换，清理必须读“当前”引用而不是捕获初值。
        const holder = { texture };
        ctx.resources.add(() => {
          gl.deleteProgram(program); gl.deleteBuffer(buffer); gl.deleteVertexArray(vao);
          if (holder.texture) gl.deleteTexture(holder.texture);
        });
        present = () => {
          for (const [w, h] of pendingResize.splice(0)) {
            if (!Number.isInteger(w) || !Number.isInteger(h) || w <= 0 || h <= 0) throw new Error('Invalid surface size');
            if (w === canvas.width && h === canvas.height) continue;
            canvas.width = w; canvas.height = h;
            const next = gl.createTexture();
            if (!next) throw new Error('Could not reallocate surface texture');
            allocate(next, w, h);
            if (holder.texture) gl.deleteTexture(holder.texture);
            holder.texture = next;
            dirty = true;
          }
          if (dirty) {
            dirty = false;
            gl.bindTexture(gl.TEXTURE_2D, holder.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
          }
          gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.SCISSOR_TEST);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          // p5 会全局开启 UNPACK_PREMULTIPLY_ALPHA_WEBGL（plan/07 §8.2），必须显式关掉，否则颜色被预乘。
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, holder.texture);
          gl.useProgram(program);
          gl.uniform1i(sampler, 0);
          gl.bindVertexArray(vao);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
      });
    },
    render(ctx) {
      if (!present) return;
      const gl = ctx.get(RendererToken).gl;
      withGLState(gl, present);
    },
  };
}
