import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Testimonial from '@/models/Testimonial';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const testimonials = await Testimonial.find({ status: 1 })
      .sort({ serial: 1, created_at: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
