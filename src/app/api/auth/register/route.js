import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { fname, lname, email, phone, password } = await req.json();

    if (!fname || !lname || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique username (avoids sparse-index conflict on null)
    const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 15);
    const username = `${base}_${Math.random().toString(36).slice(2, 7)}`;

    // Create user
    const newUser = await User.create({
      fname,
      lname,
      email,
      phone,
      username,
      password: hashedPassword,
      role: 3, // Customer
      status: 1, // Active
      wallet_balance: 0,
    });

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
