# 10 · three.js + Matter.js 横版水墨动作引擎

状态：**M0–M4 已完成，M5 部分完成，Pixi/p5/原生 WebGL2 已清理**（见 §7）。渲染栈只剩 `three@0.186.1` + `matter-js@0.20.0`。入口：`apps/scroll/`（切片）、`apps/story/`（叙事）、`apps/history/`（历史动画）、`apps/gallery/`（参照画廊）、`apps/props/`（二十个道具页）。公共 API 从 `src/index.ts` 导出。真实 GPU 未实测。

历史游戏的叙事、过场数据和缺口优先级在 [12 · 引擎缺口](../video/docs/engine-gaps.md)，故事结构在 [11 · 故事与玩法](../video/docs/story-design.md)。本文写引擎怎么搭，并与第 12 章的模块名对齐。剧情正文不在这里展开。两边若措辞不一致，以 §11 已确认的条目为准，其余模块名以本文与第 12 章已经对齐的名字为准。

## 0. 所有者已经定下的事

所有者判定 v2 的 PixiJS 8 渲染观感不够，引擎改为 **three.js + Matter.js**（旧栈已于 2026-10-09 删除，见 §7）：

- 玩法是横版动作。位移和碰撞都在 X/Y 平面，Z 不参与物理。
- Matter.js 跑一个不可见的二维刚体世界。每帧把它算出的 x、y 写到 three.js 模型的 `position.x` / `position.y`。
- 这样做是为了坡、单向平台、击退这些动作游戏的问题有现成刚体解，开发不必自写碰撞。

同时要做三样新画面，技术设计在 §4：

1. 三维水墨洇染与留白：脚落到地面时，墨沿三维地形的起伏渗开，坡度不同速度不同。
2. 毛笔皴法与动态勾边：山石用斧劈皴或披麻皴，镜头远近改变线条粗细，边缘带笔毛的顿挫。
3. 泼墨破竹：竹被砍断时炸成纤维和三维墨滴；风里的摆动有软体的感觉。

水墨观感仍以 `thirdparty/inkEngine` 为参照。笔刷算法已经在 `src/core/ink-brush.ts` 等文件里，迁到 three.js 时留在 CPU，换掉的是渲染宿主。

## 1. 架构

### 1.1 一张图

```text
键盘 / 指针 / 过场 JSON
        │
        ▼
   唯一的 requestAnimationFrame（InkView）
        │
        ├─ 玩法模式
        │     固定步 60 Hz，每帧最多 4 步
        │       采样输入 → 角色意图 → Matter.Engine.update
        │       碰撞：着地法线、单向平台、命中、砍断、脚底接触点
        │       每个刚体记下 previous / current
        │     显示步
        │       alpha 插值写入 mesh.position.x / y，z 用关卡里的层深
        │       CameraRig 跟随
        │       InkSurface 渗流、皴法勾边、竹的摆动（只影响画面）
        │
        └─ 过场模式（CutscenePlayer，见 video/docs/engine-gaps §2）
              帧时钟 60 fps，笔画不跳帧
              物理世界暂停
              墨面、镜头、文字、效果、声音按 CutsceneDef 的轨道走
              同步点上画面等旁白或输入
        │
        ▼
   WebGLRenderer.render（画布）
   DOM 覆盖层：菜单、长文本、选项（video/docs/engine-gaps G-10）
```

玩法固定步和过场帧时钟共用这一条 RAF，由 `SceneDirector` 决定当前是哪一个。两条时钟不在同一帧里各推一次权威物理。

### 1.2 场景、相机、分层

`InkView` 持有 `WebGLRenderer`、`Scene` 和画布。画布以 1280×720 为内部分辨率，CSS 用 `object-fit: contain`。`devicePixelRatio` 上限为 2；截图姿态传 1。

**坐标（已确认，见 §11）。** 物理、笔刷、过场 JSON 共用像素平面，Y 向下：`Matter` 的 `gravity.y` 为正，`InkBrushEngine` 的点和 [内容数据格式](../video/docs/content-schema.md) 里 `CutsceneDef.canvas`、`CameraKey.x/y` 都是这套数。相机 `up` 为 `(0, -1, 0)`。`lookAt` 在这个 up 下会把视野滚 180° 并镜像 X，所以 `CameraRig.place` 在 `lookAt` 之后把 `camera.scale.x` 设为 `-1`，世界 +x 在画面右侧，世界 +y 仍向下。刚体的 `position.x/y` **原样**写入 `mesh.position.x/y`。Z 不从物理来。负缩放反转缠绕，需要看见的填充用 `DoubleSide`。

层深继续用 `INK_LAYER_Z`（`src/core/ink-camera.ts`）：远景 −80、玩法纸面 0、角色与道具 40、文字 120。这四个数是像素级的视差偏移，不是米。`video/docs/engine-gaps` 要求过场里的墨面平面直接放在这些 Z 上。相机放在 `z = inkCameraDistance(height)`（720p 下约 623 px），朝原点看，fov 保持 π/3。这时 z = 0 的一层在画面上是 1:1，和现行 `inkLayerScale` 一致，只是缩放改由透视相机产生，不再手乘精灵缩放。

玩法跟随：相机在 X/Y 上以每帧 5% 的比例靠向角色，再夹进关卡包围盒；关卡比视口短时居中。十卡 `InkStage` 的 ±48×36 限制留在那条舞台上。变焦改相机到纸面的距离：`zoom` 1.1 表示拉近到默认距离的 1/1.1。`CameraKey.zoom` 用同一含义。切片演示不改变 zoom。

正交相机保留为调试开关。正交投影下物体大小不随 Z 变化，坡和碰撞框更好对，但 video/docs/engine-gaps 的四层 Z 视差和「镜头远近改线宽」都要另做。默认镜头是透视。

视差：远山墨面放在 z = −80，近景枝叶放在 z 略大于 0 且仍在相机前面。碰撞体全部在 z = 0 的剖面上。网格可以在 Z 上有起伏（山石的厚度、地面的凹凸），这块起伏只给画面和洇染用，不写进 Matter。

### 1.3 物理世界

不启用 `Matter.Runner`。固定步里调用 `Engine.update(engine, 1000/60)`，和现行 `InkWorld.step` 一样。`enableSleeping: false`。

现行 `InkWorld`（像素、圆角色、平地、墨桥）继续服务十卡，单测不动。横版新关用新的 `Playfield` 包一层 Matter 世界，避免在迁移动画页之前改掉已经测过的落点和桥。`Playfield` 的单位和 `InkWorld` 相同（像素、Y 向下），所以以后可以把桥和投射物搬过去，而不是先改成米。

每个要显示的刚体登记一个链接：

```ts
interface BodyLink {
  readonly bodyId: number;
  readonly z: number;
  previousX: number;
  previousY: number;
  previousAngle: number;
  currentX: number;
  currentY: number;
  currentAngle: number;
}
```

固定步结束时 `previous = current`，再读刚体。显示时：

```text
alpha = 累加器里还没吃掉的时间 / 固定步长
若本帧因为追步封顶把剩余累加器清掉，alpha 取 1（贴齐，不外推）
mesh.position.x = previousX + (currentX - previousX) * alpha
mesh.position.y = previousY + (currentY - previousY) * alpha
mesh.position.z = link.z
```

角度只对会转的物体（箭）做同样的插值，并先把角差收到 −π..π。角色碰撞体把 `inertia` 设为 `Infinity`，画面上不滚动。

### 1.4 输入

键盘沿用现行：A/D 或左右走，W 或上跳，空格出手。指针用 `Raycaster` 打到 z = 0 的平面，得到和笔刷、瞄准相同的像素坐标。画布留白上的点丢掉。过场同步点 `waitFor: 'input'` 走同一条指针和确认键。

### 1.5 两套时钟为什么分开

| 时钟 | 谁在走 | 规则 |
|---|---|---|
| 玩法固定步 | `Playfield` | 60 Hz，单帧间隔夹到 0.08 秒，每帧最多 4 步，多出来的时间丢掉。显示用 alpha 插值。依据仍是 Fiedler 的固定步，和现行 `InkStage.frame` 同一套数。 |
| 过场帧时钟 | `CutscenePlayer` | `clock.mode = 'frame'`、60 帧一秒，与 inkEngine 的 `clock: 'frame'` 以及 `CutsceneDef` 一致。笔画必须逐帧执行。墨面算超时就在后续帧补步，声音不等；对不齐的语言靠 `SyncPoint` 等旁白。 |

过场播放期间玩法固定步暂停，角色停在进入过场前的 `current`。这样开场动画的墨不会因为补了物理步而多扩散几次。

## 2. 模块、职责、API 草案

名字与 [video/docs/engine-gaps §3](../video/docs/engine-gaps.md#3-引擎缺口清单) 的缺口表一致。下表的「优先级」是历史游戏那一侧的优先级；引擎垂直切片的先后在 §8，两套切片怎么衔接在 §6。

| 模块 | 计划中的文件 | 职责 | 对应缺口 | 优先级 |
|---|---|---|---|---|
| `InkView` | `src/core/ink-view.ts` | 渲染器、场景、尺寸、上下文丢失、`dispose` | 迁移主线 | 引擎切片 |
| `Playfield` | `src/core/playfield.ts` | Matter 世界、固定步、`BodyLink` 插值、接触点 | 物理权威 | 引擎切片 |
| `CameraRig` | `src/core/camera-rig.ts` | 侧视透视相机、跟随、`zoom`、过场关键帧 | G-11 | 引擎切片先做跟随；推拉、景深按 G-11 为 P1 |
| `InkSurface` | `src/core/ink-surface.ts` | 墨面：平面（纸、远山）或地形动态纹理。流程与现行 `InkWash` 相同 | G-01 | P0 |
| `PostStack` | `src/core/post-stack.ts` | flow / distort / metallic / wash / mask / fade，以及 `inkDisperse`、`bambooBreak` 的入口 | G-12、G-16 | mask 为 P1；两个新效果的叙事触发为 P1 |
| `CunMaterial` | `src/core/cun-material.ts` | 斧劈皴 / 披麻皴和动态勾边 | 引擎效果 2 | 引擎切片 |
| `BambooRig` | `src/core/bamboo-rig.ts` | 风中摆动、砍断、纤维与墨滴 | 引擎效果 3；角色骨骼见 G-13 | 引擎切片做竹；G-13 人物为 P1 |
| `ActorController` | `src/core/actor-controller.ts` | 走、跳、坡、单向平台、击退 | G-14 的动作基础 | 引擎切片 |
| `Combat` | `src/core/combat.ts` | 武器扫掠、可砍物体 | 现行距离判定的替换 | 引擎切片 |
| `SceneDirector` | `src/core/scene-director.ts` | 加载场景、进入剧情节点、墨洗 / 卷轴转场、按场景释放资源 | G-02 | P0 |
| `StoryRuntime` | `src/core/story-runtime.ts` | 剧情图：选择、条件、旗标、汇流、检查点 | G-03 | P0 |
| `CutscenePlayer` | `src/core/cutscene-player.ts` | 执行 `inkgames.cutscene` 的六条轨道 | G-05 | P0 |
| 笔画录制 | `src/core/ink-recording.ts` | `inkgames.ink-recording` 版本 2，以及导入 inkEngine 事件 | G-04 | P0 |
| `AudioBus` | `src/core/audio-bus.ts` | bgm / amb / sfx / vo，淡化、闪避、与帧时钟对齐 | G-06 | P0 |
| `InkText` | `src/core/ink-text.ts` | 字幕、竖排题字、印章、选项文字 | G-07 | P0 字幕与竖排；笔顺书写为 P2 |
| `SaveStore` | `src/core/save-store.ts` | `inkgames.save`，IndexedDB，退化到 localStorage | G-09 | P0 |
| UI | `apps/` 的 DOM 层 + 长卷场景 | 菜单、选择、简版时间线；长卷墨迹走 `InkSurface` | G-10 | P0 选择与字幕；完整长卷为 P1 |
| 玩法模板 | `src/plugins/` 下按模板一个文件 | `defineGameplay({ id, requires, setup, onEvent })` | G-14 | P0 先决斗、对话时机、解谜各一个 |

`SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`AudioBus`、`InkText`、`SaveStore` 的方法名用 video/docs/engine-gaps 已经写过的草案，这里不另起一套：

```ts
interface SceneDirector {
  load(sceneId: string): Promise<void>;
  enter(nodeId: string): Promise<void>;
  transition(kind: 'wash' | 'scroll', frames: number): Promise<void>;
}

interface StoryRuntime {
  start(scene: unknown): void;
  choose(choiceId: string): void;
  on(event: 'node', cb: (nodeId: string) => void): void;
  snapshot(): unknown;
  restore(snapshot: unknown): void;
}

interface CutscenePlayer {
  play(): Promise<void>;
  pause(): void;
  seek(frame: number): void;
  skip(): void;
}

interface AudioBus {
  play(cue: unknown): void;
  stop(bus: 'bgm' | 'amb' | 'sfx' | 'vo', fadeFrames: number): void;
  duck(bus: 'bgm' | 'amb', db: number): void;
  voEnded(key: string): boolean;
}

interface InkText {
  show(cue: unknown): void;
  hide(id: string): void;
}

interface SaveStore {
  load(): Promise<unknown>;
  commit(patch: unknown): Promise<void>;
  migrate(from: number, to: number): void;
}
```

`scene`、`cue`、存档的字段以 [内容数据格式](../video/docs/content-schema.md) 的 `CutsceneDef`、`AudioCue`、`SyncPoint`、`SaveGame` 为准。实现时把上面的 `unknown` 换成那些 `interface`，并从 `src/index.ts` 导出。对象契约用 `interface`。

`InkSurface` 的形状按 G-01：

```ts
interface InkSurfaceOptions {
  readonly width: number;
  readonly height: number;
  readonly seed: number;
  readonly paper: boolean;
  readonly background: readonly [number, number, number];
  readonly transparent: boolean;
}

interface InkSurface {
  paint(stroke: unknown): void;
  beginStroke(x: number, y: number, seed: number): void;
  addPoint(x: number, y: number): void;
  endStroke(): void;
  update(): void;
  wash(x: number, y: number, radius: number): void;
  snapshot(): unknown;
  restore(snapshot: unknown): void;
  readonly texture: unknown;
  dispose(): void;
}
```

`paint` 的参数就是现行 `InkStrokeRequest`（笔刷、颜色、每帧一个点、种子、可选的 flow / distort / metallic）。`texture` 是 three.js 的纹理，可以贴在 z 平面上，也可以贴在地形材质上。`snapshot` / `restore` 对应 G-08 的关键帧缓存。

叙事效果入口与 `EffectCue.kind` 相同：

```ts
interface InkEffects {
  inkDisperse(at: { readonly x: number; readonly y: number }, params: { readonly ink: number; readonly water: number; readonly radius: number }): void;
  bambooBreak(id: string, impulse: { readonly x: number; readonly y: number }): void;
}
```

资源：渲染目标、监听、音频节点都登记清理，`dispose()` 幂等。过场和场景切换时由 `SceneDirector` 成对释放，不把纹理留到下一章。

内容格式校验、`StoryRuntime`、`SaveStore`、`AudioBus` 的调度已经在 `src/core/`，由 `tests/narrative.test.ts` 覆盖，不创建 WebGL。页面只读 `video`，不改那些 JSON。

## 3. 现有水墨管线怎么进 three.js

### 3.1 原样留下的 CPU

这些文件与渲染库无关，算法不重写：

| 文件 | 留下什么 |
|---|---|
| `src/core/ink-brush.ts` | 七种笔刷、弹簧阻尼、分叉、飞白、笔压分档。输出 `InkDrawOp` 和 `InkShaderState` |
| `src/core/ink-random.ts` | 与 p5 数值兼容的随机和噪声、多项式 `inkSin` / `inkCos`（不依赖 p5 包） |
| `src/core/ink-palette.ts` | 36 色 |
| `src/core/ink-paper.ts` | 纸纹像素 |
| `src/core/ink-metallic.ts` | `scanInkBites` 的虫蚀采样 |
| `src/core/ink-noise.ts` | 值噪声。皴法要用的是另一份 Perlin，见 §4.2 |
| `src/plugins/prop-brushes.ts`、`prop-paintings.ts` | `PROP_BRUSHES`、`paintProp`、`actionStroke` |
| `src/core/ink-shaders.ts` | 片元着色器文本：feedback、encode、typeMap、composite、realtime、mapFrag、distort、flow、metallic |

`InkBrushEngine` 继续只用四则、`Math.sqrt` / `Math.hypot` 和多项式三角函数。同一组点和同一个 `seed`，绘制指令与现在的单测一致。

### 3.2 要换宿主的部分

| 现行 | 计划 |
|---|---|
| 旧 `ink-wash-filters.ts` 曾把片元包成 Pixi `Filter`（已删除） | `RawShaderMaterial`，`glslVersion` 用 three.js 的 `GLSL3`。不用普通 `ShaderMaterial`，避免 three 注入的属性块和移植着色器的 `in` / `out` 撞名 |
| 旧 Pixi `RenderTexture` → `WebGLRenderTarget`。feedback 的 ping-pong 是两张专用目标，不能和别的 pass 共用。原因与现在一样：输出 alpha 小于 1，要按 `(ONE, ONE_MINUS_SRC_ALPHA)` 叠在上一帧上，老墨才会越压越深 |
| 旧 `Graphics` 画进带 MSAA 的 `stamp` → 全屏三角形或笔画矩形上的 SDF 线段 / 圆头四边形，画进 `stamp` 目标。线段光栅化与 inkEngine 原版不逐像素相同，这是已知差异，记在 [第 12 章](../docs/12-inkengine-parity-audit.md) |
| 每个 pass 一张铺在笔画外接矩形上的精灵 | 视口或 scissor 限制在外接矩形（加 3 px，墨效 4/5 再外扩）。不要每帧对整张 1280×720 跑 feedback |
| ~~`ink-stage.ts` 的 Pixi `Application`~~ | 已删除；切片与叙事都走 `InkView` / `StoryStage` |

pass 顺序不改：[第 7 章](../docs/07-ink-rendering.md) 的按下、逐帧出笔、一次 feedback、提笔后 `maxUpdates` 次力度递减、然后 encode → typeMap → composite。实时湿墨仍走 realtime。flow、distort、metallic 仍是提交之后的 `InkFinish`，同时也可以被 `EffectCue` 触发。

纸纹：`inkPaperPixels` 的 `Uint8Array` 上传为 `DataTexture`。中间缓冲不做额外的 sRGB 往返；只有最后上屏的那一张按画布输出。three.js 从某个版本起会给纹理套色彩空间，实现时对照 `/compare/` 的一笔，确认没有被伽马再处理一次。这一步还没有实测。

坐标：原 Pixi 版本用 `inkFragCoord()` 把上左原点翻成 inkEngine 的下左原点。three.js 渲染目标方向不同，`InkSurface` 已按现行实现处理翻折；真实 GPU 的最终取向仍未实测。

力场 `mapFrag`、着色器里的 `sin` / `pow` 只影响画面，不回读去改刚体。水刷 `wash` 若擦的是墨桥，仍先改 `Playfield` 里的刚体，再淡化墨面。这一点和现行水刷相同，也是历史游戏「治水」模板要保住的行为。

`EffectComposer` 不拿来跑墨的 ping-pong。它适合最后的遮罩、淡入和可选的景深。山石勾边不用 `OutlinePass`（见 §4.2）。

### 3.3 明确不在这一轮搬的东西

- WebGPU 和 TSL。现有着色器是 GLSL 300 ES，先留在 `WebGLRenderer` 上。
- 把 `ink-engine.js` 嵌进页面。
- 逐像素复刻 inkEngine。构图和笔性对齐即可。
- `InkFluid` 的纳维–斯托克斯场。它仍只服务 `/inkcross/`。

## 4. 三个新效果

三套效果都是画面。脚落在哪里、竹从哪一节断开，由 Matter 和命中检测决定。GPU 上的渗流、噪声和正弦摆动不回读成碰撞。

### 4.1 三维水墨洇染与留白

地形网格用 `BufferGeometry`。碰撞是沿剖面的折线刚体（旋转矩形或 `Bodies.fromVertices`），网格在 Z 上的凹凸不参与 Matter。

数据流：

```text
Playfield 碰撞（角色 × 地面）
  → 最多 8 个接触：像素 xy、指向角色的法线、接近速度
  → 用地形 UV（关卡把世界 x 铺到 u，沿表面的高度铺到 v）
  → 写入一条 DataTexture（每个接触：u、v、墨量、水量）
  → 盖章 pass：往 InkSurface 的洇染目标里 max 上一团水墨
  → 渗流 pass：读烘焙的高度和法线
       坡越陡，沿下坡方向移得越快
       平地上只慢慢洇
       新墨与邻域做 min()，和 feedback 一样保留更深的墨
  → 地形材质采样这张纹理
       墨少的地方留白（纸色）
       墨多的地方是浓淡，凹处更暗
```

高度和法线有两条生成路径，公式相同：

- 切片和单测走 CPU：读顶点位置，按 UV 栅格化进一张 `DataTexture`（R 高度，G/B 法线的屏幕分量）。vitest 可以哈希这张表，不创建 WebGL。
- 运行时可以再做一次 GPU 烘焙：用同一套顶点着色把高度和法线画进 UV 空间的渲染目标。网格不变就只烘焙一次。

渗流目标建议 512×256，每显示帧盖章一次、渗流一次。预算放到 §9，数字是目标，未实测。

留白：地形材质从纸色出发，不使用 `MeshStandardMaterial`，也没有默认的三点布光。没有墨的像素保持 `INK_STAGE_PAPER`。这样近景不会变成一块灰色的三维塑料。

后退：渗流 pass 关掉时，只在接触 UV 上盖一枚圆章，相当于现在蹄下的墨点，仍能看出踩过。

`effects.inkDisperse` 和角色脚步走同一个盖章入口。过场里的马蹄、行军用 `EffectCue.kind = 'inkDisperse'`，不必真的生成一个 Matter 角色。这是 video/docs/engine-gaps 的 G-16，优先级 P1。引擎切片里先接上脚步。

### 4.2 毛笔皴法与动态勾边

山石由 `createCunRock` 画两次：本体和外壳。材质是 `ShaderMaterial`（GLSL3），平移后的网格走 three.js 的模型矩阵。墨水 pass 仍是 `RawShaderMaterial`。

本体片元里的皴：

- 披麻皴：沿下坡方向拉长的噪声带，像顺着山势披下来的麻丝。
- 斧劈皴：更高频、斜向、被第二层噪声切断的短笔，像斧头砍出的面。
- 每个网格一个 uniform，0 是披麻，1 是斧劈。

勾边外壳：`side = BackSide`，顶点沿法线挤出。挤出宽度由相机到该点的距离决定：拉近时更粗（顿、徐），拉远时更细（疾）。再乘一层噪声，让边缘发毛、有断口（挫），而不是一根均匀的矢量线。噪声在网格本地坐标上取样，种子来自网格 id，同一镜头下石头不会自己爬动。

噪声用 Stefan Gustavson 的 classic Perlin GLSL（[stegu/webgl-noise](https://github.com/stegu/webgl-noise)，MIT），已放在 `src/core/classic-noise.ts` 并写入 [第三方清单](../THIRD_PARTY_NOTICES.md)。现行 `ink-noise.ts` 是值噪声，留在 CPU 侧，不拿它冒充 Perlin。

`OutlinePass` 是全屏边缘检测，边缘干净，`patternTexture` 也不是笔毛。山石不用它。以后若要给 UI 选中物体描一圈，可以再评估。

后退：外壳宽度改成常数，噪声关掉，只留一层淡淡的边缘。皴法退成按法线分档的深浅。

权威碰撞仍是石头剖面的刚体。外壳挤出不改变 Matter。

### 4.3 泼墨破竹

一节竹是一根网格，顶点带节号。风的摆动在顶点着色器里：振幅随高度增加，相位来自种子。时间用显示时钟。这是摆动的手感，不是软体求解器，也不进 Matter。

砍断在 CPU：

1. 武器扫掠打到某一节（`Combat`，不是读像素）。
2. 状态从完整到已断。每节只断一次。
3. Matter：原刚体换成根部静态体加上段动态体。上段的多边形用断开处以上的剖面。冲量用 `bambooBreak` 的 `impulse`，速度封顶。
4. 显示：上段顶点乘上段刚体的插值姿态。断口附近沿法线撕开，透明度交给粒子。

粒子用 `Points`，上限 256。初速度由种子随机数在 CPU 上生成，之后在着色器里按重力积分，只活几十帧。粒子不写回地面洇染，也不进 Matter。墨滴的样子用一张预先画好的墨点纹理（`InkSurface` 上的一笔 gothic 或 dots），不给每个墨滴跑 feedback。

`effects.bambooBreak(id, impulse)` 就是上面的第 2–4 步。过场可以不经过武器扫掠直接调它（G-16，P1）。

人物骨骼是另一件事（video/docs/engine-gaps G-13，P1）。竹的切片用顶点位移，不先上 `Skeleton`。若所有者希望断口沿真实的骨来弯，再把 `BambooRig` 换成 `SkinnedMesh`，接口 `bambooBreak` 不变。

后退：不撕网格，换成两段预先分开的模型，断口上仍用现行哥特笔在墨面泼一笔。

## 5. 横版动作

这些规则都在 `Playfield` 的固定步里，读的是刚体，不是画面。

**坡。** 地面是静态折线或旋转矩形。每步在角色的碰撞里取指向角色、且最朝「屏幕向上」的那条法线。屏幕向上是 `(0, -1)`。法线与它的夹角小于阈值（建议约 50°）则算可走，水平速度沿切线投影。不要在着地时把竖直速度清零，否则上不了坡。陡于阈值的接触当墙，消掉朝墙里的速度分量。摩擦用刚体自己的 `friction`。

**跳。** 只有可走法线存在时 `jump` 才改速度。Y 向下的世界里，起跳是负的竖直速度，数先沿用现行的 −12（像素/步）。

**单向平台。** Matter 没有单向碰撞。类别位：地面、单向平台、角色分开。步初看上一帧脚底是否已经在平台顶面之上（Y 向下时，脚底的 y 更小）。在上面就让角色的 mask 包含平台，否则去掉。这样不会在身子还插在平台里时被求解器抬上去（[matter-js#456](https://github.com/liabru/matter-js/issues/456)、[matter-js#1029](https://github.com/liabru/matter-js/issues/1029)）。下穿：下加跳，临时去掉 mask 若干步。

**击退。** `hurt` 把速度设到封顶以内的值，并锁住移动输入若干固定步（现行是 22 步，先沿用）。不用无上限的力。

**命中。** 攻击窗口内用 `Matter.Query` 的射线或区域沿武器线段查询。每个目标 id 只命中一次。剑扫距离、枪的点到线段，这些现行几何判断留在十卡里，新关不继续加。

**可砍。** 目标带节号和「已断」标记。命中后走 `bambooBreak`。根部留下，上段成为新刚体。

水刷裁桥的规则留在 CPU 几何里，和现在的 `eraseBridge` 一样：先改矩形刚体，再 `InkSurface.wash`。

## 6. 和 video/docs/engine-gaps 的衔接

| 主题 | 本文 | video/docs/engine-gaps |
|---|---|---|
| 墨面 | `InkSurface`，平面或地形纹理 | G-01，P0，历史垂直切片的前提 |
| 场景 / 剧情 / 过场 / 录制 / 声音 / 字幕 / 存档 / UI | 模块名和 API 草案与 G-02..G-07、G-09、G-10 相同，本文不另写故事流程 | 那些缺口的优先级和荆轲开场的验收以 video/docs/engine-gaps 为准 |
| 三项画面 | §4 是技术设计。脚步洇染、皴法、断竹在引擎切片里就要看得见 | 叙事触发 `inkDisperse` / `bambooBreak` 是 G-16，P1，不挡住战国三幕 |
| 开场 18–35 秒、上下文不重建 | 见 §10 结转。过场侧的对策是 G-08 关键帧和 G-19 | 引用的就是这两条事实 |
| 时钟 | 玩法固定步 + 过场帧时钟，过场时物理暂停 | §2.2 的帧时钟、同步点、追步 |
| 层 Z | 像素视差，−80 / 0 / 40 / 120 | 过场 `layers[].z` 直接用这些数 |
| 工作量的人周 | 本文不估日历 | video/docs/engine-gaps 表格里的人周仍以那份草案为准 |

历史游戏的 M1（完璧归赵、窃符救赵、易水寒）可以在 `InkSurface` 能按帧画画、`CutscenePlayer` 能跑通一条轨道之后开始。引擎自己的垂直切片更早：一条能走的坡、地面上的墨、两块皴法石头、一竿可砍的竹。两件事共用 `InkView` 和 `InkSurface`，不共用验收标准。史实、旁白和史评的验收只写在 video/docs/engine-gaps。

## 7. 从 PixiJS 迁走（2026-10-09 已完成）

**迁移已结束，且比原计划更彻底**：不是保留 Pixi 十卡，而是把 Pixi / p5 / 原生 WebGL2 整条旧栈从 `src/`、`apps/` 和依赖中删除。当前 `package.json` 只剩 `three@0.186.1` 与 `matter-js@0.20.0`。

### 留下（three.js 路径继续使用）

- 与渲染库无关的 CPU 层：`InkBrushEngine`（`ink-brush.ts`）、`ink-random`、`ink-palette`、`ink-paper`、`ink-metallic`、`ink-raster`、`ink-camera`（距离/层深常数）、`classic-noise`。
- inkEngine 的片元文本：`ink-shaders.ts`（归属注释保留），由 `InkSurface` 通过 `RawShaderMaterial` 使用；`ink-pass.ts` 是它的 three.js 宿主。
- 物理与玩法：`playfield.ts`、`ink-world.ts`、`body-link.ts`、`slope.ts`。
- 三项画面：`terrain-seep.ts`、`cun-material.ts`、`bamboo-rig.ts`、`terrain-field.ts`。
- 叙事宿主：`scene-director.ts`、`story-runtime.ts`、`cutscene-player.ts`、`audio-bus.ts`、`ink-text.ts`、`save-store.ts`、`story-stage.ts`、`content-catalog.ts`、`narrative-types.ts`、`stroke-cues.ts`、`fixed-clock.ts`。
- 道具笔画预设：`plugins/prop-brushes.ts`、`plugins/prop-paintings.ts`；`plugins/items.ts` 保留为道具元数据。

### 已删除（Pixi / p5 / 原生 WebGL2）

| 文件 | 原因 |
|---|---|
| `core/ink-stage.ts`、`core/ink-wash.ts`、`core/ink-wash-filters.ts` | Pixi 舞台与 Pixi 滤镜；three.js 版由 `InkSurface` / `InkScene` 取代 |
| `plugins/p5-host.ts` | p5 宿主，p5 已不依赖 |
| `plugins/gl-state.ts`、`plugins/renderer-webgl2.ts`、`plugins/scene-renderer.ts`、`plugins/canvas-surface.ts` | 原生 WebGL2 / Canvas2D 渲染插件与 `withGLState` |
| `plugins/ink-fluid.ts`、`plugins/ink-fluid-plugin.ts` | 只服务 `/inkcross/` 的 NS 场 |
| `plugins/inkcross.ts`、`plugins/scene-json.ts`、`plugins/world.ts` | 旧微内核插件与 v0.1 场景 JSON |
| `core/engine.ts`、`core/types.ts`、`core/plugin-graph.ts`、`plugins/tokens.ts`、`plugins/brush-model.ts`、`plugins/geometry.ts`、`plugins/physics.ts` | p5 时代的微内核、服务 token、画笔模型、侵蚀与物理插件、v0.1 命令录制 |
| `apps/sword`…`apps/boat` 十卡、`apps/inkcross`、`apps/wuxia`、`apps/compare`、`apps/main.ts`、`apps/demo.ts` | 旧舞台页面；首页改为三条 three.js 入口的导航 |
| `tests/core-loop`、`core-plugins`、`game`、`water-erosion`、`v2-core`、`fixtures/`、`helpers/` | 只对已删模块有意义 |

`ink-wash.ts` 里的共享笔画类型（`InkColor`、`InkFinish`、`InkStrokeRequest`、`inkPointerPath`）已移到新的 `core/ink-stroke.ts`，因为 `InkSurface`、`InkScene`、`StoryStage` 与道具表都依赖它们，不能继续挂在 Pixi 模块上。

### 步骤（全部完成）

1. [x] 文档。
2. [x] `InkView` + `Playfield` + 一条坡，`apps/scroll/`。
3. [x] `InkSurface` 跑通现行笔画。
4. [x] 地面洇染、斧劈/披麻、一竿竹。
5. [x] 单向平台、击退、扫掠、砍断。
6. [x] `SceneDirector`、`AudioBus`、`InkText`、`CutscenePlayer`、`SaveStore`（录制回放仍未做）。
7. [x] 首页改为入口导航；删掉 Pixi 十卡。

## 8. 里程碑

- [x] **M0 文档。** 本计划、docs 里的切片说明、与 video/docs/engine-gaps 的模块名对齐。所有者已按 §11 逐条确认（2026-10-09）。
- [x] **M1 能走的坡。** `InkView`、透视侧视、`Playfield` 固定步和插值、角色圆、折线地面。`tests/playfield.test.ts` 不创建 GL。
- [x] **M2 墨面。** `InkSurface` 提供 `paint` / `update` / `texture`。过场播放器接在 M5。
- [x] **M3 三样画面。** `TerrainSeep`（512×256）、`createCunRock` 勾边、`BambooView` 墨滴。SwiftShader 截图见 `node scripts/gpu-check.mjs --shots`。真实 GPU 未实测。
- [x] **M4 动作补全。** 单向平台、击退、扫掠、可砍。`InkView.washAt` 先 `washBridge` 再 `InkSurface.wash`。演示页 `apps/scroll/`。
- [~] **M5 叙事宿主。** `SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`AudioBus`、`InkText`、`SaveStore`、`StoryStage` 已从 `src/index.ts` 导出。`apps/story/` 只读荆轲样例：正史开场按帧时钟走，Canvas 字幕画出「易水寒」，选择处可进正史或野史，检查点可 `resume`。`PostStack` 没有类；flow / distort / metallic / wash / fade 由 `StoryStage` 写到墨面或淡出平面，遮罩是画布暗角。玩法节点只显示目标并等待继续。配音文件不在仓库里，`AudioBus` 用振荡器占位。景深、录制回放、video/docs/engine-gaps M1 的三场景通关、两次播放末帧逐像素一致、独显帧时都未做。CPU 证据是 `tests/narrative.test.ts`。无头截图只证明着色器能编过。

坡度行走、击退和扫掠写在 `Playfield` 上，没有单独的 `ActorController` 或 `Combat` 类。竹的显示类名是 `BambooView`。`InkView` 与 `StoryStage` 在 `webglcontextrestored` 后重建渲染目标并从丢失前的 `snapshot` 贴回；`InkScene`（`apps/history/`）目前不重建。真实 GPU 未实测。

### M5 子项状态（2026-10-09 按代码核对）

`M5` 整体保持 `[~]`，因为它包含未完成的玩法与性能项。逐项如下：

| 子项 | 状态 | 证据 |
|---|---|---|
| 场景与剧情运行时（`SceneDirector` / `StoryRuntime` / `content-catalog`） | 完成 | `tests/narrative.test.ts`：21 章解析、分支、`resume` |
| 过场播放器六轨与帧时钟 | 完成 | `tests/cutscene-pulses.test.ts`、`tests/frame-clock.test.ts` |
| live 笔画参数 / 并发 / 收笔 | 完成 | 同上；`StoryStage.rejectedPulses` 暴露拒绝计数 |
| 字幕与题字（Canvas 纹理） | 完成（CPU 断言） | `tests/narrative.test.ts` 断言第 140 帧出现「易水寒」文本；`/story/?pose=title` 截图只证明页面能渲染，未逐像素核对字形 |
| 存档与检查点 | 完成 | `tests/narrative.test.ts` 的 `resume()` 断言 |
| 过场效果（flow / distort / metallic / wash / fade） | 完成 | `StoryStage` 写到墨面；`impulses` 一次性漫水 |
| 短镜头跳过与顺播等价 | 未完成 | `fastForward` 不重建中间效果；需 G-08 安全点重放 |
| `PostStack` 类与景深 | 未完成 | 无类；`dof` 键只被解析，没有散景 pass |
| 2.0 录制回放（`inkgames.ink-recording`） | 未完成 | `recording.ts` 已删；`recording` 来源返回空笔画 |
| 真实配音 / BGM | 未完成 | `AudioBus` 仍用振荡器，无 `decodeAudioData` |
| 玩法模板（对决等） | 部分 | `defineGameplay` 把模板映成动词和「标签：目标」；叙事节点仍点继续，不模拟决斗。道具页单独演示砍、落、燃、流 |
| 两次播放末帧逐像素一致 | 未完成 | 现只覆盖三段式路径的确定性回归 |

## 9. 验收

引擎切片（M1–M4）以后要满足：

**vitest（不创建 WebGL）**

- 刚体 xy 原样进入 `BodyLink`，z 保持层深。
- alpha 为 0 和 1 时位置贴齐 previous / current；追步封顶时 alpha 为 1。
- 站在斜面上被标成可走；过陡的接触被标成墙。
- 从下方经过单向平台时 mask 不含平台；从上方落下时含有。
- 击退后速度在封顶内，锁定步数内移动输入不改速度。
- 竹从完整到已断，刚体从一个变成根部加上段。
- 接触点变成 UV 盖章列表。高度纹理能从顶点哈希，重复计算一致。
- 现有 `tests/ink-brush.test.ts`、`tests/prop-brushes.test.ts`、`tests/narrative.test.ts` 继续通过。（`v2-core` / `game` / `core-loop` / `core-plugins` / `water-erosion` 随旧栈删除，见 §7。）

**浏览器**

- 新页面有画布、没有未捕获异常。
- Playwright 截一张：人在坡上、地面有墨、石头有边缘、竹在断开前后各一张。SwiftShader 只证明着色器能编过、没有 GL 错误。
- 同一台机器、同一个浏览器上，固定种子的一笔 `InkSurface` 连截两次，用于回归。不把 SwiftShader 的像素当成和 inkEngine 逐像素相同。**已按可验证形式落地**：`scripts/browser-smoke.mjs` 在 `/history/` 上调用 `window.__historyHash(frame)`，判定「连续两次渲染同一帧逐字节一致、不同帧必须不同」；2026-10-09 实测通过（同帧 3603028584，异帧 2396843167）。这是三段式渲染路径的确定性回归，仍未覆盖 `InkSurface` 反馈的逐像素一致性。

**性能（真实 GPU，未做之前一律写未实测）**

- 目标帧 16.6 ms。过场墨面每帧计算沿用 video/docs/engine-gaps G-21 的目标：≤ 8 ms。
- 洇染两张 pass，分辨率 512×256。山石每个多一次外壳绘制。粒子 ≤ 256。
- Safari、Firefox、手机不在切片的通过条件里。

历史开场「五个镜头末帧逐像素一致」只约束过场帧时钟下的 `InkSurface`，写在 video/docs/engine-gaps 的 M1。渗流和勾边噪声不纳入那条逐像素条款。

## 10. 风险与结转

| 风险 | 应对 |
|---|---|
| Y 向下和 three.js 的习惯相反，`camera.up` 会让部分控件不好用 | 切片不用 OrbitControls。若所有者改选 Y 向上，只改 `Playfield` 到网格的那一个写入函数，笔刷点在边界上翻转 |
| 透视下 z ≠ 0 的网格看起来比碰撞体更宽 | 玩法轮廓以刚体为准。网格的 Z 起伏是厚度，不是加宽碰撞 |
| 色彩空间把墨洗淡或洗灰 | 中间目标线性写入，上屏再对照一笔 |
| 片元 Y 翻折在无头与真机可能不一致 | 单测锁 CPU 笔触；真实 GPU 未实测 |
| 开场笔数多，SwiftShader 首次绘制慢 | 分帧绘制（实现中每次绘制让出一帧）、`snapshot` 关键帧（G-08）。真实 GPU 未测 |
| 上下文丢失 | `InkView` / `StoryStage` 在恢复时重建渲染目标并贴回最近的 `snapshot`；`InkScene`/`apps/history` **不重建**。无头路径用 `WEBGL_lose_context`。真实 GPU 与跨章节存档回放未实测（G-19） |
| 3D 场景看起来像默认示例，不像水墨 | 纸色底、无 PBR、墨面 multiply 到纸上。皴和勾边失败时退回 §4 的后退路径 |
| Matter 跨版本不是逐位确定 | 玩法回放锁 matter-js 0.20.0。不承诺跨浏览器逐位相同 |
| 过场帧时钟和玩法固定步互相多推墨 | `SceneDirector` 同一时刻只跑一个时钟 |

从已删除的 Pixi 计划结转、且动画工作仍在引用的事实（Pixi 专有项已随 §7 清理，不再适用）：

- 无头 Chromium + SwiftShader 不能代替独立显卡，也不能代替 Safari / Firefox。
- 遮罩、景深、EasyCam 的 1.1 倍变焦在 three.js 路径上仍缺。过场侧对应 G-12、G-11。
- 2.0 笔画还没有录制格式。新格式就是 G-04 的 `inkgames.ink-recording`。
- 玩法命中仍是几何距离，不是扫掠体；扫掠体是 G-14 的待办。

已作废、不再作为待办：

- ~~Pixi `InkStage` 上下文丢失只暂停~~ —— `InkStage` 已删除。
- ~~十卡开场 18–35 秒~~ —— 十卡已删除；当前开场性能以 `apps/history/` 的 `InkScene` 为准，仍未实测真实 GPU。

## 11. 所有者确认（2026-10-09）

下列 18 条均按建议采纳。实现以这里为准，不再并列备选。

1. **坐标。已确认。** 像素、Y 向下、`camera.up = (0, -1, 0)`，刚体 xy 原样写入 `position`。层 Z 用 −80 / 0 / 40 / 120。实现时 `lookAt` 会镜像 X，`CameraRig` 用 `camera.scale.x = -1` 把世界 +x 放回画面右侧，见 §1.2。
2. **镜头。已确认。** 默认透视，变焦改距离，`zoom` 1.1 表示拉近。正交只做调试。
3. **角色体。已确认。** 切片用不会旋转的圆。胶囊留到人物骨架（G-13）。
4. **可走坡。已确认。** 法线与屏幕向上的夹角小于约 50° 算可走。比较用点积和常数 `cos(50°)`，不在碰撞代码里调用 `Math.cos`。
5. **单向平台。已确认。** 用上一帧脚底是否已在平台之上，而不是只看速度。
6. **击退。已确认。** 直接设速度并封顶，锁输入。锁定步数用现行的 22。
7. **地形碰撞。已确认。** 手写折线刚体。网格的 Z 向起伏不进 Matter。
8. **洇染。已确认。** 512×256，每帧盖章加渗流。渗流允许不同 GPU 不一样，不参与碰撞，也不参与过场逐像素验收。
9. **勾边。已确认。** 外壳挤出加 Perlin 毛边。拉近更粗，拉远更细。山石不用 `OutlinePass`。
10. **噪声实现。已确认。** 移植 [stegu/webgl-noise](https://github.com/stegu/webgl-noise) 的 classic Perlin（MIT），并登记许可。
11. **竹。已确认。** 顶点着色器摆动；上段进 Matter；墨滴不写回地面。`Skeleton` 留给以后的人物。
12. **十卡。已变更（2026-10-09）。** 原决定是迁移完成前保持 Pixi 可玩；所有者随后要求彻底清理 Pixi/p5/原生 WebGL2，十卡页面已删除，首页改为三条 three.js 入口导航。
13. **three.js 用法。已确认。** `WebGLRenderer` + `RawShaderMaterial` + GLSL3。不用 WebGPU / TSL。版本锁定为 2026-10-09 查询到的 npm latest **0.186.1**。
14. **两套时钟。已确认。** 玩法固定步带插值；过场用帧时钟并且不跳笔；过场期间物理暂停。确认当时过场播放器还没写。随后 `CutscenePlayer` 按帧推进，`StoryStage` 播过场时不调用 `Playfield`。跳过会把实时笔画收成一次 `paint`。
15. **两条切片。已确认。** 引擎切片包含坡、洇染、皴法、断竹。历史游戏 M1 等 `InkSurface` 可用再开始，G-16 的叙事触发保持 P1。
16. **字幕。已确认。** P0 用 Canvas 纹理，不引入 troika-three-text 或其它文字依赖。`InkText` 已在 `/story/` 的过场里画标题和旁白，关卡页 `/scroll/` 仍没有字幕。
17. **模块名。已确认。** 与 video/docs/engine-gaps 对齐为 `InkSurface`、`CameraRig`、`SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`AudioBus`、`InkText`、`SaveStore`、`PostStack`。
18. **真实 GPU。已确认。** 由所有者在自己的 Mac（Apple Silicon，Chrome）上验收。在那之前文档保持「未实测」。仓库提供一条本地命令 `node scripts/gpu-check.mjs`：无头时只证明着色器能编过、没有 GL 错误；真实 GPU 的画面以所有者那次为准。


## 历史动画进展（2026-10-09）

新增 `InkScene`（`src/core/ink-scene.ts`，已从 `src/index.ts` 导出）：用真实 `InkSurface.paint` 把原创笔画画到透明墨面分件，支持位置/旋转/缩放/透明度与幂等释放，不加载图片。`apps/history/` 以 30 fps 展示纯程序「混沌开卷」五幕并保留原字幕。

它是独立预演：未接入 `StoryStage` / `CutscenePlayer` 轨道，墨层为预绘制结果、播放中无逐帧新反馈，天裂用墨线淡出而非遮罩，关节为刚性分件旋转，上下文丢失不重建，也无真实音频。真实 GPU 观感与性能未实测。

图片显影用的 `InkAnimation` 仍导出，但不是现行历史动画方向，`/history/` 已不再调用。计划与状态见 [历史动画专项](../video/docs/production-plan.md) 与 [缺口 §6](../video/docs/engine-gaps.md#6-纯引擎水墨动画实现方案2026-10-09-重新评估)。M0–M5 状态不变：`PostStack`、景深、录制、玩法模板仍开着。
