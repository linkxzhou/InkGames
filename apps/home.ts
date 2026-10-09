import { HISTORY_PROPS } from '@inkgames/engine';

const props = document.querySelector<HTMLElement>('#props');
if (!props) throw new Error('缺少道具卡');
HISTORY_PROPS.forEach((item, index) => {
  const card = document.createElement('a');
  card.className = 'effect-card';
  card.href = `./props/${item.id}/`;
  const number = document.createElement('span');
  number.className = 'card-number';
  number.textContent = String(index + 1).padStart(2, '0');
  const bottom = document.createElement('span');
  bottom.className = 'card-bottom';
  const strong = document.createElement('strong');
  strong.textContent = item.title;
  const arrow = document.createElement('span');
  arrow.className = 'card-arrow';
  arrow.textContent = '↗';
  bottom.append(strong, arrow);
  const description = document.createElement('span');
  description.className = 'card-description';
  description.textContent = `${item.blurb} ${item.scenes.join('、')}`;
  const tags = document.createElement('span');
  tags.className = 'card-tags';
  tags.textContent = item.physics;
  card.append(number, bottom, description, tags);
  props.append(card);
});
