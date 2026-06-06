import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET (e.g. the agent picker on invoice forms) is open to Admin + Employee.
async function checkStaff() {
  const session = await auth();
  const role = Number(session?.user?.role);
  if (!session?.user || (role !== 1 && role !== 4)) return null;
  return session;
}

function isAdminOnly(session) {
  return Number(session?.user?.role) === 1;
}

const fmtAgentCode = (n) => `MC${String(n).padStart(4, '0')}`;

// Highest existing MC#### code across all users — the server-authoritative source
// for the next agent id (the client preview cannot be trusted: paginated + races).
async function maxAgentCodeNumber() {
  const docs = await User.find({ custom_id: { $type: 'string' } }).select('custom_id').lean();
  let max = 0;
  for (const d of docs) {
    const m = /^MC(\d+)$/.exec(d.custom_id || '');
    if (m) { const n = parseInt(m[1], 10); if (n > max) max = n; }
  }
  return max;
}

export async function GET(request) {
  try {
    const session = await checkStaff();
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
    // `role` may be a single value (e.g. the agent picker passes role=2) or a
    // comma list (the Users tab passes role=1,4 to show only admins + employees).
    if (role) {
      const roles = role.split(',').map(r => parseInt(r, 10)).filter(n => !Number.isNaN(n));
      if (roles.length) query.role = roles.length > 1 ? { $in: roles } : roles[0];
    }
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
    const session = await checkStaff();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminOnly(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const body = await request.json();
    const role = Number(body.role);

    if (!body.email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    // Agents (role 2) are balance-only records and never log in, so a password
    // is optional for them. Everyone who logs in (admins, employees) needs one.
    if (role !== 2 && !body.password) return NextResponse.json({ error: 'Password is required' }, { status: 400 });

    const exists = await User.findOne({ email: body.email });
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    // Never store username: null — generates a guaranteed-unique handle instead.
    // The sparse index allows truly absent usernames, but explicit null is
    // treated as a value and would violate the unique constraint.
    if (!body.username) {
      const base = body.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 15);
      body.username = `${base}_${Math.random().toString(36).slice(2, 7)}`;
    }

    const hashed = body.password ? await bcrypt.hash(body.password, 10) : null;

    // Agents (role 2) get a server-assigned, guaranteed-unique merchant code.
    // Never trust a client-supplied custom_id — that is what produced duplicate MC numbers.
    let user;
    if (role === 2) {
      let n = (await maxAgentCodeNumber()) + 1;
      for (let attempt = 0; attempt < 5 && !user; attempt++) {
        try {
          user = await User.create({ ...body, role: 2, custom_id: fmtAgentCode(n), password: hashed });
        } catch (e) {
          // Concurrent insert grabbed this code first — try the next one.
          if (e?.code === 11000 && e?.keyPattern?.custom_id) { n += 1; continue; }
          throw e;
        }
      }
      if (!user) return NextResponse.json({ error: 'Could not allocate a unique agent code' }, { status: 500 });
    } else {
      user = await User.create({ ...body, password: hashed });
    }

    const { password: _, ...safe } = user.toObject();
    return NextResponse.json({ success: true, data: safe }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
