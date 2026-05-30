'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success('You have successfully subscribed!');
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{
      background: `linear-gradient(135deg, rgba(177,114,60,0.95) 0%, rgba(109,65,0,0.95) 100%), url(/uploads/sliders/egens-S8KiKhpF01.webp) center/cover no-repeat`,
      padding: '80px 0',
    }}>
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-7 col-md-10 text-center">
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{
                color: '#fff',
                fontSize: '42px',
                fontWeight: 700,
                marginBottom: '10px',
                fontFamily: 'var(--font-rubik, Rubik, sans-serif)',
              }}>
                Join The Newsletter
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: 0 }}>
                To receive our best monthly deals
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              style={{
                display: 'flex',
                gap: '0',
                maxWidth: '520px',
                margin: '0 auto',
                borderRadius: '5px',
                overflow: 'hidden',
                boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '18px 22px',
                  fontSize: '15px',
                  background: '#fff',
                  color: 'var(--title-color, #100C08)',
                  fontFamily: 'var(--font-jost, Jost, sans-serif)',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="primary-btn1"
                style={{
                  borderRadius: '0',
                  padding: '18px 28px',
                  whiteSpace: 'nowrap',
                  fontSize: '15px',
                  fontWeight: 600,
                  flexShrink: 0,
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? 'Subscribing...' : (
                  <>
                    Subscribe
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none" style={{ marginLeft: '8px' }}>
                      <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
