import {
  BufferGeometry, DataTexture, Float32BufferAttribute, GLSL3, LinearFilter, Mesh,
  NoBlending, NoColorSpace, NormalBlending, OrthographicCamera, RawShaderMaterial, RGBAFormat, Scene,
  UnsignedByteType, Vector2, Vector3, Vector4, WebGLRenderTarget,
  type Blending, type Texture, type WebGLRenderer,
} from 'three';
import type { PixelRect } from './ink-raster';

const VERT = `
precision highp float;
in vec2 position;
uniform vec4 uRect;
uniform vec2 uCanvas;
out vec2 vPixel;
void main() {
  vec2 uv = position * 0.5 + 0.5;
  vPixel = uRect.xy + uv * uRect.zw;
  gl_Position = vec4(
    vPixel.x / uCanvas.x * 2.0 - 1.0,
    vPixel.y / uCanvas.y * 2.0 - 1.0,
    0.0,
    1.0
  );
}
`;

const FILL = `
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec3 uColor;
void main() { finalColor = vec4(uColor, 1.0); }
`;

const BLIT = `
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec4 uRect;
uniform sampler2D uStamp;
void main() {
  vec2 local = (vPixel - uRect.xy) / uRect.zw;
  vec4 stamp = texture(uStamp, vec2(local.x, 1.0 - local.y));
  finalColor = vec4(stamp.rgb, stamp.a);
}
`;

const COPY = `
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uSource;
void main() {
  finalColor = texture(uSource, vec2(vPixel.x / uCanvas.x, vPixel.y / uCanvas.y));
}
`;

export interface InkUniform {
  value: number | Vector2 | Vector3 | Vector4 | Texture | Vector3[] | Vector4[];
}

/**
 * Full-screen quad passes into render targets. vPixel is y-down, matching the Pixi ink sheets,
 * and the write lands where the ported fragment's T() will read it back.
 */
export class InkPass {
  readonly width: number;
  readonly height: number;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly mesh: Mesh;
  private readonly fillMat: RawShaderMaterial;
  private readonly blitMat: RawShaderMaterial;
  private readonly copyMat: RawShaderMaterial;
  private stamp: DataTexture | undefined;
  private disposed = false;

  constructor(private readonly renderer: WebGLRenderer, width: number, height: number) {
    this.width = width;
    this.height = height;
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1], 2));
    this.fillMat = this.material(FILL, { uColor: { value: new Vector3(1, 1, 1) } });
    this.blitMat = this.material(BLIT, {
      uStamp: { value: whiteTexture() },
    }, NormalBlending);
    this.blitMat.transparent = true;
    this.blitMat.premultipliedAlpha = false;
    this.copyMat = this.material(COPY, { uSource: { value: whiteTexture() } });
    this.mesh = new Mesh(geometry, this.fillMat);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
  }

  material(fragment: string, uniforms: Record<string, InkUniform>, blending: Blending = NoBlending): RawShaderMaterial {
    return new RawShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: VERT,
      fragmentShader: `precision highp float;\n${fragment}`,
      uniforms: {
        uCanvas: { value: new Vector2(this.width, this.height) },
        uRect: { value: new Vector4(0, 0, this.width, this.height) },
        ...uniforms,
      },
      blending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
  }

  target(): WebGLRenderTarget {
    const rt = new WebGLRenderTarget(this.width, this.height, {
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: LinearFilter,
      minFilter: LinearFilter,
      generateMipmaps: false,
    });
    rt.texture.colorSpace = NoColorSpace;
    rt.texture.flipY = false;
    return rt;
  }

  fill(rt: WebGLRenderTarget, rect: PixelRect, rgb: readonly [number, number, number]): void {
    const color = this.fillMat.uniforms.uColor;
    if (color) (color.value as Vector3).set(rgb[0], rgb[1], rgb[2]);
    this.draw(this.fillMat, rt, rect);
  }

  clear(rt: WebGLRenderTarget, rgb: readonly [number, number, number]): void {
    this.fill(rt, { x: 0, y: 0, w: this.width, h: this.height }, rgb);
  }

  blitStamp(pixels: Uint8Array, rect: PixelRect, dest: WebGLRenderTarget): void {
    if (rect.w < 1 || rect.h < 1) return;
    if (!this.stamp || this.stamp.image.width !== rect.w || this.stamp.image.height !== rect.h) {
      this.stamp?.dispose();
      this.stamp = new DataTexture(pixels, rect.w, rect.h, RGBAFormat, UnsignedByteType);
      this.stamp.flipY = true;
      this.stamp.magFilter = LinearFilter;
      this.stamp.minFilter = LinearFilter;
      this.stamp.colorSpace = NoColorSpace;
      this.stamp.generateMipmaps = false;
    } else {
      this.stamp.image.data = pixels;
    }
    this.stamp.needsUpdate = true;
    const stamp = this.blitMat.uniforms.uStamp;
    if (stamp) stamp.value = this.stamp;
    this.draw(this.blitMat, dest, rect);
  }

  copy(from: WebGLRenderTarget, to: WebGLRenderTarget, rect: PixelRect): void {
    this.blitTexture(from.texture, to, rect);
  }

  read(target: WebGLRenderTarget, buffer: Uint8Array): void {
    this.renderer.readRenderTargetPixels(target, 0, 0, this.width, this.height, buffer);
  }

  blitTexture(texture: Texture, to: WebGLRenderTarget, rect: PixelRect): void {
    const source = this.copyMat.uniforms.uSource;
    if (source) source.value = texture;
    this.draw(this.copyMat, to, rect);
  }

  draw(material: RawShaderMaterial, rt: WebGLRenderTarget, rect: PixelRect): void {
    if (this.disposed) return;
    const box = material.uniforms.uRect;
    if (box) (box.value as Vector4).set(rect.x, rect.y, rect.w, rect.h);
    this.mesh.material = material;
    const previous = this.renderer.getRenderTarget();
    const auto = this.renderer.autoClear;
    this.renderer.autoClear = false;
    this.renderer.setRenderTarget(rt);
    this.renderer.setViewport(0, 0, this.width, this.height);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(previous);
    this.renderer.autoClear = auto;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.fillMat.dispose();
    this.blitMat.dispose();
    this.copyMat.dispose();
    this.stamp?.dispose();
    this.mesh.geometry.dispose();
  }
}

export function whiteTexture(): DataTexture {
  const tex = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, RGBAFormat, UnsignedByteType);
  tex.colorSpace = NoColorSpace;
  tex.needsUpdate = true;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}
