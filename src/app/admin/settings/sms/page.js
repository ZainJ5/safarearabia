'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const IcoSave = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

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

const PROVIDERS = [
  { value: 'twilio',    label: 'Twilio (SMS + WhatsApp)' },
  { value: 'whatsapp',  label: 'WhatsApp Business API' },
  { value: 'nexmo',     label: 'Vonage (Nexmo) SMS' },
  { value: 'custom',    label: 'Custom API' },
];

export default function SmsSettingsPage() {
  const [s, setS]           = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [showKey, setShowKey] = useState(false);

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
          sms_provider:         s.sms_provider,
          sms_account_sid:      s.sms_account_sid,
          sms_auth_token:       s.sms_auth_token,
          sms_from_number:      s.sms_from_number,
          sms_wa_phone_id:      s.sms_wa_phone_id,
          sms_wa_business_id:   s.sms_wa_business_id,
          sms_wa_token:         s.sms_wa_token,
          sms_booking_template: s.sms_booking_template,
          sms_invoice_template: s.sms_invoice_template,
        }),
      });
      const data = await res.json();
      if (data.success) toast.success('SMS/WhatsApp settings saved!');
      else toast.error(data.error || 'Failed to save');
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  const provider = s.sms_provider || 'twilio';
  const isTwilio   = provider === 'twilio';
  const isWhatsApp = provider === 'whatsapp';

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
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>SMS / WhatsApp Settings</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Send booking confirmations and invoices via SMS or WhatsApp</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: 'none', borderRadius: 9, background: saving ? '#D4904E' : '#B1723C', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(177,114,60,0.25)' }}>
          <IcoSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Provider Selection */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Provider</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {PROVIDERS.map(p => (
              <label key={p.value} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10,
                border: `1.5px solid ${provider === p.value ? '#B1723C' : '#E5E7EB'}`,
                background: provider === p.value ? '#FEF3EA' : '#FAFAFA',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <input type="radio" name="sms_provider" value={p.value} checked={provider === p.value}
                  onChange={() => set('sms_provider', p.value)} style={{ accentColor: '#B1723C' }} />
                <span style={{ fontSize: 13.5, fontWeight: provider === p.value ? 600 : 400, color: provider === p.value ? '#B1723C' : '#374151' }}>{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Credentials */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>
              {isTwilio ? 'Twilio Credentials' : isWhatsApp ? 'WhatsApp Business API' : 'API Credentials'}
            </div>

            {(isTwilio || provider === 'nexmo') && (
              <>
                <Field label={isTwilio ? 'Account SID' : 'API Key'} hint={isTwilio ? 'Found in your Twilio Console dashboard' : 'From your Vonage dashboard'}>
                  <input style={inputStyle} value={s.sms_account_sid || ''} onChange={e => set('sms_account_sid', e.target.value)} placeholder={isTwilio ? 'ACxxxxxxxxxxxxxxxx' : 'API key'} />
                </Field>
                <Field label={isTwilio ? 'Auth Token' : 'API Secret'}>
                  <div style={{ position: 'relative' }}>
                    <input style={{ ...inputStyle, paddingRight: 44 }} type={showKey ? 'text' : 'password'} value={s.sms_auth_token || ''} onChange={e => set('sms_auth_token', e.target.value)} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowKey(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, fontSize: 11 }}>
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </Field>
                <Field label="Sender Number" hint="E.164 format, e.g. +923001234567">
                  <input style={inputStyle} value={s.sms_from_number || ''} onChange={e => set('sms_from_number', e.target.value)} placeholder="+923001234567" />
                </Field>
              </>
            )}

            {isWhatsApp && (
              <>
                <Field label="Phone Number ID" hint="From Meta Business Manager > WhatsApp > Phone Numbers">
                  <input style={inputStyle} value={s.sms_wa_phone_id || ''} onChange={e => set('sms_wa_phone_id', e.target.value)} placeholder="1234567890" />
                </Field>
                <Field label="WhatsApp Business Account ID">
                  <input style={inputStyle} value={s.sms_wa_business_id || ''} onChange={e => set('sms_wa_business_id', e.target.value)} placeholder="9876543210" />
                </Field>
                <Field label="Permanent Access Token" hint="Generate from Meta for Developers">
                  <div style={{ position: 'relative' }}>
                    <input style={{ ...inputStyle, paddingRight: 44 }} type={showKey ? 'text' : 'password'} value={s.sms_wa_token || ''} onChange={e => set('sms_wa_token', e.target.value)} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowKey(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, fontSize: 11 }}>
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </Field>
              </>
            )}

            {provider === 'custom' && (
              <Field label="API Endpoint URL" hint="Full URL that accepts POST requests with JSON body">
                <input style={inputStyle} value={s.sms_account_sid || ''} onChange={e => set('sms_account_sid', e.target.value)} placeholder="https://api.yourprovider.com/send" />
              </Field>
            )}
          </div>

          {/* Message Templates */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Message Templates</div>
            <div style={{ fontSize: 11.5, color: '#9CA3AF', marginBottom: 14 }}>
              Use <code style={{ background: '#F3F4F6', padding: '1px 5px', borderRadius: 3 }}>{'{{name}}'}</code>, <code style={{ background: '#F3F4F6', padding: '1px 5px', borderRadius: 3 }}>{'{{amount}}'}</code>, <code style={{ background: '#F3F4F6', padding: '1px 5px', borderRadius: 3 }}>{'{{ref}}'}</code> as placeholders.
            </div>
            <Field label="Booking Confirmation">
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                value={s.sms_booking_template || ''}
                onChange={e => set('sms_booking_template', e.target.value)}
                placeholder={'Dear {{name}}, your booking (Ref: {{ref}}) has been confirmed. Thank you for choosing Safar e Arabian!'}
              />
            </Field>
            <Field label="Invoice Notification">
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                value={s.sms_invoice_template || ''}
                onChange={e => set('sms_invoice_template', e.target.value)}
                placeholder={'Dear {{name}}, your invoice of {{amount}} (Ref: {{ref}}) is ready. Contact us for any queries.'}
              />
            </Field>
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
