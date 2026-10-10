#!/usr/bin/env node
// 历史游戏内容校验器（无依赖）。用法：node video/tools/validate.mjs [--pending]
// 规则见 video/docs/content-schema.md §4.1。退出码 0 = 零错误。
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, statSync } from 'node:fs';
import { STYLE_ZH, STYLE_EN, STYLE_REF_ZH, STYLE_REF_EN, PALETTE, NEG_STYLE_ZH, NEG_STYLE_EN, ASSET_STYLE_ZH, MOTION_ZH, MOTION_EN, NEG_MOTION_ZH, NEG_MOTION_EN, NEG_MODERN_ZH, NEG_MODERN_EN } from './art-style.mjs';

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const showPending = process.argv.includes('--pending');

const PARTS = {
  sword: ['blade', 'edge', 'ridge', 'guard', 'grip', 'wrap', 'pommel', 'tassel', 'slash', 'splash'],
  blade: ['blade', 'edge', 'spine', 'guard', 'grip', 'pommel', 'pool', 'poolWarm', 'slash'],
  spear: ['shaft', 'head', 'socket', 'tassel', 'target', 'thrust', 'hit'],
  bow: ['limb', 'tip', 'grip', 'string', 'shaft', 'arrowhead', 'fletch', 'butt', 'ring', 'hit'],
  shield: ['wash', 'rim', 'boss', 'emblem', 'rivet', 'threat', 'block'],
  'war-horse': ['halo', 'body', 'neck', 'head', 'ear', 'leg', 'hoof', 'mane', 'tail', 'dust'],
  banner: ['pole', 'finial', 'cloth', 'bleed', 'fold', 'hem', 'streamer', 'gust'],
  'ink-bomb': ['belly', 'shoulder', 'neck', 'rim', 'stopper', 'cord', 'glaze', 'fuse', 'spark', 'burst', 'spill'],
  'water-brush': ['handle', 'node', 'ferrule', 'hair', 'tip', 'drip', 'stroke'],
  boat: ['hull', 'keel', 'canopy', 'canopyLine', 'oar', 'boatman', 'wake'],
  water: ['surface', 'current', 'deep', 'tint', 'crest', 'ripple'],
  landscape: ['farHill', 'nearHill', 'ground', 'grass', 'post'],
  figure: ['head', 'robe', 'limb', 'sash'],
};
const COLORS = new Set(('black white dark_gray medium_gray_new light_gray_new green orange brown green_dark blue_dark purple lime light_gray blue_gray ' +
  'terra_cotta olive_green pink wine_red gold_orange gray_brown sage_gray brick_red silver beige gray_green tan khaki dusty_rose mauve_gray ' +
  'medium_gray red yellow blue custom coral mint').split(' '));
const TEMPLATES = new Set(['tutorial', 'duel', 'battle', 'siege', 'naval', 'engineering', 'journey', 'court', 'riddle', 'forest', 'stealth',
  'dialogue-timing', 'riddle-escape', 'breakout', 'cavalry', 'calligraphy', 'banquet', 'ambush', 'night-raid', 'finale', 'trace', 'survival', 'evacuate']);
const PRECISION = new Set(['day', 'month', 'year', 'circa', 'legend']);
const SRC_KINDS = new Set(['canon', 'excavated', 'novel', 'biji', 'folk', 'opera', 'modern', 'classic']);
const LINES = new Set(['canon', 'legend', 'whatif']);
const NODE_KINDS = new Set(['cutscene', 'gameplay', 'dialogue', 'choice', 'ending']);
const END_KINDS = new Set(['canon', 'legend', 'divergent', 'fail']);
const EFFECTS = new Set(['fade', 'flow', 'distort', 'metallic', 'wash', 'mask', 'freeze', 'inkDisperse', 'bambooBreak']);
const BUSES = new Set(['bgm', 'amb', 'sfx', 'vo']);
const CAST_TYPES = new Set(['ruler', 'minister', 'general', 'scholar', 'royal', 'other']);
const REL_TYPES = new Set(['family', 'sub', 'ally', 'rival', 'mentor', 'other']);
const ART_CATEGORIES = new Set(['cast', 'props', 'scenery', 'effects']);
const ART_KINDS = new Set(['figure', 'prop', 'scenery', 'fx']);
const MAX_STRING = 160;
/** 一张水墨素材图最多 16 格（4×4），格内每件素材独立、透明背景，便于按格抠图。 */
const MAX_ART_PER_SHEET = 16;

/** 美术方向：黑白红武侠水墨剪影（docs/art-style.md）。旧的彩色水墨措辞不得出现在数据、查看器数据与文档里。 */
const OLD_STYLE_DATA = /五色墨|金橙|蓝灰|彩墨|淡彩|设色|赭石|石青|花青|藤黄|皴法|点缀色|gold-orange|blue-grey|five-colou?r ink|colou?rful ink/i;
const OLD_STYLE_DOCS = /皴法山石|五色墨|金橙|蓝灰|彩墨|淡彩|gold-orange|blue-grey|five-colou?r ink|colou?rful ink/i;
const HEXES = PALETTE.map(p => p.hex);
const NEG_ART = NEG_STYLE_ZH.replace(/，/g, ', ').split(', ');
let styleChecked = { video: 0, art: 0 };

const errors = [];
const pending = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const isInt = n => Number.isInteger(n);

function checkDate(where, d) {
  if (!d || typeof d !== 'object') return err(where, '缺少 HistoryDate');
  if (!isInt(d.start)) err(where, 'start 不是整数');
  if (d.start === 0) err(where, '没有公元 0 年');
  if (d.end !== undefined && (!isInt(d.end) || d.end < d.start)) err(where, 'end 无效或早于 start');
  if (!PRECISION.has(d.precision)) err(where, `precision 无效：${d.precision}`);
  if (!d.display) err(where, 'display 为空');
  if (d.verify !== 'done' && d.verify !== 'pending') err(where, 'verify 必须是 done/pending');
  if (d.verify === 'pending') pending.push(`${where}：${d.display}${d.notes ? '（' + d.notes + '）' : ''}`);
}
function checkSources(where, list, { nonEmpty = true } = {}) {
  if (!Array.isArray(list)) return err(where, 'sources 不是数组');
  if (nonEmpty && !list.length) err(where, 'sources 为空');
  for (const s of list) {
    if (!SRC_KINDS.has(s.kind)) err(where, `来源类型无效：${s.kind}`);
    if (!s.title) err(where, '来源缺少 title');
    if (s.corpus && (!s.corpus.file || !s.corpus.pages)) err(where, 'corpus 需要 file 与 pages');
    if (/待核验|待核对/.test(`${s.section ?? ''}${s.notes ?? ''}`)) pending.push(`${where}：来源《${s.title}》${s.section ?? ''} ${s.notes ?? ''}`.trim());
  }
}
function checkCondition(where, c, sceneIds) {
  if (!c || typeof c !== 'object') return err(where, '条件无效');
  for (const k of ['all', 'any']) if (c[k]) c[k].forEach((x, i) => checkCondition(`${where}.${k}[${i}]`, x, sceneIds));
  if (c.not) checkCondition(`${where}.not`, c.not, sceneIds);
  if (c.cleared) {
    const [sid, line] = c.cleared.split('/');
    if (!LINES.has(line)) err(where, `cleared 线名无效：${c.cleared}`);
    if (!sid.includes('*') && !sceneIds.has(sid)) err(where, `cleared 指向不存在的场景：${sid}`);
  }
}
function checkStrings(where, table) {
  if (!table || table.locale !== 'zh-Hans' || typeof table.strings !== 'object') { err(where, '字符串表格式无效'); return {}; }
  for (const [k, v] of Object.entries(table.strings)) {
    if (typeof v !== 'string' || !v.trim()) err(where, `字符串为空：${k}`);
    else if (v.length > MAX_STRING) err(where, `字符串过长（${v.length} 字）：${k}`);
  }
  return table.strings;
}
function needKey(where, strings, key) {
  if (!key || !(key in strings)) err(where, `字符串表缺少键：${key}`);
}
function checkCast(where, cast, rels, characters) {
  const ids = new Set();
  for (const c of cast ?? []) {
    if (!c.id || !c.name) err(where, '人物缺少 id 或 name');
    if (ids.has(c.id)) err(where, `人物 id 重复：${c.id}`);
    ids.add(c.id);
    if (c.type && !CAST_TYPES.has(c.type)) err(where, `人物类型无效：${c.id} ${c.type}`);
  }
  for (const ch of characters ?? []) if (!ids.has(ch)) err(where, `characters 中的 ${ch} 不在 cast 里`);
  for (const r of rels ?? []) {
    if (!ids.has(r.from) || !ids.has(r.to)) err(where, `关系端点不在 cast 里：${r.from}→${r.to}`);
    if (!r.relation) err(where, '关系缺少 relation');
    if (r.type && !REL_TYPES.has(r.type)) err(where, `关系类型无效：${r.type}`);
  }
}

let videoScenes = 0, videoShots = 0;
function checkVideoPrompt(where, v, cast) {
  if (!v || typeof v !== 'object') return err(where, '缺少 videoPrompt（水墨视频生成提示词）：运行 node video/tools/build-video-prompts.mjs');
  videoScenes++;
  if (!v.prompt?.zh || !v.prompt?.en) err(where, 'videoPrompt.prompt 需要 zh 与 en');
  if (!v.negative?.zh || !v.negative?.en) err(where, 'videoPrompt.negative 需要 zh 与 en');
  if (!/^\d+:\d+$/.test(v.aspectRatio || '')) err(where, 'videoPrompt.aspectRatio 无效');
  const shots = v.shots || [];
  if (shots.length < 5 || shots.length > 8) err(where, `videoPrompt 镜头数应为 5–8：${shots.length}`);
  videoShots += shots.length;
  let t = 0;
  const ids = new Set((cast || []).map(c => c.id));
  for (const s of shots) {
    if (!s.zh || !s.en) err(where, `videoPrompt 镜头 ${s.n} 缺少 zh/en`);
    if (s.startSec !== t || !(s.durationSec > 0)) err(where, `videoPrompt 镜头 ${s.n} 时间不连续`);
    t += s.durationSec;
    for (const f of s.figures || []) if (!ids.has(f)) err(where, `videoPrompt 镜头 ${s.n} 人物不在 cast：${f}`);
  }
  if (t !== v.durationSec) err(where, 'videoPrompt.durationSec 与镜头时长之和不一致');
  // 新美术风格：风格块、色板与负面词必须完整出现在 zh 与 en 两版里
  if (v.style?.zh !== STYLE_ZH || v.style?.en !== STYLE_EN) err(where, 'videoPrompt.style 不是 art-style.mjs 的 STYLE_ZH/EN：重跑 build-video-prompts.mjs');
  if (!v.prompt?.zh?.includes(STYLE_REF_ZH) || !v.prompt?.en?.includes(STYLE_REF_EN)) err(where, 'videoPrompt.prompt 缺少黑白红武侠水墨剪影风格声明');
  for (const h of HEXES) if (!v.prompt?.zh?.includes(h) || !v.prompt?.en?.includes(h)) { err(where, `videoPrompt.prompt 缺少色板 ${h}`); break; }
  if (!v.negative?.zh?.includes(NEG_STYLE_ZH) || !v.negative?.en?.includes(NEG_STYLE_EN)) err(where, 'videoPrompt.negative 缺少风格负面词（全彩、Q 版、写实、繁复纹理等）');
  if (!v.prompt?.zh?.includes(MOTION_ZH) || !v.prompt?.en?.includes(MOTION_EN)) err(where, 'videoPrompt.prompt 缺少首帧图生视频与动势克制说明（art-style.mjs MOTION_ZH/EN）');
  if (!v.negative?.zh?.includes(NEG_MOTION_ZH) || !v.negative?.en?.includes(NEG_MOTION_EN)) err(where, 'videoPrompt.negative 缺少运动失败模式负面词');
  if (!v.negative?.zh?.includes(NEG_MODERN_ZH) || !v.negative?.en?.includes(NEG_MODERN_EN)) err(where, 'videoPrompt.negative 缺少现代元素禁令（art-style.mjs NEG_MODERN_ZH/EN）');
  if (OLD_STYLE_DATA.test(JSON.stringify(v))) err(where, `videoPrompt 含旧彩色水墨措辞：${JSON.stringify(v).match(OLD_STYLE_DATA)[0]}`);
  styleChecked.video++;
  for (const c of v.characters || []) if (!ids.has(c.id)) err(where, `videoPrompt 人物不在 cast：${c.id}`);
}

function checkArtPrompts(where, list, scene, cast) {
  if (!Array.isArray(list) || !list.length) return err(where, '缺少 artPrompts（水墨素材提示词）');
  const segIds = new Set(); const assetIds = new Set();
  const perCat = {};
  const declared = {};
  const castIds = new Set((cast ?? []).map(c => c.id));
  const drawnCast = new Set();
  for (const seg of list) {
    if (!seg.prompt?.includes(ASSET_STYLE_ZH)) err(where, `素材段 ${seg.id} 的 prompt 缺少黑白红剪影画风行（art-style.mjs ASSET_STYLE_ZH）`);
    for (const h of HEXES) if (!seg.prompt?.includes(h)) { err(where, `素材段 ${seg.id} 缺少色板 ${h}`); break; }
    for (const n of NEG_ART) if (!seg.negative?.includes(n)) { err(where, `素材段 ${seg.id} 的 negative 缺少风格负面词：${n}`); break; }
    if (!seg.negative?.includes(NEG_MODERN_ZH)) err(where, `素材段 ${seg.id} 的 negative 缺少现代元素禁令（art-style.mjs NEG_MODERN_ZH）`);
    if (OLD_STYLE_DATA.test((seg.prompt || '') + (seg.negative || ''))) err(where, `素材段 ${seg.id} 含旧彩色水墨措辞`);
    styleChecked.art++;
    if (!seg.id || segIds.has(seg.id)) err(where, `素材段 id 缺失或重复：${seg.id}`);
    segIds.add(seg.id);
    if (!seg.id.startsWith(scene.id + '.sheet.')) err(where, `素材段 id 应以 ${scene.id}.sheet. 开头：${seg.id}`);
    if (!ART_CATEGORIES.has(seg.category)) err(where, `素材分类无效：${seg.category}`);
    if (!seg.categoryLabel) err(where, `素材段 ${seg.id} 缺少 categoryLabel`);
    if (!isInt(seg.segment) || seg.segment < 1) err(where, `素材段 ${seg.id} 的 segment 无效`);
    perCat[seg.category] = (perCat[seg.category] || 0) + 1;
    if (seg.segment !== perCat[seg.category]) err(where, `素材段 ${seg.id} 的同分类段号不连续`);
    if (seg.segmentsInCategory !== undefined) {
      if (declared[seg.category] === undefined) declared[seg.category] = seg.segmentsInCategory;
      else if (declared[seg.category] !== seg.segmentsInCategory) err(where, `素材段 ${seg.id} 的 segmentsInCategory 与同分类其它段不一致`);
    }
    if (!seg.grid || !isInt(seg.grid.cols) || !isInt(seg.grid.rows) || seg.grid.cols < 1 || seg.grid.rows < 1) {
      err(where, `素材段 ${seg.id} 的 grid 无效`);
    } else if (seg.grid.cols * seg.grid.rows > MAX_ART_PER_SHEET) {
      err(where, `素材段 ${seg.id} 的网格超过 ${MAX_ART_PER_SHEET} 格，应拆段`);
    }
    if (!Array.isArray(seg.assets) || !seg.assets.length) err(where, `素材段 ${seg.id} 没有素材`);
    else {
      if (seg.assets.length > MAX_ART_PER_SHEET) err(where, `素材段 ${seg.id} 超过 ${MAX_ART_PER_SHEET} 件，应拆段`);
      if (seg.grid && seg.assets.length > seg.grid.cols * seg.grid.rows) err(where, `素材段 ${seg.id} 的 grid 装不下素材`);
      seg.assets.forEach((a, i) => {
        if (a.slot !== i + 1) err(where, `素材 ${a.id} 的 slot 应为 ${i + 1}`);
        if (!a.id || assetIds.has(a.id)) err(where, `素材 id 缺失或重复：${a.id}`);
        assetIds.add(a.id);
        if (!a.name) err(where, `素材缺少 name：${a.id}`);
        if (!ART_KINDS.has(a.kind)) err(where, `素材 kind 无效：${a.id} ${a.kind}`);
        if (a.ref?.prop && !PARTS[a.ref.prop]) err(where, `素材 ref.prop 无效：${a.id} ${a.ref.prop}`);
        if (a.ref?.parts) for (const p of a.ref.parts) if (!PARTS[a.ref.prop]?.includes(p)) err(where, `素材 ref.parts 无效：${a.id} ${a.ref.prop}.${p}`);
        if (a.ref?.actor) {
          if (!castIds.has(a.ref.actor)) err(where, `素材 ref.actor 不在 cast：${a.id} ${a.ref.actor}`);
          if (seg.category === 'cast') drawnCast.add(a.ref.actor);
        }
      });
    }
    if (!seg.prompt || seg.prompt.length < 40) err(where, `素材段 ${seg.id} 的 prompt 为空或过短`);
    const spec = seg.spec;
    if (!spec || spec.background !== 'transparent' || spec.cutout !== true) err(where, `素材段 ${seg.id} 必须要求透明背景且可抠图`);
    if (!spec || !Array.isArray(spec.sizePx) || spec.sizePx.length !== 2 || spec.sizePx.some(n => !isInt(n) || n < 512)) err(where, `素材段 ${seg.id} 的 sizePx 无效`);
    if (!spec || !isInt(spec.cellPx) || spec.cellPx < 64) err(where, `素材段 ${seg.id} 的 cellPx 无效`);
    if (spec?.apiVerified !== false) err(where, `素材段 ${seg.id} 不得将未实测的图像 API 标为已验证`);
    if (spec && seg.grid && Array.isArray(spec.sizePx) && (spec.sizePx[0] !== seg.grid.cols * spec.cellPx || spec.sizePx[1] !== seg.grid.rows * spec.cellPx)) {
      err(where, `素材段 ${seg.id} 的 sizePx 必须等于 grid × cellPx`);
    }
    if (seg.prompt && seg.grid && !seg.prompt.includes(`${seg.grid.cols}×${seg.grid.rows}`)) err(where, `素材段 ${seg.id} 的 prompt 网格描述与 grid 不一致`);
    for (const a of seg.assets ?? []) if (seg.prompt && !seg.prompt.includes(a.name)) err(where, `素材段 ${seg.id} 的 prompt 缺少素材 ${a.name}`);
  }
  for (const id of segIds) if (assetIds.has(id)) err(where, `图段与素材 id 冲突：${id}`);
  for (const c in perCat) if (declared[c] !== undefined && declared[c] !== perCat[c]) err(where, `${c} 分类的 segmentsInCategory=${declared[c]}，实际 ${perCat[c]} 段`);
  for (const c of cast ?? []) if (!drawnCast.has(c.id)) err(where, `人物 ${c.id} 在 cast 分类里没有立绘素材`);
}

function checkScene(where, s, strings, chapterId) {
  if (s.format !== 'inkgames.scene' || s.version !== 1) err(where, 'format/version 无效');
  if (s.chapter !== chapterId || !s.id.startsWith(chapterId + '.')) err(where, `场景 id 与章不符：${s.id}`);
  needKey(where, strings, s.title); needKey(where, strings, s.subtitle);
  checkDate(`${where}.when`, s.when);
  if (!TEMPLATES.has(s.template)) err(where, `玩法模板无效：${s.template}`);
  for (const p of s.props) if (!PARTS[p]) err(where, `道具无效：${p}`);
  const exitId = s.anchors?.exit?.id;
  for (const role of ['entry', 'exit']) {
    const a = s.anchors?.[role];
    if (!a) { err(where, `缺少 ${role} 锚点`); continue; }
    if (!a.id.startsWith(`anchor.${chapterId}.`)) err(where, `锚点 id 应以 anchor.${chapterId}. 开头：${a.id}`);
    needKey(`${where}.anchors.${role}`, strings, a.title);
    checkDate(`${where}.anchors.${role}`, a.when);
    checkSources(`${where}.anchors.${role}`, a.sources);
  }
  if (s.anchors?.entry && s.anchors?.exit && s.anchors.entry.when.start > s.anchors.exit.when.start) err(where, '入口锚点晚于出口锚点');
  if (s.opening !== `cutscene.${s.id}.opening`) err(where, 'opening id 不符合命名');
  needKey(where, strings, s.fork?.prompt);
  // plot graph
  const nodes = new Map();
  for (const n of s.plot.nodes) {
    if (nodes.has(n.id)) err(where, `节点 id 重复：${n.id}`);
    nodes.set(n.id, n);
    if (!NODE_KINDS.has(n.kind)) err(where, `节点类型无效：${n.id}`);
    if (!LINES.has(n.line)) err(where, `节点线无效：${n.id}`);
    if (n.when) checkDate(`${where}.${n.id}`, n.when);
    if (n.sources) checkSources(`${where}.${n.id}`, n.sources);
    if (n.cutscene && !/^cutscene\.[a-z]+\.[a-z0-9-]+\.[a-z0-9-]+$/.test(n.cutscene)) err(where, `过场 id 命名无效：${n.cutscene}`);
    if (n.label) needKey(`${where}.${n.id}`, strings, n.label);
    if (n.dialogue) needKey(`${where}.${n.id}`, strings, n.dialogue);
    if (n.kind === 'gameplay') {
      if (!TEMPLATES.has(n.gameplay?.template)) err(where, `节点 ${n.id} 玩法模板无效`);
      const gp = n.gameplay?.params ?? {};
      if (!gp.goal && !gp.beats && !gp.clues) err(where, `节点 ${n.id} 缺少目标（goal / beats / clues）`);
    }
  }
  const lo = s.anchors?.entry?.when?.start, hi = s.anchors?.exit?.when?.start;
  for (const n of nodes.values()) {
    if (n.line === 'canon' && n.when && isInt(lo) && isInt(hi) && (n.when.start < lo || n.when.start > hi)) err(where, `正史节点 ${n.id} 的时间 ${n.when.display} 不在入口与出口锚点之间`);
  }
  const endings = new Map(s.endings.map(e => [e.id, e]));
  if (!nodes.has(s.plot.start)) err(where, 'plot.start 不存在');
  const fork = nodes.get(s.fork?.at);
  if (!fork || fork.kind !== 'choice') err(where, 'fork.at 必须指向选择节点');
  const edges = n => [...(n.next ?? []), ...(n.choices ?? []).map(c => c.to)];
  for (const n of nodes.values()) {
    for (const t of edges(n)) if (!nodes.has(t)) err(where, `节点 ${n.id} 指向不存在的 ${t}`);
    for (const c of n.choices ?? []) {
      if (!LINES.has(c.seal)) err(where, `选择 ${c.id} 的印章无效`);
      needKey(`${where}.${c.id}`, strings, c.label);
      if (c.seal === 'whatif' && !c.requires) err(where, `推演选项 ${c.id} 必须有解锁条件`);
      if (c.requires) checkCondition(`${where}.${c.id}`, c.requires, new Set([s.id]));
    }
    if (n.kind === 'ending') {
      if (!endings.has(n.ending)) err(where, `结局节点 ${n.id} 引用不存在的结局 ${n.ending}`);
      if (edges(n).length) err(where, `结局节点 ${n.id} 不应有后继`);
    } else if (!edges(n).length) err(where, `节点 ${n.id} 是死胡同（非结局且无后继）`);
    if (n.kind === 'choice' && (n.choices ?? []).length > 3) err(where, '一个分叉点最多 3 个选项');
  }
  // reachability
  const seen = new Set(); const stack = [s.plot.start];
  while (stack.length) { const id = stack.pop(); if (seen.has(id) || !nodes.has(id)) continue; seen.add(id); stack.push(...edges(nodes.get(id))); }
  for (const id of nodes.keys()) if (!seen.has(id)) err(where, `节点 ${id} 从起点不可达`);
  // line purity: from each choice, the branch keeps the choice's line
  for (const c of fork?.choices ?? []) {
    const st = [c.to]; const vis = new Set();
    while (st.length) { const id = st.pop(); if (vis.has(id) || !nodes.has(id)) continue; vis.add(id); const n = nodes.get(id);
      if (n.line !== c.seal) err(where, `分支 ${c.id} 混入了 ${n.line} 线的节点 ${id}`); st.push(...edges(n)); }
    const firstNode = nodes.get(c.to);
    if (c.seal === 'legend' && firstNode && !firstNode.label) err(where, `野史分支 ${c.id} 的第一个节点必须带出处声明 label`);
  }
  const seals = new Set((fork?.choices ?? []).map(c => c.seal));
  if (!seals.has('canon') || !seals.has('legend')) err(where, '分叉点必须同时有正史与野史选项');
  const usedEndings = new Set([...nodes.values()].filter(n => n.kind === 'ending').map(n => n.ending));
  for (const e of s.endings) {
    if (!END_KINDS.has(e.kind)) err(where, `结局类型无效：${e.id}`);
    if (!usedEndings.has(e.id)) err(where, `结局 ${e.id} 没有被任何节点引用`);
    needKey(`${where}.${e.id}`, strings, e.title);
    if (e.mergeTo && e.mergeTo !== exitId) err(where, `结局 ${e.id} 的 mergeTo 必须是本场景出口锚点`);
    if (e.kind === 'canon' && !e.mergeTo) err(where, '正史结局必须汇流到出口锚点');
    if (e.kind === 'legend' && !e.mergeTo) err(where, `野史结局 ${e.id} 没有 mergeTo，应改为 divergent`);
    if (e.kind === 'divergent' && e.archive !== 'yiwenlu') err(where, `歧出结局 ${e.id} 必须记入异闻录`);
    checkSources(`${where}.${e.id}`, e.sources, { nonEmpty: e.kind !== 'divergent' });
  }
  if (!s.coda?.compare?.length) err(where, '史评至少要有一条正野对照');
  for (const c of s.coda?.compare ?? []) { if (!c.topic || !c.canon || !c.legend) err(where, '史评条目不完整'); checkSources(`${where}.coda`, c.sources); }
  if (!s.coda?.unlocks?.cards?.length) err(where, '史评缺少解锁卡片');
  if (s.verify !== 'done' && s.verify !== 'pending') err(where, 'verify 无效');
}

function checkCutscene(where, c, strings, sceneId) {
  if (c.format !== 'inkgames.cutscene' || c.version !== 1) err(where, 'format/version 无效');
  if (c.id !== `cutscene.${sceneId}.opening`) err(where, `过场 id 应为 cutscene.${sceneId}.opening`);
  if (c.clock?.fps !== 60 || c.clock?.mode !== 'frame') err(where, 'clock 必须是 60fps 帧时钟');
  const D = c.durationFrames;
  if (!isInt(D) || D <= 0) err(where, 'durationFrames 无效');
  const layers = new Set(c.layers.map(l => l.id));
  let t = 0;
  for (const s of c.shots) { if (s.from !== t || s.to <= s.from) err(where, `镜头 ${s.id} 不连续`); t = s.to; }
  if (t !== D) err(where, '镜头没有覆盖完整时长');
  const inRange = (k, cue) => { if (!isInt(cue.at) || cue.at < 0 || cue.at > D) err(where, `${k} 时间越界：${cue.at}`); };
  for (const s of c.tracks.strokes) {
    inRange('stroke', s);
    if (!layers.has(s.layer)) err(where, `笔画层不存在：${s.layer}`);
    if (s.mode !== 'live' && s.mode !== 'instant') err(where, '笔画 mode 无效');
    const src = s.source;
    if (src.prop) {
      if (!PARTS[src.prop]) err(where, `笔画道具无效：${src.prop}`);
      for (const p of src.parts ?? []) if (!PARTS[src.prop]?.includes(p)) err(where, `部件无效：${src.prop}.${p}`);
      if (!src.placement) err(where, '道具笔画缺少 placement');
    } else if (src.brush) {
      const [p, part] = src.brush.split('.');
      if (!PARTS[p]?.includes(part)) err(where, `笔刷无效：${src.brush}`);
      if (!COLORS.has(src.color)) err(where, `颜色不在 INK_PALETTE：${src.color}`);
      if ((src.path?.points?.length ?? 0) < 2) err(where, '路径至少两点');
      for (const [x, y] of src.path?.points ?? []) if (x < 0 || x > c.canvas.width || y < 0 || y > c.canvas.height) err(where, `路径点越界：${x},${y}`);
      if (!(src.speed > 0)) err(where, 'speed 必须为正');
    } else if (!src.recording) err(where, '笔画来源必须是 prop、brush 或 recording');
  }
  for (const k of c.tracks.camera) { inRange('camera', k); if (!(k.zoom > 0)) err(where, 'zoom 无效'); }
  const voKeys = new Set();
  for (const x of c.tracks.text) {
    inRange('text', x);
    if (x.until < x.at || x.until > D) err(where, `文字 until 无效：${x.until}`);
    if (x.key) needKey(where, strings, x.key);
    if (x.vo) { needKey(where, strings, x.vo); voKeys.add(x.vo); }
    if (x.kind === 'caption' && !x.source) err(where, '引文字幕必须标出处 source');
  }
  for (const e of c.tracks.effects) { inRange('effect', e); if (!EFFECTS.has(e.kind)) err(where, `效果无效：${e.kind}`); if (e.layer && !layers.has(e.layer)) err(where, `效果层不存在：${e.layer}`); }
  const voAudio = new Set();
  for (const a of c.tracks.audio) {
    inRange('audio', a);
    if (!BUSES.has(a.bus)) err(where, `音频总线无效：${a.bus}`);
    if (a.action !== 'stop' && !a.asset) err(where, '音频缺少 asset');
    if (a.bus === 'vo') { if (!a.key) err(where, '旁白缺少 key'); else { needKey(where, strings, a.key); voAudio.add(a.key); } }
  }
  for (const k of voKeys) if (!voAudio.has(k)) err(where, `字幕 ${k} 没有对应旁白音频`);
  for (const s of c.tracks.sync) { inRange('sync', s); if (s.vo && !voAudio.has(s.vo)) err(where, `同步点等待不存在的旁白 ${s.vo}`); }
  if (!c.tracks.sync.some(s => s.waitFor === 'input' && s.at === D)) err(where, '结尾必须有等待输入的同步点（进入抉择）');
  const kf = c.bake?.keyframes ?? [];
  for (let i = 0; i < kf.length; i++) if (kf[i] <= 0 || kf[i] >= D || (i && kf[i] <= kf[i - 1])) err(where, 'bake 关键帧无效');
}

function checkOutline(where, s, strings, chapterId) {
  if (s.format !== 'inkgames.scene-outline' || s.version !== 1) err(where, 'format/version 无效');
  if (s.chapter !== chapterId || !s.id.startsWith(chapterId + '.')) err(where, '场景 id 与章不符');
  needKey(where, strings, s.title); needKey(where, strings, s.subtitle);
  for (const k of ['canon', 'legend', 'play']) needKey(where, strings, s.hooks?.[k]);
  checkDate(`${where}.when`, s.when);
  if (!TEMPLATES.has(s.template)) err(where, `玩法模板无效：${s.template}`);
  for (const p of s.props) if (!PARTS[p]) err(where, `道具无效：${p}`);
  checkSources(where, s.sources);
}

// ---------------- main ----------------
const index = JSON.parse(readFileSync(join(DATA, 'chapters', 'index.json'), 'utf8'));
const allScenes = new Map(); const outlineIds = new Set();
const bundles = [];
let v1 = 0, full = 0, outline = 0, artSheets = 0, artAssets = 0;
for (const c of index.chapters) {
  const file = join(DATA, c.file);
  if (!existsSync(file)) { err(c.file, '文件不存在'); continue; }
  const b = JSON.parse(readFileSync(file, 'utf8'));
  bundles.push(b);
  for (const e of b.scenes) {
    if (allScenes.has(e.scene.id)) err(c.file, `场景 id 全局重复：${e.scene.id}`);
    allScenes.set(e.scene.id, e);
    if (outlineIds.has(e.outlineId)) err(c.file, `大纲编号重复：${e.outlineId}`);
    outlineIds.add(e.outlineId);
  }
}
if (index.chapters.length !== 21) err('index', `应有 21 章，实际 ${index.chapters.length}`);
for (const b of bundles) {
  const ch = b.chapter; const where = `chapters/${ch.id}`;
  if (b.format !== 'inkgames.chapter-bundle' || ch.format !== 'inkgames.chapter') err(where, 'format 无效');
  const cstr = checkStrings(where, b.strings);
  needKey(where, cstr, ch.title);
  checkDate(`${where}.span`, ch.span);
  // 辽·西夏·金与五代、北宋并行，章节按 order 排，不要求起年递增
  const ids = b.scenes.map(e => e.scene.id);
  if (JSON.stringify(ids) !== JSON.stringify(ch.scenes)) err(where, 'chapter.scenes 与条目不一致');
  for (const k of ch.keyScenes) if (!ids.includes(k)) err(where, `关键场景不在本章：${k}`);
  checkCondition(`${where}.unlock`, ch.unlock, new Set(allScenes.keys()));
  const meta = index.chapters.find(x => x.id === ch.id);
  let last = -Infinity;
  for (const e of b.scenes) {
    const w = `${where}/${e.outlineId} ${e.scene.id}`;
    const strings = checkStrings(w, e.strings);
    if (!/^\d\d-\d\d$/.test(e.outlineId) || e.outlineId.slice(0, 2) !== String(ch.order).padStart(2, '0')) err(w, '大纲编号与章不符');
    if (e.scene.when?.start < last) err(w, '场景须按年代排序：时间早于前一场景');
    last = e.scene.when?.start ?? last;
    checkArtPrompts(w, e.artPrompts, e.scene, e.cast);
    if (e.opening) checkVideoPrompt(w, e.videoPrompt, e.cast);
    if (Array.isArray(e.artPrompts)) {
      artSheets += e.artPrompts.length;
      artAssets += e.artPrompts.reduce((n, s) => n + (s.assets?.length || 0), 0);
    }
    if (typeof e.v1 !== 'boolean') err(w, 'v1（首版发布批次）必须是布尔值');
    if (e.v1) v1++;
    if (e.detail !== undefined && e.detail !== 'full' && e.detail !== 'outline') err(w, `detail 必须是 full/outline：${e.detail}`);
    const isFull = e.detail ? e.detail === 'full' : e.v1 === true;
    if (isFull) {
      full++;
      if (e.scene.format !== 'inkgames.scene') err(w, 'detail=full 的条目必须是完整场景（inkgames.scene）');
      checkScene(w, e.scene, strings, ch.id);
      checkCutscene(`${w} opening`, e.opening, strings, e.scene.id);
      checkCast(w, e.cast, e.relations, e.scene.characters);
      if (!e.relations?.length) err(w, '首版场景需要人物关系');
      if (e.example) {
        const ex = JSON.parse(readFileSync(join(DATA, 'chapters', e.example), 'utf8'));
        if (JSON.stringify(ex.scene) !== JSON.stringify(e.scene) || JSON.stringify(ex.opening) !== JSON.stringify(e.opening)) err(w, '与样例文件不一致');
      }
    } else {
      outline++;
      checkOutline(w, e.scene, strings, ch.id);
      checkCast(w, e.cast, e.relations, e.scene.characters);
    }
  }
  const fullOf = e => (e.detail ? e.detail === 'full' : e.v1 === true);
  if (meta && (meta.v1 !== b.scenes.filter(e => e.v1).length || meta.scenes !== b.scenes.length)) err(where, 'index.json 计数与章节文件不一致');
  if (meta && meta.full !== undefined && meta.full !== b.scenes.filter(fullOf).length) err(where, 'index.json 的 full 计数与章节文件不一致');
  if (meta && meta.outline !== b.scenes.filter(e => !fullOf(e)).length) err(where, 'index.json 的 outline 计数与章节文件不一致');
}

/* ---------- 审计检查（video/docs/audit-2026-10-10.md）：章节规模、重复与模板化文字 ---------- */
const SCENES_MIN = 5, SCENES_MAX = 30;
for (const b of bundles) if (b.scenes.length < SCENES_MIN || b.scenes.length > SCENES_MAX) err(`chapters/${b.chapter.id}`, `每章场景数应在 ${SCENES_MIN}–${SCENES_MAX}：${b.scenes.length}`);
const seen = new Map();
const uniq = (kind, text, sid) => {
  if (!text) return;
  const k = kind + '\u0000' + text;
  if (seen.has(k) && seen.get(k) !== sid) err(sid, `${kind}与 ${seen.get(k)} 完全相同：${text.slice(0, 40)}`);
  else seen.set(k, sid);
};
const TAIL = /(汇流|歧出|分岔|与正史汇流|汇回正史)[。！]?$/;
const META = /玩法|玩家|首版|引擎|关卡/;
for (const [sid, e] of allScenes) {
  const S = e.strings?.strings || {};
  const pre = `scene.${sid}.`;
  uniq('标题', S[e.scene.title], sid);
  uniq('标题+副题', `${S[e.scene.title]}|${S[e.scene.subtitle]}`, sid);
  if (!S[e.scene.title] || !S[e.scene.subtitle]) err(sid, '标题或副题为空');
  if (e.detail !== 'full') continue;
  uniq('分叉提示', S[pre + 'fork.prompt'], sid);
  uniq('正史导语', S[pre + 'canon.intro'], sid);
  for (const [k, v] of Object.entries(S)) {
    if (/\.end\.[a-z0-9-]+$/.test(k) && !/whatif$/.test(k)) {
      uniq('结局文字', v, sid);
      if (TAIL.test(v)) err(sid, `结局文字以流程标记收尾（汇流/歧出应由 mergeTo/kind 表达）：${k}`);
    }
    if ((/^vo\.\d+$/.test(k) || /\.end\.(canon|legend2?)(-alt)?$/.test(k)) && META.test(v)) err(sid, `旁白/结局里混入了制作说明：${k}`);
    if (/\.pick\.canon$/.test(k) && /《([^》]+)》、?《\1》/.test(v)) err(sid, `出处标签书名重复：${v}`);
  }
  for (const s of e.opening?.shots || []) uniq('开场镜头', s.note, sid);
  for (const n of e.scene.plot?.nodes || []) if (n.gameplay) uniq('玩法目标', n.gameplay.params?.goal, sid);
}
// 近似重复：两个场景共用 3 个以上人物且占较小一方的 60% 以上
const NEAR_OK = new Set(['qin.changcheng|qin.shaqiu', 'qin.fenshu|qin.shaqiu', 'xizhou.hezun|xizhou.zhougong', 'sanguo.chibi|sanguo.dandao', 'wudai.chenqiao|beisong.beijiu', 'shang.tangdao|xia.mingtiao', 'tang.anshi|tang.libai', 'tang.caizhou|tang.hanyu']);  // 秦筑城与沙丘、焚书与沙丘、周公东征与营成周、赤壁与单刀会、陈桥与杯酒、鸣条灭夏与汤祷桑林、安史之乱与李白在长安、平淮西与谏佛骨：同一批人物，不同事件
const list = [...allScenes.values()];
for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
  const a = new Set((list[i].cast || []).map(c => c.name)), bn = (list[j].cast || []).map(c => c.name);
  const shared = bn.filter(n => a.has(n));
  const small = Math.min(a.size, bn.length);
  const key = [list[i].scene.id, list[j].scene.id].sort().join('|');
  if (shared.length >= 3 && shared.length / small >= 0.6 && !NEAR_OK.has(key) && !NEAR_OK.has(list[i].scene.id + '|' + list[j].scene.id))
    err(key, `疑似近似重复场景，共用人物：${shared.join('、')}（确属不同事件请加入 NEAR_OK 并说明）`);
}
if (index.totals.v1 !== v1 || index.totals.outline !== outline || (index.totals.full !== undefined && index.totals.full !== full)) err('index', 'totals 与实际不一致');

// 旧彩色水墨措辞扫描：章节数据、查看器数据脚本、文档
{
  const ROOT = resolve(DATA, '..', '..');
  const scan = (dir, re, ext) => { if (!existsSync(dir)) return; for (const f of readdirSync(dir)) if (ext.test(f)) {
    const m = readFileSync(join(dir, f), 'utf8').match(re); if (m) err(join(dir, f).slice(ROOT.length + 1), `含旧彩色水墨措辞：${m[0]}（美术方向见 video/docs/art-style.md）`); } };
  scan(join(DATA, 'chapters'), OLD_STYLE_DATA, /\.json$/);
  scan(join(DATA, '..', 'viewer', 'data'), OLD_STYLE_DATA, /\.js$/);
  scan(join(DATA, '..', 'docs'), OLD_STYLE_DOCS, /\.md$/);
  scan(join(ROOT, 'docs'), OLD_STYLE_DOCS, /^13-art-style\.md$/);
  scan(join(ROOT, 'plan'), OLD_STYLE_DOCS, /\.md$/);
  if (styleChecked.video !== videoScenes) err('style', `videoPrompt 风格检查数 ${styleChecked.video} ≠ 场景数 ${videoScenes}`);
  if (styleChecked.art !== artSheets) err('style', `素材提示词风格检查数 ${styleChecked.art} ≠ 素材图数 ${artSheets}`);
}

// 章节片头剧本 video/data/chapter-videos/<ch>.json：镜数 = clamp(4 + ceil(场景数/2), 6, 16)（上古为 8 镜旧例），
// 镜头按章节时间线排序、来源场景存在、旁白 15–30 字、镜长 8–12.5 秒、提示词带风格块、负面词与现代元素禁令、运动提示词固定结尾、环境声已实现
const NARR_PUNCT = /[，。；、：！？「」『』《》〈〉·—\s]/g;
const SHOT_MAX = 12.5;  // 秒：8 s 片段 × 最多 1.35 倍放慢 + 末帧停留，旁白 30 字也放得下
const MOTION_END = /keep (his|her|their) silhouette consistent, no morphing, no new figures, no text\. Only black, grey, paper white and vermilion\.$/;
let chapterScripts = 0, chapterScriptShots = 0;
{
  const dir = join(DATA, 'chapter-videos');
  const ambSrc = readFileSync(join(DATA, '..', 'tools', 'chapter_audio.py'), 'utf8');
  const AMB = new Set([...ambSrc.matchAll(/'([a-z-]+)': \((?:a_|lambda)/g)].map(m => m[1]));
  if (existsSync(dir)) for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const id = f.replace(/\.json$/, ''), where = 'chapter-video ' + id;
    const ent = index.chapters.find(c => c.id === id);
    if (!ent) { err(where, '剧本对应的章节不存在'); continue; }
    const sp = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const ch = JSON.parse(readFileSync(join(DATA, ent.file), 'utf8'));
    const order = ch.scenes.map(s => s.scene.id), shotsIn = Object.fromEntries(ch.scenes.map(s => [s.scene.id, (s.videoPrompt && s.videoPrompt.shots || []).length]));
    const want = id === 'shanggu' ? 8 : Math.max(6, Math.min(16, 4 + Math.ceil(order.length / 2)));
    chapterScripts++; chapterScriptShots += sp.shots.length;
    if (sp.chapter !== id) err(where, `chapter 字段 ${sp.chapter} ≠ 文件名`);
    if (!String(sp.negative || '').includes(NEG_MODERN_EN)) err(where, 'negative 缺少现代元素禁令（art-style.mjs NEG_MODERN_EN）');
    if (sp.shots.length !== want) err(where, `镜数 ${sp.shots.length}，按 clamp(4 + ceil(${order.length}/2), 6, 16) 应为 ${want}`);
    let last = -1;
    sp.shots.forEach((sh, i) => {
      const w = where + ' 镜 ' + (i + 1);
      if (sh.n !== i + 1) err(w, `n=${sh.n} 不连续`);
      const o = order.indexOf(sh.sceneId);
      if (o < 0) { err(w, '来源场景不在本章：' + sh.sceneId); return; }
      if (o < last) err(w, '镜头未按时间线排序：' + sh.sceneId);
      last = o;
      for (const k of sh.sourceShots || []) if (k < 1 || k > shotsIn[sh.sceneId]) err(w, `sourceShots ${k} 超出场景分镜数 ${shotsIn[sh.sceneId]}`);
      if (!sh.zh || !String(sh.zh).trim()) err(w, '缺少 zh 字幕');
      const n = String(sh.narration || '').replace(NARR_PUNCT, '').length;
      if (n < 15 || n > 30) err(w, `旁白应为 15–30 字，实际 ${n}`);
      // 镜长 = max(8, 旁白偏移 + 旁白 + 换气 + 转场)：旁白放慢后镜头可超过 8 s（片段放慢 + 末帧停留），上限 SHOT_MAX
      if (!(Number(sh.durationSec) >= 7.9 && Number(sh.durationSec) <= SHOT_MAX)) err(w, `时长 ${sh.durationSec}s，应在 8–${SHOT_MAX} s（8 s 片段，旁白长时放慢片段并停留末帧）`);
      if (sh.clipSlowdown != null && !(sh.clipSlowdown >= 1 && sh.clipSlowdown <= 1.35)) err(w, `clipSlowdown ${sh.clipSlowdown} 应在 1–1.35`);
      if (!/^[\x20-\x7e\u2013\u2014\u2019]+$/.test(sh.imagePrompt || '')) err(w, 'imagePrompt 应为英文');
      if (!/wuxia ink silhouette/.test(sh.imagePrompt || '') || !/#b3241c/.test(sh.imagePrompt || '') || !/Negative: other colours, gold/.test(sh.imagePrompt || '')) err(w, 'imagePrompt 缺少风格块或负面词');
      if (id !== 'shanggu' && !MOTION_END.test(sh.motionPrompt || '')) err(w, 'motionPrompt 缺少固定结尾（keep … silhouette consistent … vermilion.）');
      if (!(sh.imagePrompt || '').includes(NEG_MODERN_EN) || !(sh.motionPrompt || '').includes(NEG_MODERN_EN)) err(w, 'imagePrompt / motionPrompt 缺少现代元素禁令（art-style.mjs NEG_MODERN_EN）');
      if (!Array.isArray(sh.ambience) || !sh.ambience.length) err(w, '缺少 ambience');
      else for (const a of sh.ambience) if (!AMB.has(a)) err(w, '环境声未在 chapter_audio.py 实现：' + a);
      if (!['pending', 'done'].includes(sh.status)) err(w, 'status 应为 pending 或 done');
      if (sh.clip !== `${id}-${String(i + 1).padStart(2, '0')}.mp4`) err(w, 'clip 文件名应为 ' + `${id}-${String(i + 1).padStart(2, '0')}.mp4`);
    });
  }
}

// 章节开场视频清单：index.json 与 index.js 一致，所列文件存在，mp4 < 30 MB，章节与剧本存在
let chapterVideos = 0;
{
  const CV = join(DATA, '..', 'viewer', 'assets', 'chapter-videos'), VIEW = join(DATA, '..', 'viewer');
  if (existsSync(join(CV, 'index.json'))) {
    const man = JSON.parse(readFileSync(join(CV, 'index.json'), 'utf8'));
    const js = existsSync(join(CV, 'index.js')) ? readFileSync(join(CV, 'index.js'), 'utf8') : '';
    const m = js.match(/window\.CHAPTER_VIDEOS = ([\s\S]*);\s*$/);
    if (!m || JSON.stringify(JSON.parse(m[1])) !== JSON.stringify(man)) err('chapter-videos', 'index.js 与 index.json 不一致（重跑 video/tools/build-chapter-video.py）');
    for (const [id, e] of Object.entries(man.chapters || {})) {
      chapterVideos++;
      if (!index.chapters.some(c => c.id === id)) err('chapter-videos ' + id, '清单里的章节不存在');
      if (!existsSync(join(DATA, 'chapter-videos', id + '.json'))) err('chapter-videos ' + id, '缺少剧本 video/data/chapter-videos/' + id + '.json');
      else {
        const sp = JSON.parse(readFileSync(join(DATA, 'chapter-videos', id + '.json'), 'utf8'));
        if (sp.output && sp.output.narration) for (const sh of sp.shots) {
          const n = String(sh.narration || '').replace(NARR_PUNCT, '').length;
          if (n < 15 || n > 30) err('chapter-videos ' + id + ' 镜 ' + sh.n, `旁白应为 15–30 字，实际 ${n}`);
        }
        if (!!(sp.output && sp.output.audio) !== !!e.audio) err('chapter-videos ' + id, '清单 audio 与剧本 output.audio 不一致');
      }
      for (const k of ['mp4', 'poster', 'posterWebp']) if (e[k] && !existsSync(join(VIEW, e[k]))) err('chapter-videos ' + id, `${k} 文件不存在：${e[k]}`);
      if (!e.mp4 || !e.poster) err('chapter-videos ' + id, '缺少 mp4 或 poster');
      else if (existsSync(join(VIEW, e.mp4)) && statSync(join(VIEW, e.mp4)).size >= 30 * 1024 * 1024) err('chapter-videos ' + id, 'mp4 超过 30 MB（每章上限，见 AGENTS.md 章节片头视频制作规范）');
    }
  }
}

// 同一来源挂在多个节点上会重复计数：按“场景 + 内容”去重
const pendingUniq = new Set(pending.map(p => { const [w, ...rest] = p.split('：'); return w.split(' ').slice(0, 2).join(' ').replace(/\.[^. ]+$/, '') + '：' + rest.join('：'); }));
const pendingScenes = new Set([...pendingUniq].map(k => k.split('：')[0].split(' ')[0]));
console.log(`章节 ${bundles.length}，场景 ${allScenes.size}（完整 ${full}，大纲级 ${outline}；首版发布批次 v1=${v1}），水墨素材 ${artSheets} 张图 / ${artAssets} 件，水墨视频提示词 ${videoScenes} 场 / ${videoShots} 镜，待核验日期/来源 ${pending.length} 处（去重 ${pendingUniq.size} 条，涉及 ${pendingScenes.size} 个场景）`);
if (showPending) for (const p of pending) console.log('  待核验 ' + p);
if (errors.length) { console.error(`错误 ${errors.length} 个：\n` + errors.map(e => '  ' + e).join('\n')); process.exit(1); }
console.log(`美术风格检查：videoPrompt ${styleChecked.video} 场、素材提示词 ${styleChecked.art} 张均为黑白红武侠水墨剪影风格`);
console.log(`章节开场视频：已合成 ${chapterVideos} 章；剧本 ${chapterScripts} 章 / ${chapterScriptShots} 镜`);
console.log('校验通过：0 个错误');
