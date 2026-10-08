# 10 · 尚未完成的工作

优先级：先保证十卡在真实桌面 GPU 上可玩且墨迹稳定，再补齐与 inkEngine 仍有差距的笔刷和后处理，最后才拆掉旧 p5 演示。已实现的接口见 [文档](../docs/README.md)，对照表见 [水墨差距审计](../docs/12-inkengine-parity-audit.md)。

## P0 · 验收还没做完

1. **真实 GPU。** 目前的浏览器检查是无头 Chromium + SwiftShader。它能证明 WebGL 程序能编过、十个页面能打开、没有未捕获异常。它不能证明 60 FPS，也不能代替一台带独立显卡的桌面浏览器。Safari / Firefox 同样未测。
2. **上下文恢复。** `InkStage` 在 `webglcontextlost` 时暂停，恢复后只提示用户重置。滤镜、RenderTexture 和纸纹没有自动重建。
3. **开场太慢。** 每个道具、山水和精灵都按 inkEngine 的逐帧流程画（几十到上百次 feedback），十卡开场在 SwiftShader 上要 18–35 秒。真实 GPU 上应快得多，没有实测。可以把开场画好的纸层缓存成纹理，或者分帧画。

## P1 · 水墨仍未对齐的部分

笔刷、feedback、编码、类型图、合成、实时、纸、36 色都已逐行移植（见审计表）。剩下的按观感影响排序：

1. 遮罩（`drawMaskRect` / `drawMaskPolygon`）没有。
2. 景深模糊没有。EasyCam 在回放时会把距离收到默认值的 1.1 倍并允许更大的平移；游戏页只做深度缩放，相机偏移限制在 48×36 px，纸层保持 1:1。
3. 道具上的 distort 只作用于该笔矩形。inkEngine 的开关扭曲整幅。对照页 `?scene=distort` 用整幅。
4. metallic 的咬痕中心跟扫描到的像素走。和 inkEngine 差几级灰度时，位置对不上。提交后不会每帧对整幅重跑。没有 boid。
5. Pixi 与 p5 的线段光栅化、MSAA 细节不同，墨色斑驳的位置因此和参考版有出入。
6. 旧 `InkFluid`（纳维-斯托克斯场）仍服务 `/inkcross/`，不是这条管线。

已接上、不再算缺口：笔画矩形上的逐帧力场、重叠处的 ping-pong 残留、flow / distort / metallic、以及 z = −80 / 0 / 40 的分层镜头。见 [审计](../docs/12-inkengine-parity-audit.md)。

## P2 · 演示和玩法还薄的地方

1. 十个道具的行为写在 `InkStage` 的 `switch` 里，预设在 `src/plugins/items.ts`。还不是各自一个 `itemId / requiresEffects` 插件文件，也没有独立的资源租约。
2. 枪、剑、刀的命中是几何距离，不是武器扫掠体。弓和墨弹才走 Matter 碰撞。
3. 盾的来袭、箭和墨罐在物理上仍是圆。画面上它们是开场画好的墨层精灵。马只有两种步态交替，旗只有三幅风向，舟只平移；都不是骨骼或布料 Mesh。
4. 2.0 舞台没有自己的录制格式。`src/plugins/recording.ts` 只记录旧引擎命令。
5. 水刷只能裁矩形墨桥。宽笔画碎段、接缝漏碰还没有专门的 Matter 试验。

## P3 · 可以后做

- 旧 `/inkcross/`、`/wuxia/` 和 p5 依赖，等测试夹具迁走再删。
- 把 `thirdparty/inkField` 快照从公开历史里隔离。书面授权不在仓库里，快照本身仍然不要打进发布物。
- 质量档、粒子上限。墨层 pass 已经只跑笔画外接矩形，但精灵各占一张小墨层，数量多了会吃显存。

## 明确不做

移动端、联机、跨浏览器逐位确定性、导航网格、把 inkEngine 整文件嵌进页面、逐像素复刻参考版（含 EasyCam 的回放变焦和空闲时整幅重画的力场）。
