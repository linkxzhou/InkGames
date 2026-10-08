# AGENTS.md · InkGames 工程规范

> 本文件约束 AI 协作与人类贡献者在 `/Volumes/my/github/InkGames` 内的目录结构、命名、代码与文档约定。
> 冲突优先级：本文件 → `plan/10-v2-pixi-matter-ink-game-engine-plan.md`（现行 2.0 实施目标）→ `docs/01..10`（尚待同步的 v0.1 使用资料）→ `plan/07` 及其余历史研究/审计。
> 新设计目标：**桌面优先的 PixiJS（WebGL）+ Matter.js 横屏水墨动作引擎**；场景、物理、战斗、水墨与常见效果为内建核心，`src/plugins/` 组合道具/载具效果，`apps/` 展示十张效果卡。水刷必须改变 CPU 权威碰撞几何。当前旧 p5.js + 原生 WebGL2 原型与 PixiJS/Matter.js 2.0 基础实现并存；十卡页面与内核尚未通过独立的浏览器效果验收，不得写成完整实现。

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
├── docs/                     现有 v0.1 使用资料，2.0 实施后须同步 + 11 历史研究附录
├── plan/                     10 为现行 2.0 基线，01..09 为历史规划/审计
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

## 2. 命名与代码约定

- 文件：kebab-case（`ink-fluid.ts`）；类型/类：PascalCase；函数/变量：camelCase；服务 token：`XxxToken`。
- TypeScript：`strict` 全开，禁止 `any`、`@ts-ignore`；跨模块只走 `src/index.ts` 导出。
- 2.0 分层：引擎基础功能归 `src/core/`；`src/plugins/` 的道具/载具声明 `itemId/version/requiresEffects/config` 等组合契约，声明资源寿命和依赖，不另启物理/渲染时钟。
- 旧插件图与 token 规则仍约束未迁移的代码；迁移时保留版本/依赖校验、失败回滚及固定步确定的事件先后，按 `plan/10` 为道具组合定义新协议。
- 新公共 API 只能从 `src/index.ts` 导出；对象契约用 TypeScript `interface`，不得用 `type` 定义对象。
- 资源：一切 GPU/监听器/定时器通过 `ctx.resources.add()` 登记清理；`dispose()` 必须幂等。
- 确定性：权威几何（笔画/侵蚀/碰撞）只用四则运算、`Math.sqrt` 和量化坐标；禁止 `Math.sin/cos/atan2/pow` 等超越函数。
- 旧 GL 原型：原生 WebGL2 pass 仍须包在 `withGLState()` 内；新 PixiJS 渲染由 Pixi 管理 WebGL 资源，禁止不经版本验证混用原生 GL 状态或依赖 Pixi 私有字段。
- 时钟：Pixi ticker 与 Matter Runner 不得和内核 RAF 同时推进权威世界；角色/墨障命中只读固定步 CPU 状态。
- 注释：仅解释“为什么”，不写“是什么”；中文用于用户可见逻辑，英文用于底层算法。
- 禁止：在 `src/` 使用 `console.log` 作为常态日志（测试与 `apps/` 可）；未确认书面许可范围前，不复制 `thirdparty/inkField` 或 `thirdparty/inkEngine` 的代码、shader、常量表及受限素材。

## 3. 文档约定

- `docs/` 面向**使用者**：01..10 区分「旧原型已实现 API」「PixiJS 设计目标」「未实现项」；只有已在仓库实现的 API 才给出可运行代码，不伪造 PixiJS 用法。11 为有日期的旧路线参考附录。
- `plan/` 面向**规划**：`plan/10` 维护 2.0 阶段状态（`[x] / [~] / [ ]`）与证据；01..09 保留旧路线研究/迁移草案与审计，不作现行实施承诺。
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
- `thirdparty/inkEngine` 为 inkField 可读还原版，其 LICENSE 提及但未附书面授权；在核验许可主体和移植/再分发范围前，不复制 JS、shader、内嵌字体/第三方组件或 `demo.json` 进 `src/`/`apps/`。公开仓库须审计受限快照与提交历史。
- 新增依赖仅允许 MIT / BSD / Apache / LGPL（不修改、独立分发），并在 `THIRD_PARTY_NOTICES.md` 登记。
