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
  { key: 'processing', label: 'Processing Time' },
  { key: 'validity', label: 'Validity' },
  {
    key: 'cost', label: 'Cost',
    render: (item) => item.cost ? <span>SAR {item.cost}</span> : <span style={{ color: '#aaa' }}>—</span>,
  },
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
    <AdminListPage
      title="Visas"
      apiUrl="/api/admin/visas"
      createUrl="/admin/visa/create"
      editUrl={(id) => `/admin/visa/${id}/edit`}
      columns={columns}
      extraActions={
        <>
          <Link href="/admin/visa/applications" className="admin-btn" style={{ background: '#0d6efd', color: '#fff' }}>
            <i className="bi bi-inbox"></i> Applications
          </Link>
          <Link href="/admin/visa/category" className="admin-btn" style={{ background: '#6f42c1', color: '#fff' }}>
            <i className="bi bi-tags"></i> Categories
          </Link>
        </>
      }
    />
  );
}
