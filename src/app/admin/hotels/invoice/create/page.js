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

const INIT = {
  agent_name: '', agent_no: '', nationality: '', guest_name: '', option_date: '',
  client_ref_no: '', vat_number: '', contact_name: '', group_no: '',
  mobile_no: '', local_refno: '',
  hotel_name: '', city: '', room_type: '', check_in: '', check_out: '',
  no_of_nights: 0, no_of_rooms: 1, no_of_adults: 1, no_of_children: 0,
  packs: '', meals: '', day_rate: '', ml_srate: '',
  room_amount: 0, conformation_no: '', total_amount: 0, sub_amount: 0,
  account_name: 'Safar e Arabian Travel & tours', bank: 'Faisal Bank',
  bank_account_no: '3054301000007374', bank_address: '', ibn: 'PK65FAYS3054301000007374',
  important_contact: '',
  cancellation_policy: 'No-Cancellation or Amendment will be accepted after re-confirmation',
  no_show_policy: 'In-case of No-Show full invoice amount will be charged',
};

const recalc = (f) => {
  const nights = Number(f.no_of_nights) || 0;
  const rooms  = Number(f.no_of_rooms)  || 0;
  const rate   = Number(f.day_rate)     || 0;
  const amt    = nights * rooms * rate;
  // Only sync total/sub if they currently equal the old room_amount (not manually changed)
  const prev   = Number(f.room_amount) || 0;
  const total  = (Number(f.total_amount) === prev) ? amt : Number(f.total_amount);
  const sub    = (Number(f.sub_amount)   === prev) ? amt : Number(f.sub_amount);
  return { ...f, room_amount: amt, total_amount: total, sub_amount: sub };
};

export default function CreateHotelInvoicePage() {
  const router  = useRouter();
  const { role, fname, lname, customId } = useAdminUser();
  const isAgent = role === 2;
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState(INIT);
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  // Load agents for dropdown (admin) or set own name (agent)
  useEffect(() => {
    if (isAgent) {
      const name = `${fname} ${lname}`.trim();
      setForm(prev => recalc({ ...prev, agent_name: name, agent_no: customId || '' }));
      setAgentsLoading(false);
    } else {
      fetch('/api/admin/users?role=2&limit=10000')
        .then(r => r.json())
        .then(d => { if (d.success) setAgents(d.data || []); })
        .catch(() => {})
        .finally(() => setAgentsLoading(false));
    }
  }, [isAgent, fname, lname]);

  const set = (key, val) => setForm(prev => recalc({ ...prev, [key]: val }));

  // Auto-calc nights when dates change
  useEffect(() => {
    if (form.check_in && form.check_out) {
      const diff = Math.max(0, Math.round(
        (new Date(form.check_out) - new Date(form.check_in)) / 86400000
      ));
      setForm(prev => recalc({ ...prev, no_of_nights: diff }));
    }
  }, [form.check_in, form.check_out]);

  const handleSubmit = async () => {
    if (!form.guest_name.trim()) { toast.error('Guest Name is required'); return; }
    if (!form.hotel_name.trim()) { toast.error('Hotel Name is required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hotel-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Invoice created successfully!');
        router.push(`/admin/hotels/invoice/${data.data._id}`);
      } else {
        toast.error(data.error || 'Failed to create invoice');
      }
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  /* ── Shared styles ── */
  const inp = {
    width: '100%', padding: '10px 13px',
    border: '1px solid #D1D5DB', borderRadius: 6,
    fontSize: 14, fontFamily: 'inherit', background: '#fff',
    color: '#111827', outline: 'none', transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 };
  const row1 = { marginBottom: 20 };
  const sec  = { fontSize: 14, fontWeight: 700, color: '#0D1B2E', paddingBottom: 12, marginBottom: 20, borderBottom: '1px solid #F3F4F6' };
  const readonlyInp = { ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700, cursor: 'default' };

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Add Invoice</h4>
        <Link href="/admin/hotels/invoice"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Go Back
        </Link>
      </div>

      {/* Tab bar — Hotel only */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: 28, background: '#fff', borderRadius: '10px 10px 0 0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{
          flex: 1, padding: '14px 0', background: '#fff', textAlign: 'center',
          borderBottom: '3px solid #B1723C', cursor: 'default',
          fontSize: 14, fontWeight: 700, color: '#B1723C', marginBottom: -2,
        }}>
          Hotel
        </div>
      </div>

      <div className="admin-card">
        {/* ── SECTION 1: Invoice Info ── */}
        <div style={sec}>Hotel Invoice Information</div>

        {/* Agent Name/No — dropdown for admin, read-only for agent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
          <Field label="Agent Name" required>
            {isAgent ? (
              <input value={form.agent_name} readOnly style={{ ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 }} />
            ) : (
              <AgentSearchSelect
                agents={agents}
                value={form.agent_name}
                onChange={(name, ag) => setForm(prev => recalc({ ...prev, agent_name: name, agent_no: ag?.custom_id || prev.agent_no }))}
                disabled={agentsLoading}
                placeholder={agentsLoading ? 'Loading agents...' : 'Select Agent'}
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
          <Field label="Option Date"><input type="date" value={form.option_date} onChange={e => set('option_date', e.target.value)} style={inp} /></Field>
        </div>

        <div style={row1}>
          <Field label="Client Ref No"><input value={form.client_ref_no} onChange={e => set('client_ref_no', e.target.value)} placeholder="Client Ref No" style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="Hotel Name" required><input value={form.hotel_name} onChange={e => set('hotel_name', e.target.value)} placeholder="Hotel Name" style={inp} /></Field>
          <Field label="City" required>
            <select value={form.city} onChange={e => set('city', e.target.value)} style={inp}>
              <option value="">Select Option</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div style={row2}>
          <Field label="Room Type" required><input value={form.room_type} onChange={e => set('room_type', e.target.value)} placeholder="e.g. QUAD, TRIPLE, DOUBLE" style={inp} /></Field>
          <Field label="Check In" required><input type="date" value={form.check_in} onChange={e => set('check_in', e.target.value)} style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="Check Out" required><input type="date" value={form.check_out} onChange={e => set('check_out', e.target.value)} style={inp} /></Field>
          <Field label="No. of Nights" required>
            <input type="number" min="0" value={form.no_of_nights} onChange={e => set('no_of_nights', e.target.value)} style={inp} />
          </Field>
        </div>

        <div style={row2}>
          <Field label="No. of Rooms" required><input type="number" min="1" value={form.no_of_rooms} onChange={e => set('no_of_rooms', e.target.value)} placeholder="No. of Rooms" style={inp} /></Field>
          <Field label="No. of Adults" required><input type="number" min="1" value={form.no_of_adults} onChange={e => set('no_of_adults', e.target.value)} placeholder="No. of Adults" style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="Packs" required><input value={form.packs} onChange={e => set('packs', e.target.value)} placeholder="e.g. Hajj, Umrah" style={inp} /></Field>
          <Field label="Meals" required><input value={form.meals} onChange={e => set('meals', e.target.value)} placeholder="e.g. R,O / BB / HB / FB" style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="Day Rate" required><input type="number" step="0.01" min="0" value={form.day_rate} onChange={e => set('day_rate', e.target.value)} placeholder="Rate per night" style={inp} /></Field>
          <Field label="ML Srate" required><input type="number" step="0.01" min="0" value={form.ml_srate} onChange={e => set('ml_srate', e.target.value)} placeholder="ML Srate" style={inp} /></Field>
        </div>

        <div style={row2}>
          <Field label="Room Amount">
            <input value={Number(form.room_amount).toFixed(2)} readOnly style={readonlyInp} />
          </Field>
          <Field label="Conformation No">
            <input value={form.conformation_no} onChange={e => set('conformation_no', e.target.value)} placeholder="Confirmation Number" style={inp} />
          </Field>
        </div>

        <div style={row2}>
          <Field label="Total Amount" required>
            <input type="number" step="0.01" min="0" value={form.total_amount}
              onChange={e => setForm(p => ({ ...p, total_amount: e.target.value }))} style={inp} />
          </Field>
          <Field label="Sub Amount" required>
            <input type="number" step="0.01" min="0" value={form.sub_amount}
              onChange={e => setForm(p => ({ ...p, sub_amount: e.target.value }))} style={inp} />
          </Field>
        </div>

        {/* ── SECTION 2: Additional Details ── */}
        <div style={{ ...sec, marginTop: 12 }}>Additional Guest Details</div>

        <div style={row2}>
          <Field label="Contact Name"><input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="Contact person name" style={inp} /></Field>
          <Field label="Group No"><input value={form.group_no} onChange={e => set('group_no', e.target.value)} placeholder="Group number" style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Mobile No"><input type="tel" value={form.mobile_no} onChange={e => set('mobile_no', e.target.value)} placeholder="Mobile number" style={inp} /></Field>
          <Field label="Local Ref No"><input value={form.local_refno} onChange={e => set('local_refno', e.target.value)} placeholder="Local reference" style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="VAT Number"><input value={form.vat_number} onChange={e => set('vat_number', e.target.value)} placeholder="VAT Number" style={inp} /></Field>
          <Field label="No. of Children"><input type="number" min="0" value={form.no_of_children} onChange={e => set('no_of_children', e.target.value)} placeholder="0" style={inp} /></Field>
        </div>

        {/* ── SECTION 3: Bank & Policies ── */}
        <div style={{ ...sec, marginTop: 12 }}>Bank Details & Policies</div>

        <div style={row2}>
          <Field label="Account Name"><input value={form.account_name} onChange={e => set('account_name', e.target.value)} style={inp} /></Field>
          <Field label="Bank"><input value={form.bank} onChange={e => set('bank', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Bank Account No"><input value={form.bank_account_no} onChange={e => set('bank_account_no', e.target.value)} style={inp} /></Field>
          <Field label="IBN"><input value={form.ibn} onChange={e => set('ibn', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}>
          <Field label="Bank Address"><input value={form.bank_address} onChange={e => set('bank_address', e.target.value)} placeholder="Bank branch address" style={inp} /></Field>
        </div>
        <div style={row1}>
          <Field label="Cancellation Policy"><input value={form.cancellation_policy} onChange={e => set('cancellation_policy', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}>
          <Field label="No Show Policy"><input value={form.no_show_policy} onChange={e => set('no_show_policy', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}>
          <Field label="Important Contact"><input value={form.important_contact} onChange={e => set('important_contact', e.target.value)} placeholder="Contact person for this invoice" style={inp} /></Field>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6', marginTop: 4 }}>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding: '11px 36px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
            {saving ? 'Saving...' : 'Submit'}
          </button>
          <Link href="/admin/hotels/invoice"
            style={{ padding: '11px 28px', background: '#fff', color: '#6B7280', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
