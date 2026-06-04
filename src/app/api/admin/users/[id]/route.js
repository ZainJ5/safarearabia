import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || Number(session.user.role) !== 1) return null;
  return session;
}

async function checkStaff() {
  const session = await auth();
  const role = Number(session?.user?.role);
  if (!session?.user || (role !== 1 && role !== 2)) return null;
  return session;
}

/*
 * The users collection stores _id as plain strings (not ObjectId).
 * Mongoose's schema-based casting always converts _id to ObjectId,
 * so findById / findOne both fail. We must use the raw collection driver
 * which bypasses Mongoose type casting entirely.
 */
async function findUserById(id) {
  const col = User.collection;
  // Try string _id first (matches the server DB)
  let doc = await col.findOne({ _id: id });
  // Fallback: try ObjectId cast (matches normal Mongoose DBs)
  if (!doc && mongoose.Types.ObjectId.isValid(id)) {
    doc = await col.findOne({ _id: new mongoose.Types.ObjectId(id) });
  }
  return doc;
}

export async function GET(request, { params }) {
  try {
    const session = await checkStaff();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;

    if (Number(session.user.role) === 2 && session.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await findUserById(id);
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Strip password before returning
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    delete body._id; delete body.created_at; delete body.updated_at;

    if (body.password && body.password.trim()) {
      body.password = await bcrypt.hash(body.password, 10);
    } else {
      delete body.password;
    }

    const col = User.collection;

    // Try string _id
    let result = await col.findOneAndUpdate(
      { _id: id },
      { $set: { ...body, updated_at: new Date() } },
      { returnDocument: 'after' }
    );

    // Fallback to ObjectId
    if (!result && mongoose.Types.ObjectId.isValid(id)) {
      result = await col.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { ...body, updated_at: new Date() } },
        { returnDocument: 'after' }
      );
    }

    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { password: _, ...safeUser } = result;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;

    const col = User.collection;

    let result = await col.findOneAndDelete({ _id: id });

    if (!result && mongoose.Types.ObjectId.isValid(id)) {
      result = await col.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    }

    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
