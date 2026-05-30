'use client';
import { use } from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';
import DynamicListInput from '@/components/admin/DynamicListInput';

function HotelFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setNested = (parent, key, val) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [key]: val } }));

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group"><label>Title *</label><input value={formData.title || ''} onChange={e => set('title', e.target.value)} required /></div>
        <div className="admin-form-group"><label>Slug</label><input value={formData.slug || ''} onChange={e => set('slug', e.target.value)} /></div>
        <div className="admin-form-group"><label>Content</label><textarea value={formData.content || ''} onChange={e => set('content', e.target.value)} rows={8} /></div>
        <DynamicListInput label="Policies" addLabel="Add Policy" fields={[{ key: 'title', label: 'Policy Title' }, { key: 'content', label: 'Details', type: 'textarea' }]} items={formData.policies || []} onChange={v => set('policies', v)} />
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Featured Image" value={formData.feature_img} onChange={v => set('feature_img', v)} folder="uploads/hotels" />
        <div className="admin-form-group"><label>Category</label><input value={formData.category?.name || ''} onChange={e => setNested('category', 'name', e.target.value)} /></div>
        <div className="admin-form-group"><label>Price/Night ($)</label><input type="number" value={formData.price || ''} onChange={e => set('price', Number(e.target.value))} /></div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Room Type</label><input value={formData.room_type || ''} onChange={e => set('room_type', e.target.value)} /></div>
          <div className="col-6 admin-form-group"><label>Bed Type</label><input value={formData.bed_type || ''} onChange={e => set('bed_type', e.target.value)} /></div>
        </div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Check In</label><input value={formData.check_in || ''} onChange={e => set('check_in', e.target.value)} /></div>
          <div className="col-6 admin-form-group"><label>Check Out</label><input value={formData.check_out || ''} onChange={e => set('check_out', e.target.value)} /></div>
        </div>
        <div className="admin-form-group"><label>Guests</label><input type="number" value={formData.guest_capability || ''} onChange={e => set('guest_capability', Number(e.target.value))} /></div>
        <div className="admin-form-group"><label>Location</label><input value={formData.location?.address || ''} onChange={e => setNested('location', 'address', e.target.value)} /></div>
        <div className="admin-form-group"><label>Status</label><select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
      </div>
    </div>
  );
}

export default function AdminHotelEditPage({ params }) {
  const { id } = use(params);
  return <AdminFormPage title="Hotel" apiUrl="/api/admin/hotels" id={id} backUrl="/admin/hotels">{HotelFormFields}</AdminFormPage>;
}
