#!/usr/bin/env node
// 由章节数据生成每个场景的史源摘要：video/sources/NN-<dynasty>/NN-MM-<scene-id>.md，
// 外加每章索引 video/sources/NN-<dynasty>/README.md。
//
// 摘要正文全部是本项目自己的叙述（旁白、正史线引子与结局、野史线说明），
// 引文只取公版古籍的短句并注明书名与卷/篇/回；现代作品（kind: modern）只列书名与页码，不录原文。
// 语料（PDF、OCR 文本）不进仓库，这里只记文件名与页码。
//
// 用法：在仓库根目录运行 `node video/tools/build-source-digests.mjs`（幂等，整体重写 video/sources/NN-*/）。无第三方依赖。
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = join(root, 'sources');
const KIND = { canon: '正史与史书', excavated: '出土与实物', classic: '古籍、诗文与传奇', biji: '笔记', novel: '演义与小说', folk: '民间传说与歌谣', opera: '戏曲与说唱', modern: '现代著作（只列页码，不录原文）' };
const KIND_ORDER = Object.keys(KIND);
const PUBLIC_QUOTE_KINDS = new Set(['canon', 'excavated', 'classic', 'biji', 'folk', 'opera']);

const srcText = s => (s.title.includes('《') ? s.title : s.kind === 'modern' || s.kind === 'novel' || s.kind === 'canon' || s.kind === 'classic' || s.kind === 'biji' || s.kind === 'opera' ? '《' + s.title.replace(/^蔡东藩·/, '') + '》' : s.title) +
  (s.title.startsWith('蔡东藩·') ? '（蔡东藩）' : '') + (s.section ? ' ' + s.section : '') + (s.notes ? '（' + s.notes + '）' : '');
const corpusText = s => (s.corpus ? `\`${s.corpus.file}\` ${s.corpus.pages}` : '');
const verifyText = w => (w && w.verify === 'pending' ? ' **〔待核验〕**' + (w.notes ? ' ' + w.notes : '') : w && w.notes ? '（' + w.notes + '）' : '');

function collectSources(scene) {
  const all = [];
  const push = list => { for (const s of list || []) all.push(s); };
  push(scene.anchors?.entry?.sources); push(scene.anchors?.exit?.sources);
  for (const n of scene.plot?.nodes || []) push(n.sources);
  for (const e of scene.endings || []) push(e.sources);
  for (const c of scene.coda?.compare || []) push(c.sources);
  const seen = new Map();
  for (const s of all) { const k = s.kind + '|' + s.title + '|' + (s.section || ''); if (!seen.has(k)) seen.set(k, s); }
  return [...seen.values()];
}
function pendingOf(scene) {
  const out = [];
  const chk = (label, w) => { if (w && w.verify === 'pending') out.push(`${label}：${w.display || ''}${w.notes ? '（' + w.notes + '）' : ''}`); };
  chk('场景时间', scene.when); chk('入口锚点', scene.anchors?.entry?.when); chk('出口锚点', scene.anchors?.exit?.when);
  for (const n of scene.plot?.nodes || []) chk('节点 ' + n.id, n.when);
  for (const s of collectSources(scene)) if (/待核验|待核对/.test(`${s.section ?? ''}${s.notes ?? ''}`)) out.push(`出处：${srcText(s)}`);
  return [...new Set(out)];
}

const index = JSON.parse(readFileSync(join(root, 'data', 'chapters', 'index.json'), 'utf8'));
mkdirSync(outRoot, { recursive: true });
for (const d of readdirSync(outRoot)) if (/^\d\d-/.test(d)) rmSync(join(outRoot, d), { recursive: true, force: true });
let files = 0, pendingTotal = 0;
const chapterRows = [];
for (const c of index.chapters) {
  const bundle = JSON.parse(readFileSync(join(root, 'data', c.file), 'utf8'));
  const dirName = c.file.replace(/^chapters\//, '').replace(/\.json$/, '');
  const dir = join(outRoot, dirName);
  mkdirSync(dir, { recursive: true });
  const ct = bundle.strings?.strings?.[bundle.chapter.title] || c.id;
  const rows = [];
  for (const e of bundle.scenes) {
    const scene = e.scene, S = e.strings?.strings || {};
    const T = k => (k && k in S ? S[k] : '');
    const base = scene.title.replace(/\.title$/, '');
    const sid = scene.id.split('.').pop();
    const name = `${e.outlineId}-${sid}.md`;
    const title = T(scene.title), sub = T(scene.subtitle);
    const sources = collectSources(scene);
    const byKind = KIND_ORDER.map(k => [k, sources.filter(s => s.kind === k)]).filter(([, l]) => l.length);
    const vo = Object.keys(S).filter(k => /^vo\.\d+$/.test(k)).sort().map(k => S[k]);
    const canonEnd = (scene.endings || []).find(x => x.kind === 'canon');
    const legendEnd = (scene.endings || []).find(x => x.kind === 'legend' || x.kind === 'divergent' && x.id === 'end.legend');
    const caption = (e.opening?.tracks?.text || []).find(t => t.kind === 'caption');
    const quote = T(base + '.quote');
    const qs = caption?.source;
    const nodes = scene.plot?.nodes || [];
    const goals = line => nodes.filter(n => n.kind === 'gameplay' && n.line === line).map(n => `- ${n.gameplay.params?.goal || n.id}（玩法：${n.gameplay.template}）`);
    const legendSources = legendEnd?.sources || [];
    const pend = pendingOf(scene);
    pendingTotal += pend.length;
    const L = [];
    L.push(`# ${e.outlineId} ${title}${sub ? ' · ' + sub : ''}`, '');
    L.push(`> ${ct} · ${scene.when?.display || ''}${scene.when?.era ? '（' + scene.when.era + '）' : ''}${verifyText(scene.when)} · 场景 \`${scene.id}\` · 数据见 [../../data/${c.file}](../../data/${c.file})`, '');
    L.push('本文是本项目的史源摘要：叙述为自撰概述；引文只取公版古籍短句并注明出处；现代作品只列书名与页码，不录原文；语料 PDF 不进仓库。', '');
    L.push('## 时间锚点', '');
    const a = scene.anchors || {};
    for (const [label, x] of [['入口', a.entry], ['出口', a.exit]]) if (x) L.push(`- ${label}：${T(x.title) || x.id}，${x.when?.display || ''}${x.when?.era ? '（' + x.when.era + '）' : ''}${verifyText(x.when)}；出处：${(x.sources || []).map(srcText).join('；') || '—'}`);
    L.push('');
    L.push('## 史源一览', '');
    for (const [k, list] of byKind) {
      L.push(`**${KIND[k]}**`, '');
      for (const s of list) L.push(`- ${srcText(s)}${s.corpus ? ' —— 语料 ' + corpusText(s) : ''}`);
      L.push('');
    }
    L.push('## 正史线摘要', '');
    if (T(base + '.pick.canon')) L.push(`*${T(base + '.pick.canon')}*`, '');
    if (vo.length) L.push(vo.join(''), '');
    if (T(base + '.canon.intro')) L.push(T(base + '.canon.intro'), '');
    const cg = goals('canon'); if (cg.length) L.push('关键情节（玩法节点）：', '', ...cg, '');
    if (canonEnd) L.push(`结局：${T(canonEnd.title)}`, '', `出处：${(canonEnd.sources || []).map(srcText).join('；')}`, '');
    if (quote && qs && PUBLIC_QUOTE_KINDS.has(qs.kind)) {
      L.push('## 原文短引（公版）', '');
      L.push(`> ${quote}`, `>`, `> —— ${srcText(qs)}`, '');
    }
    L.push('## 野史 / 异说', '');
    if (T(base + '.pick.legend')) L.push(`*${T(base + '.pick.legend')}*`, '');
    if (T(base + '.legend.disclaimer')) L.push(`来历与性质：${T(base + '.legend.disclaimer')}`, '');
    if (T(base + '.legend.intro')) L.push(`梗概：${T(base + '.legend.intro')}`, '');
    const lg = goals('legend'); if (lg.length) L.push('情节（玩法节点）：', '', ...lg, '');
    if (legendEnd) L.push(`结局：${T(legendEnd.title)}`, '');
    if (legendSources.length) L.push('出处：', '', ...legendSources.map(s => `- ${srcText(s)}${s.corpus ? ' —— 语料 ' + corpusText(s) : ''}`), '');
    const cmp = scene.coda?.compare || [];
    if (cmp.length) {
      L.push('## 正史与野史对照', '', '| 议题 | 正史 | 野史 / 异说 |', '|---|---|---|');
      for (const x of cmp) L.push(`| ${x.topic} | ${x.canon} | ${x.legend} |`);
      L.push('');
    }
    L.push('## 待核验', '');
    L.push(pend.length ? pend.map(p => '- ' + p).join('\n') : '无（日期与出处均已对过原典目录；场景整体仍待人工复核签字，见 `scene.verify`）。', '');
    writeFileSync(join(dir, name), L.join('\n'));
    files++;
    rows.push(`| [${e.outlineId}](./${name}) | ${title}${sub ? ' · ' + sub : ''} | ${scene.when?.display || ''} | ${byKind.map(([k, l]) => KIND[k].replace(/（.*/, '') + ' ' + l.length).join('、')} | ${pend.length || ''} |`);
  }
  writeFileSync(join(dir, 'README.md'), [`# ${c.file.match(/\d\d/)[0]} ${ct} · 史源摘要`, '', `本章 ${bundle.scenes.length} 个场景。生成方式与规则见 [../README.md](../README.md)。`, '', '| ID | 场景 | 年代 | 史源（条数） | 待核验 |', '|---|---|---|---|---|', ...rows, ''].join('\n'));
  chapterRows.push(`| [${dirName}](./${dirName}/README.md) | ${ct} | ${bundle.scenes.length} |`);
}
const readme = readFileSync(join(outRoot, 'README.md'), 'utf8');
const marker = '<!-- chapters -->';
const table = marker + '\n\n| 目录 | 章 | 场景 |\n|---|---|---|\n' + chapterRows.join('\n') + '\n';
writeFileSync(join(outRoot, 'README.md'), readme.includes(marker) ? readme.slice(0, readme.indexOf(marker)) + table : readme + '\n' + table);
console.log(`已生成 ${files} 份史源摘要（${index.chapters.length} 章），待核验条目 ${pendingTotal}`);
