# 第三方组件与许可登记

> 依据 [AGENTS.md](./AGENTS.md) §6 许可红线：新增依赖仅允许 MIT / BSD / Apache / LGPL（不修改、独立分发），并在此登记。
> 本文件只登记**实际随本项目分发的组件**；`thirdparty/inkField` 是受限许可的只读快照，明确排除在发布物之外（见文末）。

## 运行依赖

| 组件 | 版本 | 许可 | 用途 | 是否随发布物分发 |
|---|---|---|---|---|
| [p5.js](https://github.com/processing/p5.js) | ^2.3.4 | LGPL-2.1 | 旧演示画布宿主，迁移期保留 | 是（旧演示打包进 `dist/`） |
| [PixiJS](https://github.com/pixijs/pixijs) | 8.22.0 | MIT | 2.0 WebGL 渲染、显示树与滤镜 | 迁移完成并接入后进入新产物 |
| [Matter.js](https://github.com/liabru/matter-js) | 0.20.0 | MIT | 2.0 固定步刚体物理 | 迁移完成并接入后进入新产物 |

## 开发依赖（不进入发布产物）

| 组件 | 版本 | 许可 | 用途 |
|---|---|---|---|
| [typescript](https://github.com/microsoft/TypeScript) | ^5.9.3 | Apache-2.0 | 类型检查与编译 |
| [vite](https://github.com/vitejs/vite) | ^6.3.5 | MIT | 开发服务器与生产构建 |
| [vitest](https://github.com/vitest-dev/vitest) | ^3.2.4 | MIT | 单元测试 |
| [playwright](https://github.com/microsoft/playwright) | ^1.60.0 | Apache-2.0 | 无头浏览器冒烟验证 |
| [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^22.15.0 | MIT | Node 类型定义 |
| [@types/matter-js](https://github.com/DefinitelyTyped/DefinitelyTyped) | 0.20.2 | MIT | Matter.js TypeScript 类型定义 |

## 受限内容：明确排除

| 组件 | 许可 | 说明 |
|---|---|---|
| `thirdparty/inkField` | 自定义 "Open Creative License"（受限） | **不得复制代码/shader/常量表，不得随公开仓库或发布物再分发**。本项目仅借鉴其公开文档描述的通用思想（弹簧阻尼笔刷、`min()` 扩散、独立身份缓冲、确定性录制），所有实现均为独立完成。公开发布前须隔离该快照并检查 Git 历史。 |
| `thirdparty/inkEngine` | inkField 自定义许可 + 未附于仓库的书面授权 | 可读还原版的 JS、GLSL、内嵌字体及 `demo.json` 未获仓库内可核对的移植/发布范围；2.0 仅独立实现功能需求，不复制内容。公开发布前审查快照与历史。 |
| `thirdparty/inkwash` | MIT | 场模型的思路来源；如需移植源码须保留版权与许可全文及来源声明。当前 `src/plugins/ink-fluid.ts` 为独立实现。 |

## 审查记录

- 2026-10-08：建立本清单。p5.js 以 LGPL-2.1 分发，本项目**未修改**其源码，仅作为 npm 依赖引入。
- 发布前须重新核对：依赖版本、许可文本、`dist/` 内容清单，以及 `thirdparty/` 是否被排除。
