'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminListPage from '@/components/admin/AdminListPage';

const BOX_STYLES = [
  'linear-gradient(135deg, #F59E0B, #D97706)',
  'linear-gradient(135deg, #8B5CF6, #6D28D9)',
  'linear-gradient(135deg, #10B981, #059669)',
  'linear-gradient(135deg, #EC4899, #BE185D)',
];

function StatBoxes() {
  const [s, setS] = useState(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const st = d.stats || {};
          setS({
            total:  st.totalVisas    ?? 0,
            active: st.totalVisas    ?? 0,
            cats:   st.visaCatCount  ?? 0,
            apps:   st.totalVisaApps ?? 0,
          });
        }
      })
      .then(() =>
        fetch('/api/admin/visa-categories?limit=1')
          .then(r => r.json())
          .then(d => { if (d.success) setS(p => p ? { ...p, cats: d.pagination?.total ?? d.data?.length ?? 0 } : p); })
          .catch(() => {})
      )
      .catch(() => {});
  }, []);

  const boxes = [
    { label: 'Total Visa',          value: s?.total  ?? '...' },
    { label: 'Total Active Visa',   value: s?.active ?? '...' },
    { label: 'Total Visa Category', value: s?.cats   ?? '...' },
    { label: 'Total Submission',    value: s?.apps   ?? '...' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
      {boxes.map((b, i) => (
        <div key={b.label} style={{ background: BOX_STYLES[i], borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden', minHeight: 100 }}>
          <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 10, lineHeight: 1.3 }}>{b.label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{b.value}</div>
        </div>
      ))}
    </div>
  );
}

const columns = [
  {
    key: 'title', label: 'Title',
    render: (item) => (
      <strong>{item.title}</strong>
    ),
  },
  { key: 'category.name', label: 'Category' },
  { key: 'processing', label: 'Processing Time' },
  { key: 'validity', label: 'Validity' },
  { key: 'cost', label: 'Cost', render: (item) => item.cost ? <span>SAR {item.cost}</span> : <span style={{ color: '#aaa' }}>—</span> },
  {
    key: 'status', label: 'Status',
    render: (item) => (
      <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>
        {item.status === 1 ? 'Published' : 'Draft'}
      </span>
    ),
  },
];

export default function AdminVisaPage() {
  return (
    <>
      <StatBoxes />
      <AdminListPage
        title="Visas"
        apiUrl="/api/admin/visas"
        createUrl="/admin/visa/create"
        editUrl={(id) => `/admin/visa/${id}/edit`}
        columns={columns}
        extraActions={
          <>
            <Link href="/admin/visa/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#2563EB', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M22 12h-6l-2 3h-4l-2-3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Applications
            </Link>
            <Link href="/admin/visa/category" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#7C3AED', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg> Categories
            </Link>
          </>
        }
      />
    </>
  );
}
