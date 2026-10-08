import { inkCos, inkSin, P5Noise, P5Random, TWO_PI } from './ink-random';

/**
 * inkEngine paper: generatePaperTexture(40, 20, 15, 0.2) / createPaperStampTile (NAME-MAP _j9/_j10)
 * drawn with the same Canvas 2D calls p5's P2D renderer makes, then paperTextureBuffer's
 * fill(background × 1.1) with MULTIPLY. Ported with attribution under the owner-stated inkField
 * authorization. Browser only: it needs document.createElement('canvas').
 */
export function inkPaperPixels(width: number, height: number, background: readonly [number, number, number], seed: number): Uint8Array {
  const tileSize = 40;
  const spacing = 20;
  const jitter = 15;
  const paperW = Math.min(width, 2000);
  const paperH = Math.min(height, 2000);
  const rng = new P5Random(seed);
  const noise = new P5Noise(seed);

  const tile = document.createElement('canvas');
  tile.width = tileSize;
  tile.height = tileSize;
  const tileCtx = tile.getContext('2d');
  if (!tileCtx) throw new Error('Canvas 2D unavailable for paper texture');
  tileCtx.translate(tileSize / 2, tileSize / 2);
  for (let i = 0; i < 100; i++) {
    const level = Math.round(fifthRoot(0.5 + rng.random(0, 1) * 0.5) * 255);
    const radius = rng.random() * tileSize * 0.5;
    const angle = rng.random() * TWO_PI;
    // p5 P2D point(): a filled arc of radius strokeWeight / 2 in the stroke colour.
    tileCtx.fillStyle = `rgb(${level},${level},${level})`;
    tileCtx.beginPath();
    tileCtx.arc(radius * inkCos(angle), radius * inkSin(angle), 0.75, 0, TWO_PI, false);
    tileCtx.fill();
  }

  const paper = document.createElement('canvas');
  paper.width = paperW;
  paper.height = paperH;
  const paperCtx = paper.getContext('2d', { willReadFrequently: true });
  if (!paperCtx) throw new Error('Canvas 2D unavailable for paper texture');
  for (let i = -tileSize; i < paperW + tileSize; i += paperW / 500) {
    for (let j = -tileSize; j < paperH + tileSize; j += spacing) {
      paperCtx.drawImage(tile, i, j + (noise.noise(i * 0.1, j * 1.0) - 0.5) * jitter);
    }
  }
  const fibre = paperCtx.getImageData(0, 0, paperW, paperH).data;

  const r = Math.min(255, background[0] * 1.1);
  const g = Math.min(255, background[1] * 1.1);
  const b = Math.min(255, background[2] * 1.1);
  const out = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    const sy = Math.min(paperH - 1, Math.floor((y * paperH) / height));
    for (let x = 0; x < width; x++) {
      const sx = Math.min(paperW - 1, Math.floor((x * paperW) / width));
      const s = (sy * paperW + sx) * 4;
      const alpha = (fibre[s + 3] ?? 0) / 255;
      // MULTIPLY with a premultiplied source: dst · (1 - a · (1 - gray)).
      const k = 1 - alpha * (1 - (fibre[s] ?? 255) / 255);
      const o = (y * width + x) * 4;
      out[o] = Math.round(r * k);
      out[o + 1] = Math.round(g * k);
      out[o + 2] = Math.round(b * k);
      out[o + 3] = 255;
    }
  }
  return out;
}

/** x^(1/5) by Newton's method; the paper's pow(level, 0.2) without Math.pow. */
function fifthRoot(x: number): number {
  let y = 1 - (1 - x) / 5;
  for (let i = 0; i < 30; i++) {
    const y4 = y * y * y * y;
    const next = y - (y4 * y - x) / (5 * y4);
    if (Math.abs(next - y) < 1e-12) return next;
    y = next;
  }
  return y;
}
