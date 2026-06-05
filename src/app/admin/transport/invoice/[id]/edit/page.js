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

const calcAmt = (f) => {
  const qty      = Number(f.qty)       || 0;
  const rate     = Number(f.rate)      || 0;
  const tableTotal = qty * rate;
  const transport  = Number(f.transport)  || 0;
  const discount   = Number(f.discount)   || 0;
  const vat        = Number(f.vat)        || 0;
  const net        = (tableTotal + transport - discount) * (1 + vat / 100);
  return { ...f, total: tableTotal, net_total_with_tax: Math.round(net * 100) / 100 };
};

export default function EditTransportInvoicePage({ params }) {
  const { id } = use(params);
  const router  = useRouter();
  const { role, fname, lname } = useAdminUser();
  const isAgent = role === 2;

  const [form, setForm]       = useState(null);
  const [agents, setAgents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetch(`/api/admin/transport-invoices/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setForm(d.data);
        else toast.error(d.error || 'Failed to load invoice');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAgent) {
      fetch('/api/admin/users?role=2&limit=10000')
        .then(r => r.json())
        .then(d => { if (d.success) setAgents(d.data || []); })
        .catch(() => {});
    }
  }, [isAgent]);

  const set = (key, val) => setForm(prev => calcAmt({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.guest_name?.trim()) { toast.error('Guest Name is required'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/transport-invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Invoice updated!');
        router.push(`/admin/transport/invoice/${id}`);
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const inp = { width: '100%', padding: '10px 13px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#111827', outline: 'none', boxSizing: 'border-box' };
  const autoInp = { ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 };
  const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 };
  const row1 = { marginBottom: 20 };
  const sec  = { fontSize: 14, fontWeight: 700, color: '#0D1B2E', paddingBottom: 12, marginBottom: 20, borderBottom: '1px solid #F3F4F6' };

  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#5B21B6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      Loading invoice...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!form) return <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>Invoice not found or access denied.</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Edit Invoice</h4>
          <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>Invoice No: <strong style={{ color: '#5B21B6' }}>T-{form.invoice_no}</strong></p>
        </div>
        <Link href={`/admin/transport/invoice/${id}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Cancel
        </Link>
      </div>

      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: 28, background: '#fff', borderRadius: '10px 10px 0 0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, padding: '14px 0', background: '#fff', textAlign: 'center', borderBottom: '3px solid #5B21B6', cursor: 'default', fontSize: 14, fontWeight: 700, color: '#5B21B6', marginBottom: -2 }}>Transport</div>
      </div>

      <div className="admin-card">
        <div style={sec}>Transport Invoice Information</div>

        <div style={row3}>
          <Field label="Agent Name" required>
            {isAgent ? (
              <input value={form.agent_name || ''} readOnly style={{ ...inp, background: '#F0FDF4', color: '#059669', fontWeight: 700 }} />
            ) : (
              <AgentSearchSelect
                agents={agents}
                value={form.agent_name || ''}
                onChange={(name, ag) => setForm(prev => calcAmt({ ...prev, agent_name: name, agent_no: ag?.custom_id || prev.agent_no || '' }))}
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
          <Field label="Contact Name"><input value={form.contact_name || ''} onChange={e => set('contact_name', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row3}>
          <Field label="Contact / Mobile No"><input type="tel" value={form.contact_number || ''} onChange={e => set('contact_number', e.target.value)} style={inp} /></Field>
          <Field label="Client Ref No"><input value={form.client_ref_no || ''} onChange={e => set('client_ref_no', e.target.value)} style={inp} /></Field>
          <Field label="Group No"><input value={form.group_no || ''} onChange={e => set('group_no', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row3}>
          <Field label="Local Ref No"><input value={form.local_refno || ''} onChange={e => set('local_refno', e.target.value)} style={inp} /></Field>
          <Field label="Reservation No"><input value={form.reservation_no || ''} onChange={e => set('reservation_no', e.target.value)} style={inp} /></Field>
          <Field label="Reservation Date"><input type="date" value={form.reservation_date || ''} onChange={e => set('reservation_date', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Username"><input value={form.username || ''} onChange={e => set('username', e.target.value)} style={inp} /></Field>
          <Field label="Payment Type"><input value={form.payment_type || ''} onChange={e => set('payment_type', e.target.value)} style={inp} /></Field>
        </div>

        <div style={{ ...sec, marginTop: 12 }}>Transport Details</div>
        <div style={row2}>
          <Field label="Date" required><input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} style={inp} /></Field>
          <Field label="Time"><input type="time" value={form.time || ''} onChange={e => set('time', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="From"><input value={form.from_location || ''} onChange={e => set('from_location', e.target.value)} style={inp} /></Field>
          <Field label="To"><input value={form.to_location || ''} onChange={e => set('to_location', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row3}>
          <Field label="Vehicle"><input value={form.vehicle || ''} onChange={e => set('vehicle', e.target.value)} style={inp} /></Field>
          <Field label="Mov. Type"><input value={form.mov_type || ''} onChange={e => set('mov_type', e.target.value)} style={inp} /></Field>
          <Field label="Qty"><input type="number" min="1" value={form.qty || 1} onChange={e => set('qty', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row3}>
          <Field label="No. of Adults"><input type="number" min="0" value={form.no_of_adults || 0} onChange={e => set('no_of_adults', e.target.value)} style={inp} /></Field>
          <Field label="Packs"><input value={form.packs || ''} onChange={e => set('packs', e.target.value)} style={inp} /></Field>
          <Field label="Rate"><input type="number" step="0.01" min="0" value={form.rate || 0} onChange={e => set('rate', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}><Field label="Total (Qty × Rate)"><input value={Number(form.total || 0).toFixed(2)} readOnly style={autoInp} /></Field></div>

        <div style={{ ...sec, marginTop: 12 }}>Financial Summary</div>
        <div style={row2}>
          <Field label="Transport Surcharge"><input type="number" step="0.01" min="0" value={form.transport || 0} onChange={e => set('transport', e.target.value)} style={inp} /></Field>
          <Field label="Discount"><input type="number" step="0.01" min="0" value={form.discount || 0} onChange={e => set('discount', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="VAT %"><input type="number" step="0.01" min="0" value={form.vat || 0} onChange={e => set('vat', e.target.value)} style={inp} /></Field>
          <Field label="Net Total With Tax"><input value={Number(form.net_total_with_tax || 0).toFixed(2)} readOnly style={autoInp} /></Field>
        </div>
        <div style={row1}>
          <Field label="Convert Rate Total: SAR">
            <input type="number" step="0.01" value={form.convert_rate_total_sar || 0}
              onChange={e => setForm(p => ({ ...p, convert_rate_total_sar: e.target.value }))} style={inp} />
          </Field>
        </div>
        <div style={row2}>
          <Field label="Special Requirements"><input value={form.special_requirements || ''} onChange={e => set('special_requirements', e.target.value)} style={inp} /></Field>
          <Field label="Note"><input value={form.notes || ''} onChange={e => set('notes', e.target.value)} style={inp} /></Field>
        </div>

        <div style={{ ...sec, marginTop: 12 }}>Bank Details & Policies</div>
        <div style={row2}>
          <Field label="Account Name"><input value={form.account_name || ''} onChange={e => set('account_name', e.target.value)} style={inp} /></Field>
          <Field label="Bank"><input value={form.bank || ''} onChange={e => set('bank', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row2}>
          <Field label="Bank Account No"><input value={form.bank_account_no || ''} onChange={e => set('bank_account_no', e.target.value)} style={inp} /></Field>
          <Field label="IBN"><input value={form.ibn || ''} onChange={e => set('ibn', e.target.value)} style={inp} /></Field>
        </div>
        <div style={row1}><Field label="Cancellation Policy"><input value={form.cancellation_policy || ''} onChange={e => set('cancellation_policy', e.target.value)} style={inp} /></Field></div>
        <div style={row1}><Field label="No Show Policy"><input value={form.no_show_policy || ''} onChange={e => set('no_show_policy', e.target.value)} style={inp} /></Field></div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6', marginTop: 4 }}>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding: '11px 36px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/admin/transport/invoice/${id}`}
            style={{ padding: '11px 28px', background: '#fff', color: '#6B7280', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
