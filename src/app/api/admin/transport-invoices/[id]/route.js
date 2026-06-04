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

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const item = await TransportInvoice.findById(id).lean();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (Number(session.user.role) === 2 && String(item.agent_user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Attach agent merchant ID from User record
    let agent_no = '';
    if (item.agent_user_id) {
      const agent = await User.findById(item.agent_user_id).select('custom_id').lean();
      agent_no = agent?.custom_id || '';
    }

    return NextResponse.json({ success: true, data: { ...item, agent_no } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    delete body._id; delete body.invoice_no; delete body.created_at; delete body.updated_at;

    const existing = await TransportInvoice.findById(id).lean();
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (Number(session.user.role) === 2 && String(existing.agent_user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const oldTotal = Number(existing.net_total_with_tax) || Number(existing.total) || 0;
    const item = await TransportInvoice.findByIdAndUpdate(id, body, { new: true });

    // Adjust agent balance by delta
    const newTotal = Number(item.net_total_with_tax) || Number(item.total) || 0;
    const delta = newTotal - oldTotal;
    if (delta !== 0 && existing.agent_user_id) {
      await User.findByIdAndUpdate(existing.agent_user_id, { $inc: { wallet_balance: delta } });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;

    const existing = await TransportInvoice.findById(id).lean();
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (Number(session.user.role) === 2 && String(existing.agent_user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await TransportInvoice.findByIdAndDelete(id);

    // Reverse balance
    const invoiceTotal = Number(existing.net_total_with_tax) || Number(existing.total) || 0;
    if (invoiceTotal > 0 && existing.agent_user_id) {
      await User.findByIdAndUpdate(existing.agent_user_id, { $inc: { wallet_balance: -invoiceTotal } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
