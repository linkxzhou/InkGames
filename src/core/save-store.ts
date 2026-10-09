import type { SaveGame, SaveSceneProgress } from './narrative-types';

export interface SaveStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const EMPTY_VOLUME: SaveGame['settings']['volume'] = { bgm: 0.8, amb: 0.8, sfx: 0.8, vo: 1 };

export function emptySave(now = '1970-01-01T00:00:00.000Z'): SaveGame {
  return {
    format: 'inkgames.save',
    version: 1,
    createdAt: now,
    scenes: {},
    flags: [],
    cards: [],
    yiwenlu: [],
    settings: { locale: 'zh-Hans', subtitles: true, volume: EMPTY_VOLUME },
  };
}

/** Version 0 (missing or unversioned) becomes a version 1 save. */
export function migrateSave(raw: unknown, now = '1970-01-01T00:00:00.000Z'): SaveGame {
  if (!raw || typeof raw !== 'object') return emptySave(now);
  const row = raw as Record<string, unknown>;
  if (row.format === 'inkgames.save' && row.version === 1 && row.scenes && typeof row.scenes === 'object') {
    return raw as SaveGame;
  }
  return emptySave(typeof row.createdAt === 'string' ? row.createdAt : now);
}

export class SaveStore {
  constructor(private readonly storage: SaveStorage, private readonly key = 'inkgames.save') {}

  load(now?: string): SaveGame {
    const text = this.storage.getItem(this.key);
    if (!text) return emptySave(now);
    try {
      return migrateSave(JSON.parse(text) as unknown, now);
    } catch {
      return emptySave(now);
    }
  }

  commit(game: SaveGame): void {
    this.storage.setItem(this.key, JSON.stringify(game));
  }

  patch(sceneId: string, scene: SaveSceneProgress, extra?: Partial<Pick<SaveGame, 'flags' | 'cards' | 'yiwenlu'>>, now = new Date().toISOString()): SaveGame {
    const current = this.load(now);
    const next: SaveGame = {
      ...current,
      scenes: { ...current.scenes, [sceneId]: scene },
      flags: extra?.flags ?? current.flags,
      cards: extra?.cards ?? current.cards,
      yiwenlu: extra?.yiwenlu ?? current.yiwenlu,
    };
    this.commit(next);
    return next;
  }
}

export function sceneClearedKeys(game: SaveGame): string[] {
  const keys: string[] = [];
  for (const [sceneId, progress] of Object.entries(game.scenes)) {
    const lines = progress.lines;
    for (const line of ['canon', 'legend', 'whatif'] as const) {
      if (lines[line] === 'cleared') keys.push(`${sceneId}/${line}`);
    }
  }
  return keys;
}
