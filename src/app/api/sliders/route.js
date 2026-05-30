import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Slider from '@/models/Slider';

export async function GET() {
  try {
    await dbConnect();
    const sliders = await Slider.find({ status: 1 })
      .sort({ serial: 1, created_at: -1 })
      .lean();

    return NextResponse.json({ success: true, data: sliders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
