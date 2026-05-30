import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transport from '@/models/Transport';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    const transport = await Transport.findOne({ slug, status: 1 }).lean();

    if (!transport) {
      return NextResponse.json({ success: false, message: 'Transport not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: transport
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
