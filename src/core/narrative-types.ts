/**
 * Content contracts from video/docs/content-schema.md.
 * The JSON files stay in video and are only read.
 */

export interface HistoryDate {
  readonly start: number;
  readonly end?: number;
  readonly precision: 'day' | 'month' | 'year' | 'circa' | 'legend';
  readonly display: string;
  readonly era?: string;
  readonly verify: 'done' | 'pending';
  readonly notes?: string;
}

export interface SourceRef {
  readonly kind: 'canon' | 'excavated' | 'novel' | 'biji' | 'folk' | 'opera' | 'modern' | 'classic';
  readonly title: string;
  readonly section?: string;
  readonly corpus?: { readonly file: string; readonly pages: string };
  readonly notes?: string;
}

export interface Condition {
  readonly all?: readonly Condition[];
  readonly any?: readonly Condition[];
  readonly not?: Condition;
  readonly cleared?: string;
  readonly count?: number;
  readonly flag?: string;
  readonly grade?: { readonly scene: string; readonly atLeast: '甲' | '乙' | '丙' };
}

export interface ChapterDef {
  readonly format: 'inkgames.chapter';
  readonly version: 1;
  readonly id: string;
  readonly order: number;
  readonly title: string;
  readonly span: HistoryDate;
  readonly scenes: readonly string[];
  readonly keyScenes: readonly string[];
  readonly unlock: Condition;
  readonly look?: { readonly palette?: readonly string[]; readonly paper?: readonly [number, number, number] };
}

export type PlotLine = 'canon' | 'legend' | 'whatif';

export interface TimelineAnchor {
  readonly id: string;
  readonly title: string;
  readonly when: HistoryDate;
  readonly sources: readonly SourceRef[];
}

export interface ChoiceDef {
  readonly id: string;
  readonly label: string;
  readonly seal: PlotLine;
  readonly to: string;
  readonly requires?: Condition;
}

export interface PlotNode {
  readonly id: string;
  readonly kind: 'cutscene' | 'gameplay' | 'dialogue' | 'choice' | 'ending';
  readonly line: PlotLine;
  readonly when?: HistoryDate;
  readonly next?: readonly string[];
  readonly choices?: readonly ChoiceDef[];
  readonly cutscene?: string;
  readonly dialogue?: string;
  readonly gameplay?: { readonly template: string; readonly params: Readonly<Record<string, unknown>> };
  readonly ending?: string;
  readonly checkpoint?: boolean;
  readonly label?: string;
  readonly setFlags?: readonly string[];
  readonly sources?: readonly SourceRef[];
  readonly notes?: string;
}

export interface PlotGraph {
  readonly start: string;
  readonly nodes: readonly PlotNode[];
}

export interface EndingDef {
  readonly id: string;
  readonly kind: 'canon' | 'legend' | 'divergent' | 'fail';
  readonly title: string;
  readonly cutscene?: string;
  readonly mergeTo?: string;
  readonly archive?: 'yiwenlu';
  readonly sources: readonly SourceRef[];
  readonly notes?: string;
}

export interface CodaDef {
  readonly compare: readonly {
    readonly topic: string;
    readonly canon: string;
    readonly legend: string;
    readonly sources: readonly SourceRef[];
  }[];
  readonly unlocks: { readonly cards: readonly string[]; readonly seal?: string };
}

export interface SceneDef {
  readonly format: 'inkgames.scene';
  readonly version: 1;
  readonly id: string;
  readonly chapter: string;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly when: HistoryDate;
  readonly key: boolean;
  readonly template: string;
  readonly props: readonly string[];
  readonly characters: readonly string[];
  readonly anchors: { readonly entry: TimelineAnchor; readonly exit: TimelineAnchor };
  readonly opening: string;
  readonly fork: { readonly at: string; readonly prompt: string };
  readonly plot: PlotGraph;
  readonly endings: readonly EndingDef[];
  readonly coda: CodaDef;
  readonly verify: 'done' | 'pending';
}

export interface StrokeCue {
  readonly at: number;
  readonly layer: string;
  readonly mode: 'live' | 'instant';
  readonly source:
    | { readonly prop: string; readonly parts?: readonly string[]; readonly placement: Readonly<Record<string, number | boolean>> }
    | { readonly brush: string; readonly color: string; readonly path: { readonly type: 'polyline' | 'catmull'; readonly points: readonly (readonly [number, number])[] }; readonly speed: number }
    | { readonly recording: string; readonly from?: number; readonly to?: number };
  readonly seed?: number;
  readonly label?: string;
}

export interface CameraKey {
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
  readonly ease: 'linear' | 'inOutSine' | 'outQuad' | 'inQuad';
  readonly shake?: { readonly amp: number; readonly frames: number };
  readonly dof?: { readonly focusZ: number; readonly blur: number };
}

export interface TextCue {
  readonly at: number;
  readonly until: number;
  readonly kind: 'title' | 'subtitle' | 'caption' | 'seal';
  readonly key?: string;
  readonly vo?: string;
  readonly style?: 'brush-calligraphy' | 'kaiti' | 'seal';
  readonly orientation?: 'vertical' | 'horizontal';
  readonly x?: number;
  readonly y?: number;
  readonly source?: SourceRef;
}

export interface EffectCue {
  readonly at: number;
  readonly kind: 'fade' | 'flow' | 'distort' | 'metallic' | 'wash' | 'mask' | 'freeze' | 'inkDisperse' | 'bambooBreak';
  readonly layer?: string;
  readonly target?: 'lastStroke' | 'layer';
  readonly frames?: number;
  readonly params?: Readonly<Record<string, unknown>>;
  readonly shape?: { readonly rect?: readonly [number, number, number, number]; readonly polygon?: readonly (readonly [number, number])[] };
  readonly from?: number;
  readonly to?: number;
}

export interface AudioCue {
  readonly at: number;
  readonly bus: 'bgm' | 'amb' | 'sfx' | 'vo';
  readonly asset?: string;
  readonly action?: 'play' | 'stop';
  readonly key?: string;
  readonly gainDb?: number;
  readonly loop?: boolean;
  readonly fadeInFrames?: number;
  readonly fadeOutFrames?: number;
  readonly crossfadeFrames?: number;
  readonly duck?: { readonly bus: 'bgm' | 'amb'; readonly db: number };
}

export interface SyncPoint {
  readonly id: string;
  readonly at: number;
  readonly waitFor: 'vo-end' | 'input' | 'none';
  readonly vo?: string;
  readonly maxWaitFrames?: number;
}

export interface CutsceneDef {
  readonly format: 'inkgames.cutscene';
  readonly version: 1;
  readonly id: string;
  readonly canvas: { readonly width: number; readonly height: number; readonly paper: readonly [number, number, number]; readonly seed: number };
  readonly clock: { readonly fps: 60; readonly mode: 'frame' };
  readonly durationFrames: number;
  readonly layers: readonly { readonly id: string; readonly z: number; readonly kind: 'inkPlane' | 'terrain' | 'screen'; readonly paper?: boolean; readonly transparent?: boolean }[];
  readonly shots: readonly { readonly id: string; readonly from: number; readonly to: number; readonly note?: string }[];
  readonly tracks: {
    readonly strokes: readonly StrokeCue[];
    readonly camera: readonly CameraKey[];
    readonly text: readonly TextCue[];
    readonly effects: readonly EffectCue[];
    readonly audio: readonly AudioCue[];
    readonly sync: readonly SyncPoint[];
  };
  readonly bake?: { readonly allowed: boolean; readonly keyframes: readonly number[] };
}

export interface StringTable {
  readonly locale: 'zh-Hans' | 'zh-Hant' | 'en';
  readonly strings: Readonly<Record<string, string>>;
}

export interface SaveSceneProgress {
  readonly lines: Partial<Record<PlotLine, 'seen' | 'cleared'>>;
  readonly endings: readonly string[];
  readonly grade?: '甲' | '乙' | '丙';
  readonly checkpoint?: { readonly node: string; readonly state: Readonly<Record<string, unknown>> };
}

export interface SaveGame {
  readonly format: 'inkgames.save';
  readonly version: 1;
  readonly createdAt: string;
  readonly scenes: Readonly<Record<string, SaveSceneProgress>>;
  readonly flags: readonly string[];
  readonly cards: readonly string[];
  readonly yiwenlu: readonly string[];
  readonly settings: {
    readonly locale: string;
    readonly subtitles: boolean;
    readonly volume: Readonly<Record<'bgm' | 'amb' | 'sfx' | 'vo', number>>;
  };
}

export interface ChapterIndex {
  readonly format: 'inkgames.chapter-index';
  readonly version: 1;
  readonly chapters: readonly {
    readonly no: string;
    readonly id: string;
    readonly name: string;
    readonly file: string;
    readonly span: string;
    readonly scenes: number;
    readonly v1: number;
    /** Entries with detail 'full'; absent in older indexes. */
    readonly full?: number;
    readonly outline: number;
  }[];
  readonly totals: { readonly chapters?: number; readonly scenes: number; readonly v1: number; readonly full?: number; readonly outline: number };
}

export interface OutlineSceneDef {
  readonly format: 'inkgames.scene-outline';
  readonly version: 1;
  readonly id: string;
  readonly chapter: string;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly when: HistoryDate;
  readonly key: boolean;
  readonly template: string;
  readonly props: readonly string[];
  readonly characters: readonly string[];
  readonly hooks: { readonly canon: string; readonly legend: string; readonly play: string };
  readonly sources: readonly SourceRef[];
  readonly verify: 'done' | 'pending';
  readonly v1?: boolean;
}

export interface CastMember {
  readonly id: string;
  readonly name: string;
  readonly title?: string;
  readonly camp?: string;
  readonly type?: 'ruler' | 'minister' | 'general' | 'scholar' | 'royal' | 'other';
  readonly bio?: string;
}

export interface Relation {
  readonly from: string;
  readonly to: string;
  readonly relation: string;
  readonly type: 'family' | 'sub' | 'ally' | 'rival' | 'mentor' | 'other';
  readonly directed?: boolean;
}

/** v1 marks the first-release ship batch; detail marks content depth (older data: v1 implied full). */
export interface FullSceneEntry {
  readonly outlineId: string;
  readonly v1: boolean;
  readonly detail: 'full';
  readonly example?: string;
  readonly scene: SceneDef;
  readonly opening: CutsceneDef;
  readonly strings: StringTable;
  readonly cast: readonly CastMember[];
  readonly relations: readonly Relation[];
}

export interface OutlineSceneEntry {
  readonly outlineId: string;
  readonly v1: boolean;
  readonly detail: 'outline';
  readonly scene: OutlineSceneDef;
  readonly strings: StringTable;
  readonly cast: readonly CastMember[];
  readonly relations: readonly Relation[];
}

export interface ChapterBundle {
  readonly format: 'inkgames.chapter-bundle';
  readonly version: 1;
  readonly chapter: ChapterDef;
  readonly strings: StringTable;
  readonly scenes: readonly (FullSceneEntry | OutlineSceneEntry)[];
}

export interface ScenePackage {
  readonly scene: SceneDef;
  readonly opening: CutsceneDef;
  readonly strings: StringTable;
}

export interface StoryProgress {
  readonly cleared: ReadonlySet<string>;
  readonly flags: ReadonlySet<string>;
  readonly grades: Readonly<Record<string, '甲' | '乙' | '丙'>>;
}
