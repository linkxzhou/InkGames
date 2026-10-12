import { describe, expect, it } from 'vitest';
import { BACKDROP_HEIGHT, BACKDROP_PAPER, BACKDROP_WIDTH, backdropMarks } from '../src/core/ink-backdrop';

describe('内容站淡墨底的落点', () => {
  it('七个点都在纸内，只有最后一点是朱砂', () => {
    const marks = backdropMarks(20261012);
    expect(marks).toHaveLength(7);
    expect(marks.filter(mark => mark.vermilion)).toHaveLength(1);
    expect(marks[6]?.vermilion).toBe(true);
    for (const mark of marks) {
      expect(mark.x).toBeGreaterThanOrEqual(BACKDROP_WIDTH * 0.1);
      expect(mark.x).toBeLessThanOrEqual(BACKDROP_WIDTH * 0.9);
      expect(mark.y).toBeGreaterThanOrEqual(BACKDROP_HEIGHT * 0.12);
      expect(mark.y).toBeLessThanOrEqual(BACKDROP_HEIGHT * 0.88);
      expect(mark.radius).toBeGreaterThan(0);
    }
    expect(BACKDROP_PAPER).toEqual([236, 234, 228]);
  });

  it('同一颗种子两次落在同一处', () => {
    expect(backdropMarks(7)).toEqual(backdropMarks(7));
  });
});
