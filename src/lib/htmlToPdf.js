import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const PRINT_CSS = `
  @page { size: A4 portrait; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
  #print-doc { width: 794px; margin: 0 auto; }
  #print-doc > * { width: 794px !important; }
  tr, table, img, svg { break-inside: avoid; page-break-inside: avoid; }
`;

/* Render self-contained HTML (inline styles) to an A4 PDF Buffer using
   Puppeteer's bundled Chromium.  Works on any VPS / serverless host that
   supports headless Chrome without requiring a system-level install. */
export async function htmlToPdf(rawHtml) {
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

    // Wait for all images to load (data URIs resolve instantly, but just in case)
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
