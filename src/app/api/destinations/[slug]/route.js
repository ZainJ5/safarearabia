import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Destination from '@/models/Destination';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    const destination = await Destination.findOne({ slug, status: 1 }).lean();

    if (!destination) {
      return NextResponse.json({ success: false, message: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: destination
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
