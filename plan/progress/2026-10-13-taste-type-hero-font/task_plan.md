# 问题 5 / 7 / 8：窄屏主图、七档字号、自托管楷体

## Goal

从最新 main（含 PR #27、#28）修 design-taste 剩余的 5、7、8：390 宽开卷图裁到 240px 高并只留右侧武士与烽火；全站字号收到 14/16/20/28/40/56/92；生成提示词默认收起；自托管霞鹜文楷子集 woff2。PR 指向 main。

## Next Step

无。检查已通过，PR #29 指向 main。

## Current Phase

Phase 3

## Phases

### Phase 1: 改前截图与字体子集

- [x] 从 origin/main 建分支
- [x] 1440 / 390 改前截图
- [x] 霞鹜文楷 v1.522 Regular + Medium 按查看器用字子集为 woff2
- **Status:** complete

### Phase 2: 样式与提示词

- [x] 390 主图 240px、object-position 78% 60%；桌面端不改
- [x] 七档字号变量，video/ 下页面一致
- [x] 视频 / 素材 / 本篇提示词默认收起，点按 ≥ 44px
- [x] @font-face + font-display: swap，标题只用自托管楷，不回退系统楷
- **Status:** complete

### Phase 3: 验证与 PR

- [x] 改后截图（1440 / 390）
- [x] ./build.sh check 与 node video/tools/validate.mjs
- [x] 提交、推送、PR 指向 main，描述里写字体体积和对比图
- **Status:** complete

## Decisions

- 上游 v1.522 没有 Bold，只有 Light / Regular / Medium。正文字重用 Regular（400）。标题用 Medium，在 @font-face 里登记为 700，避免浏览器合成假粗体。
- 许可证正文没有 Reserved Font Name，子集保留族名 LXGW WenKai。
- 字号不用 clamp，避免中间视口冒出第八档。窄屏标题用 56 或 40，桌面首页 h1 用 92。
- 桌面字号覆盖写在样式表末尾的 `@media (min-width:981px)`，避免被后面的无范围规则盖掉。
- 披露三角 ▸▾ 用系统 `--serif` 画，因为上游字体没有这两个字形。
- 不改 yarn.lock，不叠在其他 PR 分支上。
