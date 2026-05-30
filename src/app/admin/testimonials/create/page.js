'use client';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';

const defaultData = {
  name: '', designation: '', comment: '', rating: 5,
  image: '', serial: 0, status: 1,
};

function TestimonialFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group">
          <label>Customer Name *</label>
          <input value={formData.name || ''} onChange={e => set('name', e.target.value)} required placeholder="e.g. Ali Muhammad" />
        </div>
        <div className="admin-form-group">
          <label>Designation / Role</label>
          <input value={formData.designation || ''} onChange={e => set('designation', e.target.value)} placeholder="e.g. Umrah Pilgrim" />
        </div>
        <div className="admin-form-group">
          <label>Testimonial Comment *</label>
          <textarea value={formData.comment || ''} onChange={e => set('comment', e.target.value)} required rows={4} placeholder="Customer review..." />
        </div>
        <div className="admin-form-group">
          <label>Rating (1-5)</label>
          <select value={formData.rating || 5} onChange={e => set('rating', Number(e.target.value))}>
            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
            <option value={3}>⭐⭐⭐ (3 Stars)</option>
            <option value={2}>⭐⭐ (2 Stars)</option>
            <option value={1}>⭐ (1 Star)</option>
          </select>
        </div>
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Customer Photo" value={formData.image} onChange={v => set('image', v)} folder="uploads/testimonials" />
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

export default function CreateTestimonialPage() {
  return (
    <AdminFormPage title="Testimonial" apiUrl="/api/admin/testimonials" backUrl="/admin/testimonials" defaultData={defaultData}>
      {TestimonialFormFields}
    </AdminFormPage>
  );
}
