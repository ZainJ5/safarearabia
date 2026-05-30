import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TransportInquiry from '@/models/TransportInquiry';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { transport_id, transport_title, transport_slug, name, email, phone, passengers, travel_date, vehicle_type, message } = body;

    if (!name?.trim() || !email?.trim() || !transport_title) {
      return NextResponse.json({ success: false, error: 'Name, email, and transport title are required' }, { status: 400 });
    }

    const inquiry = await TransportInquiry.create({
      transport_id,
      transport_title,
      transport_slug,
      name: name.trim(),
      email: email.trim(),
      phone,
      passengers,
      travel_date,
      vehicle_type,
      message,
      status: 'new',
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
