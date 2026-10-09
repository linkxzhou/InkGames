import {
  BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, Float32BufferAttribute, GLSL3, Group, Matrix4, Mesh, Points,
  RawShaderMaterial,
  type WebGLRenderer,
} from 'three';

export const DROPLET_CAP = 256;

/** How many new droplets fit under the cap. Callers must not exceed this. */
export function clampDropletCount(requested: number, alive: number): number {
  const room = DROPLET_CAP - Math.max(0, Math.floor(alive));
  if (room <= 0 || requested <= 0) return 0;
  return Math.min(Math.floor(requested), room);
}

export interface BambooPose {
  readonly x: number;
  readonly y: number;
  readonly angle?: number;
}

interface BambooSync {
  readonly intact: boolean;
  readonly whole?: BambooPose;
  readonly root?: BambooPose;
  readonly upper?: BambooPose;
}

const VERT = `
precision highp float;
in vec3 position;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
uniform float uTime;
uniform float uAmp;
uniform float uHalf;
out float vAlong;
void main() {
  float along = clamp((uHalf - position.y) / max(uHalf * 2.0, 0.001), 0.0, 1.0);
  vAlong = along;
  vec3 displaced = position;
  displaced.x += sin(uTime * 1.6 + position.y * 0.01) * uAmp * along * along;
  gl_Position = uProj * uView * uModel * vec4(displaced, 1.0);
}
`;

const FILL = `
precision highp float;
in float vAlong;
out vec4 finalColor;
void main() {
  float node = smoothstep(0.08, 0.0, abs(fract(vAlong * 5.0) - 0.5) - 0.42);
  vec3 culm = mix(vec3(0.16, 0.20, 0.11), vec3(0.08, 0.09, 0.07), node);
  finalColor = vec4(culm, 1.0);
}
`;

const POINT_VERT = `
precision highp float;
in vec3 position;
in float life;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
void main() {
  gl_Position = uProj * uView * uModel * vec4(position, 1.0);
  gl_PointSize = life > 0.0 ? 4.0 : 0.0;
}
`;

const POINT_FILL = `
precision highp float;
out vec4 finalColor;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  if (dot(p, p) > 1.0) discard;
  finalColor = vec4(0.06, 0.06, 0.07, 1.0);
}
`;

/**
 * Display stalk. Sway is a vertex sine and is not written back to Matter.
 * A cut hides the whole stalk, shows a static root plus the dynamic upper body,
 * and tears off at most DROPLET_CAP ink points. Those points never stamp the ground.
 */
export class BambooView {
  readonly object = new Group();
  private readonly height: number;
  private readonly intactMesh: Mesh;
  private readonly dropletPositions = new Float32Array(DROPLET_CAP * 3);
  private readonly dropletLife = new Float32Array(DROPLET_CAP);
  private readonly velocities = new Float32Array(DROPLET_CAP * 3);
  private readonly lifeAttr: BufferAttribute;
  private readonly posAttr: BufferAttribute;
  private rootMesh: Mesh | undefined;
  private upperMesh: Mesh | undefined;
  private alive = 0;
  private torn = false;
  private time = 0;
  private disposed = false;

  constructor(height: number) {
    this.height = height;
    this.intactMesh = new Mesh(stalkGeometry(height, 18), swayMaterial(height / 2, 7));
    this.intactMesh.frustumCulled = false;
    this.object.add(this.intactMesh);
    const geo = new BufferGeometry();
    this.posAttr = new BufferAttribute(this.dropletPositions, 3);
    this.lifeAttr = new BufferAttribute(this.dropletLife, 1);
    this.posAttr.setUsage(DynamicDrawUsage);
    this.lifeAttr.setUsage(DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr);
    geo.setAttribute('life', this.lifeAttr);
    const points = new Points(geo, pointMaterial());
    points.frustumCulled = false;
    points.renderOrder = 6;
    this.object.add(points);
  }

  sync(state: BambooSync, dt: number, seed: number): void {
    if (this.disposed) return;
    this.time += dt;
    if (state.intact && state.whole) {
      this.intactMesh.visible = true;
      this.intactMesh.position.set(state.whole.x, state.whole.y, 2);
      this.intactMesh.rotation.set(0, 0, 0);
      this.setTime(this.intactMesh, this.time);
    } else if (!state.intact && !this.torn) {
      this.tear(state, seed);
    }
    if (!state.intact && this.rootMesh && state.root) {
      this.rootMesh.position.set(state.root.x, state.root.y, 2);
      this.setTime(this.rootMesh, this.time);
    }
    if (!state.intact && this.upperMesh && state.upper) {
      this.upperMesh.position.set(state.upper.x, state.upper.y, 4);
      this.upperMesh.rotation.set(0, 0, state.upper.angle ?? 0);
      this.setTime(this.upperMesh, this.time);
    }
    this.stepDroplets(dt);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    disposeMesh(this.intactMesh);
    if (this.rootMesh) disposeMesh(this.rootMesh);
    if (this.upperMesh) disposeMesh(this.upperMesh);
    const points = this.object.children.find(child => child instanceof Points);
    if (points instanceof Points) {
      points.geometry.dispose();
      const material = points.material;
      if (material instanceof RawShaderMaterial) material.dispose();
    }
  }

  private tear(state: BambooSync, seed: number): void {
    this.torn = true;
    this.intactMesh.visible = false;
    const rootH = this.height * 0.35;
    const upperH = this.height - rootH;
    this.rootMesh = new Mesh(stalkGeometry(rootH, 18), swayMaterial(rootH / 2, 1.2));
    this.upperMesh = new Mesh(stalkGeometry(upperH, 16), swayMaterial(upperH / 2, 0));
    this.rootMesh.frustumCulled = false;
    this.upperMesh.frustumCulled = false;
    this.object.add(this.rootMesh, this.upperMesh);
    const origin = state.upper ?? state.root ?? { x: this.intactMesh.position.x, y: this.intactMesh.position.y };
    this.spawn(origin.x, origin.y, seed, 180);
  }

  private spawn(x: number, y: number, seed: number, requested: number): void {
    const count = clampDropletCount(requested, this.alive);
    let state = (seed || 1) >>> 0;
    const next = (): number => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const index = this.alive + i;
      const base = index * 3;
      this.dropletPositions[base] = x + (next() - 0.5) * 14;
      this.dropletPositions[base + 1] = y + (next() - 0.5) * 20;
      this.dropletPositions[base + 2] = 12 + next() * 28;
      this.velocities[base] = (next() - 0.5) * 6;
      this.velocities[base + 1] = -next() * 5;
      this.velocities[base + 2] = (next() - 0.5) * 2;
      this.dropletLife[index] = 0.6 + next() * 0.8;
    }
    this.alive += count;
    this.posAttr.needsUpdate = true;
    this.lifeAttr.needsUpdate = true;
  }

  private stepDroplets(dt: number): void {
    const step = Math.min(Math.max(dt, 0), 0.05);
    let moving = false;
    for (let i = 0; i < this.alive; i++) {
      const life = this.dropletLife[i] ?? 0;
      if (life <= 0) continue;
      moving = true;
      const base = i * 3;
      const vz = this.velocities[base + 2] ?? 0;
      this.velocities[base + 1] = (this.velocities[base + 1] ?? 0) + 14 * step;
      this.dropletPositions[base] = (this.dropletPositions[base] ?? 0) + (this.velocities[base] ?? 0) * step * 60;
      this.dropletPositions[base + 1] = (this.dropletPositions[base + 1] ?? 0) + (this.velocities[base + 1] ?? 0) * step * 60;
      this.dropletPositions[base + 2] = (this.dropletPositions[base + 2] ?? 0) + vz * step * 60;
      this.dropletLife[i] = life - step;
    }
    if (moving) {
      this.posAttr.needsUpdate = true;
      this.lifeAttr.needsUpdate = true;
    }
  }

  private setTime(mesh: Mesh, time: number): void {
    const material = mesh.material;
    if (!(material instanceof RawShaderMaterial)) return;
    const slot = material.uniforms.uTime;
    if (slot && typeof slot.value === 'number') slot.value = time;
  }
}

function stalkGeometry(height: number, width: number): BufferGeometry {
  const segments = 8;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const y = height / 2 - (height * i) / segments;
    positions.push(-width / 2, y, 0, width / 2, y, 0);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  return geometry;
}

function swayMaterial(half: number, amp: number): RawShaderMaterial {
  const material = new RawShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: VERT,
    fragmentShader: FILL,
    uniforms: {
      uModel: { value: new Matrix4() },
      uView: { value: new Matrix4() },
      uProj: { value: new Matrix4() },
      uTime: { value: 0 },
      uAmp: { value: amp },
      uHalf: { value: half },
    },
    depthTest: true,
    side: DoubleSide,
    toneMapped: false,
  });
  bindMatrices(material);
  return material;
}

function pointMaterial(): RawShaderMaterial {
  const material = new RawShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FILL,
    uniforms: {
      uModel: { value: new Matrix4() },
      uView: { value: new Matrix4() },
      uProj: { value: new Matrix4() },
    },
    depthTest: true,
    toneMapped: false,
  });
  bindMatrices(material);
  return material;
}

function bindMatrices(material: RawShaderMaterial): void {
  material.onBeforeRender = (_renderer: WebGLRenderer, _scene, camera, _geometry, object) => {
    const model = material.uniforms.uModel;
    const view = material.uniforms.uView;
    const proj = material.uniforms.uProj;
    if (model?.value instanceof Matrix4) model.value.copy(object.matrixWorld);
    if (view?.value instanceof Matrix4) view.value.copy(camera.matrixWorldInverse);
    if (proj?.value instanceof Matrix4) proj.value.copy(camera.projectionMatrix);
  };
}

function disposeMesh(mesh: Mesh): void {
  mesh.geometry.dispose();
  const material = mesh.material;
  if (material instanceof RawShaderMaterial) material.dispose();
}
