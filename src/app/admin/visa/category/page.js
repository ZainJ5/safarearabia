'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API = '/api/admin/visa-categories';

const emptyForm = { name: '', slug: '' };

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

export default function VisaCategoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}?limit=100`);
      const d = await r.json();
      if (d.success) setItems(d.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ name: item.name, slug: item.slug }); setEditId(item._id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(emptyForm); };

  const setName = (v) => setForm(f => ({ ...f, name: v, slug: editId ? f.slug : slugify(v) }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      const url = editId ? `${API}/${editId}` : API;
      const method = editId ? 'PUT' : 'POST';
      const body = { ...form, slug: form.slug || slugify(form.name) };
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.success) {
        toast.success(editId ? 'Updated' : 'Created');
        closeModal();
        load();
      } else {
        toast.error(d.error || 'Failed to save');
      }
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setConfirmId(null);
    const tid = toast.loading('Deleting...');
    try {
      const r = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Deleted', { id: tid }); load(); }
      else toast.error(d.error || 'Failed', { id: tid });
    } catch (e) { toast.error(e.message, { id: tid }); }
  };

  const sS = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24, marginBottom: 20 };
  const iS = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lS = { fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6, display: 'block' };

  return (
    <>
      {/* Confirm Delete */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', maxWidth: 380, width: '90%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-trash" style={{ fontSize: 26, color: '#dc3545' }}></i>
            </div>
            <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Category</h5>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Are you sure? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} className="admin-btn" style={{ background: '#f0f0f0', minWidth: 90 }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} className="admin-btn admin-btn-danger" style={{ minWidth: 90 }}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: 480, maxWidth: '95vw', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 24 }}>{editId ? 'Edit' : 'Add'} Visa Category</h5>

            <div style={{ marginBottom: 18 }}>
              <label style={lS}>Category Name *</label>
              <input
                style={iS}
                value={form.name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter Visa Category Name"
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={lS}>Slug</label>
              <input
                style={iS}
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated"
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={closeModal} className="admin-btn" style={{ background: '#dc3545', color: '#fff', minWidth: 90 }}>Close</button>
              <button onClick={handleSave} disabled={saving} className="admin-btn" style={{ background: '#6f42c1', color: '#fff', minWidth: 90 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Visa Categories</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{items.length} total categories</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/visa" className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>
            <i className="bi bi-arrow-left"></i> Go Back
          </Link>
          <button onClick={openCreate} className="admin-btn admin-btn-primary">
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
      </div>

      <div style={sS}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <i className="bi bi-arrow-repeat" style={{ fontSize: 28, display: 'block', marginBottom: 8, animation: 'spin 1s linear infinite' }}></i>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <i className="bi bi-tags" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
            No categories yet. Click "Add New" to create one.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead style={{ background: '#6f42c1' }}>
                <tr>
                  <th style={{ color: '#fff', background: '#6f42c1' }}>S.N</th>
                  <th style={{ color: '#fff', background: '#6f42c1' }}>Category Name</th>
                  <th style={{ color: '#fff', background: '#6f42c1' }}>Slug</th>
                  <th style={{ color: '#fff', background: '#6f42c1' }}>Date</th>
                  <th style={{ color: '#fff', background: '#6f42c1', width: 120 }}>Option</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item._id}>
                    <td>{idx + 1}</td>
                    <td><strong>{item.name}</strong></td>
                    <td><span style={{ fontSize: 12, color: '#888' }}>{item.slug}</span></td>
                    <td style={{ fontSize: 13, color: '#888' }}>
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(item)} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button onClick={() => setConfirmId(item._id)} className="admin-btn admin-btn-danger admin-btn-sm">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
