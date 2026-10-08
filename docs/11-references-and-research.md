# 11 · 旧路线参考资料、在线核验与检索结论

[目录](./README.md) · [上一章](./10-shipping-and-ecosystem.md) · [现行剩余工作](../plan/10-v2-pixi-matter-ink-game-engine-plan.md)

> **历史附录**：本文保存 2026-10-08 p5.js/原生 WebGL2 路线的研究与当时的决策记录。文中“已落实在 plan/07 / 前十章”只描述当时的版本。`plan/07` 已于同日删除，删除原因见 [规划索引](../plan/README.md)。R1–R6 的 p5 专属结论不能推定 PixiJS 行为。现行实现以 [docs/01](./01-scope-and-engine-map.md) 到 [docs/10](./10-shipping-and-ecosystem.md) 为准，未做完的事在 [剩余工作](../plan/10-v2-pixi-matter-ink-game-engine-plan.md)。
>
> **检索日期：2026-10-08（UTC+8）。**方法：WebSearch/WebFetch 阅读原文；curl 检查链接状态码；npm registry 取版本与发布时间；下载 `p5@2.3.4` npm 包并对照 GitHub 标签 `v2.3.4` 源码静态阅读。**本章所有条目都没有在浏览器里运行实测**（“是否实测”一律为否），源码结论来自阅读，不来自运行。日期照抄来源页面；npm/GitHub 时间为 UTC；页面没写日期的记为“未注明”。本章是资料和证据索引。基于 R1–R14 的修订曾经写进已删除的 plan/07 和当时的前十章；那些计划文件不再存在，正文里的 “plan/07” 是历史叙述。

状态图例：

- **已在线阅读 2026-10-08**：本次打开原文读过相关段落。
- **源码核对 2026-10-08**：读过指定版本的源码。
- **数据读取 2026-10-08**：读的是机读数据或统计页（npm registry、MDN browser-compat-data、Web3D Survey）。
- **仅确认可访问**：只确认 HTTP 200，没读内容，不作为论据。
- **仅摘要**：只在搜索结果摘要里看到，没打开原文；**不得作为实施依据**。

## 1. 检索前原有外链核验（docs/ 与 plan/ 当时共 17 个唯一外链；不含本章新增链接）

| 原链接 | 结果 | 处理 |
|---|---|---|
| `https://docs.phaser.io/phaser/concepts` | **404 死链**（docs/01、05、06、08、README 共 5 处） | 改为 [Phaser Scenes](https://docs.phaser.io/phaser/concepts/scenes)（已读），API 细节见 [PluginManager](https://docs.phaser.io/api-documentation/class/plugins-pluginmanager)（仅确认可访问） |
| `https://bevyengine.org/learn/` | 301 → `https://bevy.org/learn/`（项目迁址） | 改为 [Bevy Plugins](https://bevy.org/learn/quick-start/getting-started/plugins/) |
| `https://pixijs.com/guides` | 200（→ `/guides/`） | 保留；具体主题改指 v8 页：[Architecture](https://pixijs.com/8.x/guides/concepts/architecture)、[Render Loop](https://pixijs.com/8.x/guides/concepts/render-loop)、[Scene Graph](https://pixijs.com/8.x/guides/concepts/scene-graph)、[Assets](https://pixijs.com/8.x/guides/components/assets) |
| `https://gameprogrammingpatterns.com/`、`/game-loop.html`、`/event-queue.html` | WebFetch 正常；本沙箱 curl 超时（网络环境问题，非死链） | 保留 |
| p5.js [Reference](https://p5js.org/reference/)、[Tutorials](https://p5js.org/tutorials/)；MDN [WebGL2RenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)、[WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)、[Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)、[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)；[Fix Your Timestep!](https://gafferongames.com/post/fix_your_timestep/)；[WebGL Fundamentals](https://webglfundamentals.org/)；[GPU Gems 38](https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu)；GitHub [inkField](https://github.com/ileivoivm/inkField)、[inkwash](https://github.com/johnowhitaker/inkwash) | 全部 200 | 保留 |

合计：17 个唯一外链，1 个死链（Phaser concepts），1 个迁址（Bevy），其余可访问。

## 2. 关键结论（编号供其它章节引用）

**R1 · p5 `blendMode(LIGHTEST)` 不等于纯 `gl.MAX`（解决 plan/05 待验证项）。**p5 v2.3.4 `RendererGL._applyBlendMode()` 中 `LIGHTEST` 为 `gl.blendEquationSeparate(MAX, FUNC_ADD)` + `gl.blendFuncSeparate(ONE, ONE, ONE, ONE)`：RGB 取 MAX，**alpha 相加**；WebGL2 下 `blendExt` 就是 GL 上下文本身。inkwash 的 wet splat 用 `gl.blendEquation(gl.MAX)`，RGB 和 A 都取 MAX。p5 还会用 `_cachedBlendMode` 缓存：缓存值等于当前 blendMode 时直接 return，不再设置 GL。所以原生代码改了混合状态又没恢复的话，p5 后续同模式绘制会沿用错误状态。结论：wet 的 MAX splat 用原生 GL 实现；原生阶段结束时把混合状态恢复成 p5 期望的值。`_cachedBlendMode` 是私有字段，不能依赖它。

**R2 · `p5.Framebuffer` 不能创建 R16F/RG16F。**官方参考与源码一致：`channels` 只有 `RGB`/`RGBA`，`format` 只有 `UNSIGNED_BYTE`/`FLOAT`/`HALF_FLOAT`；`FLOAT`/`HALF_FLOAT` 配 `RGB` 时会被强制改成 `RGBA`。能力不足时只 `console.warn` 并**静默退回 `UNSIGNED_BYTE`**（`p5.Framebuffer.js` 约 361–438 行）。默认值：`depth: true`、`stencil` 跟随 depth、`antialias` 跟随 `setAttributes()`（Safari 默认 true）。影响：第 02、07 章与 plan/07 已明确**原生 WebGL2 FBO 是模拟管线基线**；G1 实测 p5 与原生能否共存以及每种格式实际能力。docs/07 的显存估算基于 R16F/RG16F；如果改用 RGBA16F，单通道场显存变为 4 倍，双通道场变为 2 倍。若有任何地方仍用 p5.Framebuffer，必须断言 `fb.format`/`fb.channels`，并显式传 `depth:false, antialias:false`。

**R3 · 16F 才是桌面三浏览器的安全格式。**p5 判定 `FLOAT` 可用需要 `EXT_color_buffer_float` **且** `EXT_float_blend`，`HALF_FLOAT` 只需 `EXT_color_buffer_float`（`utils.js: checkWebGLCapabilities`）。各扩展覆盖率：

- Web3D Survey：`EXT_color_buffer_float` Safari 100%，`EXT_float_blend` Safari 56.91%、Mac OS 86.33%，`OES_texture_float_linear` Safari 57%。
- MDN 原文：“Float16-blending is always supported”；“Render-to-float32 doesn't imply float32-blending”。
- MDN 原文：WebGL2 上 `EXT_color_buffer_half_float` 只出现在**仅支持** 16F 渲染的系统上。
- webgl2fundamentals 格式表：R16F/RG16F/RGBA16F 在 WebGL2 核心中可线性过滤，32F 需要 `OES_texture_float_linear`。

结论：墨水管线保持 16F，不选 32F；在约四成 Safari 报告上，32F 渲染加混合或线性采样会失败或降级。G1 探测应同时查 `EXT_color_buffer_float` 和 `EXT_color_buffer_half_float`，并用 FBO completeness 确认，与 Dobryakov 的 R16F→RG16F→RGBA16F 回退链一致。注意 MDN BCD 中 `EXT_float_blend` 的版本号只表示接口存在，实际可用取决于 GPU，要以统计和实测为准。

**R4 · p5 2.3.4 会改全局 GL 状态和上下文。**

- 建上下文时执行 `enable(DEPTH_TEST)`、`depthFunc(LEQUAL)`、`pixelStorei(UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)`。
- 默认 context 属性：`{alpha:true, depth:true, stencil:true, antialias:仅 Safari 为 true, premultipliedAlpha:true, preserveDrawingBuffer:true, version:2}`。
- 包装了 `drawingContext.enable/disable`，用来跟踪 `STENCIL_TEST`。
- `setAttributes()` 走 `_resetContext`：删掉 canvas 重建，原生资源全部失效。
- 整个 p5 2.3.4 发布包里检索不到 `webglcontextlost` 处理。

影响：

- docs/02 的状态守卫清单需显式加入 `UNPACK_PREMULTIPLY_ALPHA_WEBGL`/`UNPACK_FLIP_Y_WEBGL`、`DEPTH_TEST`/depthFunc、stencil。上传数据纹理（纸纹高度、噪声）前要关预乘。
- `setAttributes()` 只能在 host 创建原生资源前调用一次。
- context lost/restored 由 host-p5 自己监听。
- `preserveDrawingBuffer:true` 可能有性能代价，G1 对比 false。

**R5 · p5 默认把 `draw()` 节流到 60 fps。**`environment.js` 里 `_targetFrameRate = 60`；`main.js` 的 `_draw` 只在距上一目标帧 ≥ `1000/fps − 5 ms` 时执行。在 144 Hz 屏上 draw 不是每个 RAF 都运行；`draw()` 是 async 的，但 RAF 不会 await 它。固定步累加器只要用 RAF 时间戳仍然正确，但 docs/03、docs/09 的“30/60/144Hz”测试必须写明帧驱动方式：`frameRate()` 设置，或 `noLoop()` 加自管 RAF 调 `redraw()`。见第 3 节决策 1。

**R6 · p5 2.x 生命周期与版本。**2.x 用 async `setup()` 取代 `preload()`，旧写法要靠兼容 add-on。`p5.registerAddon()` 把钩子推入静态 `p5.lifecycleHooks`，对之后创建的**所有实例**生效，所以 host-p5 不应通过全局 addon 注入引擎，多实例隔离测试要覆盖这一点。npm 当前 latest 为 2.3.4（2026-09-25 UTC），r1 为 1.11.13（2026-04-08 UTC），beta 标签为 2.3.1-rc.2。plan/06 提到的“2.3.1”已过时，锁定版本仍以 G1 为准。

**R7 · CPU 权威几何的确定性。**

- ECMAScript 规范把 `Math.sin/cos/atan2/exp/pow` 等定为“implementation-approximated”。Rapier 文档也明确说 `Math.sin/cos` 跨平台不确定。
- Box2D v3（Catto 2024）靠禁用 fast-math 和 FMA、自写 `atan2` 达到跨平台确定；`sqrt` 是确定的；对象池和创建顺序会影响结果；CI 里对每次运行的睡眠步数和变换哈希做比对。
- JS 的 + − × ÷ 与 `Math.sqrt` 按 IEEE-754 double 正确舍入。

结论：`stroke-geometry`/`water-erosion`/`collision2d` 的权威路径只用四则运算、`sqrt` 和量化坐标比较，不用三角或超越函数；必须用时换成纯 JS 固定实现，再量化。CI 加“每 N 步状态哈希”断言，做法同 Box2D Falling Hinges。

**R8 · Rapier 的确定性要选对包。**rapier.rs 的 JS Determinism 页（未注明日期）称 WASM 版“完全跨平台确定”，但 `@dimforge/rapier2d*` 0.21.0 的 npm README（2026-09-25 UTC）写明：主构建**不保证**跨平台确定，只有 `-deterministic` 构建保证。两者冲突时以新的 npm README 为准。这是备选信息，见第 3 节第 3 条。

**R9 · 固定步实践与 docs/03 一致。**

- Fiedler（2004）：`frameTime` 钳到 0.25 s，用累加器加 alpha 插值。
- Deterministic Lockstep（2014）：每个模拟帧采样一个输入结构，不发送原始按键事件；每个渲染帧最多补 4 个模拟帧，防止死亡螺旋。
- Matter.js 0.20.0 Runner：默认固定步，提供 `maxFrameTime`/`maxUpdates` 预算，一个显示帧可能执行 0、1 或多次更新。
- Excalibur `fixedUpdateFps`：可跳帧或补帧，并对图形插值。

建议：docs/03 中的“每 RAF 最大固定步数”写成显式配置项（如 `maxStepsPerFrame`），超限部分记录为 `gap`。

**R10 · 插件架构参照与差异。**

- PixiJS v8：所有系统都是 extension，注册到全局 `extensions` 注册表，按 `ExtensionType` 分类；`TickerPlugin`、`ResizePlugin` 属于 Application 扩展。
- Phaser 3/4：Game 只持有真正全局的系统（Renderer、Cache、Sound、TimeStep 等），Scene 持有自己的插件实例。Core 插件不可移除，Default 插件可选，Injection Map 控制属性注入。Scene 状态为 PENDING/INIT/START/LOADING/CREATING/RUNNING/PAUSED/SLEEPING/SHUTDOWN/DESTROYED。
- Phaser 4（2026-04-23）：RenderNode 取代 Pipeline，渲染器自带 context restoration。
- Bevy：引擎功能全部以插件实现，`Plugin::build(&mut App)`，用 `DefaultPlugins`/`MinimalPlugins` 插件组。
- VS Code：activation events 按需激活，`activate()` 只调用一次；`deactivate()` 可返回 Promise。
- Excalibur：System 用数值 priority（越小越先），Update 类系统先于 Draw 类，生命周期为 `initialize/preupdate/update/postupdate`。

对 InkGames 的影响：PixiJS 的全局 extensions 和 p5 的 `registerAddon` 都是进程级全局注册，与 docs/04“跨实例隔离”冲突，所以继续坚持“每个 Engine 一个注册表”。可借鉴 Phaser 的“核心插件/默认插件”分层，以及 Bevy 的插件组作为“默认插件集”。v0.1 不做 VS Code 式懒激活。docs/03 的“命名阶段 + before/after”比 Excalibur 的数值优先级更利于发现冲突，保持现方案。

**R11 · 可破坏几何的公开做法与本项目的差异。**

- Worms 式地形（AntonioR）：用 Clipper 求“地形减爆炸圆”的差集，重建 Box2D chain。chain 是空心的，子弹会穿入，所以另做三角化多边形，再用碰撞过滤区分角色与子弹。
- Noita（Purho，GDC 2019）：marching squares → Douglas–Peucker → 三角化 → Box2D。这是 Slow Rush 博客转引的演讲原话，演讲本身未看。
- Slow Rush（2024）：最慢的一步是“让物理引擎创建形状”。
- Planck chain：不支持自交，边长须 ≥ `linearSlop`（5 mm），而且边没有厚度。

结论：InkGames 选择“胶囊链 + t 区间裁切”，天然带宽度，又避开了多边形布尔运算和形状重建成本，与 docs/06、plan/07 一致。docs/06 的“碎段阈值/碎段数上限”与 Planck 的 linearSlop、Slow Rush 的形状数量瓶颈互相印证。若以后笔画改为多边形轮廓，可评估 Clipper2（BSL-1.0，内部整数坐标；TS 由第三方移植 `clipper2-ts`）。**没有找到任何公开资料直接讨论“水刷擦除笔画碰撞”这一组合**，G3 必须自行证明。

**R12 · 测试与 CI。**

- Playwright `toHaveScreenshot`：基线按浏览器和平台分别存放；默认用 pixelmatch，`threshold` 0.2，`maxDiffPixels` 默认不设；文档提醒渲染随 OS、硬件、headless 模式变化，基线须在同一环境生成。
- Headless Chrome 默认禁用 GPU。Linux 下需要 `--use-angle=vulkan --enable-features=Vulkan --disable-vulkan-surface` 并装对驱动（Chrome for Developers，2024-01-16 更新）。
- Chromium 已弃用“自动回退 SwiftShader 的 WebGL”，测试要显式加 `--enable-unsafe-swiftshader`（或 `--use-gl=angle --use-angle=swiftshader-webgl`），而且只用于可信内容。
- MDN BCD：`EXT_disjoint_timer_query_webgl2` 只有 Chrome 70+/Edge 支持，Firefox/Safari 不支持。docs/09 的“GPU time unavailable”分支在 3 个目标浏览器中的 2 个是常态。
- MDN：`getError`/`getParameter`/`readPixels`/`checkFramebufferStatus` 会同步阻塞，生产帧内避免调用，回读改用 PBO + fence 异步。`KHR_parallel_shader_compile` 在 Firefox 不可用。

**R13 · 输入与音频。**

- `getCoalescedEvents()`：MDN 标为 “Limited availability”，部分浏览器要求安全上下文；BCD 版本为 Chrome 58、Firefox 59、Safari 18.2。docs/06 的“有则使用”是对的：须做特性检测，并在旧版 Safari 上退回只用 `pointermove`。
- Web Audio：受 autoplay 拦截，可用 `navigator.getAutoplayPolicy('audiocontext')` 检测。与 docs/08“用户交互后再启动音频上下文”一致。

**R14 · 水墨文献的适用边界与许可。**

- Stam 1999/2003：inkwash 稳定流体的理论来源。
- GPU Gems 38：给出 GPU 上平流、Jacobi 压力、涡量的 pass 拆分。
- Curtis 等 1997：浅水流加 Kubelka–Munk 釉层合成，是水彩物理模型的经典，但不是为实时游戏设计。
- MoXi 2005：用 GPU 上的格子玻尔兹曼模拟墨在纸中渗透，可作为未来 `paper`/渗透插件的参考，不进 v0.1。
- Van Laerhoven 2004：仅摘要。
- **Mixbox 为 CC BY-NC 4.0，仅限非商业**：未来“谱混色”插件若要商业或公开发行，不能直接用 Mixbox，需要另取许可。
- spectral.js 为 MIT，v3 起改为 7 条基础光谱加“有效浓度”模型，与旧版结果不同，使用时须锁定版本。

## 3. 【检索发现，需决策】

以下两个选择在检索当时尚需 G1/G2 实测与负责人定案。它们曾被写进现已删除的 plan/07。现行门槛见 [剩余工作](../plan/10-v2-pixi-matter-ink-game-engine-plan.md)，本节保留当时的选项原文。

1. **【检索发现，需决策】host-p5 的帧驱动方式。**plan/07 写的是“p5 在宿主驱动帧”。R5 表明 p5 默认按 60 fps 节流 draw，144 Hz 屏上不是每个 RAF 都调用。可选方案：
   - (a) 保留 p5 `draw()` 驱动，host 启动时设 `frameRate()`，并用 RAF 时间戳喂累加器；
   - (b) `noLoop()`，由 host-p5 自管 RAF 并调用 `redraw()`。
   
   两者都不改变“内核唯一调度”的原则，但会影响 30/60/144Hz 测试怎么写，以及 p5 `deltaTime` 的含义。`redraw()` 本身也可能受 p5 内部节流/async 生命周期影响，不预设方案 (b) 可达到每 RAF 绘制；G1 两种都测并报告真实回调次数，G2 前冻结。
2. **【检索发现，需决策】CI 中的 GPU 环境。**R12 表明 headless Chrome 默认无 GPU，SwiftShader 回退也已改为显式启用。docs/09“截图基线锁定渲染环境”需要落到下面三者之一（或组合）：
   - (a) 自托管 GPU runner；
   - (b) SwiftShader 显式启用，只做正确性和截图，不测性能；
   - (c) CI 只跑 CPU 逻辑与 DOM 流程，GPU 观感在固定桌面机上手动或定期跑。
3. **（备选记录，不改变现有决策）物理库。**现决策是自研“圆–胶囊链”最小物理，不引入完整通用物理库。检索显示，若 G3 鲁棒性不达标，`@dimforge/rapier2d-deterministic`（Apache-2.0，跨平台确定，有胶囊碰撞体）是可评估的后备。代价是 WASM 体积、创建与删除顺序的约束、需要自行做胶囊链与 collider 的事务替换。Planck（MIT）的 chain 没有厚度，不适合直接表示有宽度的笔画。

## 4. 注释书目（按主题）

### 4.1 p5.js

- **p5.js v2.3.4 源码**（`src/webgl/p5.RendererGL.js`、`p5.Renderer3D.js`、`p5.Framebuffer.js`、`p5.Texture.js`、`utils.js`、`core/main.js`、`core/environment.js`）。processing/p5.js；标签 v2.3.4（npm 发布 2026-09-25 UTC）；<https://github.com/processing/p5.js/blob/v2.3.4/src/webgl/p5.RendererGL.js>。要点：R1、R2、R4、R5、R6。边界：只适用于 2.3.4，`_cachedBlendMode` 等私有字段随版本可变。状态：源码核对 2026-10-08；未实测。
- **npm registry: p5**。<https://registry.npmjs.org/p5>。要点：latest 2.3.4（2026-09-25 UTC）、r1 1.11.13（2026-04-08 UTC）、beta 2.3.1-rc.2。边界：只是发布时间，不代表稳定性。状态：数据读取 2026-10-08。
- **createFramebuffer() 参考**。p5.js 官方；未注明日期；<https://p5js.org/reference/p5/createFramebuffer/>。要点：format/channels/depth/stencil/antialias/textureFiltering 的默认值（R2）。边界：参考页对应网站当前版本，不写版本号。状态：已在线阅读 2026-10-08。
- **frameRate() 参考**。p5.js 官方；未注明日期；<https://p5js.org/reference/p5/frameRate/>。要点：`frameRate(fps)` 设定目标帧率，“Most computers default to 60 FPS”；节流细节见源码（R5）。状态：已在线阅读 2026-10-08。
- **p5.js-compatibility**。processing；未注明日期；<https://github.com/processing/p5.js-compatibility>。要点：网站和编辑器默认 v2；用兼容 add-on（如 preload）迁移 1.x 写法；README 称 v1 不再维护（但 npm 仍有 r1 1.11.13 发布）。边界：迁移指南，不是 API 规格。状态：已在线阅读 2026-10-08。
- [Intro to p5.strands](https://p5js.org/tutorials/intro-to-p5-strands/)、[v2 transition](https://p5js.org/tutorials/v2_transition/)、[setAttributes](https://p5js.org/reference/p5/setAttributes/)、[drawingContext](https://p5js.org/reference/p5/drawingContext/)。状态：仅确认可访问；结论以源码为准。

### 4.2 WebGL2 与浏览器能力

- **WebGL best practices**。MDN；未注明日期；<https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices>。要点：
  - 渲染到 float 不等于可以混合；16F 混合总是支持；WebGL2 上 half_float 扩展的含义（R3）。
  - 避免改动 FBO 附件；同步阻塞的 API（R12）；`texStorage` 优先；用 `invalidateFramebuffer` 丢弃不再需要的附件。
  - `alpha:false` 可能更贵；按每像素估算显存预算。
  
  边界：通用建议，需按目标浏览器实测。状态：已在线阅读 2026-10-08。
- **EXT_color_buffer_float**。MDN；页面称“Baseline since September 2021”；<https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float>。要点：WebGL2 专用，使 R16F/RG16F/RGBA16F/R32F/…/R11F_G11F_B10F 可作为颜色附件。状态：已在线阅读 2026-10-08。
- **MDN browser-compat-data 8.1.4**（2026-10-01 UTC）。<https://unpkg.com/@mdn/browser-compat-data/data.json>。要点：版本号如下（R12、R13）。边界：只表示接口存在，硬件能力另看统计。状态：数据读取 2026-10-08。
  - `getCoalescedEvents`：Chrome 58、Firefox 59、Safari 18.2。
  - `EXT_disjoint_timer_query_webgl2`：Firefox 与 Safari 均无。
  - `KHR_parallel_shader_compile`：Firefox 无。
- **Web3D Survey**：[EXT_color_buffer_float](https://web3dsurvey.com/webgl2/extensions/EXT_color_buffer_float)（总体 99.95%，Safari 100%）、[EXT_float_blend](https://web3dsurvey.com/webgl2/extensions/EXT_float_blend)（总体 93.3%，Safari 56.91%，Mac OS 86.33%，iOS 51.13%）、[OES_texture_float_linear](https://web3dsurvey.com/webgl2/extensions/OES_texture_float_linear)（Safari 57%）。日期未注明。边界：样本是自愿上报，不等于我们的目标机器。状态：数据读取 2026-10-08。
- **WebGL2 Data Textures**。WebGL2 Fundamentals；未注明日期；<https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html>。要点：格式表显示 16F 可过滤，32F 不可过滤（R3）。状态：已在线阅读 2026-10-08。
- **WebGL-Fluid-Simulation**。Pavel Dobryakov；MIT © 2017；<https://github.com/PavelDoGreat/WebGL-Fluid-Simulation>。要点：
  - `getSupportedFormat` 按 R16F→RG16F→RGBA16F 回退，用 FBO completeness 判断可写。
  - WebGL2 下以 `OES_texture_float_linear` 保守决定是否线性过滤。
  - context 参数为 `{alpha:true, depth:false, stencil:false, antialias:false, preserveDrawingBuffer:false}`。
  
  边界：示例程序，不是规范；其线性过滤判定比 WebGL2 核心规则更保守。状态：源码核对 2026-10-08（`script.js`）。

### 4.3 GPU 流体与水墨/水彩

- **Fast Fluid Dynamics Simulation on the GPU（GPU Gems 第 38 章）**。Mark J. Harris / NVIDIA；GPU Gems（2004）；<https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu>。要点：平流、散度、Jacobi 压力迭代、梯度扣除、涡量约束，分别实现为 pass，并用 ping-pong 纹理。边界：教科书式实现，精度与边界条件需按 inkwash 校对。状态：已在线阅读 2026-10-08。
- **Stable Fluids**。Jos Stam；SIGGRAPH 99，121–128；<https://www.dgp.toronto.edu/public_user/stam/reality/Research/pdf/ns.pdf>（入口见[作者出版物页](https://www.dgp.toronto.edu/public_user/stam/reality/Research/pub.html)）。要点：半拉格朗日平流加投影，无条件稳定，是 inkwash 和本项目的理论基础。边界：数值耗散大，细节靠涡量补偿。状态：出版物页已在线阅读，PDF 仅确认可访问。
- **Real-Time Fluid Dynamics for Games**。Jos Stam；GDC 2003；<https://www.dgp.toronto.edu/public_user/stam/reality/Research/pdf/GDC03.pdf>。要点：面向游戏的简化求解器（CPU 网格）。状态：书目已核对，PDF 仅确认可访问。
- **Computer-Generated Watercolor**。Cassidy Curtis、Sean Anderson、Josh Seims、Kurt Fleischer、David Salesin；SIGGRAPH ’97；<https://grail.cs.washington.edu/projects/watercolor/>。要点：水彩效果由有序半透明釉层组成，每层用浅水流模拟，再用 Kubelka–Munk 合成光学效果。边界：离线或交互式研究，不是实时游戏方案，可作为纸性和干边效果的参考。状态：项目页摘要已在线阅读，论文 PDF 未读。
- **MoXi: Real-Time Ink Dispersion in Absorbent Paper**。Nelson S.-H. Chu、Chiew-Lan Tai；ACM TOG 24(3)（SIGGRAPH 2005），2005-08；<http://visgraph.cse.ust.hk/MoXi/>（项目页最后更新 2007-09-20）。要点：格子玻尔兹曼模拟墨在纸中渗透，GPU 实现，并有边界演化与不均匀蒸发。边界：模型复杂，v0.1 不采用，可作为未来渗透插件的参考。状态：项目页已在线阅读；PDF 从本沙箱访问超时，未读。
- **Real-Time Watercolor Painting on a Distributed Paper Model**。Tom Van Laerhoven、Jori Liesenborgs、Frank Van Reeth；CGI 2004，640–643。状态：**仅摘要**（三层纸模型，分块分布式计算）。
- **Mixbox**。scrtwpns（Secret Weapons）；仓库最近推送 2024-01-30 UTC；<https://github.com/scrtwpns/mixbox>，论文 <https://scrtwpns.com/mixbox.pdf>（论文作者未在所读页面列出）。要点：基于 Kubelka–Munk 的颜料混色，接口为 RGB 进、RGB 出。边界：**CC BY-NC 4.0，仅限非商业**，商业使用须联系作者。状态：README 已在线阅读 2026-10-08。
- **spectral.js**。Ronald van Wijnen；MIT；npm 3.0.0（2025-04-30 UTC）；<https://github.com/rvanwijnen/spectral.js>。要点：单常数 Kubelka–Munk；v3 用 7 条基础反射曲线，加入“有效浓度”与 OKLab 色域映射。边界：CPU JS 库，若在 GPU 上用须自己移植并锁定版本。状态：README 已在线阅读 2026-10-08。

### 4.4 游戏循环与确定性

- **Fix Your Timestep!**。Glenn Fiedler；2004-06-10；<https://gafferongames.com/post/fix_your_timestep/>。要点：累加器、钳制 `frameTime > 0.25`、按 alpha 插值显示状态。状态：已在线阅读 2026-10-08。
- **Deterministic Lockstep**。Glenn Fiedler；2014-11-29；<https://gafferongames.com/post/deterministic_lockstep/>。要点：确定性要求按位一致；每个模拟帧采样一个输入结构；每个渲染帧最多补 4 个模拟帧。边界：讨论的是联网，v0.1 只借用它的回放与输入思想。状态：已在线阅读 2026-10-08。
- **Floating Point Determinism**。Glenn Fiedler；2010-02-24；<https://gafferongames.com/post/floating_point_determinism/>。要点：同一二进制、同一架构才较易做到一致；超越函数与 FMA 是主要风险。边界：针对 C/C++；JS 的四则运算由规范保证。状态：已在线阅读 2026-10-08。
- **Determinism（Box2D 博客）**。Erin Catto；2024-08-27；<https://box2d.org/posts/2024/08/determinism/>。要点：算法、多线程、跨平台三级确定性；需要避免 fast-math 和 FMA，并自写 `atan2`；对象池会改变顺序；CI 中用哈希检测。边界：C 语言引擎；Box2D 不提供 rollback 确定性。状态：已在线阅读 2026-10-08。
- **ECMAScript Math 对象**。TC39；<https://tc39.es/ecma262/#sec-math.sin>。要点：`Math.sin` 等是 implementation-approximated。状态：已在线阅读 2026-10-08。
- **Rapier JS Determinism**。Dimforge；未注明日期；<https://rapier.rs/docs/user_guides/javascript/determinism>，以及 **@dimforge/rapier2d-deterministic 0.21.0 README**（npm 2026-09-25 UTC）。要点：只要版本、参数、创建顺序相同即可确定；`Math.sin/cos` 不确定；主构建与 `-deterministic` 构建的说法冲突（R8）。状态：已在线阅读 2026-10-08。
- **Improve Matter.Runner（PR #1254）**。liabru；2024-06-22 合并，随 0.20.0 发布；<https://github.com/liabru/matter-js/pull/1254>。要点：默认固定步，提供 `maxFrameTime`/`maxUpdates`，支持高刷新率。状态：已在线阅读 2026-10-08。
- **Fixed Update**。Excalibur.js；未注明日期；<https://excaliburjs.com/docs/fixed-update/>。要点：`fixedUpdateFps`，可跳帧或补帧，图形插值可按 actor 关闭。状态：已在线阅读 2026-10-08。
- **Game Loop / Event Queue / Service Locator**。Robert Nystrom，《Game Programming Patterns》；未注明日期；<https://gameprogrammingpatterns.com/game-loop.html>、<https://gameprogrammingpatterns.com/event-queue.html>、<https://gameprogrammingpatterns.com/service-locator.html>。要点：
  - 浏览器拥有主循环。
  - 只有需要“时间解耦”时才用队列；发送时就要捕获所需数据，因为处理时世界可能已变化；在处理事件的代码里发事件容易造成反馈环。
  - Service Locator“谨慎使用”，可用 null service，并警惕时间耦合。
  
  状态：已在线阅读 2026-10-08。

### 4.5 引擎与插件架构

- **PixiJS v8 Architecture / Render Loop / Assets**。PixiJS；未注明日期；npm `pixi.js` 8.22.0（2026-10-01 UTC）；<https://pixijs.com/8.x/guides/concepts/architecture>、<https://pixijs.com/8.x/guides/concepts/render-loop>、<https://pixijs.com/8.x/guides/components/assets>。要点：
  - 系统即扩展，全局 `extensions.add()`。
  - 每帧依次为 Ticker 回调、场景图更新（变换与裁剪）、渲染；Ticker 用 `minFPS/maxFPS` 钳制间隔。
  - Assets 是单例，按 URL 或别名缓存，`unload` 释放。
  
  边界：只作职责对照，v0.1 不依赖 PixiJS 运行时。状态：已在线阅读 2026-10-08。
- **Phaser Scenes**。Phaser 文档（页面作者署名 RexRainbow、samme）；未注明日期；<https://docs.phaser.io/phaser/concepts/scenes>。要点：
  - 全局系统与 Scene 插件的划分；Core 和 Default 插件；Injection Map。
  - 生命周期状态与 start/launch/sleep/wake/switch/run 的语义。
  - 重启场景的常见坑：状态没在 `init` 中重置，监听器没在 shutdown 时清理。
  
  状态：已在线阅读 2026-10-08。
- **Phaser 4 Renderer: Faster, Cleaner, and Built for Modern Games**。Phaser；2026-04-23；<https://www.phaser.io/news/2026/04/phaser-4-renderer-faster-cleaner-and-built-for-modern-games>。要点：RenderNode 单一职责；更清晰的 WebGL 状态管理；自动 context restoration；完整支持 WebGL2；Canvas 渲染器已弃用。npm `phaser` 4.2.1（2026-07-09 UTC）。状态：已在线阅读 2026-10-08。
- **Bevy Plugins**。Bevy；未注明日期；<https://bevy.org/learn/quick-start/getting-started/plugins/>。要点：所有引擎功能都是插件；`build(&mut App)`；`DefaultPlugins`/`MinimalPlugins`；第三方插件。状态：已在线阅读 2026-10-08。
- **Activation Events**。Microsoft VS Code；未注明日期；<https://code.visualstudio.com/api/references/activation-events>。要点：用声明式事件按需激活；`activate()` 只调用一次；`deactivate()` 可异步；尽量少用 `*`。边界：编辑器扩展宿主是另一个进程模型，只借鉴其“声明式激活”思路。状态：已在线阅读 2026-10-08。
- **Systems**。Excalibur.js；未注明日期；npm 0.32.0（2025-12-23 UTC）；<https://excaliburjs.com/docs/systems>。要点：priority 数值越小越先执行；Update 类系统先于 Draw 类；生命周期为 constructor/initialize/preupdate/update/postupdate。状态：已在线阅读 2026-10-08。

### 4.6 可破坏几何与碰撞

- **Chain Shapes**。Planck.js 文档；未注明日期；npm `planck` 1.5.0（2026-04-07 UTC）；<https://piqnt.github.io/planck.js/docs/shape/chain.html>。要点：消除 ghost collision；不支持自交；边长须 ≥ `linearSlop`（5 mm）；每条边在宽阶段有独立包围盒。状态：已在线阅读 2026-10-08。
- **Clipper2**。Angus Johnson；BSL-1.0；仓库最近推送 2026-04-20 UTC；<https://github.com/AngusJohnson/Clipper2>。要点：多边形裁剪、偏移、三角化（C++/C#/Delphi），TypeScript 由第三方移植 [clipper2-ts](https://github.com/countertype/clipper2-ts)（npm 2.0.1-18）。边界：移植质量需自测。状态：README 已在线阅读 2026-10-08。
- **Destructible terrain – Worms**。AntonioR DevLog；正文未注明日期（评论最早 2015）；<http://antonior-software.blogspot.com/p/destructible-terrain-worms.html>。要点：Clipper 差集后重建 Box2D chain；chain 空心，子弹会穿入，所以另用三角化多边形加碰撞过滤。状态：已在线阅读 2026-10-08。
- **Bridging Physics Worlds**。Slow Rush Games；2024-02-02；<https://www.slowrush.dev/news/bridging-physics-worlds/>。要点：转引 Noita 的做法（marching squares → Douglas–Peucker → 三角化）；瓶颈在形状创建；空心形状难处理。状态：已在线阅读 2026-10-08。
- **Exploring the Tech and Design of Noita**。Petri Purho（Nolla Games）；GDC 2019 独立游戏峰会；<https://www.gdcvault.com/play/1025695/Exploring-the-Tech-and-Design>。状态：Vault 简介已在线阅读，演讲视频未看，技术细节为转引。

### 4.7 测试与 CI

- **Visual comparisons**。Playwright；未注明日期；npm `@playwright/test` 1.64.0（2026-10-07 UTC）；<https://playwright.dev/docs/test-snapshots>。要点：见 R12。状态：已在线阅读 2026-10-08。
- **Supercharge Web AI model testing: WebGPU, WebGL, and Headless Chrome**。Jason Mayes、François Beaufort（Chrome for Developers）；最后更新 2024-01-16；<https://developer.chrome.com/blog/supercharge-web-ai-testing>。要点：headless 默认无 GPU；Linux 需要 Vulkan 相关参数和正确驱动；用 `chrome://gpu` 核实。边界：在 Colab 加 NVIDIA 环境中验证，其它 CI 要自己试。状态：已在线阅读 2026-10-08。
- **Using Chromium with SwiftShader**。Chromium 文档；未注明日期；<https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md>。要点：自动回退 SwiftShader 已弃用；`--enable-unsafe-swiftshader`；SwANGLE 参数；须处理 WebGL 创建失败。状态：已在线阅读 2026-10-08。

### 4.8 输入与音频

- **PointerEvent.getCoalescedEvents()**。MDN；未注明日期；<https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents>。要点：绘画类应用应读取合并前的位置；Limited availability；需要安全上下文。状态：已在线阅读 2026-10-08。
- **Autoplay guide for media and Web Audio APIs**。MDN；最后修改 2026-09-10；<https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay>。要点：Web Audio 的 `start()` 受 autoplay 规则约束；`navigator.getAutoplayPolicy`。状态：已在线阅读 2026-10-08。

## 5. 四组博客检索记录（目标：2024–2026）

| 检索组 | 结果 | 证据质量 |
|---|---|---|
| `p5.js 2 WebGL framebuffer state integration` | 没找到讨论“p5 2.x 与原生 WebGL 状态共存”的 2024–2026 第三方文章。有一个教程站的摘要声称 WEBGL 模式下 `drawingContext` 是 Canvas2D，与 p5 2.3.4 源码矛盾（`RendererGL` 的 `drawingContext` 就是 webgl2 上下文），已舍弃。结论改为依据官方参考加 2.3.4 源码（R1–R6）。 | 源码核对（一手） |
| `PixiJS renderer scene graph assets ticker 2026` | 只有 PixiJS v8 官方指南（页面未注明日期）和 2026-10-01 的 8.22.0 发布；没有读到独立的 2026 博客。 | 官方文档 |
| `2D game engine microkernel plugin architecture dependency lifecycle` | Phaser 4 渲染器文章（2026-04-23，已读）。YAGE、clik-engine、ecs-ts（DeepWiki）的插件说明**仅摘要**：拓扑排序、逆序销毁、类型化服务容器，与本项目设计相同，但未当作论据。 | 已读 1 篇，其余仅摘要 |
| `deterministic destructible stroke collision water brush` | Box2D Determinism（2024-08-27）、Slow Rush（2024-02-02）、Rapier 0.21 README（2026-09-25 UTC）均已读。**没有找到“水刷擦除笔画碰撞”的直接先例。** | 已读 3 篇 |

## 6. 未能核验或仅部分核验

- 论文正文：Stam 1999/2003、Curtis 1997、MoXi 2005 只读了项目页或书目，PDF 正文没读（MoXi PDF 从本沙箱访问超时）。Van Laerhoven 2004 仅摘要。
- Noita 演讲视频没看，细节来自 Slow Rush 的转引。
- Phaser API 类页、VS Code Extension Host、p5.strands 与 v2 迁移教程、MDN `webglcontextlost` 页：仅确认可访问。
- caniuse 页面没有直接读取，浏览器版本以 MDN BCD 8.1.4 为准，硬件覆盖率以 Web3D Survey 为准。两者口径不同：BCD 只看接口存在，Survey 看实际可用。
- **全部结论都没在浏览器里运行验证**。R1–R5 应作为 G1 spike 的断言，用目标桌面 Chromium/Safari/Firefox 实测确认后再冻结。
