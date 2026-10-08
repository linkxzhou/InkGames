# InkGames 规划索引

> **当前目标**：[InkGames 2.0 PixiJS + Matter.js 实施计划](./10-v2-pixi-matter-ink-game-engine-plan.md)：基础游戏与水墨效果归 `src/core`，道具/载具效果组合归 `src/plugins`；首页十张效果卡替代旧两个应用。[使用文档](../docs/README.md)及 `07` 记录此前 v0.1 迁移方向，与 2.0 不一致时以本计划为准。`plan/01..06`、`08..09` 是 p5.js/原生 WebGL2 路线的历史材料和审计记录；现有源码仍以 `src/` 为准，不能把 2.0 目标写成已完成。

| 文件 | 定位 |
|---|---|
| [10 InkGames 2.0 实施计划](./10-v2-pixi-matter-ink-game-engine-plan.md) | **现行目标**：Pixi/Matter 内建核心、道具插件、十卡首页与迁移门槛 |
| [07 旧 v0.1 迁移基线](./07-microkernel-plugin-plan.md) | 历史阶段：微内核 + 能力插件 + 《墨渡》单关，不再决定 2.0 分层 |
| [01 inkField 参考研究](./01-reference-analysis-inkField.md) | 历史研究；**受限许可，不得复制代码、shader 或常量表、不得公开再分发快照** |
| [02 inkwash 参考研究](./02-reference-analysis-inkwash.md) | 历史研究；MIT 来源与流体模型，可作为后续实验参考 |
| [03 原始需求](./03-requirements.md) · [04 原始架构](./04-architecture.md) · [05 原始 v1 计划](./05-v1-plan.md) | 旧 p5 方向与估算，非 PixiJS 承诺 |
| [06 旧路线核验](./06-validation-and-detailed-plan.md) | p5/GL 问题的历史勘误；不能直接推定 Pixi 的行为 |
| [08 优化记录](./08-inkfield-informed-optimization-plan.md) | 旧管线的优化实验和 clean-room 边界；优化方案需重新评估 |
| [09 契约审计与返工记录](./09-src-contract-gap-and-apps-rework-plan.md) | 有时间层次的旧原型缺陷/修复记录；末尾的墨量对账偏差需在新管线复验 |

旧文件保留供追溯，**不是 2.0 的规范或已实现能力**。PixiJS/Matter.js 已安装，`./build.sh dev` 默认打开十卡首页；旧 p5 演示暂留在 `/inkcross/`、`/wuxia/`，新页面仍需单独浏览器功能验收与真实 GPU 性能测试。`thirdparty/inkEngine` 的书面授权文件不在仓库，使用和公开发布范围须先核查 [LICENSE](../thirdparty/inkEngine/LICENSE)。
