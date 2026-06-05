'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const COUNTRIES = [
  { code: 'PK', name: 'Pakistan' },    { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IN', name: 'India' },       { code: 'BD', name: 'Bangladesh' },
  { code: 'EG', name: 'Egypt' },       { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },    { code: 'TR', name: 'Turkey' },
  { code: 'AE', name: 'UAE' },         { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },{ code: 'PH', name: 'Philippines' },
];

const flagEmoji = (code) => {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.codePointAt(0) + 127397));
};

const genNextId = (existing) => {
  let max = 300;
  existing.forEach(a => {
    const n = parseInt((a.custom_id || '').replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return `MC${String(max + 1).padStart(4, '0')}`;
};

const inp = {
  width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB',
  borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
  background: '#FAFAFA', color: '#111827', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};
const lbl = { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 };

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={lbl}>{label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}</label>
      {children}
    </div>
  );
}

export default function CreateAgentPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ fname: '', lname: '', email: '', password: '', phone: '', zip_code: 'PK', address: '', status: 1, custom_id: '' });
  const [saving, setSaving] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    fetch('/api/admin/users?role=2&limit=10000')
      .then(r => r.json())
      .then(d => {
        if (d.success) setForm(f => ({ ...f, custom_id: genNextId(d.data || []) }));
      })
      .catch(() => {});
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fname.trim()) { toast.error('Agent / company name is required'); return; }
    if (!form.email.trim()) { toast.error('Email address is required'); return; }
    if (!form.password.trim()) { toast.error('Password is required'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 2 }),
      });
      const d = await r.json();
      if (d.success) {
        toast.success('Agent created successfully!');
        router.push('/admin/agents');
      } else {
        toast.error(d.error || 'Failed to create agent');
      }
    } catch (err) {
      toast.error(err.message);
    }
    setSaving(false);
  };

  const flag = flagEmoji(form.zip_code);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

      {/* ── Left: Form ── */}
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Add New Agent</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Create an agent account with portal access</p>
          </div>
          <Link href="/admin/agents"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All Agents
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ID & Country */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '22px 24px', marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Identity</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Merchant ID">
                <input style={{ ...inp, background: '#F9FAFB', color: '#6B7280', fontWeight: 700 }} value={form.custom_id} readOnly />
              </Field>
              <Field label="Country">
                <select style={inp} value={form.zip_code} onChange={e => set('zip_code', e.target.value)}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Personal Info */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '22px 24px', marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Agent Details</div>
            <Field label="Agent / Company Name" required>
              <input style={inp} value={form.fname} onChange={e => set('fname', e.target.value)} placeholder="e.g. MAHIR TRAVEL" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Email Address" required>
                <input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="agent@company.com" />
              </Field>
              <Field label="Phone">
                <input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 300 0000000" />
              </Field>
            </div>
            <Field label="Address">
              <textarea style={{ ...inp, height: 72, resize: 'vertical' }} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Agent's business address" />
            </Field>
          </div>

          {/* Account */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '22px 24px', marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Portal Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Password" required>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...inp, paddingRight: 60 }} type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: '#9CA3AF', padding: '2px 4px', fontFamily: 'inherit' }}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </Field>
              <Field label="Status">
                <select style={inp} value={form.status} onChange={e => set('status', Number(e.target.value))}>
                  <option value={1}>Active</option>
                  <option value={2}>Inactive</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Link href="/admin/agents"
              style={{ padding: '11px 24px', border: '1.5px solid #E5E7EB', borderRadius: 9, background: '#fff', fontSize: 13.5, fontWeight: 600, color: '#374151', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Cancel
            </Link>
            <button type="submit" disabled={saving}
              style={{ padding: '11px 28px', border: 'none', borderRadius: 9, background: saving ? '#D4904E' : '#B1723C', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(177,114,60,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {saving ? (
                <>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Creating...
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  Create Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Right: Info panel ── */}
      <div style={{ position: 'sticky', top: 20 }}>
        {/* Agent preview card — light */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '22px 20px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>Preview</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '1px solid #E5E7EB', flexShrink: 0 }}>
              {flag}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: form.fname ? '#111827' : '#D1D5DB', lineHeight: 1.3 }}>
                {form.fname || 'Agent Name'}
              </div>
              <div style={{ fontSize: 12, color: form.email ? '#6B7280' : '#D1D5DB', marginTop: 2 }}>
                {form.email || 'email@example.com'}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['Merchant ID', form.custom_id || '—'],
              ['Country', COUNTRIES.find(c => c.code === form.zip_code)?.name || '—'],
              ['Phone', form.phone || '—'],
              ['Status', form.status === 1 ? 'Active' : 'Inactive'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 12px', border: '1px solid #ECEEF2' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 12.5, color: '#374151', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 14 }}>What is an Agent?</div>
          {[
            ['Merchant ID', 'Auto-generated unique identifier for the agent. Cannot be changed after creation.'],
            ['Portal Access', 'The agent will log in with their email and password to view and create invoices.'],
            ['Status', 'Inactive agents cannot log in. You can toggle this at any time from the agents list.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: '#FDF4EC', border: '1px solid #F3D9C0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#B1723C' }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
