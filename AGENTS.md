# AGENTS.md · InkGames 工程规范

> 本文件约束 AI 协作与人类贡献者在 `/Volumes/my/github/InkGames` 内的目录结构、命名、代码与文档约定。
> 冲突优先级：本文件 → [`plan/10-three-matter-side-scroller-plan.md`](plan/10-three-matter-side-scroller-plan.md)（three.js + Matter.js 引擎计划，尚未实现）→ `docs/01..10`（现行代码，以及各章标明的计划目标）→ [`plan/11`](plan/11-history-game-story-design.md) 与 [`plan/12`](plan/12-history-game-engine-gaps.md)（历史游戏草案：叙事和缺口优先级以它们为准，模块名与 plan/10 对齐）→ `docs/11`（资料附录，不作现行承诺）。
> 新设计目标：**桌面优先的 three.js（WebGL）+ Matter.js 横屏水墨动作引擎**（计划，代码尚未切换）。玩法在 X/Y 平面碰撞，Z 固定；Matter.js 的刚体 x、y 写入 three.js 模型。场景、物理、战斗、水墨与常见效果为内建核心，`src/plugins/` 放 v0.1 能力插件和十卡道具预设，`apps/` 展示十张效果卡。水刷必须改变 CPU 权威碰撞几何。水墨观感以 `thirdparty/inkEngine` 为参照，现行宿主是 `InkWash` 的 Pixi 缓冲，计划宿主是 `InkSurface` 的 three.js 渲染目标；逐项差距见 `docs/12`。仓库里仍能跑的是 p5.js + 原生 WebGL2 原型，以及 PixiJS 8 + Matter.js 舞台。无头 SwiftShader 冒烟通过不等于真实 GPU 验收，不得把未测项写成已验证。

## 1. 目录结构（权威）

```text
InkGames/
├── AGENTS.md                 本文件：工程规范（目录/命名/流程）
├── README.md                 项目入口：当前状态、阅读顺序、十章索引
├── build.sh                  统一入口：install / dev / build / test / check / clean
├── package.json              根工程：脚本、依赖、yarn 元数据
├── tsconfig.json             TypeScript 严格配置（src 与 apps 共用）
├── vite.config.ts            开发服务器与库构建配置
├── vitest.config.ts          单元测试配置
├── src/                      引擎源码（可发布为包，禁止放示例数据）
│   ├── index.ts              唯一的公共 API 出口（新增能力必须在此导出）
│   ├── core/                 2.0 目标：引擎调度、场景、Matter 物理、战斗、水墨与通用效果
│   └── plugins/              2.0 目标：刀、剑、马匹等道具/载具效果组合
├── apps/                     2.0 目标：首页十张 card + 各道具独立效果页面
│   ├── index.html            十卡首页（基础实现；待浏览器验收）
│   └── <item>/               十个效果目录（初步实现；未完成全部规划效果）
├── tests/                    自动化测试（vitest）：与 src 结构对应
├── docs/                     现行 API 与计划中的 three.js 架构；11 为资料附录，12 为水墨对照
├── plan/                     10 为现行引擎计划；11–12 为历史游戏草案（故事、数据、引擎缺口）
├── skills/                   研究技能。history-santi 为 MIT，不进入运行时，不打进 dist/
├── thirdparty/               只读参考快照；受限素材不得进入公开仓库/发布物
└── .session_tmps/            临时工作区，可随时删除
```

### 目录职责红线

| 目录 | 允许 | 禁止 |
|---|---|---|
| `src/` | 引擎内核、通用插件、公共类型 | 关卡数据、示例页面、参考项目代码 |
| `apps/` | HTML/TS 样例、关卡 JSON、示例资源 | 被 `src/` 反向 import 的业务逻辑 |
| `tests/` | 纯逻辑单测、插桩与假宿主 | 真实网络请求、依赖 GPU 的强制断言 |
| `docs/` | 使用文档，与 `src/` API 同步 | 未实现功能的“已实现”表述 |
| `thirdparty/` | 只读快照与许可 | 修改、打包、公开再分发受限内容 |
| `skills/` | 研究流程与模板（不参与构建） | 打进 `dist/`、被 `src/` import |

## 2. 命名与代码约定

- 文件：kebab-case（`ink-fluid.ts`）；类型/类：PascalCase；函数/变量：camelCase；服务 token：`XxxToken`。
- TypeScript：`strict` 全开，禁止 `any`、`@ts-ignore`；跨模块只走 `src/index.ts` 导出。
- 2.0 分层：引擎基础功能归 `src/core/`；`src/plugins/` 的道具/载具声明 `itemId/version/requiresEffects/config` 等组合契约，声明资源寿命和依赖，不另启物理/渲染时钟。
- 旧插件图与 token 规则仍约束未迁移的代码；迁移时保留版本/依赖校验、失败回滚及固定步确定的事件先后，按 `plan/10` 为道具组合定义新协议。
- 新公共 API 只能从 `src/index.ts` 导出；对象契约用 TypeScript `interface`，不得用 `type` 定义对象。
- 资源：一切 GPU/监听器/定时器通过 `ctx.resources.add()` 登记清理；`dispose()` 必须幂等。
- 确定性：权威几何（笔画/侵蚀/碰撞）只用四则运算、`Math.sqrt` 和量化坐标；禁止 `Math.sin/cos/atan2/pow` 等超越函数。
- 旧 GL 原型：原生 WebGL2 pass 仍须包在 `withGLState()` 内。现行 PixiJS 渲染由 Pixi 管理 WebGL 资源，禁止不经版本验证混用原生 GL 状态或依赖 Pixi 私有字段。计划中的 three.js 由 `WebGLRenderer` 管理，水墨 pass 用 `RawShaderMaterial`；实现前 Pixi 与 three 不共用一张画布。
- 时钟：Pixi ticker、three.js 动画循环与 Matter Runner 不得和内核 RAF 同时推进权威世界。玩法固定步与过场帧时钟由场景管理二选一。角色和墨障的命中只读固定步 CPU 状态。
- 注释：仅解释“为什么”，不写“是什么”；中文用于用户可见逻辑，英文用于底层算法。
- 禁止：在 `src/` 使用 `console.log` 作为常态日志（测试与 `apps/` 可）；不复制 `thirdparty/inkField` 的代码、shader、常量表及受限素材。`thirdparty/inkEngine` 的算法、shader 与常量表按 §6 的所有者声明可以移植进 `src/`，文件头须写归属；内嵌字体、`demo.json` 等素材仍不复制。

## 3. 文档约定

- `docs/` 面向**使用者**：01..10 区分「现行代码（p5 原型与 Pixi 舞台）」「计划中的 three.js 架构（未实现）」；只有已在仓库实现的 API 才给出可运行代码，不把计划写成已经能调用的 three.js 示例。11 为有日期的资料附录。12 是现行 Pixi 移植与 inkEngine 的对照。
- `plan/` 面向**规划**：`plan/10` 是 three.js + Matter.js 引擎计划（`[x] / [~] / [ ]` 与待确认问题）。`plan/11`、`plan/12` 是历史游戏草案，不覆盖引擎架构。01..09 已删除，原因见 `plan/README.md`。
- 新增公共 API → 同步更新：`src/index.ts`、对应 `docs/NN-*.md` 与 `plan/10` 状态；完成 2.0 后更新目录/启动入口描述。
- 所有本地链接使用相对路径，改文件后必须校验无死链。
- 未在本机浏览器实测的结论必须写明“未实测”，不得声称已通过验证。

## 4. 开发流程（build.sh）

```bash
./build.sh install     # yarn 安装依赖
./build.sh dev         # 启动 Vite 开发服务器（默认十卡首页；旧墨渡暂留）
./build.sh build       # 类型检查 + 生产构建（输出 dist/）
./build.sh test        # vitest 单元测试
./build.sh check       # 类型检查 + 测试 + 文档链接校验
./build.sh clean       # 清理 dist/、缓存等生成物
```

- 提交前至少执行 `./build.sh check`。
- `build.sh` 是唯一入口：不要在 README 或文档里另写一套命令。
- 依赖安装失败（离线）时，`build.sh` 必须给出明确提示而不是静默跳过。

## 5. 验证门槛

| 层级 | 手段 | 通过条件 |
|---|---|---|
| 类型 | `tsc --noEmit`（strict） | 0 error |
| 逻辑 | vitest 单测（`tests/`） | 时钟/插件图/侵蚀/场景/录制全绿 |
| 图形 | Chromium headless + `--enable-unsafe-swiftshader` | 无 GL error、无未捕获异常 |
| 文档 | 相对链接检查 | 0 死链 |

超出上述范围（Safari/Firefox、真机、性能基准）视为**未验证**，必须在文档中如实标注。

## 6. 许可红线

- `thirdparty/inkwash` 为 MIT，可移植：保留版权与许可声明。
- `thirdparty/inkField` 为自定义受限许可：**不得复制代码/shader/常量表，不得随公开仓库或发布物再分发**，只能借鉴公开文档描述的通用思想并独立实现。
- `thirdparty/inkEngine` 为 inkField 可读还原版。仓库所有者声明已取得 inkField 作者的书面授权，允许把其中算法和着色器逻辑移植进 `src/`，使水墨效果对齐；授权书本身不在仓库内，本文件不能代替该授权。移植时在源文件头保留归属说明。仍禁止修改 `thirdparty/` 内的文件，禁止把该快照、内嵌字体或 `demo.json` 打进发布物或再分发。公开仓库仍须审计快照是否应留在历史中。
- 新增依赖仅允许 MIT / BSD / Apache / LGPL（不修改、独立分发），并在 `THIRD_PARTY_NOTICES.md` 登记。
