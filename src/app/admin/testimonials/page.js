'use client';

import AdminListPage from '@/components/admin/AdminListPage';

const columns = [
  { key: 'image', label: 'Photo', type: 'image' },
  { key: 'name', label: 'Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'rating', label: 'Rating' },
  { key: 'serial', label: 'Order' },
  { key: 'status', label: 'Status', type: 'status' },
];

export default function AdminTestimonialsPage() {
  return (
    <AdminListPage
      title="Testimonials"
      apiUrl="/api/admin/testimonials"
      createUrl="/admin/testimonials/create"
      editUrl={(id) => `/admin/testimonials/${id}/edit`}
      columns={columns}
    />
  );
}
