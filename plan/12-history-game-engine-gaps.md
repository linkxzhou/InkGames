# 12 · 历史游戏：开场动画管线、引擎缺口与路线（草案）

> 状态：**规划草案**。目标引擎是 **three.js + Matter.js**：横版动作，Matter.js 在 X/Y 平面做 2D 物理，驱动 three.js 模型的 `position.x/y`，Z 固定。新引擎计划里的效果包括：地形上的 3D 墨散（动态纹理）、皴法山石（随相机距离变化的笔触描边 + Perlin 噪声）、墨溅断竹（骨骼摇摆，顶点着色器把网格撕裂成粒子）。引擎规划与 `docs/` 由另一份改写负责，本文不改 `plan/10` 与 `docs/`，只从历史游戏的需求出发列缺口。
> **当前 `src/` 仍是 PixiJS 8 + Matter.js 实现**，会迁移。本文的“现状”一栏全部来自 2026-10-09 读到的代码（`main` = b38acde），说明哪些可以直接带到 three.js，哪些要重写。
> 相关：[故事与玩法](./11-history-game-story-design.md) · [章节大纲](./11-history-game-chapter-outline.md) · [内容数据格式](./11-history-game-content-schema.md)

## 1. 现有代码里能带走什么

| 模块（当前文件） | 依赖 | 迁到 three.js 时 | 依据 |
|---|---|---|---|
| `InkBrushEngine`（`src/core/ink-brush.ts`，1308 行） | 只依赖 `ink-palette`、`ink-random`，**不依赖 Pixi** | 原样保留。它每帧输出 `InkDrawOp`（line / dot / rect）和 `InkShaderState`，与渲染库无关 | 文件头 import |
| `P5Random` / `P5Noise`（`ink-random.ts`）、`INK_PALETTE`（`ink-palette.ts`）、`inkPaperPixels`（`ink-paper.ts`） | 无 / Canvas 2D | 原样保留 | — |
| GLSL 片元着色器（`ink-shaders.ts` 由脚本从 inkEngine 生成，`ink-wash-filters.ts` 包装） | 着色器文本无依赖；包装层依赖 Pixi `Filter` / `GlProgram` | 着色器文本保留；包装层改成 three.js `ShaderMaterial` + 全屏三角形，ping-pong 用 `WebGLRenderTarget` | `ink-wash-filters.ts` 第 1 行 import pixi.js |
| `InkWash`（`ink-wash.ts`，755 行）：stamp / wet / pingPong / final / typeMap / display 等 11 张 RenderTexture，feedback → encode → typeMap → composite 流程，flow / distort / metallic，`wash()` | Pixi `RenderTexture`、`Graphics`、`Sprite` | **重写渲染层，保留流程**。`drawOps` 现在用 Pixi `Graphics` 光栅化线段，three.js 下要自己做（实例化圆头四边形或 SDF 线段） | `drawOps()` |
| `InkWorld`（`ink-world.ts`）：Matter 世界、墨桥、投射物 | 只依赖 matter-js | 原样保留，作为“物理权威”，three.js 只读它的位置 | 文件头 import |
| `inkLayerScale` / `INK_LAYER_Z`（`ink-camera.ts`） | 无 | 数学保留；在 three.js 中直接用透视相机和真实 Z，不再手算缩放 | — |
| `PROP_BRUSHES` / `paintProp` / `actionStroke`（`src/plugins/`） | 只依赖 ink-brush 类型 | 保留，道具仍是“一组指针笔画” | — |
| `InkStage`（`ink-stage.ts`，654 行） | Pixi `Application`、`Container` | 重写。它绑定单个 `ItemPreset`，道具行为写在 `switch (item.action)` 里，画布固定 1280×720 | 第 362 行 `switch` |
| `recording.ts` | v0.1 `Engine` 命令 | 不能用于 2.0 笔画；需要新格式 | docs/12 “录制”一行 |

结论：**笔刷算法、调色板、噪声、物理都能带走；渲染层（InkWash、InkStage、滤镜包装）要按 three.js 重写**。历史游戏需要的叙事、过场、音频、文字、存档、UI 在现有代码里都没有（`src/` 与 `apps/` 中检索 audio / localStorage / Text / font / i18n 均无结果）。

## 2. 开场动画管线

开场动画不是视频，是**按时间轴执行的笔画、镜头、文字、效果和声音**。每次播放都用同一个种子和固定帧时钟，所以结果确定，可以回放、可以截图比对，也可以离线导出成视频作为低端机的后备。

### 2.1 数据流

```text
分镜表（美术）
  └─▶ 过场 JSON（inkgames.cutscene，见内容数据格式 §2.6）
        ├─ strokes  ─▶ StrokeScheduler ─▶ InkSurface（three.js 渲染目标上的墨面）
        ├─ camera   ─▶ CameraRig（PerspectiveCamera，X/Y 平移、推拉、抖动、景深）
        ├─ text     ─▶ InkText（题字、字幕、印章）
        ├─ effects  ─▶ PostStack（flow / distort / metallic / wash / mask / fade / 墨散 / 断竹）
        ├─ audio    ─▶ AudioBus（bgm / amb / sfx / vo，Web Audio）
        └─ sync     ─▶ CutsceneClock（帧时钟；同步点等待旁白或输入）
```

### 2.2 时钟与同步

- **画面以帧为准**：`clock.mode = 'frame'`，60 帧一秒，与 inkEngine 的 `clock: 'frame'` 一致。笔画必须逐帧执行，不能跳帧，否则扩散结果会变。
- **声音以 Web Audio 时钟为准**：每条 `AudioCue` 在派发帧换算成 `AudioContext.currentTime` 计划播放。
- **两者在同步点对齐**：遇到 `SyncPoint{ waitFor: 'vo-end' }`，画面停在该帧等待旁白结束（最多 `maxWaitFrames`）。不同语言配音长度不同，靠同步点吸收差异，不改笔画时间。
- **跟不上时**：如果某帧的墨面计算超时，下一帧多跑几步追赶（每渲染帧最多 N 步，N 按质量档设定），音频不等；追不上就在下一个同步点补齐。这条要在真实 GPU 上实测后定参数。

### 2.3 笔画的三种来源

| 来源 | 适用 | 说明 |
|---|---|---|
| 道具预设（`prop` + `placement`） | 人物、兵器、马、船、旗、山水 | 复用 `paintProp`，与玩法里的道具一模一样 |
| 内联路径（`brush` + `path` + `speed`） | 柱子、地图卷、一刀飞白 | 笔刷键写成 `道具.部件`（如 `sword.slash`），从 `PROP_BRUSHES` 取参数 |
| 录制（`recording`） | 画师在数位板上手绘的段落 | 需要新的 2.0 录制格式（缺口 G-04），并能导入 inkEngine 的 `mp / md / mr / flow / ec / mask` 事件 |

`mode: 'live'` 用逐帧推进（现在 `InkWash` 的 `beginStroke / addPoint / update` 已经是这个模型），观众能看到“画”的过程；`mode: 'instant'` 在一帧内画完（等价于现在同步执行的 `strokePath`），用于不需要展示过程的背景。

### 2.4 镜头、景深、遮罩

- three.js 透视相机天然支持 inkEngine 的四层 z（-80 / 0 / 40 / 120）：墨面平面放在对应 Z，视差由相机自动产生，不再手算 `inkLayerScale`。
- 推拉（inkEngine 回放时 EasyCam 收到 1.1 倍）、抖动、沿 X 的长卷平移由 `CameraRig` 按关键帧插值。
- 景深：后处理 Bokeh 或按层模糊（远层墨面单独模糊一次），二选一，看性能。
- 遮罩：在合成后加一个遮罩 pass，支持矩形与多边形（对应 inkEngine 的 `drawMaskRect / drawMaskPolygon`），用于暗角、题字留白、“只显示画卷一角”的转场。

### 2.5 文字与题字

- **字幕与说明文字**：SDF 文字（例如 troika-three-text，MIT，引入前登记许可）或 Canvas 2D 生成纹理，竖排要自己排版。
- **书法题字**：两档。P1 用书法字体渲染成纹理，再用墨面的 `wash` 和 flow 做“墨迹渗开”的入场；P2 用字形笔顺数据驱动笔刷真的“写”出来。笔顺数据的许可要先核验（待核验），不能用来源不明的数据。
- 所有字体做子集化，校验器检查每个字符串都在子集里（见内容数据格式 §4.1）。

### 2.6 预烘焙与后备

现在十卡的开场在 SwiftShader 上要 18–35 秒（plan/10 P0 记录），历史游戏的开场有几十到上百笔，必须处理：

1. **关键帧缓存**：过场的 `bake.keyframes` 处保存墨面渲染目标的纹理快照。跳过、回看、读档直接贴快照。
2. **分帧画背景**：远山、地面这类 `instant` 笔画放到加载阶段，分帧完成。
3. **视频后备**：用确定性时钟 + 无头浏览器逐帧导出 WebM，低端设备直接播放视频（失去“实时画”的特性，但内容一致）。

### 2.7 创作工具

| 工具 | 用途 | 优先级 |
|---|---|---|
| 过场预览页（`apps/history/cutscene/?id=`） | 载入 JSON，播放、暂停、逐帧、跳到镜头、显示同步点 | P0 |
| 笔画采集 | 在墨面上用鼠标或数位板画，导出 2.0 录制或内联路径 | P1 |
| 时间轴编辑器 | 多轨拖拽编辑（笔画、镜头、文字、效果、音频），所见即所得 | P2 |
| 旁白对稿 | 字符串表 + 音频时长 → 自动建议同步点 | P1 |
| 内容校验 CLI | 见内容数据格式 §4 | P0 |

## 3. 引擎缺口清单

优先级：**P0** = 垂直切片必须有；**P1** = 做完整章节之前要有；**P2** = 量产或打磨阶段。工作量按一名熟悉代码的工程师估，单位“人周”，粗估。“迁移”一栏说明它和 three.js 迁移的关系。

| # | 模块 | 用途 | 现状（读代码） | API 草案 | 优先级 | 依赖 | 工作量 |
|---|---|---|---|---|---|---|---|
| G-01 | 墨面渲染层 `InkSurface` | 把 inkEngine 管线跑在 three.js 渲染目标上；墨面既能是平面（纸、远山），也能是地形的动态纹理 | Pixi 版 `InkWash` 完整；three.js 版没有 | `new InkSurface(renderer, { width, height, seed, paper })`；`paint(stroke)`、`begin/add/end/update`、`wash`、`snapshot()`、`texture` | P0 | three.js 迁移本身 | 4–6（属迁移主线） |
| G-02 | 场景管理 `SceneDirector` | 加载场景、切换剧情节点、转场（墨洗、卷轴），统一资源生命周期 | 没有。`InkStage` 一页一个道具，行为在 `switch` 里 | `director.load(sceneId)`、`director.enter(nodeId)`、`director.transition('wash'|'scroll', frames)`；资源随场景登记、随场景释放 | P0 | G-01 | 2–3 |
| G-03 | 剧情运行时 `StoryRuntime` | 执行剧情图：选择、条件、旗标、汇流与歧出、检查点 | 没有 | `story.start(scene)`、`story.choose(choiceId)`、`story.on('node', cb)`、`story.snapshot()/restore()` | P0 | 内容格式 | 1.5–2 |
| G-04 | 2.0 笔画录制与回放 | 画师手绘段落的录制、过场里的回放；导入 inkEngine 录制 | `recording.ts` 只录 v0.1 命令；2.0 笔画只有 `PropStroke` | `{ format: 'inkgames.ink-recording', version: 2, seed, canvas, events: [{ t, m: 'mp'|'md'|'mr'|'flow'|'ec'|'mask', ... }] }`；`recordInk(surface)`、`playInk(surface, rec, { from, to })`；`importInkEngine(json)` | P0 | G-01 | 2 |
| G-05 | 过场播放器 `CutscenePlayer` | 执行过场 JSON 的六条轨道，帧时钟，同步点，跳过与关键帧缓存 | 没有 | `const p = await CutscenePlayer.load(def, ctx)`；`p.play()`、`p.pause()`、`p.seek(frame)`、`p.skip()`、事件 `shot`、`sync`、`end` | P0 | G-01、G-04、G-06、G-07、G-09 | 3–4 |
| G-06 | 音频系统 `AudioBus` | BGM、环境声、音效、旁白四条总线；淡入淡出、交叉淡化、闪避；首次交互解锁；与帧时钟同步 | 没有 | `audio.play(cue)`、`audio.stop(bus, fadeFrames)`、`audio.duck(bus, db)`、`audio.voEnded(key)`；可基于 three.js `AudioListener`/`Audio`（Web Audio） | P0 | — | 2 |
| G-07 | 文字与字幕 `InkText` | 字幕、竖排题字、印章、选项文字 | 没有（`INK_LAYER_Z.overlay = 120` 定义了文字层深度，但没有任何文字渲染） | `text.show(cue)`、`text.hide(id)`；竖排排版；字体子集加载 | P0（字幕、竖排）／P2（笔顺书写） | 字体许可 | 1.5（P0）+ 3（P2） |
| G-08 | 开场性能：预烘焙与分帧 | 解决几十笔开场的等待时间 | plan/10 P0 已记录十卡开场 18–35 秒（SwiftShader），真实 GPU 未测 | `surface.snapshot()/restore(tex)`、`bakeQueue.add(strokes, budgetMsPerFrame)` | P0 | G-01 | 2 |
| G-09 | 存档与进度 `SaveStore` | 场景进度、结局、收集、设置；版本迁移 | 没有 | `save.load()`、`save.commit(patch)`、`save.migrate(from, to)`；IndexedDB，退化到 localStorage | P0 | 内容格式 | 1 |
| G-10 | UI 层 | 主菜单、时间线长卷、选择印章、史评卷轴、卡片册、设置 | 没有（十卡首页是静态 HTML） | 建议 DOM 覆盖层做菜单和长文本，three.js 做长卷和印章动画；`ui.choice(options) → Promise<id>` | P0（选择、字幕、简版时间线）／P1（完整长卷与卡册） | G-02、G-07 | 3 + 3 |
| G-11 | 镜头：推拉、景深 | 开场镜头语言 | Pixi 版没有 EasyCam 的回放变焦和景深；相机偏移限制在 48×36 px | `cameraRig.key({ at, x, y, zoom, dof })`；three.js 透视相机 + 后处理 | P1（切片里用一次推近，可先不做景深） | three.js 迁移 | 1.5 |
| G-12 | 遮罩 pass | 暗角、留白、局部显示 | 没有（inkEngine 有 `drawMaskRect / drawMaskPolygon`） | `post.mask({ rect | polygon, feather })` | P1 | G-01 | 1 |
| G-13 | 角色与 NPC | 人物姿态、行走、对话时的动作；同一人物不同服色 | 人物是 `figure` 笔画精灵，`pose` 只有 0/1；马两种步态，旗三幅 | 迁移后：骨骼模型 + 墨描边（与断竹的骨骼摇摆同一套），或“姿态库笔画 + 插值”；`actor.pose(name)`、`actor.say(lineKey)`；笔刷颜色覆盖（如白衣） | P1 | three.js 迁移、断竹骨骼 | 4 |
| G-14 | 玩法模板插件 | 决斗、战阵、守城、水战、治水、奔袭、庙堂、解谜、竹林（见故事与玩法 §5） | 十个道具行为写在 `InkStage` 的 `switch` 里；剑、枪、刀的命中是几何距离，不是扫掠体 | `defineGameplay({ id, requires, setup(ctx, params), onEvent })`；剧情图通过 `gameplay.template/params` 调用 | P0（决斗、对话时机、解谜各一个）／P1（其余） | G-02、G-03 | 切片 3；全部 8+ |
| G-15 | 群体单位 | 战阵、骑兵、鸟群；inkEngine 的 boid | 没有 boid | `crowd.spawn(formation, count)`；Matter 只给少量代表体，大量单位做纯视觉 | P1 | three.js 迁移 | 2–3 |
| G-16 | 地形墨散与山石、断竹接入叙事 | 让三项新效果能被过场和剧情触发（马蹄墨散、刀过断竹、山石入画） | 属于新引擎计划，当前代码没有 | `effects.inkDisperse(at, params)`、`effects.bambooBreak(id, impulse)`；过场 `EffectCue.kind = 'inkDisperse' | 'bambooBreak'` | P1 | 新引擎效果 | 1（接入） |
| G-17 | 内容管线与加载 | 内容目录、校验 CLI、资源清单、按章懒加载、缓存 | 有 `scene-json.ts`（v0.1 场景 JSON 解析），没有内容管线 | `loadChapter(id)`、`content.validate()`；构建期生成 `timeline.json` 与资源清单 | P0（校验 CLI）／P1（懒加载） | 内容格式 | 2 |
| G-18 | 本地化 | 简体基准，繁体与英文 | 没有 | 字符串表 + `t(key)`；字体子集按语言分包；旁白分语言目录 | P1 | G-07、G-17 | 1.5 |
| G-19 | WebGL 上下文恢复 | 长时间游玩时恢复墨面 | plan/10 P0 已记录：只暂停并提示重置，不重建 | 迁移后：上下文丢失时从最近关键帧快照（G-08）和存档恢复 | P1 | G-08、G-09 | 1.5 |
| G-20 | 创作工具 | 过场预览、笔画采集、时间轴编辑、对稿 | 有 `apps/compare` 对照页，可借鉴 | 见 §2.7 | P0（预览）／P1／P2 | G-05 | 1 + 2 + 4 |
| G-21 | 测试与性能 | 确定性回放截图、真实 GPU 性能矩阵、Safari/Firefox | 只有无头 Chromium + SwiftShader 冒烟；真实 GPU 未测 | 过场关键帧截图基线；性能预算：开场每帧墨面计算 ≤ 8 ms（目标值，未实测） | P0（切片前在一台独显桌面实测）／P1 | G-05 | 2 |
| G-22 | 无障碍与设置 | 字幕字号、跳过、音量分轨、色弱友好的线色 | 没有 | 设置项写进存档 | P1 | G-09、G-10 | 1 |

### 3.1 依赖顺序

```text
three.js 迁移（G-01 墨面、物理驱动模型）
   ├─▶ G-08 预烘焙 ─▶ G-19 上下文恢复
   ├─▶ G-04 录制 ──┐
   ├─▶ G-06 音频 ──┼─▶ G-05 过场播放器 ─▶ G-20 预览工具
   ├─▶ G-07 文字 ──┘
   └─▶ G-02 场景管理 ─▶ G-14 玩法模板
内容格式 ─▶ G-03 剧情运行时、G-09 存档、G-17 校验 ─▶ G-10 UI
```

迁移完成前，可以先做与渲染无关的部分：内容格式、校验器、剧情运行时、存档、音频总线。这些用纯逻辑单测覆盖，不碰 Pixi 也不碰 three.js。

## 4. 路线与里程碑

### M0 · 准备（1–2 周，可与 three.js 迁移并行）

- 定稿内容格式；写校验 CLI 与剧情运行时（G-03、G-09、G-17 的校验部分），样例 `scene-zhanguo-jingke.example.json` 作为测试夹具通过校验。
- 用 history-santi 对《东周列国志》第九十八至一百八回做完整三体笔记，并对照《史记》相关列传核对垂直切片三个场景的事实，清掉 `verify: pending`。
- 决定 `skills/` 是否提交（见故事与玩法 §9）。

**验收**：`./build.sh check` 跑过校验器与新单测；三个切片场景的正史节点全部 `verify: done`，由史学顾问签字。

### M1 · 垂直切片：战国末三幕（6–8 周，需 three.js 迁移的墨面层可用）

| 场景 | 内容范围 | 开场 | 分支 |
|---|---|---|---|
| 05-05 完璧归赵 | 庙堂对答 + 时机玩法 | 简版：题字 + 两句旁白 + 静态笔画 | 正史 + 野史（和氏璧传说，简版） |
| 05-08 窃符救赵 | 潜行 + 突击 | 简版 | 正史 + 野史（《东周列国志》铺陈，简版） |
| **05-09 易水寒 · 荆轲刺秦王** | 对话时机 + 决斗；野史线换视角解谜 | **完整：90 秒水墨开场 + 配乐 + 旁白 + 音效** | 正史 + 野史完整；推演只留入口 |

需要的缺口：G-01、G-02、G-03、G-04（至少回放）、G-05、G-06、G-07（字幕与竖排）、G-08、G-09、G-10（选择、字幕、简版时间线）、G-14（三个模板）、G-17（校验）、G-20（预览）、G-21（一台独显实测）。

**验收标准**：

1. 三个场景都能从时间线进入，按“开场 → 抉择 → 分支 → 结局 → 汇流 → 史评”走完，正史与野史两条线都能通关。
2. 荆轲开场在固定种子下两次播放，五个镜头末帧截图逐像素一致（同一机器、同一浏览器）。
3. 旁白与字幕在两个同步点对齐，误差 ≤ 2 帧；换一条更长的测试旁白时，画面在同步点等待而不跳笔。
4. 在一台独立显卡的桌面浏览器上，开场全程无卡顿等待超过 1 秒（加载阶段除外），并记录每帧墨面耗时分布。没测过的浏览器写“未实测”。
5. 存档后刷新页面，能回到最近检查点；时间线上显示正确的墨线、朱线与汇流点。
6. 内容校验器零错误；字符串表的版权比对（本地）零命中；全部旁白为原创文字，引用古籍处有出处。
7. 史评卷轴展示“秦王如何脱身”“太子丹归燕”两条正野对照，出处可点开。

### M2 · 三章（战国、秦、楚汉·西汉）完整版（10–12 周）

- 补 G-11、G-12、G-13、G-15、G-16、G-18、G-19、G-22；玩法模板补到 6 个。
- 每章 4–6 个场景，每个场景都有完整开场。
- 笔画采集工具（G-20 P1）上线，画师开始手绘关键镜头。

**验收**：三章共 12–18 个场景，章节解锁、收集、异闻录可用；繁体与英文字幕可切换。

### M3 · 量产管线（与 M2 后半并行）

- 时间轴编辑器（G-20 P2）、对稿工具、视频后备导出。
- 书法笔顺题字（G-07 P2，先核验笔顺数据许可）。
- 每个场景的生产周期目标：研究 3 天 + 脚本 3 天 + 开场 5 天 + 玩法接入 3 天 + 复核 2 天（目标值，用 M2 数据校正）。

### M4 · 全朝代内容波次

按章节大纲分批：上古—春秋、汉末三国、两晋南北朝隋、唐五代、宋辽金、元明、清。每批结束做一次史学与版权复核。

### M5 · 打磨与发布

真实 GPU 矩阵、Safari / Firefox 实测、上下文恢复、性能分档、无障碍、发布物审计（确保语料库与受限第三方快照都不在 `dist/`）。

## 5. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| three.js 迁移进度 | 墨面层（G-01）不可用时，过场与玩法都无法验收 | M0 先做与渲染无关的部分；过场播放器对墨面只依赖一个接口，便于先用 Pixi 版验证调度逻辑 |
| 开场性能 | 几十笔逐帧扩散在中低端机上过慢 | 关键帧缓存、分帧、视频后备；质量档控制每帧追赶步数 |
| 史实争议 | 正史线被指不准确 | 每节点有出处，`pending` 不能发布，史学顾问签字，史评列“考异” |
| 版权 | 语料库多为现代作品 | 文字全部原创，本地 n-gram 比对，语料不入库不入发布物 |
| 敏感题材 | 屠城、民族关系、近现代 | 按故事与玩法 §6.4 处理；民国默认不做 |
