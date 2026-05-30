import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Slider from '@/models/Slider';

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
    const slider = await Slider.findById(params.id).lean();
    if (!slider) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: slider });
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
    const slider = await Slider.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!slider) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: slider });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    await Slider.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Slider deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
