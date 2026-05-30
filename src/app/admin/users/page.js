'use client';
import AdminListPage from '@/components/admin/AdminListPage';

const roleMap = { 1: 'Admin', 2: 'Merchant', 3: 'Customer' };
const roleBadge = { 1: 'admin-badge-danger', 2: 'admin-badge-info', 3: 'admin-badge-success' };

const columns = [
  { key: 'name', label: 'Name', render: (item) => <div><strong>{item.fname} {item.lname}</strong></div> },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone', render: (item) => <span>{item.phone || '—'}</span> },
  { key: 'role', label: 'Role', render: (item) => <span className={`admin-badge ${roleBadge[item.role] || ''}`}>{roleMap[item.role] || 'Unknown'}</span> },
  { key: 'status', label: 'Status', render: (item) => <span className={`admin-badge ${item.status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.status === 1 ? 'Active' : 'Inactive'}</span> },
  { key: 'created_at', label: 'Date', render: (item) => <span style={{ fontSize: 13, color: '#888' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</span> },
];

export default function AdminUsersPage() {
  return <AdminListPage title="Users" apiUrl="/api/admin/users" editUrl={(id) => `/admin/users/${id}/edit`} columns={columns} />;
}
