import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';
import Setting from '@/models/Setting';

async function getRecaptchaSecret() {
  // Try DB settings first, fall back to env
  try {
    const rows = await Setting.find({ type: 'recaptcha_secret' }).lean();
    if (rows.length && rows[0].value) return rows[0].value;
  } catch { /* ignore */ }
  return process.env.RECAPTCHA_SECRET_KEY || '';
}

async function verifyRecaptcha(token, secret) {
  if (!secret || !token) return false;
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    let data;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData);
    }

    const { name, email, phone, subject, message, recaptchaToken } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required.' }, { status: 400 });
    }

    await dbConnect();

    // Verify reCAPTCHA if a secret key is configured
    const secret = await getRecaptchaSecret();
    if (secret) {
      const valid = await verifyRecaptcha(recaptchaToken, secret);
      if (!valid) {
        return NextResponse.json({ success: false, error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
      }
    }

    await Contact.create({ name, email, phone, subject, message });

    return NextResponse.json({ success: true, message: 'Thank you for contacting us. We will get back to you shortly.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  // Admin-only: list contact messages
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Contact.countDocuments();

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
