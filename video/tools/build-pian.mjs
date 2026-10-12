#!/usr/bin/env node
// 四篇数据构建：给既有场景分类、生成篇内提示词，并把 src 里的新场景写成查看器脚本。
// 用法（仓库根目录）：node video/tools/build-pian.mjs
// 改 video/data/pian/src/ 之后重跑。不改 chapters/*.json。
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  STYLE_REF_ZH, STYLE_REF_EN, PALETTE_ZH, PALETTE_EN, FIGURE_ZH, FIGURE_EN,
  NEG_STYLE_ZH, NEG_STYLE_EN, MOTION_ZH, MOTION_EN, NEG_MOTION_ZH, NEG_MOTION_EN,
  NEG_MODERN_ZH, NEG_MODERN_EN, negAnachronism,
} from './art-style.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');
const pianDir = join(dataDir, 'pian');
const srcDir = join(pianDir, 'src');
const outViewer = join(root, 'viewer', 'data', 'pian');
const pinyin = JSON.parse(readFileSync(join(root, 'tools', 'name-pinyin.json'), 'utf8'));

const PIAN_IDS = ['zhanchang', 'zhiguo', 'renwu', 'dili'];

const TEMPLATE_SCORE = {
  battle: { zhanchang: 6 },
  siege: { zhanchang: 5, dili: 3 },
  'night-raid': { zhanchang: 5 },
  ambush: { zhanchang: 5 },
  cavalry: { zhanchang: 5, dili: 1 },
  naval: { zhanchang: 4, dili: 2 },
  breakout: { zhanchang: 4, renwu: 2 },
  forest: { zhanchang: 4, dili: 2 },
  court: { zhiguo: 5, renwu: 2 },
  engineering: { zhiguo: 3, dili: 3 },
  journey: { renwu: 3, dili: 3 },
  calligraphy: { renwu: 4, zhiguo: 1 },
  'dialogue-timing': { renwu: 5, zhiguo: 1 },
  stealth: { renwu: 4, zhanchang: 1 },
  duel: { zhanchang: 3, renwu: 3 },
  riddle: { renwu: 3, zhiguo: 2 },
  banquet: { renwu: 4 },
  survival: { renwu: 4, zhanchang: 1 },
  evacuate: { renwu: 3, dili: 2, zhanchang: 2 },
  trace: { renwu: 4 },
  tutorial: { renwu: 2, zhiguo: 1 },
  finale: { renwu: 2, zhanchang: 2 },
};

const KW = {
  zhanchang: ['战', '伐', '阵', '围', '军', '破', '斩', '骑', '攻城', '起义', '北伐', '鏖', '袭', '伏', '兵变'],
  zhiguo: ['变法', '改制', '新政', '刑', '法治', '称霸', '盟', '迁都', '书同文', '受禅', '禅让', '科举', '历', '诏', '议', '策', '疏', '制礼', '废'],
  renwu: ['之死', '上书', '诗', '赋', '妃', '公主', '侠', '才'],
  dili: ['关', '河', '江', '城', '塞', '堰', '渠', '长城', '运河', '西域', '出塞', '迁', '渡', '山', '津', '岭', '塘', '都'],
};

const FOCUS = {
  zhanchang: {
    imageZh: '战场主线。画面以军阵、旌旗、壁垒、攻城器械与战尘为中心，队列呈斜向冲势；朱红只用于战旗与血雾，不超过一成。不画兵刃相接，只给列阵或战后定格。',
    imageEn: 'War is the main line: massed troops, banners, ramparts, siege engines and battle dust, the ranks driving on a diagonal. Vermilion only for war flags and blood mist, under ten percent of the frame. No blades meeting — a formation, or a freeze after the battle.',
    videoZh: '图生视频只拍战前的军阵、战鼓声里轻轻扯动的旌旗、尘雾缓移，或战后定住的一团泼墨与一面朱红战旗。',
    videoEn: 'Image-to-video shows only the army forming, banners tugging as if war drums were near, dust drifting slowly, or a frozen splash of ink and one vermilion war-flag after the fighting.',
    musicZh: '配乐以战争为线：战鼓由疏到密，号角拉长，低弦走五声音阶，没有歌词；高潮只一记重鼓，随即收住。',
    musicEn: 'Music follows the war: drums thickening, a long horn, low pentatonic strings, no lyrics; one heavy drum-stroke at the climax, then stop.',
    soundZh: '声响以战场为线：风卷旌旗、远处马蹄、甲片轻碰、鸦鸣、壁垒上的风。不要枪声，不要爆炸，不要现代车辆。',
    soundEn: 'Sound follows the field: wind in banners, distant hooves, armour plates touching, crows, wind on the rampart. No gunfire, no explosions, no modern vehicles.',
  },
  zhiguo: {
    imageZh: '治国主线。画面以朝堂、奏疏、印章、粮仓、渠堰与挂在墙上的典章为中心，布局整齐如卷轴格网；朱红只用于印章，不超过一成。不排军阵，不写厮杀。',
    imageEn: 'Statecraft is the main line: a court hall, memorials, a seal, granaries, a canal or weir, and statutes hung in an orderly scroll-grid. Vermilion only for the seal, under ten percent. No army formations, no combat.',
    videoZh: '图生视频只拍朝会里衣袖轻动、地图上的墨线缓缓延伸、仓廪与渠水几乎静止，镜头缓推后定格。',
    videoEn: 'Image-to-video shows sleeves stirring in court, an ink line slowly extending across a map of reforms, granaries and canal water nearly still, then a slow push into a freeze-frame.',
    musicZh: '配乐庄严，近于朝会：编钟与古琴，缓慢，五声音阶，没有歌词，不要战鼓喧哗。',
    musicEn: 'Music is solemn and courtly: bells and qin, slow, pentatonic, no lyrics, no battlefield drums.',
    soundZh: '声响以朝局为线：殿中回声、竹简展开、脚步在砖地上、远处市声。不要金戈与喊杀。',
    soundEn: 'Sound follows the court: hall reverb, bamboo slips unrolling, footsteps on brick, a distant market. No clash of arms, no war cries.',
  },
  renwu: {
    imageZh: '人物主线。以一尊无五官的剪影肖像为中心，只留冠帽、袖摆与器物的大轮廓，姿态表达这一生的转折；背景大面积留白。朱红不超过一成，多半不用。',
    imageEn: 'A person is the main line: one faceless silhouette portrait, only the big shapes of headgear, sleeves and one object, the pose carrying a turn in the life. Generous empty ground. Vermilion under ten percent, often none.',
    videoZh: '图生视频跟着这个人：衣袖与冠带轻摆，或独坐、或对坐、或踏上远路，镜头缓推，保持同一剪影，不新增人物。',
    videoEn: 'Image-to-video follows this one figure: sleeves and hat-strings stirring, sitting alone or facing another, or setting out on a road. A slow push. Keep the same silhouette. No new figures.',
    musicZh: '配乐是这个人的短动机：一件乐器上的乐句反复，随身世起落只做加减，留白多，五声音阶，没有歌词。',
    musicEn: 'Music is this person\'s leitmotif: a short phrase on one instrument, repeated, only growing or thinning with the life, lots of rest, pentatonic, no lyrics.',
    soundZh: '声响贴着人物：衣料、脚步、这个地点特有的一种环境声，其余尽量静。不要战场群噪。',
    soundEn: 'Sound stays with the person: cloth, footsteps, one ambience that belongs to the place, otherwise quiet. No massed battle noise.',
  },
  dili: {
    imageZh: '地理主线。画成水墨地图的一角：水系、关隘、城址、边墙与一条行军或漕运路线，三四层平涂的山与河；人物只是路线上的小剪影。朱红不超过一成。',
    imageEn: 'Geography is the main line, painted as a corner of an ink map: river systems, passes, cities, frontier walls and one campaign or canal route, mountains and water in three or four flat grey layers. Figures are small silhouettes on the route. Vermilion under ten percent.',
    videoZh: '图生视频让墨线沿水系或路线缓慢延伸，雾在山层间移动，城郭与关隘保持不变形，镜头像沿地图缓缓走过。',
    videoEn: 'Image-to-video lets an ink line creep along the rivers or the route, mist drifting between mountain layers, cities and passes holding their shape, the camera walking slowly along the map.',
    musicZh: '配乐开阔：长音如风沿着地图上的河走远，低而慢，五声音阶，没有歌词，不要紧促的战鼓。',
    musicEn: 'Music is expansive: long tones like wind travelling a river on the map, low and slow, pentatonic, no lyrics, no urgent war drums.',
    soundZh: '声响以地形为线：水声、风过关隘、城门、路上的脚步、远鸦。不要室内朝会的闷响。',
    soundEn: 'Sound follows the terrain: water, wind in a pass, a city gate, footsteps on a road, a distant crow. No muffled court interior.',
  },
};

function json(v) {
  return JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
function strOf(entry, key) {
  const table = entry.strings && entry.strings.strings;
  if (!key) return '';
  return table && key in table ? table[key] : key;
}
function enName(name) {
  return pinyin[name] || name;
}

function classify(entry) {
  const s = entry.scene;
  const title = strOf(entry, s.title);
  const sub = strOf(entry, s.subtitle);
  const text = title + sub;
  const score = { zhanchang: 0, zhiguo: 0, renwu: 0, dili: 0 };
  const tpl = TEMPLATE_SCORE[s.template] || {};
  for (const id of PIAN_IDS) score[id] += tpl[id] || 0;
  for (const id of PIAN_IDS) {
    let hits = 0;
    for (const w of KW[id]) if (text.includes(w)) hits += 1;
    score[id] += Math.min(6, hits * 2);
  }
  const cast = entry.cast || [];
  if (cast.some(c => c.name && (title.includes(c.name) || c.name.includes(title)))) score.renwu += 4;
  if (/堰|渠|治水|运河|长城|灵渠|塘|河/.test(text)) { score.dili += 3; score.zhiguo += 1; }
  if (/战|伐|阵|围|破|斩/.test(text)) score.zhanchang += 2;
  const ranked = PIAN_IDS.slice().sort((a, b) => score[b] - score[a] || PIAN_IDS.indexOf(a) - PIAN_IDS.indexOf(b));
  let primary = ranked[0];
  if (score[primary] <= 0) primary = 'renwu';
  // 标题本身在讲地形、水利、都城或道路时，主线归地理篇。
  if (/治水|堰|渠|运河|长城|灵渠|迁殷|凿空|海塘|大都|阴平|宅兹|成周|都江|石桥/.test(text) && score.dili >= score[primary] - 3) primary = 'dili';
  let also = ranked.filter(id => id !== primary && score[id] >= 3 && score[primary] - score[id] <= 3);
  const template = s.template || '';
  const ensure = (id) => { if (id !== primary && !also.includes(id)) also.push(id); };
  if (primary === 'dili') ensure('zhiguo');
  if (template === 'siege' || template === 'naval' || template === 'journey') ensure('dili');
  if (template === 'court' || template === 'dialogue-timing') ensure('renwu');
  if ((template === 'battle' || template === 'duel' || template === 'cavalry') && score.renwu >= 4) ensure('renwu');
  also = also.filter(id => id !== primary).slice(0, 2);
  return { primary, also, score };
}

function sceneFacts(entry, meta) {
  const s = entry.scene;
  const title = strOf(entry, s.title);
  const subtitle = strOf(entry, s.subtitle);
  const when = s.when || {};
  const setting = (entry.videoPrompt && entry.videoPrompt.setting) || {};
  const cast = (entry.cast || []).slice(0, 6);
  const whoZh = cast.map(c => c.name + (c.title ? '（' + c.title + '）' : '')).join('、') || title;
  const whoEn = cast.map(c => enName(c.name)).join(', ') || title;
  return {
    id: s.id,
    chapter: meta.id,
    chapterName: meta.name,
    title,
    subtitle,
    display: when.display || '',
    era: when.era || '',
    year: when.start,
    placeZh: setting.zh || subtitle || meta.name,
    placeEn: setting.en || subtitle || meta.name,
    whoZh,
    whoEn,
    template: s.template || '',
    order: Number(meta.no),
  };
}

function promptsFor(facts, pian) {
  const f = FOCUS[pian];
  const whenZh = [facts.display, facts.era].filter(Boolean).join('，');
  const whenEn = facts.display || '';
  const imageZh = `${STYLE_REF_ZH}。${f.imageZh}这一帧画${facts.chapterName}「${facts.title}」${facts.subtitle ? '（' + facts.subtitle + '）' : ''}，时间${whenZh || '见场景纪年'}。地点与格局：${facts.placeZh}。人物：${facts.whoZh}。${FIGURE_ZH}。${PALETTE_ZH}。侧视，地平线在下三分之一，三四层平涂灰阶，大面积留白。画面内不写字。`;
  const imageEn = `${STYLE_REF_EN}. ${f.imageEn} This still is "${facts.title}"${facts.subtitle ? ' (' + facts.subtitle + ')' : ''} in the ${facts.chapterName} chapter, ${whenEn}. Place and layout: ${facts.placeEn}. Figures: ${facts.whoEn}. ${FIGURE_EN}. ${PALETTE_EN}. Side view, horizon on the lower third, three or four flat grey layers, generous empty space. No text in the frame.`;
  const videoZh = `${imageZh}${f.videoZh}${MOTION_ZH}。`;
  const videoEn = `${imageEn} ${f.videoEn} ${MOTION_EN}.`;
  const anaZh = negAnachronism(facts.order, 'zh');
  const anaEn = negAnachronism(facts.order, 'en');
  const negImgZh = `${NEG_STYLE_ZH}。${NEG_MODERN_ZH}。${anaZh}`;
  const negImgEn = `${NEG_STYLE_EN}. ${NEG_MODERN_EN}. ${anaEn}`;
  const negVidZh = `${negImgZh}。${NEG_MOTION_ZH}`;
  const negVidEn = `${negImgEn}. ${NEG_MOTION_EN}`;
  return {
    image: { zh: imageZh, en: imageEn, negative: { zh: negImgZh, en: negImgEn } },
    video: { zh: videoZh, en: videoEn, negative: { zh: negVidZh, en: negVidEn } },
    music: { zh: `${f.musicZh}本场：${facts.chapterName}「${facts.title}」。`, en: `${f.musicEn} This cue: "${facts.title}" in ${facts.chapterName}.`, negative: { zh: `不要电子乐，不要流行歌曲，不要歌词。${NEG_MODERN_ZH}。${anaZh}`, en: `No electronic music, no pop songs, no lyrics. ${NEG_MODERN_EN}. ${anaEn}` } },
    sound: { zh: `${f.soundZh}本场地点：${facts.placeZh}。`, en: `${f.soundEn} Place for this cue: ${facts.placeEn}.`, negative: { zh: `不要现代环境声。${NEG_MODERN_ZH}。${anaZh}`, en: `No modern ambience. ${NEG_MODERN_EN}. ${anaEn}` } },
  };
}

function promptsForNew(scene, meta) {
  const facts = {
    chapterName: meta.name,
    title: scene.title,
    subtitle: scene.subtitle || '',
    display: scene.when.display || '',
    era: scene.when.era || '',
    placeZh: (scene.places || []).join('、') || meta.name,
    placeEn: scene.placeEn || (scene.places || []).join(', ') || meta.name,
    whoZh: (scene.figures || []).map(f => f.name + (f.role ? '（' + f.role + '）' : '')).join('、'),
    whoEn: (scene.figures || []).map(f => f.en || enName(f.name)).join(', '),
    order: Number(meta.no),
  };
  const bundle = {};
  const ids = [scene.pian, ...(scene.also || [])];
  for (const id of ids) bundle[id] = promptsFor(facts, id);
  return bundle;
}

function loadSrcScenes() {
  const dir = join(srcDir, 'scenes');
  const all = [];
  for (const f of readdirSync(dir).filter(n => n.endsWith('.json')).sort()) {
    const list = readJson(join(dir, f));
    if (!Array.isArray(list)) throw new Error(f + ' 应为数组');
    all.push(...list);
  }
  return all;
}

function main() {
  const series = readJson(join(pianDir, 'series.json'));
  const index = readJson(join(dataDir, 'chapters', 'index.json'));
  const overrides = existsOverrides();
  const chapters = {};
  const catalog = [];
  const membership = {};
  const counts = { existing: {}, novel: {}, byChapter: {} };
  for (const id of PIAN_IDS) {
    counts.existing[id] = { primary: 0, also: 0 };
    counts.novel[id] = { primary: 0, also: 0 };
  }

  for (const meta of index.chapters) {
    const bundle = readJson(join(dataDir, meta.file));
    chapters[meta.id] = { meta, bundle };
    counts.byChapter[meta.id] = { name: meta.name, existing: {}, novel: {} };
    for (const id of PIAN_IDS) {
      counts.byChapter[meta.id].existing[id] = 0;
      counts.byChapter[meta.id].novel[id] = 0;
    }
    for (const entry of bundle.scenes) {
      const facts = sceneFacts(entry, meta);
      const auto = classify(entry);
      const forced = overrides[facts.id];
      const primary = forced ? forced.primary : auto.primary;
      const also = forced ? (forced.also || []) : auto.also;
      membership[facts.id] = { primary, also, score: auto.score, template: facts.template };
      counts.existing[primary].primary += 1;
      counts.byChapter[meta.id].existing[primary] += 1;
      for (const id of also) counts.existing[id].also += 1;
      catalog.push({
        id: facts.id,
        outlineId: entry.outlineId,
        chapter: meta.id,
        title: facts.title,
        subtitle: facts.subtitle,
        display: facts.display,
        era: facts.era,
        year: facts.year,
        primary,
        also,
        novel: false,
      });
    }
  }

  const srcScenes = loadSrcScenes();
  const builtScenes = srcScenes.map(scene => {
    const meta = index.chapters.find(c => c.id === scene.chapter);
    if (!meta) throw new Error('新场景朝代不存在：' + scene.id);
    const prompts = promptsForNew(scene, meta);
    counts.novel[scene.pian].primary += 1;
    counts.byChapter[scene.chapter].novel[scene.pian] += 1;
    for (const id of scene.also || []) {
      counts.novel[id].also += 1;
    }
    catalog.push({
      id: scene.id,
      outlineId: '',
      chapter: scene.chapter,
      title: scene.title,
      subtitle: scene.subtitle || '',
      display: scene.when.display,
      era: scene.when.era || '',
      year: scene.when.start,
      primary: scene.pian,
      also: scene.also || [],
      novel: true,
      line: scene.line,
    });
    return { ...scene, prompts };
  });

  const variantsByPian = {};
  const scenesByPian = {};
  for (const id of PIAN_IDS) {
    variantsByPian[id] = {};
    scenesByPian[id] = [];
  }
  for (const meta of index.chapters) {
    const bundle = chapters[meta.id].bundle;
    for (const entry of bundle.scenes) {
      const facts = sceneFacts(entry, meta);
      const mem = membership[facts.id];
      for (const id of [mem.primary, ...mem.also]) variantsByPian[id][facts.id] = promptsFor(facts, id);
    }
  }
  for (const scene of builtScenes) {
    scenesByPian[scene.pian].push(scene);
    for (const id of scene.also || []) {
      if (id !== scene.pian) scenesByPian[id].push(scene);
    }
  }

  mkdirSync(join(pianDir, 'built'), { recursive: true });
  mkdirSync(outViewer, { recursive: true });
  const built = {
    format: 'inkgames.pian-bundle',
    version: 1,
    generator: 'video/tools/build-pian.mjs',
    series,
    membership,
    catalog,
    scenes: builtScenes,
    counts,
  };
  writeFileSync(join(pianDir, 'built', 'pian.json'), JSON.stringify(built, null, 1) + '\n');
  // 查看器要的轻量索引：不含整段提示词
  const viewerIndex = {
    format: 'inkgames.pian-index',
    version: 1,
    series,
    membership,
    catalog,
    counts,
  };
  const head = '/* 自动生成：node video/tools/build-pian.mjs —— 请勿手改 */\n';
  writeFileSync(join(outViewer, 'index.js'), head + 'window.FENGHUO_PIAN = ' + json(viewerIndex) + ';\n');
  for (const id of PIAN_IDS) {
    const pack = { id, variants: variantsByPian[id], scenes: scenesByPian[id].filter(s => s.pian === id || (s.also || []).includes(id)) };
    writeFileSync(join(pianDir, 'built', id + '.json'), JSON.stringify(pack) + '\n');
    writeFileSync(join(outViewer, id + '.js'), head + '(window.FENGHUO_PIAN_PACKS = window.FENGHUO_PIAN_PACKS || {})[' + JSON.stringify(id) + '] = ' + json(pack) + ';\n');
  }

  const lines = ['既有场景分类（主线 / 兼收）：'];
  for (const id of PIAN_IDS) {
    const e = counts.existing[id];
    const n = counts.novel[id];
    lines.push(`  ${id}  旧 ${e.primary} 主线 + ${e.also} 兼收；新 ${n.primary} 主线`);
  }
  lines.push('页面列出（主线+兼收，旧/新）：');
  for (const meta of index.chapters) {
    const cells = PIAN_IDS.map(id => {
      const n = catalog.filter(c => c.chapter === meta.id && (c.primary === id || (c.also || []).includes(id))).length;
      return id.slice(0, 1) + n;
    });
    lines.push('  ' + meta.name + '  ' + cells.join(' '));
  }
  lines.push('新场景主线按朝代：');
  for (const meta of index.chapters) {
    const row = counts.byChapter[meta.id].novel;
    lines.push('  ' + meta.name + '  ' + PIAN_IDS.map(id => id.slice(0, 1) + (row[id] || 0)).join(' '));
  }
  console.log(lines.join('\n'));
  console.log('已写入 video/data/pian/built/ 与 video/viewer/data/pian/');
}

function existsOverrides() {
  try {
    return readJson(join(srcDir, 'overrides.json'));
  } catch {
    return {};
  }
}

main();
