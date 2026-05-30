'use client';
import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'title', label: 'Title', render: (item) => <div><strong>{item.title}</strong><br /><span style={{ fontSize: 12, color: '#888' }}>/{item.slug}</span></div> },
  { key: 'category.name', label: 'Category' },
  { key: 'car_type', label: 'Type' },
  { key: 'car_price', label: 'Car Price', render: (item) => <span>${item.car_price || '—'}</span> },
  { key: 'status', label: 'Status', render: (item) => <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.status === 1 ? 'Active' : 'Inactive'}</span> },
];

export default function AdminTransportPage() {
  return <AdminListPage title="Transport" apiUrl="/api/admin/transports" createUrl="/admin/transport/create" editUrl={(id) => `/admin/transport/${id}/edit`} columns={columns} />;
}
