# 第三方组件与许可登记

> 依据 [docs/AGENTS.md](./docs/AGENTS.md) §6 许可红线：新增依赖仅允许 MIT / BSD / Apache / LGPL（不修改、独立分发），并在此登记。
> 本文件只登记**实际随本项目分发的组件**；`thirdparty/inkField` 是受限许可的只读快照，明确排除在发布物之外（见文末）。

## 运行依赖

| 组件 | 版本 | 许可 | 用途 | 是否随发布物分发 |
|---|---|---|---|---|
| [Matter.js](https://github.com/liabru/matter-js) | 0.20.0 | MIT | 切片与玩法的固定步刚体（`Playfield` / `InkWorld`） | 是 |
| [three.js](https://github.com/mrdoob/three.js) | 0.186.1 | MIT | 全部宿主的 `WebGLRenderer`。水墨 pass 用 `RawShaderMaterial`（GLSL3）；皴法与竹用 `ShaderMaterial` | 是（`/scroll/`、`/story/`、`/history/`）

**已移除**：`p5.js` 与 `PixiJS` 曾作为运行依赖，现随各自舞台删除（2026-10-09），不再随发布物分发。

## 开发依赖（不进入发布产物）

| 组件 | 版本 | 许可 | 用途 |
|---|---|---|---|
| [typescript](https://github.com/microsoft/TypeScript) | ^5.9.3 | Apache-2.0 | 类型检查与编译 |
| [vite](https://github.com/vitejs/vite) | ^6.3.5 | MIT | 开发服务器与生产构建 |
| [vitest](https://github.com/vitest-dev/vitest) | ^3.2.4 | MIT | 单元测试 |
| [playwright](https://github.com/microsoft/playwright) | ^1.60.0 | Apache-2.0 | 无头浏览器冒烟验证 |
| [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^22.15.0 | MIT | Node 类型定义 |
| [@types/matter-js](https://github.com/DefinitelyTyped/DefinitelyTyped) | 0.20.2 | MIT | Matter.js TypeScript 类型定义 |
| [@types/three](https://github.com/DefinitelyTyped/DefinitelyTyped) | 0.186.0 | MIT | three 0.186.1 的 npm 包不含 `.d.ts`，类型由此提供。传递依赖里的 rapier、tween、stats、webxr 类型未被本仓库 import |

## 受限内容：明确排除

| 组件 | 许可 | 说明 |
|---|---|---|
| `thirdparty/inkField` | 自定义 "Open Creative License"（受限） | **不得复制代码/shader/常量表，不得随公开仓库或发布物再分发**。本项目仅借鉴其公开文档描述的通用思想（弹簧阻尼笔刷、`min()` 扩散、独立身份缓冲、确定性录制），所有实现均为独立完成。公开发布前须隔离该快照并检查 Git 历史。 |
| `thirdparty/inkEngine` | inkField 自定义许可；仓库所有者声明另有书面授权（授权书不在本仓库） | 可读还原版，供效果对照。所有者声明 inkField 作者已书面授权将算法与着色器逻辑移植进 `src/`。据此移植并在文件头保留归属的有：`src/core/ink-brush.ts`（七种笔刷与落笔/逐帧逻辑、分叉表）、`src/core/ink-palette.ts`（36 色表）、`src/core/ink-paper.ts`（纸纹）、`src/core/ink-shaders.ts`（feedback / encode / typeMapEncode / composite / realtime / mapFrag，由 `scripts/port-inkengine-shaders.mjs` 从快照生成）、*（迁移后）* `src/core/ink-pass.ts`、`src/core/ink-raster.ts`、`src/core/ink-surface.ts`（three.js 宿主与逐帧流程）。Pixi 时期的 `ink-wash-filters.ts` / `ink-wash.ts` 已删除。授权书未入库，本登记不能代替它。快照、内嵌字体、`demo.json` 不进入 `dist/`，也不修改 `thirdparty/` 内的文件。 |
| p5.js 的 `random` / `noise` 算法 | LGPL-2.1 | `src/core/ink-random.ts` 按 p5.js 的 `randomSeed`（Numerical Recipes LCG）与 `noise`（4096 格、4 层倍频）重写，目的是让移植的笔刷与 inkEngine 抽到同一串随机数。该文件是 p5.js 算法的派生实现，按 LGPL-2.1 看待；p5.js 包**已不再是依赖**，仅这份派生实现留在源码里。 |
| `thirdparty/inkwash` | MIT | 场模型的思路来源；如需移植源码须保留版权与许可全文及来源声明。当时的独立实现 `src/plugins/ink-fluid.ts` 已随 Pixi/p5 清理删除。 |

## 随源码分发的派生实现

| 组件 | 许可 | 说明 |
|---|---|---|
| [stegu/webgl-noise](https://github.com/stegu/webgl-noise) classic Perlin | MIT，Copyright (c) 2011 Stefan Gustavson | `src/core/classic-noise.ts` 的 `CLASSIC_NOISE_GLSL` 保留原文件头。用于皴法勾边的 `cnoise`。未拷贝该仓库的其它噪声，也未拷贝其 LICENSE 文件以外的素材。 |

## 已决定、尚未安装

| 组件 | 说明 |
|---|---|
| troika-three-text | 字幕 P0 定为 Canvas 纹理，不引入文字库。`InkText` 已用 `CanvasTexture` 播放过场标题，仍不安装此包。 |

## 审查记录

- 2026-10-08：建立本清单。p5.js 以 LGPL-2.1 分发，本项目**未修改**其源码，仅作为 npm 依赖引入。
- 2026-10-08：按仓库所有者的说明，把 inkEngine 的笔刷与反馈结构移植进 `src/core/ink-wash*.ts` 与 `ink-brush.ts`。书面授权未附在仓库中。
- 2026-10-08：第二轮把 inkEngine 的七种笔刷、六个着色器、纸纹和 36 色表逐行移植（文件见上表），并新增 `src/core/ink-random.ts`（p5 随机/噪声算法，LGPL-2.1 派生）。是否接受 LGPL 派生文件进入仓库，需仓库所有者确认。
- 2026-10-09：计划改用 three.js 渲染，当时三项都还没安装。
- 2026-10-09：锁定并安装 `three@0.186.1` 与 `@types/three@0.186.0`。classic Perlin 拷入 `src/core/classic-noise.ts`。字幕不安装 troika。
- 2026-10-09：清理渲染栈。删除 `pixi.js` 与 `p5` 依赖及对应舞台/插件（`ink-stage.ts`、`ink-wash.ts`、`ink-wash-filters.ts`、`p5-host.ts`、`gl-state.ts`、`renderer-webgl2.ts`、`ink-fluid.ts` 等）。`ink-random.ts` 的 p5 派生实现保留。`thirdparty/` 下的参考 PNG 只作人工对照，不进入运行时或发布物。
- 发布前须重新核对：依赖版本、许可文本、`dist/` 内容清单，以及 `thirdparty/` 是否被排除。
