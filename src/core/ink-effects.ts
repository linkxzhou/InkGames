import { BlurFilter, Container, Graphics, RenderTexture, Sprite, type Application } from 'pixi.js';
import { createInkFusionFilter } from './ink-fusion-filter';

export interface EffectPoint { readonly x: number; readonly y: number }

interface InkDrop extends EffectPoint { readonly size: number; readonly life: number; readonly color: number }
interface InkRing extends EffectPoint { readonly start: number; readonly color: number }
interface InkTrail { readonly from: EffectPoint; readonly to: EffectPoint; readonly start: number; readonly color: number; readonly width: number }

export class InkEffects {
  readonly layer = new Container();
  private readonly drops: InkDrop[] = [];
  private readonly rings: InkRing[] = [];
  private readonly trails: InkTrail[] = [];
  private readonly ink = new Graphics();
  private readonly ripples = new Graphics();
  private readonly strokes = new Graphics();
  private readonly texture: RenderTexture;
  private readonly sprite: Sprite;
  private frame = 0;
  private readonly blur = new BlurFilter({ strength: 6, quality: 3 });
  private readonly fusion = createInkFusionFilter();

  constructor(private readonly app: Application) {
    this.texture = RenderTexture.create({ width: 1280, height: 720, resolution: 0.5 });
    this.sprite = new Sprite(this.texture);
    this.sprite.width = 1280;
    this.sprite.height = 720;
    this.sprite.filters = [this.blur, this.fusion];
    this.layer.addChild(this.sprite, this.strokes, this.ripples);
  }

  splash(x: number, y: number, color = 0x27343a, count = 14): void {
    for (let i = 0; i < count; i++) {
      const angle = (i * 2.39996) + this.frame * 0.12;
      const distance = (8 + (i * 17) % 47);
      this.drops.push({ x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance * 0.65,
        size: 3 + (i * 7) % 10, life: this.frame, color });
    }
    if (this.drops.length > 260) this.drops.splice(0, this.drops.length - 260);
  }

  slash(from: EffectPoint, to: EffectPoint, color = 0x202e36, width = 12): void {
    this.trails.push({ from, to, color, width, start: this.frame });
    this.splash(to.x, to.y, color, 10);
  }

  ripple(x: number, y: number, color = 0x668993): void {
    this.rings.push({ x, y, color, start: this.frame });
  }

  update(): void {
    this.frame++;
    this.ink.clear();
    this.strokes.clear();
    this.ripples.clear();
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const drop = this.drops[i];
      const age = this.frame - drop.life;
      if (age > 65) { this.drops.splice(i, 1); continue; }
      this.ink.circle(drop.x, drop.y + age * 0.12, drop.size * (1 + age * 0.006)).fill({ color: drop.color, alpha: 0.56 * (1 - age / 65) });
    }
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const trail = this.trails[i];
      const age = this.frame - trail.start;
      if (age > 32) { this.trails.splice(i, 1); continue; }
      const opacity = (1 - age / 32) * 0.8;
      this.strokes.moveTo(trail.from.x, trail.from.y).quadraticCurveTo((trail.from.x + trail.to.x) / 2, Math.min(trail.from.y, trail.to.y) - 48, trail.to.x, trail.to.y)
        .stroke({ width: trail.width * (1 - age / 38), color: trail.color, alpha: opacity, cap: 'round' });
      this.strokes.moveTo(trail.from.x + 4, trail.from.y - 8).lineTo(trail.to.x - 8, trail.to.y - 5)
        .stroke({ width: 2, color: 0xf0e8d7, alpha: opacity * 0.8 });
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      const age = this.frame - ring.start;
      if (age > 52) { this.rings.splice(i, 1); continue; }
      this.ripples.ellipse(ring.x, ring.y, 12 + age * 2.2, 4 + age * 0.65)
        .stroke({ width: 2, color: ring.color, alpha: 0.54 * (1 - age / 52) });
    }
    this.app.renderer.render({ container: this.ink, target: this.texture, clear: true });
  }

  dispose(): void {
    this.sprite.filters = [];
    this.layer.destroy({ children: true, texture: false, textureSource: false });
    this.ink.destroy();
    this.texture.destroy(true);
    this.blur.destroy();
    this.fusion.destroy();
  }
}
