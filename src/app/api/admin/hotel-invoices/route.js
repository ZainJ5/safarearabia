import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import HotelInvoice from '@/models/HotelInvoice';
import { findUserAny, incWallet } from '@/lib/userStore';

async function getSession() {
  const session = await auth();
  const role = Number(session?.user?.role);
  if (!session?.user || (role !== 1 && role !== 4)) return null;
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

    // Employees only see invoices they generated. Admins see everything.
    if (role === 4) {
      query.employee_user_id = session.user.id;
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

    // Stamp the employee (logged-in staff) who generated this invoice — shown on the PDF.
    const me = await findUserAny(session.user.id);
    body.employee_user_id = session.user.id;
    if (me) {
      body.employee_name  = `${me.fname || ''} ${me.lname || ''}`.trim();
      body.employee_phone = me.phone || '';
    }

    // Attach the selected agent (carries the booking; its balance is managed).
    // Identity is taken from the live agent record so it is always authoritative.
    const agentId = body.agent_user_id || null;
    const agent = agentId ? await findUserAny(agentId) : null;
    if (agent) {
      body.agent_name  = `${agent.fname || ''} ${agent.lname || ''}`.trim();
      body.agent_no    = agent.custom_id || body.agent_no || '';
      body.agent_phone = agent.phone || body.agent_phone || '';
    } else {
      body.agent_user_id = null;
    }

    // Auto-generate sequential reserve_no (reservation no) and invoice_no
    const last = await HotelInvoice.findOne({}, { reserve_no: 1 }).sort({ reserve_no: -1 }).lean();
    body.reserve_no = last?.reserve_no ? last.reserve_no + 1 : 31001;
    const lastInv = await HotelInvoice.findOne({}, { invoice_no: 1 }).sort({ invoice_no: -1 }).lean();
    body.invoice_no = lastInv?.invoice_no ? lastInv.invoice_no + 1 : 2281;

    const invoice = await HotelInvoice.create(body);

    // Update the selected agent's balance: add invoice total
    const invoiceTotal = Number(invoice.total_amount) || 0;
    if (agentId && invoiceTotal > 0) {
      await incWallet(agentId, invoiceTotal);
    }

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
