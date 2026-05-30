'use client';
import { use } from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';
import DynamicListInput from '@/components/admin/DynamicListInput';

function VisaFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setNested = (p, k, v) => setFormData(prev => ({ ...prev, [p]: { ...prev[p], [k]: v } }));
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group"><label>Title *</label><input value={formData.title || ''} onChange={e => set('title', e.target.value)} required /></div>
        <div className="admin-form-group"><label>Slug</label><input value={formData.slug || ''} onChange={e => set('slug', e.target.value)} /></div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Maximum Stay</label><input value={formData.maximum_stay || ''} onChange={e => set('maximum_stay', e.target.value)} /></div>
          <div className="col-6 admin-form-group"><label>Processing Time</label><input value={formData.processing || ''} onChange={e => set('processing', e.target.value)} /></div>
        </div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Validity</label><input value={formData.validity || ''} onChange={e => set('validity', e.target.value)} /></div>
          <div className="col-6 admin-form-group"><label>Visa Mode</label><input value={formData.visa_mode || ''} onChange={e => set('visa_mode', e.target.value)} /></div>
        </div>
        <DynamicListInput label="Requirements" addLabel="Add" fields={[{ key: 'title', label: 'Requirement' }]} items={formData.includes || []} onChange={v => set('includes', v)} />
        <DynamicListInput label="FAQs" addLabel="Add FAQ" fields={[{ key: 'title', label: 'Question' }, { key: 'content', label: 'Answer', type: 'textarea' }]} items={formData.faqs || []} onChange={v => set('faqs', v)} />
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Featured Image" value={formData.features_image} onChange={v => set('features_image', v)} folder="uploads/visas" />
        <div className="admin-form-group"><label>Category</label><input value={formData.category?.name || ''} onChange={e => setNested('category', 'name', e.target.value)} /></div>
        <div className="admin-form-group"><label>Cost ($)</label><input type="number" value={formData.cost || ''} onChange={e => set('cost', Number(e.target.value))} /></div>
        <div className="admin-form-group"><label>Status</label><select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
      </div>
    </div>
  );
}

export default function AdminVisaEditPage({ params }) {
  const { id } = use(params);
  return <AdminFormPage title="Visa" apiUrl="/api/admin/visas" id={id} backUrl="/admin/visa">{VisaFormFields}</AdminFormPage>;
}
