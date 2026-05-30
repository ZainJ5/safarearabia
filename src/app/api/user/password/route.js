import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const data = await request.json();
    const { currentPassword, newPassword } = data;
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    
    // Find the user with password
    const user = await User.findById(session.user.id).select('+password');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Check if password exists (e.g. they might have signed in with OAuth)
    if (!user.password) {
      return NextResponse.json({ success: false, error: 'Cannot change password for this account type' }, { status: 400 });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user
    user.password = hashedPassword;
    await user.save();
    
    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
