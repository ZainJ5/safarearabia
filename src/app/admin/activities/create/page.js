'use client';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';
import DynamicListInput from '@/components/admin/DynamicListInput';

const defaultData = {
  title: '', slug: '', content: '', category: { name: '' }, feature_img: '',
  duration_days: 1, duration_nights: 0, min_people: 1, max_people: 10,
  pricing: { price: 0, sale_price: 0 }, faqs: [], includes: [], excludes: [],
  location: { address: '' }, seo: { meta_title: '', meta_desc: '' }, status: 1,
};

function ActivityFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setNested = (p, k, v) => setFormData(prev => ({ ...prev, [p]: { ...prev[p], [k]: v } }));
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group"><label>Title *</label><input value={formData.title || ''} onChange={e => { set('title', e.target.value); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')); }} required /></div>
        <div className="admin-form-group"><label>Slug</label><input value={formData.slug || ''} onChange={e => set('slug', e.target.value)} /></div>
        <div className="admin-form-group"><label>Content</label><textarea value={formData.content || ''} onChange={e => set('content', e.target.value)} rows={6} /></div>
        <DynamicListInput label="Includes" addLabel="Add" fields={[{ key: 'title', label: 'Include' }]} items={formData.includes || []} onChange={v => set('includes', v)} />
        <DynamicListInput label="Excludes" addLabel="Add" fields={[{ key: 'title', label: 'Exclude' }]} items={formData.excludes || []} onChange={v => set('excludes', v)} />
        <DynamicListInput label="FAQs" addLabel="Add FAQ" fields={[{ key: 'title', label: 'Question' }, { key: 'content', label: 'Answer', type: 'textarea' }]} items={formData.faqs || []} onChange={v => set('faqs', v)} />
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Featured Image" value={formData.feature_img} onChange={v => set('feature_img', v)} folder="uploads/activities" />
        <div className="admin-form-group"><label>Category</label><input value={formData.category?.name || ''} onChange={e => setNested('category', 'name', e.target.value)} /></div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Price ($)</label><input type="number" value={formData.pricing?.price || ''} onChange={e => setNested('pricing', 'price', Number(e.target.value))} /></div>
          <div className="col-6 admin-form-group"><label>Sale Price ($)</label><input type="number" value={formData.pricing?.sale_price || ''} onChange={e => setNested('pricing', 'sale_price', Number(e.target.value))} /></div>
        </div>
        <div className="row">
          <div className="col-6 admin-form-group"><label>Duration (Days)</label><input type="number" value={formData.duration_days || ''} onChange={e => set('duration_days', Number(e.target.value))} /></div>
          <div className="col-6 admin-form-group"><label>Nights</label><input type="number" value={formData.duration_nights || ''} onChange={e => set('duration_nights', Number(e.target.value))} /></div>
        </div>
        <div className="admin-form-group"><label>Location</label><input value={formData.location?.address || ''} onChange={e => setNested('location', 'address', e.target.value)} /></div>
        <div className="admin-form-group"><label>Status</label><select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
      </div>
    </div>
  );
}

export default function AdminActivityCreatePage() {
  return <AdminFormPage title="Activity" apiUrl="/api/admin/activities" backUrl="/admin/activities" defaultData={defaultData}>{ActivityFormFields}</AdminFormPage>;
}
