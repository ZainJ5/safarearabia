import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const payment = searchParams.get('payment_status');
    const type = searchParams.get('product_type');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = parseInt(status);
    if (payment) query.payment_status = parseInt(payment);
    if (type) query.product_type = type;
    if (search) query.order_number = { $regex: search, $options: 'i' };

    const [items, total] = await Promise.all([
      Order.find(query).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
