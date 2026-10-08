# 07 · PixiJS 墨迹融合、宣纸和刀光

[目录](./README.md) · [上一章](./06-input-strokes-and-physics.md) · [下一章](./08-gameplay-and-persistence.md)

## 已实现 API（旧原型）

`createInkFluidPlugin()` 使用**原生 WebGL2** 的 R/RG16F 墨/湿度/速度原型和固定层，**不是 Pixi 滤镜实现**。现有水刷视觉按请求清理局部活动墨，可能冲淡锁定或交叠笔画；[旧审计](../plan/09-src-contract-gap-and-apps-rework-plan.md)的局部重绘墨量偏差需重新核查。旧 p5/GL 的半浮点条件不直接套用 Pixi RenderTexture。

## 设计目标：先可控融合，后高级流体

墨粒/笔迹集中画入受控分辨率的 Pixi RenderTexture（仅墨层）；以模糊 Filter 让相近 alpha 区域重叠，再以自定义阈值/色阶 Filter 对模糊后 alpha 做 `smoothstep` 边缘截断，合成为一张有浓淡边缘的墨迹 Sprite。阈值需保留少量纸边渗润，但噪声纹理与随机边缘只能改变显示；**metaball 融合是美术近似，不等于真实液体或质量守恒**。用双目标/显式渲染顺序避免同纹理读写；确认 Pixi 固定版本的 Filter shader、采样器绑定、预乘 alpha、滤镜 padding 与多次 render 用法。

场景底层使用许可清楚的静态纸纹及暖纸色；指定墨迹容器试验 multiply，验证预乘 alpha/叠层顺序、颜色较浅/较深的叠加，不让 UI/人物全部跟着 multiply。受击飞墨、攻击挥洒各有时间/粒子上限，粒子复用或批处理需以真实数据测，不能承诺“数千粒子稳定 60fps”。墨障显示由 `StrokeChanged` 等**几何提交事实**按笔 ID 同步：无几何变化（锁桥/未命中）不得清掉碰撞桥上的视觉墨；交叠要可单独处理。

刀光从武器轨迹构建 Pixi Mesh，按曲线采样/构网格，噪声纹理调制飞白，速度决定干湿/宽度，短暂残影后淡出；先在当前版本核实 Mesh API，不把旧 `SimpleRope` 名称当成可用接口。远山雾、植被 Mesh、Perlin 噪声风场是后续独立视觉 spike，若 CPU 粒子受风影响必须在固定步另写可重放规则。旧高级流体场仅当 Pixi 资源/Pass 能力与预算明确后才另立阶段。

## 未实现项与验收

RenderTexture→blur→threshold、纸纹、Mesh 刀光、流场均**尚未实现**。P4 量测不同尺寸/滤镜半径的纹理内存、draw calls、GPU 帧耗；截图验证透明边、滤镜裁切、纸色与 CPU 缺口对齐，真实桌面 GPU 验证目标帧率，SwiftShader 只做功能测试。未做性能/兼容实测时不得宣称高性能。
