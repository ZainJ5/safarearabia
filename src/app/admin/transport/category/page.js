'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const sS = { background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '20px 24px', marginBottom: 20 };
const iS = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', color: '#333', outline: 'none' };
const lS = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 5 };

export default function TransportCategoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const r = await fetch('/api/admin/transport-categories');
      const d = await r.json();
      if (d.success) setItems(d.data || []);
      else setFetchError(d.error || 'Failed to load categories');
    } catch {
      setFetchError('Network error — could not fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditId(null); setForm({ name: '', icon: '' }); setShowModal(true); };
  const openEdit = (item) => { setEditId(item._id); setForm({ name: item.name, icon: item.icon || '' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm({ name: '', icon: '' }); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      const body = { name: form.name.trim(), icon: form.icon.trim(), slug };
      const url = editId
        ? `/api/admin/transport-categories/${editId}`
        : '/api/admin/transport-categories';
      const method = editId ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.success) { toast.success(editId ? 'Category updated!' : 'Category created!'); closeModal(); fetchItems(); }
      else toast.error(d.error || 'Failed to save');
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      const r = await fetch(`/api/admin/transport-categories/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Deleted!'); fetchItems(); }
      else toast.error(d.error || 'Failed to delete');
    } catch { toast.error('Network error'); }
  };

  const thS = {
    padding: '10px 14px', textAlign: 'left', fontSize: 13, fontWeight: 600,
    background: '#6f42c1', color: '#fff',
  };
  const tdS = { padding: '10px 14px', fontSize: 14, borderBottom: '1px solid #f0f0f0' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: 12, color: '#888' }}>Home / Transport Categories</span>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#222' }}>Transport Categories</h4>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={openAdd}
            style={{ background: '#6f42c1', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', cursor: 'pointer', fontWeight: 500, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <i className="bi bi-plus-circle" /> Add New
          </button>
          <Link
            href="/admin/transport"
            style={{ background: '#6f42c1', color: '#fff', padding: '9px 20px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
          >
            &#8594; Go Back
          </Link>
        </div>
      </div>

      {/* Table */}
      <div style={sS}>
        {loading && <p style={{ textAlign: 'center', color: '#888', margin: 0 }}>Loading...</p>}
        {fetchError && <p style={{ color: '#dc3545', margin: 0 }}>{fetchError}</p>}
        {!loading && !fetchError && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['S.N', 'Category Name', 'Icon', 'Date', 'Option'].map(h => (
                  <th key={h} style={thS}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...tdS, textAlign: 'center', color: '#888', padding: 32 }}>
                    No categories found. Click &ldquo;Add New&rdquo; to create one.
                  </td>
                </tr>
              )}
              {items.map((item, idx) => (
                <tr key={item._id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={tdS}>{idx + 1}</td>
                  <td style={{ ...tdS, fontWeight: 500 }}>{item.name}</td>
                  <td style={tdS}>
                    {item.icon
                      ? <><i className={item.icon} style={{ fontSize: 18, marginRight: 6 }} /><span style={{ fontSize: 12, color: '#888' }}>{item.icon}</span></>
                      : '—'}
                  </td>
                  <td style={{ ...tdS, color: '#888' }}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : '—'}
                  </td>
                  <td style={tdS}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => openEdit(item)}
                        style={{ padding: '5px 12px', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{ padding: '5px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: 500, maxWidth: '90vw', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                {editId ? 'Edit Transport Category' : 'Add Transport Category'}
              </h5>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: '1px solid #ccc', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Category Name */}
            <div style={{ marginBottom: 22 }}>
              <label style={lS}>
                Category Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                style={iS}
                placeholder="Enter Transport Category Name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              />
            </div>

            {/* Icon */}
            <div style={{ marginBottom: 28 }}>
              <label style={lS}>
                Class Icon — get icon in{' '}
                <a href="https://icons.getbootstrap.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3' }}>
                  icons.getbootstrap.com
                </a>
              </label>
              <input
                style={iS}
                placeholder="Ex: bi bi-facebook"
                value={form.icon}
                onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
              />
              {form.icon && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#555', fontSize: 13 }}>
                  <i className={form.icon} style={{ fontSize: 20 }} />
                  <span>Preview</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{ padding: '10px 28px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 14 }}
              >
                Close
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ padding: '10px 28px', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 14 }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
