import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await dbConnect();
    // Each setting is stored as {type, value} — map to {key: value} object
    const rows = await Setting.find().lean();
    const mapped = {};
    rows.forEach(s => { mapped[s.type] = s.value; });

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
