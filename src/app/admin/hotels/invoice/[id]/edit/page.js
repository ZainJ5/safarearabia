'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAdminUser } from '@/components/admin/AdminUserContext';
import AgentSearchSelect from '@/components/admin/AgentSearchSelect';

const NATIONALITIES = [
  'Pakistani', 'Saudi Arabian', 'Indian', 'Bangladeshi', 'Egyptian',
  'Indonesian', 'Malaysian', 'Turkish', 'Jordanian', 'Emirati',
  'British', 'American', 'Filipino', 'Moroccan', 'Nigerian', 'Other',
];
const CITIES = ['Makkah', 'Madinah', 'Jeddah', 'Riyadh', 'Taif', 'Dhahran', 'Dammam', 'Khobar', 'Tabuk', 'Abha'];

const lbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' };
const req = { color: '#EF4444', marginLeft: 2 };
function Field({ label, required: r, children }) {
  return (
    <div>
      <label style={lbl}>{label}{r && <span style={req}>*</span>}</label>
      {children}
    </div>
  );
}

const recalc = (f) => {
  const nights = Number(f.no_of_nights) || 0;
  const rooms  = Number(f.no_of_rooms)  || 0;
  const rate   = Number(f.day_rate)     || 0;
  const amt    = nights * rooms * rate;
  const prev   = Number(f.room_amount)  || 0;
  const total  = Number(f.total_amount) === prev ? amt : Number(f.total_amount);
  const sub    = Number(f.sub_amount)   === prev ? amt : Number(f.sub_amount);
  return { ...f, room_amount: amt, total_amount: total, sub_amount: sub };
};

/* ── Multi-hotel helpers (an invoice may bundle several hotels/rooms) ── */
const HOTEL_KEYS = ['hotel_name', 'city', 'room_type', 'check_in', 'check_out',
  'no_of_nights', 'no_of_rooms', 'no_of_adults', 'no_of_children', 'meals',
  'day_rate', 'ml_srate', 'room_amount', 'conformation_no'];

const BLANK_HOTEL = {
  hotel_name: '', city: '', room_type: '', check_in: '', check_out: '',
  no_of_nights: 0, no_of_rooms: 1, no_of_adults: 1, no_of_children: 0,
  meals: '', day_rate: '', ml_srate: '', room_amount: 0, conformation_no: '',
};

const pickHotel = (o) => Object.fromEntries(HOTEL_KEYS.map(k => [k, o[k] ?? BLANK_HOTEL[k]]));

const recalcHotel = (h) => {
  let nights = Number(h.no_of_nights) || 0;
  if (h.check_in && h.check_out) {
    nights = Math.max(0, Math.round((new Date(h.check_out) - new Date(h.check_in)) / 86400000));
  }
  const amt = nights * (Number(h.no_of_rooms) || 0) * (Number(h.day_rate) || 0);
  return { ...h, no_of_nights: nights, room_amount: amt };
};

export default function EditHotelInvoicePage({ params }) {
  const { id } = use(params);
  const router  = useRouter();
  const { role, fname, lname } = useAdminUser();
  const isAgent = role === 2;

  const [form, setForm]     = useState(null);
  const [extraHotels, setExtraHotels] = useState([]);   // hotels #2..N in the same invoice
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // Load existing invoice
  useEffect(() => {
    fetch(`/api/admin/hotel-invoices/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setForm(d.data);
          // items[] holds every hotel; the first mirrors the flat fields, the rest
          // are additional hotels editable below.
          if (Array.isArray(d.data.items) && d.data.items.length > 1) {
            setExtraHotels(d.data.items.slice(1).map(recalcHotel));
          }
        } else {
          toast.error(d.error || 'Failed to load invoice');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Load agents (for admin dropdown)
  useEffect(() => {
    if (!isAgent) {
      fetch('/api/admin/users?role=2&limit=10000')
        .then(r => r.json())
        .then(d => { if (d.success) setAgents(d.data || []); })
        .catch(() => {});
    }
  }, [isAgent]);

  // Auto-calc nights when dates change
  useEffect(() => {
    if (!form) return;
    if (form.check_in && form.check_out) {
      const diff = Math.max(0, Math.round(
        (new Date(form.check_out) - new Date(form.check_in)) / 86400000
      ));
      setForm(prev => recalc({ ...prev, no_of_nights: diff }));
    }
  }, [form?.check_in, form?.check_out]);

  const set = (key, val) => setForm(prev => recalc({ ...prev, [key]: val }));

  /* ── Additional-hotel handlers ── */
  const setExtraHotel = (idx, key, val) =>
    setExtraHotels(prev => prev.map((h, i) => (i === idx ? recalcHotel({ ...h, [key]: val }) : h)));
  const addHotel    = () => setExtraHotels(prev => [...prev, { ...BLANK_HOTEL }]);
  const removeHotel = (idx) => setExtraHotels(prev => prev.filter((_, i) => i !== idx));

  const extrasTotal = extraHotels.reduce((s, h) => s + Number(h.room_amount || 0), 0);
  const grandTotal  = Number(form?.room_amount || 0) + extrasTotal;

  const handleSubmit = async () => {
    if (!form.guest_name?.trim()) { toast.error('Guest Name is required'); return; }
    if (!form.hotel_name?.trim()) { toast.error('Hotel Name is required'); return; }
    if (extraHotels.some(h => !String(h.hotel_name || '').trim())) {
      toast.error('Each added hotel needs a Hotel Name'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (extraHotels.length > 0) {
        const allHotels = [pickHotel(form), ...extraHotels.map(pickHotel)];
        payload.items        = allHotels;
        payload.total_amount = grandTotal;
        payload.sub_amount   = grandTotal;
      } else {
        // Down to a single hotel — drop any stale items[] so the flat fields win.
        payload.items = [];
      }
      const res = await fetch(`/api/admin/hotel-invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Invoice updated!');
        router.push(`/admin/hotels/invoice/${id}`);
      } else {
        toast.error(data.error || 'Failed to update invoice');
      }
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const inp = { width: '100%', padding: '10px 13px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#111827', outline: 'none', boxSizing: 'border-box' };
  const autoInp = { ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 };
  const row1 = { marginBottom: 20 };
  const sec  = { fontSize: 14, fontWeight: 700, color: '#0D1B2E', paddingBottom: 12, marginBottom: 20, borderBottom: '1px solid #F3F4F6' };

  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      Loading invoice...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!form) return <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>Invoice not found or access denied.</div>;

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Edit Invoice</h4>
          <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>Reserve No: <strong style={{ color: '#B1723C' }}>#{form.reserve_no}</strong></p>
        </div>
        <Link href={`/admin/hotels/invoice/${id}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Cancel
        </Link>
      </div>

      {/* Active Hotel tab */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: 28, background: '#fff', borderRadius: '10px 10px 0 0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, padding: '14px 0', background: '#fff', textAlign: 'center', borderBottom: '3px solid #B1723C', cursor: 'default', fontSize: 14, fontWeight: 700, color: '#B1723C', marginBottom: -2 }}>
          Hotel
        </div>
      </div>

      <div className="admin-card">
        <div style={sec}>Hotel Invoice Information</div>

        {/* Agent Name / No */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
          <Field label="Agent Name" required>
            {isAgent ? (
              <input value={form.agent_name || ''} readOnly style={{ ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 }} />
            ) : (
              <AgentSearchSelect
                agents={agents}
                value={form.agent_name || ''}
                onChange={(name, ag) => setForm(prev => recalc({ ...prev, agent_name: name, agent_no: ag?.custom_id || prev.agent_no || '', agent_phone: ag?.phone || prev.agent_phone || '' }))}
                style={inp}
              />
            )}
          </Field>
          <Field label="Agent No">
            {isAgent ? (
              <input value={form.agent_no || ''} readOnly style={{ ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 }} />
            ) : (
              <input value={form.agent_no || ''} onChange={e => set('agent_no', e.target.value)} placeholder="Agent reference number" style={inp} />
            )}
          </Field>
          <Field label="Nationality" required>
            <select value={form.nationality || ''} onChange={e => set('nationality', e.target.value)} style={inp}>
              <option value="">Select Option</option>
              {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
        </div>

        <div style={row2}>
          <Field label="Guest Name" required><input value={form.guest_name || ''} onChange={e => set('guest_name', e.target.value)} style={inp} /></Field>
          <Field label="Option Date"><input type="date" value={form.option_date || ''} onChange={e => set('option_date', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}>
          <Field label="Client Ref No"><input value={form.client_ref_no || ''} onChange={e => set('client_ref_no', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Hotel Name" required><input value={form.hotel_name || ''} onChange={e => set('hotel_name', e.target.value)} style={inp} /></Field>
          <Field label="City" required>
            <select value={form.city || ''} onChange={e => set('city', e.target.value)} style={inp}>
              <option value="">Select Option</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div style={row2}>
          <Field label="Room Type" required><input value={form.room_type || ''} onChange={e => set('room_type', e.target.value)} style={inp} /></Field>
          <Field label="Check In" required><input type="date" value={form.check_in || ''} onChange={e => set('check_in', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Check Out" required><input type="date" value={form.check_out || ''} onChange={e => set('check_out', e.target.value)} style={inp} /></Field>
          <Field label="No. of Nights" required>
            <input type="number" min="0" value={form.no_of_nights || 0} onChange={e => set('no_of_nights', e.target.value)} style={inp} />
          </Field>
        </div>
        <div style={row2}>
          <Field label="No. of Rooms" required><input type="number" min="1" value={form.no_of_rooms || 1} onChange={e => set('no_of_rooms', e.target.value)} style={inp} /></Field>
          <Field label="No. of Adults" required><input type="number" min="1" value={form.no_of_adults || 1} onChange={e => set('no_of_adults', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Packs"><input value={form.packs || ''} onChange={e => set('packs', e.target.value)} style={inp} /></Field>
          <Field label="Meals"><input value={form.meals || ''} onChange={e => set('meals', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Day Rate" required><input type="number" step="0.01" min="0" value={form.day_rate || 0} onChange={e => set('day_rate', e.target.value)} style={inp} /></Field>
          <Field label="ML Srate"><input type="number" step="0.01" min="0" value={form.ml_srate || 0} onChange={e => set('ml_srate', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Room Amount"><input value={Number(form.room_amount || 0).toFixed(2)} readOnly style={autoInp} /></Field>
          <Field label="Conformation No"><input value={form.conformation_no || ''} onChange={e => set('conformation_no', e.target.value)} style={inp} /></Field>
        </div>

        {/* ── Additional hotels in the same invoice ── */}
        {extraHotels.map((h, idx) => (
          <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: '18px 20px 4px', marginBottom: 20, background: '#FBFAF8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#B1723C' }}>Hotel #{idx + 2}</span>
              <button type="button" onClick={() => removeHotel(idx)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
                Remove
              </button>
            </div>
            <div style={row2}>
              <Field label="Hotel Name" required><input value={h.hotel_name} onChange={e => setExtraHotel(idx, 'hotel_name', e.target.value)} style={inp} /></Field>
              <Field label="City">
                <select value={h.city} onChange={e => setExtraHotel(idx, 'city', e.target.value)} style={inp}>
                  <option value="">Select Option</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div style={row2}>
              <Field label="Room Type"><input value={h.room_type} onChange={e => setExtraHotel(idx, 'room_type', e.target.value)} style={inp} /></Field>
              <Field label="Check In"><input type="date" value={h.check_in} onChange={e => setExtraHotel(idx, 'check_in', e.target.value)} style={inp} /></Field>
            </div>
            <div style={row2}>
              <Field label="Check Out"><input type="date" value={h.check_out} onChange={e => setExtraHotel(idx, 'check_out', e.target.value)} style={inp} /></Field>
              <Field label="No. of Nights"><input type="number" value={h.no_of_nights} readOnly style={autoInp} /></Field>
            </div>
            <div style={row2}>
              <Field label="No. of Rooms"><input type="number" min="1" value={h.no_of_rooms} onChange={e => setExtraHotel(idx, 'no_of_rooms', e.target.value)} style={inp} /></Field>
              <Field label="No. of Adults"><input type="number" min="1" value={h.no_of_adults} onChange={e => setExtraHotel(idx, 'no_of_adults', e.target.value)} style={inp} /></Field>
            </div>
            <div style={row2}>
              <Field label="Meals"><input value={h.meals} onChange={e => setExtraHotel(idx, 'meals', e.target.value)} style={inp} /></Field>
              <Field label="No. of Children"><input type="number" min="0" value={h.no_of_children} onChange={e => setExtraHotel(idx, 'no_of_children', e.target.value)} style={inp} /></Field>
            </div>
            <div style={row2}>
              <Field label="Day Rate"><input type="number" step="0.01" min="0" value={h.day_rate} onChange={e => setExtraHotel(idx, 'day_rate', e.target.value)} style={inp} /></Field>
              <Field label="ML Srate"><input type="number" step="0.01" min="0" value={h.ml_srate} onChange={e => setExtraHotel(idx, 'ml_srate', e.target.value)} style={inp} /></Field>
            </div>
            <div style={row2}>
              <Field label="Room Amount"><input value={Number(h.room_amount).toFixed(2)} readOnly style={autoInp} /></Field>
              <Field label="Conformation No"><input value={h.conformation_no} onChange={e => setExtraHotel(idx, 'conformation_no', e.target.value)} style={inp} /></Field>
            </div>
          </div>
        ))}

        {/* Add hotel + running grand total */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <button type="button" onClick={addHotel}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#FEF3EA', color: '#B1723C', border: '1.5px dashed #E3B98C', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            Add Another Hotel
          </button>
          {extraHotels.length > 0 && (
            <div style={{ fontSize: 13, color: '#374151' }}>
              Grand Total ({extraHotels.length + 1} hotels):{' '}
              <strong style={{ color: '#059669', fontSize: 15 }}>{grandTotal.toFixed(2)}</strong>
            </div>
          )}
        </div>

        <div style={row2}>
          <Field label="Total Amount" required>
            {extraHotels.length > 0
              ? <input value={grandTotal.toFixed(2)} readOnly style={autoInp} />
              : <input type="number" step="0.01" min="0" value={form.total_amount || 0}
                  onChange={e => setForm(p => ({ ...p, total_amount: e.target.value }))} style={inp} />}
          </Field>
          <Field label="Sub Amount" required>
            {extraHotels.length > 0
              ? <input value={grandTotal.toFixed(2)} readOnly style={autoInp} />
              : <input type="number" step="0.01" min="0" value={form.sub_amount || 0}
                  onChange={e => setForm(p => ({ ...p, sub_amount: e.target.value }))} style={inp} />}
          </Field>
        </div>

        {/* Additional Guest Details */}
        <div style={{ ...sec, marginTop: 12 }}>Additional Guest Details</div>
        <div style={row2}>
          <Field label="Contact Name"><input value={form.contact_name || ''} onChange={e => set('contact_name', e.target.value)} style={inp} /></Field>
          <Field label="Group No"><input value={form.group_no || ''} onChange={e => set('group_no', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Mobile No"><input type="tel" value={form.mobile_no || ''} onChange={e => set('mobile_no', e.target.value)} style={inp} /></Field>
          <Field label="Local Ref No"><input value={form.local_refno || ''} onChange={e => set('local_refno', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="VAT Number"><input value={form.vat_number || ''} onChange={e => set('vat_number', e.target.value)} style={inp} /></Field>
          <Field label="No. of Children"><input type="number" min="0" value={form.no_of_children || 0} onChange={e => set('no_of_children', e.target.value)} style={inp} /></Field>
        </div>

        {/* Bank & Policies */}
        <div style={{ ...sec, marginTop: 12 }}>Bank Details & Policies</div>
        <div style={row2}>
          <Field label="Account Name"><input value={form.account_name || ''} onChange={e => set('account_name', e.target.value)} style={inp} /></Field>
          <Field label="Bank"><input value={form.bank || ''} onChange={e => set('bank', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Bank Account No"><input value={form.bank_account_no || ''} onChange={e => set('bank_account_no', e.target.value)} style={inp} /></Field>
          <Field label="IBN"><input value={form.ibn || ''} onChange={e => set('ibn', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}><Field label="Bank Address"><input value={form.bank_address || ''} onChange={e => set('bank_address', e.target.value)} style={inp} /></Field></div>
        <div style={row1}><Field label="Cancellation Policy"><input value={form.cancellation_policy || ''} onChange={e => set('cancellation_policy', e.target.value)} style={inp} /></Field></div>
        <div style={row1}><Field label="No Show Policy"><input value={form.no_show_policy || ''} onChange={e => set('no_show_policy', e.target.value)} style={inp} /></Field></div>
        <div style={row1}><Field label="Important Contact"><input value={form.important_contact || ''} onChange={e => set('important_contact', e.target.value)} style={inp} /></Field></div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6', marginTop: 4 }}>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding: '11px 36px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/admin/hotels/invoice/${id}`}
            style={{ padding: '11px 28px', background: '#fff', color: '#6B7280', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
