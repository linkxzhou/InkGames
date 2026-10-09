#!/usr/bin/env node
// 把 chapters/*.json 转成 data/*.js（设置 window 全局变量），
// 供 index.html 在 file:// 下用 <script> 直接加载（不使用 fetch）。
// 用法：在 plan/11-history-game-data/ 下运行 `node tools/build-viewer-data.mjs`
// 无第三方依赖。改完章节 JSON 后需重新运行。
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'data');
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) if (f.endsWith('.js')) unlinkSync(join(outDir, f));

const index = JSON.parse(readFileSync(join(root, 'chapters', 'index.json'), 'utf8'));
const head = '/* 自动生成：node tools/build-viewer-data.mjs —— 请勿手改，改 chapters/*.json 后重新生成 */\n';
const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

writeFileSync(join(outDir, 'index.js'),
  head + 'window.HISTORY_GAME_INDEX = ' + json(index) + ';\nwindow.HISTORY_GAME_CHAPTERS = window.HISTORY_GAME_CHAPTERS || {};\n');
let bytes = 0;
for (const c of index.chapters) {
  const bundle = JSON.parse(readFileSync(join(root, c.file), 'utf8'));
  const name = c.file.replace(/^chapters\//, '').replace(/\.json$/, '.js');
  const body = head + '(window.HISTORY_GAME_CHAPTERS = window.HISTORY_GAME_CHAPTERS || {})[' +
    JSON.stringify(c.id) + '] = ' + json(bundle) + ';\n';
  writeFileSync(join(outDir, name), body);
  bytes += Buffer.byteLength(body);
}
console.log(`已生成 data/index.js 与 ${index.chapters.length} 个章节脚本，共 ${(bytes / 1024).toFixed(0)} KiB`);
console.log('index.html 中的 <script> 列表：');
for (const c of index.chapters) console.log(`<script src="data/${c.file.replace(/^chapters\//, '').replace(/\.json$/, '.js')}"></script>`);
