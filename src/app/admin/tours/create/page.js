'use client';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';
import DynamicListInput from '@/components/admin/DynamicListInput';

const defaultData = {
  title: '', slug: '', content: '', category: { name: '' }, features_image: '',
  galleries: [], pricing: { price: 0, sale_price: 0, child_price: 0 },
  min_people: 1, max_people: 10, faqs: [], includes: [], excludes: [],
  itinerary: [], highlights: [], location: { address: '' },
  seo: { meta_title: '', meta_desc: '' }, status: 1,
};

function TourFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const setNested = (parent, key, val) => setFormData(prev => ({
    ...prev, [parent]: { ...prev[parent], [key]: val }
  }));

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="admin-form-group">
          <label>Title *</label>
          <input value={formData.title || ''} onChange={e => { set('title', e.target.value); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')); }} required />
        </div>
        <div className="admin-form-group">
          <label>Slug</label>
          <input value={formData.slug || ''} onChange={e => set('slug', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Content</label>
          <textarea value={formData.content || ''} onChange={e => set('content', e.target.value)} rows={8} />
        </div>

        <DynamicListInput
          label="Itinerary" addLabel="Add Day"
          fields={[{ key: 'title', label: 'Day Title' }, { key: 'content', label: 'Description', type: 'textarea' }]}
          items={formData.itinerary || []} onChange={v => set('itinerary', v)}
        />
        <DynamicListInput
          label="Includes" addLabel="Add Include"
          fields={[{ key: 'title', label: 'Include' }]}
          items={formData.includes || []} onChange={v => set('includes', v)}
        />
        <DynamicListInput
          label="Excludes" addLabel="Add Exclude"
          fields={[{ key: 'title', label: 'Exclude' }]}
          items={formData.excludes || []} onChange={v => set('excludes', v)}
        />
        <DynamicListInput
          label="FAQs" addLabel="Add FAQ"
          fields={[{ key: 'title', label: 'Question' }, { key: 'content', label: 'Answer', type: 'textarea' }]}
          items={formData.faqs || []} onChange={v => set('faqs', v)}
        />
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Featured Image" value={formData.features_image} onChange={v => set('features_image', v)} folder="uploads/tours" />

        <div className="admin-form-group">
          <label>Category</label>
          <input value={formData.category?.name || ''} onChange={e => setNested('category', 'name', e.target.value)} placeholder="e.g. Umrah Package" />
        </div>
        <div className="row">
          <div className="col-6 admin-form-group">
            <label>Price ($)</label>
            <input type="number" value={formData.pricing?.price || ''} onChange={e => setNested('pricing', 'price', Number(e.target.value))} />
          </div>
          <div className="col-6 admin-form-group">
            <label>Sale Price ($)</label>
            <input type="number" value={formData.pricing?.sale_price || ''} onChange={e => setNested('pricing', 'sale_price', Number(e.target.value))} />
          </div>
        </div>
        <div className="row">
          <div className="col-6 admin-form-group">
            <label>Min People</label>
            <input type="number" value={formData.min_people || ''} onChange={e => set('min_people', Number(e.target.value))} />
          </div>
          <div className="col-6 admin-form-group">
            <label>Max People</label>
            <input type="number" value={formData.max_people || ''} onChange={e => set('max_people', Number(e.target.value))} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Location</label>
          <input value={formData.location?.address || ''} onChange={e => setNested('location', 'address', e.target.value)} placeholder="e.g. Makkah, Saudi Arabia" />
        </div>
        <div className="admin-form-group">
          <label>Status</label>
          <select value={formData.status ?? 1} onChange={e => set('status', Number(e.target.value))}>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
        <div className="admin-form-group">
          <label>SEO Title</label>
          <input value={formData.seo?.meta_title || ''} onChange={e => setNested('seo', 'meta_title', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>SEO Description</label>
          <textarea value={formData.seo?.meta_desc || ''} onChange={e => setNested('seo', 'meta_desc', e.target.value)} rows={3} />
        </div>
      </div>
    </div>
  );
}

export default function AdminTourCreatePage() {
  return (
    <AdminFormPage title="Tour" apiUrl="/api/admin/tours" backUrl="/admin/tours" defaultData={defaultData}>
      {TourFormFields}
    </AdminFormPage>
  );
}
