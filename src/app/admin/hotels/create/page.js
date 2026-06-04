'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import RichEditor from '@/components/admin/RichEditor';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

const FACILITIES = [
  'Bicycle hire', 'Car hire', 'Coffee and tea', 'Flat Tv',
  'Internet - Wifi', 'Laundry and dry cleaning', 'Wake-up call',
];
const HOTEL_SERVICES = [
  'Fiesta Restaurant', 'Free luggage deposit', 'Havana Lobby bar',
  'Hotel transport services', 'Laundry Services', 'Pets welcome', 'Tickets',
];
const PROPERTY_TYPES = [
  'Apartments', 'Boats', 'Holiday homes', 'Homestays', 'Hotels',
  'Lodges', 'Motels', 'New property', 'Resorts', 'Villas',
];

const defaultData = {
  title: '', slug: '', content: '', youtube_thumbnail: '', youtube_video: '',
  policies: [], check_in: '', check_out: '', room_type: '', guest_capability: '',
  bed_type: '', cancellation: '', min_advance_reservations: '', min_stay: '',
  price: '', enable_service_fee: false,
  location: { address: '', country: '', state: '', city: '', zip_code: '', coordinates: { lat: '', lng: '' } },
  seo: { enable_seo: false, meta_title: '', meta_desc: '' },
  category: { name: '' }, agent_setting: '', breakfast: false,
  attribute_facilities: [], attribute_hotel_service: [], attribute_property_type: [],
  feature_img: '', galleries: [], status: 1,
};

const sS = { background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '20px 24px', marginBottom: 20 };
const sT = { fontSize: 15, fontWeight: 600, color: '#222', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' };
const iS = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', color: '#333', outline: 'none' };
const lS = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 5 };
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

function CheckGroup({ label, options, value = [], onChange }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter(v => v !== o) : [...value, o]);
  return (
    <div style={{ ...sS, marginBottom: 14 }}>
      <div style={sT}>{label}</div>
      {options.map(o => (
        <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, cursor: 'pointer', fontSize: 13.5, color: '#555' }}>
          <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} style={{ width: 14, height: 14, cursor: 'pointer' }} />
          {o}
        </label>
      ))}
    </div>
  );
}

export default function AdminHotelCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultData);
  const [saving, setSaving] = useState(false);
  const [newPolicyTitle, setNewPolicyTitle] = useState('');
  const [ytFile, setYtFile] = useState(null);
  const [ytPreview, setYtPreview] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setN = (par, k, v) => setForm(p => ({ ...p, [par]: { ...p[par], [k]: v } }));
  const setD = (p1, p2, k, v) => setForm(p => ({ ...p, [p1]: { ...p[p1], [p2]: { ...p[p1][p2], [k]: v } } }));

  const addPolicy = () => {
    if (!newPolicyTitle.trim()) { toast.error('Enter a policy title first'); return; }
    set('policies', [...(form.policies || []), { title: newPolicyTitle.trim() }]);
    setNewPolicyTitle('');
  };
  const removePolicy = (i) => set('policies', form.policies.filter((_, idx) => idx !== i));

  const uploadFeatImg = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'uploads/hotels');
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
        const fd = new FormData(); fd.append('file', ytFile); fd.append('folder', 'uploads/hotels');
        const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const res = await r.json();
        if (res.success) ytThumb = res.url;
      }
      const body = {
        ...form,
        youtube_thumbnail: ytThumb,
        status,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      };
      delete body._id;
      const res = await fetch('/api/admin/hotels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { toast.success('Hotel created!'); router.push('/admin/hotels'); }
      else toast.error(data.error || 'Failed to save');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: 12, color: '#888' }}>Home / <Link href="/admin/hotels" style={{ color: '#888' }}>Add Hotel</Link></span>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#222' }}>Add Hotel</h4>
        </div>
        <Link href="/admin/hotels" style={{ background: '#6f42c1', color: '#fff', padding: '9px 20px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          &#8594; Go Back
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* ── LEFT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Hotel Content */}
          <div style={sS}>
            <div style={sT}>Hotel Content</div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Title *</label>
              <input style={iS} placeholder="Name of the hotel" value={form.title}
                onChange={e => { set('title', e.target.value); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')); }} required />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Content *</label>
              <RichEditor value={form.content} onChange={v => set('content', v)} minHeight={200} />
            </div>
            <div style={{ ...row2, display: 'none' }}>
              <div>
                <label style={lS}>YouTube Video Thumbnail</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ padding: '7px 14px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>
                    Choose File
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) { setYtFile(f); setYtPreview(URL.createObjectURL(f)); } }} />
                  </label>
                  <span style={{ fontSize: 13, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ytFile ? ytFile.name : 'No file chosen'}</span>
                </div>
                {ytPreview && <img src={ytPreview} alt="thumb" style={{ marginTop: 8, width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }} />}
              </div>
              <div>
                <label style={lS}>YouTube Video URL</label>
                <input style={iS} placeholder="Paste the YouTube video URL here" value={form.youtube_video} onChange={e => set('youtube_video', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Hotel Policy */}
          <div style={sS}>
            <div style={sT}>Hotel Policy</div>
            {/* Existing policies */}
            {(form.policies || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input style={{ ...iS, flex: 1 }} value={p.title}
                  onChange={e => {
                    const arr = [...form.policies];
                    arr[i] = { ...arr[i], title: e.target.value };
                    set('policies', arr);
                  }} />
                <button type="button" onClick={() => removePolicy(i)} style={{ padding: '0 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
            ))}
            {/* New policy input */}
            <div style={{ marginBottom: 8 }}>
              <label style={lS}>Policy Title</label>
              <input style={iS} placeholder="Enter Policy Title" value={newPolicyTitle} onChange={e => setNewPolicyTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPolicy(); } }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button type="button" onClick={addPolicy} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 28px', cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg> Add New
              </button>
            </div>
          </div>

          {/* Check in/out time */}
          <div style={sS}>
            <div style={sT}>Check in/out time</div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Time for check in</label><input style={iS} placeholder="Ex: 12:00" value={form.check_in} onChange={e => set('check_in', e.target.value)} /></div>
              <div><label style={lS}>Time for check out</label><input style={iS} placeholder="Ex: 11:00" value={form.check_out} onChange={e => set('check_out', e.target.value)} /></div>
            </div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Room Type</label><input style={iS} placeholder="Room Type" value={form.room_type} onChange={e => set('room_type', e.target.value)} /></div>
              <div><label style={lS}>Guest Capability</label><input style={iS} placeholder="Ex: 11:00" value={form.guest_capability} onChange={e => set('guest_capability', e.target.value)} /></div>
            </div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Bed Type</label><input style={iS} placeholder="Bed Type" value={form.bed_type} onChange={e => set('bed_type', e.target.value)} /></div>
              <div>
                <label style={lS}>Cancellation</label>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...iS, paddingRight: 50 }} placeholder="Cancellation" value={form.cancellation} onChange={e => set('cancellation', e.target.value)} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 13, pointerEvents: 'none' }}>hours</span>
                </div>
              </div>
            </div>
            <div style={row2}>
              <div>
                <label style={lS}>Minimum advance reservations</label>
                <input style={iS} placeholder="Ex: 3" value={form.min_advance_reservations} onChange={e => set('min_advance_reservations', e.target.value)} />
                <p style={{ fontSize: 12, color: '#888', marginTop: 4, marginBottom: 0 }}>Leave blank if you dont need to use the min day option</p>
              </div>
              <div>
                <label style={lS}>Minimum day stay requirements</label>
                <input style={iS} placeholder="Ex: 2" value={form.min_stay} onChange={e => set('min_stay', e.target.value)} />
                <p style={{ fontSize: 12, color: '#888', marginTop: 4, marginBottom: 0 }}>Leave blank if you dont need to set minimum day stay option</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={sS}>
            <div style={sT}>Pricing</div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Hotel Price</label>
              <input style={iS} placeholder="Hotel Price" type="number" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#444' }}>
              <input type="checkbox" checked={form.enable_service_fee} onChange={e => set('enable_service_fee', e.target.checked)} style={{ width: 14, height: 14 }} />
              Enable Service Fee
            </label>
          </div>

          {/* Location */}
          <div style={sS}>
            <div style={sT}>Location</div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Address</label>
              <input style={iS} placeholder="Enter Hotel Address" value={form.location.address} onChange={e => setN('location', 'address', e.target.value)} />
            </div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Country *</label><input style={iS} placeholder="Select Option" value={form.location.country || ''} onChange={e => setN('location', 'country', e.target.value)} /></div>
              <div><label style={lS}>State *</label><input style={iS} placeholder="Select Option" value={form.location.state || ''} onChange={e => setN('location', 'state', e.target.value)} /></div>
            </div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>City *</label><input style={iS} placeholder="Select Option" value={form.location.city || ''} onChange={e => setN('location', 'city', e.target.value)} /></div>
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
          <div style={{ ...sS, display: 'none' }}>
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

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ width: 280, flexShrink: 0 }}>

          {/* Publish Buttons */}
          <div style={{ ...sS, display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => handleSubmit(1)} disabled={saving} style={{ flex: 1, padding: '10px 0', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              {saving ? 'Saving...' : 'Published'}
            </button>
            <button type="button" onClick={() => handleSubmit(0)} disabled={saving} style={{ flex: 1, padding: '10px 0', background: '#ffc107', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Save As Draft
            </button>
          </div>

          {/* Category */}
          <div style={sS}>
            <div style={sT}>Category</div>
            <select style={{ ...iS, appearance: 'auto' }} value={form.category?.name || ''} onChange={e => set('category', { name: e.target.value })}>
              <option value="">Select Option</option>
              {['1 Star','2 Star','3 Star','4 Star','5 Star','Boutique','Resort','Budget'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Agent Setting */}
          <div style={sS}>
            <div style={sT}>Agent Setting</div>
            <select style={{ ...iS, appearance: 'auto' }} value={form.agent_setting || ''} onChange={e => set('agent_setting', e.target.value)}>
              <option value="">Select Option</option>
              <option value="all">All Agents</option>
              <option value="specific">Specific Agent</option>
              <option value="none">No Agent</option>
            </select>
          </div>

          {/* Breakfast */}
          <div style={sS}>
            <div style={sT}>Breakfast</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#555' }}>
              <input type="checkbox" checked={form.breakfast} onChange={e => set('breakfast', e.target.checked)} style={{ width: 14, height: 14 }} />
              Breakfast included
            </label>
          </div>

          <CheckGroup label="Attribute: Facilities" options={FACILITIES} value={form.attribute_facilities} onChange={v => set('attribute_facilities', v)} />
          <CheckGroup label="Attribute: Hotel Service" options={HOTEL_SERVICES} value={form.attribute_hotel_service} onChange={v => set('attribute_hotel_service', v)} />
          <CheckGroup label="Attribute: Property type" options={PROPERTY_TYPES} value={form.attribute_property_type} onChange={v => set('attribute_property_type', v)} />

          {/* Feature Image */}
          <div style={sS}>
            <div style={sT}>Feature Image</div>
            <div onClick={() => document.getElementById('_featImg').click()} style={{ border: '2px dashed #c8e6c9', borderRadius: 8, padding: '32px 16px', textAlign: 'center', cursor: 'pointer', background: '#f9fffe' }}>
              {form.feature_img
                ? <img src={form.feature_img} alt="feature" style={{ maxWidth: '100%', maxHeight: 110, objectFit: 'cover', borderRadius: 4 }} />
                : <><svg width="28" height="28" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 8px', color: '#ccc' }}><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg><p style={{ margin: 0, color: '#aaa', fontSize: 13 }}>Choose an image file or drag it here</p></>
              }
            </div>
            <input id="_featImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadFeatImg} />
            {form.feature_img && <button type="button" onClick={() => set('feature_img', '')} style={{ marginTop: 6, fontSize: 12, color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>Remove image</button>}
          </div>

          {/* Image Gallery */}
          <div style={sS}>
            <div style={sT}>Image Gallery</div>
            <MultiImageUpload value={form.galleries} onChange={v => set('galleries', v)} folder="uploads/hotels" label="" />
          </div>
        </div>
      </div>
    </div>
  );
}
