import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { AudioBus } from '../src/core/audio-bus';
import { cameraAt } from '../src/core/cutscene-player';
import {
  conditionMet, findFullScene, lookupString, parseChapterBundle, parseChapterIndex, parseScenePackage, progressFromSets,
} from '../src/core/content-catalog';
import { migrateSave, type SaveStorage } from '../src/core/save-store';
import { SceneDirector } from '../src/core/scene-director';
import { resolveStrokeCue, samplePolyline } from '../src/core/stroke-cues';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = resolve(root, 'plan/11-history-game-data');

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function memory(): SaveStorage {
  const bag = new Map<string, string>();
  return {
    getItem: key => bag.get(key) ?? null,
    setItem: (key, value) => { bag.set(key, value); },
  };
}

describe('history content', () => {
  const index = parseChapterIndex(readJson(resolve(data, 'chapters/index.json')));
  const example = parseScenePackage(readJson(resolve(data, 'scene-zhanguo-jingke.example.json')));

  it('loads the chapter index and every bundle', () => {
    expect(index.chapters.length).toBe(21);
    expect(index.totals.scenes).toBe(157);
    expect(index.chapters.length).toBeGreaterThan(10);
    const files = readdirSync(resolve(data, 'chapters')).filter(name => name.endsWith('.json') && name !== 'index.json');
    expect(files.length).toBe(index.chapters.length);
    for (const file of files) {
      const bundle = parseChapterBundle(readJson(resolve(data, 'chapters', file)));
      expect(bundle.chapter.id.length).toBeGreaterThan(0);
      expect(bundle.scenes.length).toBeGreaterThan(0);
    }
  });

  it('matches the jingke example to the zhanguo bundle', () => {
    const bundle = parseChapterBundle(readJson(resolve(data, 'chapters/05-zhanguo.json')));
    const full = findFullScene(bundle, 'zhanguo.jingke');
    expect(full?.scene.id).toBe(example.scene.id);
    expect(full?.opening.id).toBe(example.opening.id);
    expect(full?.opening.shots.map(shot => shot.id)).toEqual(example.opening.shots.map(shot => shot.id));
    expect(lookupString(example.strings, example.scene.title)).toBe('易水寒');
  });

  it('keeps the what-if branch locked until both lines are cleared', () => {
    const fork = example.scene.plot.nodes.find(node => node.id === 'fork');
    const whatif = fork?.choices?.find(choice => choice.id === 'pick.whatif');
    expect(conditionMet(whatif?.requires, progressFromSets([], []))).toBe(false);
    expect(conditionMet(whatif?.requires, progressFromSets(['zhanguo.jingke/canon'], []))).toBe(false);
    expect(conditionMet(whatif?.requires, progressFromSets(['zhanguo.jingke/canon', 'zhanguo.jingke/legend'], []))).toBe(true);
    expect(conditionMet({ cleared: 'qin.*/canon', count: 2 }, progressFromSets(['qin.a/canon', 'qin.b/canon'], []))).toBe(true);
  });
});

describe('story host', () => {
  const example = parseScenePackage(readJson(resolve(data, 'scene-zhanguo-jingke.example.json')));

  it('plays the opening clock into a canon or legend choice and can save', () => {
    const store = memory();
    const audio = new AudioBus({
      schedule: () => undefined,
      stop: () => undefined,
    });
    const director = new SceneDirector(example, store, audio);
    let view = director.view();
    expect(view.phase).toBe('cutscene');
    for (let i = 0; i < 140; i++) view = director.step();
    expect(view.tick?.shotId).toBe('s1.title');
    expect(view.tick?.texts.some(item => item.text === '易水寒')).toBe(true);
    expect(audio.cues.some(cue => cue.bus === 'bgm')).toBe(true);
    expect(view.tick?.texts.some(item => item.cue.kind === 'subtitle')).toBe(false);
    director.fastForward(example.opening.durationFrames + 2);
    view = director.view();
    expect(view.phase).toBe('choice');
    expect(view.choices.map(choice => choice.id)).toEqual(['pick.canon', 'pick.legend']);
    director.choose('pick.canon');
    expect(director.view().phase).toBe('gameplay');
    expect(director.view().note).toContain('稳住秦舞阳');
    director.confirm();
    expect(director.view().node.id).toBe('c.pillar');
    director.confirm();
    expect(director.view().phase).toBe('ending');
    const saved = JSON.parse(store.getItem('inkgames.save') ?? '{}') as { scenes: Record<string, { lines: { canon?: string }; checkpoint?: { node: string } }> };
    expect(saved.scenes['zhanguo.jingke']?.lines.canon).toBe('cleared');
    const resumed = new SceneDirector(example, store, audio);
    expect(resumed.resume()?.id).toBe('c.end');
  });

  it('resolves prop and brush cues without a GL context', () => {
    const hill = example.opening.tracks.strokes[0];
    expect(hill).toBeTruthy();
    const strokes = resolveStrokeCue(hill!);
    expect(strokes.length).toBeGreaterThan(0);
    expect(strokes[0]?.points.length).toBeGreaterThan(2);
    const box = example.opening.tracks.strokes.find(cue => 'brush' in cue.source && cue.source.brush === 'figure.robe');
    expect(box).toBeTruthy();
    const sampled = resolveStrokeCue(box!);
    expect(sampled[0]?.color).toBe('brown');
    expect(sampled[0]?.points.length).toBeGreaterThan(4);
    expect(samplePolyline([[0, 0], [10, 0]], 4).map(point => point.x)).toEqual([0, 4, 8]);
  });

  it('eases the camera with a polynomial and migrates an empty save', () => {
    const pose = cameraAt([
      { at: 0, x: 0, y: 0, zoom: 1, ease: 'linear' },
      { at: 100, x: 100, y: 0, zoom: 2, ease: 'inOutSine' },
    ], 50);
    expect(pose.x).toBeGreaterThan(40);
    expect(pose.x).toBeLessThan(60);
    expect(pose.zoom).toBeGreaterThan(1.4);
    expect(migrateSave({}).version).toBe(1);
    expect(migrateSave({}).format).toBe('inkgames.save');
  });
});
