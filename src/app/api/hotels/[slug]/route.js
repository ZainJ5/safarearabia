import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Hotel from '@/models/Hotel';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const hotel = await Hotel.findOne({ slug, status: 1 }).lean();

    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
