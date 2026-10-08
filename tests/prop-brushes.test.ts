import { describe, expect, it } from 'vitest';
import { INK_SIZES } from '../src/core/ink-brush';
import { INK_COLOR_NAMES } from '../src/core/ink-palette';
import { ITEM_PRESETS } from '../src/plugins/items';
import { PROP_BRUSHES, type PropBrush, type PropPaintingId } from '../src/plugins/prop-brushes';
import { actionStroke, paintProp } from '../src/plugins/prop-paintings';

const rows = (id: PropPaintingId): Array<[string, PropBrush]> => Object.entries(PROP_BRUSHES[id]) as Array<[string, PropBrush]>;
const signature = (b: PropBrush): string => `${b.mode}/${b.size}/${b.effect}/${b.color}`;

describe('道具笔刷表', () => {
  it('十个道具都有自己的笔刷，且各自用到至少三种不同的配置', () => {
    for (const item of ITEM_PRESETS) {
      const table = rows(item.id as PropPaintingId);
      expect(table.length, item.id).toBeGreaterThan(3);
      expect(new Set(table.map(([, b]) => signature(b))).size, item.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('每一行都是 inkEngine/index.html 能选到的值', () => {
    for (const id of Object.keys(PROP_BRUSHES) as PropPaintingId[]) {
      for (const [part, b] of rows(id)) {
        expect(INK_COLOR_NAMES, `${id}.${part}`).toContain(b.color);
        expect(INK_SIZES[b.size], `${id}.${part}`).toBeGreaterThan(0);
        expect(b.speed).toBeGreaterThan(0);
        if (b.pressure !== undefined) expect(b.pressure >= 0 && b.pressure <= 1).toBe(true);
        // medium_gray (29) paints with the canvas colour in encode.frag, i.e. an eraser.
        expect(b.color).not.toBe('medium_gray');
      }
    }
  });

  it('各道具的主笔刷互不相同', () => {
    const lead = ITEM_PRESETS.map(item => signature(rows(item.id as PropPaintingId)[0]![1]));
    expect(new Set(lead).size).toBeGreaterThanOrEqual(8);
  });
});

describe('道具画法', () => {
  it('每个道具都画成多笔，每笔每帧一个指针点', () => {
    for (const item of ITEM_PRESETS) {
      const strokes = paintProp(item.id as PropPaintingId, { x: 320, y: 240 });
      if (item.id === 'water-brush' || item.id === 'boat' || item.id === 'war-horse' || item.id === 'banner' || item.id === 'ink-bomb' ||
        item.id === 'sword' || item.id === 'blade' || item.id === 'spear' || item.id === 'bow' || item.id === 'shield') {
        expect(strokes.length, item.id).toBeGreaterThanOrEqual(6);
      }
      for (const stroke of strokes) {
        const preset = (PROP_BRUSHES[stroke.prop] as Record<string, PropBrush>)[stroke.part]!;
        expect(stroke.points.length).toBeGreaterThanOrEqual(3);
        for (let i = 1; i < stroke.points.length; i++) {
          const a = stroke.points[i - 1]!;
          const b = stroke.points[i]!;
          expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeLessThanOrEqual(preset.speed + 1e-6);
        }
      }
    }
  });

  it('剑有刃、锋、格、柄；马有身、颈、头、四腿、鬃、尾', () => {
    const sword = new Set(paintProp('sword', { x: 0, y: 0 }).map(s => s.part));
    for (const part of ['blade', 'edge', 'guard', 'grip', 'pommel']) expect(sword.has(part), part).toBe(true);
    const horse = paintProp('war-horse', { x: 0, y: 0 });
    expect(horse.filter(s => s.part === 'leg')).toHaveLength(4);
    for (const part of ['body', 'neck', 'head', 'mane', 'tail']) expect(horse.some(s => s.part === part), part).toBe(true);
  });

  it('水面是长横向湿笔加白色飞白浪花，不是点', () => {
    const water = paintProp('water', { x: 0, y: 0, width: 1280 });
    const rowsOfWater = water.filter(s => s.part !== 'crest' && s.part !== 'ripple');
    expect(rowsOfWater.length).toBeGreaterThanOrEqual(5);
    for (const row of rowsOfWater) {
      const xs = row.points.map(p => p.x);
      expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(1200);
      expect(['wet', 'effect4', 'mix']).toContain(row.brush.effect);
    }
    const crests = water.filter(s => s.part === 'crest');
    expect(crests.length).toBeGreaterThan(2);
    expect(crests.every(s => s.color === 'white' && s.brush.effect === 'flyingWhite')).toBe(true);
  });

  it('缩小的手持件把笔刷换成按比例缩小的数值尺寸', () => {
    const held = paintProp('sword', { x: 0, y: 0, scale: 0.34 });
    expect(held.every(s => typeof s.brush.size === 'number')).toBe(true);
    expect(actionStroke('sword', 'slash', [[0, 0], [200, -40]])?.brush.mode).toBe('fly');
  });
});
