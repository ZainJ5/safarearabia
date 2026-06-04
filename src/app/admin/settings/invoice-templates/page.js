'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const IcoSave = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Clean professional layout with a top header block',
    preview: { header: '#0A1628', accent: '#B1723C' },
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Bold accent stripe with side-by-side info columns',
    preview: { header: '#1E293B', accent: '#3B82F6' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Light, border-only design — no heavy backgrounds',
    preview: { header: '#F8FAFC', accent: '#374151' },
  },
  {
    id: 'arabic',
    name: 'Arabic RTL',
    desc: 'Right-to-left layout with Arabic typography support',
    preview: { header: '#0A1628', accent: '#C8844A' },
  },
];

const LOGO_POSITIONS = [
  { value: 'left',   label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right',  label: 'Right' },
];

function TemplateCard({ tpl, selected, onSelect }) {
  const { header, accent } = tpl.preview;
  const isLight = header === '#F8FAFC';
  return (
    <div onClick={() => onSelect(tpl.id)} style={{
      borderRadius: 12, border: `2px solid ${selected ? '#B1723C' : '#E5E7EB'}`,
      overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s',
      boxShadow: selected ? '0 0 0 3px rgba(177,114,60,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      {/* Mini preview */}
      <div style={{ height: 120, background: isLight ? '#F8FAFC' : '#F1F5F9', padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 28, borderRadius: 4, background: header, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6 }}>
          <div style={{ width: 16, height: 10, borderRadius: 2, background: accent, opacity: 0.9 }} />
          <div style={{ flex: 1, height: 5, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
          <div style={{ width: 30, height: 5, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[0.7, 0.5, 0.5, 0.5].map((w, i) => (
              <div key={i} style={{ height: 4, borderRadius: 2, background: '#D1D5DB', width: `${w * 100}%` }} />
            ))}
          </div>
          <div style={{ width: 56, background: '#fff', borderRadius: 4, border: `1px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: accent, textAlign: 'center', lineHeight: 1.2 }}>
              INVOICE<br />#0001
            </div>
          </div>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: accent, opacity: 0.6 }} />
      </div>
      {/* Info */}
      <div style={{ padding: '10px 12px', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="radio" readOnly checked={selected} style={{ accentColor: '#B1723C' }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{tpl.name}</div>
          <div style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1 }}>{tpl.desc}</div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8,
  fontSize: 13.5, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#111827',
  boxSizing: 'border-box',
};

export default function InvoiceTemplatesPage() {
  const [s, setS]           = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

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
          invoice_template:       s.invoice_template,
          invoice_logo_position:  s.invoice_logo_position,
          invoice_accent_color:   s.invoice_accent_color,
          invoice_footer_text:    s.invoice_footer_text,
          invoice_terms:          s.invoice_terms,
          invoice_show_stamp:     s.invoice_show_stamp,
          invoice_show_sign:      s.invoice_show_sign,
          invoice_prefix:         s.invoice_prefix,
          invoice_next_number:    s.invoice_next_number,
        }),
      });
      const data = await res.json();
      if (data.success) toast.success('Invoice template settings saved!');
      else toast.error(data.error || 'Failed to save');
    } catch (err) { toast.error(err.message); }
    setSaving(false);
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
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Invoice Templates</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Customise the look and content of your printed invoices</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: 'none', borderRadius: 9, background: saving ? '#D4904E' : '#B1723C', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(177,114,60,0.25)' }}>
          <IcoSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Template picker */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Layout Template</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {TEMPLATES.map(tpl => (
              <TemplateCard
                key={tpl.id}
                tpl={tpl}
                selected={(s.invoice_template || 'classic') === tpl.id}
                onSelect={v => set('invoice_template', v)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Branding */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Branding</div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Logo Position</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {LOGO_POSITIONS.map(p => (
                  <label key={p.value} style={{
                    flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${(s.invoice_logo_position || 'left') === p.value ? '#B1723C' : '#E5E7EB'}`,
                    background: (s.invoice_logo_position || 'left') === p.value ? '#FEF3EA' : '#FAFAFA',
                    fontSize: 13, fontWeight: 500,
                    color: (s.invoice_logo_position || 'left') === p.value ? '#B1723C' : '#374151',
                  }}>
                    <input type="radio" style={{ display: 'none' }} name="logo_pos" value={p.value} checked={(s.invoice_logo_position || 'left') === p.value} onChange={() => set('invoice_logo_position', p.value)} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Accent Colour</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="color" value={s.invoice_accent_color || '#B1723C'} onChange={e => set('invoice_accent_color', e.target.value)}
                  style={{ width: 44, height: 40, padding: 2, border: '1.5px solid #E5E7EB', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
                <input style={{ ...inputStyle, flex: 1 }} value={s.invoice_accent_color || '#B1723C'} onChange={e => set('invoice_accent_color', e.target.value)} placeholder="#B1723C" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['invoice_show_stamp', 'Show company stamp on invoice'], ['invoice_show_sign', 'Show authorised signature line']].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={s[key] === '1'} onChange={e => set(key, e.target.checked ? '1' : '0')} style={{ width: 16, height: 16, accentColor: '#B1723C' }} />
                  <span style={{ fontSize: 13.5, color: '#374151' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Numbering & Content */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Numbering & Content</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Invoice Prefix</label>
                <input style={inputStyle} value={s.invoice_prefix || ''} onChange={e => set('invoice_prefix', e.target.value)} placeholder="INV-" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Next Invoice #</label>
                <input style={inputStyle} type="number" min="1" value={s.invoice_next_number || ''} onChange={e => set('invoice_next_number', e.target.value)} placeholder="1001" />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Footer Text</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                value={s.invoice_footer_text || ''}
                onChange={e => set('invoice_footer_text', e.target.value)}
                placeholder="Thank you for your business. For queries, contact info@safarearabian.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Terms & Conditions</label>
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                value={s.invoice_terms || ''}
                onChange={e => set('invoice_terms', e.target.value)}
                placeholder="Payment is due within 7 days of the invoice date. All prices are inclusive of applicable taxes."
              />
            </div>
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
