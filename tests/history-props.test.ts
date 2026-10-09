import { describe, expect, it } from 'vitest';
import { defineGameplay } from '../src/core/gameplay';
import { createPropWorld } from '../src/core/prop-world';
import { HISTORY_PROPS, paintHistoryProp, type HistoryPropId } from '../src/plugins/history-props';

const IDS: readonly HistoryPropId[] = [
  'sword', 'dagger', 'slip', 'ding', 'chariot', 'crossbow', 'warship', 'water',
  'beacon', 'wall', 'horse', 'banner', 'seal', 'inkstone', 'lantern', 'cannon',
  'treasure', 'shield', 'spear', 'blade',
];

describe('历史道具', () => {
  it('正好二十件，场景编号来自大纲，笔画像一件东西而不是一个点', () => {
    expect(HISTORY_PROPS.map(item => item.id)).toEqual([...IDS]);
    for (const item of HISTORY_PROPS) {
      expect(item.scenes.length, item.id).toBeGreaterThan(0);
      expect(item.blurb.length, item.id).toBeGreaterThan(4);
      const strokes = paintHistoryProp(item.id, { x: 200, y: 220, scale: 1, width: 480 });
      expect(strokes.length, item.id).toBeGreaterThanOrEqual(4);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const stroke of strokes) {
        for (const point of stroke.points) {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        }
      }
      expect(maxX - minX, item.id).toBeGreaterThan(30);
      expect(maxY - minY, item.id).toBeGreaterThan(30);
    }
  });

  it('落下会往下走，挥砍会拆掉木桩', () => {
    const falling = createPropWorld('fall');
    const y0 = falling.prop.position.y;
    falling.act();
    for (let i = 0; i < 40; i++) falling.step();
    expect(falling.prop.position.y).toBeGreaterThan(y0 + 5);
    const cutting = createPropWorld('cut');
    expect(cutting.stake).not.toBeNull();
    expect(cutting.act()).toBe('木桩被砍断');
    expect(cutting.stake).toBeNull();
  });

  it('玩法模板把目标留在说明里，并不另开一场决斗', () => {
    const setup = defineGameplay('dialogue-timing', '稳住秦舞阳并完成献图礼');
    expect(setup.verb).toBe('talk');
    expect(setup.label).toContain('稳住秦舞阳');
    expect(defineGameplay('duel', '刺秦').verb).toBe('cut');
    expect(defineGameplay('unknown-template', '记下').label).toContain('记下');
  });
});
