import {
  BackSide, BufferGeometry, DoubleSide, Float32BufferAttribute, GLSL3, Group, Mesh, ShaderMaterial,
} from 'three';
import { CLASSIC_NOISE_GLSL } from './classic-noise';

/** Closer than the default distance thickens the outline, farther thins it. Clamped so a zoom cannot erase the stroke. */
export function cunOutlineWidth(baseDistance: number, distance: number): number {
  const safe = distance > 1 ? distance : 1;
  const width = (3.4 * baseDistance) / safe;
  if (width < 1.2) return 1.2;
  if (width > 7) return 7;
  return width;
}

export type CunKind = 'hemp' | 'axe';

export interface CunRock {
  readonly object: Group;
  setOutlineWidth(width: number): void;
  dispose(): void;
}

const VERT = `
uniform float uWidth;
uniform float uShell;
out vec3 vWorld;
${CLASSIC_NOISE_GLSL}
void main() {
  float bristle = 0.65 + 0.35 * cnoise(position.xy * 0.18);
  vec3 displaced = position + normal * uWidth * uShell * bristle;
  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FILL = `
in vec3 vWorld;
out vec4 finalColor;
uniform float uKind;
${CLASSIC_NOISE_GLSL}
void main() {
  vec2 p = vWorld.xy;
  float hemp = smoothstep(0.16, 0.02, abs(fract(p.x * 0.045 + cnoise(p * 0.012)) - 0.5));
  float axe = smoothstep(0.07, 0.0, abs(fract(dot(p, vec2(0.09, 0.07))) - 0.5));
  float dash = step(0.42, fract(dot(p, vec2(-0.05, 0.12))));
  float marks = uKind < 0.5 ? hemp : axe * dash;
  vec3 paper = vec3(0.62, 0.58, 0.50);
  vec3 ink = vec3(0.10, 0.09, 0.08);
  finalColor = vec4(mix(paper, ink, clamp(marks, 0.0, 1.0)), 1.0);
}
`;

const EDGE = `
out vec4 finalColor;
void main() { finalColor = vec4(0.07, 0.06, 0.05, 1.0); }
`;

const RING: readonly number[] = [
  1, 0, 0.8660254, 0.5, 0.5, 0.8660254, 0, 1, -0.5, 0.8660254, -0.8660254, 0.5,
  -1, 0, -0.8660254, -0.5, -0.5, -0.8660254, 0, -1, 0.5, -0.8660254, 0.8660254, -0.5,
];

/** Hull extrusion, not OutlinePass. Hemp runs downslope; axe is a short diagonal hatch. */
export function createCunRock(kind: CunKind, seed: number, radius: number): CunRock {
  const geometry = rockGeometry(seed, radius);
  const shell = meshMaterial(EDGE, 1);
  const fill = meshMaterial(FILL, 0);
  shell.side = BackSide;
  shell.depthWrite = false;
  fill.side = DoubleSide;
  const kindSlot = fill.uniforms.uKind;
  if (kindSlot) kindSlot.value = kind === 'axe' ? 1 : 0;
  const outline = new Mesh(geometry, shell);
  const body = new Mesh(geometry, fill);
  outline.renderOrder = 2;
  body.renderOrder = 3;
  outline.frustumCulled = false;
  body.frustumCulled = false;
  const object = new Group();
  object.add(outline, body);
  return {
    object,
    setOutlineWidth(width: number) {
      const shellWidth = shell.uniforms.uWidth;
      const fillWidth = fill.uniforms.uWidth;
      if (shellWidth) shellWidth.value = width;
      if (fillWidth) fillWidth.value = width;
    },
    dispose() {
      geometry.dispose();
      shell.dispose();
      fill.dispose();
    },
  };
}

function meshMaterial(fragment: string, shell: number): ShaderMaterial {
  return new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: VERT,
    fragmentShader: fragment,
    uniforms: {
      uWidth: { value: 3.4 },
      uShell: { value: shell },
      uKind: { value: 0 },
    },
    depthTest: true,
    toneMapped: false,
  });
}

function rockGeometry(seed: number, radius: number): BufferGeometry {
  const count = 12;
  const frontZ = 10;
  const backZ = -26;
  const ring: Array<{ x: number; y: number }> = [];
  let state = seed >>> 0;
  for (let i = 0; i < count; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const jitter = 0.78 + (state % 1000) / 2200;
    const ux = RING[i * 2] ?? 1;
    const uy = RING[i * 2 + 1] ?? 0;
    ring.push({ x: ux * radius * jitter, y: uy * radius * jitter * 0.78 });
  }
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  for (const point of ring) {
    positions.push(point.x, point.y, frontZ);
    normals.push(0, 0, 1);
  }
  for (const point of ring) {
    positions.push(point.x, point.y, backZ);
    normals.push(0, 0, -1);
  }
  const frontCenter = positions.length / 3;
  positions.push(0, 0, frontZ);
  normals.push(0, 0, 1);
  const backCenter = positions.length / 3;
  positions.push(0, 0, backZ);
  normals.push(0, 0, -1);
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    indices.push(frontCenter, i, next);
    indices.push(backCenter, count + next, count + i);
    const a = ring[i];
    const b = ring[next];
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dy / length;
    const ny = -dx / length;
    const base = positions.length / 3;
    positions.push(a.x, a.y, frontZ, b.x, b.y, frontZ, b.x, b.y, backZ, a.x, a.y, backZ);
    for (let k = 0; k < 4; k++) normals.push(nx, ny, 0);
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}
