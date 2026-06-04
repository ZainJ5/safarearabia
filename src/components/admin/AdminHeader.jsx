'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAdminSidebar } from './AdminSidebarContext';

const BREADCRUMBS = {
  '/admin/dashboard':                       ['Dashboard'],
  '/admin/arrivals':                        ['Operations', 'Arrivals'],
  // Hotel
  '/admin/hotels':                          ['Hotel', 'Hotel List'],
  '/admin/hotels/invoice':                  ['Hotel', 'Hotel Booking'],
  '/admin/hotels/invoice/create':           ['Hotel', 'Create Invoice'],
  '/admin/hotels/bookings':                 ['Hotel', 'Hotel Booking'],
  // Transport
  '/admin/transport':                       ['Transport', 'Vehicle List'],
  '/admin/transport/invoice':               ['Transport', 'Transport Bookings'],
  '/admin/transport/invoice/create':        ['Transport', 'Transport Invoice'],
  '/admin/transport/inquiries':             ['Transport', 'Transport Bookings'],
  '/admin/transport/category':              ['Transport', 'Categories'],
  // Visa
  '/admin/visa':                            ['Visa', 'All Visas'],
  '/admin/visa/create':                     ['Visa', 'Add Visa'],
  '/admin/visa/category':                   ['Visa', 'Categories'],
  '/admin/visa/applications':               ['Visa', 'Applications'],
  // Air Ticket
  '/admin/air-ticket':                      ['Air Ticket'],
  // Accounts & Finance
  '/admin/accounts':                        ['Accounts'],
  '/admin/income':                          ['Income'],
  '/admin/expenses':                        ['Expenses'],
  '/admin/invoices':                        ['Invoices'],
  '/admin/payments':                        ['Payments'],
  // Agents
  '/admin/agents':                          ['Agents', 'All Agents'],
  '/admin/agents/create':                   ['Agents', 'Add Agent'],
  // Customers
  '/admin/customers':                       ['Customers'],
  // Reports
  '/admin/reports':                         ['Reports'],
  // Settings
  '/admin/settings':                        ['Settings', 'Company Profile'],
  '/admin/settings/email':                  ['Settings', 'Email Settings'],
  '/admin/settings/sms':                    ['Settings', 'SMS / WhatsApp'],
  '/admin/settings/invoice-templates':      ['Settings', 'Invoice Templates'],
  '/admin/settings/currency':               ['Settings', 'Currency Settings'],
  // Other
  '/admin/users':                           ['Users'],
  '/admin/tours':                           ['Content', 'Tours'],
  '/admin/destinations':                    ['Content', 'Destinations'],
  '/admin/blog':                            ['Content', 'Blog'],
  '/admin/orders':                          ['Orders & Bookings'],
  '/admin/contacts':                        ['Contacts'],
};

const IcoSettings = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8"/></svg>
);
const IcoSignOut = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IcoChevron = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IcoGrid = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>
);

export default function AdminHeader({ user }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen } = useAdminSidebar();

  const isObjectId = (s) => /^[a-f0-9]{24}$/i.test(s);

  const rawCrumbs = BREADCRUMBS[pathname]
    || pathname.replace('/admin/', '').split('/').map(s => {
      if (isObjectId(s)) return 'Detail';
      return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
    });
  const crumbs = rawCrumbs;
  const pageTitle = crumbs[crumbs.length - 1];
  const userInitial = (user?.fname?.charAt(0) || 'A').toUpperCase();
  const roleLabel = Number(user?.role) === 2 ? 'Agent' : 'Administrator';

  return (
    <>
    <header style={{
      background: '#fff',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      borderBottom: '1px solid #ECEEF2',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: 16,
    }}>
      {/* Hamburger — mobile only */}
      <button
        className="admin-hamburger"
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: '1px solid #ECEEF2', borderRadius: 8,
          width: 36, height: 36, cursor: 'pointer',
          display: 'none', // shown via CSS on mobile
          alignItems: 'center', justifyContent: 'center',
          color: '#374151', flexShrink: 0,
        }}
        aria-label="Open menu"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Left: breadcrumb only — page provides its own h2 title */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/admin/dashboard" style={{ color: '#6B7280', fontSize: 13.5, textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s' }}>Admin</Link>
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#C9CDD5" strokeWidth="2.2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 13.5, color: i === crumbs.length - 1 ? '#111827' : '#6B7280', fontWeight: i === crumbs.length - 1 ? 700 : 500 }}>{c}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

        {/* Quick actions */}
        <Link href="/admin/dashboard" title="Dashboard" style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid #ECEEF2', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', textDecoration: 'none', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#374151'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FAFAFA'; e.currentTarget.style.color = '#6B7280'; }}>
          <IcoGrid />
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#ECEEF2', margin: '0 4px' }} />

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '5px 10px 5px 5px',
              border: '1px solid #ECEEF2', borderRadius: 10,
              background: '#FAFAFA', cursor: 'pointer',
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FAFAFA'; e.currentTarget.style.borderColor = '#ECEEF2'; }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #B1723C 0%, #6D4100 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0,
            }}>
              {userInitial}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{user?.fname || 'Admin'} {user?.lname || ''}</div>
              <div style={{ fontSize: 10.5, color: '#9CA3AF', lineHeight: 1 }}>{roleLabel}</div>
            </div>
            <span style={{ color: '#9CA3AF', marginLeft: 2 }}><IcoChevron /></span>
          </button>

          {menuOpen && (
            <>
              <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50,
                background: '#fff', borderRadius: 13, minWidth: 210, overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)',
              }}>
                {/* User info */}
                <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #B1723C 0%, #6D4100 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                    {userInitial}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user?.fname} {user?.lname}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{user?.email}</div>
                  </div>
                </div>

                {/* Role badge */}
                <div style={{ padding: '10px 16px 6px' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, background: '#FDF4EC', color: '#B1723C', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(177,114,60,0.15)' }}>{roleLabel}</span>
                </div>

                <div style={{ padding: '4px 6px 6px' }}>
                  <Link
                    href="/admin/settings"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, color: '#374151', fontSize: 13, textDecoration: 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#9CA3AF' }}><IcoSettings /></span>
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, color: '#DC2626', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#FCA5A5' }}><IcoSignOut /></span>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>

    <style>{`
      @media (max-width: 768px) {
        .admin-hamburger { display: flex !important; }
      }
    `}</style>
  </>
  );
}
