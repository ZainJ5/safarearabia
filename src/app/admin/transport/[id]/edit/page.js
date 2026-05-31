'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import RichEditor from '@/components/admin/RichEditor';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

const ATTR_FEATURES = ['FM Radio', 'Free Cancellation', 'Pay at Pickup', 'Shuttle to Car', 'Steering Wheel'];
const ATTR_TYPES = ['Convertibles', 'Couple'];

const sS  = { background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '20px 24px', marginBottom: 20 };
const sT  = { fontSize: 15, fontWeight: 600, color: '#222', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' };
const iS  = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', color: '#333', outline: 'none' };
const lS  = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 5 };
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

const defCar   = { vehicle_type: '', person: '', price: '', sale_price: '', enable_extra_service: false };
const defBus   = { adult_price: '', adult_sale_price: '', child_price: '', enable_extra_service: false };
const defTrain = { adult_price: '', adult_sale_price: '', child_price: '', enable_extra_service: false };
const defBoat  = { adult_price: '', adult_sale_price: '', child_price: '', enable_extra_service: false };

/* ── Stable module-level components ── */

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

function ListSection({ items, placeholder, newVal, setNewVal, onAdd, onRemove, onEdit }) {
  return (
    <div>
      {(items || []).map((item, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            style={{ ...iS, flex: 1 }}
            value={item.title || ''}
            onChange={e => onEdit(idx, e.target.value)}
          />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            style={{ padding: '0 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
          >×</button>
        </div>
      ))}
      <input
        style={{ ...iS, marginBottom: 10 }}
        placeholder={placeholder}
        value={newVal}
        onChange={e => setNewVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAdd(newVal); } }}
      />
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => onAdd(newVal)}
          style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 28px', cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <i className="bi bi-bookmark" /> Add New
        </button>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function AdminTransportEditPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [pTab, setPTab]   = useState('car');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [newFaq, setNewFaq] = useState('');
  const [newInc, setNewInc] = useState('');
  const [newExc, setNewExc] = useState('');

  const [form, setForm] = useState({
    title: '', slug: '', content: '', youtube_url: '',
    faqs: [], includes: [], excludes: [],
    min_advance_reservation: '', min_day_stay: '',
    pricing_car: defCar, pricing_bus: defBus, pricing_train: defTrain, pricing_boat: defBoat,
    location: { address: '', country: '', state: '', city: '', zip_code: '', coordinates: { lat: '', lng: '' } },
    seo: { enable_seo: false, meta_title: '', meta_desc: '' },
    category: { _id: '', name: '', slug: '' },
    agent_setting: '', destination_name: '', destination_km: '',
    attribute_features: [], attribute_type: [],
    feature_img: '', galleries: [],
  });

  useEffect(() => {
    fetch('/api/admin/transport-categories')
      .then(r => r.json())
      .then(d => { if (d.success) setCategories(d.data || []); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/admin/transports/${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.success || !d.data) return;
        const t = d.data;
        setForm({
          title:   t.title   || '',
          slug:    t.slug    || '',
          content: t.content || '',
          youtube_url: t.youtube_url || '',
          faqs:    Array.isArray(t.faqs)     ? t.faqs     : [],
          includes: Array.isArray(t.includes) ? t.includes : [],
          excludes: Array.isArray(t.excludes) ? t.excludes : [],
          min_advance_reservation: t.min_advance_reservation ?? '',
          min_day_stay:            t.min_day_stay            ?? '',
          pricing_car:   t.pricing_car   ? { ...defCar,   ...t.pricing_car   }
                                         : { ...defCar,   vehicle_type: t.car_type || '', person: t.car_person || '', price: t.car_price || '' },
          pricing_bus:   t.pricing_bus   ? { ...defBus,   ...t.pricing_bus   }
                                         : { ...defBus,   adult_price: t.bus_price   || '' },
          pricing_train: t.pricing_train ? { ...defTrain, ...t.pricing_train }
                                         : { ...defTrain, adult_price: t.train_price || '' },
          pricing_boat:  t.pricing_boat  ? { ...defBoat,  ...t.pricing_boat  }
                                         : { ...defBoat,  adult_price: t.boat_price  || '' },
          location: {
            address:  t.location?.address  || '',
            country:  t.location?.country  || '',
            state:    t.location?.state    || '',
            city:     t.location?.city     || '',
            zip_code: t.location?.zip_code || '',
            coordinates: { lat: t.location?.coordinates?.lat || '', lng: t.location?.coordinates?.lng || '' },
          },
          seo: { enable_seo: t.seo?.enable_seo || false, meta_title: t.seo?.meta_title || '', meta_desc: t.seo?.meta_desc || '' },
          category:         t.category         || { _id: '', name: '', slug: '' },
          agent_setting:    t.agent_setting    || '',
          destination_name: t.destination_name || '',
          destination_km:   t.distance_km      || t.destination_km || '',
          attribute_features: Array.isArray(t.attribute_features) ? t.attribute_features : [],
          attribute_type:     Array.isArray(t.attribute_type)     ? t.attribute_type     : [],
          feature_img: t.feature_img || '',
          galleries:   Array.isArray(t.galleries) ? t.galleries : [],
        });
      })
      .catch(() => toast.error('Failed to load transport'))
      .finally(() => setLoading(false));
  }, [id]);

  const set  = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setN = (par, k, v) => setForm(p => ({ ...p, [par]: { ...p[par], [k]: v } }));
  const setD = (p1, p2, k, v) => setForm(p => ({ ...p, [p1]: { ...p[p1], [p2]: { ...p[p1][p2], [k]: v } } }));
  const setP = (tab, k, v)    => setForm(p => ({ ...p, [`pricing_${tab}`]: { ...p[`pricing_${tab}`], [k]: v } }));

  const addItem    = useCallback((field, title, clear) => {
    if (!title.trim()) return;
    setForm(p => ({ ...p, [field]: [...(p[field] || []), { title: title.trim() }] }));
    clear('');
  }, []);

  const removeItem = useCallback((field, idx) =>
    setForm(p => ({ ...p, [field]: (p[field] || []).filter((_, i) => i !== idx) })), []);

  const editItem   = useCallback((field, idx, val) =>
    setForm(p => {
      const arr = [...(p[field] || [])];
      arr[idx] = { ...arr[idx], title: val };
      return { ...p, [field]: arr };
    }), []);

  const uploadFeatImg = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'uploads/transports');
    const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const res = await r.json();
    if (res.success) { set('feature_img', res.url); toast.success('Image uploaded'); }
    else toast.error('Upload failed');
  };

  const handleSubmit = async (status) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const n = (v) => { const x = Number(v); return isNaN(x) ? null : x || null; };
      const body = {
        ...form, status,
        // clean category: remove empty _id so Mongoose never gets ""
        category: form.category?._id
          ? { _id: form.category._id, name: form.category.name, slug: form.category.slug }
          : { name: form.category?.name || '', slug: form.category?.slug || '' },
        // convert string prices to numbers explicitly
        pricing_car:   { ...form.pricing_car,   price: n(form.pricing_car.price),   sale_price: n(form.pricing_car.sale_price),   person: n(form.pricing_car.person) },
        pricing_bus:   { ...form.pricing_bus,   adult_price: n(form.pricing_bus.adult_price),   adult_sale_price: n(form.pricing_bus.adult_sale_price),   child_price: n(form.pricing_bus.child_price) },
        pricing_train: { ...form.pricing_train, adult_price: n(form.pricing_train.adult_price), adult_sale_price: n(form.pricing_train.adult_sale_price), child_price: n(form.pricing_train.child_price) },
        pricing_boat:  { ...form.pricing_boat,  adult_price: n(form.pricing_boat.adult_price),  adult_sale_price: n(form.pricing_boat.adult_sale_price),  child_price: n(form.pricing_boat.child_price) },
        // legacy flat fields
        car_price:   n(form.pricing_car.price)         || 0,
        bus_price:   n(form.pricing_bus.adult_price)   || 0,
        train_price: n(form.pricing_train.adult_price) || 0,
        boat_price:  n(form.pricing_boat.adult_price)  || 0,
        car_type:    form.pricing_car.vehicle_type,
        car_person:  n(form.pricing_car.person) || 0,
        distance_km: Number(form.destination_km) || 0,
      };
      const res = await fetch(`/api/admin/transports/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { toast.success('Transport updated!'); router.push('/admin/transport'); }
      else toast.error(data.error || 'Failed to save');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const tabBtn = (tab) => ({
    padding: '8px 20px', border: '1px solid #ddd', cursor: 'pointer', fontSize: 14, borderRadius: 4,
    background: pTab === tab ? '#6f42c1' : '#fff', color: pTab === tab ? '#fff' : '#333',
    fontWeight: pTab === tab ? 600 : 400,
  });

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading transport...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: 12, color: '#888' }}>Home / <Link href="/admin/transport" style={{ color: '#888' }}>Edit Transport</Link></span>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#222' }}>Edit Transport</h4>
        </div>
        <Link href="/admin/transport"
          style={{ background: '#6f42c1', color: '#fff', padding: '9px 20px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          &#8594; Go Back
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── LEFT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Transport Content */}
          <div style={sS}>
            <div style={sT}>Transport Content</div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Title <span style={{ color: '#dc3545' }}>*</span></label>
              <input style={iS} placeholder="Name of the Transport" value={form.title}
                onChange={e => set('title', e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Content <span style={{ color: '#dc3545' }}>*</span></label>
              <RichEditor value={form.content} onChange={v => set('content', v)} minHeight={200} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Youtube Video</label>
              <input style={iS} placeholder="Youtube Video Link" value={form.youtube_url}
                onChange={e => set('youtube_url', e.target.value)} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lS}>FAQs</label>
              <ListSection
                items={form.faqs}
                placeholder="Enter FAQ Title"
                newVal={newFaq}
                setNewVal={setNewFaq}
                onAdd={v => addItem('faqs', v, setNewFaq)}
                onRemove={idx => removeItem('faqs', idx)}
                onEdit={(idx, val) => editItem('faqs', idx, val)}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lS}>Includes</label>
              <ListSection
                items={form.includes}
                placeholder="Enter Include Title"
                newVal={newInc}
                setNewVal={setNewInc}
                onAdd={v => addItem('includes', v, setNewInc)}
                onRemove={idx => removeItem('includes', idx)}
                onEdit={(idx, val) => editItem('includes', idx, val)}
              />
            </div>

            <div>
              <label style={lS}>Excludes</label>
              <ListSection
                items={form.excludes}
                placeholder="Enter Exclude Title"
                newVal={newExc}
                setNewVal={setNewExc}
                onAdd={v => addItem('excludes', v, setNewExc)}
                onRemove={idx => removeItem('excludes', idx)}
                onEdit={(idx, val) => editItem('excludes', idx, val)}
              />
            </div>
          </div>

          {/* Extra Info */}
          <div style={sS}>
            <div style={sT}>Extra Info</div>
            <div style={row2}>
              <div>
                <label style={lS}>Minimum advance reservations</label>
                <input style={iS} placeholder="Ex: 3" value={form.min_advance_reservation}
                  onChange={e => set('min_advance_reservation', e.target.value)} />
                <p style={{ fontSize: 12, color: '#888', marginTop: 4, marginBottom: 0 }}>Leave blank if you dont need to use the min day option</p>
              </div>
              <div>
                <label style={lS}>Minimum day stay requirements</label>
                <input style={iS} placeholder="Ex: 2" value={form.min_day_stay}
                  onChange={e => set('min_day_stay', e.target.value)} />
                <p style={{ fontSize: 12, color: '#888', marginTop: 4, marginBottom: 0 }}>Leave blank if you dont need to set minimum day stay option</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={sS}>
            <div style={sT}>Pricing</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {['car', 'bus', 'train', 'boat'].map(tab => (
                <button key={tab} type="button" onClick={() => setPTab(tab)} style={tabBtn(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {pTab === 'car' && (
              <div>
                <div style={{ ...row2, marginBottom: 14 }}>
                  <div><label style={lS}>Type</label><input style={iS} placeholder="Enter Car Type" value={form.pricing_car.vehicle_type} onChange={e => setP('car', 'vehicle_type', e.target.value)} /></div>
                  <div><label style={lS}>Person</label><input style={iS} placeholder="Enter Person" value={form.pricing_car.person} onChange={e => setP('car', 'person', e.target.value)} /></div>
                </div>
                <div style={{ ...row2, marginBottom: 14 }}>
                  <div><label style={lS}>Price <span style={{ color: '#dc3545' }}>*</span></label><input style={iS} type="number" placeholder="Enter Price" value={form.pricing_car.price} onChange={e => setP('car', 'price', e.target.value)} /></div>
                  <div><label style={lS}>Sale Price</label><input style={iS} type="number" placeholder="Enter Sale Price" value={form.pricing_car.sale_price} onChange={e => setP('car', 'sale_price', e.target.value)} /></div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#444' }}>
                  <input type="checkbox" checked={form.pricing_car.enable_extra_service} onChange={e => setP('car', 'enable_extra_service', e.target.checked)} style={{ width: 14, height: 14 }} />
                  Enable Extra Service
                </label>
              </div>
            )}
            {pTab === 'bus' && (
              <div>
                <div style={{ ...row2, marginBottom: 14 }}>
                  <div><label style={lS}>Adult Price <span style={{ color: '#dc3545' }}>*</span></label><input style={iS} type="number" placeholder="Enter Adult Price" value={form.pricing_bus.adult_price} onChange={e => setP('bus', 'adult_price', e.target.value)} /></div>
                  <div><label style={lS}>Adult Sale Price</label><input style={iS} type="number" placeholder="Enter Adult Sale Price" value={form.pricing_bus.adult_sale_price} onChange={e => setP('bus', 'adult_sale_price', e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 14 }}><label style={lS}>Child Price</label><input style={iS} type="number" placeholder="Enter Child Price" value={form.pricing_bus.child_price} onChange={e => setP('bus', 'child_price', e.target.value)} /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#444' }}>
                  <input type="checkbox" checked={form.pricing_bus.enable_extra_service} onChange={e => setP('bus', 'enable_extra_service', e.target.checked)} style={{ width: 14, height: 14 }} />
                  Enable Extra Service
                </label>
              </div>
            )}
            {pTab === 'train' && (
              <div>
                <div style={{ ...row2, marginBottom: 14 }}>
                  <div><label style={lS}>Adult Price <span style={{ color: '#dc3545' }}>*</span></label><input style={iS} type="number" placeholder="Enter Adult Price" value={form.pricing_train.adult_price} onChange={e => setP('train', 'adult_price', e.target.value)} /></div>
                  <div><label style={lS}>Adult Sale Price</label><input style={iS} type="number" placeholder="Enter Adult Sale Price" value={form.pricing_train.adult_sale_price} onChange={e => setP('train', 'adult_sale_price', e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 14 }}><label style={lS}>Child Price</label><input style={iS} type="number" placeholder="Enter Child Price" value={form.pricing_train.child_price} onChange={e => setP('train', 'child_price', e.target.value)} /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#444' }}>
                  <input type="checkbox" checked={form.pricing_train.enable_extra_service} onChange={e => setP('train', 'enable_extra_service', e.target.checked)} style={{ width: 14, height: 14 }} />
                  Enable Extra Service
                </label>
              </div>
            )}
            {pTab === 'boat' && (
              <div>
                <div style={{ ...row2, marginBottom: 14 }}>
                  <div><label style={lS}>Adult Price <span style={{ color: '#dc3545' }}>*</span></label><input style={iS} type="number" placeholder="Enter Adult Price" value={form.pricing_boat.adult_price} onChange={e => setP('boat', 'adult_price', e.target.value)} /></div>
                  <div><label style={lS}>Adult Sale Price</label><input style={iS} type="number" placeholder="Enter Adult Sale Price" value={form.pricing_boat.adult_sale_price} onChange={e => setP('boat', 'adult_sale_price', e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 14 }}><label style={lS}>Child Price</label><input style={iS} type="number" placeholder="Enter Child Price" value={form.pricing_boat.child_price} onChange={e => setP('boat', 'child_price', e.target.value)} /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#444' }}>
                  <input type="checkbox" checked={form.pricing_boat.enable_extra_service} onChange={e => setP('boat', 'enable_extra_service', e.target.checked)} style={{ width: 14, height: 14 }} />
                  Enable Extra Service
                </label>
              </div>
            )}
          </div>

          {/* Location */}
          <div style={sS}>
            <div style={sT}>Location</div>
            <div style={{ marginBottom: 14 }}><label style={lS}>Address</label><input style={iS} placeholder="Address" value={form.location.address} onChange={e => setN('location', 'address', e.target.value)} /></div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>Country <span style={{ color: '#dc3545' }}>*</span></label><input style={iS} placeholder="Select Option" value={form.location.country} onChange={e => setN('location', 'country', e.target.value)} /></div>
              <div><label style={lS}>State <span style={{ color: '#dc3545' }}>*</span></label><input style={iS} placeholder="Select Option" value={form.location.state} onChange={e => setN('location', 'state', e.target.value)} /></div>
            </div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div><label style={lS}>City <span style={{ color: '#dc3545' }}>*</span></label><input style={iS} placeholder="Select Option" value={form.location.city} onChange={e => setN('location', 'city', e.target.value)} /></div>
              <div><label style={lS}>Zip/Postal</label><input style={iS} placeholder="Zip/Postal" value={form.location.zip_code} onChange={e => setN('location', 'zip_code', e.target.value)} /></div>
            </div>
            <div style={{ ...row2, marginBottom: 14 }}>
              <div>
                <label style={lS}>Latitude <span style={{ color: '#dc3545' }}>*</span></label>
                <input style={iS} placeholder="Latitude" value={form.location.coordinates?.lat || ''} onChange={e => setD('location', 'coordinates', 'lat', e.target.value)} />
                <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#2196f3', marginTop: 4, display: 'block' }}>Go Here to get Latitude from address</a>
              </div>
              <div>
                <label style={lS}>Longitude <span style={{ color: '#dc3545' }}>*</span></label>
                <input style={iS} placeholder="Longitude" value={form.location.coordinates?.lng || ''} onChange={e => setD('location', 'coordinates', 'lng', e.target.value)} />
                <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#2196f3', marginTop: 4, display: 'block' }}>Go Here to get Longitude from address</a>
              </div>
            </div>
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

          <div style={{ ...sS, display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => handleSubmit(1)} disabled={saving}
              style={{ flex: 1, padding: '10px 0', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              {saving ? 'Saving...' : 'Published'}
            </button>
            <button type="button" onClick={() => handleSubmit(0)} disabled={saving}
              style={{ flex: 1, padding: '10px 0', background: '#ffc107', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Save As Draft
            </button>
          </div>

          <div style={sS}>
            <div style={sT}>Category</div>
            <select style={{ ...iS, appearance: 'auto' }}
              value={form.category?._id || ''}
              onChange={e => {
                const cat = categories.find(c => String(c._id) === e.target.value);
                set('category', cat ? { _id: cat._id, name: cat.name, slug: cat.slug } : { _id: '', name: '', slug: '' });
              }}>
              <option value="">Select Option</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div style={sS}>
            <div style={sT}>Agent Setting</div>
            <select style={{ ...iS, appearance: 'auto' }} value={form.agent_setting} onChange={e => set('agent_setting', e.target.value)}>
              <option value="">Select Option</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="all">All Agents</option>
            </select>
          </div>

          <div style={sS}>
            <div style={sT}>Destination</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input style={{ ...iS, flex: 1 }} placeholder="Destination" value={form.destination_name} onChange={e => set('destination_name', e.target.value)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input style={{ ...iS, width: 64 }} type="number" placeholder="0" value={form.destination_km} onChange={e => set('destination_km', e.target.value)} />
                <span style={{ fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}>km</span>
              </div>
            </div>
          </div>

          <CheckGroup label="Attribute: Features" options={ATTR_FEATURES} value={form.attribute_features} onChange={v => set('attribute_features', v)} />
          <CheckGroup label="Attribute: Type" options={ATTR_TYPES} value={form.attribute_type} onChange={v => set('attribute_type', v)} />

          <div style={sS}>
            <div style={sT}>Feature Image</div>
            <div onClick={() => document.getElementById('_tFeatImgE').click()}
              style={{ border: '2px dashed #c8e6c9', borderRadius: 8, padding: '32px 16px', textAlign: 'center', cursor: 'pointer', background: '#f9fffe' }}>
              {form.feature_img
                ? <img src={form.feature_img} alt="feature" style={{ maxWidth: '100%', maxHeight: 110, objectFit: 'cover', borderRadius: 4 }} />
                : <><i className="bi bi-image" style={{ fontSize: 28, color: '#aaa', display: 'block', marginBottom: 8 }} />
                  <p style={{ margin: 0, color: '#aaa', fontSize: 13 }}>Choose an image file or drag it here</p></>
              }
            </div>
            <input id="_tFeatImgE" type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadFeatImg} />
            {form.feature_img && (
              <button type="button" onClick={() => set('feature_img', '')}
                style={{ marginTop: 6, fontSize: 12, color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                Remove image
              </button>
            )}
          </div>

          <div style={sS}>
            <div style={sT}>Image Gallery</div>
            <MultiImageUpload value={form.galleries} onChange={v => set('galleries', v)} folder="uploads/transports" label="" />
          </div>
        </div>
      </div>
    </div>
  );
}
