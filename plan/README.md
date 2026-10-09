# 规划索引

现行文件只有一份：[尚未完成的工作](./10-v2-pixi-matter-ink-game-engine-plan.md)。使用说明在 [docs](../docs/README.md)。已经写进仓库的行为以 `src/` 和文档为准，不在这里重复成「已完成」清单。

## 删除记录（2026-10-08）

下列文件整份删除。它们要么描述已经落地的 v0.1 微内核，要么是被 2.0 目录和十卡演示替代的旧路线，留在 `plan/` 里会和现行代码互相矛盾。

| 删除的文件 | 原因 |
|---|---|
| `01-reference-analysis-inkField.md` | inkField 许可与结构研究。结论已吸收到 [第三方登记](../THIRD_PARTY_NOTICES.md) 和 [docs/11](../docs/11-references-and-research.md)，不再指导实现。 |
| `02-reference-analysis-inkwash.md` | MIT 流体参考笔记。`src/plugins/ink-fluid.ts` 已是独立实现，笔记本身不是待办。 |
| `03-requirements.md`、`04-architecture.md`、`05-v1-plan.md` | 最初的 p5 单关需求、架构和排期，产品范围已被十卡水墨动作演示替代。 |
| `06-validation-and-detailed-plan.md` | 对 01–05 的勘误。勘误对象已删除。 |
| `07-microkernel-plugin-plan.md` | v0.1 微内核计划。`Engine`、插件图、固定步、资源回滚、笔画/侵蚀/录制已在 `src/core` 与 `src/plugins` 落地，并有 `tests/` 覆盖。 |
| `08-inkfield-informed-optimization-plan.md` | 旧 WebGL2 墨水管线的优化实验记录。优化落在 `ink-fluid.ts`；2.0 画面改走 `InkWash`。 |
| `09-src-contract-gap-and-apps-rework-plan.md` | 2026-10-08 对旧《墨渡》的审计。其中「球与印章不绘制」「水刷视觉未接线」已在旧页面补上，并由 `scripts/browser-smoke.mjs` 断言。十卡演示已按现行公共 API 重写，该返工单不再是待办。 |

`docs/11` 仍保留当日的检索附录。文中出现「plan/07」是历史叙述，不是仍然有效的计划链接。

## 历史水墨游戏（2026-10-09 草案）

以 InkGames 为引擎、一个朝代一章的中国历史游戏设计。目标引擎按 three.js + Matter.js 写；当前 `src/` 仍是 PixiJS，迁移另行规划。下列文件不修改上面的现行计划。

| 文件 | 内容 |
|---|---|
| [11 · 故事与玩法设计](./11-history-game-story-design.md) | 章、场景、剧情图与时间线；正史/野史分支、汇流与结局；解锁；写作规范与工作流；语料分析结论；待决问题 |
| [11 · 章节大纲](./11-history-game-chapter-outline.md) | 上古至清的章节与场景表（民国可选），道具与笔刷映射，史源 |
| [11 · 内容数据格式](./11-history-game-content-schema.md) | JSON 数据契约、荆轲刺秦王完整样例、校验与测试 |
| [12 · 开场动画管线与引擎缺口](./12-history-game-engine-gaps.md) | 开场动画管线、P0/P1/P2 缺口清单、里程碑与垂直切片 |
| [11-history-game-data/](./11-history-game-data/) | 语料目录（不含 PDF）、荆轲关系图、场景样例 JSON；21 章剧情数据（`chapters/`，157 场景，首版完整 66）、校验器与数据生成脚本（`tools/`）、浏览页 [index.html](./11-history-game-data/index.html)（file:// 双击可用） |
