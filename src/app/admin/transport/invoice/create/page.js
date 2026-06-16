'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAdminUser } from '@/components/admin/AdminUserContext';
import AgentSearchSelect from '@/components/admin/AgentSearchSelect';

const NATIONALITIES = [
  'Pakistani', 'Saudi Arabian', 'Indian', 'Bangladeshi', 'Egyptian',
  'Indonesian', 'Malaysian', 'Turkish', 'Jordanian', 'Emirati',
  'British', 'American', 'Australian', 'Filipino', 'Moroccan', 'Nigerian', 'Other',
];

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

const BLANK_SEG = {
  date: '', time: '', flight_details: '', from_location: '', to_location: '',
  vehicle: '', mov_type: '', qty: 1, no_of_adults: 0, packs: '', rate: 0, total: 0,
};

const SEG_KEYS = ['date', 'time', 'flight_details', 'from_location', 'to_location', 'vehicle', 'mov_type', 'qty', 'no_of_adults', 'packs', 'rate', 'total'];

const INIT = {
  reservation_no: '', agent_user_id: '', agent_name: '', agent_no: '', agent_phone: '', nationality: '', guest_name: '',
  contact_name: '', contact_number: '', client_ref_no: '', group_no: '', local_refno: '',
  reservation_date: '', username: '', payment_type: '',
  date: '', time: '', flight_details: '', from_location: '', to_location: '',
  vehicle: '', mov_type: '', qty: 1, no_of_adults: 0, packs: '', rate: 0, total: 0,
  transport: 0, discount: 0, vat: 0, net_total_with_tax: 0, convert_rate_total_sar: 0,
  special_requirements: '', notes: '',
  account_name: 'Safar E Arabian Travel & Tours', bank: 'Faisal Bank',
  bank_account_no: '3054301000007374', bank_address: '', ibn: 'PK65FAYS3054301000007374',
  important_contact: '',
  cancellation_policy: 'No-Cancellation or Amendment will be accepted after re-confirmation',
  no_show_policy: 'In-case of No-Show full transport amount will be charged',
};

const recalcSeg = (s) => ({ ...s, total: (Number(s.qty) || 0) * (Number(s.rate) || 0) });

const calcAmt = (f, extraSegsTotal = 0) => {
  const segTotal      = (Number(f.qty) || 0) * (Number(f.rate) || 0);
  const grandSegTotal = segTotal + extraSegsTotal;
  const transport     = Number(f.transport) || 0;
  const discount      = Number(f.discount)  || 0;
  const vat           = Number(f.vat)       || 0;
  const netBase       = grandSegTotal + transport - discount;
  const net           = netBase * (1 + vat / 100);
  return { ...f, total: segTotal, net_total_with_tax: Math.round(net * 100) / 100 };
};

export default function CreateTransportInvoicePage() {
  const router = useRouter();
  const { role, fname, lname, customId } = useAdminUser();
  const isAgent = role === 2;
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(INIT);
  const [extraSegs, setExtraSegs] = useState([]);
  const [agents, setAgents]     = useState([]);

  useEffect(() => {
    if (isAgent) {
      const name = `${fname} ${lname}`.trim();
      setForm(prev => calcAmt({ ...prev, agent_name: name, agent_no: customId || '' }));
    } else {
      fetch('/api/admin/users?role=2&limit=10000')
        .then(r => r.json())
        .then(d => { if (d.success) setAgents(d.data || []); })
        .catch(() => {});
    }
  }, [isAgent, fname, lname]);

  // Recalculate net total whenever extra segments change
  useEffect(() => {
    const extTotal = extraSegs.reduce((s, h) => s + Number(h.total || 0), 0);
    setForm(prev => calcAmt(prev, extTotal));
  }, [extraSegs]);

  const set = (key, val) => {
    const extTotal = extraSegs.reduce((s, h) => s + Number(h.total || 0), 0);
    setForm(prev => calcAmt({ ...prev, [key]: val }, extTotal));
  };

  /* ── Segment handlers ── */
  const setExtraSeg = (idx, key, val) =>
    setExtraSegs(prev => prev.map((s, i) => i === idx ? recalcSeg({ ...s, [key]: val }) : s));
  const addSeg    = () => setExtraSegs(prev => [...prev, { ...BLANK_SEG }]);
  const removeSeg = (idx) => setExtraSegs(prev => prev.filter((_, i) => i !== idx));

  const extSegsTotal   = extraSegs.reduce((s, h) => s + Number(h.total || 0), 0);
  const grandSegsTotal = Number(form.total || 0) + extSegsTotal;

  const handleSubmit = async () => {
    if (!isAgent && !form.agent_user_id) { toast.error('Please select an Agent'); return; }
    if (!form.guest_name.trim()) { toast.error('Guest Name is required'); return; }
    if (!form.date) { toast.error('Date is required for the first transport segment'); return; }
    if (extraSegs.some(s => !s.date)) { toast.error('Date is required for each transport segment'); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (extraSegs.length > 0) {
        const firstSeg = Object.fromEntries(SEG_KEYS.map(k => [k, form[k]]));
        payload.items = [firstSeg, ...extraSegs.map(s => Object.fromEntries(SEG_KEYS.map(k => [k, s[k]])))];
      } else {
        payload.items = [];
      }
      const res = await fetch('/api/admin/transport-invoices', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Invoice created!');
        router.push(`/admin/transport/invoice/${data.data._id}`);
      } else {
        toast.error(data.error || 'Failed to create invoice');
      }
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const inp     = { width: '100%', padding: '10px 13px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#111827', outline: 'none', boxSizing: 'border-box' };
  const autoInp = { ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 };
  const row2    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 };
  const row3    = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 };
  const row1    = { marginBottom: 20 };
  const sec     = { fontSize: 14, fontWeight: 700, color: '#0D1B2E', paddingBottom: 12, marginBottom: 20, borderBottom: '1px solid #F3F4F6' };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Add Invoice</h4>
        <Link href="/admin/transport/invoice"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Go Back
        </Link>
      </div>

      {/* Single Transport tab */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: 28, background: '#fff', borderRadius: '10px 10px 0 0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, padding: '14px 0', background: '#fff', textAlign: 'center', borderBottom: '3px solid #5B21B6', cursor: 'default', fontSize: 14, fontWeight: 700, color: '#5B21B6', marginBottom: -2 }}>
          Transport
        </div>
      </div>

      <div className="admin-card">
        {/* ── SECTION 1: Invoice & Guest Info ── */}
        <div style={sec}>Transport Invoice Information</div>

        <div style={row3}>
          <Field label="Agent Name" required>
            {isAgent ? (
              <input value={form.agent_name} readOnly style={{ ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 }} />
            ) : (
              <AgentSearchSelect
                agents={agents}
                value={form.agent_name}
                onChange={(name, ag) => setForm(prev => calcAmt({ ...prev, agent_name: name, agent_user_id: ag?._id || '', agent_no: ag?.custom_id || '', agent_phone: ag?.phone || '' }, extSegsTotal))}
                style={inp}
              />
            )}
          </Field>
          <Field label="Agent No">
            {isAgent ? (
              <input value={form.agent_no} readOnly style={{ ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 }} />
            ) : (
              <input value={form.agent_no} onChange={e => set('agent_no', e.target.value)} placeholder="Agent reference number" style={inp} />
            )}
          </Field>
          <Field label="Nationality" required>
            <select value={form.nationality} onChange={e => set('nationality', e.target.value)} style={inp}>
              <option value="">Select Option</option>
              {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
        </div>

        <div style={row2}>
          <Field label="Guest Name" required><input value={form.guest_name} onChange={e => set('guest_name', e.target.value)} placeholder="Name of the guest" style={inp} /></Field>
          <Field label="Contact Name"><input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="Contact Name" style={inp} /></Field>
        </div>

        <div style={row3}>
          <Field label="Contact / Mobile No"><input type="tel" value={form.contact_number} onChange={e => set('contact_number', e.target.value)} placeholder="+92 321 ..." style={inp} /></Field>
          <Field label="Client Ref No"><input value={form.client_ref_no} onChange={e => set('client_ref_no', e.target.value)} placeholder="Client Ref No" style={inp} /></Field>
          <Field label="Group No"><input value={form.group_no} onChange={e => set('group_no', e.target.value)} placeholder="Group No" style={inp} /></Field>
        </div>

        <div style={row3}>
          <Field label="Local Ref No"><input value={form.local_refno} onChange={e => set('local_refno', e.target.value)} placeholder="Local Ref No" style={inp} /></Field>
          <Field label="Reservation No"><input value={form.reservation_no} onChange={e => set('reservation_no', e.target.value)} placeholder="Reservation No" style={inp} /></Field>
          <Field label="Reservation Date"><input type="date" value={form.reservation_date} onChange={e => set('reservation_date', e.target.value)} style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="Username"><input value={form.username} onChange={e => set('username', e.target.value)} placeholder="User / Agent ID" style={inp} /></Field>
          <Field label="Payment Type"><input value={form.payment_type} onChange={e => set('payment_type', e.target.value)} placeholder="e.g. SR CASH, Bank Transfer" style={inp} /></Field>
        </div>

        {/* ── SECTION 2: Transport Details (Segment #1) ── */}
        <div style={{ ...sec, marginTop: 12 }}>Transport Details</div>

        <div style={row2}>
          <Field label="Date" required><input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp} /></Field>
          <Field label="Time" required><input type="time" value={form.time} onChange={e => set('time', e.target.value)} style={inp} /></Field>
        </div>

        <div style={row1}>
          <Field label="Flight Details"><input value={form.flight_details} onChange={e => set('flight_details', e.target.value)} placeholder="e.g. SV 1234 / DEP 04:50 / ARR 06:30" style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="From" required><input value={form.from_location} onChange={e => set('from_location', e.target.value)} placeholder="e.g. Jeddah Airport" style={inp} /></Field>
          <Field label="To" required><input value={form.to_location} onChange={e => set('to_location', e.target.value)} placeholder="e.g. Makkah Hotel" style={inp} /></Field>
        </div>

        <div style={row3}>
          <Field label="Vehicle"><input value={form.vehicle} onChange={e => set('vehicle', e.target.value)} placeholder="e.g. H1, Bus, Van" style={inp} /></Field>
          <Field label="Mov. Type"><input value={form.mov_type} onChange={e => set('mov_type', e.target.value)} placeholder="Movement Type" style={inp} /></Field>
          <Field label="Qty" required><input type="number" min="1" value={form.qty} onChange={e => set('qty', e.target.value)} style={inp} /></Field>
        </div>

        <div style={row3}>
          <Field label="No. of Adults"><input type="number" min="0" value={form.no_of_adults} onChange={e => set('no_of_adults', e.target.value)} style={inp} /></Field>
          <Field label="Packs"><input value={form.packs} onChange={e => set('packs', e.target.value)} placeholder="e.g. Hajj, Umrah" style={inp} /></Field>
          <Field label="Rate" required><input type="number" step="0.01" min="0" value={form.rate} onChange={e => set('rate', e.target.value)} style={inp} /></Field>
        </div>

        <div style={row1}>
          <Field label="Total (Qty × Rate)"><input type="number" step="0.01" value={form.total} readOnly style={autoInp} /></Field>
        </div>

        {/* ── Additional transport segments ── */}
        {extraSegs.map((s, idx) => (
          <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: '18px 20px 4px', marginBottom: 20, background: '#FBFAF8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>Segment #{idx + 2}</span>
              <button type="button" onClick={() => removeSeg(idx)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
                Remove
              </button>
            </div>
            <div style={row2}>
              <Field label="Date" required><input type="date" value={s.date} onChange={e => setExtraSeg(idx, 'date', e.target.value)} style={inp} /></Field>
              <Field label="Time"><input type="time" value={s.time} onChange={e => setExtraSeg(idx, 'time', e.target.value)} style={inp} /></Field>
            </div>
            <div style={row1}>
              <Field label="Flight Details"><input value={s.flight_details} onChange={e => setExtraSeg(idx, 'flight_details', e.target.value)} placeholder="e.g. SV 1234 / DEP 04:50 / ARR 06:30" style={inp} /></Field>
            </div>
            <div style={row2}>
              <Field label="From"><input value={s.from_location} onChange={e => setExtraSeg(idx, 'from_location', e.target.value)} placeholder="e.g. Jeddah Airport" style={inp} /></Field>
              <Field label="To"><input value={s.to_location} onChange={e => setExtraSeg(idx, 'to_location', e.target.value)} placeholder="e.g. Makkah Hotel" style={inp} /></Field>
            </div>
            <div style={row3}>
              <Field label="Vehicle"><input value={s.vehicle} onChange={e => setExtraSeg(idx, 'vehicle', e.target.value)} placeholder="e.g. H1, Bus, Van" style={inp} /></Field>
              <Field label="Mov. Type"><input value={s.mov_type} onChange={e => setExtraSeg(idx, 'mov_type', e.target.value)} placeholder="Movement Type" style={inp} /></Field>
              <Field label="Qty"><input type="number" min="1" value={s.qty} onChange={e => setExtraSeg(idx, 'qty', e.target.value)} style={inp} /></Field>
            </div>
            <div style={row3}>
              <Field label="No. of Adults"><input type="number" min="0" value={s.no_of_adults} onChange={e => setExtraSeg(idx, 'no_of_adults', e.target.value)} style={inp} /></Field>
              <Field label="Packs"><input value={s.packs} onChange={e => setExtraSeg(idx, 'packs', e.target.value)} placeholder="e.g. Hajj, Umrah" style={inp} /></Field>
              <Field label="Rate"><input type="number" step="0.01" min="0" value={s.rate} onChange={e => setExtraSeg(idx, 'rate', e.target.value)} style={inp} /></Field>
            </div>
            <div style={row1}>
              <Field label="Total (Qty × Rate)"><input type="number" step="0.01" value={s.total} readOnly style={autoInp} /></Field>
            </div>
          </div>
        ))}

        {/* Add segment + running grand total */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <button type="button" onClick={addSeg}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#EDE9FE', color: '#5B21B6', border: '1.5px dashed #C4B5FD', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            Add Another Segment
          </button>
          {extraSegs.length > 0 && (
            <div style={{ fontSize: 13, color: '#374151' }}>
              Segments Total ({extraSegs.length + 1} segments):{' '}
              <strong style={{ color: '#059669', fontSize: 15 }}>{grandSegsTotal.toFixed(2)}</strong>
            </div>
          )}
        </div>

        {/* ── SECTION 3: Financial Summary ── */}
        <div style={{ ...sec, marginTop: 12 }}>Financial Summary</div>

        <div style={row2}>
          <Field label="Transport Surcharge"><input type="number" step="0.01" min="0" value={form.transport} onChange={e => set('transport', e.target.value)} style={inp} /></Field>
          <Field label="Discount"><input type="number" step="0.01" min="0" value={form.discount} onChange={e => set('discount', e.target.value)} style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="VAT %"><input type="number" step="0.01" min="0" value={form.vat} onChange={e => set('vat', e.target.value)} style={inp} /></Field>
          <Field label="Net Total With Tax"><input type="number" step="0.01" value={form.net_total_with_tax} readOnly style={autoInp} /></Field>
        </div>

        <div style={row1}>
          <Field label="Convert Rate Total: SAR">
            <input type="number" step="0.01" value={form.convert_rate_total_sar}
              onChange={e => setForm(p => ({ ...p, convert_rate_total_sar: e.target.value }))} style={inp} />
          </Field>
        </div>

        <div style={row2}>
          <Field label="Special Requirements"><input value={form.special_requirements} onChange={e => set('special_requirements', e.target.value)} placeholder="Special requirements" style={inp} /></Field>
          <Field label="Note"><input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Note" style={inp} /></Field>
        </div>

        {/* ── SECTION 4: Bank & Policies ── */}
        <div style={{ ...sec, marginTop: 12 }}>Bank Details & Policies</div>

        <div style={row2}>
          <Field label="Account Name"><input value={form.account_name} onChange={e => set('account_name', e.target.value)} style={inp} /></Field>
          <Field label="Bank"><input value={form.bank} onChange={e => set('bank', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Bank Account No"><input value={form.bank_account_no} onChange={e => set('bank_account_no', e.target.value)} style={inp} /></Field>
          <Field label="IBN"><input value={form.ibn} onChange={e => set('ibn', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}><Field label="Bank Address"><input value={form.bank_address} onChange={e => set('bank_address', e.target.value)} style={inp} /></Field></div>
        <div style={row1}><Field label="Important Contact"><input value={form.important_contact} onChange={e => set('important_contact', e.target.value)} style={inp} /></Field></div>
        <div style={row1}><Field label="Cancellation Policy"><input value={form.cancellation_policy} onChange={e => set('cancellation_policy', e.target.value)} style={inp} /></Field></div>
        <div style={row1}><Field label="No Show Policy"><input value={form.no_show_policy} onChange={e => set('no_show_policy', e.target.value)} style={inp} /></Field></div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6', marginTop: 4 }}>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding: '11px 36px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
            {saving ? 'Saving...' : 'Submit'}
          </button>
          <Link href="/admin/transport/invoice"
            style={{ padding: '11px 28px', background: '#fff', color: '#6B7280', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
