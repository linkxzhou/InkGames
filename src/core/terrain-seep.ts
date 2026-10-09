import {
  BufferGeometry, DataTexture, Float32BufferAttribute, NearestFilter,
  NoColorSpace, RGBAFormat, UnsignedByteType, Vector4,
  type Texture, type WebGLRenderer, type WebGLRenderTarget,
} from 'three';
import { InkPass } from './ink-pass';
import type { PixelRect } from './ink-raster';
import {
  bakeHeightField, SEEP_HEIGHT, SEEP_STAMP_LIMIT, SEEP_WIDTH,
  type InkStamp, type TerrainBounds, type TerrainPoint,
} from './terrain-field';

const STAMP = `
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uDry;
uniform vec4 uStamp[8];
uniform float uCount;
void main() {
  vec2 uv = vPixel / uCanvas;
  float dry = texture(uDry, uv).r;
  int count = int(uCount);
  for (int i = 0; i < 8; i++) {
    if (i >= count) break;
    vec2 delta = uv - uStamp[i].xy;
    float radius = max(uStamp[i].z, 0.0001);
    float fall = 1.0 - smoothstep(radius * 0.35, radius, length(delta));
    dry = min(dry, mix(1.0, 1.0 - uStamp[i].w, fall));
  }
  finalColor = vec4(dry, 0.0, 0.0, 1.0);
}
`;

const ADVECT = `
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uDry;
uniform sampler2D uHeight;
void main() {
  vec2 uv = vPixel / uCanvas;
  vec2 texel = vec2(1.0 / uCanvas.x, 0.0);
  float dry = texture(uDry, uv).r;
  float here = texture(uHeight, uv).b;
  float leftH = texture(uHeight, uv - texel).b;
  float rightH = texture(uHeight, uv + texel).b;
  if (here > leftH + 0.004) dry = min(dry, texture(uDry, uv - texel).r);
  if (here > rightH + 0.004) dry = min(dry, texture(uDry, uv + texel).r);
  finalColor = vec4(dry, 0.0, here, 1.0);
}
`;

/**
 * 512×256 terrain ink. Stamps come from Playfield contacts. Downhill (larger packed height)
 * takes the neighbour's darker value. Droplets must not call this.
 */
export class TerrainSeep {
  readonly width = SEEP_WIDTH;
  readonly height = SEEP_HEIGHT;
  private readonly pass: InkPass;
  private readonly heightTex: DataTexture;
  private readonly dryA: WebGLRenderTarget;
  private readonly dryB: WebGLRenderTarget;
  private readonly stampMat;
  private readonly advectMat;
  private readonly stamps: Vector4[];
  private front: WebGLRenderTarget;
  private disposed = false;

  constructor(renderer: WebGLRenderer, points: readonly TerrainPoint[]) {
    this.pass = new InkPass(renderer, SEEP_WIDTH, SEEP_HEIGHT);
    this.dryA = this.pass.target();
    this.dryB = this.pass.target();
    this.front = this.dryA;
    const baked = bakeHeightField(points, SEEP_WIDTH, SEEP_HEIGHT);
    this.heightTex = new DataTexture(baked, SEEP_WIDTH, SEEP_HEIGHT, RGBAFormat, UnsignedByteType);
    this.heightTex.colorSpace = NoColorSpace;
    this.heightTex.flipY = false;
    this.heightTex.magFilter = NearestFilter;
    this.heightTex.minFilter = NearestFilter;
    this.heightTex.generateMipmaps = false;
    this.heightTex.needsUpdate = true;
    this.stamps = Array.from({ length: SEEP_STAMP_LIMIT }, () => new Vector4());
    this.stampMat = this.pass.material(STAMP, {
      uDry: { value: this.dryA.texture },
      uStamp: { value: this.stamps },
      uCount: { value: 0 },
    });
    this.advectMat = this.pass.material(ADVECT, {
      uDry: { value: this.dryB.texture },
      uHeight: { value: this.heightTex },
    });
    const full = this.full();
    this.pass.fill(this.dryA, full, [1, 1, 1]);
    this.pass.fill(this.dryB, full, [1, 1, 1]);
  }

  get texture(): Texture { return this.front.texture; }

  update(stamps: readonly InkStamp[]): void {
    if (this.disposed) return;
    const count = Math.min(SEEP_STAMP_LIMIT, stamps.length);
    for (let i = 0; i < SEEP_STAMP_LIMIT; i++) {
      const stamp = stamps[i];
      const slot = this.stamps[i];
      if (!slot) continue;
      if (stamp && i < count) slot.set(stamp.u, stamp.v, stamp.radius, stamp.ink);
      else slot.set(0, 0, 0, 0);
    }
    const countSlot = this.stampMat.uniforms.uCount;
    if (countSlot) countSlot.value = count;
    const source = this.front === this.dryA ? this.dryA : this.dryB;
    const stamped = source === this.dryA ? this.dryB : this.dryA;
    const dry = this.stampMat.uniforms.uDry;
    if (dry) dry.value = source.texture;
    const full = this.full();
    this.pass.draw(this.stampMat, stamped, full);
    const advectDry = this.advectMat.uniforms.uDry;
    if (advectDry) advectDry.value = stamped.texture;
    const next = stamped === this.dryA ? this.dryB : this.dryA;
    this.pass.draw(this.advectMat, next, full);
    this.front = next;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stampMat.dispose();
    this.advectMat.dispose();
    this.dryA.dispose();
    this.dryB.dispose();
    this.heightTex.dispose();
    this.pass.dispose();
  }

  private full(): PixelRect {
    return { x: 0, y: 0, w: SEEP_WIDTH, h: SEEP_HEIGHT };
  }
}

/** A ribbon along the polyline. Z offset is visual thickness and is not a collider. */
export function terrainRibbonGeometry(points: readonly TerrainPoint[], bounds: TerrainBounds, half = 22): BufferGeometry {
  const geometry = new BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    if (!point || !prev || !next) continue;
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const lift = (i % 5) - 2;
    for (const side of [-1, 1]) {
      const y = point.y + ny * half * side;
      positions.push(point.x + nx * half * side, y, lift + side * 8);
      uvs.push((point.x - bounds.minX) / spanX, (y - bounds.minY) / spanY);
    }
  }
  const quads = Math.max(0, points.length - 1);
  for (let i = 0; i < quads; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}
