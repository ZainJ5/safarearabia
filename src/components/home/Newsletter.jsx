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
    /* Transparent section — sits above footer so the card can overlap down into it */
    <section style={{ position: 'relative', zIndex: 10, padding: '40px 0 0', background: 'transparent' }}>
      <div className="container">
        {/* Card overlaps into footer via negative margin-bottom */}
        <div style={{
          position: 'relative',
          background: '#f2ece0',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '-100px',
          padding: '44px 0',
          textAlign: 'center',
        }}>

          {/* Left tropical leaf */}
          <img
            src="/frontend/img/home1/banner3-vector1.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: 'auto',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />

          {/* Right tropical leaf */}
          <img
            src="/frontend/img/home1/banner3-vector2.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: 'auto',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '0 120px' }}>
            <h2 style={{
              fontFamily: 'Rubik, var(--font-rubik), sans-serif',
              fontWeight: 700,
              fontSize: '42px',
              color: '#111111',
              marginBottom: '8px',
              lineHeight: 1.2,
            }}>
              Join The Newsletter
            </h2>
            <p style={{
              fontFamily: 'Rubik, var(--font-rubik), sans-serif',
              color: '#555',
              fontSize: '15px',
              marginBottom: '30px',
              fontWeight: 400,
            }}>
              To receive our best monthly deals
            </p>

            <form
              onSubmit={handleSubscribe}
              style={{
                display: 'flex',
                maxWidth: '480px',
                margin: '0 auto',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1.5px solid #c8974a',
                background: '#fff',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email..."
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '14px 20px',
                  fontSize: '14px',
                  background: 'transparent',
                  color: '#444',
                  fontFamily: 'Rubik, sans-serif',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#b07542',
                  border: 'none',
                  padding: '14px 22px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  opacity: loading ? 0.7 : 1,
                  transition: 'background 0.2s',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 17 14" fill="none">
                  <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
