/**
 * 只引入 WebGL 渲染需要的 three 源文件，避免打进 `three` 的整包入口。
 * 类从 `three/src` 再导出，类型与值是同一个声明。
 */
export { Float32BufferAttribute } from 'three/src/core/BufferAttribute.js';
export { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
export { Vector2 } from 'three/src/math/Vector2.js';
export { Vector3 } from 'three/src/math/Vector3.js';
export { Vector4 } from 'three/src/math/Vector4.js';
export { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js';
export { RawShaderMaterial } from 'three/src/materials/RawShaderMaterial.js';
export { Mesh } from 'three/src/objects/Mesh.js';
export { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
export { Scene } from 'three/src/scenes/Scene.js';
export { DataTexture } from 'three/src/textures/DataTexture.js';
export { WebGLRenderTarget } from 'three/src/renderers/WebGLRenderTarget.js';
export { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
export {
  GLSL3, LinearFilter, NoBlending, NoColorSpace, NormalBlending, RGBAFormat, SRGBColorSpace, UnsignedByteType,
} from 'three/src/constants.js';

export type { Blending, Texture } from 'three';
