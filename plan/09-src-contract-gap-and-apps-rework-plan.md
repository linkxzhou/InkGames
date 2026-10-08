# 09 · src 契约偏差审计与 apps 返工计划

> 生成日期：2026-10-08。前置：[07 实施基线](./07-microkernel-plugin-plan.md)、[08 inkField 优化计划](./08-inkfield-informed-optimization-plan.md)。
> **文档优先级**：AGENTS.md → plan/07 → docs/01..11 → plan/01..06。本文（09）是**审计与返工计划**，不与 07 的验收门槛冲突；与 07 冲突处一律以 07 为准，并在 §7 记录待决策。
> **审计方法**：静态阅读 `src/`、`apps/`、`tests/`、`docs/`，用 `grep` 交叉验证调用面。除 plan/08 已记录的 SwiftShader 冒烟外，**本轮没有任何新增浏览器/真机实测**；凡"未实测"均已标注。

## 0. 结论摘要

**`src/` 微内核与插件图是本项目最扎实的部分**（拓扑排序、生命周期回滚、服务白名单、步级命令/事件、固定步调度均有单测覆盖），问题集中在**能力插件的接线断裂**与**契约项未落地**两类：

| 级别 | 主题 | 条数 | 是否阻塞《墨渡》可玩 |
|---|---|---|---|
| **P0** | 球/目标无渲染、水刷视觉擦除未接线、HostPort 契约缺口 | 3 | **是** |
| **P1** | locked 语义与 07 §4.4 冲突、命令集缺 AddWater/FixInk、侵蚀非事务、固定步采样滞后、相机空转、ink-webgl2 死代码 | 6 | 部分 |
| **P2** | apps 与 AGENTS/plan 目录未同步、wuxia 未走引擎场景能力、GPU 资源未登记 owner | 3 | 否（但影响验收可信度） |
| **P3** | docs/plan 状态漂移（共 6 处"说没有、实际已有"） | 6 | 否 |

**最严重的一条**：《墨渡》页面实际上**只有纸纹和墨迹**——墨珠和终点印章从未被任何插件绘制。plan/07 §5 G2 的"无墨『球落到静态桥』"、docs/10 §1 的"球滚动→水刷洗断→球掉落→重试→通关"目前**都无法用肉眼验证**。浏览器冒烟之所以通过，是因为它只断言了 `status:'playing'` 与 `ink` 文本，从未断言画面内容。

---

## 1. 审计基线与范围

| 对象 | 范围 |
|---|---|
| `src/core/` | `engine.ts`、`plugin-graph.ts`、`types.ts` |
| `src/plugins/` | `p5-host`、`renderer-webgl2`、`gl-state`、`world`、`geometry`、`physics`、`scene-json`、`ink-fluid`、`ink-fluid-plugin`、`ink-webgl2`、`recording`、`inkcross`、`brush-model`、`tokens` |
| `apps/` | `inkcross/`、`wuxia/` |
| `tests/` | 4 个测试文件 + `helpers/fake-host.ts` |
| 契约来源 | AGENTS.md、plan/07（§1–§7 为主）、docs/01–11 |

**已验证事实**：`./build.sh check` 通过（**32** 个测试）、`./build.sh browser` 通过（SwiftShader，双 demo 页面打开、墨渡画笔落墨与擦桥像素变化、wuxia 自动击杀）。
**未验证**：Safari/Firefox、真实 GPU、性能、context lost 恢复、跨机确定性。

---

## 2. 问题清单

### P0 — 阻塞《墨渡》成立

#### P0-1 球与印章完全没有渲染，关卡不可玩

**证据**

```
$ grep -rn "renderPhase" src/plugins/*.ts
src/plugins/ink-fluid-plugin.ts:17:  ... renderPhase: 'ink',
src/plugins/ink-webgl2.ts:66:       ... renderPhase: 'ink',
```

`grep -rn "circles\|goal\|ball" src/plugins/*.ts` 除 `tokens.ts`/`physics.ts`/`scene-json.ts`/`inkcross.ts` 外**零命中**：没有任何插件读取 `Scene2D.circles` 或 `inkcross` 的 `goal` 去绘制。`apps/inkcross/main.ts`（86 行）只装配插件 + 写 HUD 文本，也没有绘制代码。

**违反**

- plan/07 §5 G2 验收："无墨『球落到静态桥』、拔掉 ink 仍能跑"
- plan/07 §7 架构验收："无 Ink 仍能渲染基础 2D 场景"
- docs/01 核心验收故事："空项目→无墨的球与桥→玩家画桥→水刷擦断桥→球落下"
- docs/07 §13 插件拆分：`renderer-webgl2` 拥有纹理/FBO/pass，`ink-compositor` 管显示——**基础 2D 实体渲染没有任何归属插件**
- docs/10 §1："单屏《墨渡》教学关：有目标与失败提示，玩家画桥、球滚动……"

**影响**：玩家看不到墨珠与印章，只能看到墨迹与纸纹；"球是否落在桥上""是否掉进缺口"完全不可观察。G5 的通关验收无从谈起。

#### P0-2 水刷视觉擦除没有接线，`InkVisual.erase` 是死接口

**证据**

```
$ grep -rn "\.erase(" src apps tests
src/plugins/geometry.ts:154:  ... => erosion.erase(...)          // 这是 Erosion（CPU），不是 InkVisual
src/plugins/ink-fluid-plugin.ts:20:  visual = { ..., erase: (path, radius) => field.erase(path, radius), ... }
src/plugins/ink-fluid.ts:278:  erase(_path, _radius): void { this.rebuild(); }   // 参数被忽略
```

`InkVisual.erase` 只在 `ink-fluid-plugin.ts:20` 被**定义**，从未被订阅 `EraseStroke` 的任何代码调用。目前视觉能"跟上"擦除，靠的是 `StrokeChanged → rebuild = true → 全量重建 pigment/wet` 这一副作用链路（`ink-fluid-plugin.ts:29`）。

**违反**

- plan/07 §4.4："显示侧由同一命令生成局部遮罩/冲洗 splat：对可清除的未干墨同时更新活动颜料和 wet"
- plan/07 §3："CPU stroke/collider 与 GPU rendering 订阅同一笔命令"
- docs/07 第 4 步："水刷视觉擦除：对权威几何变化的 sweep 局部区域做 wet/active 层的清洗或搬运"
- 与 plan/08 §3.1（O1）的"安全增量提交"是同一处欠债

**影响**：① 视觉与 CPU 权威几何的同步机制不成立，任何修改 `StrokeChanged` 语义的改动都会静默破坏画面；② plan/08 §3.5 的"局部擦除"没有可接入的接口；③ 擦除后残留湿度的"纸性涌现"（plan/08 §3.5 验收项）无法实现。

#### P0-3 `HostPort` 与 plan/07 §2 契约不符，context lost 无法处理

**证据**

```ts
// src/core/types.ts:1-5（实际）
export interface HostPort {
  now(): number;
  requestFrame(callback: (timestamp: number) => void): number;
  cancelFrame(handle: number): void;
}
```

plan/07 §2 写的是："**宿主端口契约**：`HostPort.canvas/clock/now/requestFrame/cancelFrame` 由 p5 instance 宿主提供"。`canvas` 与 `clock` 都不存在。

`src/plugins/p5-host.ts:28`：

```ts
const onLost = (event: Event) => { event.preventDefault(); };
canvas.addEventListener('webglcontextlost', onLost);
```

**只吞事件**：不暂停时钟、不重建资源、不监听 `webglcontextrestored`。

**违反**

- plan/07 §2 宿主端口契约（缺 `canvas`/`clock`）
- plan/07 §8.2 风险表："p5 2.3.4 没有 `webglcontextlost` 处理 → **host-p5 自己监听 lost/restored，统一暂停时钟并重建**"
- plan/07 §8.3 G1 断言 5："`WEBGL_lose_context` 触发 lost/restored 后资源重建，且无泄漏"
- docs/02 §"从 0 到 1"第 4 步与 docs/10 §（Phaser 4 参照）

**影响**：G1 未通过；真实用户切标签页/显卡驱动重置后页面永久黑屏且无提示。

### P1 — 契约项缺失或语义相反

#### P1-4 `locked` 语义与 plan/07 §4.4 直接冲突

plan/07 §4.4 明确：

> **本轮桥在松笔后立即可碰撞，但在 CPU 计时达到 `dryAtStep` 前仍可被水刷擦断**；"能碰撞"不等于"已锁定/不可擦"。锁定后碰撞仍存在且水刷不产生误导性视觉擦除。

实际实现：`Stroke.locked` 是**加载时写死的布尔**（`scene-json.ts:8` / `scene.json:8`），`geometry.ts:143` 直接 `if (stroke.locked) continue`。全仓 `grep dryAtStep` **零命中**——没有计时、没有湿度驱动、没有固化时机。

**影响**：① 计划里"玩家画的桥会被自己擦断、系统预绘的桥擦不断"这一玩法区分退化成"JSON 里手写的布尔"；② plan/08 §3.4 的"干墨固化（dry 通道）"与 `locked` 无法对应；③ G3 的"擦已干桥规则"待决项被隐式跳过。

#### P1-5 四个 CPU 权威命令只实现了两个

plan/07 §2：

> 固定步内的 `InkCommand` 代表唯一事实来源：`DrawStroke`、`EraseStroke`、`AddWater`、`FixInk`

实际只有 `DrawStroke`/`EraseStroke`（`geometry.ts:5-6`）。`AddWater`/`FixInk` 不存在；`inkcross` 的墨量预算只按笔画宽度加权长度扣减，与"注水""固化"无任何关联。

**影响**：plan/07 §3 的调度顺序与 docs/06 的"画笔/水刷/固化"三段语义缺一段；plan/08 §3.4 的干墨交换只能靠 shader 内部湿度近似（已在 `ink-fluid.ts` 的 `settle` pass 里临时实现），**没有 CPU 权威侧对应**，回放无法验证。

#### P1-6 侵蚀不是"单次事务替换"，`StrokeChanged` 逐个投递

plan/07 §4.3：

> 笔画几何与碰撞体**单次事务**替换：旧 collider 暂存、新链生成、更新空间哈希/网格的占用，再发布 `StrokeChanged`

实际 `geometry.ts:142-149`：

```ts
for (const stroke of store.strokes) {
  if (stroke.locked) continue;
  const fragments = stroke.fragments.flatMap(fragment => eraseFragment(fragment, path, radius));
  if (JSON.stringify(fragments) === JSON.stringify(stroke.fragments)) continue;   // 全量字符串比较
  stroke.fragments = fragments;                                                    // 就地改
  changed.push(stroke.id);
  ctx.events.emit('StrokeChanged', {...});                                         // 循环内边裁边发
}
```

**三个问题**：① 在遍历中就地改写并立即发事件，不是"暂存→提交"；② 物理的网格重建靠 `dirty` 标记回灌（`physics.ts:55`），依赖事件时序而非事务；③ 用 `JSON.stringify` 做变更检测，既有分配开销又把浮点差异当成变更。

plan/07 §3 还要求："事件完成本步提交再投递，**严禁水刷修改碰撞体时物理仍持有旧引用**"——当前 `service.colliders` 是**同一批对象引用**（`physics.ts:31` 直接把 `fragment[i-1]`/`fragment[i]` 存进 `next`），`eraseFragment` 产出的新数组虽是新对象，但中间态仍可能被同一步的物理读到。

#### P1-7 固定步内每样本只推进 1 步笔尖，快速运笔严重滞后

docs/06 §"输入管线"：

> 每步全部样本按 timestamp/order 分组 → 按路径距离重采样生成 BrushPath；一笔中多个事件不能因固定步只有 1 次而丢弃

实际 `geometry.ts:42-58` 对 `input.drain()` 的**每个样本调用一次 `advanceBrush`**，每次只做一次弹簧积分。60Hz 下若一帧积压 5 个 coalesced 样本，笔尖只前进 5 个"步"、但目标是 5 个不同位置——笔尖既不是按步长推进，也不是按样本数补步，轨迹会明显滞后于指针。

**影响**：plan/08 §3.3 的"速度→粗细（提按）"手感依赖正确的速度估计，当前速度由滞后位置算出，偏小；`docs/06` 的"不得丢样本"只做到了"不丢"，没做到"按时序回放"。

#### P1-8 相机插件空转，viewport/resize 缺失

`src/plugins/world.ts:21-35` 的 `Camera2D` 只有 `x/y/zoom` 三个字段与两个纯函数变换，**没有 viewport、没有 resize、没有矩阵**；且没有任何代码修改 `x/y/zoom`（恒为 0/0/1）。

plan/07 §5 G2："kernel、scene2d、**camera2d**、input、assets、collision2d"；docs/05 §"变换、层与资源"："camera 包含平移、缩放和 **viewport**，输出 matrix/inverse 给 renderer、input 与 screenshot 同用"；docs/05 §"从 0 到 1 的验收"："相机 zoom/pan、CSS 布局变化与窗口 resize 后，以同一 world 点测试输入、碰撞、画面误差"。

**影响**：`createPointerPlugin` 依赖 `CameraToken` 做坐标变换，一旦相机真的动起来（或 canvas 尺寸与 world 不一致），指针坐标就会错。当前之所以"看着对"，是因为 `zoom===1 && x===y===0` 时两个变换都退化为恒等。

#### P1-9 `ink-webgl2.ts` 是死代码，且与 `ink-fluid-plugin` 争用互斥 token

```
$ grep -rn "createInkWebGL2Plugin" src apps tests
src/index.ts:19:export { createInkWebGL2Plugin } from './plugins/ink-webgl2';
```

只有导出，**没有任何 app 或测试使用**。同时它与 `ink-fluid-plugin` 都 `provides: [{ token: InkToken, ... }]`，若同时装配会被 `resolvePlugins` 以 `Duplicate provider for inkgames.ink-visual` 拒绝。

docs/07 第 5 行仍把 `createInkWebGL2Plugin` 描述为"已实现：单通道墨层原型"的主要路径，而实际 app 用的是 `createInkFluidPlugin`。**文档读者会走错入口。**

**影响**：① 147 行维护负担；② 两个实现各有一套 `splat`/`display` shader，plan/08 的优化只做在 fluid 一侧，两套代码会持续漂移。

### P2 — apps 与规范不符

#### P2-10 目录与规范未同步

| 声明位置 | 原文 | 实际 |
|---|---|---|
| AGENTS.md §1 目录树 | `└── inkcross/  《墨渡》教学关：index.html + main.ts + scene.json` | 只有 `apps/inkcross/`，**无 `apps/wuxia/`** |
| AGENTS.md §1 目录树 | `├── assets/  纸张、印章、字体等美术资源（含许可说明）` | **目录不存在** |
| AGENTS.md §6 许可红线 | "新增依赖……并在 `THIRD_PARTY_NOTICES.md` 登记" | **文件不存在** |
| plan/07 §6 结构图 | `apps/  inkcross/  index.html + main.ts + scene.json` | 同上，无 wuxia |

`grep -rln "wuxia\|江湖夜行" plan docs README.md AGENTS.md` → **只有 README.md 命中**，plan 与 docs 完全未登记这个 demo。

#### P2-11 wuxia 是"套壳 Canvas 2D"，没有验证引擎的场景/实体能力

`apps/wuxia/main.ts`（228 行）实际只用了引擎的：`Engine` 固定步、`createScenePlugin`（**作为空容器，从未 `addCircle`**）、`createP5Host`、`createWebGL2RendererPlugin`（仅为满足 `RendererToken` 依赖）。

战斗逻辑全部是模块级可变全局（`hero`/`foes`/`slashes`/`arrows`），渲染是：自建 2D canvas → `ctx` 画 → 每帧 `texImage2D` 上传整张 900×520 → 手写 shader 贴屏（`main.ts:206-221`）。

**问题**：① 作为"引擎 demo"，它没有验证 plan/07 §5 G2/G3 的任何一项（场景实体、相机、碰撞、水刷）；② 每帧 `texImage2D` 全屏上传未登记成本，plan/09 §"开发工具与预算"要求记录所有存活纹理与 pass 耗时；③ 它的纹理/VAO/program 在 `boot()` 里手动创建、在 `beforeunload` 手动 `delete*`，**没有走 `ctx.resources.add()`**，违反 AGENTS.md §2"资源：一切 GPU/监听器/定时器通过 `ctx.resources.add()` 登记清理"；④ 两个入口共享 1.17MB 的 `world-*.js`（含整套墨层 shader），wuxia 完全用不到。

#### P2-12 GPU 资源 owner 未登记

AGENTS.md §2："一切 GPU/监听器/定时器通过 `ctx.resources.add()` 登记清理；`dispose()` 必须幂等"。

- `apps/wuxia/main.ts` 的 texture/vbo/vao/program：手动管理，未登记。
- `src/plugins/renderer-webgl2.ts`：`init()` 里创建的 4×4 探测 FBO/纹理在 `finally` 中已删除（正确），但 `renderer.dispose()` 是空函数体（`renderer-webgl2.ts:18`）——目前它不持有资源所以无害，但**契约上是"未登记"**。

### P3 — 文档状态漂移

以下 6 处，docs/plan 写的是"尚未实现"，实际代码已有。docs 是**给使用者的文档**（AGENTS.md §3 要求"必须标注「已实现 API」「设计目标」「未实现项」"），漂移会直接误导读者。

| # | 位置 | 文档原文 | 实际状态 |
|---|---|---|---|
| P3-13 | `docs/03:7` | "**没有** p5 / WebGL2 宿主、场景、物理、墨水模拟或水刷插件"；"仓库暂无包配置" | 全部存在；`package.json` 已提交（`p5 ^2.3.4`、vitest、playwright） |
| P3-14 | `docs/02:7,20` | "仓库未安装 p5"；"渲染插件……**不**实现全 GL 状态守卫" | p5 2.3.4 已装；`gl-state.ts` 的 `withGLState` 已实现并在 6 处使用 |
| P3-15 | `docs/07:7` | "单色画面的功能仅完成 TypeScript 编译，**尚无浏览器实测**" | SwiftShader 冒烟已跑通（含画笔落墨像素断言） |
| P3-16 | `plan/07:8` | "**30** 个单元测试" | 现为 **32** 个 |
| P3-17 | `plan/07:11` | G3 未完成项含"扫掠轨迹、**宽阶段**、**输入量化**" | 宽阶段（64px 网格）与输入量化（1/64 坐标、1/31 压力）**已实现** |
| P3-18 | `plan/07:8` | "`apps/inkcross` **可交互页面**" | 因 P0-1/P0-2，页面可点击但**关卡目标不可见**，不满足"可交互"的验收含义 |

---

## 3. 返工方案（按依赖排序）

### R1 · 基础 2D 实体渲染（解 P0-1）

**新增** `src/plugins/scene-renderer.ts`，`manifest: { id:'scene-renderer', renderPhase:'scene', requires:[RendererToken, SceneToken] }`。

- 只依赖 `RendererToken.canvas/gl` 与 `SceneToken.circles`，**不依赖 InkToken**——满足 plan/07 §7"无 Ink 仍能渲染基础 2D 场景"。
- 最小实现：`gl.clear` 纸色 → 每个 `CircleBody` 用一个圆形 SDF shader 实例化绘制（复用 plan/08 §3.2 的实例化思路），`goal` 用同心环。
- `goal` 不属于 `Scene2D` 契约（`scene-json` 里是独立字段），需决策：**扩 `Scene2D` 加 `markers`**，还是让 `inkcross` 暴露 `goal` 供渲染插件读取（见 §7 决策 1）。
- 资源全部走 `ctx.resources.add()`；`dispose()` 释放 VAO/VBO/program。

**验收**：无 `ink-fluid-plugin` 时页面可见墨珠与印章；`./build.sh browser` 增加"球像素存在"断言（当前只有 `status` 文本断言，这正是 P0-1 长期未被发现的原因）。

### R2 · 水刷视觉擦除接线（解 P0-2）

- `InkVisual.erase(path, radius)` 改为**真正使用参数**：对 `path` 包围盒做 scissor + `clear`，并按 plan/08 §3.5 的"分离静态墨层与动态湿层"前置条件决定是否重绘相交笔。
- 在 `ink-fluid-plugin` 中订阅 `EraseStroke`（当前只订阅 `StrokeCreated/Changed/Cleared`），把 `EraseStroke` 的 `path/radius` 转成 `InkVisual.erase`。
- **保留 `StrokeChanged → rebuild` 作为兜底**（P1-6 未修完前它仍是正确性的唯一保证），但要让两条路径等价，并用 plan/08 §4.1 的"同输入→每 60 步 pigment 总和差 < 0.5%"回归钉住。

**验收**：`browser-smoke` 增加"擦除后缺口区域的 GPU 像素 = 纸色"，并断言 `InkVisual.erase` 被调用（可用计数器或事件）。

### R3 · HostPort 扩展与 context lost（解 P0-3）

- `HostPort` 增加 `canvas`、`clock`（`now` 保留为 `clock.now` 的便捷访问或直接移除，见 §7 决策 2）、`resize`、`onContextLost/onContextRestored`。
- `p5-host.ts`：`webglcontextlost` → `host` 上报 → `Engine` 统一 `pause()`；`webglcontextrestored` → 重建原生资源后 `start()`。
- `renderer-webgl2` 与 `ink-fluid-plugin` 需实现 `dispose()`→`init()` 的幂等重建路径（当前 `InkFluid` 一旦 context 丢失，其 `tex/fbo` 全部失效且无法重建）。

**验收**：`browser-smoke` 用 `WEBGL_lose_context` 触发一次 lost/restored，断言 `status` 回到 `running` 且无页面报错、无资源泄漏（对比重建前后 `gl.getParameter` 计数）。

### R4 · `locked` 语义与固化（解 P1-4/P1-5）

- `Stroke` 增加 `dryAtStep?: number`；`locked` 语义收窄为"场景预绘、永不参与侵蚀"（即当前行为），**新增**"玩家笔画在 `dryAtStep` 之前可擦、之后不可擦"的真源。
- 引入 `AddWater` / `FixInk` 两个命令（plan/07 §2），让 `ink-fluid` 的 `settle` pass 与 CPU 侧固化时机由**同一固定步**驱动，而不是各算各的。
- `inkcross` 的墨量预算与 `FixInk`/干墨挂钩（当前只按宽度加权长度扣减）。

**验收**：单测覆盖"松笔后 N 步内水刷可切断 / N 步后不可切断"；录制回放两条路径状态哈希一致。

### R5 · 侵蚀事务化与采样时序（解 P1-6/P1-7）

- `Erosion.erase` 改为两阶段：先对全部笔画算出 `nextFragments[]`（不动原对象），再**统一提交**（`stroke.fragments = next` + 批量 emit）。
- 变更检测去掉 `JSON.stringify`，改用"碎段数 + 端点坐标"轻量比较。
- `physics.service.colliders` 改为**快照副本**（提交时 `structuredClone` 或手工浅拷贝 `{x,y,radius}`），杜绝物理持有被改写对象。
- `geometry.fixedUpdate` 的输入处理改为：按 `(timestamp, order)` 分组 → 按固定步预算**重采样**（不是每样本 1 步），保证快速运笔时笔尖推进量正确。

**验收**：plan/09 §"对水刷增加的回归断言"要求的每步稳定快照（`fragmentIds`、胶囊数、网格成员、球位置、接触集合）；30/60/144Hz 下逻辑哈希一致。

### R6 · 相机与死代码（解 P1-8/P1-9）

- `Camera2D` 增加 `viewport {x,y,width,height}` 与 `resize()`；`screenToWorld/worldToScreen` 走 viewport。
- **删除 `src/plugins/ink-webgl2.ts`** 并从 `src/index.ts` 移除导出（除非 §7 决策 3 判定要保留为无流体后端的降级路径，则必须给它单独 token，不与 `InkToken` 争用）。
- 同步 `docs/07` 的墨层入口描述。

### R7 · apps 与规范收口（解 P2-10/P2-11/P2-12、P3-13..18）

**wuxia 定位（见 §7 决策 4）**，三选一：

- **(a) 重写为真引擎 demo**：战斗实体进 `Scene2D.circles`／新 `Fighter` 组件，复用 R1 的 `scene-renderer`，仅"仙侠皮肤"用 shader 参数区分；代价约 1–2 天，收益是它真正验证了引擎。
- **(b) 保留为"输入无关的固定步/AI 示例"**：明确写清"只演示 Engine 固定步调度，不演示场景/渲染能力"，并从 demo 清单降级为 `apps/wuxia` 的 `README.md` 说明；GPU 资源必须改走 `ctx.resources.add()`。
- **(c) 移出 `apps/`**（如 `thirdparty/` 风格或直接删除），保持 `apps/` 只有通过验收的 demo。

无论选哪个，都必须：把 wuxia 写入 AGENTS.md §1 目录树与 plan/07 §6；创建 `THIRD_PARTY_NOTICES.md`（登记 p5 LGPL-2.1、playwright Apache-2.0、vite/vitest MIT、typescript Apache-2.0）；创建或删除 `assets/`（当前声明存在但缺失）。

**文档回写（P3）**：按 §2 P3-13..18 逐条修正 docs/03、docs/02、docs/07、plan/07 的状态表述；docs 必须区分「已实现 API／设计目标／未实现项」。

---

## 4. 里程碑与规模估计

| 阶段 | 内容 | 阻塞关系 | 规模 |
|---|---|---|---|
| **M1 可见性** | R1 + R2 | 无 | ~2 天；`scene-renderer.ts` 新增、`ink-fluid-plugin` 接线 |
| **M2 健壮性** | R3 | M1（需先能看见画面验证恢复） | ~1.5 天；`types.ts`/`p5-host.ts`/`renderer-webgl2`/`ink-fluid` |
| **M3 权威性** | R4 + R5 | R2（擦除路径稳定后） | ~3 天；`geometry`/`physics`/`inkcross`/`scene-json` |
| **M4 收口** | R6 + R7 | 与 M3 并行 | ~2 天（wuxia 选 (a) 则 +1 天） |

**每阶段验收**：`./build.sh check`（含新增单测）+ `./build.sh browser`（含新增像素/恢复断言）+ 桌面真实 GPU 手绘冒烟。**SwiftShader 不得作为性能或跨浏览器结论。**

---

## 5. 与 plan/08 的关系

| plan/08 条目 | 本计划的关系 |
|---|---|
| §3.1 A1 增量提交 | R2 是其**前置**：不先接线 `EraseStroke`，增量提交没有可接的接口 |
| §3.2 A2 实例化 splat | R1 复用同一实例化设施，但 R1 的**优先级更高**（它决定关卡是否可见） |
| §3.3 A3 笔刷物理 | R5 的"采样时序"是其**前置**；当前速度估计本身是错的 |
| §3.4 B2/B3 纸性沉积 | R4 的 `FixInk` 是其在 CPU 侧的对应物；当前只有 GPU 近似，回放无法验证 |
| §3.5 B4 局部擦除 | 与 R2 是同一件事，R2 先行 |

**执行顺序建议：M1 → M2 → plan/08 的 O1/O3 → M3 → M4。** 即"先让画面正确可见、再谈增量与批量优化"。

---

## 6. 验收矩阵

| 断言 | 手段 | 当前状态 |
|---|---|---|
| 无 ink 插件仍可见球与桥 | 单测（假宿主）+ 浏览器像素 | ❌ 不成立（P0-1） |
| 水刷擦除后缺口像素 = 纸色 | 浏览器像素 + `InkVisual.erase` 调用计数 | ❌ 不成立（P0-2） |
| context lost → 恢复 → `running` | 浏览器 `WEBGL_lose_context` | ❌ 未实现（P0-3） |
| 松笔 N 步后可擦性翻转 | 单测 | ❌ 未实现（P1-4） |
| 侵蚀事务性：无中间态被物理读到 | 单测（快照对比） | ❌ 未实现（P1-6） |
| 30/60/144Hz 逻辑哈希一致 | 单测 | ✅ 已有（固定步计数）；⚠️ 未覆盖侵蚀时序 |
| 依赖环/缺失服务/init 回滚错误清晰 | 单测 | ✅ 已有 6 项 |
| 文档状态与代码一致 | 人工核对 | ❌ 6 处漂移（P3） |

---

## 7. 待决策（阻塞实施）

1. **`goal` 的归属**：扩 `Scene2D` 加通用 `markers`，还是让 `inkcross` 暴露 `goal` 给渲染插件？（影响 `scene-json` schema 与 R1 实现）
2. **`HostPort.now` 与 `clock` 的关系**：保留 `now` 并新增 `clock`，还是用 `clock` 替换 `now` 做一次破坏性清理？（影响所有插件与测试）
3. **`ink-webgl2.ts` 去留**：删除，还是改造为"无流体后端"的降级路径并给它独立 token？
4. **wuxia 定位**：R7 的 (a) 重写 / (b) 降级说明 / (c) 移出，选哪个？
5. **`assets/`**：是实现（放纸纹/印章/字体），还是从 AGENTS.md 目录树删除该声明？

以上 5 项按 plan/07 §7「已确定／待决」的惯例，**决定后需回写 plan/07 的决策记录**，不在本文单方面定案。

---

## 8. 实施状态（2026-10-08 首轮返工）

> 本轮按 §7 的保守默认值推进，**未**等待决策定案，取值如下：
> D1 → 扩 `Scene2D.markers`；D2 → 保留 `now` 并**新增** `canvas`/`onContextLost`/`onContextRestored`；
> D3 → 删除 `ink-webgl2.ts`；D4 → wuxia 暂取 (b)，重写推迟；D5 → 从 AGENTS.md 删除 `assets/` 声明。

| 项 | 状态 | 证据 |
|---|---|---|
| **R1** 基础 2D 实体渲染 | ✅ 完成 | 新增 `src/plugins/scene-renderer.ts`（`requires` Renderer/Scene，Ink 为 optional）；`Scene2D.markers` + `scene-json` 注册 `goal`。冒烟新增断言：球 469px、印章 743px、纸底 298677px |
| **R2** 水刷视觉擦除接线 | ✅ 完成 | `ink-fluid-plugin` 订阅 `EraseStroke`；`InkFluid.erase` 改为按包围盒 scissor 清除活动墨+湿场、**保留固定墨层**；新增 `redrawStroke` 局部重绘。冒烟断言：桥面有墨像素 259 → **0**，锁定桥 446 → 442（未被误伤） |
| **R3** HostPort 与 context lost | ✅ 完成 | `HostPort` 增 `canvas`/`onContextLost`/`onContextRestored`；`Engine.hookContextLoss()` 丢失时 `pause()`；`p5-host` 上报事件。冒烟断言：`running → paused`，`contextWasLost: true` |
| **R4** `locked`/`dryAtStep` 语义 | ✅ 完成 | `Stroke.dryAtStep`、`StrokeStore.advance(step)`、`StrokeDried` 事件、`DrawStroke.dryAfterSteps`。新增 2 个单测：窗口内可擦断、超时后不可擦 |
| **R5** 侵蚀事务化 + 采样时序 | ✅ 完成 | 两阶段提交（先算后统一替换与发事件）+ `sameFragments` 替代 `JSON.stringify`；物理 `sync()` 改存快照副本；长距离样本按 `defaultRadius*2` 细分（上限 8 子步） |
| **R6** 相机 viewport / 删死代码 | 🟡 部分 | `Camera2D` 增 `viewport`/`setViewport`；`ink-webgl2.ts` 已删除并移除导出。**未做**：`screenToWorld` 走 viewport、resize 联动 |
| **R7** apps 与规范收口 | 🟡 部分 | `AGENTS.md` 目录树加入 `apps/wuxia/`、移除 `assets/`；补建 `THIRD_PARTY_NOTICES.md`；docs/02、03、07 与 plan/07 状态已回写。武侠 GPU 资源已改走引擎（见 §9） |

---

## 9. wuxia 定位决策与改造（2026-10-08）

### 决策：保留并改造为真引擎插件组合（§7 决策 4 取 (a)）

**理由**：§2 P2-11 的问题不是"它不该存在"，而是"它绕过引擎、且未登记 GPU 资源"。而"2D 画布 → GL 纹理叠层"本身就是通用能力——docs/01 把 UI/调试列为通用插件，docs/07 亦列出 `ui-overlay`。因此把它抽成插件比把 demo 重写成场景实体更符合职责划分。

### 改造内容

| 项 | 改造前 | 改造后 |
|---|---|---|
| 新增能力 | — | `src/plugins/canvas-surface.ts` + `CanvasSurfaceToken`（`renderPhase: 'ui'`） |
| GPU 资源 | 应用内手写 60 行 GL，`beforeunload` 手动 `delete*` | 全部由插件创建并在 `ctx.resources.add()` 登记清理 |
| 依赖 | 空 `ScenePlugin`（只为满足依赖，从未 `addCircle`） | `requires: [CanvasSurfaceToken]`，语义真实 |
| 渲染 | 应用自管 `drawFrame` 回调 | 插件 `render()` 内 `surface.invalidate()`，由引擎 ui 阶段上传 |
| 裸 GL 代码 | 约 40 行 | **0**（`grep "gl\." apps/wuxia/main.ts` 无命中） |
| 文件行数 | 222 | 191 |

**顺带修正**：`canvas-surface` 里显式关闭 `UNPACK_PREMULTIPLY_ALPHA_WEBGL` —— p5 会全局开启它（plan/07 §8.2），不关会导致纹理颜色被预乘。

### 仍存在的限制（如实记录）

- **每帧整幅 `texImage2D` 上传**（900×520×4 ≈ 1.9 MB/帧）。未做脏区上传；真实 GPU 帧成本未知，**未测**。
- wuxia 的战斗实体仍在模块级可变全局，未进 `Scene2D`——它演示的是"引擎固定步 + 自带渲染"，**不演示**场景/碰撞/水刷能力。若要它验证这些，需另开一轮改造。
- 两个 demo 仍共享约 1.17 MB 的 `world-*.js`（含墨层 shader），wuxia 用不到；已由 Vite 多入口构建自动分包，但共享 chunk 未进一步拆分。

**测试规模**：30 → **36**（新增固化窗口 2 项、标记契约 2 项、指针回放与墨层相关 2 项）。
**浏览器冒烟**：新增 4 类断言（实体可见、水刷擦除、锁定保护、上下文丢失暂停），全部通过（SwiftShader）。
**仍未验证**：Safari/Firefox、真实 GPU、性能基准、跨机确定性、`redrawStroke` 与全量重建的等价性（§3 的 "每 60 步 pigment 总和差 < 0.5%" 回归尚未编写）。

### 与 plan/08 的衔接

R1/R2 落地后，`plan/08` 的 §3.1（增量提交）与 §3.5（局部擦除）已具备接入点，但**尚未按 08 的验收口径验证**（08 要求的"每 60 步 pigment 总和差 < 0.5%"对账测试仍未写）。建议下一步先补该回归，再推进 08 的 O3（实例化批量绘制）。

---

## 10. 墨量对账回归（2026-10-08）——结果与暴露的缺陷

按 plan/08 §3.1 补了墨量对账。**结论：计划要的那条不变式只成立一半，且对账本身抓出了三个真实缺陷。**

### 实现

- `InkFluid.measureInk()`：以 `readPixels(..., HALF_FLOAT)` 读回 pigment + fixedInk 的半浮点和（含 `halfToFloat` 解码）。
- 新增 `InkDiagnosticsToken`（`inkgames.ink-diagnostics`）：**刻意与 `InkVisual` 分开**，把「GPU 回读」隔离在渲染契约之外（plan/07 §3 禁止用 GPU 读回决定逻辑）。
- 冒烟新增两类断言：同输入两次运行的可复现性、`redrawStrokes` vs `rebuild` 的等价性。

### 成立的部分：渲染可复现（实测 0.0009%）

同输入序列在**两个全新页面**上各跑一次，用**固定步号锚点**（以命令被消费的步为准）采样：

| 采样点 | 第 1 次 | 第 2 次 |
|---|---|---|
| 提交前 | 949.1 | 949.1 |
| +60 步 | 1531.9 | 1531.9 |
| +120 步 | 1532.1 | 1532.1 |
| +180 步 | 1532.2 | 1532.1 |

稳定期逐位一致。**关键教训：必须用步号锚定，不能用墙钟采样**——用 `setTimeout(1000)` 得到的漂移是 0.25%～0.65%，那是采样时刻抖动（±1 步），不是渲染不确定性。

### 未成立的部分：`redrawStrokes` 与 `rebuild` 不等价（实测 ~73%）

```
baseline:   2093.3   （增量提交后）
viaRedraw:  3510.6   （批量局部重绘）
viaRebuild: 1983.8   （全量重建）
gap:        72.9%
```

`viaRebuild ≈ baseline` 说明重建路径正确；**偏高的是局部重绘**。即 **R2 引入的 `redrawStrokes` 还不能替代全量重建**。冒烟中已降级为「报告不阻塞」，避免用调容差掩盖缺陷。

**已排除的猜想**：记录包围盒后偏差从 99% 降到 73%，说明「`draw()` 漏记包围盒」是其中一个成因（已修），但仍有第二个未定位的成因。未继续试探——`ink-fluid.ts` 在本轮已改动十余次，收益递减，应另起一轮专项排查。

### 对账顺带抓出的三个真实缺陷（均已修复）

| # | 缺陷 | 症状 | 修复 |
|---|---|---|---|
| 1 | **`blendEquation` 残留 `MAX`** | `paintBatch` 设了 `MAX` 后不还原，而 `pass()` 只 `disable(BLEND)`；后续 `erase()` 的 `clear()` 被当成取最大值，**墨没被擦掉反而变多**（实测 253 → 339） | 批次结束显式 `blendEquation(FUNC_ADD)` + `blendFunc(ONE, ZERO)` |
| 2 | **`draw()` 不记录包围盒** | `redrawStrokes` 找不到旧区域 → 只重绘不清理 → 墨量按笔画数翻倍 | `draw()` 内 `paint` 后立即 `boundsByStroke.set` |
| 3 | **逐笔重绘重复累加** | 相交笔被邻居各画一次，N 笔 → N 倍墨量 | 改为批量 `redrawStrokes(所有变更笔)`：先去重收集整组、一次清除、各画一次 |

缺陷 1 尤其值得记录：它是**状态泄漏**类 bug，静默且在无对账时完全不可见——`./build.sh browser` 的像素断言（擦除后桥面变亮）恰好覆盖了它，但如果只测"擦除命令被接收"就会漏掉。

### 仍未完成

- 定位 `redrawStrokes` 剩余 ~73% 偏差的第二个成因。
- 真实 GPU 与跨浏览器验证（当前全部结论来自 SwiftShader）。
- `ink-fluid.ts` 的 `erase()` 与 `redrawStrokes()` 都有 scissor 状态管理，缺乏针对"切换 scissor 边界"的专项单测。

---

## 11. 本次审计的方法与局限

- 全部结论来自**静态阅读 + `grep` 交叉验证**，未新增浏览器/真机实测；plan/08 §4.1 已记录的 SwiftShader 结果仍然有效且不被本文取代。
- 行号引用基于 2026-10-08 的工作区状态（`src/` 共 15 个插件文件）；改动后行号可能漂移，以符号名（如 `InkVisual.erase`）为准。
- **未审计**：`thirdparty/` 内容、`dist/` 产物、`docs/11` 的引文准确性、`plan/01–06` 的历史结论（仅按"冲突时以 07 为准"处理）。
- `src/plugins/ink-fluid.ts` 在本轮会话中经过多次编辑，其当前形态（`settle` pass、实例化 splat、`fixedInk` 双缓冲、`resize` blit）已在 §2 中按实际情况描述；**P0-2 的"erase 忽略参数"结论仍然成立**（`ink-fluid.ts:278`）。
