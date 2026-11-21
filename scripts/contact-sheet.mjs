// Junta capturas numa folha de contato: node scripts/contact-sheet.mjs <dir> <regex> <saida.png> [colunas] [largura]

import { readdirSync } from 'node:fs';

import { chromium } from '@playwright/test';
const [dir, pattern, outFile, cols = '3', cellW = '480'] = process.argv.slice(2);
const files = readdirSync(dir).filter(f => new RegExp(pattern).test(f)).sort();
const html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:6px;font:12px sans-serif;color:#fff">` + files.map(f => `<div><img src="file:///${dir}/${f}" style="width:${cellW}px;display:block"><div>${f}</div></div>`).join('') + '</body>';
const b = await chromium.launch({ channel: 'chrome', headless: true, args:['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: (+cellW + 6) * +cols, height: 400 } });
const { writeFileSync } = await import("node:fs"); writeFileSync(dir + "/_sheet.html", html.replaceAll("file:///" + dir + "/", "")); await p.goto("file:///" + dir + "/_sheet.html"); await p.waitForTimeout(800);
await p.screenshot({ path: outFile, fullPage: true }); await b.close();
