'use client';
import { use } from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';

function DestinationFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setNested = (p, k, v) => setFormData(prev => ({ ...prev, [p]: { ...prev[p], [k]: v } }));
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group"><label>Title *</label><input value={formData.title || ''} onChange={e => set('title', e.target.value)} required /></div>
        <div className="admin-form-group"><label>Slug</label><input value={formData.slug || ''} onChange={e => set('slug', e.target.value)} /></div>
        <div className="admin-form-group"><label>Content</label><textarea value={formData.content || ''} onChange={e => set('content', e.target.value)} rows={6} /></div>
        <div className="admin-form-group"><label>SEO Title</label><input value={formData.seo?.meta_title || ''} onChange={e => setNested('seo', 'meta_title', e.target.value)} /></div>
        <div className="admin-form-group"><label>SEO Description</label><textarea value={formData.seo?.meta_desc || ''} onChange={e => setNested('seo', 'meta_desc', e.target.value)} rows={3} /></div>
      </div>
      <div className="col-lg-4">
        <div className="admin-form-group"><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={formData.is_featured || false} onChange={e => set('is_featured', e.target.checked)} /> Featured</label></div>
        <div className="admin-form-group"><label>Status</label><select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
      </div>
    </div>
  );
}

export default function AdminDestinationEditPage({ params }) {
  const { id } = use(params);
  return <AdminFormPage title="Destination" apiUrl="/api/admin/destinations" id={id} backUrl="/admin/destinations">{DestinationFormFields}</AdminFormPage>;
}
