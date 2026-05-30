'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminFormPage({ title, apiUrl, id, backUrl, children, defaultData = {} }) {
  const router = useRouter();
  const [formData, setFormData] = useState(defaultData);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/${id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setFormData(data.data);
          else setError('Failed to load item');
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `${apiUrl}/${id}` : apiUrl;
      const method = isEdit ? 'PUT' : 'POST';

      // Clean _id from formData for create
      const body = { ...formData };
      if (!isEdit) delete body._id;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        router.push(backUrl);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{isEdit ? `Edit ${title}` : `Create ${title}`}</h4>
        </div>
        <Link href={backUrl} className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>
          <i className="bi bi-arrow-left"></i> Back
        </Link>
      </div>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          {children(formData, setFormData, isEdit)}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </button>
          <Link href={backUrl} className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
