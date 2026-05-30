'use client';
import { useState } from 'react';

const iS = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  fontSize: 14,
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export default function VisaApplyForm({ visaId, visaTitle, visaSlug, cost }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', nationality: '',
    passport_number: '', travel_date: '', message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/visas/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visa_id: visaId,
          visa_title: visaTitle,
          visa_slug: visaSlug,
          ...form,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', nationality: '', passport_number: '', travel_date: '', message: '' });
      } else {
        setErrorMsg(d.error || 'Failed to submit. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.12)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', padding: '22px 24px' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Starting From
        </div>
        {cost ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>SAR {cost}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>/ person</span>
          </div>
        ) : (
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Contact for Price</div>
        )}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: 600 }}>
          {visaTitle}
        </div>
      </div>

      {/* Form body */}
      <div style={{ background: '#fff', padding: '22px 24px' }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-check-circle-fill" style={{ fontSize: 32, color: '#2e7d32' }}></i>
            </div>
            <h5 style={{ color: '#2e7d32', fontWeight: 700, marginBottom: 8 }}>Application Submitted!</h5>
            <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>
              We&apos;ve received your application for <strong>{visaTitle}</strong>. Our team will contact you within 24–48 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              style={{ padding: '10px 24px', background: '#B1723C', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
            >
              Apply Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 16 }}>Apply for this Visa</div>

            {errorMsg && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 14 }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                required
                type="text"
                placeholder="Full Name *"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                style={iS}
              />
              <input
                required
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                style={iS}
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                style={iS}
              />
              <input
                type="text"
                placeholder="Nationality"
                value={form.nationality}
                onChange={e => set('nationality', e.target.value)}
                style={iS}
              />
              <input
                type="text"
                placeholder="Passport Number"
                value={form.passport_number}
                onChange={e => set('passport_number', e.target.value)}
                style={iS}
              />
              <div>
                <label style={{ fontSize: 11, color: '#888', fontWeight: 600, display: 'block', marginBottom: 4 }}>Travel Date</label>
                <input
                  type="date"
                  value={form.travel_date}
                  onChange={e => set('travel_date', e.target.value)}
                  style={iS}
                />
              </div>
              <textarea
                placeholder="Additional message (optional)"
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={3}
                style={{ ...iS, resize: 'vertical' }}
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '13px',
                  background: status === 'submitting' ? '#ccc' : 'linear-gradient(135deg, #B1723C, #6D4100)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
