import type { EnginePlugin } from '../core/types';
import { withGLState } from './gl-state';
import { RendererToken, type Renderer2D } from './tokens';

export function createWebGL2RendererPlugin(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext): EnginePlugin {
  let renderer: Renderer2D;
  return {
    manifest: { id: 'renderer-webgl2', version: '1.0.0', provides: [{ token: RendererToken, version: '1.0.0' }] },
    register(ctx) {
      renderer = {
        canvas, gl, halfFloat: false,
        resize(width, height) {
          if (width <= 0 || height <= 0) throw new Error('Invalid canvas size');
          canvas.width = Math.floor(width);
          canvas.height = Math.floor(height);
          gl.viewport(0, 0, canvas.width, canvas.height);
        },
        dispose() {},
      };
      ctx.provide(RendererToken, renderer);
    },
    init() {
      if (!(gl instanceof WebGL2RenderingContext)) throw new Error('WebGL2 required');
      if (!gl.getExtension('EXT_color_buffer_float')) throw new Error('EXT_color_buffer_float required');
      withGLState(gl, () => { for (const [internal, format] of [[gl.R16F, gl.RED], [gl.RG16F, gl.RG], [gl.RGBA16F, gl.RGBA]]) {
        const texture = gl.createTexture();
        const fbo = gl.createFramebuffer();
        if (!texture || !fbo) throw new Error('Could not allocate float framebuffer');
        const previousTexture = gl.getParameter(gl.TEXTURE_BINDING_2D) as WebGLTexture | null;
        const previousFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
        try {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, gl.HALF_FLOAT, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
          if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error(`Unsupported half-float format ${internal}`);
        } finally {
          gl.bindFramebuffer(gl.FRAMEBUFFER, previousFbo);
          gl.bindTexture(gl.TEXTURE_2D, previousTexture);
          gl.deleteFramebuffer(fbo);
          gl.deleteTexture(texture);
        }
      }
      });
      Object.assign(renderer, { halfFloat: true });
    },
  };
}
