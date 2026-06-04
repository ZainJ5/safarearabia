'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const IcoEdit  = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoTrash = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoSave  = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoPlus  = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>;
const IcoX     = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;

const EMPTY_FORM = { name: '', icon: '' };

const inp = {
  width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB',
  borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
  background: '#FAFAFA', color: '#111827', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

export default function TransportCategoryPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/transport-categories');
      const d = await r.json();
      if (d.success) setItems(d.data || []);
      else toast.error(d.error || 'Failed to load');
    } catch { toast.error('Network error'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({ name: item.name, icon: item.icon || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      const slug   = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      const body   = { name: form.name.trim(), icon: form.icon.trim(), slug };
      const url    = editId ? `/api/admin/transport-categories/${editId}` : '/api/admin/transport-categories';
      const method = editId ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.success) {
        toast.success(editId ? 'Category updated!' : 'Category added!');
        cancelEdit();
        load();
      } else toast.error(d.error || 'Failed');
    } catch { toast.error('Network error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setConfirmId(null);
    try {
      const r = await fetch(`/api/admin/transport-categories/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Deleted'); load(); }
      else toast.error(d.error || 'Failed');
    } catch { toast.error('Network error'); }
  };

  return (
    <>
      {/* Delete confirm */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '36px 40px', maxWidth: 380, width: '90%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#EF4444' }}>
              <IcoTrash />
            </div>
            <h5 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#111827' }}>Delete Category?</h5>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 28 }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Transport Categories</h2>
        <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Manage vehicle type categories for transport listings</p>
      </div>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left: Form ── */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '22px 22px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', position: 'sticky', top: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{editId ? 'Edit Category' : 'Add Category'}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{editId ? 'Update the selected category' : 'Create a new vehicle type'}</div>
            </div>
            {editId && (
              <button onClick={cancelEdit} style={{ width: 28, height: 28, border: '1.5px solid #E5E7EB', borderRadius: 7, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                <IcoX />
              </button>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                Category Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                style={inp}
                placeholder="e.g. Sedan, SUV, Van..."
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onFocus={e => { e.target.style.borderColor = '#B1723C'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                Bootstrap Icon Class
              </label>
              <input
                style={inp}
                placeholder="e.g. bi bi-car-front"
                value={form.icon}
                onChange={e => set('icon', e.target.value)}
                onFocus={e => { e.target.style.borderColor = '#B1723C'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
              />
              {form.icon && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#B1723C', fontSize: 13 }}>
                  <i className={form.icon} style={{ fontSize: 18 }} />
                  <span style={{ color: '#9CA3AF' }}>Icon preview</span>
                </div>
              )}
              <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '6px 0 0' }}>
                Browse icons at{' '}
                <a href="https://icons.getbootstrap.com" target="_blank" rel="noopener noreferrer" style={{ color: '#B1723C' }}>
                  icons.getbootstrap.com
                </a>
              </p>
            </div>

            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '11px 0', border: 'none', borderRadius: 9,
              background: saving ? '#D4904E' : editId ? '#2563EB' : '#B1723C',
              color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              {saving ? (
                <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving...</>
              ) : editId ? (
                <><IcoSave /> Update Category</>
              ) : (
                <><IcoPlus /> Add Category</>
              )}
            </button>
          </form>
        </div>

        {/* ── Right: List ── */}
        <div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827' }}>All Categories</div>
              <div style={{ fontSize: 12, color: '#9CA3AF', background: '#F3F4F6', padding: '3px 10px', borderRadius: 20 }}>{items.length} total</div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: 13 }}>Loading...</p>
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                <svg width="44" height="44" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 12px', color: '#D1D5DB' }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', margin: '0 0 4px' }}>No categories yet</p>
                <p style={{ fontSize: 13, margin: 0 }}>Add your first transport category using the form.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: 48 }}>#</th>
                      <th>Category Name</th>
                      <th>Icon</th>
                      <th>Created</th>
                      <th style={{ width: 100 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item._id} style={{ background: editId === item._id ? '#FEF9F5' : undefined }}>
                        <td style={{ color: '#9CA3AF', fontSize: 12 }}>{idx + 1}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: '#111827' }}>{item.name}</div>
                          {item.slug && <div style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1 }}>{item.slug}</div>}
                        </td>
                        <td>
                          {item.icon ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <i className={item.icon} style={{ fontSize: 18, color: '#B1723C' }} />
                              <span style={{ fontSize: 11.5, color: '#9CA3AF' }}>{item.icon}</span>
                            </div>
                          ) : <span style={{ color: '#D1D5DB', fontSize: 12 }}>—</span>}
                        </td>
                        <td style={{ fontSize: 12, color: '#9CA3AF' }}>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => startEdit(item)}
                              title="Edit"
                              style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: editId === item._id ? '#2563EB' : '#EFF6FF', color: editId === item._id ? '#fff' : '#2563EB', border: `1px solid ${editId === item._id ? '#2563EB' : '#BFDBFE'}`, borderRadius: 7, cursor: 'pointer' }}>
                              <IcoEdit />
                            </button>
                            <button onClick={() => setConfirmId(item._id)}
                              title="Delete"
                              style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 7, cursor: 'pointer' }}>
                              <IcoTrash />
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
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
