import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Visa from '@/models/Visa';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    const visa = await Visa.findOne({ slug, status: 1 }).lean();

    if (!visa) {
      return NextResponse.json({ success: false, message: 'Visa not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: visa
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
