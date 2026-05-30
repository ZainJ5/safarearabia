'use client';
import { use } from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';

function BlogFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setNested = (p, k, v) => setFormData(prev => ({ ...prev, [p]: { ...prev[p], [k]: v } }));
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group"><label>Title *</label><input value={formData.title || ''} onChange={e => set('title', e.target.value)} required /></div>
        <div className="admin-form-group"><label>Slug</label><input value={formData.slug || ''} onChange={e => set('slug', e.target.value)} /></div>
        <div className="admin-form-group"><label>Content</label><textarea value={formData.description || ''} onChange={e => set('description', e.target.value)} rows={12} /></div>
        <div className="admin-form-group"><label>Tags (comma separated)</label><input value={(formData.tags || []).join(', ')} onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} /></div>
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Featured Image" value={formData.image} onChange={v => set('image', v)} folder="uploads/blogs" />
        <div className="admin-form-group"><label>Category</label><input value={formData.category?.name || ''} onChange={e => setNested('category', 'name', e.target.value)} /></div>
        <div className="admin-form-group"><label>Status</label><select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}><option value={1}>Published</option><option value={0}>Draft</option></select></div>
      </div>
    </div>
  );
}

export default function AdminBlogEditPage({ params }) {
  const { id } = use(params);
  return <AdminFormPage title="Blog Post" apiUrl="/api/admin/blogs" id={id} backUrl="/admin/blog">{BlogFormFields}</AdminFormPage>;
}
