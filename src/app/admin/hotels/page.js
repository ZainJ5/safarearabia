'use client';
import { useState, useEffect } from 'react';
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
            total:    st.totalHotels   ?? 0,
            active:   st.totalHotels   ?? 0,
            bookings: d.recentOrders?.filter(o => o.product_type === 'hotel').length ?? 0,
            amount:   `SAR ${Number(d.totalRevenue || 0).toLocaleString()}`,
          });
        }
      })
      .catch(() => {});
  }, []);

  const boxes = [
    { label: 'Total Hotel',          value: s?.total    ?? '...' },
    { label: 'Total Active Hotel',   value: s?.active   ?? '...' },
    { label: 'Total Booking',        value: s?.bookings ?? '...' },
    { label: 'Total Booking Amount', value: s?.amount   ?? '...' },
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
  { key: 'title', label: 'Title', render: (item) => (
    <strong>{item.title}</strong>
  )},
  { key: 'category.name', label: 'Category' },
  { key: 'price', label: 'Price/Night', render: (item) => <span>SAR {item.price || '—'}</span> },
  { key: 'status', label: 'Status', render: (item) => (
    <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>
      {item.status === 1 ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Date', render: (item) => (
    <span style={{ fontSize: 13, color: '#888' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</span>
  )},
];

export default function AdminHotelsPage() {
  return (
    <>
      <StatBoxes />
      <AdminListPage title="Hotels" apiUrl="/api/admin/hotels" createUrl="/admin/hotels/create"
        editUrl={(id) => `/admin/hotels/${id}/edit`} columns={columns} />
    </>
  );
}
