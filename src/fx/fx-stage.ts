/**
 * 一个画布上的水墨特效舞台。模拟在半分辨率的密度场里跑，
 * 全分辨率只做纸纹和三层墨色，这样桌面 60fps 时场本身不必跟屏幕一样大。
 */
import {
  BufferGeometry, Float32BufferAttribute, GLSL3, LinearFilter, LinearSRGBColorSpace,
  Mesh, NoBlending, OrthographicCamera, RawShaderMaterial, RGBAFormat, Scene,
  UnsignedByteType, Vector2, Vector4, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import { createInkFx } from './ink-fx';
import { FX_CLEAR, FX_COMP, FX_SIM, FX_VERT } from './fx-shaders';
import type { InkFx, InkFxFrame, InkFxParams } from './fx-types';

export interface InkFxStageOptions {
  width?: number;
  height?: number;
  transparent?: boolean;
}

export class InkFxStage {
  readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly mesh: Mesh;
  private readonly clearMat: RawShaderMaterial;
  private readonly simMat: RawShaderMaterial;
  private readonly compMat: RawShaderMaterial;
  private read: WebGLRenderTarget;
  private write: WebGLRenderTarget;
  private fx: InkFx | undefined;
  private disposed = false;
  private glError = 0;
  private readonly splatA: Vector4[] = [];
  private readonly splatB: Vector4[] = [];
  readonly width: number;
  readonly height: number;

  constructor(canvas: HTMLCanvasElement, options: InkFxStageOptions = {}) {
    this.width = options.width ?? canvas.width ?? 640;
    this.height = options.height ?? canvas.height ?? 360;
    canvas.width = this.width;
    canvas.height = this.height;
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: options.transparent ?? false,
      antialias: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.setClearColor(0x000000, options.transparent ? 0 : 1);
    this.renderer.autoClear = false;
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([
      -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
    ], 3));
    for (let i = 0; i < 16; i++) {
      this.splatA.push(new Vector4());
      this.splatB.push(new Vector4());
    }
    const simW = Math.max(480, Math.round(this.width * 0.75));
    const simH = Math.max(270, Math.round(this.height * 0.75));
    this.clearMat = this.material(FX_CLEAR, {});
    this.simMat = this.material(FX_SIM, {
      uState: { value: null },
      uResolution: { value: new Vector2(simW, simH) },
      uDt: { value: 0.016 },
      uTime: { value: 0 },
      uFlow: { value: 0 },
      uDiffuse: { value: 0.2 },
      uEvap: { value: 0.3 },
      uFade: { value: 0 },
      uRecede: { value: 0 },
      uClear: { value: 0 },
      uDensity: { value: 1 },
      uOriginX: { value: 0.5 },
      uOriginY: { value: 0.5 },
      uSeed: { value: 0.2 },
      uOverlay: { value: 0 },
      uA: { value: this.splatA },
      uB: { value: this.splatB },
    });
    this.compMat = this.material(FX_COMP, {
      uState: { value: null },
      uResolution: { value: new Vector2(this.width, this.height) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uFlash: { value: 0 },
      uAge: { value: 0 },
      uShake: { value: 0 },
      uTint: { value: -1 },
      uTransparent: { value: options.transparent ? 1 : 0 },
      uOriginX: { value: 0.5 },
      uOriginY: { value: 0.5 },
      uSeed: { value: 0.2 },
      uOverlay: { value: 0 },
    });
    this.mesh = new Mesh(geometry, this.clearMat);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
    this.read = this.target(simW, simH);
    this.write = this.target(simW, simH);
  }

  get current(): InkFx | undefined {
    return this.fx;
  }

  get error(): number {
    return this.glError;
  }

  play(id: string, params?: Partial<InkFxParams>): InkFx {
    this.fx?.dispose();
    this.fx = createInkFx(id);
    this.fx.start(params);
    return this.fx;
  }

  /** 按 60fps 把效果推到 time 秒，给静帧和接触表用。 */
  seek(time: number): void {
    const steps = Math.max(1, Math.round(time / (1 / 60)));
    for (let i = 0; i < steps; i++) this.update(1 / 60);
  }

  update(dt: number): void {
    if (this.disposed || !this.fx) return;
    const frame = this.fx.update(dt);
    this.draw(frame, dt);
    this.glError = this.renderer.getContext().getError();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.fx?.dispose();
    this.fx = undefined;
    this.read.dispose();
    this.write.dispose();
    this.clearMat.dispose();
    this.simMat.dispose();
    this.compMat.dispose();
    this.mesh.geometry.dispose();
    this.renderer.dispose();
  }

  private draw(frame: InkFxFrame, dt: number): void {
    const sim = this.simMat.uniforms;
    const comp = this.compMat.uniforms;
    for (let i = 0; i < 16; i++) {
      const splat = frame.splats[i];
      const a = this.splatA[i];
      const b = this.splatB[i];
      if (!a || !b) continue;
      if (!splat) {
        a.set(0, 0, 0, 0);
        b.set(0, 0, 0, 0);
      } else {
        a.set(splat.x, splat.y, splat.radius, splat.amount);
        b.set(splat.water, splat.pigment, splat.vx, splat.vy);
      }
    }
    const time = (sim.uTime?.value as number) + dt;
    if (sim.uTime) sim.uTime.value = time;
    if (sim.uDt) sim.uDt.value = dt > 0.05 ? 0.05 : dt;
    if (sim.uFlow) sim.uFlow.value = frame.flow;
    if (sim.uDiffuse) sim.uDiffuse.value = frame.diffuse;
    if (sim.uEvap) sim.uEvap.value = frame.evaporate;
    if (sim.uFade) sim.uFade.value = frame.fade;
    if (sim.uRecede) sim.uRecede.value = frame.recede;
    if (sim.uClear) sim.uClear.value = frame.clear ? 1 : 0;
    if (sim.uOriginX) sim.uOriginX.value = frame.originX;
    if (sim.uOriginY) sim.uOriginY.value = frame.originY;
    if (sim.uOverlay) sim.uOverlay.value = frame.overlay;
    if (sim.uState) sim.uState.value = this.read.texture;
    this.blit(this.simMat, this.write);
    if (frame.clear) {
      const swap = this.read;
      this.read = this.write;
      this.write = swap;
      if (sim.uClear) sim.uClear.value = 0;
      if (sim.uState) sim.uState.value = this.read.texture;
      this.blit(this.simMat, this.write);
    }
    const swap = this.read;
    this.read = this.write;
    this.write = swap;
    if (comp.uState) comp.uState.value = this.read.texture;
    if (comp.uTime) comp.uTime.value = time;
    if (comp.uProgress) comp.uProgress.value = this.fx?.progress ?? 0;
    if (comp.uFlash) comp.uFlash.value = frame.flash;
    if (comp.uAge) comp.uAge.value = frame.age;
    if (comp.uShake) comp.uShake.value = frame.shake;
    if (comp.uTint) comp.uTint.value = frame.pigment;
    if (comp.uOriginX) comp.uOriginX.value = frame.originX;
    if (comp.uOriginY) comp.uOriginY.value = frame.originY;
    if (comp.uOverlay) comp.uOverlay.value = frame.overlay;
    this.renderer.setRenderTarget(null);
    this.renderer.setViewport(0, 0, this.width, this.height);
    this.renderer.clear(true, false, false);
    this.mesh.material = this.compMat;
    this.renderer.render(this.scene, this.camera);
  }

  private blit(material: RawShaderMaterial, target: WebGLRenderTarget): void {
    this.renderer.setRenderTarget(target);
    this.renderer.setViewport(0, 0, target.width, target.height);
    this.mesh.material = material;
    this.renderer.render(this.scene, this.camera);
  }

  private material(fragment: string, uniforms: Record<string, { value: unknown }>): RawShaderMaterial {
    return new RawShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: FX_VERT,
      fragmentShader: fragment,
      uniforms,
      blending: NoBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
  }

  private target(width: number, height: number): WebGLRenderTarget {
    const rt = new WebGLRenderTarget(width, height, {
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: LinearFilter,
      minFilter: LinearFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
    });
    rt.texture.generateMipmaps = false;
    return rt;
  }
}
