# 章节开场视频（chapter videos）

每个朝代一支 16:9 开场短片，放在查看器“二十一朝”长卷之下、本章场景卡之上，切换章节时随之更换。

## 流程（每章相同）

1. **剧本**：按 剧情树 → 开场分镜（`scene.opening.shots`）→ 水墨视频提示词（`videoPrompt.shots`）的顺序读本章各场，按年代挑 6–8 个瞬间，每镜一个瞬间、取自该场自己的分镜。写到 `video/data/chapter-videos/<chapter>.json`：每镜有 `zh`（字幕）、`imagePrompt`（英文静帧）、`motionPrompt`（英文动势）、`durationSec`、`sceneId`、`sourceShots`。总长约 40–60 秒。
2. **静帧**：每镜按 [art-style.md](./art-style.md) 出一张 16:9 静帧（黑白红剪影，朱砂红不超过一成，负面词含其他颜色、金色、日本刀、细密皴纹、CG 渐变、写实、3D、动漫脸、文字、印章）。逐张检查，跑偏就重出。
3. **图生视频**：静帧作首帧，动势克制（云雾缓移、衣袖轻摆、墨缓缓洇开、镜头极慢推近），提示词写明 “keep the composition stable, no morphing, no new objects, no text”。天裂、洪水等大事用墨的缓慢扩散表现，不做激烈动作（实测平静镜 7/10，激烈镜 4/10）。
4. **审片**：ffmpeg 抽帧逐镜看，严重变形的重生成，每镜最多重试 2 次。
5. **合成**：`python3 video/tools/build-chapter-video.py <chapter>`（需 Python 3 + Pillow + ffmpeg，本地工具，不在 `./build.sh` 里）。片段 lanczos 等比放大后居中裁成 1280×720（不拉伸）、轻度锐化；3 秒片头卡（`#eceae4` 纸面叠 `paper-ink-stains`，章名 + `vermilion-seal-fill` 朱印）；镜间 0.7 秒交叉淡化；每镜 `zh` 字幕烧在下三分之一（Noto Serif CJK Bold，墨色 `#141414`，纸色柔光晕），镜头内淡入淡出；末镜定格 3 秒并淡出到纸色。H.264 crf 27、`+faststart`、无音轨；只出 mp4，另出海报 jpg/webp（取首镜字幕出现前的一帧）。输出到 `video/viewer/assets/chapter-videos/<chapter>.mp4`、`<chapter>-poster.{jpg,webp}`，并把本章 JSON 各镜 `status` 置 `done`、写入 `output`。原始静帧与片段放 `/workspace/chapter-video/<chapter>/`，不进仓库。
6. **查看器**：同一脚本重写清单 `video/viewer/assets/chapter-videos/index.json` 与等价的 `index.js`（`window.CHAPTER_VIDEOS`，`file://` 下用 `<script>` 加载，不用 fetch）：`{ "chapters": { "<chapter>": { "mp4", "poster", "posterWebp", "durationSec", "shots" } } }`。查看器在章节头之下、场景卡之上显示视频块（`controls playsinline preload="metadata"` + 海报，单一 mp4 源），切换章节时换源；清单里没有的章节隐藏视频块。`validate.mjs` 检查清单两份一致、所列文件存在、mp4 < 15 MB。

## 状态

| 章 | 剧本 | 静帧 | 片段 | 成片 |
|---|---|---|---|---|
| 上古 | `chapter-videos/shanggu.json`（8 镜） | 8/8 完成（16:9） | 8/8 完成（6.04 秒，审片无严重变形；镜 1 略拉远、墨稍淡，镜 2 天裂边缘漂移，可接受） | 完成：`shanggu.mp4` 49.5 秒 · 1280×720 · 约 9.8 MB；海报 jpg/webp |
| 其余 20 章 | — | — | — | — |
