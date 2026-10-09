# 04 · 插件与道具

[目录](./README.md) · [上一章](./03-microkernel-and-loop.md) · [下一章](./05-world-scene-and-assets.md)

> 本章前半描述十卡仍在用的 Pixi 舞台。文末「横版切片」是已经从 `src/index.ts` 导出、可以调用的 three.js 关卡。叙事宿主和真实 GPU 验收仍未实现。

「插件」这个词在仓库里有两套意思。

## v0.1：能力插件

`EnginePlugin`（`src/core/types.ts`）有 `manifest`，以及 `register` / `init` / `start` / `fixedUpdate` / `render` / `stop` / `dispose`。

`PluginManifest` 字段：

```ts
interface PluginManifest {
  readonly id: string;
  readonly version: string;
  readonly requires?: readonly Dependency[];
  readonly optional?: readonly Dependency[];
  readonly provides?: readonly ProvidedService[];
  readonly fixedPhase?: FixedPhase;
  readonly renderPhase?: RenderPhase;
  readonly before?: readonly string[];
  readonly after?: readonly string[];
}
```

`Dependency.range` 和 `ProvidedService.version` 用 `satisfies()`（`src/core/plugin-graph.ts`）做主版本兼容。`register` 里 `provide(token, value)` 必须先在 `provides` 声明，且一个 token 只能登记一次。`init` 时缺依赖会失败并回滚已登记的资源。

服务用 `createToken<T>(id)`，运行时身份是 `symbol`。现有 token 在 `src/plugins/tokens.ts`：`SceneToken`、`CameraToken`、`InputToken`、`StrokeToken`、`ErosionToken`、`PhysicsToken`、`RendererToken`、`InkToken`、`InkDiagnosticsToken`、`CanvasSurfaceToken`。

这条图仍然服务墨渡和江湖页。新的十卡**没有**把自己装进 `Engine`。

## 2.0：道具预设，不是第二套插件图

`ItemPreset`（`src/plugins/items.ts`）：

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

页面结构：

- `apps/index.html` + `apps/main.ts`：读 `ITEM_PRESETS` 画十张卡，链到 `./<id>/`。
- `apps/<id>/index.html`：`body` 带 `data-item`，并有 `#hint`、`#action`、`#replay`、`#pause`、`#reset`、`#canvas-root`、`#status`、`#loading`。
- `apps/demo.ts`：只 import `@inkgames/engine`，`getItemPreset` + `InkStage.create`。

道具行为目前写在 `InkStage` 的 `switch (item.action)` 里，预设只提供文案和动作种类。还没有每个道具一个 `itemId / requiresEffects` 文件，也没有独立的资源租约。这是计划里的 P2，不是页面应该自己补的私有逻辑。

## 旧页面不要混进十卡

`/inkcross/` 用 `createInkCrossPlugin`。`/wuxia/` 是应用层自动战斗，仍走 `Engine`。`/compare/` 只构造 `InkWash`，不创建 `InkWorld`，用来和 inkEngine 对同一组折线。它不出现在首页十张卡里。

## 横版切片已导出的模块

十卡的 `ItemPreset` 不变，切片不走插件图。已经从 `src/index.ts` 导出的是 `InkView`、`Playfield`、`CameraRig`、`InkSurface`、`TerrainSeep`、`createCunRock`、`BambooView`。坡度行走、击退、扫掠和砍断写在 `Playfield` 的方法上。皴法在 `src/core/cun-material.ts`，竹的显示在 `src/core/bamboo-rig.ts` 的 `BambooView`。

还没有导出、也还没有类的名字：`PostStack`、`SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`AudioBus`、`InkText`、`SaveStore`，以及 `defineGameplay`。字幕播放算在这一组里。历史游戏的优先级仍以 [plan/12 的缺口表](../plan/12-history-game-engine-gaps.md#3-引擎缺口清单) 为准。
