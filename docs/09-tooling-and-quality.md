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

`tests/` 对 v0.1 的时钟、插件图、侵蚀、场景、录制做断言。`tests/v2-core.test.ts` 覆盖 `InkWorld` 的落地、墨桥裁切、投射物命中，以及道具预设校验。`tests/ink-brush.test.ts` 覆盖 p5 兼容的随机与噪声、面板取值，以及笔刷移植与 inkEngine 的对齐（同一测试笔画的笔画种子与逐帧线段数）。`tests/prop-brushes.test.ts` 检查每个道具的笔刷行都是 inkEngine/index.html 能选到的值、各道具配置互不相同、每笔每帧一个指针点。测试不创建 WebGL，也不比较截图像素。

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

`/compare/?prop=<id>` 在 640×480、`INK_STAGE_PAPER` 纸色、种子 `1234567890` 上画一个道具（`?scene=modes` 是七种笔刷各一笔，800×600、222 灰），并把笔画写进 `window.__compareScene`：模式编号、尺寸、墨效、混色、颜色、指针坐标、种子。

`scripts/capture-parity.mjs` 先截这一页，再打开 `scripts/inkengine-host.html`（同尺寸、同纸色、同种子、`pixelDensity: 1`、**打开** EasyCam），逐笔执行 `p.randomSeed(seed)`、`setBrush`、`setColor`、`strokePath`、`step(点数 + 倒计时)`，用 `snapshot()` 取图，最后并排拼成 `<id>-compare.png`。EasyCam 关掉时 inkEngine 的整幅画会缩到约 65% 并居中，坐标对不上。截图写到 `/opt/cursor/artifacts/screenshots/`。inkEngine 一侧每帧要 0.1–0.3 秒，全部道具要十几分钟。两边不会逐像素相同，差异表在 [第 12 章](./12-inkengine-parity-audit.md)。
