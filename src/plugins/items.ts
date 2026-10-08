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
}

export const ITEM_PRESETS: readonly ItemPreset[] = [
  { id: 'sword', version: '1.0.0', action: 'swing', title: '游锋 · 剑', subtitle: 'SWORD / 01', description: '墨锋随剑势延伸，留下短暂的飞白残影。', effects: ['slash', 'afterimage', 'splash'], accent: 0x926844 },
  { id: 'blade', version: '1.0.0', action: 'swing', title: '断潮 · 刀', subtitle: 'BLADE / 02', description: '宽刃破开湿墨，刀势落处墨色飞溅。', effects: ['slash', 'fusion', 'splash'], accent: 0x994b3b },
  { id: 'spear', version: '1.0.0', action: 'thrust', title: '破阵 · 枪', subtitle: 'SPEAR / 03', description: '一点寒锋穿透烟墨，留下一线墨痕。', effects: ['slash', 'splash'], accent: 0x827a5d },
  { id: 'bow', version: '1.0.0', action: 'projectile', title: '鸣镝 · 弓', subtitle: 'BOW / 04', description: '弦动箭出，落点晕开如墨滴。', effects: ['projectile', 'splash'], accent: 0x5e756d },
  { id: 'shield', version: '1.0.0', action: 'guard', title: '玄甲 · 盾', subtitle: 'SHIELD / 05', description: '格挡一瞬，层层墨环向外震荡。', effects: ['ripple', 'splash'], accent: 0x746a6b },
  { id: 'war-horse', version: '1.0.0', action: 'gallop', title: '踏烟 · 战马', subtitle: 'WAR HORSE / 06', description: '疾驰踏出蹄印，扬起尘雾和流动的墨气。', effects: ['dust', 'flow'], accent: 0x977251 },
  { id: 'banner', version: '1.0.0', action: 'wind', title: '风旌 · 旗', subtitle: 'BANNER / 07', description: '一面旌旗，带动远山与空气中的流场。', effects: ['flow', 'cloth'], accent: 0x8c634e },
  { id: 'ink-bomb', version: '1.0.0', action: 'blast', title: '泼墨 · 弹', subtitle: 'INK BOMB / 08', description: '墨团坠落相融，层层破墨向四方散去。', effects: ['fusion', 'splash', 'ripple'], accent: 0x595f72 },
  { id: 'water-brush', version: '1.0.0', action: 'erase', title: '洗锋 · 水刷', subtitle: 'WATER BRUSH / 09', description: '水纹掠过桥面，墨迹与碰撞一并消散。', effects: ['erosion', 'ripple'], accent: 0x678890 },
  { id: 'boat', version: '1.0.0', action: 'wake', title: '渡川 · 舟', subtitle: 'BOAT / 10', description: '一叶轻舟划开河面，涟漪沿船尾缓缓扩散。', effects: ['ripple', 'flow', 'afterimage'], accent: 0x637e81 },
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
