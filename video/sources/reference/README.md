# InkGames 历史考据参考包（history-ref）

整理日期：2026-10-12（UTC+8）。用途：提高 InkGames 21 个朝代章节、300 多个场景中历史信息的准确性和丰富度，并为正史/野史标注提供依据。
所有星数都是当天通过 GitHub API 读取的实际数值；合集仓库的星数是**仓库级**，不是单个 skill 的星数。每个子目录都有 `SOURCE.md`，记录 URL、路径、commit SHA、许可证和下载日期。

> ⚠️ **许可证红线**：CBDB 和 shiji-kb 是 **CC BY-NC-SA 4.0（非商业）**，CHGIS **禁止再分发**（因此没有下载），殆知阁《清史稿》**来源授权不明**。这几类数据**必须放在 gitignore 目录**，不能提交进项目仓库，也不能打包进产品。详见第 4 节。

---

## 1. Agent Skills Top 5（按 GitHub 星数，限历史相关）

| 排名 | Skill | 链接 | Stars（仓库级） | 许可证 | 功能 | 在 InkGames 里怎么用 |
|---|---|---|---|---|---|---|
| 1 | **ljg-classic**（古文笺） | [lijigang/ljg-skills/skills/ljg-classic](https://github.com/lijigang/ljg-skills/tree/9e75497a950d2cc58ab9e6871f76405144687bd9/skills/ljg-classic) | 7487 | MIT | 对文言文逐字注解（字词、句义、异文三色夹注），生成章节解读和讲义长图 PNG | 场景引用的史书原文（如《项羽本纪》片段）用它做逐字注释，用来检查台词是否误读原文；"赭色异文标注"正好用来标出版本差异。依赖 bun/TS 和宿主的 image_gen，只要文字注解也可以只用 `References/AnnotationMethod.md` 的方法 |
| 2 | **sima-qian-style**（太史公曰） | [baojie/shiji-kb/labs/sima-qian-style](https://github.com/baojie/shiji-kb/tree/6b836e3fac1b900ccc6e9299fd6896c0e18ec132/labs/sima-qian-style) | 3418 | CC BY-NC-SA 4.0 | 把现代文改写成《史记》文风（现代名词古化 → 文言 → 太史公句法和修辞），可以附"太史公曰"评语 | 给水墨章节旁白和片尾"太史公曰"式点评定调；它明确**不复述原文、不编史观**，适合写风格，不负责核对史实。同一仓库的知识图谱数据见 data/shiji-kb |
| 3 | **history-research-guide** | [wentorai/research-plugins/…/history-research-guide](https://github.com/wentorai/research-plugins/tree/bf44b3cd617fa94c8a1b254c5d1987142ca3d631/skills/domains/humanities/history-research-guide) | 298（另被 Auto-Empirical-Research-Skills 4579★ 原样收录） | MIT | 历史研究全流程：一手和二手史料、外部考证与内部考证、档案、史学史、数字人文工具 | 作为每个场景考据的"方法论底座"：先区分一手史料（正史本纪列传）和后世追述，再写台词 |
| 4 | **hum-source-criticism** | [asgard-ai-platform/skills/hum-source-criticism](https://github.com/asgard-ai-platform/skills/tree/4e7f4f8e389847757a5a4236c2f1ed9813359179/hum-source-criticism) | 242 | MIT | 史料批判：一手/二手分类、内外考证、多源三角互证、CRAAP 检验、辨识错误信息 | **正史/野史分级**的直接工具：每条场景事实标注"可信度 + 证据来源数"；碰到网文、短视频里流传的"历史冷知识"先过一遍 |
| 5 | **s4h-investigation-source-trace** | [human-avatar/skills-for-humanity/skills/s4h-investigation-source-trace](https://github.com/human-avatar/skills-for-humanity/tree/a30df8b67698ccb03ef5e35d68c2eddc5321ad3f/skills/s4h-investigation-source-trace) | 231 | MIT | 把一个说法追溯到最早出处：谁先说的、依据是什么、传播中怎样走样 | 专门处理**野史**场景：例如"某典故最早见于哪本笔记"，追到最早文本（世说新语、搜神记、宋人笔记……），在 video/sources 里注明"始见于××，正史无载" |

**额外推荐（不计入排名，7★）**：[kltng/humanities-skills](https://github.com/kltng/humanities-skills)，已下载 8 个子 skill 到 `skills/_bonus__kltng__humanities-skills/`：`cbdb-api` / `cbdb-local`（人物）、`chgis-tgaz` / `tgaz-sqlite`（历史地名）、`cjk-calendar`（年号 ↔ 公历，精确到日）、`historical-timeline`、`historical-map`、`wikidata-search`。**它是唯一能直接接入下面这些数据集的 skill 套件，实用性最高。** 仓库没有 LICENSE 文件，6 个 SKILL.md 自称 MIT。

**看过但没有入选的（附星数和原因）**：alchaincyf/nuwa-skill 34088★（人物思维蒸馏，不做史实核查）；brycewang-stanford/Auto-Empirical-Research-Skills 4579★（只是转载 wentorai，按上游计）；Norman-bury/research-writing-skill 3398★（泛人文论文写作）；revfactory/harness-100 1296★（纪录片调研，偏通用）；brycewang-stanford/Awesome-Journal-Skills 1239★（《美国历史评论》投稿写作，和本项目无关）；Mochocyang/QMAI 804★（历史人物人设和小说写作）；jamditis/claude-skills-journalism 417★（新闻核查，通用）；emaynard/claude-family-history-research-skill 117★（西方家谱）；qizhitang/xiaozhi-skills 107★（高中历史史料分析，教学向）；chole12333333/coco-skills 20★（含"历史事实校正""正史写作""历史文言文翻译"，题目非常对口，但星数低且**没有许可证**）；你们仓库已有的 history-santi 对应 StefanCHEN2026/history-santi（6★，MIT）。

---

## 2. 历史数据集（按对本项目的有用程度排序）

| # | 名称 | 链接 | 大小 | 许可证 | 覆盖 | 怎样帮助核查 21 个章节和场景 |
|---|---|---|---|---|---|---|
| 1 | **Kanripo 二十四史 + 编年史**（`data/kanripo-zhengshi-tongjian`） | [github.com/kanripo](https://github.com/kanripo) | 109 MB，28 部书 | **CC BY-SA 4.0** | 二十四史全部（史记→明史）+ 竹书纪年、资治通鉴、续资治通鉴长编、建炎以来系年要录；繁体，带底本页码 | **权威原文**：最终引用以这里为准（可以引到卷和页）。北宋用《长编》，南宋用《系年要录》，上古夏商用《竹书纪年》对照 |
| 2 | **CBDB 中国历代人物传记资料库**（`data/cbdb`） | [cbdb-project/cbdb_sqlite](https://github.com/cbdb-project/cbdb_sqlite)（233★） | zip 133 MB，解压后 587 MB | **CC BY-NC-SA 4.0** ⚠️ | 65.6 万多人，公元前 7 世纪到 19 世纪；唐宋明清最密集 | 人物生卒年、籍贯、字号、官职履历、亲属和社会关系：核对"某人此时是否在世、身居何职、与谁有交往" |
| 3 | **NiuTrans 文白平行语料**（`data/niutrans-classical-modern`） | [NiuTrans/Classical-Modern](https://github.com/NiuTrans/Classical-Modern)（1493★） | 256 MB，33 部书 | MIT | 二十四史、资治通鉴、左传、国语、战国策、尚书、世说新语、搜神记、山海经、逸周书，逐句文白对照 | 快速理解原文、给旁白提供白话参考；野史类（世说、搜神记）也有对照。译文**不是权威译本**，只用来辅助理解 |
| 4 | **年号/历日：DILA + calendar.db**（`data/dila-calendar`） | [DILA-edu/Authority-Databases](https://github.com/DILA-edu/Authority-Databases)（12★）、[kltng/calendar_converter](https://github.com/kltng/calendar_converter)（2★） | 28 MB | **CC BY-SA 3.0**（数据），MIT（代码） | 约公元前 220 年到 1912 年；1637 个年号、772 位帝王、逐月朔闰 | "贞观三年四月"换算成公历日期，查干支，检查年号是否存在、是否已经改元 |
| 5 | **shiji-kb 史记知识图谱**（`data/shiji-kb`） | [baojie/shiji-kb](https://github.com/baojie/shiji-kb)（3418★） | 36 MB | **CC BY-NC-SA 4.0** ⚠️ | 五帝到汉武帝；3198 个事件（98.7% 标了公元纪年）、382 位君主在位年、`year_state_map` 公元年对应各诸侯国君主、人物生卒、家族关系、地名证据 | 上古到西汉 8 个章节的**年代骨架**：春秋战国"某年各国国君是谁"直接查 `chronology/data/year_state_map.json` |
| 6 | **gujilab 古典语料（简体）**（`data/gujilab-classical-corpus`） | [gujilab/chinese-classical-corpus](https://github.com/gujilab/chinese-classical-corpus)（17★） | 48 MB | 自称 CC0（上游来源授权不明） | 二十四史前 15 部 + 资治通鉴，简体 JSON | **用简体台词直接 grep 定位出处**，再回到 Kanripo 核对繁体原文 |
| 7 | **朝代、年号、帝王表**（`data/chinese-history-toolkits-dynasties`） | [SongshGeoLab/chinese_history_toolkits](https://github.com/SongshGeoLab/chinese_history_toolkits)（1★） | 1.4 MB | MIT | 854 行：朝代、年号、帝号、本名、起止年（公元前用负数） | 章节时间轴和"帝王在位年"总表；`chronology_crosscheck.md` 列出了断代工程、万国鼎、上海图书馆三家的分歧，**上古和夏商周章节要特别看** |
| 8 | **cn-era 公元→年号**（`data/cn-era`） | [frankslin/cn-era](https://github.com/frankslin/cn-era)（4★） | 61 KB | MIT | 498 个年号，公元前 140 年到民国，区分正统主线和并立政权 | 给定公元年，快速得到"××年号××年"，适合片头字幕；南北朝、五代、辽夏金这类并立政权可以查到同时存在的多个年号 |
| 9 | **Wikidata 导出**（`data/wikidata-cn-history`） | query.wikidata.org | 306 KB | CC0 | 皇帝 554 行（任期、政权、前任/继任、生卒）、年号 942 条、朝代 60 条 | 第三方交叉核对，还能拿到英文名和 QID（以后做多语言或链接时有用）。日期精度不一，**只作为参考** |
| 10 | **《清史稿》（殆知阁）**（`data/daizhige-qingshigao`） | [garychowcmu/daizhigev20](https://github.com/garychowcmu/daizhigev20)（3488★） | 15 MB | **未声明** ⚠️ | 清史稿全文（简体） | 清章节的正史依据（Kanripo 没有清史稿） |
| — | CHGIS / TGAZ 历史地名（**只有说明**，`data/_source_only/chgis-tgaz`） | [chgis.hudci.org/tgaz](https://chgis.hudci.org/tgaz)、[kltng/tgaz-sqlite](https://github.com/kltng/tgaz-sqlite) | SQLite 228 MB（未下载） | **禁止再分发、禁止商用** ⚠️ | 82,117 个地名，公元前 763 年到 1911 年，带坐标和隶属关系 | "长安/洛阳/建康在某年属于哪个政权、叫什么名字"，用在线 API 查，不落地 |
| — | ctext、殆知阁全量、hunterhug 二十四史（**只有说明**，`data/_source_only/`） | 见各 SOURCE.md | — | 各不相同 | — | ctext 用来人工核对原文出处；殆知阁的杂史和笔记适合查野史出处 |

**章节和史料对照**：上古/夏/商/西周 → 史记本纪 + 竹书纪年 + 尚书/逸周书 + shiji-kb + 断代工程年表；春秋/战国 → 左传、国语、战国策、史记世家 + `year_state_map`；秦/西汉 → 史记、汉书；东汉 → 后汉书；三国 → 三国志 + 资治通鉴（演义类情节 = 野史，需要标注）；两晋 → 晋书 + 世说新语（野史）；南北朝 → 宋、南齐、梁、陈、魏、北齐、周书 + 南史、北史；隋 → 隋书；唐 → 旧唐书、新唐书；五代 → 旧五代史、新五代史；北宋 → 宋史 + 续资治通鉴长编；南宋 → 宋史 + 建炎以来系年要录；辽夏金 → 辽史、金史（**西夏没有正史**，用宋史·夏国传、辽史·西夏外纪、金史·西夏传）；元 → 元史；明 → 明史；清 → 清史稿。人物统一查 CBDB（唐以前也可以用 shiji-kb），地名查 TGAZ，年代查 cn-era、calendar.db 或 dynasty_clean。

---

## 3. 推荐的考据流程（核查一个场景）

1. **定性**：用 `hum-source-criticism` 判断这个场景的说法属于正史、正史异说还是野史；属于野史的，用 `s4h-investigation-source-trace` 追到最早出处。
2. **定年**：公元年 → `data/cn-era/eras.ts`（年号和年数）；具体到月日 → `data/dila-calendar/calendar.db`（配合 `cjk-calendar` skill）；在位帝王 → `chinese-history-toolkits-dynasties/dynasty_clean.csv`；先秦各国 → `shiji-kb/chronology/data/year_state_map.json`。
3. **定人**：解压 `data/cbdb/*.zip` 后用 `cbdb-local` skill 查生卒、官职、关系（看"此时多大年纪、在什么职位"）；汉以前查 `shiji-kb/entities/data/person_lifespans_v2.json`；兜底查 `wikidata-cn-history/emperors_of_china.csv`。
4. **定地**：`chgis-tgaz` skill 在线查（带年份参数 yr），确认地名在那一年的名称和所属政权。
5. **定文**：拿台词或引文去 grep `gujilab-classical-corpus`（简体）定位卷次 → 到 `kanripo-zhengshi-tongjian/<ID>/` 核对繁体原文和页码 → 用 `niutrans-classical-modern` 看白话理解 → 必要时用 `ljg-classic` 逐字注解。
6. **记录**：在 `video/sources/` 对应场景下记"书名·卷·篇（Kanripo ID + pb 页码）｜正史/野史｜可信度｜追溯链"；旁白风格需要时再用 `sima-qian-style` 润色（只改文风，不改事实）。

**辅助脚本思路（只是提议，没有实现）**：`scripts/factcheck_scene.py <scene.md>`
- 读取场景 frontmatter（朝代、公元年、人物[]、地点[]、引文[]、来源类型）；
- 公元年 → 用 cn-era 和 calendar.db 给出年号和干支，并与 dynasty_clean 比对"在位帝王"；
- 人物 → 在 CBDB 本地库查生卒，自动标出"事件年份不在生卒区间内"；
- 地点 → 调 TGAZ API（带 yr），输出当时的地名和隶属；
- 引文 → 在 gujilab 简体全文做模糊匹配（例如 rapidfuzz），返回书名、卷和对应的 Kanripo 文件路径；
- 输出一份 Markdown 报告：✅ 一致 / ⚠️ 存疑 / ❌ 冲突，附出处，供人工复核。
- Wikidata 部分可以把 data/wikidata-cn-history/SOURCE.md 里描述的 SPARQL 固化进脚本，定期刷新。

---

## 4. 许可证和 gitignore 建议

| 必须留在本地（gitignore） | 原因 |
|---|---|
| `data/cbdb/` | CC BY-NC-SA 4.0：禁止商业使用，衍生作品须同协议；schema 另有版权 |
| `data/shiji-kb/`、`skills/baojie__shiji-kb__sima-qian-style/` | CC BY-NC-SA 4.0 |
| `data/daizhige-qingshigao/` | 没有声明许可证 |
| CHGIS/TGAZ（如果以后自行下载） | 禁止再分发和商用 |

| 可以再分发，但要遵守条件 | 条件 |
|---|---|
| `data/kanripo-zhengshi-tongjian/`、`data/dila-calendar/` | CC BY-SA：署名，衍生作品须同协议（把它们的文本混进站点内容时要注意传染性） |
| NiuTrans、cn-era、dynasty 表、4 个 MIT skill | MIT：保留版权声明 |
| Wikidata 导出 | CC0 |
| gujilab | 自称 CC0，但上游数字化来源授权不明，谨慎起见也建议只在本地使用 |

建议在项目根目录的 `.gitignore` 加上 `history-ref/data/` 整个目录（最省事），只把 `README.md` 和各 `SOURCE.md` 提交进仓库。

---

## 5. 目录

```
history-ref/
├── README.md
├── skills/
│   ├── lijigang__ljg-skills__ljg-classic/
│   ├── baojie__shiji-kb__sima-qian-style/
│   ├── wentorai__research-plugins__history-research-guide/
│   ├── asgard-ai-platform__skills__hum-source-criticism/
│   ├── human-avatar__skills-for-humanity__s4h-investigation-source-trace/
│   └── _bonus__kltng__humanities-skills/   (8 个子 skill)
└── data/
    ├── kanripo-zhengshi-tongjian/  niutrans-classical-modern/  gujilab-classical-corpus/
    ├── cbdb/  shiji-kb/  dila-calendar/  daizhige-qingshigao/
    ├── chinese-history-toolkits-dynasties/  cn-era/  wikidata-cn-history/
    └── _source_only/ (chgis-tgaz, ctext, daizhige-full, hunterhug-china-history)
```
