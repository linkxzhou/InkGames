import { conditionMet, lookupString, progressFromSets } from './content-catalog';
import type { ChoiceDef, PlotNode, SceneDef, StoryProgress, StringTable } from './narrative-types';

export interface StorySnapshot {
  readonly nodeId: string;
  readonly flags: readonly string[];
  readonly seen: readonly string[];
  readonly endings: readonly string[];
}

/**
 * Walks one scene's plot graph. Cutscene playback and painting stay outside this class.
 */
export class StoryRuntime {
  private readonly byId = new Map<string, PlotNode>();
  private nodeId: string;
  private readonly flags = new Set<string>();
  private readonly seen = new Set<string>();
  private readonly endings: string[] = [];
  private readonly listeners = new Set<(node: PlotNode) => void>();

  constructor(readonly scene: SceneDef, readonly strings: StringTable) {
    for (const node of scene.plot.nodes) this.byId.set(node.id, node);
    const start = this.byId.get(scene.plot.start);
    if (!start) throw new Error(`Missing start node ${scene.plot.start}`);
    this.nodeId = start.id;
    this.enter(start);
  }

  get node(): PlotNode {
    const node = this.byId.get(this.nodeId);
    if (!node) throw new Error(`Missing node ${this.nodeId}`);
    return node;
  }

  onNode(listener: (node: PlotNode) => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  text(key: string | undefined): string {
    return lookupString(this.strings, key);
  }

  progress(extraCleared: readonly string[] = []): StoryProgress {
    const cleared = [
      ...extraCleared,
      ...this.endings.map(id => `${this.scene.id}/${this.endingLine(id)}`),
    ];
    return progressFromSets(cleared, [...this.flags]);
  }

  choices(extraCleared: readonly string[] = []): ChoiceDef[] {
    const node = this.node;
    if (node.kind !== 'choice' || !node.choices) return [];
    const progress = this.progress(extraCleared);
    return node.choices.filter(choice => conditionMet(choice.requires, progress));
  }

  choose(choiceId: string, extraCleared: readonly string[] = []): PlotNode {
    const choice = this.choices(extraCleared).find(item => item.id === choiceId);
    if (!choice) throw new Error(`Choice unavailable ${choiceId}`);
    return this.go(choice.to);
  }

  /** Leave a cutscene, gameplay, or dialogue node along its single next edge. */
  complete(): PlotNode | undefined {
    const node = this.node;
    if (node.kind === 'choice') return undefined;
    if (node.kind === 'ending') return node;
    const next = node.next?.[0];
    if (!next) return node;
    return this.go(next);
  }

  go(id: string): PlotNode {
    const node = this.byId.get(id);
    if (!node) throw new Error(`Missing node ${id}`);
    this.nodeId = id;
    this.enter(node);
    return node;
  }

  snapshot(): StorySnapshot {
    return {
      nodeId: this.nodeId,
      flags: [...this.flags],
      seen: [...this.seen],
      endings: this.endings.slice(),
    };
  }

  restore(snapshot: StorySnapshot): PlotNode {
    this.flags.clear();
    for (const flag of snapshot.flags) this.flags.add(flag);
    this.seen.clear();
    for (const id of snapshot.seen) this.seen.add(id);
    this.endings.length = 0;
    this.endings.push(...snapshot.endings);
    return this.go(snapshot.nodeId);
  }

  private endingLine(endingId: string): string {
    const ending = this.scene.endings.find(item => item.id === endingId);
    if (ending?.kind === 'legend') return 'legend';
    if (ending?.kind === 'divergent') return 'whatif';
    return 'canon';
  }

  private enter(node: PlotNode): void {
    this.seen.add(node.id);
    for (const flag of node.setFlags ?? []) this.flags.add(flag);
    if (node.kind === 'ending' && node.ending && !this.endings.includes(node.ending)) this.endings.push(node.ending);
    for (const listener of this.listeners) listener(node);
  }
}
