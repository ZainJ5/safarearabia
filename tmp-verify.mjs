import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
const execFileP = promisify(execFile);
const GOLD = '#C49A2E', BROWN = '#3B2509', INK = '#3A2A12', DOT = '#E7D8B5', CREAM = '#FFFDF8';
const HEAD_GRAD = 'linear-gradient(180deg,#C9A24E,#A87E2B)', HEAD_BOT = '#A87E2B', HEAD_DK = 'linear-gradient(180deg,#B5912E,#96752A)', HEAD_LT = 'linear-gradient(180deg,#DCC07A,#C6A24C)';
const U = 'M12 12.5a4 4 0 100-8 4 4 0 000 8zM4.5 20c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5';
const PHONE = 'M5 4h3.6l1.8 4.5-2.3 1.7a12 12 0 005 5l1.7-2.3 4.5 1.8V18a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z';
function ico(d, c) { return `<svg width="15" height="15" viewBox="0 0 24 24" style="display:block"><path d="${d}" fill="none" stroke="${c || GOLD}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function badge(d, ring, glyph, bg) { return `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;border:1.5px solid ${ring || GOLD};background:${bg || '#fff'};flex-shrink:0">${ico(d, glyph)}</span>`; }
function flourish(flip) { return `<svg width="84" height="12" viewBox="0 0 92 12" style="display:block;transform:${flip ? 'scaleX(-1)' : 'none'}"><circle cx="3" cy="6" r="1.5" fill="${GOLD}"/><line x1="7" y1="6" x2="80" y2="6" stroke="${GOLD}" stroke-width="1.2" stroke-linecap="round"/><rect x="83.5" y="2.5" width="7" height="7" fill="${GOLD}" transform="rotate(45 87 6)"/></svg>`; }
function row(l, v) { return `<div style="display:flex;align-items:center;gap:9px;padding:6px 2px;border-bottom:1px dotted ${DOT}">${badge(U)}<div style="width:110px;flex-shrink:0;font-size:12px;font-weight:700;color:${INK}">${l}</div><div style="flex-shrink:0;color:#B9A77E;font-weight:700">:</div><div style="flex:1;font-size:12px;color:#2C2113;font-weight:600">${v}</div></div>`; }
function metaBox(label, val, kind) { const bg = kind === 'dk' ? HEAD_DK : HEAD_LT, labc = kind === 'dk' ? 'rgba(255,255,255,0.9)' : BROWN, valc = kind === 'dk' ? '#fff' : BROWN; return `<div style="background-image:${bg};padding:7px 18px;text-align:center"><div style="font-size:9.5px;letter-spacing:1.2px;color:${labc}">${label}</div><div style="font-size:15px;font-weight:700;color:${valc};margin-top:2px">${val}</div></div>`; }

const logoBuf = await fs.readFile('public/Logo.png');
const logoUri = `data:image/png;base64,${logoBuf.toString('base64')}`;
const LH = 82, LW = Math.round(465 * LH / 148);
const header = `<table style="width:100%;border-collapse:collapse;margin-bottom:4px"><tbody><tr>
  <td style="vertical-align:middle;padding:0;width:1px;white-space:nowrap"><img src="${logoUri}" width="${LW}" height="${LH}" style="width:${LW}px;height:${LH}px;max-width:none;display:block;object-fit:contain"/></td>
  <td style="vertical-align:middle;text-align:right;padding:0">
    <div style="font-family:Georgia,serif;font-size:40px;font-weight:700;color:${INK};letter-spacing:3px;line-height:1;margin-bottom:10px">VOUCHER</div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:10px"><div style="display:flex;border-radius:6px;overflow:hidden;border:1px solid ${HEAD_BOT}">${metaBox('RESERVE NO.', '31194', 'dk')}${metaBox('PRINT DATE', '08 Jun 2026', 'lt')}</div></div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;font-size:11.5px;color:${INK}">
      <div style="display:flex;align-items:center;gap:8px"><span>+92 305 1309051</span>${badge(PHONE)}</div>
    </div></td></tr></tbody></table>`;
const card = `<div style="width:360px"><div style="display:flex;align-items:center;gap:10px;background-image:${HEAD_GRAD};border-radius:8px 8px 0 0;padding:8px 14px">${badge(U, 'rgba(255,255,255,0.9)', '#fff', 'rgba(255,255,255,0.16)')}<span style="font-size:12.5px;font-weight:800;color:#fff;letter-spacing:1.1px">GUEST INFORMATION</span></div><div style="border:1px solid ${DOT};border-top:none;border-radius:0 0 10px 10px;background:${CREAM};padding:3px 15px">${row('Guest Name', 'BILAL HAFEEZ')}${row('Nationality', 'Pakistani')}</div></div>`;
const title = `<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin:10px 0 8px">${flourish(true)}${badge('M5 21V4h9v17M14 9h5v12M8 8h2M8 12h2M8 16h2M16 12h1M16 16h1')}<span style="font-family:Georgia,serif;font-size:17px;font-weight:700;color:${BROWN};letter-spacing:1.2px;text-transform:uppercase">Madinah Hotel Details</span>${flourish(false)}</div>`;
const inner = `${header}<div style="height:1.5px;background:${GOLD};opacity:.5;margin:6px 0 10px"></div>${card}${title}`;
const PRINT_CSS = `@page{size:A4 portrait;margin:0}html,body{margin:0;padding:0;background:#fff}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;box-sizing:border-box}#print-doc{width:794px;margin:0 auto}#print-doc>*{width:794px!important}`;
const doc = `<!doctype html><html><head><meta charset="utf-8"/><style>${PRINT_CSS}</style></head><body><div id="print-doc"><div style="width:794px;background:#fff;font-family:Arial;padding:22px 30px">${inner}</div></div></body></html>`;
const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sea-pdf-'));
const hp = path.join(dir, 'd.html'), pp = path.join(dir, 'd.pdf'), prof = path.join(dir, 'prof');
await fs.writeFile(hp, doc, 'utf8');
const chrome = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const fileUrl = 'file:///' + hp.replace(/\\/g, '/');
await execFileP(chrome, ['--headless=new', `--user-data-dir=${prof}`, '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pp}`, '--virtual-time-budget=3000', fileUrl], { timeout: 40000, windowsHide: true });
await fs.copyFile(pp, 'tmp-verify.pdf');
console.log('done');
await fs.rm(dir, { recursive: true, force: true });
