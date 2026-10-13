# 压缩霞鹜文楷到一个字重

## Goal

在 PR #29 的同一分支上，只留 Medium 一份 woff2。脚本扫描 `video/viewer` 里真正用这套楷画出的文字（含场景标题），子集化这些字形。缺字回退系统楷。总体积落在几百 KB。

## Next Step

无。检查已通过，体积已写入 PR #29。

## Current Phase

Phase 2

## Phases

### Phase 1: 扫描与子集

- [x] 确认正文不单独占用 Regular
- [x] `video/tools/subset-wenkai.mjs` 扫描楷体用字并调用 pyftsubset
- [x] `./build.sh fonts` 与文档
- **Status:** complete

### Phase 2: 页面与验证

- [x] 删掉 regular，`@font-face` 只指向 Medium；缺字回退系统楷
- [x] 标题截图无缺字（cmap 含标题用字；无头页上 400/700 均 loaded）
- [x] `./build.sh check` 与 `node video/tools/validate.mjs`
- [x] 更新 PR #29，写明压缩前后体积和字形数
- **Status:** complete

## Decisions

- 主站正文是 `--serif`，不是楷。关系页整页用楷，但和标题共用 Medium 这一套字形，不另留 Regular。
- 字重 400 和 700 都指向同一份 Medium，避免浏览器合成假粗体。
- 开场分镜旁白 `.vo` 也是楷，扫描时计入。上游没有的 ⇢ 继续缺字，由系统楷回退。
