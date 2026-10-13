# 进度

- 分支 `cursor/taste-type-hero-font-adf4` 从 `origin/main` `2a78a5e` 切出。
- 改前、改后截图在 `/opt/cursor/artifacts/screenshots/{before,after}/`。场景提示词用 `window.scrollTo` 即时滚动，不走页面的 smooth scroll。
- 字体子集与 `OFL.txt` 在 `video/viewer/assets/fonts/`。`wenkai.css` 用 `@font-face` 与 `font-display: swap`。
- `video/viewer/index.html`、`pian.css`、`05-09-jingke-relations.html` 的字号都改成 `--fs-1` 到 `--fs-7`。提示词用默认关闭的 `details`。
- `THIRD_PARTY_NOTICES.md` 登记了这份 OFL 字体。它不是引擎的 npm 依赖。
- `./build.sh check` 通过：tsc、vitest 73 项、397 个 Markdown 链接。`node video/tools/validate.mjs` 0 个错误。`yarn.lock` 没有改动。
- PR：https://github.com/linkxzhou/InkGames/pull/29 ，基线 main。真实 GPU 未实测。
