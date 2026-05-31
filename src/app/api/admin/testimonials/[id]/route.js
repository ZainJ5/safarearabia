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
    const { id } = await params;
    
    const item = await Testimonial.findById(id).lean();
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
    const { id } = await params;
    
    const body = await request.json();
    const item = await Testimonial.findByIdAndUpdate(id, body, { new: true, runValidators: true });
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
    const { id } = await params;
    
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}