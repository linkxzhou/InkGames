import { describe, expect, it } from 'vitest';
import { animationPose, validateAnimation, type InkAnimationShot } from '../src/core/ink-animation';

const shots: InkAnimationShot[] = [
  { id: 'a', from: 0, to: 600, image: 'a.png', note: '' },
  { id: 'b', from: 600, to: 5400, image: 'b.png', note: '' },
];
describe('image animation timeline', () => {
  it('uses half-open shot boundaries and clamps seek', () => {
    expect(animationPose(shots, 599, 5400).index).toBe(0);
    expect(animationPose(shots, 600, 5400)).toEqual({ index: 1, progress: 0, frame: 600 });
    expect(animationPose(shots, 9000, 5400).frame).toBe(5399);
    expect(animationPose(shots, -1, 5400).frame).toBe(0);
  });
  it('reconstructs any frame without previous playback', () => {
    const target = animationPose(shots, 3500, 5400);
    animationPose(shots, 4000, 5400);
    expect(animationPose(shots, 3500, 5400)).toEqual(target);
  });
  it('validates coverage and unique identities', () => {
    expect(() => validateAnimation(shots, 5400)).not.toThrow();
    expect(() => validateAnimation(shots, 5000)).toThrow();
    expect(() => validateAnimation([shots[0], { ...shots[1], id: 'a' }], 5400)).toThrow();
    expect(() => validateAnimation([shots[0], { ...shots[1], from: 601 }], 5400)).toThrow();
  });
});
