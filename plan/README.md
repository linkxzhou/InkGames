# 规划索引

引擎架构的现行计划是 [10 · three.js + Matter.js 横版水墨动作引擎](./10-three-matter-side-scroller-plan.md)。历史游戏的叙事和引擎缺口是另一组草案，见下面「历史水墨游戏」。使用说明在 [docs](../docs/README.md)。M1–M4 的横版切片已经在 `src/` 和 `apps/scroll/`。M5 叙事宿主已能在 `/story/` 播「易水寒」；玩法模板和 `PostStack` 仍开着。

`plan/11`、`plan/12` 的编号留给历史游戏，引擎计划继续用 `plan/10`，不再另起 `plan/13`。

## 引擎计划（2026-10-09）

所有者决定：现行 v2 渲染（PixiJS 8 + Matter.js）观感不够，引擎架构改为 **three.js + Matter.js**。玩法仍是横版动作，位移和碰撞在 X/Y 平面，Z 固定；Matter.js 跑不可见的二维物理，每帧把刚体的 x、y 写到 three.js 模型的 `position.x` / `position.y`。

| 文件 | 处理 |
|---|---|
| `10-v2-pixi-matter-ink-game-engine-plan.md` | 整份删除。它是 PixiJS 舞台的未完成清单（真实 GPU、上下文恢复、水墨缺口、十卡玩法还薄）。这些缺口里仍然适用于现行 Pixi 代码的条目，已收进新计划的「结转」一节。plan/12 里提到的「plan/10 P0」（开场 18–35 秒、上下文不重建）指的就是这些事实。 |
| [10 · three.js + Matter.js](./10-three-matter-side-scroller-plan.md) | 现行引擎计划。M0–M4 已落地：`InkView`、`Playfield`、`InkSurface` 与 `apps/scroll/`。M5 为 `[~]`：叙事宿主能播荆轲开场并走正史 / 野史，玩法模板与 `PostStack` 未做。真实 GPU 未实测。 |

## 历史水墨游戏（2026-10-09 草案）

以 InkGames 为引擎、一个朝代一章的中国历史游戏设计。十卡页面仍是 PixiJS；横版切片在 `src/core` 的 three.js 路径和 `apps/scroll/`。叙事、缺口优先级和验收以这一组文件为准；引擎怎么实现以 [plan/10](./10-three-matter-side-scroller-plan.md) 为准。下列文件不改写故事正文。

| 文件 | 内容 |
|---|---|
| [11 · 故事与玩法设计](./11-history-game-story-design.md) | 章、场景、剧情图与时间线；正史/野史分支、汇流与结局；解锁；写作规范与工作流；语料分析结论；待决问题 |
| [11 · 章节大纲](./11-history-game-chapter-outline.md) | 上古至清的章节与场景表（民国可选），道具与笔刷映射，史源 |
| [11 · 内容数据格式](./11-history-game-content-schema.md) | JSON 数据契约、荆轲刺秦王完整样例、校验与测试 |
| [12 · 开场动画管线与引擎缺口](./12-history-game-engine-gaps.md) | 开场动画管线、P0/P1/P2 缺口清单、里程碑与垂直切片 |
| [11-history-game-data/](./11-history-game-data/) | 语料目录（不含 PDF）、荆轲关系图、场景样例 JSON；21 章剧情数据（`chapters/`，157 场景全部为完整场景，首版发布批次 v1=66，每场景含水墨素材提示词 `artPrompts`）、校验器与数据生成脚本（`tools/`：`validate.mjs`、`build-viewer-data.mjs`、`build-art-prompts.mjs`）、浏览页 [index.html](./11-history-game-data/index.html)（file:// 双击可用，底部可按分类看素材提示词） |
