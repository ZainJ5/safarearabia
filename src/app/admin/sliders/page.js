'use client';

import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'title', label: 'Title' },
  { key: 'subtitle', label: 'Subtitle' },
  { key: 'btn_text', label: 'Button Text' },
  { key: 'serial', label: 'Order' },
  { key: 'status', label: 'Status', type: 'status' },
];

export default function AdminSlidersPage() {
  return (
    <AdminListPage
      title="Hero Sliders"
      apiUrl="/api/admin/sliders"
      createUrl="/admin/sliders/create"
      editUrl={(id) => `/admin/sliders/${id}/edit`}
      columns={columns}
    />
  );
}
