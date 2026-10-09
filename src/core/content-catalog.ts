import type {
  ChapterBundle, ChapterDef, ChapterIndex, CutsceneDef, FullSceneEntry, OutlineSceneEntry, SceneDef,
  ScenePackage, StoryProgress, StringTable,
} from './narrative-types';
import type { Condition } from './narrative-types';

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Expected ${label} object`);
  return value as Record<string, unknown>;
}

function text(row: Record<string, unknown>, key: string, label: string): string {
  const value = row[key];
  if (typeof value !== 'string' || !value) throw new Error(`${label}.${key}`);
  return value;
}

function version1(row: Record<string, unknown>, label: string): void {
  if (row.version !== 1) throw new Error(`${label} version`);
}

export function lookupString(table: StringTable, key: string | undefined): string {
  if (!key) return '';
  return table.strings[key] ?? key;
}

export function parseStringTable(value: unknown): StringTable {
  const row = record(value, 'strings');
  const locale = row.locale;
  if (locale !== 'zh-Hans' && locale !== 'zh-Hant' && locale !== 'en') throw new Error('strings.locale');
  const strings = record(row.strings, 'strings.strings');
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(strings)) {
    if (typeof entry !== 'string') throw new Error(`string ${key}`);
    out[key] = entry;
  }
  return { locale, strings: out };
}

export function parseChapterIndex(value: unknown): ChapterIndex {
  const row = record(value, 'index');
  if (row.format !== 'inkgames.chapter-index') throw new Error('chapter index format');
  version1(row, 'chapter index');
  if (!Array.isArray(row.chapters) || row.chapters.length === 0) throw new Error('chapter index empty');
  return value as ChapterIndex;
}

export function parseSceneDef(value: unknown): SceneDef {
  const row = record(value, 'scene');
  if (row.format !== 'inkgames.scene') throw new Error('scene format');
  version1(row, 'scene');
  text(row, 'id', 'scene');
  const plot = record(row.plot, 'plot');
  if (typeof plot.start !== 'string' || !Array.isArray(plot.nodes) || plot.nodes.length === 0) throw new Error('plot');
  return value as SceneDef;
}

export function parseCutsceneDef(value: unknown): CutsceneDef {
  const row = record(value, 'cutscene');
  if (row.format !== 'inkgames.cutscene') throw new Error('cutscene format');
  version1(row, 'cutscene');
  text(row, 'id', 'cutscene');
  const clock = record(row.clock, 'clock');
  if (clock.fps !== 60 || clock.mode !== 'frame') throw new Error('cutscene clock');
  if (typeof row.durationFrames !== 'number') throw new Error('durationFrames');
  const tracks = record(row.tracks, 'tracks');
  for (const key of ['strokes', 'camera', 'text', 'effects', 'audio', 'sync']) {
    if (!Array.isArray(tracks[key])) throw new Error(`tracks.${key}`);
  }
  if (!Array.isArray(row.shots) || !Array.isArray(row.layers)) throw new Error('shots');
  return value as CutsceneDef;
}

export function parseScenePackage(value: unknown): ScenePackage {
  const row = record(value, 'package');
  return {
    scene: parseSceneDef(row.scene),
    opening: parseCutsceneDef(row.opening),
    strings: parseStringTable(row.strings),
  };
}

function parseEntry(value: unknown): FullSceneEntry | OutlineSceneEntry {
  const row = record(value, 'entry');
  if (typeof row.outlineId !== 'string') throw new Error('outlineId');
  const strings = parseStringTable(row.strings);
  if (row.v1 === true) {
    return {
      outlineId: row.outlineId,
      v1: true,
      ...(typeof row.example === 'string' ? { example: row.example } : {}),
      scene: parseSceneDef(row.scene),
      opening: parseCutsceneDef(row.opening),
      strings,
      cast: Array.isArray(row.cast) ? row.cast as FullSceneEntry['cast'] : [],
      relations: Array.isArray(row.relations) ? row.relations as FullSceneEntry['relations'] : [],
    };
  }
  if (row.v1 !== false) throw new Error('entry v1');
  const scene = record(row.scene, 'outline');
  if (scene.format !== 'inkgames.scene-outline') throw new Error('outline format');
  return {
    outlineId: row.outlineId,
    v1: false,
    scene: row.scene as OutlineSceneEntry['scene'],
    strings,
    cast: Array.isArray(row.cast) ? row.cast as OutlineSceneEntry['cast'] : [],
    relations: Array.isArray(row.relations) ? row.relations as OutlineSceneEntry['relations'] : [],
  };
}

export function parseChapterBundle(value: unknown): ChapterBundle {
  const row = record(value, 'bundle');
  if (row.format !== 'inkgames.chapter-bundle') throw new Error('bundle format');
  version1(row, 'bundle');
  const chapter = record(row.chapter, 'chapter') as ChapterDef & Record<string, unknown>;
  if (chapter.format !== 'inkgames.chapter') throw new Error('chapter format');
  if (!Array.isArray(row.scenes)) throw new Error('bundle scenes');
  return {
    format: 'inkgames.chapter-bundle',
    version: 1,
    chapter: row.chapter as ChapterDef,
    strings: parseStringTable(row.strings),
    scenes: row.scenes.map(parseEntry),
  };
}

export function findFullScene(bundle: ChapterBundle, sceneId: string): FullSceneEntry | undefined {
  for (const entry of bundle.scenes) {
    if (entry.v1 && entry.scene.id === sceneId) return entry;
  }
  return undefined;
}

const GRADE_RANK: Readonly<Record<'甲' | '乙' | '丙', number>> = { 丙: 0, 乙: 1, 甲: 2 };

function clearedCount(pattern: string, progress: StoryProgress): number {
  if (!pattern.includes('*')) return progress.cleared.has(pattern) ? 1 : 0;
  const parts = pattern.split('*');
  let count = 0;
  for (const id of progress.cleared) {
    let cursor = 0;
    let ok = true;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] ?? '';
      if (i === parts.length - 1) {
        if (!id.slice(cursor).endsWith(part)) ok = false;
        break;
      }
      if (part.length === 0) continue;
      const at = id.indexOf(part, cursor);
      if (at < 0) { ok = false; break; }
      cursor = at + part.length;
    }
    if (ok) count += 1;
  }
  return count;
}

export function conditionMet(condition: Condition | undefined, progress: StoryProgress): boolean {
  if (!condition) return true;
  if (condition.all && !condition.all.every(item => conditionMet(item, progress))) return false;
  if (condition.any && !condition.any.some(item => conditionMet(item, progress))) return false;
  if (condition.not && conditionMet(condition.not, progress)) return false;
  if (condition.flag && !progress.flags.has(condition.flag)) return false;
  if (condition.cleared) {
    const need = condition.count ?? 1;
    if (clearedCount(condition.cleared, progress) < need) return false;
  }
  if (condition.grade) {
    const have = progress.grades[condition.grade.scene];
    if (!have || GRADE_RANK[have] < GRADE_RANK[condition.grade.atLeast]) return false;
  }
  return true;
}

export function progressFromSets(cleared: readonly string[], flags: readonly string[], grades: Readonly<Record<string, '甲' | '乙' | '丙'>> = {}): StoryProgress {
  return { cleared: new Set(cleared), flags: new Set(flags), grades };
}
