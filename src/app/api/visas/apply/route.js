import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VisaApplication from '@/models/VisaApplication';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { visa_id, visa_title, visa_slug, name, email, phone, nationality, passport_number, travel_date, message } = body;

    if (!name || !email || !visa_title) {
      return NextResponse.json({ success: false, error: 'Name, email, and visa title are required' }, { status: 400 });
    }

    const application = await VisaApplication.create({
      visa_id,
      visa_title,
      visa_slug,
      name,
      email,
      phone,
      nationality,
      passport_number,
      travel_date,
      message,
      status: 'pending',
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
