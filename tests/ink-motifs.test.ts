import { describe, expect, it } from 'vitest';
import {
  bannerMotif, bladeMotif, boatMotif, bowMotif, horseMotif, inkBombMotif,
  shieldMotif, spearMotif, swordMotif, waterBody, waterBrushMotif,
} from '../src/core/ink-motifs';
import type { MotifStroke } from '../src/core/ink-motifs';

function bounds(strokes: readonly MotifStroke[]): { width: number; height: number; strokes: number; points: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let points = 0;
  for (const stroke of strokes) {
    for (const point of stroke.points) {
      points += 1;
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }
  return { width: maxX - minX, height: maxY - minY, strokes: strokes.length, points };
}

describe('ink prop motifs', () => {
  it('剑比宽更高，并且有护手和柄', () => {
    const box = bounds(swordMotif(0, 0, 1));
    expect(box.height).toBeGreaterThan(box.width * 1.4);
    expect(box.strokes).toBeGreaterThanOrEqual(8);
    expect(box.points).toBeGreaterThan(20);
  });

  it('刀有弯刃，横向展开', () => {
    const box = bounds(bladeMotif(0, 0, 1));
    expect(box.width).toBeGreaterThan(80);
    expect(box.height).toBeGreaterThan(150);
  });

  it('枪有杆和两侧枪头', () => {
    const strokes = spearMotif(0, 0, 1);
    expect(bounds(strokes).height).toBeGreaterThan(200);
    const wide = strokes.filter(stroke => stroke.points.some(point => Math.abs(point.x) > 10));
    expect(wide.length).toBeGreaterThanOrEqual(2);
  });

  it('弓同时有弯曲的臂和横向的箭', () => {
    const strokes = bowMotif(0, 0, 1);
    const flat = strokes.filter(stroke => {
      const ys = stroke.points.map(point => point.y);
      const xs = stroke.points.map(point => point.x);
      return Math.max(...xs) - Math.min(...xs) > 80 && Math.max(...ys) - Math.min(...ys) < 8;
    });
    expect(flat.length).toBeGreaterThanOrEqual(1);
    expect(bounds(strokes).height).toBeGreaterThan(200);
  });

  it('盾有尖底，轮廓不是一个圆', () => {
    const strokes = shieldMotif(0, 0, 1);
    const outline = strokes[0];
    expect(outline).toBeDefined();
    const bottom = outline?.points.reduce((best, point) => point.y > best.y ? point : best);
    expect(bottom?.x).toBe(0);
    expect(bottom && bottom.y).toBeGreaterThan(80);
  });

  it('马有躯干和至少四条向下的腿', () => {
    const strokes = horseMotif(400, 500, 1, 0);
    const legs = strokes.filter(stroke => {
      const first = stroke.points[0];
      const last = stroke.points[stroke.points.length - 1];
      return first && last && last.y - first.y > 40 && Math.abs(last.x - first.x) < 40;
    });
    expect(legs.length).toBeGreaterThanOrEqual(4);
    expect(bounds(strokes).width).toBeGreaterThan(180);
  });

  it('旗有旗杆和被风吹偏的旗面', () => {
    const calm = bannerMotif(0, 0, 1, 0);
    const blown = bannerMotif(0, 0, 1, 40);
    const far = (strokes: readonly MotifStroke[]) => Math.max(...strokes.flatMap(stroke => stroke.points.map(point => point.x)));
    expect(far(blown)).toBeGreaterThan(far(calm));
    expect(bounds(calm).height).toBeGreaterThan(300);
  });

  it('舟有船舱，水面是多道湿笔而不是一个点', () => {
    expect(bounds(boatMotif(0, 0, 1)).width).toBeGreaterThan(200);
    const water = waterBody(0, 800, 500, 120);
    expect(water.length).toBeGreaterThanOrEqual(8);
    expect(water.every(stroke => stroke.effect === 'wet' || stroke.effect === 'flyingWhite')).toBe(true);
    const span = bounds(water);
    expect(span.width).toBeGreaterThan(700);
  });

  it('墨弹是有颈有盖的器形，水刷有笔毛', () => {
    const bomb = inkBombMotif(0, 0, 1);
    expect(bounds(bomb).height).toBeGreaterThan(bounds(bomb).width);
    const hairs = waterBrushMotif(0, 0, 1).filter(stroke => stroke.effect === 'wet');
    expect(hairs.length).toBeGreaterThanOrEqual(3);
  });
});
