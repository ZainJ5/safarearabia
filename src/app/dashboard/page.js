'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardOverviewPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h3 className="mb-4">Dashboard Overview</h3>
      <div className="alert alert-primary mb-5" role="alert">
        <h4 className="alert-heading">Welcome back, {session?.user?.name || 'User'}!</h4>
        <p className="mb-0">From your dashboard you can view your recent bookings, manage your profile, and change your password.</p>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm text-center p-4">
            <div className="icon mb-3 text-primary">
              <i className="bi bi-calendar-check" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4>My Bookings</h4>
            <p className="text-muted">View and manage your current and past trips, tours, and hotel reservations.</p>
            <Link href="/dashboard/bookings" className="btn btn-outline-primary mt-auto mx-auto w-50">View Bookings</Link>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm text-center p-4">
            <div className="icon mb-3 text-primary">
              <i className="bi bi-person-gear" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4>Profile Settings</h4>
            <p className="text-muted">Update your personal information, contact details, and account preferences.</p>
            <Link href="/dashboard/profile" className="btn btn-outline-primary mt-auto mx-auto w-50">Edit Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
