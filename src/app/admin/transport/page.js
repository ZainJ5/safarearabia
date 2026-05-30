'use client';
import Link from 'next/link';
import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  {
    key: 'title', label: 'Title',
    render: (item) => (
      <div>
        <strong>{item.title}</strong>
        <br />
        <span style={{ fontSize: 12, color: '#888' }}>/{item.slug}</span>
      </div>
    ),
  },
  { key: 'category.name', label: 'Category' },
  {
    key: 'type', label: 'Type',
    render: (item) => item.pricing_car?.vehicle_type || item.car_type || '—',
  },
  {
    key: 'price', label: 'Price',
    render: (item) => {
      const price = item.pricing_car?.price || item.car_price;
      return price ? <span>SAR {price}</span> : <span style={{ color: '#aaa' }}>—</span>;
    },
  },
  {
    key: 'status', label: 'Status',
    render: (item) => (
      <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>
        {item.status === 1 ? 'Active' : 'Draft'}
      </span>
    ),
  },
];

export default function AdminTransportPage() {
  return (
    <AdminListPage
      title="Transport"
      apiUrl="/api/admin/transports"
      createUrl="/admin/transport/create"
      editUrl={(id) => `/admin/transport/${id}/edit`}
      columns={columns}
      extraActions={
        <Link href="/admin/transport/category" className="admin-btn" style={{ background: '#6f42c1', color: '#fff' }}>
          <i className="bi bi-tags"></i> Categories
        </Link>
      }
    />
  );
}
