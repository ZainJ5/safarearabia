import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    await dbConnect();

    // Check for existing subscriber
    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (existing.status === 1) {
        return NextResponse.json({ success: true, message: 'You are already subscribed!' });
      }
      // Re-activate unsubscribed email
      existing.status = 1;
      await existing.save();
      return NextResponse.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
    }

    // Get IP for spam prevention
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    await Subscriber.create({ email: email.toLowerCase().trim(), ip });

    return NextResponse.json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  // Admin-only: list subscribers
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    await dbConnect();
    const [items, total] = await Promise.all([
      Subscriber.find().sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
      Subscriber.countDocuments(),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
