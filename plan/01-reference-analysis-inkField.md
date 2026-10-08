# 01 · 参考项目代码分析：inkField（墨域）

> 分析对象：<https://github.com/ileivoivm/inkField> @ `39febcc250e6df5c159e9603ec24303c5aadf806`（2026-07-29 15:47 UTC+8，"add 2.json"），与用户本地副本同一 commit。
> 本地原始文件：`/workspace/inkgames/ref/inkField/`（通过 raw.githubusercontent.com 按 commit 拉取；没有 git clone）。
> 行号对应 `script.js`（共 13,626 行）。shader 引用的是 `shader.js` 里的 key（`./shaders/xxx.frag`）。
> **写作约定**：凡是"代码显示 / 文档写明"的内容，都来自实际读过的文件；凡是推断，都会标 **【推测】**。

---

## 0. 拉取范围与核验

| 类别 | 文件 | 说明 |
|---|---|---|
| 核心 | `script.js`(370,084 B)、`shader.js`(95,882 B)、`index.html`(87,487 B)、`style.css`、`sw.js`、`manifest.json`、`serve.json` | 已下载并阅读 |
| 文档 | `README.md`、`readmeTW.md`、`README-MINT.md`、`llms.txt`、`CONTRIBUTING.md`、**`LICENSE`** | 已读 |
| 数据 | `lib/{demo,0,1,2,recording,mountain-mist,spectral-test}.json` | 已用脚本解析过结构 |
| 库 | `lib/p5.easycam.js`（已读头部）；`lib/p5.js` 只取了前 3KB 看版本号：**p5.js v1.11.10（2025-08-23）** | 5.2MB 主体没下载 |
| 技术文档 | `tech/*.html` 中文版 + `tech/en/*.html` 英文版（brush-physics、ink-effects、blend-flow、color-journey、effects、recording、ai-json-generation、emotion-intention、dailylog、index、gallery） | 转成纯文本后读过 |
| 其他 | `gallery/README.md`、`gallery/MAINTAINER.md`（读过标题）、`gallery/js/{gallery,validator}.js`、`tech/examples/*.js`（3 个）、`tools/README.md`、`scripts/*.py` | 粗读 |
| **跳过** | 所有 png/jpg/gif/svg、`lib/inconsolata.otf`、`gallery/recordings/*.json`（72 件用户作品，版权归创作者）、`gallery/thumbs`、`gallery/share/*.html`、`tech/gallery/*` 录制和图片 | 按要求跳过 |

---

## 1. 许可证（必须先读）—— 结论：**代码不能复用**

`LICENSE` 是作者自定义的 "Open Creative License"，不是 SPDX 标准许可：

- **第 1 节 SOURCE CODE — CLOSED UNTIL MAINTENANCE DORMANCY**：源码、shader、内嵌脚本、二进制资源"目前不开放再分发、修改或衍生"。允许的事只有：个人学习时查看/克隆、使用线上应用、投稿到画廊、提 issue/文档 PR。
- 原文明确保留的权利："redistribution, forking as a separate product, **integrating the rendering engine into another application, or building a derivative codebase** — is reserved."
- 第 2 节：用它画出来的作品（JSON 录制、渲染图/视频）归创作者所有，可以商用。
- 第 4 节第三方组件：p5.js（LGPL-2.1）、p5.easycam（LICENSE 写的是 LGPL，但 `lib/p5.easycam.js` 文件头写的是 **MIT License, Copyright 2018 Thomas Diewald**，两处不一致）、spectral.js（MIT）、p5.brush（MIT，只是"inspiration"）。
- `CONTRIBUTING.md`：只接受 `.md`/`.html` 文档类 PR，"the core script.js is not yet open"。`README-MINT.md` 直接写着 `script.js ← engine (obfuscated)`。

**对 InkGames 的约束**（详见 04/05 文档的许可章节）：
1. 不能把 `script.js` / `shader.js` 的任何代码、GLSL 片段、常量表（比如分叉表、35 色表）拷进 InkGames。
2. 只能参考公开技术文档里描述的**思想/算法**（弹簧阻尼、`min()` 扩散、identity buffer、事件录制、PRNG 计数），由我们自己独立实现（clean-room），并在代码里写清来源。这不构成法律意见；如果想直接用原代码，唯一可行的路是**取得作者书面授权**（ileivoivm@gmail.com）。
3. `gallery/recordings/*` 是第三方创作者的作品，不能打包进 InkGames 的 demo。

---

## 2. 代码形态：发布的是混淆过的构建产物

- `script.js` 的局部变量和大多数函数名都被改成了 `_jNNN`（比如 `_j58`、`_j539`）。保留下来的有：p5 全局回调（`preload/setup/draw/mousePressed/...`）、少量导出名（`updateCompositeBuffer`、`drawLayersWithBlur`、`updatePlayback`、`startPlayback`、`applyCameraProjection`、`updateEasyCamAutoTracking`、`drawCursorToBuffer` 等）、全局状态名（`newBufferBlack`、`finalBuffer`、`typeMapBuffer`、`pingPongBuffer`、`oldBuffer`、`recordingData`、`brushMode`、`useSpectralMix` 等）和所有字符串字面量。
- `shader.js`：`window.SHADER_SOURCES = { "./shaders/base.vert": \`...\`, ... }`，一共 10 个 shader（1 个 vert + 9 个 frag）。GLSL 也被压成一行，函数名/局部变量变成 `_xNN`，uniform 名大多保留。
- 加载方式：`_j1(vert, frag)`（第 1–8 行）先查 `window.SHADER_SOURCES`，有就 `createShader(src)`，没有就退回 `loadShader(path)`。所以它可以打成单 HTML 离线包。
- 技术文档 `tech/index.html` 写的源码规模是："JavaScript 10,871 行（5 个核心模块）"、"GLSL 2,775 行（10 支）"、"14 个 Framebuffer + 13 个 createGraphics"、"WebGL Context 3 个（从最初 16 个优化而来）"。文档里提到的源模块有 `js/crandom.js`、`js/colors.js`、`recording.js`、`metallic.js`、`grid.js`，**这些文件在仓库里都没有**，只发布了合并、混淆后的版本。

> 影响：分析时只能"读结构 + 对照文档"。下面所有带 `_jNNN` 的引用都是混淆后的名字。我给它们起的语义名（比如"弹簧加速度"）都是根据上下文和文档对出来的，只有对应关系明显时才这么写。

---

## 3. 运行时架构与主循环

### 3.1 p5 全局模式 + WebGL

- `index.html` 依次加载 `assets/fxhash.min.js` → `lib/p5.js` → `lib/p5.easycam.js` → `shader.js` → `script.js`（第 57–59、547–548 行）；`window.APP_MODE = 'artist' | 'collector'`（index.html 第 102–140 行，根据 URL 参数切换）。
- **p5 global mode**，所有状态都是模块级 `let`/`var` 全局变量（第 2360–2686 行是一大段全局声明）。
- `setup()`（2812–3184）：
  - `randomSeed(seed); noiseSeed(seed)`，默认 `seed = 1234567890`（2459）。
  - **pixelDensity 优先级**（2835–2871）：URL `_pix:` > collector 模式默认 2 > 移动端强制 ≤1.0 > sessionStorage。
  - 手机上的 collector 模式直接拒绝运行，提示"需要更多 GPU 内存"（2827–2834）。
  - 手机 artist 模式默认画布 380×600（2906–2915）。
  - `createCanvas(w, h, WEBGL)`（2934）。
  - **压感**（2935–2997）：监听 `pointerdown/move`（`pointerType==='pen'`）和 `touchstart/move`（`touchType==='stylus'`、`t.force`），用 3 点中值滤波 `_j34`（2420–2426）去噪，再映射成 `_j568 = min(p/0.3, 1)`。
  - 建立全部 framebuffer（2998–3112，见第 4 节）。
  - 生成纸纹 `_j9(40,20,15,0.2)` 并以 MULTIPLY 叠到背景色×1.1（3056–3068）。
  - 初始化 EasyCam（`_j27`，1988–2032）和力场参数（`_j180`，11469–11483）。
- `preload()`（2687–2811）：加载 feedback/realtime/mapFrag/distort/metallic/flow 这几个 shader；collector 模式下按 URL hash 拉 `lib/N.json` 或 `lib/demo.json` 后自动播放。

### 3.2 `draw()` 每帧顺序（3374–3903）

```
background(bg)
updatePlayback()                    // 回放：按时间轴分发事件（12967–）
_j26()                              // 相机回弹到初始位置（1867–1919）
updateCompositeBuffer()             // 只有 dirty 时才做 composite + realtime（2154–2217）
updateEasyCamAutoTracking()         // 回放时相机跟随笔尖（1920–1987）
drawCursorToBuffer()                // 光标 / 路径预览
_j37(); updateBlurEffect()          // 4 个图层的 z 偏移动画（4317–4415）
applyCameraProjection()             // perspective(PI/3, ..)（2033–2047）
drawLayersWithBlur()                // forceMap 更新 → distort/metallic → flow → 4 层 z 平面上屏（4416–4704）
_j52()                              // flow 迭代计数
—— 性能统计 _j35/_j36（3185–3371）——
—— 笔刷：若按下且笔还有墨 → 物理步进 + 画到 newBufferBlack（3600–3750）——
—— feedback：按下时 force=1；松开后 countdown，force 线性衰减到 0（maxUpdates 帧）→ _j39 提交（3751–3778）——
—— 蟲咬（bug-bite）扫描队列（3795–3902）——
```

**要点**：
- 没有 delta time，物理和 feedback 都是**按帧计数**的（每帧一步，`frameRate(60)`），所以回放时必须"一帧最多处理一个 md 事件"（`recording.html`："maxMouseDraggedPerFrame = 1"；混淆代码里找不到这个名字，以文档为准）。
- 一笔的生命周期：`mousePressed` 生成所有随机参数和 strokeSeed（3904–4221）→ 每帧笔刷物理 + 画灰度 → 松开后 feedback countdown（`maxUpdates` 帧，力度从 1 线性降到 0）→ `_j39()` 把这一笔编码进 `finalBuffer` / `typeMapBuffer` / `oldBuffer`，再清空 `newBufferBlack`（4829–5074）。
- **dirty flag**：`_j575` 在 feedback/commit/flow 之后置 true，`updateCompositeBuffer` 只在 `_j575 || 正在画 || countdown || 回放 || fullscreen` 时才跑（2155、3396）。

---

## 4. Buffer 体系（代码变量 ↔ 文档名 ↔ 用途）

全部用 `createFramebuffer({density})` 创建，共享主 WebGL context。文档专门讲了 Safari 的 context 数量限制让帧率从约 10 FPS 恢复正常（`tech/index.html` 第 9 节）。

| 代码变量 | 文档名 | 创建行 | 内容 / 用途 |
|---|---|---|---|
| `newBufferBlack` | newBufferBlack | 3040 | **当前这一笔的灰度草稿**（白底，越黑表示墨越多）。CPU 笔刷用 p5 `line()/ellipse()/point()` 画进去，feedback 每帧在上面扩散 |
| `pingPongBuffer` | pingPongBuffer | 3084 | feedback 的写目标；写完再 `image()` 拷回 source（`_j30`，2077–2121）。注意：这是"写→拷回"，不是交换指针 |
| `finalBuffer` | finalBuffer | 3034 | 所有已提交笔触的**颜色编码**（encode.frag 的结果） |
| `typeMapBuffer` | typeMapBuffer | 3078 | 逐像素**笔刷身份**：R=类型（0 背景/0.5 彩或黑/1.0 白），G=白笔最大不透明度 |
| `oldBuffer` | oldBuffer | 3024 | 所有笔触灰度的 MULTIPLY 累积（commit 时叠加，4911–4916），flow 也会作用到它 |
| `_j624` | screenBuffer | 3075 | composite + realtime 的工作区，也是 encode/typeMap pass 的临时目标 |
| `_j628` | realtimeIntermediateBuffer | 3087 | composite→realtime 的中间拷贝，避免同一个 FBO 同时读写 |
| `_j626` | paperTextureBuffer | 3053 | 纸纹（`_j9` 生成）× 背景色 |
| `_j627` | 纯背景色 buffer | 3069 | 关掉纸纹时用 |
| `_j629` | lastStrokeBuffer | 3093 | commit 时拷一份 newBufferBlack（4830–4835），给 flow 的 `lastStrokeTex` 用 |
| `_j515` | img / forceMap | 2998 | **力场图**（mapFrag.frag 生成），RG = 力向量×0.5+0.5 |
| `_j622` | finalOut | 3046 | distort/metallic/flow 之后的最终图 |
| `_j625` | 【推测】cursorBuffer | 3090 | 正在画且有路径时，以 z=40 平面上屏（4661–4666） |
| `_j561` | polygonMaskBuffer | 3099 | 遮罩：白=可画 |
| `window.tempMetallicBuffer` | — | 3105 | metallic pass 的临时缓冲 |
| `_j621`、`_j623` | 文字/网格叠加、未来路径预览 | 3030、3049 | 这两个是 `createGraphics(WEBGL)`，即文档说的"2 个 UI/debug overlay context" |
| `window.tempBlurBuffer0/40/80/120` | — | 2223–2227 | P2D `createGraphics`，【推测】是遗留的模糊层 |

---

## 5. Shader 逐个分析（`shader.js`）

用脚本列出了每个 shader 的 uniform、函数数、texture 采样次数（字符数是压缩后的大小）：

| Shader | 字符数 | texture 采样 | 作用 |
|---|---|---|---|
| `base.vert` | 253 | 0 | 标准 p5 顶点变换（`uProjectionMatrix * uModelViewMatrix * aPosition`），所有全屏 pass 共用 |
| `feedback.frag` | 23,377 | **41** | **墨水扩散**，6 种模式（由 `useSharpen` 选择） |
| `encode.frag` | 20,421 | 4 | 把灰度笔触编码成颜色存进 finalBuffer：35 色查表、HSB 微调、强度曲线、3 种混合模式 + **spectral 光谱混色** |
| `flow.frag` | 16,758 | 9 | 流场位移后处理，8 种 `blendType`，`isTypeMapMode` 双 pass 同步身份 |
| `distort.frag` | 13,086 | 8 | 后处理：FBM 域扭曲、Resonance Scatter（16 个波源）、Cellular、White Dot、Film Grain |
| `metallic.frag` | 11,912 | 15 | 金属/钻石材质：法线来自遮罩梯度、Fresnel、色散 IOR |
| `composite.frag` | 3,600 | 5 | 读 typeMap 判断身份并解码 finalBuffer，叠到纸上 |
| `realtime.frag` | 2,787 | 4 | 画的过程中把当前这一笔即时叠在 composite 上预览 |
| `mapFrag.frag` | 2,622 | 0 | 生成 forceMap：多层 simplex 向量噪声 + 涡旋项 + 径向项 |
| `typeMapEncode.frag` | 716 | 3 | 把身份写进 typeMapBuffer |

### 5.1 `feedback.frag`（核心扩散）

uniform：`rect, invResolution, tex0, forceMap, force, indiffusionStrength, brushMode, baseBrushSize, useSharpen, effect3Brightness, brushColorMode, brushCategory, mouseCount, mouseCountAccumulated, strokeSeed, useMask, maskTex`。

`main` 开头的公共骨架（格式化后读过）：
1. 遮罩早退；边缘 0.2% 像素直接原样输出。
2. `force2 = (forceMap.xy - 0.5) * force * 0.2`，取 `c0 = tex(uv)`、`c1 = tex(uv + force2*texel)`，**`base = min(c0, c1)`**。因为墨是"黑在白上"，`min` 就是"取更深的那个"，墨只会被推开、不会凭空出现（文档原话："ink spreads but never appears from nowhere"）。
3. 按 `useSharpen` 分支：
   - **Mode 0（<0.5，扩散/飞白）**：4 邻域加权平均，权重 `(1 + |Δdensity|*2) * (1 + max(0, dot(dir, -force))*1)`；`force>0.5` 时按 `smoothstep(0.05,0.6,density)*indiffusionStrength` 混入；加 hash 颗粒；沿力方向做 0.90–1.06 的明暗梯度；低密度边缘稍微提亮。
   - **Mode 1（<1.5）**：白笔走 4 层 hash 颗粒（频率 25/50、110/180、320、480/620，强度 0.15/0.12/0.10/0.08）+ 120Hz smooth noise；普通笔用噪声把画面分成 glow（模糊采样）和 sharpen（Laplacian `5c - Σ4邻`）两类区域，再调用共享的边缘函数（混淆名 `_x10`，即文档里的 `applyEdgeEffect`）。
   - **Mode 2–5**：根据文档（`ink-effects.html`）——2 = 边缘检测 + 边缘加深/中心变浅（干边沉积）；3 = 柱状距离场 `sdColumn` 模拟纤维方向（宣纸）；4 = 3 个方向偏移采样取 min + 白斑 + 边缘沉积 + 颗粒，强度随 force 在 30%–150% 之间缩放；5 = Mode 4 速度×0.3、纹理×2，改用不回绕的 `mouseCountAccumulated`，避免每 40 帧回绕一次导致纹理跳变。
   - 共享边缘沉积：噪声空间遮罩（覆盖约 40% 区域）→ 1.5–2.3px 随机半径 4 向梯度 → `smoothstep(0.85,0.95)` 只取最强的边 → 按 0.3–0.7 向黑混合。
- **注意**：文档里同一个 `useSharpen` 编号的名字不统一（`ink-effects.html`：1=Squeeze/charcoal、2=Marker…；`ai-json-generation.html`：1=Ink Edge、2=Sharp Outline、3=Watercolor…）。以 shader 分支为准。

调度：`_j30(buffer, force)`（2077–2121）。用 `_j28()` 缓存 uniform（值没变就不调用 `setUniform`），`_j29()` 缓存 `rect/invResolution`。`mouseCount = (笔画帧数 + 偏移) % 40`。

### 5.2 `encode.frag`（提交时运行一次，`_j39` 4836–4871）

uniform：`baseTex(finalBuffer), strokeTex(newBufferBlack), brushColorMode, brushCategory, whiteMaxOpacity, hueShift, satShift, briShift, keyBlendMode(int), useSharpen, canvasBackgroundColor, customBrushColor, typeMapTex, useSpectralMix, useMask, maskTex`。

- `strokeLum = dot(stroke, (0.299,0.587,0.114))`，`intensity = 1 - strokeLum`。`strokeLum > 0.9` 视为没画到，直接保留旧值。强度曲线随 `useSharpen` 不同（文档：mode0 `1.02*clamp(0.15+0.85x^0.6)`；1–3 `x^0.7`；4–5 黑 `x^1.5*0.98`、彩 `x^0.7`）。
- 颜色：`brushColorMode`（0–35）查表得到 RGB，转 HSB 后加 `hueShift/satShift/briShift`（亮度上限 0.95，亮色另有限幅），饱和度 <0.05 归零。
- 混合：`keyBlendMode` 0=Mix、1=Multiply、2=Darken；`isWhiteBase`（底色接近白）时走另一条路径。
- **Spectral（`useSpectralMix>0.5` 且非白底）**：代码里确认有 `sR[i] = pow(sR1[i],0.35) * pow(sR2[i],0.65)` 的循环，前后是 sRGB→linear→**38 波段反射率**→加权几何平均→XYZ→sRGB→饱和度×1.2→`mix(old, target, intensity)`。文档说明这是第 3 版：KM 平均会让低反射率一侧主导（红+黄得到"更红"），所以改成几何平均。光谱数据来自 spectral.js（MIT）。

### 5.3 `typeMapEncode.frag`（完整读过，20 行左右）

`lum(stroke) < 0.9` 时输出 `vec4(white ? 1.0 : 0.5, white ? whiteMaxOpacity : 0, 0, 1)`，否则保留 base。遮罩同样早退（文档专门提醒：只在 encode 里加遮罩、漏了 typeMap，会出现白色渗出 bug）。

### 5.4 `composite.frag`（完整读过）

- 读 `baseTex`（纸）、`encodedTex`（finalBuffer）、`typeMapTex`。
- 身份 R>0.75 → **白笔**：`intensity = (1 - enc.r)/0.5`，再做一次 1–9px 随机偏移的邻域采样，模拟白笔纹理，最后用 **Screen** 混合 `1-(1-base)(1-white)`。
- 否则 → 彩笔/黑笔：几乎是灰的像素强制去饱和（防"紫色幽灵"）；**根据底色饱和度**（`smoothstep(0.3,0.8,sat(base))`）在 `base*filter`（multiply）和 `mix(base, ink)` 之间插值。底色越鲜艳越接近覆盖，越灰越接近相乘。Alpha 的 0.99 / 0.995–1.0 区间沿用了旧版编码（文档 Ch9 讲的历史方案）。
- 历史教训（`color-journey.html` Ch8–10b）：旧方案把身份藏在颜色通道里（白笔 `G = R×0.5`，类型放在 Alpha），GPU 双线性插值和 flow 位移会破坏这个比例，出现"purple ghost"。2026-03-03 起改为**独立的 typeMapBuffer**，flow 也跑两遍（先用最近邻采样移动 typeMap，再移动颜色），保证身份跟着颜色走。**这一条对任何"颜色 + 元数据"管线都适用。**

### 5.5 `realtime.frag`（完整读过）

正在画时，把 `addTex=newBufferBlack` 按当前笔色即时叠到 composite 上：黑笔 `mix`；白笔 Screen；29 号色（canvas，用作擦除）预览成绿色；彩笔 HSB 微调后按底色饱和度在 multiply 和 mix 之间插值。**这一步不写入持久层。**

### 5.6 `mapFrag.frag`（forceMap 生成）

可读的部分（压缩后有一部分落在 `#define PROCESSING_COLOR_SHADER` 那一行）：Ashima simplex 2D 噪声 `snoise`，向量噪声 `vec2(snoise(v)-snoise(v+o1), snoise(v+o2)-snoise(v+o3))`；三层 `vnoise(frag*scaleK + phaseK + time*speedK) * ampK`，加两组 sin/cos 涡旋项、以 `canvasCenter` 为中心的径向正弦项、全局 `sin(time)` 抖动；cluster 噪声调制幅度；输出 `vec4(force*0.5+0.5, 0, 1)`。调度在 `_j179()`（11441–11468），**`drawLayersWithBlur` 每帧都会跑一次**（4425–4427）；参数由 `_j180()` 用 crandom 随机生成（11469–11483），每一笔的 `forceMapParams` 都会录进 strokeData。
- **【推测/疑似 bug】** 混淆器把 shader 里的 `randomSeed1/scale1/amplitude1/phase1/vortexScale1/clusterScale1` 改名成了 `_x5.._x10`，而 JS 侧仍然 `setUniform("randomSeed1", …)`。按 p5 的行为，名字对不上的 uniform 会被忽略，于是这些值保持默认 0，第一层噪声频率为 0。这可能是构建副作用，对我们只是"不要在发布构建里混淆 uniform 名"的提醒。

### 5.7 `flow.frag`（位移后处理）

uniform：`tex0, lastStrokeTex, lastStrokeOnly, blendType, blendVol, radSeed, strokeBounds, pixD, blendA, blendB, directVol, snoiseVol, gobalStyle, vline, hline, cellT, colorDeep, whiteDot, doBigShape, doMask, multiDir, drawTime, seed, iTime, pixelScale, isTypeMapMode`。
- 核心（文档 `effects.html`）：`crd2 += simpleN2(coord*0.001)*px*blendVol; crd2 += simpleN2(coord*0.005)*px*blendVol/2; out = min(sample0, texture(crd2))`，同样是"深色优先"。
- `blendType` 0/2–8：基础、同心涟漪、垂直、水平、龟裂（双层 Voronoi）、马赛克、漩涡（两个中心、高斯衰减）、细胞。边缘用 halftone 抖动；`lastStrokeOnly` 时只处理 `strokeBounds` 内的像素。
- 调度（`drawLayersWithBlur` 4498–4655）：**提交式**的 flow 依次作用到 typeMapBuffer（`isTypeMapMode=1`）→ oldBuffer → finalBuffer → finalOut；**进行中**的 flow 只作用在 finalOut 上（4615–4655）。`blendVol` 随迭代次数增加（`*(1 + iterations*0.1)`）。录制格式是成对的 `{"m":"flow","action":"start"|"end", blendType, flowSeed, strokeBounds, ...}` 事件。

### 5.8 `distort.frag` / `metallic.frag`

- distort 的 uniform 已列在上表。功能依次是：FBM（4/6 层、`m*p*2.02` 旋转倍频，域扭曲 `fbm(1.8q + 6·fbm6_2(3·fbm4_2(0.9q)))`）→ Resonance Scatter（16 个波源，`sin(TAU f (t - L/v)/scale)`，振荡/梯度混合）→ Cellular（`cellular2x2`，F2−F1）→ White Dot（3 种尺度、成团）→ Film Grain（暗部和笔触区更多，细/中/粗 = 0.6/0.3/0.1）。只有开关打开时才跑（4424、4430–4482）。
- metallic：法线来自遮罩梯度，加 Schlick Fresnel 和 6 种色调；钻石模式按 RGB 分别用 IOR 2.408/2.424/2.432 做色散（文档常量；shader 里能看到 `2.418, 2.408, 2.424, 2.432` 这几个常量）。只在"虫咬"效果存在（`_j241.length>0`）时启用。

---

## 6. 笔刷物理（CPU 端，p5 2D 绘制进 `newBufferBlack`）

### 6.1 每笔参数（`mousePressed` 3904–4221）

- `crandom.reset()` → `strokeSeed = int(crandom.random(1e8, 1e9))`（3948）→ `randomSeed/noiseSeed(strokeSeed)`。
- 每笔都会重新随机：`whiteMaxOpacity∈[0.5,0.99]`、`hue/sat/briShift`、`explodeStart/End`（20% 概率在起笔/收笔时散开）、`targetflyBrushType`、`targetmainStrokeDir`、`brushDir∈0..3`、`effect3Brightness∈[0.5,0.9]`、`shapeType∈0..3`、`brushPaintInterpolationOffset`……
- 按 `brushMode` 设置物理参数（4058–4127）：

| mode | initialSize | spraySize | spring(`_j531`) | friction(`_j532`) | step(`_j529`) | step2(`_j586`) | maxUpdates |
|---|---|---|---|---|---|---|---|
| 1 毛笔 | rand(20,24)×base | 3×base | 0.6 | 0.5 | 15 | 5 | 30 |
| 2 麦克笔 | rand(20,24)×base | 1×base | 0.3 | 0.5 | 10 | 10 | 10 |
| 3 噴漆/Gothic | rand(2,4)×base | 10×base | — | — | — | 3 | 10 |
| 4 枯笔/Pen | rand(6,9)×base | 1×base | 0.6 | 0.5 | — | 5 | 10 |
| 5 噴灑點 | rand(10,14)×base | 10 | 0.6 | 0.5 | 10 | 1 | 10 |
| 6 刷笔/Fly | rand(10,14)×base | 10 | 0.6 | 0.5 | 10 | 1 | 10 |
| 7 毛边 | 同 1，`brushModeSP=true` | | | | | | |

  `useSharpen ≥ 3.5` 时 `maxUpdates = 20`；`expectedStrokeLength = 400`（笔画最大帧数，超过就不画）。

### 6.2 每帧（`draw` 3607–3750 + `_j58` 5976–6332）

- 笔尖目标点 = 鼠标位置（回放时用事件坐标），每帧 `randomSeed(strokeSeed + frame*1e8)` 重新播种（3635–3636）。这是**确定性的关键**：每帧的随机序列只由 (strokeSeed, 帧号) 决定。
- 灰度值 `_j524` 用噪声/随机做低通（3637–3647），决定墨色深浅。
- 尺寸衰减：`size -= randStep(0.05)`，下限 1（3648–3650），模拟"墨用完"。
- **压感调整笔号**（3651–3676）：压力 ≥0.3 时在笔号表 `[0.1,0.25,0.5,1,2,3,5,10]` 上升 1–3 档，并按 `(new/old)^0.6` 缩放当前尺寸。
- 路径旋转：`angle = map(noise(x*.01,y*.01),0,1,-rot,rot)`，笔尖偏移 `rand(rot/2,rot)*(cos,sin)` 再加固定的 `-10` 透视偏移（3683–3692）。
- **弹簧阻尼**（`_j58` 6019–6034，与 `brush-physics.html` 一致）：
  ```
  ax += (tx - x) * spring;  ay += (ty - y) * spring
  ax *= friction;           ay *= friction
  speed = |a| * k(base)     // k: base≤1→0.9, ≤2→1.3, ≤3→2.0, else 3.0
  width = sizeNow - speed   // 越快越细（"提"），越慢越粗（"按"）
  ```
  在上一帧和这一帧之间插 `step + interpOffset` 个子步（6047–6061），每个子步画一条 `line()`。
- **飞白（分叉）**：每个子步随机选一种分叉类型（6049–6057，概率取决于 baseBrushSize），对应三张偏移表：`_j928`（5 条，`offsetBase` 1–3 × 正负号，5730–5765）、`_j929`（8 条，每 45° 一条，半径 1.6，5766–5814）、`_j930`（12 条，每 30° 一条，半径 1.0，5815–5887）。每条分叉有自己的出现阈值 `randThreshold`（0.05–0.2），粗细由 `noise()` 调制，最小 0.6px。`brushDir` 用来翻转第一条分叉的 X/Y（`_j920`）。起笔 5 帧内会强制用 type 5 / 渐入，收笔前 5 帧渐出，`explodeStart/End` 时加散开偏移（6095–6108）。
- 其他模式：`_j57` 喷点（5888–5975，每个子步 10 个点，4 种形状：圆/椭圆/三角/菱形）、`_j59` 枯笔（6333–6379，80 个点在线段附近随机分布）、`_j61` 麦克笔（6409–，带 `perpOffset` 的平行线表 `_j1027`）、`_j64` Gothic（6669–6840）、`_j65` Fly（6841–7052，分叉数由 seed 决定，文档说可达 50 条）。
- 松开（4222–4289）：记录 `mr`，进入 countdown（`_j557=true`），feedback 继续跑 `maxUpdates` 帧、力度递减，模拟墨的"余韵"。

**评估**：这套模型的手感来自 (a) 弹簧跟随 + 速度控制粗细，(b) 大量随机分叉线 + noise 粗细，(c) GPU 端的 min 扩散。缺点是**全部在 CPU 上用 p5 `line()` 逐条画**（每帧每子步最多十几条线 × 15 个子步），大笔号时开销高，而且依赖 p5 2D 绘制状态。另外，"每帧一步"的物理和帧率耦合。

---

## 7. 力场 / 流场

- 有两个来源（`ink-effects.html` 第 2 节）：(1) 笔触本身的方向（文档提到，代码里 feedback 读的是 forceMap，笔触方向主要通过路径和分叉体现，【推测】文档的说法偏概念性）；(2) `mapFrag.frag` 生成的程序化噪声场。
- forceMap 编码：`(v*0.5+0.5)`，0.5 表示静止；在 feedback 里换算成 `(v-0.5)*force*0.2` 像素。
- 没有真正的流体求解（没有 advection/pressure）。"流动"靠 **min() 推移 + 程序化噪声力场 + flow 后处理位移**来近似。好处是便宜、可控、确定；代价是不会出现真实的涡流和水边界。

---

## 8. 颜色模型

- **35+1 色板**：0 黑、1 白、29 canvas（与背景同色，用于擦除）、33 自定义，其余是命名颜色（`color-journey.html` 列了完整表）。JS 侧通过 `_j222` 生成 GLSL 常量和 if/else 链（`_j4/_j5`，446–471，构建期代码生成）。
- 编码：灰度强度 → HSB 微调后的颜色 → 混合模式；身份写在 typeMap 里。
- 混色：RGB mix/multiply/darken + 可选 spectral（38 波段，几何平均 0.35/0.65）。
- 终合成：按底色饱和度在 multiply 和 mix 之间插值；白笔用 Screen。
- **没有 Beer–Lambert / 光学密度模型**：墨的"浓淡"靠灰度强度曲线 + 混合模式实现。

---

## 9. 录制 / 回放与确定性

### 9.1 机制

- `_j189(type, data)`（11581–11619）：`t = timeOffset + (millis() - recordStart - pausedAccum)`。两笔之间的空闲时间会被累加到 `_j635` 并扣掉，即"自动压缩停顿"；testMode 下不录。
- `Crandom` 类（9–97）：包装 p5 `random()`，统计调用次数，可选记录调用栈；`_j0`（98–420）是 checkpoint 调试器，按笔比较录制和回放时 random 调用次数的差异（|Δ|<50 ✅、<200 ⚠️）。
- 回放：`startPlayback`（11846–12250）重置所有状态 → `randomSeed/noiseSeed(recordingData.randomSeed)` → `updatePlayback`（12967–）按时间轴分发事件给 `_j195`（12349–12966）。`_j195` 处理 `mp/md/mr/kp/ec/flow/mask`，同时兼容长名（`mousePressed` 等）和 `e.type/e.time` 旧格式（5033、12362）。
- 文档总结的四条原则（`recording.html`）：记录过程而不是结果；靠 seed 不靠运气；每帧只做一件事（每帧最多 1 个 md；`mr` 延迟到下一帧，保证最后一次 draw 被执行）；重置所有状态。另外要**去掉条件分支里的 random 调用**，否则序列会漂移。结果：同一笔刷录制和回放的 random 调用差 ±25（尺寸 3）到 ±150（尺寸 5），一致性 99.8–99.9%。
- 虫咬效果的 `targetPoints` 直接录进事件，避免回放时重新扫描像素带来的不确定性。这是**"非确定的 GPU 读回结果要录下来，不要重算"**的范例。
- 视频导出：虚拟 60fps 时钟逐帧截图 → ZIP（README "Record Video"）。

### 9.2 录制 JSON schema（从 lib/*.json 实际解析）

顶层（`0.json`/`1.json`/`2.json`）：

```jsonc
{
  "version": "1.0", "engineVersion": "dev",        // engineVersion 仅 2.json 有
  "startTime": 0, "randomSeed": 1234567890,
  "initialPathToggle": false, "initialWhiteBrushMode": false, "initialBrushColorMode": 0,
  "canvasSize": {"width": 800, "height": 800}, "canvasBackgroundColor": [222,222,222],
  "events": [...], "strokes": [], "timeOffset": 0,
  "initialEffectControl": {"shapeType":0,"metallicStrength":85,"metallicFlow":200,"metallicTint":[0.72,0.5,0.35],"metallicTintType":"copper"},
  "initialFlowEffect": {"flowStrength":100,"distortShaderEnabled":false,"cellularEnabled":false,"rsEnabled":false,"whiteDotEnabled":false,"grainEnabled":false,"distortShowFbmMask":0,"distortDisplacementB":20,"distortDisplacementC":50},
  "initialPanelToggles": {"showPaperTexture":false,"showGridOverlay":true,"showFuturePathPreview":false,"screenText":false,"doMoving":false,"loopToggle":0},
  "savedAt": "2026-03-28T02:15:23.174Z", "originalFileName": "...", "continuedAt": "..."
}
```

事件类型及各文件的统计：

| m | 字段 | 统计 |
|---|---|---|
| `mp` | `t,x,y,strokeData{41–43 个字段}` | 0.json 2 笔；demo 21 笔；1.json 46 笔；2.json 37 笔 |
| `md` | `t,x,y` + 可选 `p`（压力，0–1，保留 3 位小数，仅 2.json） | 1.json 2308 个，平均每笔约 50 个 |
| `mr` | `t,x,y` | |
| `flow` | `action:start/end, blendType, flowSeed, strokeBounds{minX..maxY 归一化}, strength, lastStrokeOnly` / `duration, iterations, totalFrames` | demo 8 个；2.json 30 个 |
| `ec` | `action: bugs-size/metal-tint/metallic-strength/metallic-flow/scan-global/scan-current/scan-random` + `targetPoints[], scanSeed, randomCount, scanBounds, strokeIndex` | 1.json 72 个 |
| `kp` / `mask` | 键盘 / 遮罩 | 解析器支持（_j195），样例里没有 |

`strokeData` 字段（以 0.json 为例）：`strokeSeed, mouseCountStart, colorIndex, shapeType, useSharpen, brushMode, indiffusionStrength, whiteBrushMode, brushColorMode, phasorVel, explodeStart, explodeEnd, whiteMaxOpacity, hueShift, satShift, briShift, targetflyBrushType, targetmainStrokeDir, brushDir, ctlNoise, brushPaintCtlNoisebyFrame, brushPaintInterpolationOffset, brushPaintOldRInitial, keyBlendMode, initialSize, spraySize, step, step2, randStep, maxUpdates, pathRotation, spring, friction, baseBrushSize, expectedStrokeLength, effect3Brightness, mouseX, mouseY, drawingSeed, brushModeSP, forceMapParams{randomSeed1..4, scale1..3, amplitude1..3, phase1..3, vortexScale1..2, clusterScale1..2}`；2.json 多了 `useSpectralMix, hasPressure`；可选 `customBrushColor, penSketchNoiseBase, penSketchStrokeWeight, maskData`。

- 数值都用 `_j188` 四舍五入到 2 位小数（`Math.round(v*100)/100`）。坐标在 brushMode≠3 时取整。
- `mountain-mist.json` 是**另一种 schema**（`canvas` / `backgroundColor` / 事件用 `type`、`time`、`pressure`），【推测】是早期或 AI 生成格式；播放器通过 `e.m || e.type`、`e.t ?? e.time` 兼容。
- 画廊校验（`gallery/js/validator.js`）：顶层必须有 `events, canvasSize, randomSeed`；strokeData 必须有 `brushMode, brushColorMode, initialSize, strokeSeed`；`brushMode∈1..7`、`brushColorMode∈0..35`；每个 mp 要有对应的 mr；每笔 md 少于 50 个会警告。
- 体积：每笔约 50–80 个 md，1.json（46 笔）约 293KB，偏大，因为每个 mp 都带完整的约 40 字段快照。

---

## 10. 相机（p5.easycam）与分层

- `_j27`（1988–2032）：`new Dw.EasyCam(_renderer, {distance: h/(2tan(PI/6)), center:[0,0,0]})`，**锁定旋转**（`setRotationConstraint(0,0,0)`、`setRotationScale(0)`），只用平移和缩放，距离范围 `[d/2.5, d]`。
- 回放时相机自动跟随笔尖（`updateEasyCamAutoTracking` 1920–1987）：缩放保持在 1.1–1.4 倍，中心向笔尖 lerp（系数 `_j655=0.05`），并限制在不露出画布边缘的范围内。用户拖动后会在 `_j669=1000ms` 内回弹（`_j26`）。
- **分层 z 平面**：最终图层不是直接贴屏幕，而是 4 张平面分别放在 `translate(0,0,z)`，`z ∈ {0,40,80,120}`（finalOut / 光标 / 未来路径 / 文字叠加），配合透视相机产生轻微视差；z 值在开始/结束时用 1 秒 lerp 过渡（`_j37`、`updateBlurEffect`、`drawLayersWithBlur` 4656–4700）。**这对"2.5D 山水视差"的游戏场景有直接参考价值。**

---

## 11. UI / 控制 / 对外接口

- Artist 模式有 5 个可拖动面板（位置存在 localStorage）：Art System Log、Brush Control（7 种笔、6 种墨效、7 档笔号、路径旋转、混合模式、35 色）、Effect Control（虫咬、金属）、Flow 面板、Mask 面板；左下角有 Zen / Collect Panels / testMode（测试区不录制，退出时从快照恢复所有 buffer）。
- 快捷键：Enter（`_j126`）、`f` 全屏、空格清空（4290–4316）。
- URL 参数 `?_k:v_k:v`：只要有任何参数就先关闭所有开关；有 `pix, w, h, path, grid, console, paper, camera, loop, distort, rs, cl, wd, gr, artist` 等。
- **Agent API**（index.html 第 565 行起的 `#agent-api-spec` JSON）：`window.loadRecordingFromText(json, {append})`、`window.inkfieldSnapshot({download})`、textarea 粘贴、文件上传；`append:true` 是人机共绘模式。文档还有 AI 生成 JSON 的经验：每笔 50–80 个 md，两笔间隔 ≥ maxUpdates×16ms（约 500ms），否则上一笔的收尾会被截断。
- PWA：`sw.js` cache-first（`CACHE_VERSION='v14'`，资源清单是生成的），`manifest.json` standalone。

---

## 12. 性能技巧（代码里能找到的）

1. 全部换成 `createFramebuffer`，WebGL context 从 16 个降到 3 个（文档）。
2. Uniform 缓存 `_j28`（2058–2063），rect 缓存 `_j29`（2064–2076）。
3. Dirty flag `_j575`，不需要时跳过 composite（2155、2215）。
4. 移动端 pixelDensity 限制为 1，手机禁用 collector（2825–2858）。
5. 纸纹在 setup 时生成一次，最长边 2000px 封顶（`_j231=2000`，500–547）。
6. 后处理只有开关打开时才跑；metallic 只有在有虫咬点时才跑。
7. 性能监控 `_j35/_j36`（3185–3371）：每 5 帧采样一次各阶段耗时，FPS 低于阈值时输出瓶颈报告和建议（"考虑禁用 shader 效果"、"画布 >1.5MP 时降低 pixel density"等）。
8. `allBrushStrokes` 最多保留 100 条（`_j587`，4991–4993）。
9. 反例：每次 feedback 都"写 pingPong → image 拷回"（2083–2119），多一次全屏拷贝；flow 提交时对 4 个 buffer 各做"拷贝 + pass"。用指针交换能省掉一半带宽。

---

## 13. 可借鉴 vs 强耦合

| 机制 | 价值 | 能否在 InkGames 里"自己实现" | 说明 |
|---|---|---|---|
| 弹簧阻尼笔尖 + "越快越细" | 高 | ✅（公开的物理模型；文档也引用了 Hooke 定律教程） | 我们用 dt 无关的形式重写（见 04） |
| 分叉/飞白：多条偏移子线 + 随机出现阈值 + noise 粗细 | 高 | ✅ 只借思路，**不抄偏移表** | GPU 实例化 splat + 鬃毛噪声遮罩实现 |
| `min()` 扩散（深色优先、墨不凭空产生） | 中高 | ✅ | 作为"干性扩散/洇"模式，与流体模型互补 |
| 边缘沉积（干边） | 高 | ✅ | inkwash 的 `1+|∇|·k` 更简单，可以合并使用 |
| 独立 identity buffer（typeMap），位移时同步、最近邻采样 | **很高** | ✅ | 游戏里对应 MaterialID / 阵营 / 可交互标记 |
| 确定性：seed + 每帧重播种 + 调用计数 + 每步一个事件 + 录下非确定结果 | **很高** | ✅ | InkGames 改用"分子系统独立 PRNG 流 + 固定步长" |
| 记录过程不记录像素（录制 = 小体积、可换分辨率重放） | 高 | ✅ | 但我们的格式应该更紧凑（每笔一个参数快照引用 + 点数组） |
| 程序化力场（多层 simplex 向量噪声 + 涡旋） | 中 | ✅（simplex 噪声本身是公开的 MIT 实现） | 作为"风"、"水流"环境场 |
| 流场后处理 8 种 blendType | 中 | ⚠️ 只参考效果分类 | v2 |
| 光谱混色（38 波段，几何平均） | 中 | ✅ 直接用 **spectral.js（MIT）**，不碰 inkField shader | v2 可选 |
| 分层 z 平面 + 透视相机视差 | 中高 | ✅ | 2.5D 山水 |
| 35 色板 | 低 | ❌ 不需要 | 我们按中国画颜料（墨、花青、赭石、藤黄、朱砂……）自定义 |
| 全局可变状态、混淆构建、DOM 面板逻辑混在引擎里、按帧计数的物理、CPU `line()` 笔刷 | — | ❌ 不要模仿 | 这些正是 InkGames 要解决的"引擎化"问题 |

---

## 14. 观察到的问题和教训（给 InkGames 的提醒）

1. **引擎和应用没有边界**：渲染、录制、UI 面板、fxhash 集成、视频导出全部写在一个全局作用域里（draw() 里还直接操作 DOM，例如 3444–3467 的 fxhash 调试叠加层）。InkGames 必须把引擎核心做成**无 DOM 依赖**（除了 canvas 和输入）的模块。
2. **帧率耦合**：物理和扩散每帧走一步，60fps 和 30fps 的设备画出来的笔触不一样，回放也依赖"每帧一个事件"。游戏需要固定步长。
3. **8-bit buffer + 反复读写**：feedback 每帧都写 UNSIGNED_BYTE 的 framebuffer（创建时没有指定 format，默认是 UNSIGNED_BYTE），长时间扩散会积累量化误差（p5 官方教程也提到 float framebuffer 能解决"颜色淡不掉"的问题）。【推测】这也是它需要很多 hash 噪声来掩盖色带的原因之一。
4. **混淆带来的隐患**：uniform 名被改导致 `setUniform` 静默失效（见 5.6，推测）。
5. **文档和代码有漂移**：useSharpen 名称、LICENSE 里 easycam 的许可证与文件头不一致。所以本分析以代码为准、文档为辅。
