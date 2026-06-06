import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const execFileP = promisify(execFile);

/* Locate an installed Chrome/Chromium. Override with CHROME_PATH env if needed. */
export async function findChrome() {
  const fromEnv = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    fromEnv,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  for (const c of candidates) {
    try { await fs.access(c); return c; } catch { /* keep looking */ }
  }
  return null;
}

const PRINT_CSS = `
  @page { size: A4 portrait; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
  #print-doc { width: 794px; margin: 0 auto; }
  #print-doc > * { width: 794px !important; }
  tr, table, img, svg { break-inside: avoid; page-break-inside: avoid; }
`;

/* Render self-contained HTML (inline styles) to an A4 PDF Buffer using the
   installed Chrome. Throws Error('NO_CHROME') if none is found. Uses an isolated
   --user-data-dir so it launches even while the user has Chrome open. */
export async function htmlToPdf(rawHtml) {
  const chrome = await findChrome();
  if (!chrome) throw new Error('NO_CHROME');

  // Inline the logo as a data URI so the file:// render needs no network; strip scripts.
  let body = String(rawHtml).replace(/<script[\s\S]*?<\/script>/gi, '');
  try {
    const logoBuf = await fs.readFile(path.join(process.cwd(), 'public', 'Logo.png'));
    body = body.split('/Logo.png').join(`data:image/png;base64,${logoBuf.toString('base64')}`);
  } catch { /* logo optional */ }

  const doc = `<!doctype html><html><head><meta charset="utf-8"/><style>${PRINT_CSS}</style></head><body><div id="print-doc">${body}</div></body></html>`;

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sea-pdf-'));
  const htmlPath = path.join(dir, 'doc.html');
  const pdfPath = path.join(dir, 'doc.pdf');
  const profileDir = path.join(dir, 'profile');
  try {
    await fs.writeFile(htmlPath, doc, 'utf8');
    // Windows file URLs need three slashes: file:///C:/...
    const p = htmlPath.replace(/\\/g, '/');
    const fileUrl = 'file://' + (p.startsWith('/') ? '' : '/') + p;
    await execFileP(chrome, [
      '--headless=new',
      `--user-data-dir=${profileDir}`,   // isolate so it runs even if Chrome is open
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu',
      '--no-first-run', '--no-default-browser-check', '--disable-extensions',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`, '--virtual-time-budget=3000',
      fileUrl,
    ], { timeout: 40000, windowsHide: true, maxBuffer: 1024 * 1024 * 64 });
    return await fs.readFile(pdfPath);
  } finally {
    fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
