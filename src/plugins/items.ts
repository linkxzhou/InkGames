export type ItemAction = 'swing' | 'thrust' | 'projectile' | 'guard' | 'gallop' | 'wind' | 'blast' | 'erase' | 'wake';

export interface ItemPreset {
  readonly id: string;
  readonly version: '1.0.0';
  readonly action: ItemAction;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly effects: readonly string[];
  readonly accent: number;
  readonly actionLabel: string;
  readonly hint: string;
}

export const ITEM_PRESETS: readonly ItemPreset[] = [
  { id: 'sword', version: '1.0.0', action: 'swing', title: '游锋 · 剑', subtitle: 'SWORD / 01', description: '拖动画一道飞白，或挥剑去砍右侧木桩。碰到桩才溅墨。', effects: ['slash', 'afterimage', 'splash'], accent: 0x926844, actionLabel: '挥剑', hint: '拖动笔锋写墨。空格挥剑。木桩被扫到才有溅墨。A/D 移动，W 跳。' },
  { id: 'blade', version: '1.0.0', action: 'swing', title: '断潮 · 刀', subtitle: 'BLADE / 02', description: '宽刃扫过两团色墨，重叠的地方更暗的颜色压住浅的。', effects: ['slash', 'fusion', 'splash'], accent: 0x994b3b, actionLabel: '挥刀', hint: '拖动是湿笔。空格让刀穿过青墨和朱墨，看它们叠在一起。' },
  { id: 'spear', version: '1.0.0', action: 'thrust', title: '破阵 · 枪', subtitle: 'SPEAR / 03', description: '直线刺出。每个靶点只在第一次被穿过时记一笔。', effects: ['slash', 'splash'], accent: 0x827a5d, actionLabel: '刺击', hint: '点击选定落点。同一靶点刺中一次之后不再计数。' },
  { id: 'bow', version: '1.0.0', action: 'projectile', title: '鸣镝 · 弓', subtitle: 'BOW / 04', description: '箭飞出去之后，要等它撞上靶或地面，落点才晕开。', effects: ['projectile', 'splash'], accent: 0x5e756d, actionLabel: '放箭', hint: '点击是瞄准点。空中的箭本身不带墨晕。' },
  { id: 'shield', version: '1.0.0', action: 'guard', title: '玄甲 · 盾', subtitle: 'SHIELD / 05', description: '右侧会有墨点袭来。只在它贴身时格挡，才会出现墨环。', effects: ['ripple', 'splash'], accent: 0x746a6b, actionLabel: '格挡', hint: '等来袭靠近再按空格。太早或没有来袭，都不会画墨环。' },
  { id: 'war-horse', version: '1.0.0', action: 'gallop', title: '踏烟 · 战马', subtitle: 'WAR HORSE / 06', description: '跑起来才连续落下蹄印；停下就不再添新的。', effects: ['dust', 'flow'], accent: 0x977251, actionLabel: '纵马', hint: '空格或按钮切换奔跑。蹄印留在纸上，尘点跟着步频。' },
  { id: 'banner', version: '1.0.0', action: 'wind', title: '风旌 · 旗', subtitle: 'BANNER / 07', description: '风向在东、西、停之间切换，旗面和空中墨丝一起偏。', effects: ['flow', 'cloth'], accent: 0x8c634e, actionLabel: '变风', hint: '每按一次，风从东到西再到停。旗是画面上的布，墨丝写进纸里。' },
  { id: 'ink-bomb', version: '1.0.0', action: 'blast', title: '泼墨 · 弹', subtitle: 'INK BOMB / 08', description: '抛出去的墨团要落地才炸开，几种颜色叠在同一处。', effects: ['fusion', 'splash', 'ripple'], accent: 0x595f72, actionLabel: '投弹', hint: '点击选落点。命中实体之后才会泼开，未命中不会伪造墨迹。' },
  { id: 'water-brush', version: '1.0.0', action: 'erase', title: '洗锋 · 水刷', subtitle: 'WATER BRUSH / 09', description: '水刷擦断可擦的墨桥时，碰撞一起断开。锁住的桥擦不掉。', effects: ['erosion', 'ripple'], accent: 0x678890, actionLabel: '水刷', hint: '在左侧墨桥上拖动。人可以走上去，桥断了会掉下去。右侧青桥是锁住的。' },
  { id: 'boat', version: '1.0.0', action: 'wake', title: '渡川 · 舟', subtitle: 'BOAT / 10', description: '舟走动时，船尾留下会慢慢洇开的水墨和涟漪。', effects: ['ripple', 'flow', 'afterimage'], accent: 0x637e81, actionLabel: '行舟', hint: '空格让舟走或停。停住之后不再添新的尾迹。' },
];

const SUPPORTED_EFFECTS = new Set([
  'slash', 'afterimage', 'splash', 'fusion', 'projectile', 'ripple', 'dust', 'flow', 'cloth', 'erosion',
]);

export function validateItemPreset(item: ItemPreset): void {
  if (!item.id || !/^[a-z]+(?:-[a-z]+)*$/.test(item.id)) throw new Error('Invalid item id');
  if (item.version !== '1.0.0') throw new Error(`Unsupported item version: ${item.version}`);
  if (!Number.isInteger(item.accent) || item.accent < 0 || item.accent > 0xffffff) throw new Error('Invalid item accent');
  if (!item.effects.length) throw new Error('Item requires at least one effect');
  const used = new Set<string>();
  for (const effect of item.effects) {
    if (!SUPPORTED_EFFECTS.has(effect)) throw new Error(`Unknown effect: ${effect}`);
    if (used.has(effect)) throw new Error(`Duplicate effect: ${effect}`);
    used.add(effect);
  }
  const required: Partial<Record<ItemAction, string>> = {
    swing: 'slash', thrust: 'slash', projectile: 'projectile', blast: 'fusion',
    guard: 'ripple', gallop: 'dust', wind: 'flow', erase: 'erosion', wake: 'ripple',
  };
  const effect = required[item.action];
  if (!effect || !used.has(effect)) throw new Error(`Missing ${item.action} effect: ${effect}`);
}

export function getItemPreset(id: string): ItemPreset {
  const preset = ITEM_PRESETS.find(item => item.id === id);
  if (!preset) throw new Error(`Unknown item: ${id}`);
  validateItemPreset(preset);
  return preset;
}
