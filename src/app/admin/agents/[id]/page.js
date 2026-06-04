'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const flagEmoji = (code) => {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.codePointAt(0) + 127397));
};

const fmt = (n) => Number(n || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusBadge = (s) => {
  const map = {
    Processing: { bg: '#FFFBEB', color: '#D97706' },
    Completed:  { bg: '#ECFDF5', color: '#059669' },
    Cancelled:  { bg: '#FEF2F2', color: '#DC2626' },
    Paid:       { bg: '#ECFDF5', color: '#059669' },
    Unpaid:     { bg: '#FFFBEB', color: '#D97706' },
  };
  const st = map[s] || { bg: '#F3F4F6', color: '#6B7280' };
  return <span style={{ padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>{s || '—'}</span>;
};

export default function AgentProfilePage({ params }) {
  const { id } = use(params);
  const [agent, setAgent]               = useState(null);
  const [hotelInvoices, setHotelInvoices]         = useState([]);
  const [transportInvoices, setTransportInvoices] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [editModal, setEditModal]       = useState(false);
  const [form, setForm]                 = useState({});
  const [saving, setSaving]             = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/admin/users/${id}`);
        const d = await r.json();
        if (d.success) {
          setAgent(d.data);
          setForm({
            fname: d.data.fname || '', lname: d.data.lname || '',
            phone: d.data.phone || '', address: d.data.address || '',
            zip_code: d.data.zip_code || 'PK', status: d.data.status ?? 1, password: '',
          });

          const agentName = `${d.data.fname || ''} ${d.data.lname || ''}`.trim();
          if (agentName) {
            const [hr, tr] = await Promise.all([
              fetch(`/api/admin/hotel-invoices?agent_name=${encodeURIComponent(agentName)}&limit=5`),
              fetch(`/api/admin/transport-invoices?agent_name=${encodeURIComponent(agentName)}&limit=5`),
            ]);
            const [hd, td] = await Promise.all([hr.json(), tr.json()]);
            if (hd.success) setHotelInvoices(hd.data);
            if (td.success) setTransportInvoices(td.data);
          }
        }
      } catch { /**/ }
      setLoading(false);
    };
    loadAll();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...form };
      if (!body.password) delete body.password;
      const r = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (d.success) {
        toast.success('Agent updated');
        setAgent(d.data);
        setEditModal(false);
      } else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!agent) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>
      Agent not found. <Link href="/admin/agents">Go back</Link>
    </div>
  );

  const totalHotelAmt     = hotelInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
  const totalTransportAmt = transportInvoices.reduce((s, i) => s + Number(i.net_total_with_tax || i.total || 0), 0);
  const countryCode = agent.zip_code || 'PK';
  const flag = flagEmoji(countryCode);
  const name = `${agent.fname || ''} ${agent.lname || ''}`.trim();
  const username = `@${(agent.fname || 'agent').replace(/\s+/g, '').toUpperCase()}`;
  const inp = { width: '100%', padding: '10px 13px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box' };
  const lbl = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block' };

  return (
    <>
      {/* Edit Modal */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.22)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0D1B2E, #1a3356)', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
              <h5 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>Edit Agent Info</h5>
              <button onClick={() => setEditModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '5px 12px', color: '#fff', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Agent / Company Name</label>
                <input style={inp} value={form.fname} onChange={e => setForm(f => ({ ...f, fname: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div>
                  <label style={lbl}>Status</label>
                  <select style={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) }))}>
                    <option value={1}>Active</option>
                    <option value={2}>Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>New Password (leave blank to keep)</label>
                <input style={inp} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="New password" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>Address</label>
                <textarea style={{ ...inp, height: 70, resize: 'vertical' }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditModal(false)} style={{ padding: '10px 22px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ padding: '10px 28px', background: '#B1723C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Agent Profile</h4>
        <Link href="/admin/agents"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Go Back
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Available Balance',    value: `SAR ${Number(agent.wallet_balance||0).toLocaleString()}`, grad: 'linear-gradient(135deg, #10B981, #059669)' },
          { label: 'Total Withdrawal',     value: 'SAR 0',                                                   grad: 'linear-gradient(135deg, #EF4444, #B91C1C)' },
          { label: 'Hotel Invoices',       value: hotelInvoices.length,                                      grad: 'linear-gradient(135deg, #F59E0B, #D97706)' },
          { label: 'Transport Invoices',   value: transportInvoices.length,                                  grad: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.grad, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden', minHeight: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 10, lineHeight: 1.3 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{s.value}</div>
            <div style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          </div>
        ))}
      </div>

      {/* Profile Card */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
          <div>
            <div style={{ display: 'inline-block', padding: '4px 12px', background: '#B1723C', color: '#fff', borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 20 }}>
              Joined At {agent.created_at ? new Date(agent.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {agent.image
                  ? <img src={agent.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg width="52" height="52" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#9CA3AF"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#9CA3AF"/></svg>
                }
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#111827', marginBottom: 2 }}>{name.toUpperCase()}</div>
                <div style={{ color: '#B1723C', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{username}</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 16px', minWidth: 160 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 3 }}>Email</div>
                    <div style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{agent.email}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 16px' }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 3 }}>Country</div>
                    <div style={{ fontSize: 18 }}>{flag}</div>
                  </div>
                  {agent.phone && (
                    <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 16px' }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 3 }}>Phone</div>
                      <div style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{agent.phone}</div>
                    </div>
                  )}
                  {agent.custom_id && (
                    <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 16px' }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 3 }}>Merchant ID</div>
                      <div style={{ fontSize: 13, color: '#B1723C', fontWeight: 700 }}>{agent.custom_id}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160 }}>
            <button onClick={() => setEditModal(true)}
              style={{ padding: '10px 0', background: '#fff', color: '#B1723C', border: '1.5px solid #B1723C', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, width: '100%', textAlign: 'center' }}>
              Edit Info
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(agent.email); toast.success('Email copied to clipboard'); }}
              style={{ padding: '10px 0', background: '#fff', color: '#374151', border: '1.5px solid #E5E7EB', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, width: '100%', textAlign: 'center' }}>
              Copy Login Email
            </button>
            <div style={{ padding: '10px 0', background: '#F0FDF4', color: '#059669', border: '1.5px solid #A7F3D0', borderRadius: 8, fontSize: 13, fontWeight: 600, width: '100%', textAlign: 'center' }}>
              Balance: SAR {Number(agent.wallet_balance || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Hotel Invoices */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
            <h5 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Latest Hotel Invoices</h5>
            {hotelInvoices.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 600, background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: 20 }}>
                {hotelInvoices.length} recent
              </span>
            )}
          </div>
          <Link href={`/admin/agents/${id}/invoices?type=hotel`}
            style={{ fontSize: 12, color: '#B1723C', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            View All →
          </Link>
        </div>
        {hotelInvoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#9CA3AF', fontSize: 13 }}>No hotel invoices found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Invoice No.</th><th>Date</th><th>Guest Name</th>
                  <th>Nationality</th><th>Hotel</th><th>Amount</th><th>Status</th><th style={{ width: 60 }}>View</th>
                </tr>
              </thead>
              <tbody>
                {hotelInvoices.map(inv => (
                  <tr key={inv._id}>
                    <td style={{ fontWeight: 700, color: '#B1723C' }}>#{inv.reserve_no}</td>
                    <td style={{ fontSize: 12, color: '#6B7280' }}>
                      {inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ fontWeight: 600 }}>{inv.guest_name || '—'}</td>
                    <td style={{ fontSize: 13 }}>{inv.nationality || '—'}</td>
                    <td style={{ fontSize: 12 }}>{inv.hotel_name || '—'}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>SAR {fmt(inv.total_amount)}</td>
                    <td>{statusBadge(inv.status || 'Processing')}</td>
                    <td>
                      <Link href={`/admin/hotels/invoice/${inv._id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#F0FDF4', borderRadius: 6, color: '#059669', textDecoration: 'none' }}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Latest Transport Invoices */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
            <h5 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Latest Transport Invoices</h5>
            {transportInvoices.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 600, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 20 }}>
                {transportInvoices.length} recent
              </span>
            )}
          </div>
          <Link href={`/admin/agents/${id}/invoices?type=transport`}
            style={{ fontSize: 12, color: '#B1723C', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            View All →
          </Link>
        </div>
        {transportInvoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#9CA3AF', fontSize: 13 }}>No transport invoices found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Invoice No.</th><th>Date</th><th>Guest Name</th>
                  <th>From</th><th>To</th><th>Vehicle</th><th>Amount</th><th>Status</th><th style={{ width: 60 }}>View</th>
                </tr>
              </thead>
              <tbody>
                {transportInvoices.map(inv => (
                  <tr key={inv._id}>
                    <td style={{ fontWeight: 700, color: '#B1723C' }}>T-{inv.invoice_no}</td>
                    <td style={{ fontSize: 12, color: '#6B7280' }}>{inv.date || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{inv.guest_name || '—'}</td>
                    <td style={{ fontSize: 12 }}>{inv.from_location || '—'}</td>
                    <td style={{ fontSize: 12 }}>{inv.to_location || '—'}</td>
                    <td style={{ fontSize: 12 }}>{inv.vehicle || '—'}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>SAR {fmt(inv.net_total_with_tax || inv.total)}</td>
                    <td>{statusBadge(inv.status || 'Processing')}</td>
                    <td>
                      <Link href={`/admin/transport/invoice/${inv._id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#F0FDF4', borderRadius: 6, color: '#059669', textDecoration: 'none' }}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </Link>
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
