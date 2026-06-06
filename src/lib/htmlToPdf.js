import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';
import path from 'path';

/* Locate an installed Chrome/Chromium on the system. */
async function findChrome() {
  const fromEnv = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    fromEnv,
    // Linux (VPS / production)
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    // Windows (local dev)
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    // macOS
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

/* Render self-contained HTML (inline styles) to an A4 PDF Buffer using
   puppeteer-core with a system-installed Chrome/Chromium.
   Works on any VPS with chromium installed via apt. */
export async function htmlToPdf(rawHtml) {
  const executablePath = await findChrome();
  if (!executablePath) {
    throw new Error('NO_CHROME: No Chrome/Chromium found. Install chromium-browser or set CHROME_PATH env.');
  }

  // Inline the logo as a data URI so the page needs no network access
  let body = String(rawHtml).replace(/<script[\s\S]*?<\/script>/gi, '');
  try {
    const logoBuf = await fs.readFile(path.join(process.cwd(), 'public', 'Logo.png'));
    body = body.split('/Logo.png').join(`data:image/png;base64,${logoBuf.toString('base64')}`);
  } catch { /* logo optional */ }

  const doc = `<!doctype html><html><head><meta charset="utf-8"/><style>${PRINT_CSS}</style></head><body><div id="print-doc">${body}</div></body></html>`;

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(doc, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for all images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise((resolve) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          }))
      );
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
