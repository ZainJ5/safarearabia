'use client';
import { use } from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';
import ImageUpload from '@/components/admin/ImageUpload';

function UserFormFields(formData, setFormData) {
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="row">
          <div className="col-md-6 admin-form-group"><label>First Name</label><input value={formData.fname || ''} onChange={e => set('fname', e.target.value)} required /></div>
          <div className="col-md-6 admin-form-group"><label>Last Name</label><input value={formData.lname || ''} onChange={e => set('lname', e.target.value)} required /></div>
        </div>
        <div className="admin-form-group"><label>Email</label><input type="email" value={formData.email || ''} onChange={e => set('email', e.target.value)} required /></div>
        <div className="admin-form-group"><label>Phone</label><input value={formData.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
        <div className="admin-form-group"><label>Address</label><textarea value={formData.address || ''} onChange={e => set('address', e.target.value)} rows={3} /></div>
      </div>
      <div className="col-lg-4">
        <ImageUpload label="Profile Image" value={formData.image} onChange={v => set('image', v)} folder="uploads/users" />
        <div className="admin-form-group">
          <label>Role</label>
          <select value={formData.role ?? 3} onChange={e => set('role', Number(e.target.value))}>
            <option value={1}>Admin</option>
            <option value={2}>Merchant</option>
            <option value={3}>Customer</option>
          </select>
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

export default function AdminUserEditPage({ params }) {
  const { id } = use(params);
  return <AdminFormPage title="User" apiUrl="/api/admin/users" id={id} backUrl="/admin/users">{UserFormFields}</AdminFormPage>;
}
