import { AudioBus } from './audio-bus';
import { CutscenePlayer, type CutsceneTick, type StrokePulse } from './cutscene-player';
import type { ChoiceDef, CutsceneDef, PlotNode, ScenePackage } from './narrative-types';
import { SaveStore, sceneClearedKeys, type SaveStorage } from './save-store';
import { StoryRuntime } from './story-runtime';

export type DirectorPhase = 'cutscene' | 'choice' | 'gameplay' | 'dialogue' | 'ending' | 'note';

export interface DirectorView {
  readonly phase: DirectorPhase;
  readonly node: PlotNode;
  readonly tick: CutsceneTick | undefined;
  readonly choices: readonly ChoiceDef[];
  readonly note: string;
}

/**
 * Loads one scene package, plays its opening, then walks the plot graph.
 * Gameplay templates stay as goals on the node; this host does not run a duel.
 */
export class SceneDirector {
  readonly story: StoryRuntime;
  readonly audio: AudioBus;
  readonly save: SaveStore;
  private readonly cutscenes = new Map<string, CutsceneDef>();
  private player: CutscenePlayer | undefined;
  private clock = 0;
  private confirmQueued = false;

  constructor(readonly pack: ScenePackage, storage: SaveStorage, audio = new AudioBus()) {
    this.story = new StoryRuntime(pack.scene, pack.strings);
    this.audio = audio;
    this.save = new SaveStore(storage);
    this.cutscenes.set(pack.opening.id, pack.opening);
    this.beginNode(false);
  }

  get subtitles(): boolean {
    return this.save.load().settings.subtitles;
  }

  view(): DirectorView {
    return this.describe(undefined);
  }

  step(): DirectorView {
    if (!this.player) return this.describe(undefined);
    const tick = this.player.step(this.confirmQueued, false);
    this.confirmQueued = false;
    this.clock = tick.frame;
    for (const cue of tick.audio) this.audio.play(cue, tick.frame, this.pack.opening.clock.fps);
    if (tick.ended) {
      this.player = undefined;
      this.story.complete();
      this.beginNode(true);
      return this.describe(tick);
    }
    return this.describe(tick);
  }

  fastForward(frames: number): StrokePulse[] {
    if (!this.player) return [];
    const pulses = this.player.fastForward(frames);
    const tick = this.player.step(true, true);
    this.clock = tick.frame;
    if (tick.ended || this.player.position >= this.pack.opening.durationFrames) {
      this.player = undefined;
      if (this.story.node.kind === 'cutscene') {
        this.story.complete();
        this.beginNode(true);
      }
    }
    return pulses;
  }

  confirm(): void {
    this.confirmQueued = true;
    if (!this.player && (this.story.node.kind === 'gameplay' || this.story.node.kind === 'dialogue' || this.phase() === 'note')) {
      this.story.complete();
      this.beginNode(true);
    }
  }

  choose(choiceId: string): PlotNode {
    const node = this.story.choose(choiceId, sceneClearedKeys(this.save.load()));
    this.beginNode(true);
    return node;
  }

  /** Jump back to the checkpoint stored for this scene, if a save has one. */
  resume(): PlotNode | undefined {
    const checkpoint = this.save.load().scenes[this.story.scene.id]?.checkpoint;
    const state = checkpoint?.state;
    if (!state || typeof state.nodeId !== 'string') return undefined;
    const node = this.story.restore({
      nodeId: state.nodeId,
      flags: stringList(state.flags),
      seen: stringList(state.seen),
      endings: stringList(state.endings),
    });
    this.player = undefined;
    this.beginNode(true);
    return node;
  }

  private phase(): DirectorPhase {
    if (this.player) return 'cutscene';
    const node = this.story.node;
    if (node.kind === 'cutscene') return 'note';
    if (node.kind === 'choice') return 'choice';
    if (node.kind === 'gameplay') return 'gameplay';
    if (node.kind === 'dialogue') return 'dialogue';
    return 'ending';
  }

  private describe(tick: CutsceneTick | undefined): DirectorView {
    const node = this.story.node;
    const note = node.label ? this.story.text(node.label) : node.kind === 'gameplay'
      ? goalText(node)
      : '';
    return {
      phase: this.phase(),
      node,
      tick,
      choices: this.phase() === 'choice' ? this.story.choices(sceneClearedKeys(this.save.load())) : [],
      note,
    };
  }

  private beginNode(write: boolean): void {
    const node = this.story.node;
    if (write) this.persist(node);
    if (node.kind !== 'cutscene') {
      this.player = undefined;
      return;
    }
    const def = node.cutscene ? this.cutscenes.get(node.cutscene) : undefined;
    if (!def) {
      this.player = undefined;
      return;
    }
    this.player = new CutscenePlayer(def, this.pack.strings, key => !this.audio.voEnded(key, this.clock));
  }

  private persist(node: PlotNode): void {
    const game = this.save.load();
    const previous = game.scenes[this.story.scene.id];
    const cleared = node.kind === 'ending';
    const lines = { ...(previous?.lines ?? {}), [node.line]: cleared ? 'cleared' as const : 'seen' as const };
    const endings = node.kind === 'ending' && node.ending
      ? [...new Set([...(previous?.endings ?? []), node.ending])]
      : previous?.endings ?? [];
    const yiwenlu = node.kind === 'ending' && this.story.scene.endings.find(item => item.id === node.ending)?.archive === 'yiwenlu'
      ? [...new Set([...game.yiwenlu, node.ending ?? ''].filter(Boolean))]
      : game.yiwenlu;
    this.save.patch(this.story.scene.id, {
      lines,
      endings,
      checkpoint: { node: node.id, state: snapshotRecord(this.story.snapshot()) },
    }, { flags: this.story.snapshot().flags, yiwenlu });
  }
}

function snapshotRecord(snapshot: { nodeId: string; flags: readonly string[]; seen: readonly string[]; endings: readonly string[] }): Record<string, unknown> {
  return {
    nodeId: snapshot.nodeId,
    flags: [...snapshot.flags],
    seen: [...snapshot.seen],
    endings: [...snapshot.endings],
  };
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function goalText(node: PlotNode): string {
  const goal = node.gameplay?.params.goal;
  const template = node.gameplay?.template ?? 'gameplay';
  return typeof goal === 'string' ? `${template}：${goal}` : template;
}
