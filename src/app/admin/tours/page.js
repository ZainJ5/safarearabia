'use client';
import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'title', label: 'Title', render: (item) => (
    <div>
      <strong style={{ fontSize: 14 }}>{item.title}</strong>
      <br /><span style={{ fontSize: 12, color: '#888' }}>/{item.slug}</span>
    </div>
  )},
  { key: 'category.name', label: 'Category' },
  { key: 'pricing.price', label: 'Price', render: (item) => (
    <span>${item.pricing?.sale_price || item.pricing?.price || '—'}</span>
  )},
  { key: 'status', label: 'Status', render: (item) => (
    <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>
      {item.status === 1 ? 'Active' : 'Inactive'}
    </span>
  )},
  { key: 'created_at', label: 'Date', render: (item) => (
    <span style={{ fontSize: 13, color: '#888' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</span>
  )},
];

export default function AdminToursPage() {
  return (
    <AdminListPage
      title="Tours"
      apiUrl="/api/admin/tours"
      createUrl="/admin/tours/create"
      editUrl={(id) => `/admin/tours/${id}/edit`}
      columns={columns}
    />
  );
}
