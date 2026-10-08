# 02 · PixiJS WebGL 宿主与渲染

[目录](./README.md) · [上一章](./01-scope-and-engine-map.md) · [下一章](./03-microkernel-and-loop.md)

## 已实现 API（旧原型）

`createP5Host()` 和 `createWebGL2RendererPlugin()` 提供旧单画布 p5/原生 GL 原型；`./build.sh dev` 可查看旧演示。**不是 PixiJS 的初始化示例**；旧版 `withGLState()`、R16F FBO 探测和 context-loss 暂停不证明新方案兼容或恢复成功。

## 设计目标

锁定并安装 PixiJS 版本后以 Pixi `Application`/Renderer 创建**一个** WebGL 画布（显式选择 WebGL 后端，不悄悄切到 WebGPU），用同一个 `Engine` 宿主帧驱动固定步、显示树更新和单次呈现；禁用 Pixi 自动启动的 ticker 更新逻辑，避免两个 RAF。先在锁定版本核实 `Application.init`、自动 ticker、渲染调用、滤镜资源及销毁接口，文档中的 Pixi 类名均为设计意图而非已交付 API。

Pixi 管理画布、Renderer、RenderTexture 与 Shader/Filter；不要让旧原生 GL pass 越过 Pixi 的状态/缓存直接改同一 context。确需底层 pass 时验证 Pixi 扩展点与资源重建，先做可失败的最小兼容 spike。resize/DPR 时重设渲染分辨率与离屏纹理，不修改 CPU 世界或物理尺寸；context lost 时暂停固定步、重建/验证资源后才恢复，不能仅监听事件就认为已恢复。

坐标：DOM `clientX/Y` 经画布 bounds 变为 CSS 坐标，再按相机逆矩阵转 world；Pixi 显示树只读相机快照，碰撞仍在 world。用缩放/平移/resize/CSS 缩放下四角和中心的往返测试保证输入、墨障与 collider 对齐。纸张、场景、墨层、刀光、UI 定序；混合模式只在指定墨层上试验预乘透明结果。

## 未实现项与门槛

未实现 Pixi 宿主、WebGL/Filter 能力探测、资源重建、相机对齐实测。P1 先验证空场景、无墨角色、resize/销毁/上下文丢失后单画布可运行；记录 Pixi 版本、浏览器、GL 后端和错误，失败不要静默回退其他后端。现有浏览器 smoke 只适用于旧 p5 页面。
