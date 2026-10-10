# 04 · 道具与模块

[目录](./README.md) · [上一章](./03-clocks.md) · [下一章](./05-world-scene-and-assets.md)

「插件」这个词在仓库里只剩一层意思：**道具笔刷表**。曾经的 v0.1 能力插件图（`EnginePlugin`、服务 token、`resolvePlugins`、`PluginManifest`）已随 `src/core/engine.ts`、`types.ts`、`plugin-graph.ts`、`plugins/tokens.ts` 删除。

## 模块划分

| 目录 | 内容 |
|---|---|
| `src/core/` | 引擎内核：笔刷、调色、墨面、分件墨层、物理与玩法、三项画面、叙事宿主、时钟、内容解析 |
| `src/plugins/` | 道具笔画：`prop-brushes.ts`、`prop-paintings.ts`、`history-paintings.ts`、`history-props.ts`、`items.ts` |
| `apps/` | 首页、横版切片、叙事宿主、历史动画、参照画廊、`props/<id>/` 二十个道具页 |
| `tests/` | 纯逻辑单测，不创建 GL |

新增公共能力只从 `src/index.ts` 导出，对象契约用 TypeScript `interface`。

## 道具元数据：`ItemPreset`（`src/plugins/items.ts`）

```ts
interface ItemPreset {
  readonly id: string;
  readonly version: '1.0.0';
  readonly action: ItemAction;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly effects: readonly string[];
  readonly accent: number;
  readonly actionLabel: string;
  readonly hint: string;
}
```

`ItemAction` 是 `'swing' | 'thrust' | 'projectile' | 'guard' | 'gallop' | 'wind' | 'blast' | 'erase' | 'wake'`。`validateItemPreset` 要求 id 为 kebab-case、版本恰好 `'1.0.0'`、`accent` 在 `0..0xffffff`、效果不重复且落在允许集合里，并且动作必须带上对应效果（例如 `erase` 必须含 `erosion`）。`getItemPreset` 找不到 id 会抛 `Unknown item`。

十个 id：`sword`、`blade`、`spear`、`bow`、`shield`、`war-horse`、`banner`、`ink-bomb`、`water-brush`、`boat`。

原先各自一页的十卡演示（`apps/sword/` 等）已删除，`InkStage` 的 `switch (item.action)` 行为也随 `InkStage` 一起删除。这十个 id 仍是笔刷表。历史章节另外用 `HISTORY_PROPS` 的二十个 id，页面在 `apps/props/<id>/`。七个直接复用上表（剑、刀、矛、盾、旗、马、水），其余十三件的笔刷在 `history-paintings.ts`，每件部件各自的 mode、size、effect、color、speed 不同。物理动词在道具页里由 Matter.js 演示，不是十卡舞台的 `ItemAction`。

## 笔刷表：`PROP_BRUSHES`（`src/plugins/prop-brushes.ts`）

每个道具按部件给一行：

```ts
interface PropBrush {
  readonly mode: InkBrushMode;
  readonly size: InkSizeName;
  readonly effect: InkEffect;      // mix / wet / effect4 / hair / sharpen / flyingWhite …
  readonly blend: InkBlend;
  readonly color: InkColorName;
  readonly speed: number;          // 每帧指针位移
  readonly pressure?: number;      // 数位板 0..1
  readonly finish?: InkFinish;     // flow / distort / metallic
}
```

`PropPaintingId` 覆盖十个道具，外加背景用的 `landscape`、`water`、`figure`。`paintProp(id, placement)` 用 `src/plugins/prop-paintings.ts` 里的折线生成一组 `PropStroke`；`actionStroke(id, part, path, seed)` 复用同一部件的笔刷参数但换成自定义路径。`resolveStrokeCue(cue)`（`src/core/stroke-cues.ts`）把 `video/data/` 的过场 JSON 提示收成 `PropStroke[]`：`{ prop, placement }` 走 `paintProp`，`{ brush: '道具.部件', path, speed }` 走 `actionStroke` + `samplePolyline`。

`finish` 由 `StoryStage` 在收笔脉冲上应用一次（`endOfStroke`），写入 `InkSurface` 的 flow / distort / metallic。

## 已导出、可供页面调用的模块

- 画布与渲染：`InkView`、`StoryStage`、`InkScene`、`CameraRig`、`InkSurface`。
- 物理与玩法：`Playfield`、`InkWorld`。
- 三项画面：`TerrainSeep`、`createCunRock`、`BambooView`。
- 叙事宿主：`SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`AudioBus`、`InkText`、`SaveStore`。
- 内容解析：`parseScenePackage`、`parseChapterBundle`、`parseChapterIndex`、`conditionMet`、`resolveStrokeCue`。
- 表现数据：`validatePresentation`、`poseAt`。

坡度行走、击退、扫掠和砍断写在 `Playfield` 的方法上，没有单独的 `ActorController` / `Combat` 类。皴法在 `src/core/cun-material.ts`，竹的显示在 `src/core/bamboo-rig.ts` 的 `BambooView`。

还没有类的名字：`PostStack`、`defineGameplay`。过场效果由 `StoryStage` 直接写到墨面。历史游戏的优先级仍以 [video/docs/engine-gaps 的缺口表](../video/docs/engine-gaps.md#3-引擎缺口清单) 为准。
