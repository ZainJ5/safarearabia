import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { htmlToPdf } from '@/lib/htmlToPdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
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

    const pdf = await htmlToPdf(html);

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
  }
}
