# 09 · 验证

[目录](./README.md) · [上一章](./08-gameplay-and-persistence.md) · [下一章](./10-shipping-and-ecosystem.md)

命令只有 `./build.sh` 这一套。

| 命令 | 做什么 |
|---|---|
| `install` | `yarn install`。失败时脚本直接退出并提示检查网络，不会跳过。 |
| `dev` | Vite，`apps/` 为根，默认 `127.0.0.1:5173`。`/` 是十卡首页。 |
| `typecheck` | `tsc --noEmit`，`strict`。 |
| `build` | 类型检查后 `vite build`，产物在 `dist/`。入口含十卡、首页、`inkcross`、`wuxia`、`compare`。 |
| `test` | `vitest run`。 |
| `links` | `scripts/check-links.mjs` 检查 README、AGENTS、`docs/`、`plan/` 的相对链接。 |
| `check` | `typecheck` + `test` + `links`。提交前跑这个。 |
| `browser` | 先 `build`，再 `scripts/browser-smoke.mjs`。 |
| `clean` | 删 `dist/` 和 Vite/Vitest 缓存。 |

## 单测覆盖什么

`tests/` 对 v0.1 的时钟、插件图、侵蚀、场景、录制做断言。`tests/v2-core.test.ts` 覆盖 `InkWorld` 的落地、墨桥裁切、投射物命中，以及道具预设校验。`tests/ink-brush.test.ts` 覆盖笔毫的可复现、弹簧滞后和飞白少毫。测试不创建 WebGL，也不比较截图像素。

## 浏览器冒烟

`scripts/browser-smoke.mjs` 用无头 Chromium。启动参数包含 `--enable-unsafe-swiftshader`、`--use-gl=angle`、`--use-angle=swiftshader`。没有独立显卡时走 SwiftShader。

它检查：

- `/` 有十张卡，且没有 `pageerror`。
- 十个道具页出现画布、`#loading` 隐藏、状态离开「加载中」。
- `/compare/` 在超时内把 `window.__compareReady` 设为真。
- `/inkcross/` 仍检查墨珠、印章、落笔、水刷擦桥、锁定桥不被误伤、稳定期墨量漂移、擦除对墨量有影响、上下文丢失后引擎 `paused`。
- `/wuxia/` 仍检查画布宽度 900、WebGL2、波次和斩敌文字。

局部重绘和全量重建的墨量差只打印，不作为失败条件。那是旧墨水的已知差异。

SwiftShader 通过不等于 60 FPS，也不等于 Safari / Firefox / 真机 GPU 已测。那些在文档和计划里写明「未实测」。

## 对照截图

`/compare/` 用种子 `1234567890`、中性纸、满分辨率，画三条与说明页一致的笔画：水平大笔、一条青墨曲线、一条飞白斜线。inkEngine 那边要关 EasyCam、`pixelDensity: 1`、同一颗种子，否则构图对不齐。两边不会逐像素相同。差异表在 [第 12 章](./12-inkengine-parity-audit.md)。
