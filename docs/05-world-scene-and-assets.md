# 05 · 场景与世界

[目录](./README.md) · [上一章](./04-plugin-system.md) · [下一章](./06-input-strokes-and-physics.md)

**场景层只剩两条实现**：`Playfield`（切片与玩法，Matter 权威）与 `InkScene`（历史动画，无物理）。旧的 v0.1 场景服务（`createScenePlugin`、`parseSceneJSON`、`scene-json.ts`、`tokens.ts`）与 Pixi 十卡 `InkStage.paintSheet` 都已删除。

## `Playfield`：切片与玩法的权威场景

类在 `src/core/playfield.ts`。单位是像素、Y 向下、`gravity.y = 1`。

- `addPolyline(points)` 按折线每段做 `Bodies.fromVertices`，厚度 28，静态，标签 `ground`。地面网格的 Z 起伏只在 `InkView` 里画，不写进 Matter。
- 角色是圆，显示在 z = 40；脚的 x、y 来自刚体；圆的 `inertia` 为 `Infinity`，网格旋转保持 0。
- 单向平台、击退、扫掠与砍竹都由 `Playfield` 的方法承担，没有单独的 `ActorController` / `Combat` 类。导出常量：`ACTOR_RADIUS`、`MOVE_SPEED`、`JUMP_VY`、`KNOCKBACK_CAP`、`KNOCKBACK_LOCK`、`ATTACK_STEPS`。
- 断竹会把一根静态竹竿换成静态竹根 + 动态上段（`cutBamboo`），上段的 `rotation.z` 写成刚体角度。
- 水刷先改 CPU 刚体（`washBridge` 一类），再在已提交的墨层上做视觉减淡。

`step(dt)` 走玩法固定步（见 [第 3 章](./03-clocks.md)），`InkView.frame` 在同一帧里再调 `TerrainSeep.update`、`InkSurface.update`、`CameraRig.follow`，最后 `render`。

`InkWorld`（`src/core/ink-world.ts`）是另一套更简单的 Matter 世界：玩家圆、地面、左右墙、墨桥、投射物与弓靶。它仍然导出并被使用（叙事与实验），但不再挂任何外部渲染页面。

## `InkScene`：历史动画的分件场景

`src/core/ink-scene.ts`。固定 1280×720 正交画布，无物理、无相机运动（镜头由表现数据的对象轨道表达）。每个分件是一张透明 `InkSurface`：

- `add({ id, width, height, strokes, pivot? })`：用真实笔刷逐笔绘制；`pivot` 是关节轴心，越界会抛错。
- `pose(id, { x, y, scale?, rotation?, opacity?, order? })`：位置、旋转、透明度与绘制顺序。`rotation` 绕 `pivot`。
- `clip(id, rect | null)`：把图层裁到世界坐标矩形（按图层本地包围盒近似，旋转图层亦然）。
- `wash(id, steps)`：在该图层自己的墨面上跑真实 `InkSurface.wash` 反馈。
- `render()` / `dispose()`：出图与幂等释放（墨面、几何、材质、渲染器）。

`apps/history/` 把分件数据写在 `chaos-data.ts`，关键帧写在 `inkgames.presentation` 数据里，由 `validatePresentation` / `poseAt` 校验与求值。

## 矢量墨稿 `inkgames.vector-ink`

画廊和以后的开场分镜共用这一份路径。文件放在 `assets/gallery/`，游戏场景以后也可以按同一格式加载。公共入口是 `parseVectorInk` 和 `compileVectorInk`。编译结果是一组 `InkStrokeRequest`，交给 `InkSurface.paint`。编译器只做加减乘除和开方，不读参照位图，也不把像素自动描成路径。

```json
{
  "format": "inkgames.vector-ink",
  "version": 1,
  "id": "chaos-2",
  "width": 1024,
  "height": 1024,
  "paths": [
    { "id": "handle", "role": "contour", "color": "black", "d": "M 470 40 C 430 120 360 200 300 250" }
  ]
}
```

| 字段 | 含义 |
|---|---|
| `format` / `version` | 必须是 `inkgames.vector-ink` 和 `1` |
| `width` / `height` | 路径坐标系。`compileVectorInk(sheet, { width, height })` 再缩放到画布 |
| `paths[].d` | SVG 路径：`M L H V C Q Z`，大小写分别是绝对和相对。圆弧 `A` 会拒绝 |
| `role` | `contour` 飞白轮廓，`fold` 衣纹，`strand` 发丝，`hemp` 披麻（一笔一条），`splash` 哥特泼点，`fill` 闭合形向内收一圈湿墨，`hatch` 沿路径再排几条披麻，`accent` 朱砂，`wash` 沿路径的湿墨 |
| `color` | `INK_COLOR_NAMES` 里的名字。`medium_gray` 在编码里是橡皮，不要用 |
| `size` / `effect` / `layers` / `seed` | 可选。`layers` 为 1..4，默认 1。不写笔压时大笔保持原尺寸；轮廓、衣纹、发丝和披麻的笔压停在 0.5 以下，避免尺寸升到 4 以后主线消失 |

一条路径对应一笔（`hatch` 除外，它会沿路径拆成几条短枯笔）。闭合 `fill` 只向内收，不再铺竖直色柱。暗部用多条重叠的 `wash`，从浅洗到重墨。发丝用 `strand`，衣纹用 `fold`，山石皴用 `hemp`，泼点用 `splash`。留白就是路径没有盖到的纸。

## 分层与坐标

- 层深沿用 `INK_LAYER_Z`：远景 −80、纸面 0、角色 40、文字 120。`CameraRig` 的透视相机用这个层深产生视差。
- 坐标仍是像素，没有改成米；`inkCameraDistance` / `inkLayerScale` 的常数保留，供 `CameraRig`、`InkView`、`InkSurface` 使用。
- `CameraRig.follow` 每帧把焦点拉近 5%，再夹进关卡包围盒；关卡比视口短时居中。
- 过场镜头键是相对纸心的偏移，`x: 0` 表示居中。缓动 `inOutSine` 用平滑步多项式 `u*u*(3-2*u)`，不用 `Math.sin`。字幕平面放在 z = 1，盖住纸面，像素和纸对齐；放在 z = 120 会被透视放大。景深键记在姿态上，没有散景 pass。
