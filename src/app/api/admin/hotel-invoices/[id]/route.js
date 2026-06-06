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

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const item = await HotelInvoice.findById(id).lean();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Employees can only access invoices they generated
    if (Number(session.user.role) === 4 && String(item.employee_user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Agent number/phone: prefer the live User record, but fall back to the
    // values stamped on the invoice (admin- or legacy-created invoices may have
    // no linked agent_user_id yet still carry an agent_no).
    let agent_no = item.agent_no || '';
    let agent_phone = item.agent_phone || '';
    if (item.agent_user_id) {
      const agent = await findUserAny(item.agent_user_id);
      if (agent?.custom_id) agent_no = agent.custom_id;
      if (agent?.phone) agent_phone = agent.phone;
    }

    return NextResponse.json({ success: true, data: { ...item, agent_no, agent_phone } });
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
    delete body._id; delete body.reserve_no; delete body.created_at; delete body.updated_at;

    const existing = await HotelInvoice.findById(id).lean();
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Employees can only edit invoices they generated
    if (Number(session.user.role) === 4 && String(existing.employee_user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const oldTotal = Number(existing.total_amount) || 0;
    const item = await HotelInvoice.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    // Update agent balance: adjust by the difference
    const newTotal = Number(item.total_amount) || 0;
    const delta = newTotal - oldTotal;
    if (delta !== 0 && existing.agent_user_id) {
      await incWallet(existing.agent_user_id, delta);
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

    const existing = await HotelInvoice.findById(id).lean();
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Employees can only delete invoices they generated
    if (Number(session.user.role) === 4 && String(existing.employee_user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await HotelInvoice.findByIdAndDelete(id);

    // Reverse balance: subtract the invoice total
    const invoiceTotal = Number(existing.total_amount) || 0;
    if (invoiceTotal > 0 && existing.agent_user_id) {
      await incWallet(existing.agent_user_id, -invoiceTotal);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
