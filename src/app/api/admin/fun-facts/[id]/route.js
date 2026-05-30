import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import FunFact from '@/models/FunFact';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await dbConnect();
    const item = await FunFact.findById(id).lean();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    await dbConnect();
    const item = await FunFact.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }).lean();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await dbConnect();
    await FunFact.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
