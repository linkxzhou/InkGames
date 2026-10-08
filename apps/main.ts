import { ITEM_PRESETS } from '@inkgames/engine';

const cards = document.querySelector<HTMLDivElement>('#cards');
if (!cards) throw new Error('Missing gallery root');

const glyphs: Record<string, string> = {
  sword: '劍', blade: '刀', spear: '槍', bow: '弓', shield: '盾',
  'war-horse': '馬', banner: '旌', 'ink-bomb': '墨', 'water-brush': '水', boat: '舟',
};

for (const item of ITEM_PRESETS) {
  const anchor = document.createElement('a');
  anchor.className = 'effect-card';
  anchor.href = `./${item.id}/`;
  anchor.style.setProperty('--accent', `#${item.accent.toString(16).padStart(6, '0')}`);
  anchor.innerHTML = `<span class="card-number">${item.subtitle}</span><span class="card-art" aria-hidden="true"><span>${glyphs[item.id]}</span></span><span class="card-bottom"><strong>${item.title}</strong><span class="card-arrow" aria-hidden="true">↗</span></span><span class="card-description">${item.description}</span><span class="card-tags">${item.effects.join('  ·  ').toUpperCase()}</span>`;
  cards.appendChild(anchor);
}
