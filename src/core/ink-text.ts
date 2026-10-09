import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three';
import type { ActiveText } from './cutscene-player';

/**
 * Subtitles and titles on a canvas texture. No text library: decision 16.
 * The canvas is y-down, matching the sheet.
 */
export class InkText {
  readonly canvas: HTMLCanvasElement;
  readonly texture: CanvasTexture;
  private vignette = 0;
  private disposed = false;

  constructor(readonly width: number, readonly height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.flipY = false;
    this.texture.minFilter = LinearFilter;
    this.texture.magFilter = LinearFilter;
    this.texture.generateMipmaps = false;
  }

  setVignette(amount: number): void {
    this.vignette = amount < 0 ? 0 : amount > 1 ? 1 : amount;
  }

  render(texts: readonly ActiveText[], subtitles: boolean): void {
    if (this.disposed) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.vignette > 0) {
      const g = ctx.createRadialGradient(this.width / 2, this.height / 2, this.height * 0.2, this.width / 2, this.height / 2, this.height * 0.72);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, `rgba(20,16,12,${this.vignette})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.width, this.height);
    }
    for (const item of texts) {
      if (!subtitles && (item.cue.kind === 'subtitle' || item.cue.kind === 'caption')) continue;
      drawCue(ctx, item, this.width, this.height);
    }
    this.texture.needsUpdate = true;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.texture.dispose();
  }
}

function drawCue(ctx: CanvasRenderingContext2D, item: ActiveText, width: number, height: number): void {
  const cue = item.cue;
  const vertical = cue.orientation === 'vertical' || cue.kind === 'title';
  ctx.save();
  ctx.fillStyle = cue.kind === 'seal' ? '#8c2f2f' : '#1a1a1a';
  ctx.textBaseline = 'top';
  if (cue.kind === 'subtitle') {
    ctx.font = '28px "Songti SC", "Noto Serif SC", serif';
    const pad = 18;
    const textWidth = Math.min(width - 80, ctx.measureText(item.text).width);
    const x = (width - textWidth) / 2;
    const y = height - 78;
    ctx.fillStyle = 'rgba(246, 240, 228, 0.82)';
    ctx.fillRect(x - pad, y - 10, textWidth + pad * 2, 52);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(item.text, x, y);
    ctx.restore();
    return;
  }
  const size = cue.kind === 'title' ? 54 : cue.kind === 'seal' ? 22 : 28;
  ctx.font = `${cue.kind === 'title' ? 600 : 400} ${size}px "Songti SC", "Noto Serif SC", serif`;
  const x = cue.x ?? 80;
  const y = cue.y ?? 80;
  if (cue.kind === 'seal') {
    ctx.beginPath();
    ctx.arc(x, y, 46, 0, Math.PI * 2);
    ctx.strokeStyle = '#8c2f2f';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#8c2f2f';
    const chars = [...item.text];
    chars.forEach((ch, i) => ctx.fillText(ch, x - 11, y - 28 + i * 24));
    ctx.restore();
    return;
  }
  if (vertical) {
    const chars = [...item.text];
    chars.forEach((ch, i) => ctx.fillText(ch, x, y + i * (size + 6)));
  } else {
    ctx.fillText(item.text, x, y);
  }
  ctx.restore();
}
