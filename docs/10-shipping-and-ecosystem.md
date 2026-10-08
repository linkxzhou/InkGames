# 10 · 横版竖切片交付与许可

[目录](./README.md) · [上一章](./09-tooling-and-quality.md) · [旧研究附录](./11-references-and-research.md)

## 已实现（旧原型）

当前有 p5《墨渡》可运行示例与应用层《江湖夜行》演示；`package.json` 仍为 `private: true`，没有 PixiJS/Matter.js，不能称作已发布的 Pixi 横版动作引擎。可用公共接口见 `src/index.ts`。

## 设计目标与交付顺序

先交付 P1 单画布无墨关卡；P2 固定步 FSM/平台/命中；P3 可破坏墨障碰撞；P4 墨融合、纸张、刀光；P5 一关可玩、失败重试/录制、桌面兼容与打包。每阶段必须有源码、测试、示例和文档证据；旧 p5 关卡可留作迁移对照，但不能冒充 Pixi 新版。完整准入见 [实施基线](../plan/07-microkernel-plugin-plan.md)。

PixiJS、Matter.js、Filters 或其它新依赖确定安装版本后逐一审计许可证及传递依赖，并更新 `THIRD_PARTY_NOTICES.md`；纸纹、噪声图、音频、字体都要有可发布授权。`thirdparty/inkField` 为自定义受限许可：不得复制代码、shader、常量表、不得公开再分发本地快照；公开仓库及 Git 历史同样需要审核，不能只从 npm 包排除。`thirdparty/inkwash` 是 MIT，若实际移植须保留版权和许可声明；旧独立原型不能伪称为原版代码移植。Mixbox 非商业授权不适用于默认商用引擎依赖。

## 未实现项与发布门槛

Pixi/Matter 依赖、横版完整关卡、GPU 性能、跨浏览器兼容、正式打包与许可审计均未完成。发布前以 `./build.sh check` 和独立浏览器测试核验逻辑/视觉，在目标桌面真实 GPU 测性能并注明环境；功能、60 FPS 与 context 恢复仅在实际测试通过后声明支持。未达门槛只称设计/迁移中原型。
