'use client';
import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'title', label: 'Title', render: (item) => <strong>{item.title}</strong> },
  { key: 'category.name', label: 'Category' },
  { key: 'pricing.price', label: 'Price', render: (item) => <span>${item.pricing?.price || '—'}</span> },
  { key: 'duration_days', label: 'Duration', render: (item) => <span>{item.duration_days || 0}D / {item.duration_nights || 0}N</span> },
  { key: 'status', label: 'Status', render: (item) => <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.status === 1 ? 'Active' : 'Inactive'}</span> },
];

export default function AdminActivitiesPage() {
  return <AdminListPage title="Activities" apiUrl="/api/admin/activities" createUrl="/admin/activities/create" editUrl={(id) => `/admin/activities/${id}/edit`} columns={columns} />;
}
