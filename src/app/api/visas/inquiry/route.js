import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
// Assuming Inquiry model exists or we handle it later, for now we will just log or return success
// import Inquiry from '@/models/Inquiry';

export async function POST(request) {
  try {
    await dbConnect();
    
    // For now we will handle form data submission
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    console.log('Visa Inquiry Received:', data);

    // Later: await Inquiry.create(data);

    // Redirect to success or return JSON depending on how form is submitted
    // Since we used standard form action in UI, let's redirect back with a success param
    // But since we can't be sure of the exact previous URL, let's return a simple success JSON
    // A better approach in Next.js is to handle submission via JS, but we keep it simple for now.
    
    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
