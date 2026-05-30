import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const settings = await Setting.find().lean();
    const mapped = {};
    settings.forEach(s => { mapped[s.type] = s.value; });
    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const body = await request.json();
    const ops = Object.entries(body).map(([type, value]) => ({
      updateOne: { filter: { type }, update: { $set: { type, value } }, upsert: true },
    }));
    if (ops.length > 0) await Setting.bulkWrite(ops);
    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
