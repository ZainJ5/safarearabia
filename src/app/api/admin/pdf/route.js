import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const execFileP = promisify(execFile);

/* Locate an installed Chrome/Chromium. Override with CHROME_PATH env if needed. */
async function findChrome() {
  const fromEnv = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    fromEnv,
    // Windows
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    // Linux
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
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

export async function POST(request) {
  let dir;
  try {
    const session = await auth();
    const role = Number(session?.user?.role);
    if (!session?.user || (role !== 1 && role !== 2 && role !== 4)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { html, filename } = await request.json();
    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Missing html' }, { status: 400 });
    }
    const safeName = String(filename || 'document').replace(/[^\w.\- ]+/g, '_').replace(/\.pdf$/i, '');

    const chrome = await findChrome();
    if (!chrome) {
      return NextResponse.json({ error: 'No Chrome/Chromium found on the server. Install Chrome or set CHROME_PATH.' }, { status: 501 });
    }

    // Inline the logo so the file:// render needs no network, and strip any scripts.
    let body = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    try {
      const logoBuf = await fs.readFile(path.join(process.cwd(), 'public', 'IMG_6483.PNG'));
      const dataUri = `data:image/png;base64,${logoBuf.toString('base64')}`;
      body = body.split('/IMG_6483.PNG').join(dataUri);
    } catch { /* logo optional */ }

    const doc = `<!doctype html><html><head><meta charset="utf-8"/><style>${PRINT_CSS}</style></head><body><div id="print-doc">${body}</div></body></html>`;

    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sea-pdf-'));
    const htmlPath = path.join(dir, 'doc.html');
    const pdfPath = path.join(dir, 'doc.pdf');
    await fs.writeFile(htmlPath, doc, 'utf8');

    const fileUrl = 'file://' + htmlPath.replace(/\\/g, '/');
    await execFileP(chrome, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox',
      '--no-pdf-header-footer', '--disable-pdf-tagging',
      `--print-to-pdf=${pdfPath}`, '--virtual-time-budget=3000',
      fileUrl,
    ], { timeout: 30000, windowsHide: true });

    const pdf = await fs.readFile(pdfPath);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
        'Content-Length': String(pdf.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF route failed:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  } finally {
    if (dir) { try { await fs.rm(dir, { recursive: true, force: true }); } catch {} }
  }
}
