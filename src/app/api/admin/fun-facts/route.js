import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import FunFact from '@/models/FunFact';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      FunFact.find().sort({ serial: 1 }).skip(skip).limit(limit).lean(),
      FunFact.countDocuments(),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    await dbConnect();
    const item = await FunFact.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
