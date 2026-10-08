# 10 · InkGames 2.0：PixiJS + Matter.js 横屏水墨动作游戏引擎实施计划

> **状态：设计与迁移计划，非已实现说明。** 2026-10-08 起本文件为 2.0 目标基线，替代 [07 的旧迁移基线](./07-microkernel-plugin-plan.md)中“能力插件/微内核 + 《墨渡》单关 v0.1”的产品范围；`plan/01..09` 留作历史研究与原型审计。当前旧 p5.js/原生 WebGL2 原型仍与新增的 PixiJS/Matter.js 2.0 基础模块并存，`apps/` 现有十卡首页和十个初步演示，以及暂留的《墨渡》《江湖夜行》。完整效果和浏览器验收仍未完成。与工程规范冲突时以 [AGENTS.md](../AGENTS.md) 为准；实现完成后同步 [README](../README.md)、`docs/` 与许可清单。
>
> **来源边界：** [thirdparty/inkEngine](../thirdparty/inkEngine/README.md) 是基于 inkField 混淆构建的可读还原版，包含受限代码、内联 GLSL、字体、第三方组件和 `demo.json`；[其 LICENSE](../thirdparty/inkEngine/LICENSE) 声称使用者有书面授权，但授权书及范围不在仓库。它只用于识别**功能需求和待验证行为**；未核实明确覆盖衍生、移植、商用和再分发的书面授权前，**不得复制/改写其 JS、shader、常量表、内嵌字体、demo.json 或名称映射的实现**进 `src/`、`apps/` 或发行物。即使获授权，也须按范围、归属及第三方许可证逐项留痕；改用 PixiJS 不会自动获得权利。视觉算法优先从通用公开资料独立设计并以自建资产验证。

## 1. 2.0 目标与非目标

**交付**：桌面优先、宽屏（设计分辨率建议 1280×720，逻辑 world 单位与 CSS px 显式映射）的 TypeScript 水墨横版动作引擎。PixiJS 管一个 WebGL 画布和资源；Matter.js 作为唯一动力学求解器；引擎内核默认具有场景/相机/输入、固定步、角色 FSM、物理/碰撞、权威笔画/侵蚀、水墨渲染及常见效果服务；`src/plugins/` **只负责组合核心效果/行为为可配置道具或角色表现**，如刀剑、马匹，而不是把宿主、物理、渲染当作必须安装的能力插件。`apps/` 首页提供十张可点击效果卡，每张打开独立目录的实际互动示例。

**首版效果清单**：墨色交融/破墨、打击溅射、动态水墨刀光与残影、动态背景和空气流场、涟漪/水纹、宣纸纹理与干湿飞白、运动扬尘/蹄迹、墨障侵蚀以及受击/镜头反馈。战争题材仅是抽象视觉语汇（兵器、奔马、旌旗、烟尘、河面），不预设写实伤害或具体历史题材。单一 WebGL 上下文；60 FPS 仅作为目标机器的实测指标，不能承诺“数千粒子必然满帧”。移动端、网络联机、跨平台逐位确定性、完整 NavMesh/流体物理、十款完整游戏和原版 inkEngine 逐像素复刻**不在 2.0 初版范围**。

## 2. 从参考版抽取能力，不移植实现

| `inkEngine` 可观察能力 | 2.0 目标/归属 | 差异与验收 |
|---|---|---|
| `beginStroke`/`addPoint`/`endStroke`、笔压、笔尖运动与七类笔刷 | `core/ink/brush`：独立采样、可配置湿/枯/飞白笔触 | 仅借鉴交互类别；定义新参数/资产及稳定输入量化，不照抄算法、默认值、随机表 |
| 多缓冲反馈、湿干层、type map、混色、纸纹 | `core/ink/rendering`：Pixi RenderTexture、Filter、颜色/纸张合成 | 自研 WebGL shader；先离屏墨点→模糊→alpha 阈值与色阶，再研究可选扩散/固化；非真实流体与质量守恒保证 |
| force map、distort、Flow、飞白/喷点与后处理 | `core/effects`：风场/扭曲/墨喷、纸性/边缘和水纹 | CPU 世界力与 GPU 视觉风场分离；Flow/颜色混合随机源重新定义，不把参考版的可复现性声明外推 |
| 遮罩、相机、绘图录制 | `core/world`、`core/recording`、`core/rendering` | 水刷不能只遮罩显示；场景/录制 schema 独立版本化，不直接加载受限 `demo.json` |
| 参考版没有通用战斗物理 | `core/physics` + `core/combat` 新增 Matter 世界/角色 FSM/武器 sweep | Matter 不负责墨汁扩散或笔尖滤镜；角色命中仅依赖 CPU 权威数据 |

参考版相关事实见 [inkEngine README](../thirdparty/inkEngine/README.md) 与该目录的 `ink-engine.js`；README 声称的 `screens/` 和还原工具不在此目录清单内，不把参考版逐像素测试结果当成已复核的 2.0 证据。`thirdparty/inkField` 同样受限；`thirdparty/inkwash` 为 MIT，但实际移植时必须保留版权声明。

## 3. 目录与公开 API 的目标形态

```text
src/
  index.ts                         唯一公共 API：创建/销毁引擎、装配道具、类型
  core/
    engine.ts  clock.ts  events.ts  resources.ts
    host/                           Pixi Application/WebGL 初始化与生命周期
    world/                          场景/相机/输入/资产与坐标
    physics/                        Matter 世界、碰撞代理、可破坏几何同步
    combat/                         角色 FSM、攻击轨迹、命中/击退
    ink/                            权威笔画/侵蚀、墨层、纸、着色器、笔刷
    effects/                        可复用喷溅、刀光、残影、风场、涟漪、尘土等
    recording/                      固定步输入、版本化场景/回放
  plugins/                          道具/载具效果组合与配置：不持有第二套引擎时钟
    sword.ts  blade.ts  spear.ts  bow.ts  shield.ts
    war-horse.ts  banner.ts  ink-bomb.ts  water-brush.ts  boat.ts
apps/
  index.html  main.ts  styles.css   十张卡片的首页；资源按项目规范管理
  sword/  blade/  spear/  bow/  shield/
  war-horse/  banner/  ink-bomb/  water-brush/  boat/
    index.html  main.ts             每个目录独立可运行页面；共享 src/core + 道具插件
```

上述只是目标目录，**现在均不可作为已存在路径链接或已导出 API 使用**。`src/core` 是内部实现的位置，不意味着外部用户直接 import 任意深层模块；公共入口仍统一 `src/index.ts`。功能内置意味着默认可用，不排除按需启用/配置贵重 GPU pass；`src/plugins` 的 manifest 改为 `itemId/version/requiresEffects/config` 等稳定配置，组合核心服务/效果、声明冲突及顺序、清理租约，不再为 Canvas/Renderer/Physics 提供独占 token。保留旧插件图中的版本/依赖/失败回滚能力，适配道具组合；按用户要求 TS 对象结构用 `interface`，禁止 `any`。

### 内核职责和时序

单个 `Engine` 负责 RAF、固定步累加、context lost 暂停、场景/资产与资源所有权；关闭 Pixi 自动 ticker 和 Matter Runner 的自动循环。固定步 60 Hz：采样/量化输入→角色 FSM/道具意图→CPU 墨障与水刷侵蚀→提交/替换 Matter 静态碰撞体及接触状态→`Matter.Engine.update`（毫秒步长）→武器 sweep/伤害/击退/事件；渲染帧从 CPU 状态快照驱动 Pixi DisplayObject，一次合成纸/远景/墨障/角色/粒子/刀光/水纹/屏幕 UI。锁定桥未被批准擦除时，视觉与 collider 均保持；重叠笔画按笔 ID/层级清洗，不仅按擦除请求画白色。相机抖动只改变视觉，不移动物理世界。

物理渲染均可实现 `init/pause/resume/dispose`（及失上下文资源重建）；资源所有权归内核，插件只借用并按租约注销。Matter 对厚笔画碎段没有现成等价的“带宽胶囊链”保证：先做形状近似/碰撞接缝/短碎段/批量重建 spike，若不达标保留 CPU 几何求交作墨障权威碰撞代理，或重新评估求解器，**不能**放弃“擦桥改变碰撞”。对 Matter 的跨浏览器浮点排序不做无证据的严格确定性承诺。

### GPU 效果分层（所有权与预算）

- **墨色交融/破墨**：将墨点、溅墨 splat 绘到独立 RenderTexture，blur 后 alpha threshold/color ramp 合成；破墨用多墨色和浓淡层的独立遮罩/色阶，不能简单叠白造成隐形墨障；检验混色重叠、预乘 alpha、滤镜 padding 和墨量守恒目标是否需要定义。
- **刀光/残影/碰撞溅射**：武器 sweep 事实事件→Pixi Mesh 轨迹/噪声飞白、短寿命 RenderTexture 残影、受击点有限粒子池；命中次数只由 core/combat 决定。颜色/粒子形态由道具配置复用，无专属 GL 违规 pass。
- **风场/动态背景**：多层远山/烟幕/竹草/旌旗的 shader 或 Mesh 形变，空气粒子用核心视觉流场采样；如需风影响马、箭或物理体，另由 CPU 固定步显式施力，不能 GPU 回读驱动物理。
- **水纹/载具/马匹**：河面涟漪以事件源/半径/寿命做局部 shader/Mesh 位移，船/马通过 Matter body 或离散碰撞代理运动；蹄迹、扬尘、尾鬃变形只消费步级轨迹，支持暂停与重播。
- **纸与层级**：许可清楚的暖纸底/纹理；multiply 仅用于经预乘 alpha 校验的墨层，不把 UI/人物全局正片叠底。透明背景与多画布限制在同一后端验证。

先测小分辨率 ping-pong、滤镜/纹理的内存、dirty 区域和动态质量降级，再提高粒子数和多层背景；PixiJS 的版本化 Filter、Mesh、RenderTexture API、WebGL-only 初始化及丢上下文恢复要在锁定版本下通过独立 spike。不要以参考引擎的原生 GL state、shader 源码或旧 FBO 能力作为 Pixi 2.0 的已实现保证。

## 4. 首页 10 张效果卡及其可点击页面

`apps/index.html` 展示恰好十张可访问、可键盘聚焦的卡片（标题、简短说明、交互操作、加载/错误状态），每张导航至有实际 `index.html` 的子目录；禁用只画封面、不产出效果的占位卡。每页使用同一 16:9 宽屏演示容器，支持返回首页、暂停/重启、效果开关和一段可重复的默认动作；页面按需加载本页所需资源，不同时创建多个 WebGL context。

| card / 目标路由 | 道具组合或场景 | 最小可检查交互/视觉结果 |
|---|---|---|
| 剑 · `/sword/` | `sword`：刀光轨迹 + 飞白 + 残影 | 交互挥剑，攻击轨迹短时保留，命中才溅墨 |
| 刀 · `/blade/` | `blade`：宽墨刃 + 破墨 + 打击喷溅 | 挥刀穿过墨障可见墨色交融，实体命中有喷点 |
| 枪 · `/spear/` | `spear`：线性刺击 + 穿透墨痕 | 刺击沿轨迹触发有限墨点，命中按 ID 去重 |
| 弓 · `/bow/` | `bow`：弹道 + 命中晕染 | 发射后箭影不决定物理命中，落点触发晕染 |
| 盾 · `/shield/` | `shield`：格挡墨圈 + 冲击波 | 格挡成功后才出现墨环/粒子，失败不触发 |
| 战马 · `/war-horse/` | `war-horse`：奔跑蹄迹 + 扬尘 + 鬃毛 | 连续奔跑/停下，蹄迹寿命及尘雾随速度变化 |
| 旌旗 · `/banner/` | `banner`：风场 + 布帛 Mesh | 调整风向/强度，旗帜与背景空气粒子响应 |
| 墨弹 · `/ink-bomb/` | `ink-bomb`：抛射 + 溅射 + 墨色融合 | 落点墨点合团、不同墨色碰撞显示破墨 |
| 水刷 · `/water-brush/` | `water-brush`：水痕 + 墨障侵蚀 | 擦断可擦桥后真实 collider 消失，锁定桥不误擦 |
| 舟 · `/boat/` | `boat`：水纹 + 局部流场 + 舟尾残影 | 舟行/停靠形成传播后衰减的涟漪 |

卡片与插件不是一一对应的“每页一套引擎”：同一 effect 能组合到多个道具，比如剑/刀共用 slash + splash，舟/水刷共用 ripple。十页均作为**效果示例**验收，不能将 Demo 误写成十款完整游戏；若某效果未通过 GPU/授权门槛，该页不得作为完成的卡片发布。

## 5. 从现有工程迁移的变更清单

| 现状 | 2.0 动作 | 不可丢的回归 |
|---|---|---|
| `src/core/engine.ts`、`types.ts`、`plugin-graph.ts` | 保留时钟/事件/资源/失败回滚，修改内核内置能力和道具组合接口；重整 `src/index.ts` 对外导出 | 固定步、缺依赖报错、逆序清理/多实例隔离 |
| `src/plugins/world.ts`、`geometry.ts`、`brush-model.ts`、`tokens.ts` | 将 world/相机/输入/权威笔画迁到 `src/core`，变更 token 契约且提供迁移对照 | 水刷切桥、locked/干燥、同一步碰撞与几何一致 |
| `src/plugins/physics.ts` | 用 Matter 适配替换圆—胶囊原型，墨障形状用专项 spike 定案 | 圆体/角色落桥、擦断后掉落、接缝不漏碰 |
| `src/plugins/ink-fluid*`、`p5-host.ts`、`renderer-webgl2.ts`、`gl-state.ts`、`scene-renderer.ts`、`canvas-surface.ts` | Pixi Core 实现通过新测试后删除旧宿主和 pass；原生 GL 不直接塞进 Pixi context | 相机/尺寸、离屏合成、context 恢复、纹理/事件释放 |
| `src/plugins/scene-json.ts`、`recording.ts`、`inkcross.ts` | 场景/录制改成 2.0 版本化格式；移除墨渡专用规则的公共引擎依赖 | 旧输入能迁移或明确拒绝；固定步回放保留版本 |
| `apps/inkcross/`、`apps/wuxia/` | **先确认测试/样例无引用，再删除旧应用**，保留必要的自主创作测试场景数据到测试 fixture，首页 + 十子目录替换之 | `tests/game.test.ts` 当前引用 `apps/inkcross/scene.json`，需先迁移；避免删应用令测试失效 |
| `vite.config.ts`、`build.sh`、`scripts/browser-smoke.mjs`、`README/docs/AGENTS` | 构建多入口首页与十子页，dev/preview 默认首页，浏览器烟测逐卡，更新指向旧 demo 的说明 | 开发及 `dist/` 中首页+十页能实际导航、浏览器无异常 |

实现阶段允许**短时并存旧源码与新模块**作为迁移对照，但不得让 p5 和 Pixi 同页各开一套画布或让 p5 成为正式产品依赖。旧 `create*Plugin` 等公共导出需列弃用/替换表，所有跨模块消费者随改；旧 `plan/08..09` 的局部重绘墨量/碰撞视觉对账风险在新后端复验，不因删除旧代码自动解决。

## 6. 阶段、依赖与验收（按实际证据更新，未验收不标完成）

> 2026-10-08 迁移记录：`pixi.js@8.22.0` / `matter-js@0.20.0` 已安装并登记；已新增 `InkWorld` Matter 桥碎段/FSM 单测、`InkStage` Pixi 单画布原型、十张卡与十子路由；`./build.sh check` 42 项测试通过、`./build.sh build` 成功；弓/墨弹已接入 Matter 首碰撞事实与未命中投射物回收，撞击后才生成墨喷与涟漪；`ItemPreset.action` 已分出枪直刺、马奔跑/蹄迹、旗风/旗面、舟行/水纹等页面行为（CPU 单测通过，新页面仍未实测，旗面为 Graphics 草图非 Mesh）。`./build.sh browser` 当前**仅验证旧 p5 两页**，同时报告旧墨量路径对账偏差约 72%，**没有验证新 Pixi 页面**；内嵌浏览器控制桥不可用，Pixi 滤镜/Shader、真实 GPU 性能和十页交互均未实测。参考版授权书不在仓库，采用独立实现但公开发布门槛未满足。旧 `apps/inkcross`、`apps/wuxia` 与旧 API 暂留作迁移基线，不能提前删除。

| 阶段 | 前置与落地工作 | 退出条件 |
|---|---|---|
| V0 授权与技术 spike [ ] | 获取/核验 `inkEngine` 使用授权**实际范围**或明确 clean-room 隔离；审查 PixiJS/Matter/素材许可，锁版本。Pixi WebGL 单画布/Filter/Mesh/RT、Matter 胶囊替换/批量重建各做最小实验 | 形成授权/依赖审计记录；未经授权仅独立实现；失败项有替代路径，不阻塞既有旧原型 |
| V1 核心底座 [ ] | 让 Pixi 宿主、资源/相机/场景、Matter 固定步与 FSM 成为 core 默认能力；运行单一 RAF，导出 2.0 API | 宽屏无墨角色跳跃/平台/攻击的单测与浏览器 E2E；暂停/销毁/resize/context lost 不泄漏或双更新 |
| V2 墨水与权威几何 [ ] | CPU 笔刷、水刷/碎段/物理重建；RenderTexture+blur+threshold/色阶、宣纸，事件按笔 ID 对账 | 画桥→擦桥→角色掉落；锁定与交叠不留隐形桥；过滤透明边/纸底/性能有实测 |
| V3 动作与环境效果 [ ] | 开发共用 slash、afterimage、splash、flow-field、ripple、dust、banner cloth；增加降档/资源池 | 固定场景脚本触发与暂停重播可测；无未捕获 GL 错、帧预算/资源峰值明确，未达帧率降档 |
| V4 道具组合 [ ] | `src/plugins` 只写十个道具/载具效果配置与行为组合，冲突/依赖/寿命测试 | 剑刀共用核心效果，马/舟可关闭视觉而物理仍运行；注册/卸载及多实例不泄漏 |
| V5 演示替换 [ ] | 首页十 card + 十个可交互子目录，迁移测试 fixture 后删除旧 `apps` 两目录；更新 Vite 构建入口、`build.sh`、browser smoke | 开发/生产十条路由可点击、导航回来、各页实际触发目标效果；所有旧入口引用清零 |
| V6 文档与发布 [ ] | 更新 README/AGENTS/docs、录制/场景迁移、第三方通知与素材许可，桌面真实 GPU/浏览器兼容测试 | `./build.sh check` + `./build.sh build` + 更新后 `./build.sh browser`；许可、功能、性能分别报告，不以 SwiftShader 证明 60 FPS |

原则上 V1 可在旧版并行保留；V0 的**授权边界决定哪些素材能进入实现**，不等待上线时才审查。V1/V2 的 CPU 逻辑用无 GPU 单元测试先覆盖；V3/V5 需 Playwright/Chromium 功能验收；真实 GPU 目标机报告与许可证审查是 V6 单独门槛。缺 WebGL/格式不支持时展示明确错误或关闭相应高阶视觉，不出现物理仍存在而墨障完全不可见的静默降级。

## 7. 明确需要验证/决策

1. `inkEngine` 作者授权的可核查文本、被许可主体、可用范围、二次发行/商用/衍生与第三方权利；没有文书不移植，公开仓库还要审查 `thirdparty/inkEngine`/`inkField` 快照和提交历史。其 EasyCam 许可记录不一致，不打包或移植它。
2. Matter 对可破坏宽笔画的接缝和碎段上限、碰撞事件顺序；失败时保留 CPU 碰撞代理或调整技术选择，但“水刷改权威碰撞”不能撤销。
3. 墨色融合用 alpha/色阶还是进阶 pigment 场、多色交叠与湿干固化的顺序；锁定/已干墨障是否允许擦除。先黑墨单层出视觉与物理对账，再扩多墨色。
4. 宽屏世界尺寸、桌面最低浏览器与硬件、各档纹理像素/粒子预算；20/60/144Hz 输入时序测试与真实 GPU p95 目标。帧率不能从参考项目或库宣传外推。
5. 旧场景/录制是否迁移、十个示例的美术资源与授权来源；不存在向前兼容保证时须提供显式版本错误或迁移脚本，而不是静默解析。
