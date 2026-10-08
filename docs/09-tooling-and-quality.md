# 09 · 测试、对账与性能

[目录](./README.md) · [上一章](./08-gameplay-and-persistence.md) · [下一章](./10-shipping-and-ecosystem.md)

## 已实现（旧原型）

`./build.sh check` 执行类型、Vitest、相对链接检查；`./build.sh browser` 是另行执行的 Chromium/SwiftShader 旧 p5 页面冒烟，**不是 PixiJS 浏览器验证**。旧测试覆盖固定步、插件依赖、笔画侵蚀及最小场景/录制；没有 Matter/FSM/RenderTexture/Shader 性能结果。

## 设计目标与分层门槛

1. 无 DOM 逻辑测试：固定步次数、输入排序、FSM 转移、平台接触、受击去重、水刷碎段/胶囊转换、动态 collider 替换和版本化回放。记录物理引擎/插件版本、步号、CPU 状态哈希；对 Matter 跨平台一致不做未经验证的保证。
2. Pixi 浏览器功能测试：强制 WebGL 而非自动切换后端；检查离屏模糊→阈值→纸张合成、相机坐标、滤镜透明边、resize、销毁、context lost 后真正重建。截图与笔画/collider 可视化对账；锁定/交叠墨障不能只擦视觉。
3. 性能/资源测试：实际目标桌面 GPU 测 CPU step p95、渲染 p95、draw calls、RenderTexture 尺寸/峰值估算、粒子/滤镜半径档位及持续 5 分钟资源稳定性；可用 GPU timer 才报告 GPU 时间。**60 FPS 是目标，不凭 PixiJS 品牌或 SwiftShader 结果承诺**。SwiftShader 只用于可信页面的功能验证，不代表硬件帧率；Safari/Firefox 逐项实测后才列入支持矩阵。
4. 文档/发布测试：新依赖版本及许可证、素材许可、`thirdparty/inkField` 的公开仓库及提交历史边界；构建产物不得带受限快照。`./build.sh check` 通过并不等于许可/真机通过。

## 未实现项

上述 Pixi/Matter E2E、截图对账、真实 GPU 性能、GPU 恢复断言和跨浏览器矩阵均未实现。[plan/07](../plan/07-microkernel-plugin-plan.md) 每阶段必须附测试及环境证据；迁移旧浏览器脚本时要更新行为而不是沿用“成功”字样。
