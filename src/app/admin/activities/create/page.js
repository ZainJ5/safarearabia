'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import RichEditor from '@/components/admin/RichEditor';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

const FACILITY_OPTIONS = ['Mountain Bike', 'Satellite Office', 'Staff Lounge', 'WiFi', 'Swimming Pool', 'Gym', 'Parking', 'Restaurant', 'Spa', 'Bar'];
const STYLE_OPTIONS = ['Cultural', 'Festival & Events', 'Independent', 'Marine', 'Adventure', 'Wildlife', 'Religious', 'Historical'];

const defaultData = {
  title: '', slug: '', content: '', youtube_video: '', youtube_thumbnail: '',
  category: { name: '' }, feature_img: '', galleries: [],
  duration_days: 1, duration_nights: 0, min_people: 1, max_people: 10,
  pricing: { price: 0, sale_price: 0, child_price: 0 },
  faqs: [], includes: [], excludes: [], highlights: [], itinerary: [],
  facilities: [], travel_styles: [],
  location: { address: '', country: '', state: '', city: '', zip_code: '', coordinates: { lat: '', lng: '' } },
  seo: { enable_seo: false, meta_title: '', meta_desc: '' }, status: 1,
};

const sS = { background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '20px 24px', marginBottom: 20 };
const sT = { fontSize: 15, fontWeight: 600, color: '#222', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' };
const iS = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', color: '#333', outline: 'none' };
const lS = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 5 };
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

function DynList({ label, addLabel, value = [], onChange, fields }) {
  const [newItem, setNewItem] = useState(() => Object.fromEntries(fields.map(f => [f.key, ''])));
  const add = () => {
    if (!newItem[fields[0].key]?.trim()) { toast.error('Fill in at least the first field'); return; }
    onChange([...value, { ...newItem }]);
    setNewItem(Object.fromEntries(fields.map(f => [f.key, ''])));
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const update = (i, k, v) => { const a = [...value]; a[i] = { ...a[i], [k]: v }; onChange(a); };

  return (
    <div style={sS}>
      <div style={sT}>{label}</div>
      {value.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {fields.map(f => (
              <div key={f.key} style={{ marginBottom: f.type === 'textarea' ? 0 : 0 }}>
                {f.type === 'textarea'
                  ? <textarea style={{ ...iS, height: 60, resize: 'vertical', marginBottom: 4 }} value={item[f.key] || ''} onChange={e => update(i, f.key, e.target.value)} placeholder={f.label} />
                  : <input style={{ ...iS, marginBottom: 4 }} value={item[f.key] || ''} onChange={e => update(i, f.key, e.target.value)} placeholder={f.label} />
                }
              </div>
            ))}
          </div>
          <button type="button" onClick={() => remove(i)} style={{ padding: '9px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>
      ))}
      <div style={{ borderTop: value.length ? '1px solid #f0f0f0' : 'none', paddingTop: value.length ? 12 : 0 }}>
        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: 8 }}>
            <label style={lS}>{f.label}</label>
            {f.type === 'textarea'
              ? <textarea style={{ ...iS, height: 70, resize: 'vertical' }} value={newItem[f.key]} onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.label} />
              : <input style={iS} value={newItem[f.key]} onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.label}
                  onKeyDown={e => { if (e.key === 'Enter' && fields.length === 1) { e.preventDefault(); add(); } }} />
            }
          </div>
        ))}
        <button type="button" onClick={add} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '9px 22px', cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg> {addLabel}
        </button>
      </div>
    </div>
  );
}

function CheckGroup({ label, options, value = [], onChange }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter(v => v !== o) : [...value, o]);
  return (
    <div style={sS}>
      <div style={sT}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px' }}>
        {options.map(o => (
          <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13.5, color: '#555' }}>
            <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} style={{ width: 14, height: 14 }} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function AdminActivityCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultData);
  const [saving, setSaving] = useState(false);
  const [ytFile, setYtFile] = useState(null);
  const [ytPreview, setYtPreview] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setN = (par, k, v) => setForm(p => ({ ...p, [par]: { ...p[par], [k]: v } }));
  const setD = (p1, p2, k, v) => setForm(p => ({ ...p, [p1]: { ...p[p1], [p2]: { ...p[p1][p2], [k]: v } } }));

  const uploadFeatImg = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'uploads/activities');
    const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const res = await r.json();
    if (res.success) { set('feature_img', res.url); toast.success('Image uploaded'); }
    else toast.error('Upload failed');
  };

  const handleSubmit = async (status) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      let ytThumb = form.youtube_thumbnail;
      if (ytFile) {
        const fd = new FormData(); fd.append('file', ytFile); fd.append('folder', 'uploads/activities');
        const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const res = await r.json();
        if (res.success) ytThumb = res.url;
      }
      const body = { ...form, youtube_thumbnail: ytThumb, status, slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') };
      delete body._id;
      const res = await fetch('/api/admin/activities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { toast.success('Activity created!'); router.push('/admin/activities'); }
      else toast.error(data.error || 'Failed to save');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: 12, color: '#888' }}>Home / <Link href="/admin/activities" style={{ color: '#888' }}>Add Activity</Link></span>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#222' }}>Add Activity</h4>
        </div>
        <Link href="/admin/activities" style={{ background: '#6f42c1', color: '#fff', padding: '9px 20px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          &#8594; Go Back
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Content */}
          <div style={sS}>
            <div style={sT}>Activity Content</div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Title *</label>
              <input style={iS} placeholder="Name of the activity" value={form.title}
                onChange={e => { set('title', e.target.value); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')); }} required />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Content *</label>
              <RichEditor value={form.content} onChange={v => set('content', v)} minHeight={180} />
            </div>
            <div style={row2}>
              <div>
                <label style={lS}>YouTube Video Thumbnail</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ padding: '7px 14px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>
                    Choose File<input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) { setYtFile(f); setYtPreview(URL.createObjectURL(f)); } }} />
                  </label>
                  <span style={{ fontSize: 13, color: '#888' }}>{ytFile ? ytFile.name : 'No file chosen'}</span>
                </div>
                {ytPreview && <img src={ytPreview} alt="thumb" style={{ marginTop: 8, width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }} />}
              </div>
              <div>
                <label style={lS}>YouTube Video URL</label>
                <input style={iS} placeholder="Paste the YouTube video URL here" value={form.youtube_video} onChange={e => set('youtube_video', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Duration & Capacity */}
          <div style={sS}>
            <div style={sT}>Duration &amp; Capacity</div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Duration (Days)</label><input style={iS} type="number" min="1" value={form.duration_days} onChange={e => set('duration_days', Number(e.target.value))} /></div>
              <div><label style={lS}>Duration (Nights)</label><input style={iS} type="number" min="0" value={form.duration_nights} onChange={e => set('duration_nights', Number(e.target.value))} /></div>
            </div>
            <div style={row2}>
              <div><label style={lS}>Min People</label><input style={iS} type="number" min="1" value={form.min_people} onChange={e => set('min_people', Number(e.target.value))} /></div>
              <div><label style={lS}>Max People</label><input style={iS} type="number" min="1" value={form.max_people} onChange={e => set('max_people', Number(e.target.value))} /></div>
            </div>
          </div>

          {/* Pricing */}
          <div style={sS}>
            <div style={sT}>Pricing</div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Price (per person)</label><input style={iS} type="number" value={form.pricing?.price || ''} onChange={e => setN('pricing', 'price', Number(e.target.value))} /></div>
              <div><label style={lS}>Sale Price</label><input style={iS} type="number" value={form.pricing?.sale_price || ''} onChange={e => setN('pricing', 'sale_price', Number(e.target.value))} /></div>
            </div>
            <div style={{ width: '50%' }}>
              <label style={lS}>Child Price</label>
              <input style={iS} type="number" value={form.pricing?.child_price || ''} onChange={e => setN('pricing', 'child_price', Number(e.target.value))} />
            </div>
          </div>

          {/* Facilities & Travel Styles */}
          <CheckGroup label="Facilities" options={FACILITY_OPTIONS} value={form.facilities} onChange={v => set('facilities', v)} />
          <CheckGroup label="Travel Styles" options={STYLE_OPTIONS} value={form.travel_styles} onChange={v => set('travel_styles', v)} />

          {/* Includes / Excludes / Highlights */}
          <DynList label="Include Features" addLabel="Add Include" fields={[{ key: 'title', label: 'Include item' }]} value={form.includes} onChange={v => set('includes', v)} />
          <DynList label="Exclude Features" addLabel="Add Exclude" fields={[{ key: 'title', label: 'Exclude item' }]} value={form.excludes} onChange={v => set('excludes', v)} />
          <DynList label="Highlights of the Tour" addLabel="Add Highlight" fields={[{ key: 'title', label: 'Highlight' }]} value={form.highlights} onChange={v => set('highlights', v)} />

          {/* Itinerary */}
          <DynList label="Itinerary" addLabel="Add Day" fields={[{ key: 'title', label: 'Day title (e.g. Day 1: Arrival)' }, { key: 'content', label: 'Day description', type: 'textarea' }]} value={form.itinerary} onChange={v => set('itinerary', v)} />

          {/* FAQs */}
          <DynList label="Frequently Asked Questions" addLabel="Add FAQ" fields={[{ key: 'title', label: 'Question' }, { key: 'content', label: 'Answer', type: 'textarea' }]} value={form.faqs} onChange={v => set('faqs', v)} />

          {/* Location */}
          <div style={sS}>
            <div style={sT}>Location</div>
            <div style={{ marginBottom: 14 }}><label style={lS}>Address</label><input style={iS} placeholder="Enter Activity Address" value={form.location.address} onChange={e => setN('location', 'address', e.target.value)} /></div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Country</label><input style={iS} placeholder="Country" value={form.location.country || ''} onChange={e => setN('location', 'country', e.target.value)} /></div>
              <div><label style={lS}>State</label><input style={iS} placeholder="State" value={form.location.state || ''} onChange={e => setN('location', 'state', e.target.value)} /></div>
            </div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>City</label><input style={iS} placeholder="City" value={form.location.city || ''} onChange={e => setN('location', 'city', e.target.value)} /></div>
              <div><label style={lS}>Zip/Postal</label><input style={iS} placeholder="Zip/Postal" value={form.location.zip_code || ''} onChange={e => setN('location', 'zip_code', e.target.value)} /></div>
            </div>
            <div style={row2}>
              <div>
                <label style={lS}>Latitude</label>
                <input style={iS} placeholder="Latitude" value={form.location.coordinates?.lat || ''} onChange={e => setD('location', 'coordinates', 'lat', e.target.value)} />
                <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#2196f3', marginTop: 4, display: 'block' }}>Go Here to get Latitude from address</a>
              </div>
              <div>
                <label style={lS}>Longitude</label>
                <input style={iS} placeholder="Longitude" value={form.location.coordinates?.lng || ''} onChange={e => setD('location', 'coordinates', 'lng', e.target.value)} />
                <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#2196f3', marginTop: 4, display: 'block' }}>Go Here to get Longitude from address</a>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div style={sS}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#444' }}>
              <input type="checkbox" checked={form.seo?.enable_seo || false} onChange={e => setN('seo', 'enable_seo', e.target.checked)} style={{ width: 14, height: 14 }} />
              Allow SEO
            </label>
            {form.seo?.enable_seo && (
              <div style={{ marginTop: 14 }}>
                <div style={{ marginBottom: 12 }}><label style={lS}>Meta Title</label><input style={iS} value={form.seo?.meta_title || ''} onChange={e => setN('seo', 'meta_title', e.target.value)} /></div>
                <div><label style={lS}>Meta Description</label><textarea style={{ ...iS, height: 80, resize: 'vertical' }} value={form.seo?.meta_desc || ''} onChange={e => setN('seo', 'meta_desc', e.target.value)} /></div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ ...sS, display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => handleSubmit(1)} disabled={saving} style={{ flex: 1, padding: '10px 0', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>{saving ? 'Saving...' : 'Published'}</button>
            <button type="button" onClick={() => handleSubmit(0)} disabled={saving} style={{ flex: 1, padding: '10px 0', background: '#ffc107', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Save As Draft</button>
          </div>

          <div style={sS}>
            <div style={sT}>Category</div>
            <select style={{ ...iS, appearance: 'auto' }} value={form.category?.name || ''} onChange={e => set('category', { name: e.target.value })}>
              <option value="">Select Option</option>
              {['Adventures', 'Cultural', 'Nature', 'City Tours', 'Water Sports', 'Religious', 'Historical', 'Food & Dining'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={sS}>
            <div style={sT}>Feature Image</div>
            <div onClick={() => document.getElementById('_actFeat').click()} style={{ border: '2px dashed #c8e6c9', borderRadius: 8, padding: '32px 16px', textAlign: 'center', cursor: 'pointer', background: '#f9fffe' }}>
              {form.feature_img
                ? <img src={form.feature_img} alt="feature" style={{ maxWidth: '100%', maxHeight: 110, objectFit: 'cover', borderRadius: 4 }} />
                : <><svg width="28" height="28" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 8px', color: '#ccc' }}><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg><p style={{ margin: 0, color: '#aaa', fontSize: 13 }}>Choose an image file or drag it here</p></>
              }
            </div>
            <input id="_actFeat" type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadFeatImg} />
            {form.feature_img && <button type="button" onClick={() => set('feature_img', '')} style={{ marginTop: 6, fontSize: 12, color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>Remove image</button>}
          </div>

          <div style={sS}>
            <div style={sT}>Image Gallery</div>
            <MultiImageUpload value={form.galleries} onChange={v => set('galleries', v)} folder="uploads/activities" label="" />
          </div>
        </div>
      </div>
    </div>
  );
}
