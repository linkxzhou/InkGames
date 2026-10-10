# video/sources · 史源摘要

每个场景一份史源摘要，按章分目录：`NN-<dynasty>/NN-MM-<scene-id>.md`，每章另有 `README.md` 索引。

每份摘要包含：

- **时间锚点**：入口、出口与场景时间，各自的出处与核验状态；
- **史源一览**：按类别列出（正史与史书、出土与实物、古籍诗文与传奇、笔记、演义与小说、民间传说、戏曲说唱、现代著作），精确到书名加卷、篇或回；演义与现代著作附语料页码；
- **正史线摘要**：本项目自撰的概述（开场旁白、正史线引子、关键情节、结局）；
- **原文短引**：只取公版古籍的一两句，注明出处；
- **野史 / 异说**：来历与性质（是笔记、传奇、演义还是民间传说）、梗概、情节、出处；
- **正史与野史对照**；
- **待核验**：日期或出处尚未坐实的条目。

## 规则

- 叙述一律自己写。引文只用公版古籍（二十四史、《资治通鉴》、先秦诸子、唐宋笔记、明清小说等），每处不超过一两句，必须标书名与卷/篇/回。
- 现代有版权的作品（《明朝那些事儿》《大秦帝国》《五千年演义》等）只写书名与页码，不录原文，也不改写其段落。
- 语料文件（`/workspace/hist/` 下的 PDF 与 OCR 文本）不进仓库，只记 `野史/<文件名>.pdf` 与页码。
- 网络资料以 ctext.org（中国哲学书电子化计划）与维基文库为准核对原文与卷次；百度百科、维基百科只用来定位，不作出处。

## 生成

摘要由 `node video/tools/build-source-digests.mjs` 从 `video/data/chapters/*.json` 生成，改数据后重跑；不要手改 `NN-*/` 下的文件。


<!-- chapters -->

| 目录 | 章 | 场景 |
|---|---|---|
| [00-shanggu](./00-shanggu/README.md) | 上古 | 7 |
| [01-xia](./01-xia/README.md) | 夏 | 5 |
| [02-shang](./02-shang/README.md) | 商 | 7 |
| [03-xizhou](./03-xizhou/README.md) | 西周 | 9 |
| [04-chunqiu](./04-chunqiu/README.md) | 春秋 | 18 |
| [05-zhanguo](./05-zhanguo/README.md) | 战国 | 22 |
| [06-qin](./06-qin/README.md) | 秦 | 10 |
| [07-xihan](./07-xihan/README.md) | 楚汉 · 西汉 | 20 |
| [08-donghan](./08-donghan/README.md) | 新 · 东汉 | 14 |
| [09-sanguo](./09-sanguo/README.md) | 三国 | 26 |
| [10-liangjin](./10-liangjin/README.md) | 两晋 | 12 |
| [11-nanbeichao](./11-nanbeichao/README.md) | 南北朝 | 10 |
| [12-sui](./12-sui/README.md) | 隋 | 10 |
| [13-tang](./13-tang/README.md) | 唐 | 26 |
| [14-wudai](./14-wudai/README.md) | 五代十国 | 10 |
| [15-beisong](./15-beisong/README.md) | 北宋 | 18 |
| [16-liaojin](./16-liaojin/README.md) | 辽 · 西夏 · 金 | 11 |
| [17-nansong](./17-nansong/README.md) | 南宋 | 10 |
| [18-yuan](./18-yuan/README.md) | 元 | 11 |
| [19-ming](./19-ming/README.md) | 明 | 26 |
| [20-qing](./20-qing/README.md) | 清 | 26 |
