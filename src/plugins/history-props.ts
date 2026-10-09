import { paintProp, type PropPlacement, type PropStroke } from './prop-paintings';
import { paintHistoryShape, type HistoryPaintingId } from './history-paintings';
import type { PropPaintingId } from './prop-brushes';

export type HistoryPropId =
  | 'sword' | 'dagger' | 'slip' | 'ding' | 'chariot' | 'crossbow' | 'warship' | 'water'
  | 'beacon' | 'wall' | 'horse' | 'banner' | 'seal' | 'inkstone' | 'lantern' | 'cannon'
  | 'treasure' | 'shield' | 'spear' | 'blade';

export type PropPhysics = 'cut' | 'fall' | 'burn' | 'flow' | 'move' | 'wind' | 'guard' | 'projectile';

export interface HistoryProp {
  readonly id: HistoryPropId;
  readonly title: string;
  readonly scenes: readonly string[];
  readonly physics: PropPhysics;
  readonly action: string;
  readonly blurb: string;
}

/** Twenty props the history chapters actually call for. Scene ids are plan/11 outline ids. */
export const HISTORY_PROPS: readonly HistoryProp[] = [
  { id: 'sword', title: '剑', scenes: ['05-09 易水寒', '07-01 鸿门宴'], physics: 'cut', action: '挥剑', blurb: '长锋可砍断旁边的木桩。' },
  { id: 'dagger', title: '匕首与地图', scenes: ['05-09 图穷匕见'], physics: 'fall', action: '图穷', blurb: '卷轴松开后匕首落下。' },
  { id: 'slip', title: '竹简', scenes: ['04-05 问鼎对答'], physics: 'fall', action: '散简', blurb: '捆绳松开，简片落下。' },
  { id: 'ding', title: '青铜鼎', scenes: ['04-05 问鼎'], physics: 'fall', action: '落鼎', blurb: '鼎身很重，松手就落到地上。' },
  { id: 'chariot', title: '战车', scenes: ['04 春秋车战'], physics: 'move', action: '驱车', blurb: '两轮着地，向前滚一段。' },
  { id: 'crossbow', title: '弩', scenes: ['05-06 即墨守城'], physics: 'projectile', action: '发弩', blurb: '弩箭飞出，撞到地面才停。' },
  { id: 'warship', title: '战船', scenes: ['09-05 赤壁之战'], physics: 'flow', action: '行船', blurb: '船体走在水墨水面上。' },
  { id: 'water', title: '水', scenes: ['00-01 洪水', '09-05 赤壁'], physics: 'flow', action: '推流', blurb: '整面是水墨水，再推一次才继续洇。' },
  { id: 'beacon', title: '烽火', scenes: ['03-04 烽火'], physics: 'burn', action: '举火', blurb: '台上火苗溅开，烟往上走。' },
  { id: 'wall', title: '城墙', scenes: ['05-06 即墨', '19-11 宁远'], physics: 'guard', action: '据墙', blurb: '垛口是固定障碍，冲上去会被挡住。' },
  { id: 'horse', title: '马', scenes: ['07-01 鸿门', '05-06 火牛阵'], physics: 'move', action: '纵马', blurb: '马往前跑，蹄下留尘。' },
  { id: 'banner', title: '旗帜', scenes: ['07-01 鸿门宴', '03-04 烽火'], physics: 'wind', action: '变风', blurb: '旗面被风推到另一侧。' },
  { id: 'seal', title: '印玺', scenes: ['06 秦传国玺'], physics: 'fall', action: '钤印', blurb: '印坠落，在纸上压出一方。' },
  { id: 'inkstone', title: '笔砚', scenes: ['各章史评书写'], physics: 'flow', action: '磨墨', blurb: '砚池里的墨被水推开一笔。' },
  { id: 'lantern', title: '灯笼', scenes: ['07-01 鸿门夜帐'], physics: 'burn', action: '点灯', blurb: '灯焰亮起，灯笼仍挂在原处。' },
  { id: 'cannon', title: '火炮', scenes: ['19-11 宁远'], physics: 'burn', action: '点火', blurb: '药线燃起，炮口喷出墨点。' },
  { id: 'treasure', title: '宝船', scenes: ['19-04 郑和'], physics: 'flow', action: '启航', blurb: '三桅宝船沿水面移动。' },
  { id: 'shield', title: '盾', scenes: ['07-01 樊哙闯帐'], physics: 'guard', action: '格挡', blurb: '盾挡住飞来的墨点。' },
  { id: 'spear', title: '矛', scenes: ['07 楚汉近战'], physics: 'cut', action: '刺击', blurb: '矛尖刺断木桩。' },
  { id: 'blade', title: '刀', scenes: ['07 楚汉近战'], physics: 'cut', action: '挥刀', blurb: '宽刃砍断木桩。' },
];

const BUILTIN: Partial<Record<HistoryPropId, PropPaintingId>> = {
  sword: 'sword',
  blade: 'blade',
  spear: 'spear',
  shield: 'shield',
  banner: 'banner',
  horse: 'war-horse',
  water: 'water',
};

export function historyProp(id: string): HistoryProp | undefined {
  return HISTORY_PROPS.find(item => item.id === id);
}

export function paintHistoryProp(id: HistoryPropId, at: PropPlacement): PropStroke[] {
  const built = BUILTIN[id];
  if (built) return paintProp(built, at);
  return paintHistoryShape(id as HistoryPaintingId, at);
}
