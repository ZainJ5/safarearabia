'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminHeader({ user }) {
  return (
    <header style={{
      background: '#fff', padding: '0 24px', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid #e8e8e8', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#333' }}>Admin Panel</h5>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" target="_blank" style={{ fontSize: 13, color: 'var(--primary-color1, #B1723C)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="bi bi-box-arrow-up-right"></i> View Site
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color1), var(--primary-color2, #6D4100))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 600,
          }}>
            {user?.fname?.charAt(0) || 'A'}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              {user?.fname || 'Admin'} {user?.lname || ''}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#888' }}>Administrator</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            background: 'transparent', border: '1px solid #ddd', borderRadius: 6,
            padding: '6px 14px', fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, color: '#666',
          }}
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </header>
  );
}
