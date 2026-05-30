'use client';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';

const defaultData = {
  title: '', subtitle: '', description: '', btn_text: '', btn_link: '',
  image: '', serial: 0, status: 1,
};

function SliderFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group">
          <label>Slide Title *</label>
          <input value={formData.title || ''} onChange={e => set('title', e.target.value)} required placeholder="e.g. Experience the Spiritual Journey" />
        </div>
        <div className="admin-form-group">
          <label>Subtitle / Tag</label>
          <input value={formData.subtitle || ''} onChange={e => set('subtitle', e.target.value)} placeholder="e.g. Hajj & Umrah Packages" />
        </div>
        <div className="admin-form-group">
          <label>Description</label>
          <textarea value={formData.description || ''} onChange={e => set('description', e.target.value)} rows={3} placeholder="Short description shown on the slide" />
        </div>
        <div className="row">
          <div className="col-md-6 admin-form-group">
            <label>Button Text</label>
            <input value={formData.btn_text || ''} onChange={e => set('btn_text', e.target.value)} placeholder="e.g. View Packages" />
          </div>
          <div className="col-md-6 admin-form-group">
            <label>Button Link</label>
            <input value={formData.btn_link || ''} onChange={e => set('btn_link', e.target.value)} placeholder="/tours" />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Slide Background Image" value={formData.image} onChange={v => set('image', v)} folder="uploads/sliders" />
        <div className="admin-form-group">
          <label>Display Order</label>
          <input type="number" value={formData.serial || 0} onChange={e => set('serial', Number(e.target.value))} placeholder="0" />
        </div>
        <div className="admin-form-group">
          <label>Status</label>
          <select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function CreateSliderPage() {
  return (
    <AdminFormPage title="Slider" apiUrl="/api/admin/sliders" backUrl="/admin/sliders" defaultData={defaultData}>
      {SliderFormFields}
    </AdminFormPage>
  );
}
