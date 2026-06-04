import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import TransportInvoice from '@/models/TransportInvoice';
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
    const agentFilter  = searchParams.get('agent_name');
    const dateFilter   = searchParams.get('date');
    const statusFilter = searchParams.get('status');
    const role = Number(session.user.role);

    let query = {};

    // Agents only see their own invoices
    if (role === 2) {
      query.agent_user_id = session.user.id;
    }

    if (search) {
      query.$or = [
        { guest_name:    { $regex: search, $options: 'i' } },
        { agent_name:    { $regex: search, $options: 'i' } },
        { vehicle:       { $regex: search, $options: 'i' } },
        { from_location: { $regex: search, $options: 'i' } },
        { to_location:   { $regex: search, $options: 'i' } },
      ];
    }
    if (agentFilter)  query.agent_name = { $regex: agentFilter, $options: 'i' };
    if (dateFilter)   query.date       = { $regex: `^${dateFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` };
    if (statusFilter) query.status     = Number(statusFilter);

    const [items, total] = await Promise.all([
      TransportInvoice.find(query).sort({ invoice_no: -1 }).skip(skip).limit(limit).lean(),
      TransportInvoice.countDocuments(query),
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

    // Stamp agent_user_id; for agents also override agent_name
    body.agent_user_id = session.user.id;
    if (role === 2) {
      const agentUser = await User.findById(session.user.id).lean();
      if (agentUser) {
        body.agent_name = `${agentUser.fname || ''} ${agentUser.lname || ''}`.trim();
      }
    }

    const last = await TransportInvoice.findOne({}, { invoice_no: 1 }).sort({ invoice_no: -1 }).lean();
    body.invoice_no = last?.invoice_no ? last.invoice_no + 1 : 1;

    const invoice = await TransportInvoice.create(body);

    // Update agent balance: add invoice net total
    const invoiceTotal = Number(invoice.net_total_with_tax) || Number(invoice.total) || 0;
    if (invoiceTotal > 0) {
      await User.findByIdAndUpdate(session.user.id, { $inc: { wallet_balance: invoiceTotal } });
    }

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
