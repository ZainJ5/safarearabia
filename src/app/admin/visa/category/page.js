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
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" style={{ color: '#EF4444' }}><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Category</h5>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Are you sure? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} className="admin-btn" style={{ background: '#f0f0f0', minWidth: 90 }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} className="admin-btn admin-btn-danger" style={{ minWidth: 90 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> Delete
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
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Go Back
          </Link>
          <button onClick={openCreate} className="admin-btn admin-btn-primary">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg> Add New
          </button>
        </div>
      </div>

      <div style={sS}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 10px', color: '#D1D5DB' }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
            No categories yet. Click &ldquo;Add New&rdquo; to create one.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Date</th>
                  <th style={{ width: 120 }}>Actions</th>
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
                        <button onClick={() => openEdit(item)} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 7, cursor: 'pointer' }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </button>
                        <button onClick={() => setConfirmId(item._id)} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 7, cursor: 'pointer' }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
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
