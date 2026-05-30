import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findById(session.user.id).select('-password -__v').lean();
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const data = await request.json();

    const allowedUpdates = {};
    if (data.name) allowedUpdates.name = data.name.trim();
    if (data.phone !== undefined) allowedUpdates.phone = data.phone;
    if (data.location !== undefined) allowedUpdates.location = data.location;
    if (data.bio !== undefined) allowedUpdates.bio = data.bio;
    if (data.image !== undefined) allowedUpdates.image = data.image;
    
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: allowedUpdates },
      { new: true }
    ).select('-password -__v');
    
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
