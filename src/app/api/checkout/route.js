import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      product_type,
      product_id,
      payment_method,
      adults,
      children,
      check_in,
      check_out,
      customer_info,
      special_requests,
      subtotal,
      service_fee,
      total,
    } = body;

    if (!product_type || !product_id || !check_in) {
      return NextResponse.json({ success: false, error: 'Missing required booking fields' }, { status: 400 });
    }

    await dbConnect();

    // Generate unique order number
    const orderNumber = `SA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const adultQty = parseInt(adults) || 1;
    const childQty = parseInt(children) || 0;
    const totalAmount = parseFloat(subtotal) || 0;
    const taxRate = 5;
    const taxAmount = parseFloat(service_fee) || Math.round(totalAmount * 0.05 * 100) / 100;
    const totalWithTax = parseFloat(total) || totalAmount + taxAmount;
    const adultUnitPrice = adultQty > 0 ? Math.round((totalAmount / adultQty) * 100) / 100 : 0;

    const order = await Order.create({
      order_number: orderNumber,
      user_id: session.user.id,
      product_type,
      product_id,
      start_date: check_in,
      end_date: check_out || check_in,
      // Flat adult fields
      adult_qty: adultQty,
      adult_unit_price: adultUnitPrice,
      adult_total_price: totalAmount,
      // Flat child fields
      child_qty: childQty,
      child_unit_price: 0,
      child_total_price: 0,
      // Customer info (flat)
      first_name: customer_info?.first_name || '',
      last_name: customer_info?.last_name || '',
      email: customer_info?.email || session.user.email,
      phone: customer_info?.phone || '',
      address: customer_info?.address || '',
      notes: special_requests,
      total_amount: totalAmount,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_with_tax: totalWithTax,
      status: 1, // Pending
      payment_status: payment_method === 'wallet' ? 1 : 2, // 1=Paid, 2=Unpaid
    });

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed successfully!',
      order_id: order._id,
      order_number: orderNumber,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
