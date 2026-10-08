import { Application } from 'pixi.js';
import { InkWash, ITEM_PRESETS, paintProp, type PropPaintingId, type PropPlacement } from '@inkgames/engine';

declare global {
  interface Window { __galleryInk?: boolean }
}

const cards = document.querySelector<HTMLDivElement>('#cards');
if (!cards) throw new Error('Missing gallery root');

const glyphs: Record<string, string> = {
  sword: '劍', blade: '刀', spear: '槍', bow: '弓', shield: '盾',
  'war-horse': '馬', banner: '旌', 'ink-bomb': '墨', 'water-brush': '水', boat: '舟',
};

/** Where each prop sits on its 480×480 thumbnail sheet: the same painting as the demo page, at scale 1. */
const THUMB: Readonly<Record<string, PropPlacement>> = {
  sword: { x: 230, y: 320 }, blade: { x: 200, y: 330 }, spear: { x: 230, y: 260 }, bow: { x: 220, y: 240 },
  shield: { x: 240, y: 250 }, 'war-horse': { x: 250, y: 250 }, banner: { x: 110, y: 250, pose: 1 },
  'ink-bomb': { x: 240, y: 300, scale: 1.25 }, 'water-brush': { x: 240, y: 280 }, boat: { x: 250, y: 250 },
};

for (const item of ITEM_PRESETS) {
  const anchor = document.createElement('a');
  anchor.className = 'effect-card';
  anchor.href = `./${item.id}/`;
  anchor.dataset.item = item.id;
  anchor.style.setProperty('--accent', `#${item.accent.toString(16).padStart(6, '0')}`);
  anchor.innerHTML = `<span class="card-number">${item.subtitle}</span><span class="card-art" aria-hidden="true"><span>${glyphs[item.id] ?? '墨'}</span></span><span class="card-bottom"><strong>${item.title}</strong><span class="card-arrow" aria-hidden="true">↗</span></span><span class="card-description">${item.description}</span><span class="card-tags">${item.actionLabel} · ${item.effects.join(' / ')}</span>`;
  cards.appendChild(anchor);
}

/** Paint each prop with its PROP_BRUSHES strokes on one offscreen canvas, then swap the glyph for the ink. */
async function paintThumbnails(): Promise<void> {
  const app = new Application();
  await app.init({ width: 480, height: 480, preference: 'webgl', autoStart: false, antialias: false, resolution: 1, backgroundAlpha: 0 });
  try {
    for (const item of ITEM_PRESETS) {
      const placement = THUMB[item.id];
      const art = cards?.querySelector<HTMLElement>(`[data-item="${item.id}"] .card-art`);
      if (!placement || !art) continue;
      const wash = new InkWash(app, { width: 480, height: 480, seed: 1234567890, transparent: true });
      for (const stroke of paintProp(item.id as PropPaintingId, placement)) wash.paint(stroke);
      const image = new Image();
      image.alt = '';
      image.src = await app.renderer.extract.base64(wash.view);
      art.replaceChildren(image);
      art.classList.add('painted');
      wash.dispose();
    }
  } finally {
    app.destroy(true);
  }
  window.__galleryInk = true;
}

// The glyphs stay if WebGL is unavailable.
paintThumbnails().catch(() => { window.__galleryInk = false; });
