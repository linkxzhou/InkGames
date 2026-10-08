# 02 · 参考项目代码分析：inkwash ＋ 两者对比

> 分析对象：<https://github.com/johnowhitaker/inkwash> @ `1b14f89ae9a21fbe40cd6045d59d8437bd0362fd`
> 本地原始文件：`/workspace/inkgames/ref/inkwash/`（`index.html` 44,462 B / 1,083 行、`about.html` 91,530 B、`README.md`、`prompts.md`、`sw.js`、`manifest.webmanifest`、`licence.txt`）。图标、截图没有下载。
> 行号对应 `index.html`。推断内容标 **【推测】**。

---

## 1. 概况与许可

- **许可：MIT**（`licence.txt`："Copyright (c) 2026 Jonathan Whitaker"）。可以移植和修改，只要保留版权与许可声明。这是 InkGames 墨水模拟内核**唯一能合法直接继承代码**的参考。
- 形态：**单文件 HTML + 原生 WebGL2**，没有构建步骤，**没有用 p5.js**。所有 GLSL 以字符串形式内嵌（`#version 300 es`）。
- `prompts.md` 写明它是和 AI 助手（"Claude Fable 5"）对话迭代出来的；`about.html` 是长篇技术说明（场的定义表、参数表、手机上 60fps 的说法、多个实例共享一个 context 的 demo 页）。
- PWA：`sw.js` cache-first，缓存名 `'inkwash-v1'`。

---

## 2. 方法：Stam 稳定流体 + "湿度门控"的颜料模型

和 inkField（"灰度草稿 + min 扩散 + 颜色编码"）不同，inkwash 是**物理味更浓的场模型**：

| 场 | 纹理格式 | 分辨率 | 含义 |
|---|---|---|---|
| `velocity` | RG16F，double（ping-pong） | sim（256 短边） | 水的速度 |
| `divergence` / `curl` | R16F，NEAREST | sim | 求解用临时量 |
| `pressure` | R16F，double | sim | Jacobi 迭代 |
| `wet` | R16F，double | **dye** | **湿度**：决定颜料能不能动、动多快；原版 `initTargets()` 第 554 行明确按 dye 分辨率分配 |
| `ink` | RGBA16F，double，LINEAR | dye（≤2048） | **活动层**颜料的光学密度：RGB = 分通道吸收度，A = 白色（胡粉/钛白）覆盖量 |
| `fixed` | RGBA16F，double | dye | **已干/已固定**的颜料 |

（创建在 546–555 行；`SIM_BASE = 256`，demo 模式 192；`DYE_BASE = min(2048, min(canvas.w, canvas.h))`；`dpr` 封顶 2。）

### 2.1 每帧 `step(dt)`（789–882）

```
dt = clamp(frameDt, 0, 1/30)                     // 防止大步长炸掉
1. velocity  ← advectVelFS（半拉格朗日；乘湿度 mask = smoothstep(0.005,0.2,wet)；dissipation = exp(-dt·(3 − 2.4·FLOW))）
2. curl      ← curlFS(velocity)
3. velocity  ← vorticityFS(velocity, curl, strength = 4 + 22·FLOW)
4. divergence← divergenceFS(velocity)
5. pressure  ← copy(旧 pressure × 0.8)，再做 22 次 Jacobi（PRESSURE_ITER = 22）
6. velocity  ← gradSubFS(velocity, pressure)     // 投影，得到无散场
7. wet       ← advectWetFS（速度×0.6 平流 + 1.6 texel 的扩散模糊 + 蒸发衰减；衰减时间常数 dryTau = 固定中 ? 0.25 : 2 + (1−DRY)·16）
8. ink       ← advectInkFS（mobility = smoothstep(0.02,0.45,wet)；分通道"色度渗出"uChroma = (1+.85C, 1+.15C, max(.25, 1−.65C))；刷子区域乘 (0.25 + 1.3·brush)）
9. ink/fixed ← exchangeFS（**仅手动固定期间** `settle = 1−exp(−5dt)`，其它时候 settle=0；自然干燥只降低湿度，不自动沉降到 fixed；白色"烘焙"进透射空间）
```

### 2.2 Shader 清单（每个都读过）

| Shader | 行 | 关键点 |
|---|---|---|
| `baseVS` + 全屏三角形 | 228–271 | 一个大三角形 `[-1,-1, 3,-1, -1,3]` 盖住全屏，不用两三角形 quad |
| `copyFS` | 307 | 纹理拷贝（resize 时用） |
| `splatFS` | 313 | 高斯 `exp(-d²/r)`，宽高比校正；配合 **ADD**（墨、速度）或 **MAX**（水，避免反复画导致过饱和）混合；用 **scissor** 只更新包围盒（592–612） |
| `advectVelFS` | 323 | 半拉格朗日回溯 + 湿度 mask：干的地方水不流 |
| `advectWetFS` | 337 | 湿度自身也被平流、扩散、蒸发 |
| `advectInkFS` | 353 | 颜料的平流强度由湿度决定（干了就不动）；分通道不同扩散系数 → 边缘出现色相分离（"chroma bleed"） |
| `divergenceFS` / `pressureFS` / `gradSubFS` | 381 / 392 / 404 | 标准投影三件套 |
| `curlFS` / `vorticityFS` | 416 / 427 | 涡量约束，补回半拉格朗日损失的小涡 |
| `exchangeFS` | 446 | 活动层 → 固定层沉降；白色烘焙公式 `c = (1−exp(−2.2·fw))·uSettle; fd = −log(clamp(exp(−fd)·(1−c)+c, 1e-4, 1))`：把白色覆盖换算回"降低吸收度"，于是白色可以盖住已干的墨；还有一个 "lift"（重新润湿提起已干颜料）分支，但代码里**是关闭的** |
| `displayFS` | 481 | **Beer–Lambert**：`absb = pigment · uInkStrength · grain · (1 + edge·uEdge)`；`col = paper · exp(−absb)`；纸色 `(0.962, 0.954, 0.930)` 减去 fbm 纤维/纸齿；白色覆盖 `1−exp(−2.2a)`；湿区略微变暗 `(0.16,0.15,0.11)`；暗角 |

渲染参数（884–896）：`inkStrength 1.9`、`edge 1.35`、`grain 0.55`、`whiteTint = COLOR·0.35`。

### 2.3 颜色模型：吸收度（光学密度）

- 墨不是"颜色"，而是**每个通道的吸收系数**。默认墨 `INK_ABS = [1.00, 0.97, 0.88]`（略偏暖的黑）。
- 选色器（1033–1042）：把目标 RGB 转成 `A = −log(max(v, .02))` 再归一化，即"要让纸呈现这个颜色需要多少吸收"。
- 叠加 = 吸收度相加（物理上就是相乘的透射率），天然得到"越叠越深、不会变灰"的减色效果。浓淡（墨分五色）等于密度大小。这比 inkField 的 RGB mix/multiply 更符合水墨直觉，计算量也小。
- 白色走 A 通道，在显示和固定两处用"透射空间"处理，避免白色把吸收度算成负数。

### 2.4 交互与笔触引擎（616–785）

- Pointer Events：`pointerType` 区分笔/手指/鼠标；**Apple Pencil 画墨、手指画水**；笔的侧键（`buttons & 34`）切换成水；Safari 桌面支持 `webkitmouseforcechanged`。
- 参数面板 `P = {SIZE .5, FLOW .6, BLEED .5, DRY .45, COLOR .5, BINK 0}`；`sizeMult = 3^((SIZE − .5)·2)`。
- **跟随器**：`k = 1 − exp(−14·dt)` 的指数平滑（与帧率无关），用来平滑笔尖位置。
- 没有压感时**用速度模拟压力**：`targetP = clamp(1.18 − 0.95·speed, .12, 1)`，越快越轻。
- 笔（细线）：`penRadius = (0.0016 + 0.0042·p)·clamp(1.12 − 0.3·speed, .55, 1.12)`；按 0.6r 的间距插值，每段最多 60 次 splat，同时画少量湿度（0.16）；**停笔不动时墨会积聚**（dwell pooling）。
- 刷子（水/大笔）：`brushRadius = (0.014 + 0.060·p)(1 + min(speed, 2.5)·.28)`；同时注入速度（`force = 15 + 95·FLOW`，上限 240），间距 0.7r，最多 12 次。
- 快捷键（1072–1077）：`b` 笔/刷切换、`w` 白色、`d` 固定（fixDrawing）、`f` 全屏、`c` 清空、`s` 存 PNG。

### 2.5 工程细节

- WebGL2 context：`{alpha:false, depth:false, antialias:false, preserveDrawingBuffer:true}`。浮点渲染需要 `EXT_color_buffer_float`（第 205 行 `gl.getExtension` 启用，没有看到失败后的降级分支）。
- resize 时用 `copyFS` 把旧纹理重采样到新尺寸（566–578），不会丢画面。
- **`?demo` 无头冒烟测试**（898–977）：固定 dt = 1/60 跑 12 秒脚本化笔触，然后 `readPixels` 输出统计到日志。这是**确定性截图测试**的好模板。
- 帧循环：`requestAnimationFrame`，dt 截断到 1/30。

### 2.6 局限

1. 没有录制/回放、没有 seed 管理（刷子抖动用了 `Math.random()`（768 行），dt 也是真实帧时间 → 结果不确定）。
2. 没有笔锋/飞白：笔触是均匀的高斯 splat，所以更像水彩/湿画，缺少中国画的"干笔皴擦"。
3. 没有图层、相机、场景、实体，是"一张画布"的玩具。
4. 全部写在一个文件里，全局变量，不能当库用。
5. 移动端的 RGBA16F 渲染支持需要实测（about.html 说手机上能跑 60fps，但我们没验证过）。

---

## 3. inkField vs inkwash 对比

| 维度 | inkField | inkwash |
|---|---|---|
| 许可 | **闭源**（Open Creative License：不允许集成和衍生代码） | **MIT** |
| 底层 | p5.js 1.11.10 global mode + WEBGL + easycam | 原生 WebGL2，无框架 |
| 代码规模 | 13.6k 行混淆 JS + 10 个 GLSL（约 96KB） | 约 1.1k 行单文件 |
| 墨的表示 | 灰度强度（8-bit），提交时编码成颜色；独立 typeMap 存身份 | 分通道吸收度（RGBA16F），活动层 + 固定层 |
| 运动 | `min()` 推移 + 程序化 forceMap + flow 后处理位移；无流体求解 | Stam 稳定流体（平流/涡量/投影），湿度门控 |
| 干燥 | 笔画松开后 countdown（maxUpdates 帧）再"提交" | 连续的湿度衰减 + 沉降 exchange，可手动"固定" |
| 显示 | composite：按底色饱和度在 multiply 和 mix 之间插值，白笔用 Screen | Beer–Lambert `paper·exp(−absorbance)` + 边缘加深 + 纸纹颗粒 |
| 笔触 | CPU p5 `line()`：弹簧阻尼、速度控粗细、多条分叉飞白、7 种笔、喷点 | GPU 高斯 splat：指数跟随、速度模拟压力、笔/刷两种 |
| 质感 | **强**：飞白、干边、纤维、颗粒、龟裂……偏"中国画/书法" | **强**：洇、晕、渗色、湿边……偏"水彩/湿画" |
| 颜色 | 35 色板 + HSB 微调 + 可选 spectral 38 波段 | 吸收度选色器（任意 RGB → absorbance） |
| 确定性 | **核心卖点**：seed + Crandom 计数 + 事件录制，回放 99.8%+ 一致 | 无（dt 是真实时间） |
| 相机 | easycam 平移缩放 + 4 层 z 平面视差 + 回放自动跟随 | 无 |
| 后处理 | distort（FBM / 共振 / 细胞 / 白点 / 颗粒）、metallic、flow 8 种 | vignette、纸纹 |
| 精度 | 8-bit framebuffer | 16F |
| 移动端 | pixelDensity ≤1，手机禁用 collector | dpr≤2，sim 256，声称 60fps |
| 测试 | Crandom checkpoint 对比 | `?demo` 无头脚本 + readPixels |
| 可当库用？ | 否（全局 + DOM + 混淆） | 否（单文件全局），但模块边界很清楚，容易拆 |

### 3.1 InkGames 从 inkwash 借什么（**代码级移植，保留 MIT 声明**）

1. 场的划分：velocity / pressure / divergence / curl / wet / ink(active) / fixed，分辨率分 sim（低）和 dye（高）两档。
2. 全部 GLSL 内核：splat、advect×3、curl、vorticity、divergence、pressure、gradSub、exchange、display（Beer–Lambert），改成 GLSL ES 3.00 模块化文件，参数化后接入 InkGames 的渲染图。
3. 吸收度颜色模型与"白色在透射空间烘焙"。
4. 指数跟随器、速度模拟压力、dwell pooling、笔/刷双模式。
5. 工程：全屏三角形、scissor splat、MAX 混合画水、resize 重采样、dt 截断、`?demo` 无头测试。

### 3.2 从 inkField 借什么（**只借思想，自己实现**）

1. 弹簧阻尼笔尖、"越快越细"、起收笔渐入渐出与散开（explode）。
2. 飞白 = 多条随机出现的子线 / 鬃毛（我们用 GPU 实例化 splat + 鬃毛遮罩噪声实现）。
3. 干笔模式的 `min()` 扩散和边缘沉积（作为"干/半干"笔刷的局部扩散 pass，补上 inkwash 缺的皴擦感）。
4. 独立的身份/材质 buffer（typeMap），位移时同步、用最近邻采样。
5. 确定性设计：seed、每笔 seed、每帧重播种、"每个固定步一个输入事件"、录下 GPU 读回结果。
6. 程序化力场（风/水流）、分层 z 平面视差、dirty flag、uniform 缓存、只用 framebuffer（控制 context 数量）、移动端降低 density、性能监视器。

### 3.3 两者都没有、InkGames 必须新做的

场景/实体/组件、游戏循环（固定步长）、碰撞（笔画 → 物理形体）、资源管线、相机系统（2D 跟随 + 视差层）、音频钩子、调试工具（buffer 查看器、场可视化）、多分辨率质量档、TypeScript API、测试体系。
