'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

/* ── module-level helpers (never re-created on render) ── */

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ListSection({ label, items, placeholder, newVal, setNewVal, onAdd, onRemove, onEdit, twoField }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: '#333', display: 'block', marginBottom: 10 }}>{label}</label>
      {(items || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start', background: '#f8f9fa', borderRadius: 6, padding: '10px 12px', border: '1px solid #eee' }}>
          <span style={{ fontSize: 11, color: '#999', fontWeight: 700, minWidth: 20, paddingTop: 8 }}>#{i + 1}</span>
          <div style={{ flex: 1 }}>
            <input
              value={item.title || ''}
              onChange={e => onEdit(i, 'title', e.target.value)}
              placeholder={placeholder}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }}
            />
            {twoField && (
              <textarea
                value={item.content || ''}
                onChange={e => onEdit(i, 'content', e.target.value)}
                placeholder="Answer / Description"
                rows={2}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, marginTop: 6, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            )}
          </div>
          <button type="button" onClick={() => onRemove(i)} style={{ background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 4, padding: '6px 8px', cursor: 'pointer', fontSize: 14, marginTop: 4 }}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        <input
          value={newVal}
          onChange={e => setNewVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }}
          placeholder={`New ${placeholder || 'item'}…`}
          style={{ flex: 1, padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
        />
        <button type="button" onClick={onAdd} style={{ padding: '9px 18px', background: '#212529', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="bi bi-plus-circle"></i> Add New
        </button>
      </div>
    </div>
  );
}

/* ── shared styles ── */
const sS = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 28, marginBottom: 20 };
const iS = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const lS = { fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6, display: 'block' };

const defaultForm = {
  title: '', slug: '', category: { name: '', _id: null },
  processing: '', maximum_stay: '', validity: '', visa_mode: '', cost: '', cost_summary: '',
  country: '', agent_setting: '', allow_seo: false,
  features_image: '',
  faqs: [], includes: [], required_documents: [],
  status: 1,
};

/* ── page ── */
export default function AdminVisaCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newFaq, setNewFaq] = useState('');
  const [newDoc, setNewDoc] = useState('');
  const [newInclude, setNewInclude] = useState('');

  useEffect(() => {
    fetch('/api/admin/visa-categories?limit=100')
      .then(r => r.json())
      .then(d => { if (d.success) setCategories(d.data); })
      .catch(() => {});
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addFaq = useCallback(() => {
    if (!newFaq.trim()) return;
    setForm(f => ({ ...f, faqs: [...f.faqs, { title: newFaq, content: '' }] }));
    setNewFaq('');
  }, [newFaq]);
  const removeFaq = useCallback((i) => setForm(f => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) })), []);
  const editFaq = useCallback((i, key, val) => setForm(f => { const a = [...f.faqs]; a[i] = { ...a[i], [key]: val }; return { ...f, faqs: a }; }), []);

  const addDoc = useCallback(() => {
    if (!newDoc.trim()) return;
    setForm(f => ({ ...f, required_documents: [...f.required_documents, { title: newDoc }] }));
    setNewDoc('');
  }, [newDoc]);
  const removeDoc = useCallback((i) => setForm(f => ({ ...f, required_documents: f.required_documents.filter((_, idx) => idx !== i) })), []);
  const editDoc = useCallback((i, key, val) => setForm(f => { const a = [...f.required_documents]; a[i] = { ...a[i], [key]: val }; return { ...f, required_documents: a }; }), []);

  const addInclude = useCallback(() => {
    if (!newInclude.trim()) return;
    setForm(f => ({ ...f, includes: [...f.includes, { title: newInclude }] }));
    setNewInclude('');
  }, [newInclude]);
  const removeInclude = useCallback((i) => setForm(f => ({ ...f, includes: f.includes.filter((_, idx) => idx !== i) })), []);
  const editInclude = useCallback((i, key, val) => setForm(f => { const a = [...f.includes]; a[i] = { ...a[i], [key]: val }; return { ...f, includes: a }; }), []);

  const handleSubmit = async (statusVal) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const body = { ...form, status: statusVal, slug: form.slug || slugify(form.title) };
      const r = await fetch('/api/admin/visas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (d.success) { toast.success('Visa created!'); router.push('/admin/visa'); }
      else toast.error(d.error || 'Failed to save');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const sidebarCard = { background: '#1a1a2e', borderRadius: 10, padding: 20, marginBottom: 16 };
  const sidebarLabel = { fontSize: 13, fontWeight: 600, color: '#ccc', marginBottom: 6, display: 'block' };
  const sidebarSelect = { width: '100%', padding: '10px 14px', border: '1px solid #333', borderRadius: 6, fontSize: 14, background: '#16213e', color: '#fff', boxSizing: 'border-box' };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Add Visa</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>Create a new visa listing</p>
        </div>
        <Link href="/admin/visa" className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>
          <i className="bi bi-arrow-left"></i> Go Back
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* ── Main column ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Visa Content */}
          <div style={sS}>
            <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>Visa Content</h6>
            <div style={{ marginBottom: 16 }}>
              <label style={lS}>Title *</label>
              <input
                style={iS}
                value={form.title}
                onChange={e => { set('title', e.target.value); set('slug', slugify(e.target.value)); }}
                placeholder="Name of the visa"
                required
              />
            </div>
          </div>

          {/* Details */}
          <div style={sS}>
            <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>Minimum/Maximum People</h6>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lS}>Visa Category *</label>
                <select
                  style={iS}
                  value={form.category?.name || ''}
                  onChange={e => {
                    const cat = categories.find(c => c.name === e.target.value);
                    set('category', cat ? { _id: cat._id, name: cat.name } : { name: e.target.value, _id: null });
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={lS}>Processing Time *</label>
                <input style={iS} value={form.processing} onChange={e => set('processing', e.target.value)} placeholder="e.g. 5–7 days" />
              </div>
              <div>
                <label style={lS}>Maximum Stays *</label>
                <input style={iS} value={form.maximum_stay} onChange={e => set('maximum_stay', e.target.value)} placeholder="e.g. 30 days" />
              </div>
              <div>
                <label style={lS}>Validity *</label>
                <input style={iS} value={form.validity} onChange={e => set('validity', e.target.value)} placeholder="e.g. 90 days" />
              </div>
              <div>
                <label style={lS}>Visa Mode *</label>
                <input style={iS} value={form.visa_mode} onChange={e => set('visa_mode', e.target.value)} placeholder="e.g. E-Visa" />
              </div>
              <div>
                <label style={lS}>Cost (SAR)</label>
                <input style={iS} type="number" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="e.g. 500" />
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={lS}>Cost Summary *</label>
              <input style={iS} value={form.cost_summary} onChange={e => set('cost_summary', e.target.value)} placeholder="Short cost description" />
            </div>
          </div>

          {/* FAQs */}
          <div style={sS}>
            <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>FAQs</h6>
            <ListSection
              label=""
              items={form.faqs}
              placeholder="Question"
              newVal={newFaq}
              setNewVal={setNewFaq}
              onAdd={addFaq}
              onRemove={removeFaq}
              onEdit={editFaq}
              twoField={true}
            />
          </div>

          {/* Required Documents */}
          <div style={sS}>
            <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>Required Documents</h6>
            <ListSection
              label=""
              items={form.required_documents}
              placeholder="Document name"
              newVal={newDoc}
              setNewVal={setNewDoc}
              onAdd={addDoc}
              onRemove={removeDoc}
              onEdit={editDoc}
              twoField={false}
            />
          </div>

          {/* Includes */}
          <div style={sS}>
            <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>What&apos;s Included</h6>
            <ListSection
              label=""
              items={form.includes}
              placeholder="Included item"
              newVal={newInclude}
              setNewVal={setNewInclude}
              onAdd={addInclude}
              onRemove={removeInclude}
              onEdit={editInclude}
              twoField={false}
            />
          </div>

          {/* Availability / SEO */}
          <div style={sS}>
            <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>Availability</h6>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
              <input
                type="checkbox"
                checked={form.allow_seo}
                onChange={e => set('allow_seo', e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              Allow SEO
            </label>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 280, flexShrink: 0 }}>
          {/* Publish */}
          <div style={sidebarCard}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
              <button
                type="button"
                onClick={() => handleSubmit(1)}
                disabled={saving}
                style={{ flex: 1, padding: '10px 0', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
              >
                {saving ? 'Saving...' : 'Published'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(0)}
                disabled={saving}
                style={{ flex: 1, padding: '10px 0', background: '#fd7e14', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
              >
                Save As Draft
              </button>
            </div>
          </div>

          {/* Country */}
          <div style={sidebarCard}>
            <label style={sidebarLabel}>Country</label>
            <input
              style={sidebarSelect}
              value={form.country}
              onChange={e => set('country', e.target.value)}
              placeholder="e.g. Saudi Arabia"
            />
          </div>

          {/* Agent Setting */}
          <div style={sidebarCard}>
            <label style={sidebarLabel}>Agent Setting</label>
            <select style={sidebarSelect} value={form.agent_setting} onChange={e => set('agent_setting', e.target.value)}>
              <option value="">Select Option</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {/* Feature Image */}
          <div style={{ ...sidebarCard, background: '#fff', border: '1px solid #e0e0e0' }}>
            <label style={{ ...sidebarLabel, color: '#333' }}>Feature Image</label>
            <ImageUpload
              label=""
              value={form.features_image}
              onChange={v => set('features_image', v)}
              folder="uploads/visas"
            />
          </div>

          {/* Slug */}
          <div style={{ ...sidebarCard, background: '#fff', border: '1px solid #e0e0e0' }}>
            <label style={{ ...sidebarLabel, color: '#333' }}>Slug</label>
            <input
              style={{ ...iS, fontSize: 13 }}
              value={form.slug}
              onChange={e => set('slug', e.target.value)}
              placeholder="auto-generated"
            />
          </div>
        </div>
      </div>
    </>
  );
}
