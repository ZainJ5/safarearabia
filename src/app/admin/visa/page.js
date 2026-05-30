'use client';
import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'title', label: 'Title', render: (item) => <div><strong>{item.title}</strong><br /><span style={{ fontSize: 12, color: '#888' }}>/{item.slug}</span></div> },
  { key: 'category.name', label: 'Category' },
  { key: 'cost', label: 'Cost', render: (item) => <span>${item.cost || '—'}</span> },
  { key: 'validity', label: 'Validity' },
  { key: 'status', label: 'Status', render: (item) => <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.status === 1 ? 'Active' : 'Inactive'}</span> },
];

export default function AdminVisaPage() {
  return <AdminListPage title="Visas" apiUrl="/api/admin/visas" createUrl="/admin/visa/create" editUrl={(id) => `/admin/visa/${id}/edit`} columns={columns} />;
}
