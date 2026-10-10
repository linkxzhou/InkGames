#!/usr/bin/env node
// 为每个场景生成 artPrompts（水墨素材提示词分段），写回 chapters/*.json。
//
// 约定（与 video/docs/content-schema.md §2.10 一致）：
// - 一段 = 一张图 = 一个 4×4 以内的网格，格内每件素材独立完整、透明背景，便于后续按格抠图。
// - 一个场景的素材按分类分段（人物立绘 / 道具器物 / 场景环境 / 水墨特效）；同一分类超过 16 件再拆段。
// - 素材的 ref 指向 src/plugins/prop-brushes.ts 的 PROP_BRUSHES 键，抠图产物可直接登记到引擎预设。
//
// 用法：在仓库根目录运行 `node video/tools/build-art-prompts.mjs`
// 幂等：重复运行会用新结果整体替换 artPrompts，不影响其它字段。无第三方依赖。
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODEL = 'gpt-image-2.5'; // 创作目标名称；具体接口模型 ID 与可用尺寸尚未核实
const CELL = 512; // 规划裁切网格，不作为 API 请求参数直接传递
const MAX_PER_SHEET = 16;

const CATEGORY_ORDER = ['cast', 'props', 'scenery', 'effects'];
const CATEGORY_LABEL = { cast: '人物立绘', props: '道具器物', scenery: '场景环境', effects: '水墨特效' };
const CAST_TYPE_LABEL = { ruler: '君主', minister: '文臣', general: '武将', scholar: '文人', royal: '宗室后妃', other: '其他' };

/** 与 src/core/ink-palette.ts 的 INK_PALETTE 对齐（仅取中文名与 RGB，用于提示词里的点缀色说明）。 */
const COLOR_INFO = {
  black: ['黑色', [26, 26, 26]], white: ['白色', [242, 242, 242]], dark_gray: ['深灰色', [47, 47, 47]],
  medium_gray_new: ['中灰色', [85, 85, 85]], light_gray_new: ['浅灰色', [150, 150, 150]], green: ['绿色', [63, 77, 24]],
  orange: ['橙色', [255, 160, 62]], brown: ['咖啡色', [175, 140, 89]], green_dark: ['墨绿色', [4, 130, 130]],
  blue_dark: ['深蓝色', [57, 80, 192]], purple: ['紫色', [140, 106, 172]], lime: ['浅绿色', [138, 149, 73]],
  light_gray: ['浅灰色', [136, 122, 125]], blue_gray: ['蓝灰色', [138, 57, 26]], terra_cotta: ['赭石色', [112, 79, 57]],
  olive_green: ['橄榄绿', [168, 200, 72]], pink: ['粉红色', [240, 170, 207]], wine_red: ['酒红色', [128, 49, 52]],
  gold_orange: ['金橙色', [233, 175, 52]], gray_brown: ['灰褐色', [128, 125, 114]], sage_gray: ['鼠尾草灰', [121, 132, 129]],
  brick_red: ['砖红色', [159, 114, 85]], silver: ['银灰色', [181, 180, 185]], beige: ['米色', [235, 220, 201]],
  gray_green: ['青灰色', [148, 162, 158]], tan: ['驼色', [210, 169, 151]], khaki: ['卡其色', [165, 162, 147]],
  dusty_rose: ['雾玫瑰色', [203, 243, 251]], mauve_gray: ['淡紫灰', [174, 161, 164]], medium_gray: ['中灰色', [155, 155, 155]],
  red: ['红色', [208, 34, 63]], yellow: ['黄色', [255, 249, 56]], blue: ['蓝色', [2, 66, 109]],
  custom: ['自定义', [26, 26, 26]], coral: ['珊瑚色', [255, 127, 80]], mint: ['薄荷绿', [152, 251, 152]],
};
const hex = (rgb) => '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');

/** 场景 props 里对应“器物”的预设（figure / landscape / water 归入场景环境，不在此列）。 */
const PROP_ASSET = {
  sword: ['长剑', '连鞘长剑，刃口飞白，剑格与剑穗分明'],
  blade: ['大刀', '厚背大刀，刃口留白，刀柄缠绳'],
  spear: ['长枪', '枪身修长，锋尖寒芒，红缨垂坠'],
  bow: ['角弓与箭', '弯弓与箭矢，弓弦紧绷'],
  shield: ['盾牌', '圆盾，墨色包边，正面徽记'],
  'war-horse': ['战马', '奔马侧影，鬃尾飞扬，四蹄腾空'],
  banner: ['旌旗', '高杆大旗，旗面被风鼓起，穗带飘动'],
  // ink-bomb 通常是画火光/爆墨的笔刷效果，不据此臆造场内实体火器。
  'water-brush': ['水刷', '大号毛笔，笔锋含墨将滴'],
  boat: ['舟船', '木舟与船夫，船尾水痕'],
};

/** 过场笔画 label 里出现的场景专属物件（长度很短的名词才收录）。 */
const LABEL_AS_PROP = /^[\u4e00-\u9fa5·]{1,6}$/;
/** 按玩法模板补充的环境构件。 */
const TEMPLATE_SCENERY = {
  court: ['宫殿台基', '朱漆立柱', '仕宦屏风', '几案与席'],
  banquet: ['宴席几案', '青铜酒器', '烛台', '帷帐'],
  siege: ['城墙垛口', '城门与吊桥', '军营帐幕', '烽火台'],
  battle: ['军营帐幕', '旌旗阵列', '拒马鹿角', '远山烟岚'],
  cavalry: ['军营帐幕', '旌旗阵列', '草原缓坡', '远山烟岚'],
  ambush: ['密林', '山道', '灌木与岩石', '夜雾'],
  'night-raid': ['军营帐幕', '夜色云雾', '火把'],
  breakout: ['军营帐幕', '旌旗阵列', '拒马鹿角'],
  naval: ['风帆'],
  journey: ['山道', '关隘', '驿站', '行旅车马'],
  evacuate: ['山道', '关隘', '夜色云雾'],
  stealth: ['密林', '屋舍墙垣', '夜色云雾'],
  forest: ['密林', '竹丛', '山石', '溪流'],
  engineering: ['河渠', '堤坝', '木石料', '山石'],
  riddle: ['屋舍内景', '竹简书卷', '灯烛', '案几'],
  trace: ['屋舍内景', '竹简书卷', '灯烛', '案几'],
  calligraphy: ['书案', '宣纸卷轴', '笔架与砚台', '屏风'],
  'dialogue-timing': ['殿堂内景', '立柱', '帷帐'],
  'riddle-escape': ['屋舍内景', '墙垣', '灯烛'],
  survival: ['荒野', '枯树', '营帐'],
  finale: ['城门', '远山', '长卷留白'],
  duel: ['殿堂立柱', '广场砖地', '帷帐'],
  tutorial: ['纸面留白', '笔架与砚台', '远山', '土坡'],
};

// 场景级选择由剧情数据核对；不能把整章地标自动塞进每个场景。
const SCENE_ART = {
  'qing.humen': { props: ['待销毁鸦片箱'], scenery: ['销烟池', '虎门海岸'] },
  'ming.zhenghe': { scenery: ['宝船'] },
  'sanguo.chibi': { scenery: ['江岸芦苇'] },
  'tang.wuzetian': { scenery: ['无字碑'] },
};

const SCENE_EXCLUDE = {
  'ming.zhenghe': ['烽火台', '大江水面', '江岸芦苇', '楼船'],
  'qing.humen': ['八旗营帐', '河渠', '堤坝', '木石料', '山石'],
  'tang.wuzetian': ['无字'],
};

const GENERIC_LABELS = new Set(['无字', '众人', '军阵', '骑兵', '长兵如林', '近山与地面', 'banner', 'water']);
const SCENERY_LABELS = /^(远山|近山|地面|河水|江海|殿柱|屋檐|城墙|营帐|山石|沙|月)/;
const EFFECT_LABELS = /^(风起|火攻|销烟|烟|火|浪头)/;
const ALIASES = new Map([
  ['舟', '舟船'], ['远山', '远山（淡墨）'], ['河水', '大江水面'],
  ['江海', '海面'], ['远洋海面', '海面'], ['浪头', '白色飞白浪花'],
  ['浪花飞白', '白色飞白浪花'], ['殿柱', '殿堂立柱'], ['卷轴', '地图卷'],
]);

/** 由 props 派生的特效。 */
const PROP_EFFECTS = {
  sword: ['刀光斩击', '血点（朱红，克制）'], blade: ['刀光斩击', '血点（朱红，克制）'],
  spear: ['突刺枪花', '命中溅墨'], bow: ['箭矢破空', '命中靶心墨点'],
  'ink-bomb': ['爆裂墨团', '火星迸射'], 'water-brush': ['水流笔迹', '墨滴下坠'],
  boat: ['船行尾迹', '浪花飞白'], banner: ['风卷旗影'], 'war-horse': ['蹄下墨尘', '鬃毛飞扬'],
};

/** 由玩法模板派生的特效。 */
const TEMPLATE_EFFECTS = {
  siege: ['落石扬尘', '火油烈焰'], naval: ['巨浪拍船'],
  battle: ['冲阵烟尘'], cavalry: ['冲阵烟尘'],
  'night-raid': ['夜色云雾', '火把光晕'], stealth: ['夜色云雾'], ambush: ['夜色云雾'],
  survival: ['风雪飞白'], finale: ['长卷收卷留白'],
};

function cut(text, n = 22) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
}

function gridFor(count) {
  const cols = count <= 4 ? 2 : count <= 9 ? 3 : 4;
  // 最少两行，保证 1024px 高画布的每格均为 512px，余格留空。
  const rows = Math.max(2, Math.ceil(count / cols));
  return { cols, rows };
}

/** 均分：多于一页时按页数平分，避免出现「16 件 + 1 件」这种极不均衡的尾页。 */
function chunk(list, size) {
  if (list.length <= size) return [list.slice()];
  const pages = Math.ceil(list.length / size);
  const base = Math.floor(list.length / pages);
  const extra = list.length % pages;
  const out = [];
  let at = 0;
  for (let i = 0; i < pages; i++) {
    const take = base + (i < extra ? 1 : 0);
    out.push(list.slice(at, at + take));
    at += take;
  }
  return out;
}

/** 收集一个场景的分类素材：{ cast:[], props:[], scenery:[], effects:[] } */
function collectAssets(entry) {
  const scene = entry.scene;
  const props = scene.props || [];
  const cast = entry.cast || [];

  const castAssets = cast.map(c => ({
    id: `${scene.id}.art.cast.${c.id}`,
    name: c.name + (c.title ? `（${cut(c.title, 12)}）` : ''),
    kind: 'figure',
    note: [c.camp, CAST_TYPE_LABEL[c.type]].filter(Boolean).join('·') || undefined,
    ref: { prop: 'figure', actor: c.id },
  }));

  const selected = SCENE_ART[scene.id] || {};
  const excludes = new Set(SCENE_EXCLUDE[scene.id] || []);
  const propAssets = [];
  const seenProps = new Set();
  const pushProp = (name, note, prop, parts) => {
    if (!name || excludes.has(name) || seenProps.has(ALIASES.get(name) || name)) return;
    seenProps.add(ALIASES.get(name) || name);
    propAssets.push({ id: `${scene.id}.art.props.${propAssets.length + 1}`, name, kind: 'prop', note, ref: prop ? { prop, ...(parts ? { parts } : {}) } : undefined });
  };
  for (const p of props) {
    const info = PROP_ASSET[p];
    if (info) pushProp(info[0], info[1], p);
  }
  for (const name of selected.props || []) pushProp(name, '本场景剧情所需', undefined);

  const scenery = [];
  const seenSc = new Set();
  const pushSc = (name) => {
    const concept = ALIASES.get(name) || name;
    if (!name || excludes.has(name) || seenSc.has(concept)) return;
    seenSc.add(concept);
    scenery.push({ id: `${scene.id}.art.scenery.${scenery.length + 1}`, name, kind: 'scenery' });
  };
  if (props.includes('landscape')) { pushSc('远山（淡墨）'); pushSc('近坡（中墨）'); pushSc('土坡地线'); pushSc('草丛（枯笔）'); }
  if (props.includes('water') || props.includes('boat')) {
    pushSc(scene.id === 'ming.zhenghe' || scene.id === 'qing.humen' ? '海面' : '大江水面');
    pushSc('白色飞白浪花'); pushSc('涟漪');
  }
  for (const n of TEMPLATE_SCENERY[scene.template] || []) pushSc(n);
  for (const n of selected.scenery || []) pushSc(n);

  const effects = [];
  const seenFx = new Set();
  const pushFx = (name, note) => {
    const concept = ALIASES.get(name) || name;
    if (!name || excludes.has(name) || seenFx.has(concept) || seenSc.has(concept)) return;
    seenFx.add(concept);
    effects.push({ id: `${scene.id}.art.effects.${effects.length + 1}`, name, kind: 'fx', ...(note ? { note } : {}) });
  };
  pushFx('泼墨墨点飞溅'); pushFx('飞白笔触');
  for (const p of props) for (const n of PROP_EFFECTS[p] || []) pushFx(n);
  for (const n of TEMPLATE_EFFECTS[scene.template] || []) pushFx(n);

  // label 是绘制注释，不等于可独立抠图的实体；未知概念不默认变成器物。
  const castNames = cast.map(c => c.name);
  for (const s of (entry.opening?.tracks?.strokes || [])) {
    const label = (s.label || '').trim();
    if (!label || !LABEL_AS_PROP.test(label) || GENERIC_LABELS.has(label) || excludes.has(label)) continue;
    if (castNames.some(n => label.includes(n) || (label.length >= 2 && n.includes(label)))) continue;
    const source = s.source || {};
    const sourceProp = source.prop || source.brush?.split('.')[0];
    if (label === '匣' || label === '地图卷' || label === '铜柱' || label === '卷轴') pushProp(label, '过场笔画所绘');
    else if (sourceProp === 'figure' || sourceProp === 'banner' || sourceProp === 'boat') continue;
    else if (EFFECT_LABELS.test(label) || sourceProp === 'ink-bomb' || label === '浪头') pushFx(label, '过场笔画所绘');
    else if (label === '无字碑' || SCENERY_LABELS.test(label) || sourceProp === 'landscape' || sourceProp === 'water') pushSc(label);
  }

  return { cast: castAssets, props: propAssets, scenery, effects };
}

function paletteText(bundle) {
  const names = (bundle.chapter.look && bundle.chapter.look.palette) || [];
  const items = names.map(n => COLOR_INFO[n]).filter(Boolean).map(([label, rgb]) => `${label} ${hex(rgb)}`);
  if (!items.length) return '点缀色：仅用朱红（#a63a2e）少量提点';
  return '点缀色（用量克制，只作点睛）：' + items.join('、');
}

function buildPrompt(seg, ctx) {
  const { cols, rows } = seg.grid;
  const lines = [];
  for (let r = 0; r < rows; r++) {
    const cells = [];
    for (let c = 0; c < cols; c++) {
      const a = seg.assets[r * cols + c];
      cells.push(`${r * cols + c + 1}. ` + (a ? a.name + (a.note ? `（${a.note}）` : '') : '留空'));
    }
    lines.push(`第 ${r + 1} 行：` + cells.join('；') + '。');
  }
  const [w, h] = seg.spec.sizePx;
  const prompt = [
    `中国水墨写意素材图（${seg.categoryLabel}），题材：${ctx.subject}。`,
    `画风：写意水墨，焦墨—浓墨—淡墨分层次，枯笔飞白与泼墨墨点飞溅，笔触边缘自然晕开；${ctx.palette}。`,
    `背景：纯透明（alpha 通道；无纸纹、无底色、无投影、无环境光），每格可整格抠图。`,
    `版式：${cols}×${rows} 均匀网格，自上而下、自左而右排列；每格只放一件完整独立素材，居中等大、四周留白、互不重叠、风格统一。`,
    `清单：\n${lines.join('\n')}`,
    `排版参考尺寸：${w}×${h} 像素，每格按 ${seg.spec.cellPx}×${seg.spec.cellPx} 切分；实际生成尺寸以所用服务返回值为准，裁切前须确认比例与透明通道。只有墨线与墨块，不加任何文字、书法、印章、边框、网格线、水印。`,
  ].join('\n');
  return prompt;
}

const NEGATIVE = '文字, 书法, 题字, 印章, 边框, 网格线, 底纹, 纸纹, 背景色, 白底, 阴影, 倒影, 水印, 写实照片, 3D 渲染, 厚涂, 现代器物, 现代服饰, 多余肢体, 五官崩坏';

function buildSceneArtPrompts(bundle, entry) {
  const scene = entry.scene;
  const strings = (entry.strings && entry.strings.strings) || {};
  const title = strings[scene.title] || scene.title;
  const subtitle = strings[scene.subtitle] || scene.subtitle;
  const when = (scene.when && scene.when.display) || '';
  const subject = `${title}·${subtitle}${when ? `（${when}）` : ''}`;
  const ctx = { subject, palette: paletteText(bundle) };
  const pool = collectAssets(entry);

  const segments = [];
  const usedIds = new Set();
  for (const category of CATEGORY_ORDER) {
    const assets = pool[category];
    if (!assets.length) continue;
    const chunks = chunk(assets, MAX_PER_SHEET);
    chunks.forEach((items, i) => {
      const segNo = i + 1;
      const grid = gridFor(items.length);
      const cellPx = CELL;
      const spec = {
        model: MODEL,
        apiVerified: false,
        sizePx: [grid.cols * cellPx, grid.rows * cellPx],
        cellPx,
        background: 'transparent',
        cutout: true,
      };
      const seg = {
        id: `${scene.id}.sheet.${category}.${segNo}`,
        category,
        categoryLabel: CATEGORY_LABEL[category],
        segment: segNo,
        segmentsInCategory: chunks.length,
        grid,
        assets: items.map((a, k) => ({
          slot: k + 1,
          id: a.id,
          name: a.name,
          kind: a.kind,
          ...(a.note ? { note: a.note } : {}),
          ...(a.ref ? { ref: a.ref } : {}),
        })),
        prompt: '',
        negative: NEGATIVE,
        spec,
      };
      seg.prompt = buildPrompt(seg, ctx);
      if (usedIds.has(seg.id)) throw new Error('段 id 重复：' + seg.id);
      usedIds.add(seg.id);
      segments.push(seg);
    });
  }
  return segments;
}

// ---------------- main ----------------
const index = JSON.parse(readFileSync(join(root, 'data', 'chapters', 'index.json'), 'utf8'));
let scenes = 0, segs = 0, bytes = 0;
for (const c of index.chapters) {
  const file = join(root, 'data', c.file);
  const bundle = JSON.parse(readFileSync(file, 'utf8'));
  for (const entry of bundle.scenes) {
    entry.artPrompts = buildSceneArtPrompts(bundle, entry);
    scenes++;
    segs += entry.artPrompts.length;
  }
  const out = JSON.stringify(bundle, null, 1);
  writeFileSync(file, out);
  bytes += Buffer.byteLength(out);
  console.log(`${c.file}：${bundle.scenes.length} 场景，artPrompts ${bundle.scenes.reduce((n, e) => n + e.artPrompts.length, 0)} 段`);
}
console.log(`共 ${scenes} 场景，${segs} 段素材提示词，写回 ${(bytes / 1024).toFixed(0)} KiB`);
