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
