# 规划索引

引擎架构的现行计划是 [10 · three.js + Matter.js 横版水墨动作引擎](./10-three-matter-side-scroller-plan.md)。历史游戏的叙事和引擎缺口是另一组草案，见下面「历史水墨游戏」。使用说明在 [docs](../docs/README.md)。

**渲染栈已收敛（2026-10-09）**：`src/`、`apps/` 与依赖只剩 **three.js + Matter.js**。PixiJS 十卡舞台、p5 微内核、原生 WebGL2 渲染插件、`InkFluid`、老 `Engine`/插件图/命令录制都已从代码中删除；`package.json` 不再依赖 `pixi.js` / `p5`。产品线现在只有三条入口：`apps/scroll/`（横版切片，`InkView`）、`apps/story/`（叙事宿主，`StoryStage`）、`apps/history/`（历史动画，`InkScene`）。

历史游戏的内容（原 `plan/11-*`、`plan/12-*`）已于 2026-10-10 整体迁到仓库顶层 **[`video/`](../video/README.md)**，文件名改为不带编号前缀的 kebab-case；`plan/` 只保留引擎计划（`plan/10`）。

## 引擎计划（2026-10-09）

引擎架构为 **three.js + Matter.js**：横版动作，位移和碰撞在 X/Y 平面，Z 固定；Matter.js 跑不可见的二维物理，每帧把刚体的 x、y 写到 three.js 模型的 `position.x` / `position.y`。水墨由 `InkSurface`（three.js `WebGLRenderTarget` 上的 inkEngine 管线）与 `InkScene`（程序分件墨层）承担。

| 文件 | 状态 |
|---|---|
| [10 · three.js + Matter.js](./10-three-matter-side-scroller-plan.md) | 现行引擎计划。**M0–M4 已完成**（`InkView`、`Playfield`、`InkSurface`、`apps/scroll/`）。**M5 部分完成**：叙事宿主能播荆轲开场、走正史 / 野史、检查点恢复；`PostStack`、景深、录制回放、玩法模板未做。真实 GPU 未实测。 |
| `10-v2-pixi-matter-ink-game-engine-plan.md` | 已删除（PixiJS 舞台清单，随渲染栈清理一并作废）。 |
| Pixi / p5 / 原生 WebGL2 相关条目 | **已作废并清理**，不再是待办；见 [引擎缺口 §6](../video/docs/engine-gaps.md#6-纯引擎水墨动画实现方案2026-10-09-重新评估) 的现行方案。 |

## 历史水墨游戏 → 已迁至 [`video/`](../video/README.md)

以 InkGames 为引擎、一个朝代一章的中国历史游戏设计。三条入口都在 three.js 路径上（`src/core` + `apps/`），不再有 PixiJS 页面。叙事、缺口优先级和验收以这一组文件为准；引擎怎么实现以 [plan/10](./10-three-matter-side-scroller-plan.md) 为准。下列文件不改写故事正文。

| 文件 | 内容 | 状态 |
|---|---|---|
| [故事与玩法设计](../video/docs/story-design.md) | 章、场景、剧情图与时间线；正史/野史分支、汇流与结局；解锁；写作规范与工作流；语料分析结论；待决问题 | 草案，文本不改 |
| [章节大纲](../video/docs/chapter-outline.md) | 上古至清的章节与场景表（民国可选），道具与笔刷映射，史源 | 草案，文本不改 |
| [内容数据格式](../video/docs/content-schema.md) | JSON 数据契约、荆轲刺秦王完整样例、校验与测试 | 契约有效 |
| [开场动画管线与引擎缺口](../video/docs/engine-gaps.md) | 开场动画管线、P0/P1/P2 缺口清单、里程碑与垂直切片；**§6 为纯引擎实现方案；§4 已标注 M0 未通过、M1–M5 未开始** | §1–§5 为旧基线，以 §6 为准 |
| [历史动画制作计划](../video/docs/production-plan.md) | 混沌开卷纯引擎实施、E0–E4 状态、验收与性能；**§15 为权威状态核对** | 现行执行文档；E0–E3 未全部达标 |
| [video/](../video/README.md) | 21 章剧情数据（`video/data/chapters/`，221 场景全部为完整场景，每章 ≥10 场，首版发布批次 v1=66）、语料目录、荆轲样例与关系图、工具（`video/tools/`）、浏览页 [video/viewer/index.html](../video/viewer/index.html)、史源摘要（`video/sources/`）、每场景水墨视频提示词（`videoPrompt`） | 以 [video/README.md](../video/README.md) 为准 |

`artPrompts`（886 张图 / 5848 件素材）保留为**创作提示与美术参考**，不再作为运行时出图方案；动画画面由引擎生成，见 [缺口 §6](../video/docs/engine-gaps.md#6-纯引擎水墨动画实现方案2026-10-09-重新评估)。
