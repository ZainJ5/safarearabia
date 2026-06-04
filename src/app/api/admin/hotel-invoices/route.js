import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import HotelInvoice from '@/models/HotelInvoice';
import User from '@/models/User';

async function getSession() {
  const session = await auth();
  const role = Number(session?.user?.role);
  if (!session?.user || (role !== 1 && role !== 2)) return null;
  return session;
}

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page   = parseInt(searchParams.get('page')  || '1');
    const limit  = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const skip   = (page - 1) * limit;
    const agentNameFilter = searchParams.get('agent_name');
    const checkInFilter   = searchParams.get('check_in');
    const statusFilter    = searchParams.get('status');
    const role = Number(session.user.role);

    let query = {};

    // Agents only see their own invoices
    if (role === 2) {
      query.agent_user_id = session.user.id;
    }

    if (search) {
      query.$or = [
        { guest_name: { $regex: search, $options: 'i' } },
        { agent_name: { $regex: search, $options: 'i' } },
        { hotel_name: { $regex: search, $options: 'i' } },
        { reserve_no: !isNaN(search) ? Number(search) : undefined },
      ].filter(c => Object.values(c)[0] !== undefined);
    }
    if (agentNameFilter) query.agent_name = { $regex: agentNameFilter, $options: 'i' };
    if (checkInFilter)   query.check_in   = { $regex: `^${checkInFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` };
    if (statusFilter)    query.status     = Number(statusFilter);

    const [items, total] = await Promise.all([
      HotelInvoice.find(query).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
      HotelInvoice.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();
    const role = Number(session.user.role);

    // Stamp agent_user_id always; for agents also override agent_name from session
    body.agent_user_id = session.user.id;
    if (role === 2) {
      const agentUser = await User.findById(session.user.id).lean();
      if (agentUser) {
        body.agent_name = `${agentUser.fname || ''} ${agentUser.lname || ''}`.trim();
      }
    }

    // Auto-generate sequential reserve_no
    const last = await HotelInvoice.findOne({}, { reserve_no: 1 }).sort({ reserve_no: -1 }).lean();
    body.reserve_no = last?.reserve_no ? last.reserve_no + 1 : 31001;

    const invoice = await HotelInvoice.create(body);

    // Update agent balance: add invoice total
    const invoiceTotal = Number(invoice.total_amount) || 0;
    if (invoiceTotal > 0) {
      await User.findByIdAndUpdate(session.user.id, { $inc: { wallet_balance: invoiceTotal } });
    }

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
