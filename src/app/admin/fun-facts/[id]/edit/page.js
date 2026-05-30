'use client';
import { use } from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';

function FunFactFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  
  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="admin-form-group">
          <label>Number *</label>
          <input type="number" value={formData.number || ''} onChange={e => set('number', Number(e.target.value))} required placeholder="e.g. 5000" />
        </div>
        <div className="admin-form-group">
          <label>Suffix</label>
          <input value={formData.suffix || ''} onChange={e => set('suffix', e.target.value)} placeholder="e.g. + or K+" />
        </div>
        <div className="admin-form-group">
          <label>Label *</label>
          <input value={formData.label || ''} onChange={e => set('label', e.target.value)} required placeholder="e.g. Happy Pilgrims" />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="admin-form-group">
          <label>Bootstrap Icon Class</label>
          <input value={formData.icon || ''} onChange={e => set('icon', e.target.value)} placeholder="e.g. bi-people-fill" />
        </div>
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

export default function EditFunFactPage({ params }) {
  const { id } = use(params);
  return (
    <AdminFormPage title="Fun Fact" apiUrl="/api/admin/fun-facts" id={id} backUrl="/admin/fun-facts">
      {FunFactFormFields}
    </AdminFormPage>
  );
}
