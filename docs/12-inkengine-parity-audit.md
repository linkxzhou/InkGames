# 12 · 与 inkEngine 的效果对照

[目录](./README.md) · [水墨实现](./07-ink-rendering.md) · [剩余工作](../plan/10-v2-pixi-matter-ink-game-engine-plan.md)

对照对象是 `thirdparty/inkEngine/`（`ink-engine.js`、`NAME-MAP.md`、`README.md`）。它是 inkField 的可读还原，回放录制时与原版逐像素一致。本仓库的目标是让 `InkWash` 的观感沿同一条管线走，而不是把 `ink-engine.js` 嵌进页面，也不是宣称逐像素相同。

书面授权由仓库所有者声明，授权书不在仓库内。`src/core/ink-brush.ts`、`src/core/ink-wash-filters.ts` 的文件头写了归属。`thirdparty/` 未改。

状态用词：

| 用词 | 含义 |
|---|---|
| 对齐 | 公式或数据流与指名的函数一致，常数可以不同，但步骤没有删 |
| 部分 | 同一段管线在，但表、模式或 pass 被缩短 |
| 缺失 | `src/` 里没有对应路径 |
| 不同 | 有意换成另一套模型 |

证据栏是阅读源码和 SwiftShader 截图，不是独立显卡上的实测。Safari / Firefox 未测。

## 总表

| 能力 | inkEngine | 状态 | `src` 里的证据 |
|---|---|---|---|
| 弹簧笔尖 | `drawBrushStroke`（`_j58`）。`vel += (target-pos)*spring`，`vel *= friction`，再插值。大笔默认 spring 0.6、friction 0.5、插值 15，`baseBrushSize` 大档约 2 | 部分 | `InkBrush.sample` 用同一组 spring/friction。插值改为 8（枯笔/飞白刷为 6），避免 SwiftShader 上一帧盖不完。`tests/ink-brush.test.ts` 断言笔尖滞后 |
| 笔毫 / 分叉 | `drawBranch`（`_j56`），以及 `BRANCH_OFFSETS_*`、路径旋转、笔压分档 | 部分 | 垂直于速度铺 8 根（枯笔 5 根），宽度和 alpha 由自有 LCG 抖动。没有分叉表，没有旋转模式，没有笔压 |
| 飞白、枯笔 | 笔模式 4 `pen`、6 `fly`，以及效果 2；速度高时断墨 | 部分 | `keepMark` 随速度丢笔毫。反馈里 `uEffect` 2 用噪声把缝抬亮。`drawDryBrush` / `drawFlyBrush` 的完整形状没有搬 |
| 其余笔 | 模式 `marker` / `gothic` / `dots` / `brushSP` | 缺失 | `InkBrushOptions.mode` 只有 `brush` / `pen` / `fly` |
| 扩散 | `runFeedbackPass`（`_j30`）跑 `feedback.frag`：`min(当前, 力场偏移采样)`，`useSharpen < 0.5` 时四邻渗色 | 部分 | `feedbackFragment` 的 mix 分支是同一结构。四邻距离放到 1.6 个纹素（参考更紧），否则半分辨率下几乎看不出洇。`indiffusion` 固定走 0.45，湿笔 0.62 |
| 锐化 | 效果 1 | 部分 | 邻域减完再加回 0.08，不是完整 unsharp 链 |
| 湿墨 | 效果 3，沿笔势拉丝 | 部分 | 一组方向噪声把暗部再压暗 |
| 边缘压暗 | 合成阶段按轮廓压暗 | 部分 | `compositeFragment` 用干墨亮度的四邻梯度，`shown *= 1 - edge * 0.85` |
| 力场 | `updateForceMap`（`_j179`）跑 `mapFrag`，含时间项。原版有的均匀量在演示里并未全部赋值 | 不同 | `forcePixels()` 用 `valueNoise` 烘焙一次，约 128±45，之后不变。固定步可以复现，画面不会随墙钟流动 |
| 类型图 | `typeMapEncodeShader`（`_j522`），`commitStroke`（`_j39`）写入 | 部分 | `typeFragment`：暗度 > 0.08 且该像素还没写过时，R 写 0.5 或 1（看颜料亮度是否 > 0.75），G 写暗度，B 写笔画序号。没有原版的完整类型编码 |
| 颜料 | `encode.frag` / `realtime.frag` 的光谱混合、36 色、色相饱和明度 | 不同 | `commitFragment` 把灰度暗度染成 `uPigment` 再 `min` 进干层。重叠时更暗的颜色留下。没有光谱 |
| 纸 | `generatePaperTexture`（`_j9`），p5 拼贴 | 不同 | `paperPixels`：底 222（`neutral`）或暖宣（`xuan`），`valueNoise` 纤维幅度约 34。种子独立 |
| 合成 | `compositeShader`（`_j520`）：纸乘墨；浅色走另一支混合 | 部分 | 纸乘 `min(干, 锁定, 湿墨染色)`。类型 R > 0.75 时改为滤色。没有原版的多层 buffer 链 |
| 盖章方式 | 笔迹画进缓冲再交给 feedback 的 `min` | 不同 | 笔毫先以 alpha 覆盖率画在透明 `stamp` 上，`depositFragment` 做 `wet *= (1 - cover * 0.92)`。不透明灰笔直接 `min` 会糊成马克笔，所以改成覆盖率累加 |
| 随机 | `crandom` 包一层 p5 `random` | 不同 | `InkRng` 用同一组 LCG 常数（1664525, 1013904223），调用次序是自己的，序列对不上 p5 |
| 录制 | `mp` / `md` / `mr` 与 `demoRecording` | 不同 | `src/plugins/recording.ts` 只记录 v0.1 命令。`InkWash` 不读那份 JSON |
| 后处理 | flow、distort、虫蚀 metallic | 缺失 | 合成之后没有这三支 pass |
| 镜头 | EasyCam，构图会偏大约数个百分点 | 缺失 | 对照页关掉 EasyCam，坐标才能并排。游戏页没有这台相机 |
| 旧流体 | 无。inkEngine 不是纳维–斯托克斯场 | 不同 | `src/plugins/ink-fluid.ts` 留给 `/inkcross/`。这次没改，避免冒烟的墨量断言失效 |
| 碰撞 | 无游戏刚体 | 不同 | 水刷改的是 `InkWorld` 矩形。`wash` 只减淡 `committed`。这是玩法，不是墨色 pass |

## 这次为了靠近观感改了什么

1. 删掉原先的模糊加阈值（`ink-effects.ts`、`ink-fusion-filter.ts`）。那两支会把笔画收成色块，和参考的笔毫不是一条路。
2. 笔尖改成弹簧阻尼，一笔拆成多根细毫，飞白随速度断墨。
3. 湿层用覆盖率变暗，再跑 `min` 扩散，然后染色提交。
4. 纸、力场、类型图、边缘压暗按上表接到合成里。
5. 对照页 `apps/compare/` 固定三条笔画、种子 `1234567890`、800×600、`paper: 'neutral'`、`scale: 1`。

## 并排时应该看到什么，以及不该声称什么

同一组折线下，两边都应有：发丝状的笔芯、斜向飞白的断口、青墨相对黑墨更「透」、纸纹露在淡处。参考边的渗开更宽，飞白更碎，纸是另一套纹理。本边的力场不动，插值更少，半分辨率的十卡页还会再糊一档。

未实测：独立显卡、Safari、Firefox、以及「和 inkField 原版逐像素一致」。SwiftShader 截图只说明着色器能跑、构图可对。
