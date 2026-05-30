import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tour from '@/models/Tour';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    const tour = await Tour.findOne({ slug, status: 1 }).lean();

    if (!tour) {
      return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tour });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
