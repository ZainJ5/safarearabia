'use client';

import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'icon', label: 'Icon' },
  { key: 'number', label: 'Number' },
  { key: 'suffix', label: 'Suffix' },
  { key: 'label', label: 'Label' },
  { key: 'serial', label: 'Order' },
  { key: 'status', label: 'Status', type: 'status' },
];

export default function AdminFunFactsPage() {
  return (
    <AdminListPage
      title="Fun Facts"
      apiUrl="/api/admin/fun-facts"
      createUrl="/admin/fun-facts/create"
      editUrl={(id) => `/admin/fun-facts/${id}/edit`}
      columns={columns}
    />
  );
}
