import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Tour from '@/models/Tour';
import Hotel from '@/models/Hotel';
import Transport from '@/models/Transport';
import Visa from '@/models/Visa';
import Activity from '@/models/Activity';
import Blog from '@/models/Blog';
import Order from '@/models/Order';
import User from '@/models/User';
import Destination from '@/models/Destination';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [tours, hotels, transports, visas, activities, blogs, orders, users, destinations, recentOrders, revenue] = await Promise.all([
      Tour.countDocuments(),
      Hotel.countDocuments(),
      Transport.countDocuments(),
      Visa.countDocuments(),
      Activity.countDocuments(),
      Blog.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Destination.countDocuments(),
      Order.find().sort({ created_at: -1 }).limit(10).lean(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total_amount' } } }]),
    ]);

    return NextResponse.json({
      success: true,
      stats: { tours, hotels, transports, visas, activities, blogs, orders, users, destinations },
      totalRevenue: revenue[0]?.total || 0,
      recentOrders,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
