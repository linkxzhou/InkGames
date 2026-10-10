# 章节开场视频（chapter videos）

每个朝代一支 16:9 开场短片，放在查看器“二十一朝”长卷之下、本章场景卡之上，切换章节时随之更换。

## 流程（每章相同）

1. **剧本**：按 剧情树 → 开场分镜（`scene.opening.shots`）→ 水墨视频提示词（`videoPrompt.shots`）的顺序读本章各场，按年代挑 6–8 个瞬间，每镜一个瞬间、取自该场自己的分镜。写到 `video/data/chapter-videos/<chapter>.json`：每镜有 `zh`（字幕）、`imagePrompt`（英文静帧）、`motionPrompt`（英文动势）、`durationSec`、`sceneId`、`sourceShots`。总长约 40–60 秒。
2. **静帧**：每镜按 [art-style.md](./art-style.md) 出一张 16:9 静帧（黑白红剪影，朱砂红不超过一成，负面词含其他颜色、金色、日本刀、细密皴纹、CG 渐变、写实、3D、动漫脸、文字、印章）。逐张检查，跑偏就重出。
3. **图生视频**：静帧作首帧，动势克制（云雾缓移、衣袖轻摆、墨缓缓洇开、镜头极慢推近），提示词写明 “keep the composition stable, no morphing, no new objects, no text”。天裂、洪水等大事用墨的缓慢扩散表现，不做激烈动作（实测平静镜 7/10，激烈镜 4/10）。
4. **审片**：ffmpeg 抽帧逐镜看，严重变形的重生成，每镜最多重试 2 次。
5. **调色（palette lock）**：`video/tools/chapter_grade.py` 逐帧把每个片段锁回本风格色板：按亮度映射到墨 `#141414` → 纸 `#eceae4` 的灰阶，只有朱砂 `#b3241c` 附近的色相保留并重新染成朱砂；饱和的橙色拉向朱砂，淡橙、黄、蓝、绿一律变灰。生成模型常把天空染成冷色、把日出染成橙黄，这一步把它们清掉。逐镜可在 JSON 里写 `grade`：`redScale`（压低大片红色）、`redMaskBelow: [y0, y1]`（画面该高度以下的红色淡出成灰，例如沙地上的红色光带）。
6. **声音**：`video/tools/chapter_audio.py`，全部原创合成，不用任何采样。
   - **旁白**：每镜 `narration`（15–30 字，据本场数据写的原创文字），用 edge-tts `zh-CN-YunjianNeural`（rate −8%，pitch −2Hz）朗读，在每镜开始后 0.6 秒进入；台词若会压到下一个转场，就把该镜末帧多停一会儿（最多 2 秒）。edge-tts 要联网，不可用时自动退回只有配乐和环境声。
   - **配乐**：numpy 合成的 D 宫五声音阶：低音持续音（D2 + A2 + D3，缓慢呼吸）加暗色噪声垫底；片头卡之后稀疏的拨弦音（非谐泛音叠加，约三成带下滑音，近古琴、古筝）；片头卡一记深鼓，片尾再一记轻的。
   - **环境声**：每镜 `ambience` 列表，跟着画面走，转场处交叉淡化：`rumble`/`wind`（天地开）、`stone`/`shimmer`（补天的石鸣与微光）、`marsh-wind`/`insects`（伏羲泽畔夜风与虫鸣）、`grass`/`water`（神农草声与溪水）、`fog-wind`/`war-drums`/`horn`（涿鹿雾风、远处战鼓与号角）、`waves`（羲和海浪）、`ox`/`wind`（舜耕牛哞与风）、`rushing-water`（大禹奔流）。
   - **混音**：旁白出现时配乐与环境声自动压低约 9 dB（ducking）；两遍 EBU R128 响度归一到 −16 LUFS、真峰值 −1.5 dBTP；AAC 160k 立体声 48 kHz。固定随机种子，重建结果一致。
7. **合成**：`/workspace/.venv-audio/bin/python video/tools/build-chapter-video.py <chapter> [--raw DIR] [--out DIR] [--no-audio] [--no-grade]`（需 Python 3 + Pillow + numpy + ffmpeg，旁白另需 edge-tts；本地工具，不在 `./build.sh` 里；`--out` 用于试渲染，不改 JSON 和清单）。片段先调色，再 lanczos 等比缩放、居中裁成 1280×720（不拉伸；原生 720p 不再锐化），每镜最长 8 秒；3 秒片头卡（`#eceae4` 纸面叠 `paper-ink-stains`，章名 + `vermilion-seal-fill` 朱印）；镜间 0.7 秒交叉淡化；每镜 `zh` 字幕烧在下三分之一（Noto Serif CJK Bold，墨色 `#141414`，纸色柔光晕），镜头内淡入淡出；末镜定格 3 秒并淡出到纸色。H.264 crf 28、`+faststart`，只出 mp4，另出海报 jpg/webp（取首镜字幕出现前的一帧）。输出到 `video/viewer/assets/chapter-videos/<chapter>.mp4`、`<chapter>-poster.{jpg,webp}`，并把本章 JSON 各镜 `status` 置 `done`、写入 `output`（含 `audio`、`narration`、`loudnessLUFS`）。原始静帧与片段放 JSON 的 `rawDir`（`/workspace/chapter-video/<chapter>/…`），不进仓库。
8. **查看器**：同一脚本重写清单 `video/viewer/assets/chapter-videos/index.json` 与等价的 `index.js`（`window.CHAPTER_VIDEOS`，`file://` 下用 `<script>` 加载，不用 fetch）：`{ "chapters": { "<chapter>": { "mp4", "poster", "posterWebp", "durationSec", "shots", "audio" } } }`。查看器在章节头之下、场景卡之上居中显示视频块（最宽 880 px，`controls playsinline preload="metadata"` + 海报，单一 mp4 源），说明行写明有声或无声，切换章节时换源；清单里没有的章节隐藏视频块。`validate.mjs` 检查清单两份一致、所列文件存在、mp4 < 30 MB（每章上限），有旁白时每镜 `narration` 为 15–30 字；另对每份剧本检查镜数公式、时间线顺序、来源场景与分镜号、8 s 时长、提示词风格块与固定结尾、环境声已实现（见 [AGENTS.md §7](../../AGENTS.md)）。

## 上古旁白

| 镜 | 字幕 | 旁白 | 环境声 |
|---|---|---|---|
| 1 | 混沌初开，盘古撑开天地 | 天地混沌如鸡子，盘古生在其中，一日九变，撑开天地。 | rumble · wind |
| 2 | 天缺一角，女娲炼石补天 | 天塌一角，大水不息；女娲炼五色石，补上苍天。 | stone · shimmer |
| 3 | 伏羲仰观俯察，始作八卦 | 伏羲仰观天象，俯察地理，画下一长一断，始作八卦。 | marsh-wind · insects |
| 4 | 神农尝百草 | 神农走遍荒野，亲尝百草，一日而遇七十毒。 | grass · water |
| 5 | 涿鹿大雾，黄帝战蚩尤 | 涿鹿之野，大雾四起；黄帝会合诸侯，擒杀蚩尤。 | fog-wind · war-drums · horn |
| 6 | 羲和测影，历象日月 | 尧命羲仲居于旸谷，迎日测影，历象日月星辰。 | waves |
| 7 | 尧舜禅让，舜耕历山 | 舜耕于历山，德行远播；尧终把天下禅让给他。 | ox · wind |
| 8 | 大禹疏九河，水归于海 | 大禹改堵为疏，疏通九河，引众水东归大海。 | rushing-water |

## 其余 20 章（2026-10-10 剧本完成）

- **长度**：镜数 = clamp(4 + ceil(场景数 / 2), 6, 16)，每镜 8 s；上古是 8 镜旧例。20 章共 233 镜（夏 7、商 8、西周 9、春秋 13、战国 15、秦 9、西汉 14、东汉 11、三国 16、两晋 10、南北朝 11、隋 9、唐 16、五代 9、北宋 13、辽西夏金 10、南宋 11、元 10、明 16、清 16）。
- **选镜**：镜头按章内时间线排序；每章的关键场景（`keyScenes` 与 `v1` 场景）都有镜头；场景少于镜数时（夏、商）多出的镜头给高潮场景（少康中兴、鸣条、盘庚迁殷、牧野），场景多于镜数时按时代均匀挑最有代表性的场景。西汉的垓下拆成“四面楚歌”与“乌江”两镜，三国的赤壁拆成“隔江对峙”与“火烧赤壁”两镜。
- **交战与刺杀**只拍之前或之后：旗、雾、血红落日、火光与烟、定住的一团泼墨；不出现兵刃与肢体接触。所有 `imagePrompt` 的负面词在上古的基础上加了 `weapons touching bodies, fighting contact, gore`。
- **运动提示词**：每镜写具体的风、雾、水、旗、火、墨晕动势，后接统一的“slow continuous movement across the whole 8 seconds … steady slow camera, calm historical mood”，以 `keep his/her/their silhouette consistent, no morphing, no new figures, no text. Only black, grey, paper white and vermilion.` 结尾。
- **环境声**：`chapter_audio.py` 新增 fire、rain、thunder、hooves、bell、oars、birds、crowd、snow-wind、drip 十种（全部 numpy 程序合成），与上古的十四种共 24 种；校验器要求剧本里的环境声名都在 `AMB` 表里。
- **旁白时长**：抽测最长的 10 句（24–25 字），edge-tts 读出 5.9–7.6 s；最长一句（唐 16 黄巢）需要末帧延长约 1.2 s，在 2 s 上限内。
- **源与批量文件**：剧本源 `/workspace/gen/chapter-videos/shots.txt`（每行“场景 | 字幕 | 旁白 | 画面 | 动势 | 环境声”），`python3 /workspace/gen/chapter-videos/build_scripts.py --write` 生成 20 份 JSON 和 `/workspace/chapter-video/batch.jsonl`（233 行，`{"ch","n","id","imagePrompt","motionPrompt"}`，按章节顺序）。
- **交付位置**：静帧 `/workspace/chapter-video/<ch>/v2/<ch>-NN.jpg`，片段 `/workspace/chapter-video/<ch>/v2/<ch>-NN.mp4`；到位后按章调色、配音、合成、写清单。

## 状态

| 章 | 剧本 | 静帧 | 片段 | 成片 |
|---|---|---|---|---|
| 上古 | `chapter-videos/shanggu.json`（8 镜） | 8/8 完成（16:9） | v2 8/8 完成（8.04 秒、原生 1280×720，动势更丰富、画面稳定；镜 3 天空偏冷色、镜 7 日出橙黄光晕、镜 6 沙地红色光带，均由调色处理） | 完成：`shanggu.mp4` 65.1 秒 · 1280×720 · 约 12.2 MB · 有声（旁白 + 配乐 + 环境声，−16 LUFS）；海报 jpg/webp |
| 夏 | `chapter-videos/xia.json`（5 场入镜 → 7 镜） | 7/7 完成 | v2 7/7 完成（镜 5 推镜时右侧出现红柱楼阁，调色后保留为少量朱红） | 完成：`xia.mp4` 57.8 秒 · 1280×720 · 约 11.1 MB · 有声（-16.0 LUFS）；海报 jpg/webp |
| 商 | `chapter-videos/shang.json`（6 场入镜 → 8 镜） | 8/8 完成 | v2 8/8 完成（镜 2 按提示光线由淡转灰，结尾偏暗；镜 6 墙上出现人影，未变形） | 完成：`shang.mp4` 65.1 秒 · 1280×720 · 约 14.6 MB · 有声（-16.0 LUFS）；海报 jpg/webp |
| 西周 | `chapter-videos/xizhou.json`（9 场入镜 → 9 镜） | 9/9 完成 | v2 9/9 完成（镜 1 山头两人后段略融成一块剪影；镜 6 天上有一条墨龙（静帧自带，稳定）） | 完成：`xizhou.mp4` 72.4 秒 · 1280×720 · 约 16.0 MB · 有声（-16.1 LUFS）；海报 jpg/webp |
| 春秋 | `chapter-videos/chunqiu.json`（13 场入镜 → 13 镜） | 13/13 完成 | v2 13/13 完成（镜 10 专诸一镜朱红布幔与地面红色较多，未超出色板） | 完成：`chunqiu.mp4` 101.6 秒 · 1280×720 · 约 24.8 MB · 有声（-16.1 LUFS）；海报 jpg/webp |
| 战国 | `chapter-videos/zhanguo.json`（15 场入镜 → 15 镜） | 15/15 完成 | v2 15/15 完成（镜 3 徙木立信人物动作幅度较大，未变形；镜 8 火牛阵牛尾朱红火焰较多，未超出色板） | 完成：`zhanguo.mp4` 116.2 秒 · 1280×720 · 约 20.2 MB · 有声（-16.0 LUFS）；海报 jpg/webp |
| 秦 | `chapter-videos/qin.json`（10 场 → 9 镜，约 1:12） | 0/9 | 0/9 | 待出片 |
| 楚汉 · 西汉 | `chapter-videos/xihan.json`（20 场 → 14 镜，约 1:49） | 0/14 | 0/14 | 待出片 |
| 新 · 东汉 | `chapter-videos/donghan.json`（14 场 → 11 镜，约 1:27） | 0/11 | 0/11 | 待出片 |
| 三国 | `chapter-videos/sanguo.json`（26 场 → 16 镜，约 2:04） | 0/16 | 0/16 | 待出片 |
| 两晋 | `chapter-videos/liangjin.json`（12 场 → 10 镜，约 1:20） | 0/10 | 0/10 | 待出片 |
| 南北朝 | `chapter-videos/nanbeichao.json`（14 场 → 11 镜，约 1:27） | 0/11 | 0/11 | 待出片 |
| 隋 | `chapter-videos/sui.json`（10 场 → 9 镜，约 1:12） | 0/9 | 0/9 | 待出片 |
| 唐 | `chapter-videos/tang.json`（26 场 → 16 镜，约 2:04） | 0/16 | 0/16 | 待出片 |
| 五代十国 | `chapter-videos/wudai.json`（10 场 → 9 镜，约 1:12） | 0/9 | 0/9 | 待出片 |
| 北宋 | `chapter-videos/beisong.json`（18 场 → 13 镜，约 1:42） | 0/13 | 0/13 | 待出片 |
| 辽 · 西夏 · 金 | `chapter-videos/liaojin.json`（11 场 → 10 镜，约 1:20） | 0/10 | 0/10 | 待出片 |
| 南宋 | `chapter-videos/nansong.json`（14 场 → 11 镜，约 1:27） | 0/11 | 0/11 | 待出片 |
| 元 | `chapter-videos/yuan.json`（11 场 → 10 镜，约 1:20） | 0/10 | 0/10 | 待出片 |
| 明 | `chapter-videos/ming.json`（26 场 → 16 镜，约 2:04） | 0/16 | 0/16 | 待出片 |
| 清 | `chapter-videos/qing.json`（26 场 → 16 镜，约 2:04） | 0/16 | 0/16 | 待出片 |
