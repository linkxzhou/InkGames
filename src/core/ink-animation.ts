import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace, TextureLoader, WebGLRenderer } from 'three';

export interface InkAnimationShot {
  readonly id: string;
  readonly from: number;
  readonly to: number;
  readonly image: string;
  readonly note: string;
}

export interface InkAnimationOptions {
  readonly canvas: HTMLCanvasElement;
  readonly shots: readonly InkAnimationShot[];
  readonly durationFrames: number;
  readonly pixelRatio?: number;
}

/** Stateless presentation time: seek never emits audio or story side effects. */
export function animationPose(shots: readonly InkAnimationShot[], frame: number, duration: number): { index: number; progress: number; frame: number } {
  const f = Math.min(duration - 1, Math.max(0, Math.floor(frame)));
  const index = shots.findIndex(shot => f >= shot.from && f < shot.to);
  if (index < 0) throw new Error('动画帧不在镜头范围内');
  const shot = shots[index];
  return { index, progress: (f - shot.from) / (shot.to - shot.from), frame: f };
}

export function validateAnimation(shots: readonly InkAnimationShot[], duration: number): void {
  if (!Number.isInteger(duration) || duration <= 0 || shots.length === 0) throw new Error('动画时长无效');
  let end = 0;
  const ids = new Set<string>();
  for (const shot of shots) {
    if (!shot.id || ids.has(shot.id) || shot.from !== end || !Number.isInteger(shot.to) || shot.to <= shot.from || !shot.image) throw new Error('镜头必须唯一、连续且具有图片');
    ids.add(shot.id);
    end = shot.to;
  }
  if (end !== duration) throw new Error('镜头范围与动画时长不一致');
}

const fragment = `
precision highp float;
uniform sampler2D image;
uniform float progress;
uniform float time;
uniform float shot;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=vUv;
  vec3 paper=vec3(.86,.83,.76);
  float grain=noise(uv*vec2(1200.,680.))*.025;
  paper+=grain;
  // Preserve the square composition inside a widescreen paper margin.
  vec2 art=(uv-.5)*vec2(1.77778,1.);
  float zoom=1.02+progress*.06;
  vec2 sampleUv=art/zoom+.5+vec2(sin(time*.12)*.008,progress*.014);
  float bounds=step(0.,sampleUv.x)*step(sampleUv.x,1.)*step(0.,sampleUv.y)*step(sampleUv.y,1.);
  vec3 paint=texture2D(image,clamp(sampleUv,0.,1.)).rgb;
  float luminance=dot(paint,vec3(.2126,.7152,.0722));
  // Paper-colored whites avoid a rectangular scan pasted onto a different sheet.
  paint=mix(paint,paper,smoothstep(.74,.98,luminance)*.72);
  float edge=1.-smoothstep(.40,.51,max(abs(art.x/zoom),abs(art.y/zoom)));
  float n=noise(art*7.)*.16+noise(art*25.)*.045;
  float reveal=1.-smoothstep(progress*1.35-.10,progress*1.35+.08,length(art*vec2(.8,1.))+n);
  float settle=smoothstep(.38,.62,progress);
  reveal=mix(reveal,1.,settle);
  vec3 color=mix(paper,paint,bounds*edge*reveal);
  // Independently moving atmosphere, restricted to the lower edge of the art.
  float fog=noise(vec2(uv.x*6.-time*.055,uv.y*12.+time*.035));
  float fogMask=(1.-smoothstep(.08,.35,uv.y))*smoothstep(.03,.14,uv.y);
  color=mix(color,paper,fog*fogMask*.26);
  if(shot>2.5 && shot<3.5){
    float waves=sin(uv.x*72.+time*1.7+noise(uv*8.)*3.);
    color-=vec3(.045)*smoothstep(.12,.16,uv.y)*(1.-smoothstep(.20,.28,uv.y))*max(0.,waves)*reveal;
  }
  // A falling ink seed and bloom introduces the first shot.
  if(shot<.5){
    vec2 drop=vec2(.5,mix(.88,.52,smoothstep(0.,.06,progress)));
    float bloom=mix(.005,.11,smoothstep(.04,.18,progress));
    float ink=1.-smoothstep(bloom*.65,bloom,length((uv-drop)*vec2(1.7778,1.))+noise(uv*40.)*bloom*.3);
    color=mix(color,vec3(.07,.065,.06),ink*(1.-smoothstep(.19,.38,progress)));
  }
  // Fine independent flecks, not deformation of faces or anatomy.
  vec2 grid=uv*vec2(90.,50.); vec2 cell=floor(grid);
  float spark=step(.988,hash(cell))*step(length(fract(grid)-.5),.08);
  float twinkle=.5+.5*sin(time*1.2+hash(cell)*20.);
  color=mix(color,shot>3.5?vec3(.67,.39,.22):vec3(.19,.17,.14),spark*twinkle*.35*reveal);
  float fade=smoothstep(0.,.025,progress)*(1.-smoothstep(.965,1.,progress));
  color=mix(paper,color,fade);
  gl_FragColor=vec4(color,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/** Local image presentation; owns and disposes every GPU resource it creates. */
export class InkAnimation {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, .1, 10);
  private readonly geometry = new PlaneGeometry(2, 2);
  private readonly material: ShaderMaterial;
  private readonly textures: Awaited<ReturnType<TextureLoader['loadAsync']>>[] = [];
  private readonly canvas: HTMLCanvasElement;
  private frame = 0;
  private disposed = false;
  private lost = false;
  private readonly onLost = (event: Event): void => { event.preventDefault(); this.lost = true; };
  private readonly onRestored = (): void => { this.lost = false; this.textures.forEach(texture => { texture.needsUpdate = true; }); this.material.needsUpdate = true; this.render(this.frame); };

  constructor(private readonly options: InkAnimationOptions) {
    validateAnimation(options.shots, options.durationFrames);
    this.canvas = options.canvas;
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: false });
    this.renderer.setPixelRatio(Math.min(2, options.pixelRatio ?? 1));
    this.renderer.setSize(1280, 720, false);
    this.camera.position.z = 1;
    this.material = new ShaderMaterial({
      uniforms: { image: { value: null }, progress: { value: 0 }, time: { value: 0 }, shot: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: fragment,
      depthTest: false,
      depthWrite: false,
    });
    this.scene.add(new Mesh(this.geometry, this.material));
    this.canvas.addEventListener('webglcontextlost', this.onLost);
    this.canvas.addEventListener('webglcontextrestored', this.onRestored);
  }

  async load(): Promise<void> {
    const loader = new TextureLoader();
    // Sequential loading avoids orphaned textures if one resource fails.
    try {
      for (const shot of this.options.shots) {
        const texture = await loader.loadAsync(shot.image);
        if (this.disposed) { texture.dispose(); return; }
        texture.colorSpace = SRGBColorSpace;
        this.textures.push(texture);
      }
      this.render(0);
    } catch (error) { this.dispose(); throw error; }
  }

  render(frame: number): void {
    if (this.disposed || this.lost || !this.textures.length) return;
    const pose = animationPose(this.options.shots, frame, this.options.durationFrames);
    this.frame = pose.frame;
    this.material.uniforms.image.value = this.textures[pose.index];
    this.material.uniforms.progress.value = pose.progress;
    this.material.uniforms.time.value = pose.frame / 60;
    this.material.uniforms.shot.value = pose.index;
    this.renderer.render(this.scene, this.camera);
  }

  get contextLost(): boolean { return this.lost; }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    this.textures.forEach(texture => texture.dispose());
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
