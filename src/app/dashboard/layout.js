'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid' },
    { path: '/dashboard/bookings', label: 'My Bookings', icon: 'bi-calendar-check' },
    { path: '/dashboard/profile', label: 'Profile Settings', icon: 'bi-person' },
    { path: '/dashboard/password', label: 'Change Password', icon: 'bi-shield-lock' },
  ];

  return (
    <div className="dashboard-area pt-100 pb-100 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-5 mb-lg-0">
            <div className="dashboard-sidebar bg-white border rounded p-4 h-100">
              <div className="user-profile text-center border-bottom pb-4 mb-4">
                <div className="avatar-preview mx-auto mb-3" style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="bi bi-person text-secondary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-1">{session.user.name || 'User'}</h5>
                <p className="text-muted mb-0 small">{session.user.email}</p>
              </div>
              <ul className="dashboard-menu list-unstyled mb-0">
                {menuItems.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    <Link 
                      href={item.path} 
                      className={`d-flex align-items-center p-3 rounded text-decoration-none transition ${pathname === item.path ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                    >
                      <i className={`bi ${item.icon} me-3 fs-5`}></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-4 pt-3 border-top">
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="dashboard-content-wrapper bg-white border rounded p-4 p-md-5 h-100">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
