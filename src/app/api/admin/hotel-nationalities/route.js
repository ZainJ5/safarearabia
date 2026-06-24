import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

// Custom (staff-added) nationalities for the hotel invoice dropdown are stored
// as a single Setting document. The fixed list lives in the client component;
// this endpoint only manages the extra ones added on top of it.
const SETTING_TYPE = 'hotel_nationalities';

// Mirror the hotel-invoice auth boundary: admins (1) and employees (4) are the
// staff who create invoices, so they are the ones who add nationalities.
async function getSession() {
  const session = await auth();
  const role = Number(session?.user?.role);
  if (!session?.user || (role !== 1 && role !== 4)) return null;
  return session;
}

async function getList() {
  const doc = await Setting.findOne({ type: SETTING_TYPE }).lean();
  const value = doc?.value;
  return Array.isArray(value) ? value.filter(v => typeof v === 'string' && v.trim()) : [];
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const list = await getList();
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();

    const body = await request.json();
    const nationality = String(body?.nationality || '').trim();
    if (!nationality) return NextResponse.json({ error: 'Nationality is required' }, { status: 400 });

    const list = await getList();
    const exists = list.some(n => n.toLowerCase() === nationality.toLowerCase());
    if (!exists) {
      list.push(nationality);
      await Setting.updateOne(
        { type: SETTING_TYPE },
        { $set: { type: SETTING_TYPE, value: list } },
        { upsert: true },
      );
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
