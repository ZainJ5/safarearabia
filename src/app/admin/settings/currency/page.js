'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const IcoSave = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const CURRENCIES = [
  { code: 'SAR', name: 'Saudi Riyal',         symbol: '﷼',  flag: '🇸🇦' },
  { code: 'PKR', name: 'Pakistani Rupee',      symbol: '₨',  flag: '🇵🇰' },
  { code: 'USD', name: 'US Dollar',            symbol: '$',  flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',                 symbol: '€',  flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',        symbol: '£',  flag: '🇬🇧' },
  { code: 'AED', name: 'UAE Dirham',           symbol: 'د.إ',flag: '🇦🇪' },
  { code: 'EGP', name: 'Egyptian Pound',       symbol: 'E£', flag: '🇪🇬' },
  { code: 'BDT', name: 'Bangladeshi Taka',     symbol: '৳',  flag: '🇧🇩' },
  { code: 'INR', name: 'Indian Rupee',         symbol: '₹',  flag: '🇮🇳' },
  { code: 'TRY', name: 'Turkish Lira',         symbol: '₺',  flag: '🇹🇷' },
  { code: 'MYR', name: 'Malaysian Ringgit',    symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah',    symbol: 'Rp', flag: '🇮🇩' },
];

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8,
  fontSize: 13.5, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#111827',
  boxSizing: 'border-box',
};

export default function CurrencySettingsPage() {
  const [s, setS]           = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [enabled, setEnabled] = useState(['SAR', 'PKR']);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setS(d.data || {});
          if (d.data?.enabled_currencies) {
            try { setEnabled(JSON.parse(d.data.enabled_currencies)); } catch { /**/ }
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setS(prev => ({ ...prev, [key]: val }));

  const toggleCurrency = (code) => {
    setEnabled(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          default_currency:    s.default_currency || 'SAR',
          currency_position:   s.currency_position || 'before',
          currency_separator:  s.currency_separator || ',',
          currency_decimal:    s.currency_decimal || '.',
          currency_decimals:   s.currency_decimals || '2',
          enabled_currencies:  JSON.stringify(enabled),
          sar_to_pkr_rate:     s.sar_to_pkr_rate,
          sar_to_usd_rate:     s.sar_to_usd_rate,
        }),
      });
      const data = await res.json();
      if (data.success) toast.success('Currency settings saved!');
      else toast.error(data.error || 'Failed to save');
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  const defaultCur = CURRENCIES.find(c => c.code === (s.default_currency || 'SAR'));

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
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Currency Settings</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Configure default currency and display format</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: 'none', borderRadius: 9, background: saving ? '#D4904E' : '#B1723C', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(177,114,60,0.25)' }}>
          <IcoSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Default Currency */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Default Currency</div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Primary Currency</label>
              <select style={inputStyle} value={s.default_currency || 'SAR'} onChange={e => set('default_currency', e.target.value)}>
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            {defaultCur && (
              <div style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #ECEEF2', marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 6 }}>PREVIEW</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>
                  {(s.currency_position || 'before') === 'before'
                    ? `${defaultCur.symbol} 1${s.currency_separator || ','}250${s.currency_decimal || '.'}00`
                    : `1${s.currency_separator || ','}250${s.currency_decimal || '.'}00 ${defaultCur.symbol}`}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{defaultCur.name}</div>
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Symbol Position</label>
              <select style={inputStyle} value={s.currency_position || 'before'} onChange={e => set('currency_position', e.target.value)}>
                <option value="before">Before amount ($ 1,250.00)</option>
                <option value="after">After amount (1,250.00 $)</option>
              </select>
            </div>
          </div>

          {/* Format & Rates */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 20 }}>Format & Exchange Rates</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Thousands Separator</label>
                <select style={inputStyle} value={s.currency_separator || ','} onChange={e => set('currency_separator', e.target.value)}>
                  <option value=",">, (comma)</option>
                  <option value=".">. (period)</option>
                  <option value=" ">  (space)</option>
                  <option value="">None</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Decimal Separator</label>
                <select style={inputStyle} value={s.currency_decimal || '.'} onChange={e => set('currency_decimal', e.target.value)}>
                  <option value=".">. (period)</option>
                  <option value=",">, (comma)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Decimal Places</label>
              <select style={inputStyle} value={s.currency_decimals || '2'} onChange={e => set('currency_decimals', e.target.value)}>
                <option value="0">0 (e.g. 1,250)</option>
                <option value="2">2 (e.g. 1,250.00)</option>
                <option value="3">3 (e.g. 1,250.000)</option>
              </select>
            </div>

            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, margin: '20px 0 14px' }}>Exchange Rates (1 SAR equals)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>SAR → PKR rate</label>
                <input
                  style={inputStyle}
                  type="number"
                  step="0.0001"
                  min="0"
                  value={s.sar_to_pkr_rate ?? ''}
                  onChange={e => set('sar_to_pkr_rate', e.target.value)}
                  placeholder="75.50"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>SAR → USD rate</label>
                <input
                  style={inputStyle}
                  type="number"
                  step="0.0001"
                  min="0"
                  value={s.sar_to_usd_rate ?? ''}
                  onChange={e => set('sar_to_usd_rate', e.target.value)}
                  placeholder="0.267"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enabled Currencies */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8 }}>Supported Currencies</div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{enabled.length} selected</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {CURRENCIES.map(c => {
              const on = enabled.includes(c.code);
              return (
                <label key={c.code} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 9,
                  border: `1.5px solid ${on ? '#B1723C' : '#E5E7EB'}`,
                  background: on ? '#FEF3EA' : '#FAFAFA',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <input type="checkbox" checked={on} onChange={() => toggleCurrency(c.code)} style={{ accentColor: '#B1723C' }} />
                  <span style={{ fontSize: 15 }}>{c.flag}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: on ? '#B1723C' : '#374151' }}>{c.code}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{c.symbol} {c.name}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
