# InkEngine：inkField 水墨引擎的可读还原版（p5.js 1.11 + WebGL）

> **授权说明**：本目录是给 linkxzhou 做的 inkField 引擎还原，依据是用户声明已取得 inkField 作者（Aluan Wang）的书面授权（2026-10-08）。授权文件本身不在本目录里。
> 它不是 inkField 官方发行版。`LICENSE` 保留了 inkField 原许可证全文，并在开头加了还原说明。
> 授权范围以外，请勿再分发或公开发布。

## 1. 目录结构

| 文件 | 说明 |
|---|---|
| `ink-engine.js` | **单文件引擎**（UMD）。可作为 `window.InkEngine` 使用，也支持 CommonJS / AMD。文件内联了：全部 10 个 GLSL shader（与原 `shader.js` 逐字节一致，构建时自动校验）、p5.EasyCam（MIT）、Inconsolata 字体（OFL，data URL）。 |
| `index.html` | 演示页面：画布宽度 = 页面宽度、高度 1200（无横向滚动条，窗口改变宽度时防抖 300ms 后 `ink.resize(页面宽, 1200)`）。可鼠标作画、切换笔刷/尺寸/墨效/混色/颜色、清空、播放 `demo.json`、「载入录制」选择本地 JSON 播放、录制并下载 JSON。出错信息显示在顶部状态栏（红字）。 |
| `demo-data.js` | 把 `demo.json` 包成 `window.INK_DEMO_RECORDING = {...}` 的脚本。`index.html` 用 `<script>` 加载它，所以双击用 `file://` 打开也能播放（`file://` 下 `fetch()` 会被浏览器拦截）。 |
| `p5.min.js` | p5.js v1.11.10，与 inkField 使用的版本相同。 |
| `demo.json` | inkField 自带的演示录制（800×600，1962 个事件）。 |
| `NAME-MAP.md` / `name-map.json` | 混淆名 → 新名的完整映射表（顶层 458 个，另含局部变量映射）。 |
| `LICENSE` | 还原说明 + inkField 原许可证全文。 |
| `screens/` | 无头测试截图与结果 JSON：引擎与原版逐帧对比/差异图、实时操作对比、API 测试、`index.html`（file:// 与 http）播放截图。 |

快速运行：直接双击 `index.html`（`file://`）即可，点「播放 demo.json」会用 `demo-data.js` 里的内嵌数据播放；也可以在本目录启动静态服务器（例如 `python3 -m http.server`）后打开 `http://localhost:8000/`。
`file://` 下 `ink.play('某个.json')` 这种按 URL 加载的方式会被浏览器拦截，现在会明确报错（状态栏红字 + `error` 事件 + Promise reject），请改为传入 JSON 对象或用「载入录制」。

## 2. 用法

```html
<script src="p5.min.js"></script>
<script src="ink-engine.js"></script>
<script>
  const ink = InkEngine.create({ container: 'app', width: 800, height: 600, seed: 1234567890 });
  ink.ready.then(() => {
    ink.setBrush({ mode: 'brush', size: 'large', effect: 0 }).setColor('blue_dark');
    ink.strokePath([[100, 300], [140, 290], [180, 300] /* … 每帧一个点 */]);
    ink.play(window.INK_DEMO_RECORDING)  // 用原版回放路径播放录制；也可传 URL（需 http）或 JSON 字符串
      .catch((e) => console.warn(e));    // 加载/校验失败会 reject，同时触发 'error' 事件
  });
</script>
```

**附着模式**：在你自己的 p5 实例模式 sketch 里驱动引擎。

```js
new p5((p) => {
  let ink;
  p.preload = () => { ink = InkEngine.create(p, { width: 800, height: 600 }); ink.preload(); };
  p.setup   = () => ink.setup();          // 内部会 createCanvas(w, h, WEBGL)
  p.draw    = () => ink.draw();
  p.mousePressed  = (e) => ink.mousePressed(e);   // 可选：附着模式默认 input:false，只接受 API 输入
  p.mouseReleased = (e) => ink.mouseReleased(e);
});
```

**确定性/离线渲染**：传入 `{ loop: false, clock: 'frame' }`，再用 `ink.step(n)` 逐帧推进。这时每帧的虚拟时间固定为 1000/60 ms，同一份录制、同一个种子会得到同样的画面。测试就是这样跑的。

## 3. API

| API | 说明 |
|---|---|
| `InkEngine.create(opts)` | 独立模式：内部 `new p5()`，把画布挂到 `opts.container`。返回引擎；`ink.ready` 是 Promise。 |
| `InkEngine.create(p5Instance, opts)` | 附着模式：由你的 sketch 调用 `preload/setup/draw/mousePressed/mouseReleased`。 |
| `opts` | `width=800`、`height=600`、`pixelDensity=1.6`（原版桌面默认值）、`seed=1234567890`、`background=[222,222,222]`、`font=true`（`true` 用内嵌字体，`false` 不画文字，字符串为字体 URL）、`easycam=true`、`input=true`（独立模式绑定鼠标/笔压）、`clock='realtime'\|'frame'`、`loop=true`、`toggles={paper,grid,futurePath,console,camera}`、`flags`（覆盖站点全局，例如 `doEffect`、`doSpotNoise`、`loopWaitDuration`）、`urlFlags`（模拟 `location.search`，例如 `"?_dist:1"`）、`onLog(type,msg,data)` |
| `beginStroke(x,y,{pressure})` / `addPoint(x,y,{pressure})` / `endStroke()` | 合成输入，进入队列，每帧消费一个事件，与原版“每帧采样一次指针”的方式一致。`pressure`（0..1）会启用原版的笔压分档逻辑。 |
| `strokePath(points)` | 一次排入整条笔画（`[x,y]` 或 `{x,y,pressure}`）。手动模式下随后调用 `step(points.length + 40)`，让笔画扩散完并提交。 |
| `setBrush({mode,size,effect,blend,rotation})` | `mode`：1–7 或 `brush/marker/gothic/pen/dots/fly/brushSP`。`size`：`ultra-small … huge`（0.1–10 倍）或数字。`effect`：0–5（mix/sharpen/flyingWhite/wet/effect4/hair）。`blend`：0–3（mix/multiply/darken/spectral）。`rotation`：1–3。对下一笔生效。 |
| `setColor(c)` | 颜色名（`InkEngine.COLOR_NAMES` 共 36 个）、索引（brushColorMode），或 `[r,g,b]` / `"#rrggbb"`（custom=33）。 |
| `resetBrush()` / `getBrush()` | 恢复原面板默认值 / 读取当前笔刷状态。 |
| `setOptions({paper,grid,futurePath,console,camera,background})` | 显示开关（对应原面板 toggle），以及纸色。 |
| `loadScene(scene)` | 载入 inkField 录制（`randomSeed / canvasSize / canvasBackgroundColor / events[mp,md,mr,flow,ec,mask]`）。`scene` 可以是对象、JSON 字符串或 URL。返回 Promise：等待 `ready`；取不到 URL、JSON 无效或缺少 `events[]` 时 reject，并触发 `error` 事件（`file://` 页面会在消息里提示改用对象/http）。 |
| `play(scene?, {loop,speed,toggles,fitCanvas})` / `stop()` / `isPlaying` | 返回 Promise。先等待 `ready`、载入 `scene`（同 `loadScene`），没有录制时 reject + `error`；成功后触发 `playbackStarted`。走原版 `startPlayback/updatePlayback` 回放。注意：原版回放开始时会把显示开关重置为录制里的 `initialPanelToggles` 或面板默认值（网格默认**开**）；传 `toggles` 可以在之后覆盖。`fitCanvas:true`（仅独立模式）先把画布 resize 成录制的 `canvasSize`，相当于原版 artist 模式“按录制尺寸重载页面”。默认不缩放，见 §7。 |
| `record()` / `stopRecording()` | 录制，输出格式与站点导出相同；`stopRecording()` 返回 JSON 深拷贝，并触发 `recordingStopped` 事件。 |
| `step(n)` / `render()` | 同步推进 n 帧（独立模式内部调用 `p5.redraw()`）。 |
| `clear()` | 原版 `clearCanvas()`：清空各缓冲、typeMap、虫蚀遮罩和笔画列表。`ready` 之前调用为空操作。 |
| `resize(w,h)` | 仅独立模式：重建 p5 实例与引擎（画面内容丢失），返回 Promise。 |
| `snapshot()` | 返回画布 PNG 的 dataURL。 |
| `flowStart(blendType)` / `flowEnd()` | 对最后一笔施加 Flow（液化）效果，与站点 Flow 按钮相同。 |
| `on/off('ready'\|'frame'\|'playbackStarted'\|'playbackEnded'\|'recordingStopped'\|'error')` | 事件。`error` 的回调参数是 `Error`。 |
| `destroy()` | 移除画布、p5 实例，以及引擎添加的所有 DOM 监听。 |
| 高级 | `ink.core.state.<变量>`（原引擎全部顶层状态的 getter/setter，共约 285 个）、`ink.core.fn.<函数>`（134 个内部函数）、`ink.core.win`（原 `window` 上的特性开关）、`InkEngine.SHADERS`、`InkEngine.createCore(p, host)`。这些属于内部接口，不保证稳定。 |

## 4. 还原方法（可复现流水线）

1. `tools/transform.js`（Babel AST）分五步处理：
   - 删除 UI 顶层函数和语句（123 个函数、42 个变量），仍被引擎调用的 30 个改为空桩（例如 `isPointOverUI` → `return false`）。
   - 把隐式全局改为显式 `var`。
   - 改写自由变量：`window`→`$win`、`document`→`$doc`、`sessionStorage/localStorage`→`$store`；p5 API/常量→`$p.*`；鼠标→`$in.*`；`millis()`→`$clock()`。
   - 按 `tools/names.js` 重命名 456 个顶层 `_jNNN`，并检查作用域冲突。
   - 按 `tools/localnames.js`（加 `getElementById` 启发式）重命名局部变量，然后用 prettier 格式化。
2. `tools/patch.js`：按锚点做补丁，每处必须恰好匹配一次，注释里统一标 `[restored]`。补丁覆盖以下几处：
   - 站点启动流程改为由宿主选项提供（尺寸、像素密度、背景、种子、字体）。
   - 去掉 fxhash 调试/截图、视频帧捕获和性能统计。
   - 录制结束不再自动下载 JSON/PNG，改为发出事件。
   - 补回站点控制面板初始化时写入的滑杆默认值（`distortDisplacementC=50`，以及 rs* 和 whiteDotDensity）。
3. `tools/compose.js`：把 GLSL（逐字节校验）、EasyCam、字体、`createInkCore($p,$host)` 闭包和 API 层拼成 UMD 单文件。
   - 每个引擎实例有独立闭包，因此一页上可以同时存在多个引擎。
   - 文件刻意保持非严格模式，以保留原代码语义。

**名称映射摘要**（完整表见 `NAME-MAP.md`）：
- 缓冲区：`_j515 forceMapBuffer`、`_j624 screenBuffer`、`_j622 finalOut`、`_j626 paperTextureBuffer`、`_j629 lastStrokeBuffer`、`_j561 maskBuffer`…
- Shader：`_j516 mapShader`、`_j517 feedbackShader`、`_j518 realtimeShader`、`_j519 encodeShader`、`_j520 compositeShader`、`_j521 distortShader`、`_j522 typeMapEncodeShader`、`_j523 flowShader`
- 笔刷物理：`_j531 spring`、`_j532 friction`、`_j529 interpSteps`、`_j539 brushSize`、`_j446/_j447 tipX/tipY`…
- 主流程：`_j30 runFeedbackPass`、`_j39 commitStroke`、`_j58 drawBrushStroke`、`_j57 drawSprayDots`、`_j59 drawDryBrush`、`_j61 drawMarker`、`_j64 drawGothic`、`_j65 drawFlyBrush`、`_j18 scanBugBites`、`_j21 applyMetallicPass`、`_j179 updateForceMap`、`_j189 recordEvent`、`_j195 dispatchPlaybackEvent`…

## 5. 包含 / 不包含

**包含（引擎）**：
- 弹簧-摩擦笔刷物理与插值，7 种笔刷（大笔、小笔/marker、gothic 粒子、速写干笔、点画、飞白、mode 7）。
- 喷溅点和飞白分支，笔压分档，path rotation。
- feedback 扩散（含倒计时衰减）和提交流程：encode → typeMap → MULTIPLY 到 oldBuffer。
- composite / realtime 合成，36 色调色板、自定义 RGB、spectral 混色开关。
- 纸纹生成，force map（mapFrag，逐帧更新），distort、metallic（虫蚀）、flow 三个后处理。
- 4 层 z 平面加透视相机，EasyCam 自动跟踪（`camera`/doMoving）。
- 网格、笔画分隔线、未来路径预览，遮罩（`core.fn.drawMaskRect/drawMaskPolygon/clearMask`）。
- seeded RNG（`crandom` 及其检查点调试器），录制与回放全部事件类型（mp/md/mr/flow/ec/mask），回放倒计时暂停补偿和循环模式（`loopToggle`）。

**不包含（站点/UI）**：
- DOM 控制面板与日志面板、画廊/笔画选择器。
- fxhash（`$fx` preview、collector 模式、截图冻结）、Service Worker。
- 键盘快捷键（`keyPressed`）、zen 模式、手机端拦截、测试模式。
- 参考图叠加、视频帧和逐帧 PNG 捕获（`captureFrame` 等为空桩）、性能监视器。
- 自动下载录制 JSON/PNG、URL 参数解析（可用 `urlFlags` 模拟）、sessionStorage 重载恢复流程。
- 原版 `touchStarted/Moved/Ended` 处理器：触摸目前依赖 p5 的 touch→mouse 映射，加上 canvas 上的 pointer 笔压监听。

## 6. 验证结果（无头 Chromium + SwiftShader）

见 `screens/`；详细数据见 `screens/fidelity-results.json` 与 `screens/api-test-results.json`。

TEST_RESULTS_PLACEHOLDER

## 7. 已知差异与不确定项

1. **mapFrag 有 6 个 uniform 实际从未被设置（原版行为，原样保留）。**
   - 原因：原构建的 GLSL 混淆器把每个多变量声明里的第一个 uniform 改了名，`randomSeed1/scale1/amplitude1/phase1/vortexScale1/clusterScale1` → `_x5…_x10`。JS 仍按原名 `setUniform`，所以这 6 个值在 GPU 上恒为 0。其余（`randomSeed2…`）正常生效。
   - 修复办法：在 `SHADER_SOURCES['./shaders/mapFrag.frag']` 里把 `_x5…_x10` 换回原名。但这样画面会与原版不同，所以没有改。
2. **Flow 的种子来自 `Math.random()`**（原版 `flowButtonDown`），因此实时操作 Flow 不可复现；回放时使用录制里的 `flowSeed`，不受影响。
3. **时间依赖**：force map 使用 `time = millis()*0.001`，所以实时模式下画面带时间相关的细微变化。要逐像素复现，请用 `clock: 'frame'`。
4. **EasyCam 决定构图**：原站总会加载 p5.easycam；它的 `pre` 钩子接管相机后，画面构图明显不同（实测不加载时图像缩小、居中，与原版差约 4% 像素）。因此默认内联并启用它；`easycam:false` 可关闭。另外，EasyCam 会全局改写 `p5.prototype.ortho/createEasyCam`（与原版相同）。
5. **局部变量名**：顶层名全部恢复。局部变量：845 个不同的局部 `_jNNN` 中恢复了约 34%（289 个），按出现次数算约 65%（4448 → 1558 处）。混淆器用的是全局字典，同一 `_jNNN` 在全文件含义一致。剩下的 556 个仍是 `_jNNN`，多为一次性临时量，原名无法可靠推断，为避免误导没有硬猜。另有少数名字因与外层同名而带 `_` 后缀（如 `force_`、`flowActive_`），原代码在这些地方本来就是遮蔽外层变量。
6. **原代码怪癖原样保留**：
   - `dispatchPlaybackEvent` 里有一个重复、不可达的 `case 'md'`。
   - `mousePressed` 里 `indiffusionStrength` 先随机、后又被固定为 0.45。
   - 描边位置固定偏移 `-10px`（`tipOffset`）。
7. **输入差异**：
   - 原版只要指针不在 UI 上，就把整页的鼠标按下当作笔画开始。引擎只接受从画布上开始的按下，并据此判断 `mouseIsPressed`，这样点 demo 按钮不会误画。
   - 原版的 `touch*` 处理器没有移植。
8. **resize**：通过重建 p5 实例实现，画面会丢失；原站则是靠写 sessionStorage 再刷新页面。`index.html` 因此只在宽度真正变化时、防抖 300ms 后才 resize。
9. **未提供 ESM / 压缩版**：引擎依赖非严格模式语义（块级函数声明等），转成 ESM 会强制严格模式，风险较大，未验证，所以只提供 UMD。也没有提供 `ink-engine.min.js`。

10. **录制在更大画布上的播放（800×600 的 demo.json 放在 页面宽×1200 上）**：查了原版代码，原版回放**从不缩放、也不平移**录制坐标。事件里的 `x/y` 是绝对像素，`startPlayback` 不看 `canvasSize`。原版只在两处用到 `canvasSize`：
    - artist 模式载入文件时，如果录制尺寸与当前画布不同，会把录制写进 sessionStorage，然后按录制尺寸**刷新页面**（`_j199`）；
    - collector/fxhash 模式则直接在当前画布上按绝对坐标播放。
    因此 `index.html` 采用后一种（与原版一致）：笔画落在画布左上方 800×600 的范围内，不拉伸，空白处保持纸色。需要“原版 artist 式”效果时用 `ink.play(scene, { fitCanvas: true })`，它会先把画布改成录制尺寸再播放。
11. **实时操作 ≠ 其录制的回放（原版固有）**：同一段鼠标输入，实时画面与“录下来再回放”的画面有 14095 个像素不同（800×600 画布的约 2.9%）。推测与实时采样和回放时间轴的帧对齐不同有关，没有深究，因为原版自身也有**完全相同**的差距（同样 14095 像素）。对照数据：引擎 vs 原版实时 0 差异、两边录制 JSON 完全一致、引擎 vs 原版回放 0 差异（见 `screens/interactive-fidelity.json` 与 `interactive-*.png`）。所以 API 测试只检查“回放能播完且与实时差异 < 5%”。
12. **`index.html` 播放无反应的原因（已修复）**：旧 demo 在按钮回调里 `await ink.play('demo.json')`。双击打开（`file://`）时浏览器拦截 `fetch`，Promise 被 reject，但没有人捕获，状态栏也不更新，看起来就是“点了没反应”。修复：
    - 改用 `demo-data.js` 内嵌数据；
    - 增加「载入录制」文件选择（FileReader 在 `file://` 下可用）；
    - `loadScene/play` 失败时 reject 并触发 `error`，页面把错误显示在状态栏；
    - `play()` 先等待 `ready`；页面按钮在 `ready` 前禁用。
    http 下原逻辑本可工作，没有发现另外的 bug。

## 8. 重建

重建用到的脚本在 `/workspace/inkgames/restore/tools/`（不在本交付目录里）。
`node transform.js && npx prettier … && node patch.js && node compose.js && node namemap.js`；测试：`CHECK=30,120,300,600 MAXF=601 node fidelity.js`、`node api-test.js`、`node fidelity-interactive.js`、`node index-test.js`（需在 `restore/` 根目录起 `python3 -m http.server 8765`）。
