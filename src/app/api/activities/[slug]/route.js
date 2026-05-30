import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const activity = await Activity.findOne({ slug, status: 1 }).lean();

    if (!activity) {
      return NextResponse.json({ success: false, message: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: activity
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
