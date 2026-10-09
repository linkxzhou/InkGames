#!/usr/bin/env node
// 历史游戏内容校验器（plan 阶段，无依赖）。用法：node plan/11-history-game-data/tools/validate.mjs [--pending]
// 规则见 plan/11-history-game-content-schema.md §4.1。退出码 0 = 零错误。
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), '..');
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

function checkArtPrompts(where, list, scene, cast) {
  if (!Array.isArray(list) || !list.length) return err(where, '缺少 artPrompts（水墨素材提示词）');
  const segIds = new Set(); const assetIds = new Set();
  const perCat = {};
  const declared = {};
  const castIds = new Set((cast ?? []).map(c => c.id));
  const drawnCast = new Set();
  for (const seg of list) {
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
  if (s.v1 !== false) err(where, '大纲条目必须标 v1: false');
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
let v1 = 0, outline = 0, artSheets = 0, artAssets = 0;
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
    if (e.scene.when?.start < last - 200) err(w, '场景时间明显早于前一场景，检查排序');
    last = e.scene.when?.start ?? last;
    checkArtPrompts(w, e.artPrompts, e.scene, e.cast);
    if (Array.isArray(e.artPrompts)) {
      artSheets += e.artPrompts.length;
      artAssets += e.artPrompts.reduce((n, s) => n + (s.assets?.length || 0), 0);
    }
    if (e.v1) {
      v1++;
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
  if (meta && (meta.v1 !== b.scenes.filter(e => e.v1).length || meta.scenes !== b.scenes.length)) err(where, 'index.json 计数与章节文件不一致');
}
if (index.totals.v1 !== v1 || index.totals.outline !== outline) err('index', 'totals 与实际不一致');

console.log(`章节 ${bundles.length}，场景 ${allScenes.size}（首版完整 ${v1}，大纲级 ${outline}），水墨素材 ${artSheets} 张图 / ${artAssets} 件，待核验日期/来源 ${pending.length} 处`);
if (showPending) for (const p of pending) console.log('  待核验 ' + p);
if (errors.length) { console.error(`错误 ${errors.length} 个：\n` + errors.map(e => '  ' + e).join('\n')); process.exit(1); }
console.log('校验通过：0 个错误');
