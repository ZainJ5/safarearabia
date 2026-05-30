'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '6px',
  border: '1px solid #e0ddd5',
  background: '#fff',
  fontSize: '14px',
  outline: 'none',
  color: '#333',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#333',
  display: 'block',
  marginBottom: '6px',
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fd   = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    if (data.password !== data.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res    = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Something went wrong');
      router.push('/login?message=Registration successful. Please login.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f2ece0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 16px' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: '#f5f0e4', borderRadius: '12px', padding: '40px 36px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>

        <h2 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 700, fontSize: '26px', color: '#111', marginBottom: '28px' }}>
          Customer Register
        </h2>

        {error && (
          <div style={{ background: '#fff0f0', color: '#c0392b', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', marginBottom: '18px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* First + Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>
                First Name <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input type="text" name="fname" required placeholder="First Name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>
                Last Name <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input type="text" name="lname" required placeholder="Last Name" style={inputStyle} />
            </div>
          </div>

          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Username <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input type="text" name="username" required placeholder="Username" style={inputStyle} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Enter Your Email <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input type="email" name="email" required placeholder="Enter Your Email" style={inputStyle} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Password <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} name="password" required minLength={6} placeholder="Enter Password..." style={{ ...inputStyle, paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, fontSize: '16px' }}>
                {showPw
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Confirm Password <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input type={showCpw ? 'text' : 'password'} name="password_confirmation" required minLength={6} placeholder="Confirm Password" style={{ ...inputStyle, paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowCpw(!showCpw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, fontSize: '16px' }}>
                {showCpw
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <input type="checkbox" name="terms" required id="terms" style={{ width: '16px', height: '16px', accentColor: '#b07542', cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="terms" style={{ fontSize: '14px', color: '#555', cursor: 'pointer', margin: 0 }}>
              I agree to the{' '}
              <Link href="/terms-conditions" style={{ color: '#b07542', textDecoration: 'none', fontWeight: 600 }}>Terms &amp; Policy</Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '180px', padding: '14px 20px', borderRadius: '8px', background: '#b07542', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1 }}
          >
            {loading ? 'Registering…' : 'Register Now'}
          </button>
        </form>

        <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#b07542', fontWeight: 600, textDecoration: 'none' }}>Login Here</Link>
        </p>
      </div>
    </div>
  );
}
