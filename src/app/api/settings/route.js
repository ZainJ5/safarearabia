import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

export async function GET(request) {
  try {
    await dbConnect();
    // Assuming there's a settings document in the database
    // Mongoose query to get settings
    const settings = await Setting.findOne().lean();

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: {
          site_name: 'Safar E Arabia',
          email: 'info@safarearabia.com',
          phone: '+966500000000',
          address: 'Jeddah, Saudi Arabia',
          currency: 'SAR',
          social_links: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
