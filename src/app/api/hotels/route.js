import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Hotel from '@/models/Hotel';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    
    // Calculate skip
    const skip = (page - 1) * limit;

    // Filters (basic implementation)
    let query = { status: 1 };
    
    const category = searchParams.get('category');
    if (category) {
      query['category.slug'] = category;
    }

    const hotels = await Hotel.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Hotel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: hotels,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
