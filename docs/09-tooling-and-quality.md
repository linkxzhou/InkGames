# 09 · 验证

[目录](./README.md) · [上一章](./08-gameplay-and-persistence.md) · [下一章](./10-shipping-and-ecosystem.md)

命令只有 `./build.sh` 这一套。

| 命令 | 做什么 |
|---|---|
| `install` | `yarn install`。失败时脚本直接退出并提示检查网络，不会跳过。 |
| `dev` | Vite，`apps/` 为根，默认 `127.0.0.1:5173`。`/` 是首页，链到切片、叙事、历史、画廊和二十个道具页。 |
| `typecheck` | `tsc --noEmit`，`strict`。 |
| `build` | 类型检查后 `vite build`，产物在 `dist/`。入口含首页、切片、叙事、历史、画廊和二十个道具页。 |
| `test` | `vitest run`。 |
| `links` | `scripts/check-links.mjs` 检查 README、AGENTS、`docs/`、`plan/` 的相对链接。 |
| `check` | `typecheck` + `test` + `links`。提交前跑这个。 |
| `browser` | 先 `build`，再 `scripts/browser-smoke.mjs`。 |
| `clean` | 删 `dist/` 和 Vite/Vitest 缓存。 |

## 单测覆盖什么（12 个文件，64 项）

| 文件 | 覆盖 |
|---|---|
| `frame-clock.test.ts` | 玩法固定步的四步封顶与夹取；过场帧钟的墙钟追赶、**进位而非取整**、抖动平均后精确、片尾夹取与不倒退、超预算丢弃 |
| `cutscene-pulses.test.ts` | live 笔画：单次 `begin` → 有序 `point` → 单次收笔且只应用一次 `finish`；单点笔画也会收笔；跳播折叠为 `instant` |
| `playfield.test.ts` | 刚体 xy 进 `BodyLink`、插值两端、追步封顶时 `alpha` 为 1、可走坡与过陡当墙、单向平台掩码、击退锁定 |
| `slice-cpu.test.ts` | 竹从一节变两段、接触点变盖章、高度场哈希可重复、勾边宽度随距离变化、墨滴上限、经典 Perlin 许可声明 |
| `ink-presentation.test.ts` | 表现数据校验（唯一 id、严格递增帧、scale/opacity 范围、impulse 指向已声明图层）、`poseAt` 夹取与插值确定、**order 与 clip 在关键帧处切换**、形状 id 唯一 |
| `ink-clip.test.ts` | 裁剪矩形的保留、按关键帧切换、拒绝零尺寸 |
| `ink-brush.test.ts` | p5 兼容随机与噪声、面板取值、笔刷移植与 inkEngine 对齐（同一测试笔画的种子与逐帧线段数） |
| `prop-brushes.test.ts` | 每个道具的笔刷行都是 inkEngine/index.html 能选到的值、各道具配置互不相同、每笔每帧一个指针点 |
| `narrative.test.ts` | 21 章都能解析；荆轲开场在第 140 帧停在 `s1.title` 并出现「易水寒」；快进后只有正史/野史可选；正史走到结局后 `resume()` 回到该节点；推演在两条线都通关前不可选；玩法说明仍含「稳住秦舞阳」 |
| `history-props.test.ts` | 二十件道具、笔画外接框宽高都超过 30、落下位移、砍断木桩、`defineGameplay` 保留目标原文 |
| `ink-camera.test.ts` | 层深缩放与虫蚀采样的确定性 |
| `ink-animation.test.ts` | 图片显影镜头的边界、seek 求值与非法镜头（对照实验用） |

测试不创建 WebGL，也不比较截图像素。领域数据另有一条独立校验：`node video/tools/validate.mjs` 检查 21 章 / 221 场景 / 分镜连续性与字符串引用（当前 0 错误）。

## 浏览器冒烟

`scripts/browser-smoke.mjs` 用无头 Chromium，启动参数包含 `--enable-unsafe-swiftshader`、`--use-gl=angle`、`--use-angle=swiftshader`。它依次打开 `/scroll/`、`/story/`、`/history/`，对每页：

- 等到各自的 ready 旗标（`__sliceReady` / `__storyReady` / `#play` 可用）；
- 断言存在尺寸 ≥ 1 的画布；
- 断言没有 `pageerror`、没有非资源加载的 console error、没有 HTTP ≥ 400 的响应；
- 断言**图片请求数为 0**（参考图只作人工对照，运行时不得加载）；
- 在 `/history/` 上调用 `window.__historyHash(frame)`，断言**连续两次渲染同一帧逐字节一致、不同帧必须不同**（2026-10-09 实测：同帧 3603028584，异帧 2396843167）。

只证明引擎启动、着色器能编过、没有未捕获异常。SwiftShader 通过不等于 60 FPS，也不等于 Safari / Firefox / 真机 GPU 已测。

## 本机看图

```bash
node scripts/gpu-check.mjs
```

打印 `http://127.0.0.1:4179/scroll/` 与 `/story/`（端口可用 `GPU_CHECK_PORT` 改）并留下 Vite，给所有者在自己的 Chrome 里看。真实 GPU 验收定在所有者的 Mac（Apple Silicon，Chrome）上，在那之前文档保持未实测。

```bash
node scripts/gpu-check.mjs --shots
```

`--shots` 用无头 Chromium 加 SwiftShader 打开 `/scroll/?pose=rest` 与 `?pose=cut`，对 rest 调用 `window.__sliceLose` / `__sliceRestore`（`WEBGL_lose_context`），再打开 `/story/?pose=title` 与 `?pose=fork`（fork 必须停在 `choice`）。截图写到 `GPU_CHECK_OUT`（缺省 `/opt/cursor/artifacts/screenshots/`）。通过条件是 ready 旗标为真、GL 错误为 0、无 `pageerror`。

过场「同一机器连播两次、镜头末帧一致」仍是 [video/docs/engine-gaps](../video/docs/engine-gaps.md) 的验收，没有做。性能目标（整帧 16.6 ms、过场墨面每帧 ≤ 8 ms）未实测。

## 对照素材

`/compare/` 页面与 `scripts/capture-parity.mjs` 原先在 640×480 上把 Pixi `InkWash` 与 inkEngine 宿主页并排。**Pixi 一侧已随 `InkWash` 删除，这条自动对照链路当前不可运行**。`scripts/inkengine-host.html` 仍可重放道具页导出的笔画。`gpu-check.mjs --shots` 截切片、叙事、历史、画廊和二十个道具静帧。差异结论留在 [第 12 章](./12-inkengine-parity-audit.md)，其中 Pixi 列的数值属于历史记录。
