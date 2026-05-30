import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Testimonial from '@/models/Testimonial';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 1) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request, { params }) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const item = await Testimonial.findById(params.id).lean();
    if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();
    const item = await Testimonial.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    await Testimonial.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
