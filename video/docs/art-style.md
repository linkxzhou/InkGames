# 美术风格指南：黑白红武侠水墨剪影（简化版）

> 适用范围：`video/` 全部场景的视频生成提示词（`videoPrompt`）、素材提示词（`artPrompts`）、开场分镜与水墨效果用词；引擎侧的取舍见 [docs/13 · 美术风格与引擎影响](../../docs/13-art-style.md)。
> 生成器共用的风格常量在 [`video/tools/art-style.mjs`](../tools/art-style.mjs)，改风格只改那一个文件，再跑 `build-video-prompts.mjs` 与 `build-art-prompts.mjs`。

## 1. 参照：《影之刃》系列（灵游坊 / S-Game）

只作气质参照，**不复制、不引用其任何素材与图片，提示词里不出现其角色名**，提示词统一写作“高反差黑白红武侠水墨剪影风（类《影之刃》，简化版）”。

2026-10 查阅的公开资料（开发者访谈、媒体评测）里，这个系列的视觉大致是：

- **暗黑武侠的冷峻气质**：主题阴郁、画风粗粝，开发者自称“KUNGFUPUNK”，即传统中国元素混搭机关术等幻想设定（游戏陀螺对梁其伟的访谈）。
- **低饱和冷色大背景 + 红色（以及金色）高光**：访谈里明确提到“低饱和度、冷色大背景与红、金色高光的对比”是系列一以贯之的美术要素。
- **人物“大黑大白”的写意轮廓**：《影之刃3》以写意方式构建角色轮廓，用大黑大白的比例表现角色厚度，强调“力”与“形”（游民星空报道）。
- **场景用细密的界画线条再铺幽暗色彩**（《影之刃3》场景美术自述）；《影之刃零》的地图则是画在宣纸上的水墨图。
- **横版动作与动势**：前作为横版格斗，招式靠剪影姿态、刀光和拖影读出来。

我们取其中最适合历史短片与横版引擎的部分：**黑、白、红的高反差，剪影人物，泼墨与血雾的打击感，侧视的武侠戏剧感**。系列里的金色高光、蒸汽朋克机械、细密界画线条与复杂材质，**一律不用**。

## 2. 我们的简化版

一句话：**纸上只有黑、灰、白和一点红；人物是能一眼读懂的大剪影；背景是三四层平涂的灰；只有打击和高潮才泼墨见红。**

### 2.1 色板

| 名称 | Hex | 用途 |
|---|---|---|
| 墨黑 | `#141414` | 人物剪影、近景、兵器、主笔画 |
| 焦灰 | `#3a3a3a` | 近景次要物、剪影内部的少量分块 |
| 中灰 | `#6e6e6c` | 中景山石、建筑剪影 |
| 淡灰 | `#a8a8a4` | 远山第二层、烟 |
| 雾灰 | `#d2d1cc` | 最远层、雾、水面 |
| 纸白 | `#eceae4` | 底色、留白、月、雪、灯火 |
| 朱砂红 | `#b3241c` | **唯一强调色**：血、落日、旗帜、印章 |

规则：朱砂红单帧面积不超过一成；一帧里最多一处红；不出现其他色相（原各章的点缀色只留在数据里作为章节标识，不进入提示词）。

### 2.2 笔线

- 外轮廓用粗笔、侧锋，转折处见棱角，不画圆滑的匀线。
- 枯笔飞白只用在动势方向（衣摆、刀光、马尾、烟），作拖尾。
- 剪影内部最多两三笔焦灰分块，交代臂、甲、袖的前后关系，不画衣纹细节。
- 不用界画尺线、不用皴法密点；山石用块面，不用皴擦。

### 2.3 构图

- 横向侧视为主，地平线放在画面下三分之一，便于和横版引擎镜头一致。
- 三到四个景深层：最远雾灰 → 淡灰山 → 中灰建筑/竹林 → 墨黑主体，层与层之间留白。
- 主体剪影占画面高度三到五成，四周至少三成留白。
- 一帧只讲一件事；群像以成排剪影由黑到灰逐层退远，不画细节人群。

### 2.4 人物

- 头身比约 1:7，武将略高壮，文士略瘦长，孩童 1:4～1:5；不做 Q 版。
- 剪影优先：只保留冠帽、发髻、袖摆、兵器、甲片的大轮廓，背光看也能认出身份与朝代。
- 面部几乎不画五官，最多一笔眉眼或一处留白；表情靠姿态。
- 时代服饰只取轮廓特征（深衣宽袖、幞头、圆领袍、辫发等），避免时代错置。
- 女性、文臣、学者默认不持兵器、不披甲。

### 2.5 效果

- 命中、高潮：大块泼墨炸开，朱红血雾斜向喷溅，随后定格。每场最多一到两次。
- 火：平涂黑焰剪影，焰心一抹朱红；烟：淡灰横向飘散。
- 水：长横笔湿墨，浪头留白；雨雪：细斜线或留白点。
- 转场：墨点放大、浓墨泼满画面、沿画卷横移；不用光效、粒子光晕、镜头光斑。

### 2.6 宜 / 忌

| 宜 | 忌 |
|---|---|
| 黑白灰 + 一点红 | 全彩、粉彩、霓虹色、金色高光 |
| 大块平涂与剪影 | 精细繁复纹理、大量渐变的 CG 质感、写实照片、3D 渲染 |
| 粗笔棱角、飞白拖尾 | 匀细勾线、动漫赛璐璐描边 |
| 极简面部、靠姿态表演 | 精细五官、美颜脸、Q 版萌系大头 |
| 三四层灰的远山雾竹与建筑剪影 | 界画式密集线条、满屏装饰 |
| 少量、符合时代的道具 | 蒸汽朋克机械、现代器物 |

## 3. 在数据里的落点

- `videoPrompt.style`、`videoPrompt.negative`、人物描述末尾的剪影规则、高潮镜的墨效，全部来自 `art-style.mjs`。
- `artPrompts[].prompt` 的“画风”一行与负面词同源；素材仍是透明底，以便引擎分层合成。
- 开场分镜的“水墨效果”词表（火、营帐、军阵、殿柱等）已改为剪影说法。

---

## English summary

**Reference.** S-Game's *Shadow Blade* series is used only as a mood reference — no assets or images are copied and its characters are never named. Prompts call the look "high-contrast black-white-red wuxia ink silhouette art (Shadow-Blade-like, simplified)". Public interviews and press describe the series as dark, gritty wuxia ("kungfupunk") with low-saturation cool backgrounds against red and gold highlights, bold black-and-white character silhouettes, and finely ruled-line environments; we keep only the black-white-red contrast, silhouettes, splash/blood-spray hits and side-view drama, and drop gold highlights, steampunk machinery, ruled-line detail and rich materials.

**Simplified rules.** Palette: ink black #141414, charcoal #3a3a3a, mid grey #6e6e6c, pale grey #a8a8a4, fog grey #d2d1cc, paper white #eceae4, and vermilion #b3241c as the only accent (blood, sun, banners, seals; under 10% of a frame, one red area per frame). Lines: bold angular side-brush contours, dry-brush trails only along motion, no ruled lines or texture strokes. Composition: side view, horizon in the lower third, three or four flat grey depth layers, subject 30–50% of frame height with plenty of empty paper. Characters: ~7 heads tall, silhouette-first (headgear, sleeves, weapon, armour plates), almost no facial features, period costume reduced to outline. Effects: big ink splash plus diagonal vermilion blood-spray freeze on hits or the climax only; flat black flames with a red core; no glows or particles. Generators read these constants from `video/tools/art-style.mjs`.
