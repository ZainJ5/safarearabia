'use client';
import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'title', label: 'Title', render: (item) => <div><strong>{item.title}</strong><br /><span style={{ fontSize: 12, color: '#888' }}>/{item.slug}</span></div> },
  { key: 'category.name', label: 'Category' },
  { key: 'status', label: 'Status', render: (item) => <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.status === 1 ? 'Published' : 'Draft'}</span> },
  { key: 'created_at', label: 'Date', render: (item) => <span style={{ fontSize: 13, color: '#888' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</span> },
];

export default function AdminBlogPage() {
  return <AdminListPage title="Blog Posts" apiUrl="/api/admin/blogs" createUrl="/admin/blog/create" editUrl={(id) => `/admin/blog/${id}/edit`} columns={columns} />;
}
