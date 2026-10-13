# Progress

## 2026-10-13

- 从 `origin/main`（含 PR #27，`0dc5bd8`）开 `cursor/design-taste-batch2-347a`。
- 重画治国、人物、战场三张 800×1000 封面：左留白、右浓墨；龙改成四块剪影加无字朱印；战场只留朱旗。横幅文件未换。
- 二十一朝地图在锁色板之后重描海岸与河岸。标注改为 14px `#3a3a3a`，间距不足 28px 时换到对侧，仍挤则只留都城和当前场景。
- 1440 与 390 的改前改后截图在 `/opt/cursor/artifacts/screenshots/`。无头 Chromium，未在真实 GPU 上验收。
- `./build.sh check` 通过（类型检查、73 个测试、394 个文档链接）。`node video/tools/validate.mjs` 0 个错误。`yarn.lock` 被安装改写后已还原，不提交。
