import type { RawShaderMaterial } from './three-gl';
import type { InkPaintSheet } from './ink-paint';
import { set1, set2, tex, vec2 } from './ink-paint';

const WASH = `
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uSource;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uTypeMode;
void main() {
  vec4 color = texture(uSource, vec2(vPixel.x / uCanvas.x, vPixel.y / uCanvas.y));
  float wipe = smoothstep(uRadius, uRadius * 0.35, length(vPixel - uCenter));
  if (uTypeMode > 0.5) finalColor = wipe > 0.6 ? vec4(0.0, 0.0, 0.0, 1.0) : color;
  else finalColor = vec4(mix(color.rgb, vec3(1.0), wipe), 1.0);
}
`;

/** 漫水：把一块已提交的墨往纸色洗淡，并清掉类型图中心。 */
export class InkWash {
  private readonly color: RawShaderMaterial;
  private readonly type: RawShaderMaterial;
  private disposed = false;

  constructor(private readonly sheet: InkPaintSheet) {
    this.color = sheet.pass.material(WASH, {
      uSource: tex(sheet.final.texture), uCenter: vec2(0, 0), uRadius: { value: 24 }, uTypeMode: { value: 0 },
    });
    this.type = sheet.pass.material(WASH, {
      uSource: tex(sheet.typeMap.texture), uCenter: vec2(0, 0), uRadius: { value: 24 }, uTypeMode: { value: 1 },
    });
  }

  wash(x: number, y: number, radius: number): void {
    if (this.disposed || this.sheet.disposed) return;
    const rect = this.sheet.clampRect({
      x: Math.floor(x - radius - 2), y: Math.floor(y - radius - 2),
      w: Math.ceil(radius * 2 + 4), h: Math.ceil(radius * 2 + 4),
    });
    if (!rect) return;
    set2(this.color, 'uCenter', x, y);
    set2(this.type, 'uCenter', x, y);
    set1(this.color, 'uRadius', Math.max(1, radius));
    set1(this.type, 'uRadius', Math.max(1, radius));
    this.sheet.pass.draw(this.color, this.sheet.scratch, rect);
    this.sheet.pass.copy(this.sheet.scratch, this.sheet.final, rect);
    this.sheet.pass.draw(this.type, this.sheet.scratch, rect);
    this.sheet.pass.copy(this.sheet.scratch, this.sheet.typeMap, rect);
    this.sheet.pass.draw(this.sheet.composite, this.sheet.display, rect);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.color.dispose();
    this.type.dispose();
  }
}
