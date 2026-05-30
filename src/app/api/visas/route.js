import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Visa from '@/models/Visa';

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

    const visas = await Visa.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Visa.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: visas,
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
