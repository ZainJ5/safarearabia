import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blog';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const blog = await Blog.findOne({ slug, status: 1 }).lean();

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
