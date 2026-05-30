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

export async function GET(request) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const testimonials = await Testimonial.find()
      .sort({ serial: 1, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Testimonial.countDocuments();

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
