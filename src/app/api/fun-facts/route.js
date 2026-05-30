import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FunFact from '@/models/FunFact';

export async function GET() {
  try {
    await dbConnect();
    const facts = await FunFact.find({ status: 1 })
      .sort({ serial: 1, created_at: -1 })
      .lean();

    return NextResponse.json({ success: true, data: facts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
