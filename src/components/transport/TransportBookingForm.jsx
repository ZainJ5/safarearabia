'use client';
import { useState } from 'react';

const inp = {
  width: '100%',
  padding: '10px 13px',
  border: '1px solid #e2e2e2',
  borderRadius: 7,
  fontSize: 14,
  outline: 'none',
  background: '#fafafa',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  color: '#333',
};

export default function TransportBookingForm({ transportId, transportTitle, transportSlug, lowestPrice, pricingTypes }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', passengers: '',
    travel_date: '', vehicle_type: pricingTypes?.[0]?.label || '', message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg('Full name and email are required.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/transports/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transport_id: transportId,
          transport_title: transportTitle,
          transport_slug: transportSlug,
          ...form,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', passengers: '', travel_date: '', vehicle_type: pricingTypes?.[0]?.label || '', message: '' });
      } else {
        setErrorMsg(d.error || 'Failed to submit. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 6px 32px rgba(0,0,0,0.11)' }}>
      {/* Gradient header */}
      <div style={{ background: 'linear-gradient(135deg, #B1723C 0%, #6D4100 100%)', padding: '22px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>
          Starting From
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>SAR</span>
          <span style={{ color: '#fff', fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
            {lowestPrice || '—'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>/ trip</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: 12 }}>Reserve your transport today</p>
      </div>

      {/* Form body */}
      <div style={{ padding: '20px 22px' }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <i className="bi bi-check-circle-fill" style={{ fontSize: 30, color: '#2e7d32' }}></i>
            </div>
            <h5 style={{ color: '#2e7d32', fontWeight: 700, marginBottom: 8, fontSize: 16 }}>Inquiry Sent!</h5>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
              We&apos;ve received your inquiry for <strong>{transportTitle}</strong>. Our team will contact you within 24 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              style={{ padding: '9px 22px', background: '#B1723C', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit' }}
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
              Booking Inquiry
            </p>

            {errorMsg && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '9px 13px', borderRadius: 6, fontSize: 13, marginBottom: 12 }}>
                {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: 11 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>Full Name *</label>
              <input required type="text" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} style={inp} />
            </div>

            <div style={{ marginBottom: 11 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>Email Address *</label>
              <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={inp} />
            </div>

            <div style={{ marginBottom: 11 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>Phone / WhatsApp</label>
              <input type="tel" placeholder="+966 5X XXX XXXX" value={form.phone} onChange={e => set('phone', e.target.value)} style={inp} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 11 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>Travel Date</label>
                <input type="date" value={form.travel_date} onChange={e => set('travel_date', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>Passengers</label>
                <input type="number" min="1" placeholder="1" value={form.passengers} onChange={e => set('passengers', e.target.value)} style={inp} />
              </div>
            </div>

            {pricingTypes && pricingTypes.length > 1 && (
              <div style={{ marginBottom: 11 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>Vehicle Type</label>
                <select value={form.vehicle_type} onChange={e => set('vehicle_type', e.target.value)} style={inp}>
                  {pricingTypes.map(p => (
                    <option key={p.label} value={p.label}>{p.label}{p.sub ? ` — ${p.sub}` : ''}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>Message / Special Requirements</label>
              <textarea
                rows={3}
                placeholder="Any special requirements or questions?"
                value={form.message}
                onChange={e => set('message', e.target.value)}
                style={{ ...inp, resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                width: '100%',
                padding: '13px',
                background: status === 'submitting' ? '#ccc' : 'linear-gradient(135deg, #B1723C, #6D4100)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                letterSpacing: 0.3,
                fontFamily: 'inherit',
              }}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
