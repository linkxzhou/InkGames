# 历史游戏内容数据格式（草案）

> 状态：**格式提案；规划期校验器已可运行**（`video/tools/validate.mjs`，§4.1）。数据：21 章 221 个场景全部为完整场景（`detail: 'full'`），其中首版发布批次 `v1` 66 个（§2.9）。运行时的叙事宿主模块（SceneDirector、StoryRuntime、CutscenePlayer、AudioBus、SaveStore、InkText，演示页 `/story/`）已在 main 上，尚未接入本格式的数据包。故事结构见 [故事与玩法](./story-design.md)，章节表见 [章节大纲](./chapter-outline.md)，运行时与引擎缺口见 [引擎缺口与路线](./engine-gaps.md)。
> 引擎目标是 three.js + Matter.js。本格式只描述内容，不绑定渲染库：笔画、镜头、文字、音频都以“时间轴上的事件”表达，由运行时翻译成 three.js 调用。

## 1. 原则

- **JSON 为正式格式**，按 TypeScript `interface` 定义（与 AGENTS.md 的“对象契约用 interface”一致），构建时由校验器检查。编剧可以用 YAML 写，构建时转成 JSON。
- **一类东西一个文件**：章（`chapter.json`）、场景（`scene.json`）、过场（`*.cutscene.json`）、字符串表（`strings/<locale>.json`）、事件卡与人物卡（`cards/*.json`）。
- **所有可见文字都是字符串键**，不把中文直接写进场景和过场，便于校对、配音对稿和本地化。
- **所有时间都可排序**：历史时间用 `HistoryDate`，动画时间用帧（60 fps 固定时钟）。
- **所有事实都有来源**：正史节点必须有 `sources`，并带 `verify` 状态。
- 内容放在 `apps/history/content/`（AGENTS.md 规定关卡数据属于 `apps/`），运行时代码放 `src/`。

建议目录：

```text
apps/history/
├── content/
│   ├── chapters/zhanguo/chapter.json
│   ├── chapters/zhanguo/scenes/jingke/scene.json
│   ├── chapters/zhanguo/scenes/jingke/opening.cutscene.json
│   ├── cards/events/*.json、cards/people/*.json
│   ├── strings/zh-Hans.json、strings/zh-Hant.json、strings/en.json
│   └── timeline.json            # 由章与场景生成，不手写
├── audio/{bgm,amb,sfx,vo/<locale>}/*.ogg
└── fonts/                       # 子集化字体（许可证登记到 THIRD_PARTY_NOTICES.md）
```

## 2. 类型定义

以下是提案，落地时放进 `src/` 的内容运行时模块并从 `src/index.ts` 导出。

### 2.1 历史时间与来源

```ts
/** 公元纪年：负数为公元前，没有 0 年（-227 = 前 227 年）。 */
export interface HistoryDate {
  readonly start: number;
  readonly end?: number;
  /** legend：传说时代，只用于排序；circa：约数。 */
  readonly precision: 'day' | 'month' | 'year' | 'circa' | 'legend';
  /** 界面显示文字，例如“前 227 年”“约前 1600 年”。 */
  readonly display: string;
  /** 中国纪年，例如“秦王政二十年”。 */
  readonly era?: string;
  readonly verify: 'done' | 'pending';
  readonly notes?: string;
}

export interface SourceRef {
  /** canon 正史原典；excavated 出土文献；novel 演义小说；biji 笔记；folk 民间传说；opera 戏曲；modern 现代作品；
   *  classic 其他古籍（诸子、文集、诗文、兵书、别史，如《庄子》《贞观政要》《纪效新书》《圆圆曲》） */
  readonly kind: 'canon' | 'excavated' | 'novel' | 'biji' | 'folk' | 'opera' | 'modern' | 'classic';
  readonly title: string;
  readonly section?: string;
  /** 本地语料库定位（只作研究线索，不随发布物分发）。 */
  readonly corpus?: { readonly file: string; readonly pages: string };
  readonly notes?: string;
}
```

### 2.2 章

```ts
export interface ChapterDef {
  readonly format: 'inkgames.chapter';
  readonly version: 1;
  readonly id: string;                 // 'zhanguo'
  readonly order: number;
  readonly title: string;              // 字符串键
  readonly span: HistoryDate;
  readonly scenes: readonly string[];  // 场景 id，按时间排
  readonly keyScenes: readonly string[];
  readonly unlock: Condition;          // 例：{ all: [{ cleared: 'qin.*/canon', count: 2 }] }
  readonly look?: { readonly palette?: readonly string[]; readonly paper?: readonly [number, number, number] };
}
```

### 2.3 场景、锚点、剧情图

```ts
export type PlotLine = 'canon' | 'legend' | 'whatif';

export interface TimelineAnchor {
  readonly id: string;
  readonly title: string;
  readonly when: HistoryDate;
  readonly sources: readonly SourceRef[];
}

export interface SceneDef {
  readonly format: 'inkgames.scene';
  readonly version: 1;
  readonly id: string;                 // 'zhanguo.jingke'
  readonly chapter: string;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly when: HistoryDate;
  readonly key: boolean;
  readonly template: string;           // 主玩法模板，取值见 §2.9
  readonly props: readonly string[];   // 用到的道具/笔刷预设
  readonly characters: readonly string[];
  readonly anchors: { readonly entry: TimelineAnchor; readonly exit: TimelineAnchor };
  readonly opening: string;            // 过场 id
  readonly fork: { readonly at: string; readonly prompt: string };
  readonly plot: PlotGraph;
  readonly endings: readonly EndingDef[];
  readonly coda: CodaDef;
  readonly verify: 'done' | 'pending';
}

export interface PlotGraph {
  readonly start: string;
  readonly nodes: readonly PlotNode[];
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
  /** 野史节点开头必须展示的出处声明（字符串键）。 */
  readonly label?: string;
  readonly setFlags?: readonly string[];
  readonly sources?: readonly SourceRef[];
  readonly notes?: string;
}

export interface ChoiceDef {
  readonly id: string;
  readonly label: string;
  readonly seal: PlotLine;
  readonly to: string;
  readonly requires?: Condition;
}
```

### 2.4 结局与史评

```ts
export interface EndingDef {
  readonly id: string;
  /** canon 正史；legend 野史；divergent 歧出（记入异闻录）；fail 玩法失败 */
  readonly kind: 'canon' | 'legend' | 'divergent' | 'fail';
  readonly title: string;
  readonly cutscene?: string;
  /** 汇流：回到哪个正史锚点。legend 结局写了 mergeTo 就是汇流，没写就按歧出处理。 */
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
```

### 2.5 条件

```ts
export interface Condition {
  readonly all?: readonly Condition[];
  readonly any?: readonly Condition[];
  readonly not?: Condition;
  /** 'zhanguo.jingke/canon'：某场景某条线已通关；支持 '*' 通配。 */
  readonly cleared?: string;
  readonly count?: number;
  readonly flag?: string;
  readonly grade?: { readonly scene: string; readonly atLeast: '甲' | '乙' | '丙' };
}
```

### 2.6 过场（开场动画）

过场是一组按帧排列的轨道，由 [12 §2](./engine-gaps.md#2-开场动画管线) 的过场播放器执行。

```ts
export interface CutsceneDef {
  readonly format: 'inkgames.cutscene';
  readonly version: 1;
  readonly id: string;
  /** 墨面渲染目标的像素尺寸、纸色、随机种子。 */
  readonly canvas: { readonly width: number; readonly height: number; readonly paper: readonly [number, number, number]; readonly seed: number };
  readonly clock: { readonly fps: 60; readonly mode: 'frame' };
  readonly durationFrames: number;
  /** z 沿用 inkEngine 的层深（-80 / 0 / 40 / 120），在 three.js 里映射为墨面平面的世界 Z。 */
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
  /** 允许运行时在关键帧缓存墨面纹理，用于跳过、回看和低端机。 */
  readonly bake?: { readonly allowed: boolean; readonly keyframes: readonly number[] };
}

export interface StrokeCue {
  readonly at: number;
  readonly layer: string;
  /** live：每帧推进一个指针点（看得见“画”的过程）；instant：在一帧内画完（等价于现在的 strokePath）。 */
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
  readonly key?: string;     // 字符串键
  readonly vo?: string;      // 字幕跟随的旁白键
  readonly style?: 'brush-calligraphy' | 'kaiti' | 'seal';
  readonly orientation?: 'vertical' | 'horizontal';
  readonly x?: number;
  readonly y?: number;
  readonly source?: SourceRef; // 引用古籍原文时必填
}

export interface EffectCue {
  readonly at: number;
  readonly kind: 'fade' | 'flow' | 'distort' | 'metallic' | 'wash' | 'mask' | 'freeze' | 'inkDisperse' | 'bambooBreak';
  readonly layer?: string;
  readonly target?: 'lastStroke' | 'layer';
  readonly frames?: number;
  readonly params?: Readonly<Record<string, unknown>>;
  readonly shape?: { readonly rect?: readonly [number, number, number, number]; readonly polygon?: readonly (readonly [number, number])[] };
}

export interface AudioCue {
  readonly at: number;
  readonly bus: 'bgm' | 'amb' | 'sfx' | 'vo';
  readonly asset?: string;
  readonly action?: 'play' | 'stop';
  readonly key?: string;           // vo 的字符串键，用于字幕和对稿
  readonly gainDb?: number;
  readonly loop?: boolean;
  readonly fadeInFrames?: number;
  readonly fadeOutFrames?: number;
  readonly crossfadeFrames?: number;
  readonly duck?: { readonly bus: 'bgm' | 'amb'; readonly db: number };
}

/** 同步点：画面在这里等声音或输入，保证不同机器、不同语言的配音长度都能对上。 */
export interface SyncPoint {
  readonly id: string;
  readonly at: number;
  readonly waitFor: 'vo-end' | 'input' | 'none';
  readonly vo?: string;
  readonly maxWaitFrames?: number;
}
```

### 2.7 字符串表

```ts
export interface StringTable {
  readonly locale: 'zh-Hans' | 'zh-Hant' | 'en';
  readonly strings: Readonly<Record<string, string>>;
}
```

键名规则：`scene.<sceneId>.<用途>`、`vo.<序号>`（场景内）、`anchor.<id>`、`card.<id>.<字段>`。

### 2.8 存档与进度

```ts
export interface SaveGame {
  readonly format: 'inkgames.save';
  readonly version: 1;
  readonly createdAt: string;   // ISO 时间
  readonly scenes: Readonly<Record<string, {
    readonly lines: Partial<Record<PlotLine, 'seen' | 'cleared'>>;
    readonly endings: readonly string[];
    readonly grade?: '甲' | '乙' | '丙';
    readonly checkpoint?: { readonly node: string; readonly state: Readonly<Record<string, unknown>> };
  }>>;
  readonly flags: readonly string[];
  readonly cards: readonly string[];
  readonly yiwenlu: readonly string[];  // 异闻录里已点亮的歧出结局
  readonly settings: { readonly locale: string; readonly subtitles: boolean; readonly volume: Readonly<Record<'bgm' | 'amb' | 'sfx' | 'vo', number>> };
}
```

存档带版本号，升级时按版本跑迁移函数，迁移函数要有单测。

### 2.9 章节数据包、索引与大纲级场景

规划阶段的数据放在 `video/data/chapters/`，每章一个文件，外加一个索引。落地到运行时以后，可以按 §2.2–§2.7 把一个数据包拆成章、场景、过场和字符串表四类文件。

```ts
/** chapters/index.json */
export interface ChapterIndex {
  readonly format: 'inkgames.chapter-index';
  readonly version: 1;
  readonly chapters: readonly {
    readonly no: string;          // '05'
    readonly id: string;          // 'zhanguo'
    readonly name: string;        // '战国'
    readonly file: string;        // 'chapters/05-zhanguo.json'
    readonly span: string;        // 显示用的起止年
    readonly scenes: number; readonly v1: number; readonly full: number; readonly outline: number;
  }[];
  readonly totals: { readonly scenes: number; readonly v1: number; readonly full: number; readonly outline: number };
}

/** chapters/NN-<id>.json */
export interface ChapterBundle {
  readonly format: 'inkgames.chapter-bundle';
  readonly version: 1;
  readonly chapter: ChapterDef;           // §2.2
  readonly strings: StringTable;          // 章级字符串（章名等）
  readonly scenes: readonly (FullSceneEntry | OutlineSceneEntry)[];  // 按章内顺序
}

/** 完整场景：深度与 §3 的易水寒样例相同 */
export interface FullSceneEntry {
  readonly outlineId: string;             // 大纲行号，如 '05-09'
  readonly v1: boolean;                   // 是否属于首版发布批次（与深度无关）
  readonly detail: 'full';
  readonly example?: string;              // 只有易水寒：指回 ../05-09-zhanguo-jingke.json（内容须完全一致）
  readonly scene: SceneDef;               // §2.3
  readonly opening: CutsceneDef;          // §2.6
  readonly strings: StringTable;          // 本场景全部字符串
  readonly cast: readonly CastMember[];   // 人物关系图用
  readonly relations: readonly Relation[];
  readonly artPrompts: readonly ArtPromptSegment[];  // 水墨素材提示词，见 §2.10
}

/** 大纲级场景：只有钩子，不做剧情图和过场 */
export interface OutlineSceneEntry {
  readonly outlineId: string;
  readonly v1: boolean;
  readonly detail: 'outline';
  readonly scene: {
    readonly format: 'inkgames.scene-outline';
    readonly version: 1;
    readonly id: string; readonly chapter: string; readonly order: number;
    readonly title: string; readonly subtitle: string;  // 字符串键
    readonly when: HistoryDate;
    readonly key: boolean;
    readonly template: string;
    readonly props: readonly string[];
    readonly characters: readonly string[];
    readonly hooks: { readonly canon: string; readonly legend: string; readonly play: string };  // 字符串键
    readonly sources: readonly SourceRef[];
    readonly verify: 'done' | 'pending';
  };
  readonly strings: StringTable;
  readonly cast: readonly CastMember[];
  readonly relations: readonly Relation[];
  readonly artPrompts: readonly ArtPromptSegment[];  // 水墨素材提示词，见 §2.10
}

/** 与 history-santi 关系图模板（05-09-jingke-relations.html）的 DATA 字段一致 */
export interface CastMember {
  readonly id: string; readonly name: string; readonly title?: string; readonly camp?: string;
  readonly type?: 'ruler' | 'minister' | 'general' | 'scholar' | 'royal' | 'other';
  readonly bio?: string;
}
export interface Relation {
  readonly from: string; readonly to: string; readonly relation: string;
  readonly type: 'family' | 'sub' | 'ally' | 'rival' | 'mentor' | 'other';
  readonly directed?: boolean;
}
```

**v1 与 detail 的决定（2026-10）**。早期数据里 `v1: true` 同时表示“首版发布批次”和“完整深度”，`v1: false` 一律是大纲级。全部 157 个场景都写成完整场景以后，这两个含义必须拆开：

- `v1` 只表示**首版发布批次**（ship batch），仍是原来的 66 个场景，不随内容深度变化。首版的玩法、美术与配音排期只按这 66 个做。
- 新增 `detail: 'full' | 'outline'` 表示内容深度。`full` 条目必须是 `inkgames.scene` 并带开场过场、字符串表与人物关系；`outline` 条目只有钩子（结构保留，供以后新增场景先占位）。
- 索引的每章与 `totals` 增加 `full` 计数；`outline` 计数改为按 `detail` 统计。缺少 `detail` 的旧数据按 `v1` 推断深度，以保持兼容。
- 当前数据：221 个场景全部 `detail: 'full'`，其中 `v1: true` 66 个，`outline` 0 个。

**正史引子**。完整场景的正史线可以在分叉后先接一个 `kind: 'dialogue'` 的引子节点（`c.intro`），用一段旁白交代背景，再进入第一个玩法节点。第二条线同理可以有可选的 `alt` 分支（`choice` 节点分出两段野史/演义异文，最后都落到第二条线的结局）。

**玩法模板**（`template`）取值：tutorial、duel、battle、siege、naval、engineering、journey、court、riddle、forest、stealth、dialogue-timing、riddle-escape、breakout、cavalry、calligraphy、banquet、ambush、night-raid、finale、trace、survival、evacuate。玩法节点的 `params` 至少要有 `goal`、`beats` 或 `clues` 之一。

**第二条线的类型**。剧情线字段仍是 `line: 'legend'`，但选项文字的前缀要标明来源性质：

| 前缀 | 含义 | 典型来源 kind |
|---|---|---|
| 野史 | 传说、民间故事、神话、笔记轶闻 | folk、biji、classic |
| 演义 | 明清小说、蔡东藩历朝演义（蔡东藩卒于 1945 年，作品在中国已进入公有领域；本项目仍只引书名回目，不录原文） | novel |
| 异说 | 出土文献或别史与正史不同的记载 | excavated、classic |
| 后世 | 后人的接受、评价与改写 | classic、opera、modern |

第二条线的第一个节点必须带 `label`（声明文字）。结局与出口锚点一致的写 `mergeTo`（汇流）；与史实冲突的写 `kind: 'divergent'` 并 `archive: 'yiwenlu'`（如牧野之战的《封神演义》线）。推演（whatif）首版只留入口，要求正史与第二条线都通关后才显示。

### 2.10 水墨素材提示词（artPrompts）

每个场景（不论 `v1`、`detail`）都带一个 `artPrompts` 数组，用来把这一场的**水墨素材**交给文生图模型（`gpt-image-2.5`）批量出图：**一段 = 一张图 = 一个 4×4 以内的网格**，格内每件素材独立完整、透明背景，便于后续按格抠成精灵图。一个场景按分类分段，**同一分类超过 16 件再拆成多段**。

```ts
export type ArtCategory = 'cast' | 'props' | 'scenery' | 'effects';   // 人物立绘 / 道具器物 / 场景环境 / 水墨特效
export type ArtKind = 'figure' | 'prop' | 'scenery' | 'fx';

export interface ArtSheetSpec {
  readonly model: string;                        // 创作目标 'gpt-image-2.5'，非已核实的 API 模型 ID
  readonly apiVerified: false;                   // 未验证模型 ID、实际可用尺寸与透明输出
  readonly sizePx: readonly [number, number];    // 规划裁切尺寸 = 网格行列数 × cellPx，非 API 请求尺寸
  readonly cellPx: number;                       // 单格像素
  readonly background: 'transparent';            // 一律透明背景，无纸纹无底色
  readonly cutout: boolean;                      // 是否按格抠图
}

export interface ArtAsset {
  readonly slot: number;                         // 1..16，网格阅读顺序（自上而下、自左而右）
  readonly id: string;                           // 稳定 id，抠图产物按它登记
  readonly name: string;                         // 素材名（中文）
  readonly kind: ArtKind;
  readonly note?: string;                        // 造型提示，随提示词一起给模型
  /** 指向现有笔刷预设，抠图产物可与引擎对齐（见 src/plugins/prop-brushes.ts）。 */
  readonly ref?: { readonly prop: string; readonly parts?: readonly string[]; readonly actor?: string };
}

export interface ArtPromptSegment {
  readonly id: string;                           // 'zhanguo.jingke.sheet.cast.1'，不与素材 id 冲突
  readonly category: ArtCategory;
  readonly categoryLabel: string;                // 中文分类名，直接展示
  readonly segment: number;                      // 同分类内段号，从 1 开始
  readonly segmentsInCategory: number;           // 同分类总段数
  readonly grid: { readonly cols: number; readonly rows: number };
  readonly assets: readonly ArtAsset[];          // ≤ 16
  readonly prompt: string;                       // 完整中文提示词（含题材、画风、透明背景、逐格清单）
  readonly negative: string;                     // 负面提示词
  readonly spec: ArtSheetSpec;
}
```

生成与维护：

- 规划数据由 `video/tools/build-art-prompts.mjs` 按场景生成并写回 `chapters/*.json`（幂等；改完数据再跑一次即可）。它从场景的 `cast`、`props`、过场笔画的 `label`/来源、玩法 `template` 与章节 `look.palette` 推导素材，并合成提示词；少量场景还有显式必备/排除素材名单。笔刷预设不等同于史实器物，未知短标签不自动当道具；其他场景仍需逐场人工审核。
- 分类固定为 `cast / props / scenery / effects` 四类；没有素材的分类不产生段，因此大多数场景是 3–4 段。
- `ref.prop` / `ref.parts` 用现有预设键（`sword`、`blade`、`banner`… 与其部件），`ref.actor` 用 `cast[].id`，方便抠图产物登记回引擎。
- 画风基准是「写意水墨 + 焦墨/浓墨/淡墨分层 + 枯笔飞白 + 泼墨墨点飞溅，点缀色克制」，点缀色取章节 `look.palette`（对应 `src/core/ink-palette.ts` 的中文名与 RGB），不与具体某一幅参考图绑定。`grid` × `cellPx` 严格等于 `sizePx`（少量素材以空格补足至少 2 行）；按行列裁切前必须确认实际返回尺寸/alpha，必要时等比缩放加透明补边，不能直接把 `sizePx` 当作 API 的 `size` 传入。

### 2.11 水墨视频生成提示词（videoPrompt）

每个完整场景带一个 `videoPrompt`，给 AI 视频生成器用（用户把提示词贴进生成器出片）。它由 `node video/tools/build-video-prompts.mjs` 从场景自己的数据推出，**不手写**，所以和场景保持一致：

| 来源 | 推出的内容 |
|---|---|
| `opening.shots` | 镜头 1–5：时长、动作（分镜 note） |
| `opening.tracks.camera` 的 `label` | 运镜（still 固定远景、pan 横移、push 推近、shake 震动、climax 急推定格） |
| `opening.tracks.strokes` 的图层与 `label` | 构图（far 远景 / sheet 中景 / actors 主体 / overlay 飞白题字）；`label` 与 `cast[].name` 相同的算出场人物 |
| `opening.tracks.effects` | 水墨效果（淡入、晕染、墨散、金属寒光、定格……），镜与镜之间统一用墨晕转场 |
| `opening.tracks.audio` | 背景乐乐器与情绪、环境声、音效 |
| `opening.tracks.text` + `strings` | 旁白（普通话）、片名、朱印、引文字幕 |
| `scene.endings` 中 `kind: 'canon'` 的结局 | 镜头 6：正史结局（拉远收束） |
| 引文 `scene.<id>.quote` 与 caption 的 `source` | 镜头 7：落款（引文逐字写出、朱印落下） |
| `cast` + 章 `order` | 人物造型：按朝代、阵营（匈奴/契丹/蒙古等另有装束）、身份推定服饰；年龄依史实，`title`/`bio` 里写明“少年”“老将”的照写 |
| `chapter.look.palette` | 点缀色 |

```ts
interface Bilingual { zh: string; en: string }
interface VideoPrompt {
  version: 1;
  generator: 'video/tools/build-video-prompts.mjs';
  aspectRatio: '16:9';            // 横屏；竖屏 9:16 时主体居中（提示词里有说明）
  resolution: [1920, 1080];
  fps: 24;
  durationSec: number;            // = 各镜 durationSec 之和（开场 90 秒 + 结局 10 秒 + 落款 6 秒）
  style: Bilingual;               // 宣纸、五色墨、飞白泼墨、留白、朱砂点缀
  setting: Bilingual;             // 朝代、年号、年份、时代场景细节
  characters: { id: string; name: string; nameEn: string; onScreen: boolean; zh: string; en: string }[];
  shots: {                        // 5–8 个（目前固定 7 个）
    n: number; startSec: number; durationSec: number;
    figures: string[];            // 出镜人物，cast id
    vo: string;                   // 本镜旁白（中文）
    zh: string; en: string;       // 单镜完整提示词：运镜｜构图｜动作｜水墨效果｜声音｜屏幕文字｜旁白
  }[];
  sound: Bilingual;
  onScreenText: Bilingual;
  negative: Bilingual;            // 负面提示词，含按朝代的时代错置项
  narration: string[];            // 全部旁白，按镜头顺序
  prompt: Bilingual;              // 整段可直接粘贴的完整提示词
}
```

- 英文版人名用 `video/tools/name-pinyin.json`（`gen-name-pinyin.py` 用 pypinyin 生成，复姓、外族名、公主/皇后等另有修正）；表里没有的名字保留中文。镜头动作、旁白和屏幕文字在英文版里保留中文原文，因为这些文字要原样出现在画面或配音里。
- 查看器的“水墨视频提示词”面板：中/英切换，整段复制、单镜复制，导出本章或全部场景为 Markdown / JSON。
- 校验器检查：每个有开场的场景都有 `videoPrompt`；`prompt`、`negative` 中英俱全；镜头 5–8 个、时间连续、时长之和等于 `durationSec`；出镜人物都在 `cast` 里。
- 和 `artPrompts` 一样，`videoPrompt` 只服务创作，运行时不读（`FullSceneEntry.videoPrompt` 为可选字段）。

## 3. 完整样例：易水寒 · 荆轲刺秦王

完整文件见 [`video/data/examples/05-09-zhanguo-jingke.json`](../data/examples/05-09-zhanguo-jingke.json)，里面有场景定义、开场动画脚本和中文字符串表。下面讲它的结构。（该样例只覆盖 `scene` / `opening` / `strings`，所以不含 §2.10 的 `artPrompts`；`artPrompts` 挂在 `chapters/*.json` 的场景条目上，易水寒那一场在 [`05-zhanguo.json`](../data/chapters/05-zhanguo.json) 里可查。）

### 3.1 史源

| 来源 | 类型 | 用在哪里 |
|---|---|---|
| 《史记·刺客列传》 | 正史原典 | 正史线全部节点；易水歌原句（公有领域，标出处） |
| 《战国策·燕策三》 | 正史类原典 | 开场背景 |
| 《史记·秦始皇本纪》 | 正史原典 | 出口锚点：秦破蓟城（年份待核验） |
| 《燕丹子》 | 笔记（成书年代有争议，待核验） | 野史线：乌头白马生角、琴声三问 |
| 《东周列国志》第一百六、一百七回 | 古典演义（公有领域） | 野史线的叙事参考。本地 PDF 物理页 p.439–447，已确认含“乌头”“马生角”（p.439）、“屏风”“鹿卢”“铜柱”（p.444–445）等情节词 |
| 人物关系网 | history-santi 产物 | [`05-09-jingke-relations.html`](../viewer/05-09-jingke-relations.html)（据《东周列国志》，页码可回溯） |

### 3.2 剧情图

```text
[入口锚点] 太子丹自秦亡归（约前 232，待核验）
      │
  opening（过场，正史）── 易水送别 → 咸阳宫 → 图穷匕见（停在岔口）
      │
    fork（抉择）
   ┌──┴───────────────┬───────────────────────┐
 正史                  野史                     推演（两线都通关后解锁，切片中只留入口）
   │                     │                        │
 c.audience 殿前献图      l.zither 琴声（过场，     w.stub → 异闻结局（歧出，记入异闻录）
 （对话与时机，检查点）    开头声明“野史所载”）
   │                     │
 c.pillar 绕柱（决斗，     l.escape 玩家扮秦王解三问：
 结局固定为“不中”，        绝袖（刀扫）→ 越屏风（跳跃）
 墨评看过程）              → 负剑拔剑（时机）
   │                     │
 end.canon               end.legend
   └──────┬──────────────┘
      汇流到出口锚点：秦破蓟城（前 226，待核验）
```

要点：

- **正史线不能改结果**。`c.pillar` 的 `scriptedOutcome: "miss"` 让决斗按史实结束：玩家能影响的是追击路线、闪避、药囊与“王负剑”两处节拍的发现（寻迹），这些计入墨评。
- **野史线换视角**。玩家扮秦王，三道琴声线索对应三个动作：刀扫断袖、跳越屏风、背剑拔出。这三个动作分别复用 blade、跳跃、sword 的手感。
- **两条线都汇流**。野史线结局与史实一致（荆轲死），`mergeTo` 指向同一出口锚点，时间线上朱线并回墨线。
- **推演线只留接口**，用来验证解锁条件和异闻录。

### 3.3 开场动画（90 秒，5400 帧）

| 镜头 | 帧 | 画面（笔画轨） | 镜头 | 文字 | 声音 |
|---|---|---|---|---|---|
| s1 题卷 | 0–600 | 纸面淡入；`landscape.farHill` 在远层逐帧画出，近山与地面随后 | 静止 | 竖排题字「易水寒」，印章「秦王政二十年」 | 筑主题曲淡入，原野风声 |
| s2 燕宫 | 600–1560 | 两个 `figure`（太子丹、荆轲）；匣与地图卷用单笔描出 | 缓慢左移 | 旁白 vo.01、vo.02 字幕 | 旁白压低配乐 |
| s3 易水 | 1560–3000 | `water` 整段水面（flow 收笔）；`banner` 表现衣袂与风；白衣送行者；`water.crest` 白色飞白作寒水 | 右移 | vo.03；竖排引《史记》易水歌 | 河水环境声；击筑一声 |
| s4 咸阳宫 | 3000–4680 | `sword.ridge` 两笔立铜柱；秦王 `figure`；匕首（`sword` 的刃与锋，metallic 收笔） | 推近 1.05 倍，秦舞阳色变时轻微抖动 | vo.04 | 配乐收住，宫殿空响，心跳 |
| s5 匕现 | 4680–5400 | `sword.slash` 一笔飞白横贯画面；整幅 distort 60 帧；四周遮罩压暗 | 推到 1.1 倍并开景深 | vo.05“展到尽头——” | 拔匕声；静默 |
| 岔口 | 5400 | 定格 | — | 两方印章：「正史 · 《史记》所载」「野史 · 琴声三问」 | 等待输入 |

同步点：vo.02、vo.04 结束前画面最多等 120 帧；岔口等输入。

旁白全部是原创文字，只有易水歌原句引自《史记》（公有领域），并在 `caption.source` 里写明出处。

## 4. 校验与测试

### 4.1 内容校验器（构建期，`./build.sh check` 的一部分）

规划阶段已有一个可运行的版本：`video/tools/validate.mjs`（Node，无依赖）。在 `video/` 下运行 `node tools/validate.mjs`，加 `--pending` 列出全部待核验的日期与出处。它实现了下表中除“版权”“字形”“发布构建核验”以外的检查，另外检查：索引与数据包一致、易水寒条目与样例文件完全相同、笔刷键 `prop.part` 与调色板颜色名存在、画面坐标在画布内、`whatif` 选项带条件、人物关系引用的人物存在、每个场景的 `artPrompts` 合法（§2.10）、`v1` 为布尔值且 `detail` 只取 `full`/`outline`、`detail: full` 的条目是完整场景、索引的 `full`/`outline` 计数与数据包一致、正史节点的 `when.start` 落在入口与出口锚点之间。“待核验”计数只统计 `precision: 'pending'` 的日期和 `section`/`notes` 里写着“待核验/待核对”的来源；场景级的 `verify: 'pending'`、`reviewers: null` 是人工复核标记，不计入。与下表的差异：章与章之间不检查起始年先后（辽金与北宋重叠）；玩法节点只要求 `goal`/`beats`/`clues` 之一。

| 检查 | 规则 | 失败级别 |
|---|---|---|
| 格式 | 每个文件的 `format` / `version` 已知；字段类型正确 | 错误 |
| 引用 | 所有 id 引用（场景、过场、结局、锚点、字符串键、音频文件、道具预设、笔刷键 `prop.part`）都存在 | 错误 |
| 剧情图 | 从 `start` 可达每个节点；无环；每个非结局节点有出边；每条线至少一个结局 | 错误 |
| 线规则 | `canon` 节点不能指向 `legend`/`whatif` 节点（只能由 `choice` 分出）；`canon` 结局必须 `mergeTo` 出口锚点 | 错误 |
| 时间 | 节点 `when` 不早于入口锚点、不晚于出口锚点；章内场景按 `when.start` 有序 | 错误 |
| 来源 | `canon` 节点至少一条 `kind: canon/excavated` 的来源；`legend` 节点至少一条来源和一个 `label` 声明 | 错误 |
| 核验 | 发布构建拒绝 `verify: pending` 的正史节点与锚点；开发构建只警告并统计 | 发布错误 |
| 版权 | 字符串表里连续 ≥ 15 字与语料库文本重合的句子报错（本地运行，语料不入库；见 §4.3） | 错误 |
| 过场 | 帧号在 `[0, durationFrames]` 内；镜头不重叠；每条 vo 有字幕；同步点引用的 vo 存在 | 错误 |
| 字幕长度 | 横排每行 ≤ 18 字，竖排每列 ≤ 12 字（见 [故事与玩法 §6.5](./story-design.md#65-文风与长度)） | 警告 |
| 素材提示词 | 每个场景都有 `artPrompts`；分类合法、段号连续、网格 ≤ 16 格且装得下素材、`slot` 连续、图段/素材 id 互不冲突、`ref.prop`/`ref.parts` 是已知笔刷键、`ref.actor` 在 cast 里、`prompt` 包含网格描述及素材名、`spec.background` 为 `transparent`、`apiVerified` 标记为 `false`、`sizePx` 等于网格 × `cellPx`、每个 cast 成员都有立绘素材 | 错误 |
| 字形 | 所有字符串里的字都在子集化字体里 | 错误 |

### 4.2 单元测试（vitest）

- 剧情运行时：选择、条件、汇流与歧出、检查点恢复、存档迁移。
- 时间线生成：给定章与场景，生成的节点顺序、三条线的分叉和汇流位置。
- 过场调度：固定时钟下第 N 帧派发的事件序列稳定；同步点等待与超时；跳过到关键帧时状态一致。
- 样例文件 `05-09-zhanguo-jingke.json` 作为测试夹具，必须通过校验。

### 4.3 版权比对工具（本地）

`scripts/` 下加一个只在本地运行的比对脚本：读取 `thirdparty/Chinese_History-master/` 的逐页文本（按 history-santi 的 PDF 转换规范生成，不入库），对字符串表做 n-gram 重合检测。公开仓库的 CI 没有语料，跳过这一步并提示。

### 4.4 浏览器验证

过场的确定性回放用无头浏览器逐关键帧截图，与基线比对。按 AGENTS.md，无头 SwiftShader 的结果不代表真实 GPU，性能结论必须在真实显卡上测，没测的写“未实测”。

### 4.5 数据浏览页

`video/viewer/index.html` 按章、按场景显示时间轴、剧情树（正史主干、第二条线、推演入口、汇流或归档）、人物关系图（沿用 `05-09-jingke-relations.html` 的样式与类型配色）、开场分镜、音频提示，以及底部的**水墨素材提示词**卡片：按分类分页签列出该场景的全部段（`artPrompts`），每段显示网格、出图尺寸/模型、逐格清单、完整提示词与负面提示词，并可一键复制单段或整场（多段一并展示）。页面不使用 `fetch`，可以直接双击用 file:// 打开：数据由 `node tools/build-viewer-data.mjs` 从 `chapters/*.json` 生成到 `data/*.js`（设置 `window.HISTORY_GAME_INDEX` 和 `window.HISTORY_GAME_CHAPTERS`），用 `<script>` 标签加载，不依赖外部库与网络。素材提示词数据本身由 `node tools/build-art-prompts.mjs` 写入 `chapters/*.json`，两步都跑完页面才看得到最新内容。
