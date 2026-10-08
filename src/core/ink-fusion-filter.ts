import { Filter, GlProgram } from 'pixi.js';

const vertex = `
in vec2 aPosition;
out vec2 vTextureCoord;
uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
vec4 filterVertexPosition(void) {
  vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
  position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
  position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
  return vec4(position, 0.0, 1.0);
}
vec2 filterTextureCoord(void) {
  return aPosition * (uOutputFrame.zw * uInputSize.zw);
}
void main(void) {
  gl_Position = filterVertexPosition();
  vTextureCoord = filterTextureCoord();
}`;

const fragment = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main(void) {
  vec4 sampleColor = texture(uTexture, vTextureCoord);
  float opacity = smoothstep(0.12, 0.55, sampleColor.a);
  vec3 pigment = sampleColor.a > 0.001 ? sampleColor.rgb / sampleColor.a : vec3(0.0);
  finalColor = vec4(pigment * opacity, opacity);
}`;

export function createInkFusionFilter(): Filter {
  return new Filter({ glProgram: GlProgram.from({ vertex, fragment, name: 'ink-fusion' }), padding: 8 });
}
