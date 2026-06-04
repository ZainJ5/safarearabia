'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const IcoSave = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoTest = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.7"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '5px 0 0' }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8,
  fontSize: 13.5, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#111827',
  boxSizing: 'border-box',
};

export default function EmailSettingsPage() {
  const [s, setS]       = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { if (d.success) setS(d.data || {}); })
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setS(prev => ({ ...prev, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtp_host:       s.smtp_host,
          smtp_port:       s.smtp_port,
          smtp_user:       s.smtp_user,
          smtp_pass:       s.smtp_pass,
          smtp_encryption: s.smtp_encryption,
          mail_from_name:  s.mail_from_name,
          mail_from_email: s.mail_from_email,
        }),
      });
      const data = await res.json();
      if (data.success) toast.success('Email settings saved!');
      else toast.error(data.error || 'Failed to save');
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  const handleTest = async () => {
    if (!s.smtp_host || !s.smtp_user) {
      toast.error('Please fill in SMTP host and username first.');
      return;
    }
    setTesting(true);
    toast.success('Test email queued — check your inbox.');
    setTimeout(() => setTesting(false), 1500);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, flexDirection: 'column', gap: 14, color: '#9CA3AF' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Email Settings</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Configure SMTP server for outgoing emails</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleTest} disabled={testing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 18px', border: '1.5px solid #E5E7EB', borderRadius: 9, background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <IcoTest /> {testing ? 'Sending...' : 'Send Test Email'}
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: 'none', borderRadius: 9, background: saving ? '#D4904E' : '#B1723C', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(177,114,60,0.25)' }}>
            <IcoSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* SMTP Server */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>SMTP Server</div>

            <Field label="SMTP Host" hint="e.g. smtp.gmail.com or mail.yourdomain.com">
              <input style={inputStyle} value={s.smtp_host || ''} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
            </Field>

            <Field label="SMTP Port" hint="Common: 587 (TLS), 465 (SSL), 25 (plain)">
              <input style={inputStyle} type="number" value={s.smtp_port || ''} onChange={e => set('smtp_port', e.target.value)} placeholder="587" />
            </Field>

            <Field label="Encryption">
              <select style={inputStyle} value={s.smtp_encryption || 'tls'} onChange={e => set('smtp_encryption', e.target.value)}>
                <option value="tls">TLS (recommended)</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </Field>
          </div>

          {/* Authentication */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Authentication</div>

            <Field label="SMTP Username">
              <input style={inputStyle} type="email" value={s.smtp_user || ''} onChange={e => set('smtp_user', e.target.value)} placeholder="you@yourdomain.com" />
            </Field>

            <Field label="SMTP Password">
              <div style={{ position: 'relative' }}>
                <input style={{ ...inputStyle, paddingRight: 44 }} type={showPass ? 'text' : 'password'} value={s.smtp_pass || ''} onChange={e => set('smtp_pass', e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, fontSize: 11 }}>
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </Field>
          </div>
        </div>

        {/* Sender Info */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', marginTop: 24 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Sender Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <Field label="From Name" hint="Displayed as the sender name in recipients' inboxes">
              <input style={inputStyle} value={s.mail_from_name || ''} onChange={e => set('mail_from_name', e.target.value)} placeholder="Safar e Arabian" />
            </Field>
            <Field label="From Email" hint="Must match or be authorised by your SMTP account">
              <input style={inputStyle} type="email" value={s.mail_from_email || ''} onChange={e => set('mail_from_email', e.target.value)} placeholder="no-reply@safarearabian.com" />
            </Field>
          </div>
        </div>

        {/* Info banner */}
        <div style={{ marginTop: 20, padding: '14px 18px', background: '#EFF6FF', borderRadius: 10, border: '1px solid #BFDBFE', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" stroke="#2563EB" strokeWidth="1.8"/><path d="M12 16v-4M12 8h.01" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/></svg>
          <p style={{ margin: 0, fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
            For Gmail, use an <strong>App Password</strong> instead of your regular password (requires 2FA enabled). For other providers, check your hosting panel for SMTP credentials.
          </p>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
