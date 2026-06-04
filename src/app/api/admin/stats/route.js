import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';
import Visa from '@/models/Visa';
import Transport from '@/models/Transport';
import Hotel from '@/models/Hotel';
import TransportInquiry from '@/models/TransportInquiry';
import VisaApplication from '@/models/VisaApplication';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = today.toISOString().split('T')[0];

    // Build last 6 months labels
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ label: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() + 1 });
    }

    const [
      totalOrders, totalUsers, totalVisas, totalTransports, totalHotels,
      totalInquiries, totalVisaApps,
      recentOrders, revenueAgg, orderStatusAgg,
      todayArrivals, todayInquiries, todayVisaApps,
      agentCount, pendingOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Visa.countDocuments({ status: 1 }),
      Transport.countDocuments({ status: 1 }),
      Hotel.countDocuments({ status: 1 }),
      TransportInquiry.countDocuments(),
      VisaApplication.countDocuments(),
      Order.find().sort({ created_at: -1 }).limit(8).lean(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total_with_tax' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.find({ start_date: todayStr }).sort({ created_at: -1 }).lean(),
      TransportInquiry.find({ created_at: { $gte: today, $lt: tomorrow } }).lean(),
      VisaApplication.find({ created_at: { $gte: today, $lt: tomorrow } }).lean(),
      User.countDocuments({ role: 2 }),
      Order.countDocuments({ status: 1 }),
    ]);

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      { $match: { created_at: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) } } },
      { $group: { _id: { month: { $month: '$created_at' }, year: { $year: '$created_at' } }, revenue: { $sum: '$total_with_tax' }, count: { $sum: 1 } } },
    ]);

    const revenueByMonth = months.map(m => {
      const found = monthlyRevenue.find(r => r._id.month === m.month && r._id.year === m.year);
      return { label: m.label, value: found?.revenue || 0, count: found?.count || 0 };
    });

    const orderStatus = { pending: 0, processing: 0, approved: 0, cancelled: 0 };
    orderStatusAgg.forEach(s => {
      if (s._id === 1) orderStatus.pending = s.count;
      else if (s._id === 2) orderStatus.processing = s.count;
      else if (s._id === 3) orderStatus.approved = s.count;
      else if (s._id === 4) orderStatus.cancelled = s.count;
    });

    return NextResponse.json({
      success: true,
      stats: { totalOrders, totalUsers, totalVisas, totalTransports, totalHotels, totalInquiries, totalVisaApps, agentCount, pendingOrders },
      totalRevenue: revenueAgg[0]?.total || 0,
      revenueByMonth,
      orderStatus,
      recentOrders,
      todayArrivals,
      todayInquiries,
      todayVisaApps,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
