'use client';
import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'title', label: 'Title', render: (item) => <div><strong>{item.title}</strong><br /><span style={{ fontSize: 12, color: '#888' }}>/{item.slug}</span></div> },
  { key: 'is_featured', label: 'Featured', render: (item) => <span className={`admin-badge ${item.is_featured ? 'admin-badge-success' : 'admin-badge-warning'}`}>{item.is_featured ? 'Yes' : 'No'}</span> },
  { key: 'status', label: 'Status', render: (item) => <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.status === 1 ? 'Active' : 'Inactive'}</span> },
  { key: 'created_at', label: 'Date', render: (item) => <span style={{ fontSize: 13, color: '#888' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</span> },
];

export default function AdminDestinationsPage() {
  return <AdminListPage title="Destinations" apiUrl="/api/admin/destinations" createUrl="/admin/destinations/create" editUrl={(id) => `/admin/destinations/${id}/edit`} columns={columns} />;
}
