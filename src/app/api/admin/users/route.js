import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function checkAdmin() {
  const session = await auth();
  const role = Number(session?.user?.role);
  if (!session?.user || (role !== 1 && role !== 2)) return null;
  return session;
}

function isAdminOnly(session) {
  return Number(session?.user?.role) === 1;
}

export async function GET(request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page   = parseInt(searchParams.get('page')  || '1');
    const limit  = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role   = searchParams.get('role');
    const status = searchParams.get('status');
    const skip   = (page - 1) * limit;

    let query = {};
    if (search) query.$or = ['fname', 'lname', 'email', 'phone'].map(f => ({ [f]: { $regex: search, $options: 'i' } }));
    if (role)   query.role   = parseInt(role);
    if (status !== null && status !== '') query.status = parseInt(status);

    const [items, total] = await Promise.all([
      User.find(query).sort({ created_at: -1 }).skip(skip).limit(limit).select('-password').lean(),
      User.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: { total, page, pages: Math.ceil(total / limit), limit } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminOnly(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const body = await request.json();

    if (!body.email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!body.password) return NextResponse.json({ error: 'Password is required' }, { status: 400 });

    const exists = await User.findOne({ email: body.email });
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    // Never store username: null — generates a guaranteed-unique handle instead.
    // The sparse index allows truly absent usernames, but explicit null is
    // treated as a value and would violate the unique constraint.
    if (!body.username) {
      const base = body.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 15);
      body.username = `${base}_${Math.random().toString(36).slice(2, 7)}`;
    }

    const hashed = await bcrypt.hash(body.password, 10);
    const user = await User.create({ ...body, password: hashed });

    const { password: _, ...safe } = user.toObject();
    return NextResponse.json({ success: true, data: safe }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
