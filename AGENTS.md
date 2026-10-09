# AGENTS.md · InkGames 工程规范

> 本文件约束 AI 协作与人类贡献者在 `/Volumes/my/github/InkGames` 内的目录结构、命名、代码与文档约定。
> 冲突优先级：本文件 → [`plan/10-three-matter-side-scroller-plan.md`](plan/10-three-matter-side-scroller-plan.md)（three.js + Matter.js；M0–M4 已完成，M5 部分完成，§7 记录 Pixi/p5 清理）→ `docs/01..10`（现行代码：切片、叙事与历史动画）→ [`plan/11`](plan/11-history-game-story-design.md) 与 [`plan/12`](plan/12-history-game-engine-gaps.md)（历史游戏草案：叙事与缺口优先级以它们为准，模块名与 plan/10 对齐）→ [`plan/12` 动画计划](plan/12-history-game-ink-animation-production-plan.md)（纯程序水墨的执行状态）→ `docs/11`（资料附录，不作现行承诺）。
> 现行架构：**桌面优先的 three.js（WebGL）+ Matter.js 横屏水墨动作引擎**。玩法在 X/Y 平面碰撞，Z 固定；Matter.js 的刚体 x、y 写入 three.js 模型。依赖只有 `three@0.186.1` 与 `matter-js@0.20.0`。
> **单一渲染栈（2026-10-09 起）**：PixiJS 十卡舞台、p5 微内核与原生 WebGL2 插件已从 `src/`、`apps/` 和 `package.json` 删除，不得再引入。三条入口都在 three.js 路径上：切片 `apps/scroll/`（`InkView`、`Playfield`、`InkSurface`、洇染、皴法、断竹）、叙事 `apps/story/`（`StoryStage`、`SceneDirector`、`CutscenePlayer`）、历史动画 `apps/history/`（`InkScene`、`ink-presentation`）。`src/plugins/` 只放道具笔画表与展示（`prop-brushes`、`prop-paintings`、`items`）。水刷必须改变 CPU 权威碰撞几何。水墨观感以 `thirdparty/inkEngine` 为参照；逐项差距见 `docs/12`（总表是 Pixi 时代的历史记录，文末有 three.js 的 SwiftShader 并排差）。参考 PNG 只作人工对照，运行时不加载。无头 SwiftShader 冒烟通过不等于真实 GPU 验收，不得把未测项写成已验证。

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
│   ├── core/                 引擎内核：时钟、Matter 物理与玩法、笔刷与墨面、分件墨层、三项画面、叙事宿主
│   └── plugins/              道具笔画表与展示：prop-brushes / prop-paintings / items
├── apps/                     示例页面（只依赖 @inkgames/engine）
│   ├── index.html            三入口导航
│   ├── scroll/               横版切片：坡、洇染、皴法、断竹
│   ├── story/                叙事宿主：易水寒样例
│   └── history/              历史动画：混沌开卷（含 chaos-data / procedural）
├── tests/                    自动化测试（vitest）：与 src 结构对应
├── docs/                     现行 API；11 为资料附录，12 为 inkEngine 对照
├── plan/                     10 为现行引擎计划；11–12 为历史游戏草案与动画制作计划
├── skills/                   研究技能。history-santi 为 MIT，不进入运行时，不打进 dist/
├── thirdparty/               只读参考快照；受限素材不得进入公开仓库/发布物
└── .session_tmps/            临时工作区，可随时删除
```

### 目录职责红线

| 目录 | 允许 | 禁止 |
|---|---|---|
| `src/` | 引擎内核、通用插件、公共类型 | 关卡数据、示例页面、参考项目代码 |
| `apps/` | HTML/TS 样例、关卡 JSON、原创表现数据与示例资源 | 被 `src/` 反向 import 的业务逻辑 |
| `tests/` | 纯逻辑单测、插桩与假宿主 | 真实网络请求、依赖 GPU 的强制断言 |
| `docs/` | 使用文档，与 `src/` API 同步 | 未实现功能的“已实现”表述 |
| `thirdparty/` | 只读快照与许可 | 修改、打包、公开再分发受限内容 |
| `skills/` | 研究流程与模板（不参与构建） | 打进 `dist/`、被 `src/` import |

## 2. 命名与代码约定

- 文件：kebab-case（`ink-surface.ts`）；类型/类：PascalCase；函数/变量：camelCase。
- TypeScript：`strict` 全开，禁止 `any`、`@ts-ignore`；跨模块只走 `src/index.ts` 导出。
- 分层：引擎基础功能归 `src/core/`；`src/plugins/` 只放道具笔画表、画法与道具元数据，不另启物理/渲染时钟。
- 新公共 API 只能从 `src/index.ts` 导出；对象契约用 TypeScript `interface`，不得用 `type` 定义对象。
- 资源：一切 GPU 资源、监听器、定时器由所属类持有并在 `dispose()` 中幂等释放；不得依赖旧微内核的资源登记。
- 确定性：权威几何（笔画/侵蚀/碰撞）只用四则运算、`Math.sqrt` 和量化坐标；禁止 `Math.sin/cos/atan2/pow` 等超越函数。
- 渲染：所有宿主由 `WebGLRenderer` 管理，水墨 pass 用 `RawShaderMaterial`（GLSL3）；皴法与竹用 `ShaderMaterial`。不引入第二套渲染库，不共用同一张画布或同一个渲染器。
- 时钟：玩法固定步（`advanceFixedClock`）与过场帧时钟（`advanceFrameClock`）不得同时推进权威世界。角色和墨障的命中只读 CPU 状态。
- 注释：仅解释“为什么”，不写“是什么”；中文用于用户可见逻辑，英文用于底层算法。
- 禁止：在 `src/` 使用 `console.log` 作为常态日志（测试与 `apps/` 可）；不复制 `thirdparty/inkField` 的代码、shader、常量表及受限素材。`thirdparty/inkEngine` 的算法、shader 与常量表按 §6 的所有者声明可以移植进 `src/`，文件头须写归属；内嵌字体、`demo.json` 等素材仍不复制。

## 3. 文档约定

- `docs/` 面向**使用者**：01..10 只写现行 three.js 路径与已从 `src/index.ts` 导出的 API。玩法模板、`PostStack`、景深、2.0 录制、`InkScene` 上下文恢复仍标未完成。11 为有日期的资料附录（p5 时代，不作现行承诺）。12 是与 inkEngine 的对照，总表为 Pixi 时代历史记录，文末记 three.js 并排的 SwiftShader 差值。
- `plan/` 面向**规划**：`plan/10` 是 three.js + Matter.js 引擎计划（M0–M4 为 `[x]`，M5 为 `[~]`，§7 记录 Pixi/p5 清理）。`plan/11`、`plan/12` 是历史游戏草案，不覆盖引擎架构；`plan/12` 的动画制作计划是纯程序水墨的执行文档。`plan/01..09` 已删除，原因见 `plan/README.md`。
- 新增公共 API → 同步更新：`src/index.ts`、对应 `docs/NN-*.md` 与 `plan/10` 状态；入口或目录变化时同步 `AGENTS.md`、`README.md` 与 `plan/README.md`。
- 所有本地链接使用相对路径，改文件后必须校验无死链。
- 未在本机浏览器实测的结论必须写明“未实测”，不得声称已通过验证。

## 4. 开发流程（build.sh）

```bash
./build.sh install     # yarn 安装依赖
.build.sh dev         # 启动 Vite 开发服务器（三入口导航：/scroll/、/story/、/history/）
./build.sh build       # 类型检查 + 生产构建（输出 dist/，三条入口）
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
| 逻辑 | vitest 单测（`tests/`） | 时钟/笔刷/表现数据/物理/叙事全绿；11 个文件 61 项 |
| 图形 | Chromium headless + `--enable-unsafe-swiftshader` | 三页启动、无 GL error、无未捕获异常、运行时零图片请求 |
| 文档 | 相对链接检查 | 0 死链 |

超出上述范围（Safari/Firefox、真机、性能基准）视为**未验证**，必须在文档中如实标注。

## 6. 许可红线

- `thirdparty/inkwash` 为 MIT，可移植：保留版权与许可声明。
- `thirdparty/inkField` 为自定义受限许可：**不得复制代码/shader/常量表，不得随公开仓库或发布物再分发**，只能借鉴公开文档描述的通用思想并独立实现。
- `thirdparty/inkEngine` 为 inkField 可读还原版。仓库所有者声明已取得 inkField 作者的书面授权，允许把其中算法和着色器逻辑移植进 `src/`，使水墨效果对齐；授权书本身不在仓库内，本文件不能代替该授权。移植时在源文件头保留归属说明。仍禁止修改 `thirdparty/` 内的文件，禁止把该快照、内嵌字体或 `demo.json` 打进发布物或再分发。公开仓库仍须审计快照是否应留在历史中。
- 新增依赖仅允许 MIT / BSD / Apache / LGPL（不修改、独立分发），并在 `THIRD_PARTY_NOTICES.md` 登记。
