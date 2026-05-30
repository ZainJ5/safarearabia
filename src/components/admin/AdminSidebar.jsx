'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
  { label: 'Tours', href: '/admin/tours', icon: 'bi-map', sub: [
    { label: 'All Tours', href: '/admin/tours' },
    { label: 'Create Tour', href: '/admin/tours/create' },
  ]},
  { label: 'Hotels', href: '/admin/hotels', icon: 'bi-building', sub: [
    { label: 'All Hotels', href: '/admin/hotels' },
    { label: 'Create Hotel', href: '/admin/hotels/create' },
  ]},
  { label: 'Transport', href: '/admin/transport', icon: 'bi-car-front', sub: [
    { label: 'All Transport', href: '/admin/transport' },
    { label: 'Create Transport', href: '/admin/transport/create' },
  ]},
  { label: 'Visa', href: '/admin/visa', icon: 'bi-passport', sub: [
    { label: 'All Visas', href: '/admin/visa' },
    { label: 'Create Visa', href: '/admin/visa/create' },
  ]},
  { label: 'Activities', href: '/admin/activities', icon: 'bi-activity', sub: [
    { label: 'All Activities', href: '/admin/activities' },
    { label: 'Create Activity', href: '/admin/activities/create' },
  ]},
  { label: 'Destinations', href: '/admin/destinations', icon: 'bi-geo-alt', sub: [
    { label: 'All Destinations', href: '/admin/destinations' },
    { label: 'Create Destination', href: '/admin/destinations/create' },
  ]},
  { label: 'Blog', href: '/admin/blog', icon: 'bi-journal-text', sub: [
    { label: 'All Posts', href: '/admin/blog' },
    { label: 'Create Post', href: '/admin/blog/create' },
  ]},
  { label: 'Orders', href: '/admin/orders', icon: 'bi-receipt' },
  { label: 'Users', href: '/admin/users', icon: 'bi-people' },
  { label: 'Sliders', href: '/admin/sliders', icon: 'bi-images', sub: [
    { label: 'All Sliders', href: '/admin/sliders' },
    { label: 'Create Slider', href: '/admin/sliders/create' },
  ]},
  { label: 'Testimonials', href: '/admin/testimonials', icon: 'bi-chat-quote', sub: [
    { label: 'All Testimonials', href: '/admin/testimonials' },
    { label: 'Create Testimonial', href: '/admin/testimonials/create' },
  ]},
  { label: 'Contacts', href: '/admin/contacts', icon: 'bi-envelope' },
  { label: 'Subscribers', href: '/admin/subscribers', icon: 'bi-envelope-at' },
  { label: 'Settings', href: '/admin/settings', icon: 'bi-gear' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSubs, setOpenSubs] = useState({});

  const toggleSub = (label) => {
    setOpenSubs(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="admin-sidebar-toggle d-lg-none"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'fixed', top: 12, left: 12, zIndex: 1100,
          background: 'var(--primary-color1, #B1723C)', color: '#fff',
          border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer',
        }}
      >
        <i className={`bi ${collapsed ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      <aside
        className={`admin-sidebar ${collapsed ? 'show' : ''}`}
        style={{
          width: 260, background: '#1a1d23', color: '#adb5bd',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
          overflowY: 'auto', position: 'sticky', top: 0, height: '100vh',
          transition: '0.3s',
          zIndex: 1050,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-color1, #B1723C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
              SA
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#fff' }}>Safar e Arabian</h5>
              <span style={{ fontSize: 11, color: '#888' }}>Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.sub ? (
                <>
                  <button
                    onClick={() => toggleSub(item.label)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                      padding: '11px 24px', border: 'none', background: 'transparent',
                      color: isActive(item.href) ? '#fff' : '#adb5bd',
                      fontSize: 14, cursor: 'pointer', textAlign: 'left',
                      transition: '0.2s',
                    }}
                  >
                    <i className={`bi ${item.icon}`} style={{ fontSize: 17, width: 22 }}></i>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <i className={`bi bi-chevron-${openSubs[item.label] || isActive(item.href) ? 'down' : 'right'}`} style={{ fontSize: 11 }}></i>
                  </button>
                  {(openSubs[item.label] || isActive(item.href)) && (
                    <div style={{ paddingLeft: 56 }}>
                      {item.sub.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          style={{
                            display: 'block', padding: '8px 0', fontSize: 13,
                            color: pathname === sub.href ? 'var(--primary-color1, #B1723C)' : '#888',
                            textDecoration: 'none', transition: '0.2s',
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 24px', textDecoration: 'none',
                    color: isActive(item.href) ? '#fff' : '#adb5bd',
                    background: isActive(item.href) ? 'rgba(177,114,60,0.15)' : 'transparent',
                    borderRight: isActive(item.href) ? '3px solid var(--primary-color1, #B1723C)' : '3px solid transparent',
                    fontSize: 14, transition: '0.2s',
                  }}
                >
                  <i className={`bi ${item.icon}`} style={{ fontSize: 17, width: 22 }}></i>
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: '#666' }}>
          © 2026 Safar e Arabian
        </div>
      </aside>

      {/* Mobile overlay */}
      {collapsed && (
        <div onClick={() => setCollapsed(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1040,
        }} className="d-lg-none" />
      )}

      <style>{`
        @media (max-width: 991px) {
          .admin-sidebar { position: fixed !important; left: -260px; }
          .admin-sidebar.show { left: 0 !important; }
        }
      `}</style>
    </>
  );
}
