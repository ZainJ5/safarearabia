'use client';
import { use } from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';
import DynamicListInput from '@/components/admin/DynamicListInput';

function TransportFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setNested = (p, k, v) => setFormData(prev => ({ ...prev, [p]: { ...prev[p], [k]: v } }));
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group"><label>Title *</label><input value={formData.title || ''} onChange={e => set('title', e.target.value)} required /></div>
        <div className="admin-form-group"><label>Slug</label><input value={formData.slug || ''} onChange={e => set('slug', e.target.value)} /></div>
        <div className="admin-form-group"><label>Content</label><textarea value={formData.content || ''} onChange={e => set('content', e.target.value)} rows={6} /></div>
        <DynamicListInput label="FAQs" addLabel="Add FAQ" fields={[{ key: 'title', label: 'Question' }, { key: 'content', label: 'Answer', type: 'textarea' }]} items={formData.faqs || []} onChange={v => set('faqs', v)} />
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Featured Image" value={formData.feature_img} onChange={v => set('feature_img', v)} folder="uploads/transports" />
        <div className="admin-form-group"><label>Category</label><input value={formData.category?.name || ''} onChange={e => setNested('category', 'name', e.target.value)} /></div>
        <div className="admin-form-group"><label>Car Type</label><input value={formData.car_type || ''} onChange={e => set('car_type', e.target.value)} /></div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Persons</label><input type="number" value={formData.car_person || ''} onChange={e => set('car_person', Number(e.target.value))} /></div>
          <div className="col-6 admin-form-group"><label>Distance (km)</label><input type="number" value={formData.distance_km || ''} onChange={e => set('distance_km', Number(e.target.value))} /></div>
        </div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Car Price</label><input type="number" value={formData.car_price || ''} onChange={e => set('car_price', Number(e.target.value))} /></div>
          <div className="col-6 admin-form-group"><label>Bus Price</label><input type="number" value={formData.bus_price || ''} onChange={e => set('bus_price', Number(e.target.value))} /></div>
        </div>
        <div className="admin-form-group"><label>Location</label><input value={formData.location?.address || ''} onChange={e => setNested('location', 'address', e.target.value)} /></div>
        <div className="admin-form-group"><label>Status</label><select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
      </div>
    </div>
  );
}

export default function AdminTransportEditPage({ params }) {
  const { id } = use(params);
  return <AdminFormPage title="Transport" apiUrl="/api/admin/transports" id={id} backUrl="/admin/transport">{TransportFormFields}</AdminFormPage>;
}
