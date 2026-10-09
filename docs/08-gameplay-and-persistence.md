# 08 · 玩法与录制

[目录](./README.md) · [上一章](./07-ink-rendering.md) · [下一章](./09-tooling-and-quality.md)

> 本章正文描述**现行代码**。文末「计划（未实现）」是 three.js + Matter.js 的目标，类还没有导出，不能当调用示例。

十卡是同一张 1280×720 的纸，加上各自的一句交互。画面上所有东西都由 [第 7 章](./07-ink-rendering.md) 的 inkEngine 笔刷一笔一笔画出来，笔刷取自一张表。刚体仍然是圆和矩形，只决定碰撞，不决定长相。

## 道具怎么画

`src/plugins/prop-brushes.ts` 的 `PROP_BRUSHES` 是唯一的笔刷表：每个道具（以及水面、远山、人物）按部件列出一行，内容就是在 inkEngine/index.html 面板上要选的东西，加上画师的手。

| 列 | 含义 |
|---|---|
| `mode` / `size` / `effect` / `blend` / `color` | 笔刷、尺寸、墨效、混色、颜色，取值见第 7 章 |
| `pressure` | 笔压 0..1，即含墨量。第 8 帧起 ≥ 0.3 升一档尺寸，≥ 0.5 两档，≥ 0.7 三档。省略表示鼠标 |
| `speed` | 每帧指针走多少像素。越快越细、越干，飞白越多 |
| `finish` | 可选。`flow` / `distort` / `metallic`，这一笔提交后跑。见第 7 章 |

湿、干、渗由这几列组合出来：`wet` / `effect4` 湿而洇，`flyingWhite` 加快速运笔是枯笔飞白，`mix` 是常规扩散。inkEngine 每笔都把内渗强度固定为 0.45，所以表里没有这一列。

`src/plugins/prop-paintings.ts` 只放路径：每个部件一条或几条手势（折线、二次或三次曲线、弧、波），`paintProp(id, { x, y, scale, mirror, pose, variant, width })` 按该部件的 `speed` 把路径采成每帧一个指针点（落笔和提笔时放慢），配上表里的笔刷和由道具、部件、序号算出的种子，返回 `PropStroke[]`。`scale < 1` 时笔刷尺寸换成按比例缩小的数值，手速同比放慢。`scale < 0.75` 时丢掉 `finish`：虫蚀和 flow 的半径是纸上的像素，缩小的手持件会被咬痕盖满。`actionStroke(id, part, path)` 画一笔动作（挥击、溅墨、尾迹）。

各道具的主笔刷（完整的表在源码里）：

| 道具 | 部件与笔刷 |
|---|---|
| 剑 | 刃：大笔 medium、湿墨、`sage_gray`（钢灰），提交后走 metallic（虫蚀，尺寸 14）；两刃口：大笔 ultra-small、飞白、黑、每帧 15px；脊：速写 small、锐化；格：大笔 medium 黑；柄：小笔 small `terra_cotta`；剑首：小号重按；穗：brushSP 湿墨红 |
| 刀 | 刀身：大笔 large 湿墨 `sage_gray`，metallic 尺寸 16；刃口：飞白刷 small 黑；刀背：ultra-small 锐化；刀盘、缠柄 `wine_red`；场上两摊色墨：大笔 extra-large 湿墨 `blue` / `red` |
| 枪 | 杆：大笔 medium `terra_cotta` 一笔到底；枪头：大笔 medium 黑三笔成叶，每笔 metallic 尺寸 12；枪缨：大笔 medium 湿墨红、笔压 0.5 |
| 弓 | 弓臂：大笔 medium `brown`（赭）两道弧；弓梢、弦：细锐化黑；握把：小笔；箭：细杆、锐化箭头、飞白 `wine_red` 箭羽 |
| 盾 | 盾面：大笔 huge 湿墨 `gray_brown` 成片铺开；盾缘：大笔 medium 黑三笔；盾钮：large 重按；纹章：small 湿墨红；铆钉：点画 |
| 战马 | 身：大笔 large 黑、笔压 0.4（第 8 帧起升到 3）六笔泼成一团；颈、头：large / medium 重按；外晕：extra-large `effect4` 浅灰；四腿：small 每帧 6px 干笔；鬃：brushSP；尾：飞白刷 medium |
| 旗 | 旗面：大笔 extra-large 湿墨红四行；洇边：large `effect4` 红；折痕、旗边：ultra-small `wine_red`；杆：small 飞白干笔；飘带：brushSP 红 |
| 墨弹 | 罐腹：大笔 large 湿墨黑、笔压 0.4 两圈；肩、颈、口：large / medium；塞：小笔 `terra_cotta`；釉光：飞白刷白墨；引信：small；火星：哥特红。落地：哥特 large 湿墨黑 + extra-large `effect4` 黑 |
| 水刷 | 杆：大笔 medium `terra_cotta`；箍：小笔 medium 黑；笔毫：brushSP large 湿墨 `blue`；水滴：点画 |
| 舟 | 船身：大笔 extra-large 湿墨 `light_gray_new`；船底、舷、篷骨、桨、艄公：ultra-small 细线；篷：large 湿墨 `gray_brown`；尾迹：飞白刷 |
| 水面 | 水面：大笔 extra-large `effect4` 淡青（`dusty_rose`）洇开，提交后 flow（blend 0，4 次迭代）；水流：飞白刷 extra-large `light_gray_new` 横向长笔；水色：extra-large 湿墨淡青；深处：extra-large 湿墨灰，再按该笔矩形做 distort（B 20、C 50）；浪花：飞白刷 small 白墨；涟漪：ultra-small `sage_gray` |

对照页 `/compare/?prop=<id>` 把同一道具画在 640×480 的纸上，与 inkEngine 宿主页并排，见 [第 12 章](./12-inkengine-parity-audit.md)。

## 舞台上的分层

`InkStage`（`src/core/ink-stage.ts`）开场画三类东西：

1. 远山：透明墨层，z = −80，绕画面中心缩小，相机一动它跟得比纸少。
2. 纸层（z = 0，不缩放，`INK_STAGE_PAPER` 底色，纸是它 ×1.1）：近山、地面，河（舟、水刷两页），本页道具的大图（剑、刀、枪、弓、盾、墨罐、水刷），以及木桩、草靶、箭靶、色墨、锁定桥。之后不再改动。屏幕位置是世界坐标减去相机偏移，所以点击和碰撞仍用 1280×720 的世界坐标。
3. 可擦层：同样 z = 0。透明墨层，`multiply` 叠在纸上。可擦桥和所有动作笔画写在这里。重播和重置只清这一层再补画可擦桥。
4. 精灵：z = 40，绕落点放大（人物的脚、马蹄、舟的龙骨、旗杆根；箭和墨罐绕刚体中心）。人物有站立和出手两种姿势；马有两种步态，跑起来交替；三幅旗对应西风、无风、东风；舟随行进平移；手持件是本页道具缩小约三分之一，握点跟着身体的缩放走；飞行中的箭按速度方向旋转（用速度的单位向量组矩阵，不调 `atan2`），墨罐不旋转。

相机以每帧 5% 的比例把画面中心拉向角色，偏移限制在 48×36 px 以内。纸层因此仍盖住几乎整个画面。

## 每页的交互

| 页 | 动作 | 实际发生的事 |
|---|---|---|
| 剑 `sword` | `swing` | 拖动用剑的 `slash` 笔刷写飞白。空格或按钮挥一道飞白弧。弧上有点距木桩 `(900, 540)` 小于 56 才在桩上用哥特笔泼墨。挥空没有泼墨。 |
| 刀 `blade` | `swing` | 拖动是刀的湿墨大笔。挥刀那一笔扫过青、朱两摊色墨，叠处按 encode 着色器混色压暗。 |
| 枪 `spear` | `thrust` | 点击定落点，飞白刷直线刺出。三个草靶只在第一次被线段擦到（距离 < 28）时用哥特笔溅红，并标 `hit`。 |
| 弓 `bow` | `projectile` | 点击是瞄准点。飞行中是箭形精灵。撞上箭靶或地面后，在落点按飞行方向画一支扎住的箭和一蓬溅墨。 |
| 盾 `shield` | `guard` | 约 30 步后从右侧飞来一支箭（镜像的箭精灵）。距离 ≥ 120 时空格无效。贴身格挡时箭消失，在盾前用哥特笔碎成一蓬墨。没格开会 `hurt()`，人物泛红。 |
| 马 `war-horse` | `gallop` | 空格切换奔跑。马的两种步态精灵交替、向右平移，每 14 步在蹄下用哥特笔扬一蓬尘。停下不再添新尘。 |
| 旗 `banner` | `wind` | 风向在东、西、停之间转，换成对应的一幅旗。有风时每 24 步在天上写一条飞白墨丝。 |
| 墨弹 `ink-bomb` | `blast` | 场上是一只墨罐。抛出的是缩小的罐子精灵。命中后浓墨用 `effect4` 洇开，再用哥特笔炸开。未命中不伪造爆炸。 |
| 水刷 `water-brush` | `erase` | 下半张是河，岸上画着一支水笔。拖动同时裁刚体和洗淡可擦层。右侧桥画在纸层上、刚体锁定，洗不掉。 |
| 舟 `boat` | `wake` | 舟在河上。空格开停。走动时每 16 步在船尾写一道飞白水纹。停下不再添。 |

没有伤害数值、连击或关卡切换。状态文字来自 `onStatus`，页面把它写进 `#status`。

## 录制

`createRecorder`、`createReplay`、`parseRecording`（`src/plugins/recording.ts`）记录的是 v0.1 的命令流，给 `Engine` 用。`InkStage` 没有把按键和笔画写成同一份 JSON，也不能重放 inkEngine 的 `mp` / `md` / `mr`。

要复现一条 2.0 笔画，保存它的 `PropStroke`（笔刷、颜色、每帧的点、种子）再交给 `InkWash.paint`。同一种子在 inkEngine 里对应 `p.randomSeed(seed)` 后的同一笔。`tests/ink-brush.test.ts` 锁的是笔触数据，不锁 GPU 图像。

## 计划（未实现）

引擎垂直切片是单独的一关，不是改写这十张卡：一个能走上坡的角色、会洇墨的地形、一块斧劈皴和一块披麻皴的石头、一竿可以砍断的竹。十卡在迁移完成前保持现在的玩法。首页仍是十张卡，直到这条切片能玩再决定要不要换入口。

录制的新格式是 `inkgames.ink-recording` 版本 2，事件种类与 inkEngine 的 `mp` / `md` / `mr` / `flow` / `ec` / `mask` 对齐，并能把旧录制导进来。这是 [plan/12](../plan/12-history-game-engine-gaps.md) 的 G-04。现行 `recording.ts` 继续只服务 v0.1。

开场动画、旁白、字幕、存档和剧情图是历史游戏的宿主，模块名是 `CutscenePlayer`、`AudioBus`、`InkText`、`SaveStore`、`StoryRuntime`、`SceneDirector`。轨道字段以 [内容数据格式](../plan/11-history-game-content-schema.md) 为准。朝代、正史和野史怎么分支，写在 [plan/11](../plan/11-history-game-story-design.md)，引擎计划不重复那些内容。过场使用帧时钟；玩法使用固定步。过场进行时物理暂停。
