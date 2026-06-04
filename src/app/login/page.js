'use client';

import { useState, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const IcoMail = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoLock = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoEyeOpen = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const IcoEyeClosed = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoAlert = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Real-time Analytics',
    desc: 'Monitor bookings, revenue, and operations from a unified dashboard.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M9 12h6m-6 4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
    ),
    title: 'Invoice Management',
    desc: 'Generate hotel and transport invoices with one-click PDF export.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Secure & Role-based',
    desc: 'Granular access control for admins and agents separately.',
  },
];

function LoginForm() {
  const searchParams  = useSearchParams();
  const callbackUrl   = searchParams.get('callbackUrl') || '/dashboard';
  const urlError      = searchParams.get('error');

  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const AUTH_ERRORS = {
    account_inactive: 'Your account has been deactivated. Please contact support.',
    no_user_found: 'No account found with this email address.',
    invalid_password: 'Incorrect password. Please try again.',
    CredentialsSignin: 'Invalid email or password. Please try again.',
  };
  const [error, setError]                 = useState(urlError ? (AUTH_ERRORS[urlError] || 'Invalid credentials. Please try again.') : '');
  const [loading, setLoading]             = useState(false);
  const [focusField, setFocusField]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error || !result?.ok) {
        const AUTH_ERRORS = {
          account_inactive: 'Your account has been deactivated. Please contact support.',
          no_user_found: 'No account found with this email address.',
          invalid_password: 'Incorrect password. Please try again.',
          CredentialsSignin: 'Invalid email or password. Please try again.',
        };
        setError(AUTH_ERRORS[result?.error] || 'Invalid email or password. Please try again.');
        return;
      }
      const session = await getSession();
      if (!session?.user) {
        setError('Sign-in failed. Please try again.');
        return;
      }
      const role = Number(session?.user?.role);
      const isStaff = role === 1 || role === 2;
      const dest = isStaff
        ? (callbackUrl.startsWith('/admin') ? callbackUrl : '/admin/dashboard')
        : (callbackUrl.startsWith('/admin') ? '/dashboard' : callbackUrl);
      window.location.href = dest;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-grid" style={{ fontFamily: "'Jost', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ── Left panel ── */}
      <div className="login-left">
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(177,114,60,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -60, width: 420, height: 420, borderRadius: '50%', background: 'rgba(177,114,60,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: 1, height: 200, background: 'linear-gradient(to bottom, transparent, rgba(177,114,60,0.2), transparent)', pointerEvents: 'none' }} />

        {/* Main content — vertically centred */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 44 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: 'linear-gradient(135deg, #C8844A 0%, #8B5329 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(177,114,60,0.4)', flexShrink: 0,
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.95"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 18, lineHeight: 1.2, letterSpacing: '-0.3px' }}>Safar e Arabian</div>
              <div style={{ color: 'rgba(200,132,74,0.9)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 1 }}>Management Portal</div>
            </div>
          </div>

          {/* Status pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22, background: 'rgba(177,114,60,0.12)', border: '1px solid rgba(177,114,60,0.2)', borderRadius: 20, padding: '6px 14px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500 }}>System Online</span>
          </div>

          <h1 style={{ color: '#F9FAFB', fontSize: 38, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.8px', lineHeight: 1.15 }}>
            Enterprise<br />
            <span style={{ color: '#C8844A' }}>Travel Management</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 15, lineHeight: 1.7, margin: '0 0 40px', maxWidth: 360 }}>
            A complete platform for managing tours, hotels, visas, and transport — all in one place.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(177,114,60,0.12)', border: '1px solid rgba(177,114,60,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#C8844A' }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ color: '#F0F2F5', fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>{f.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div style={{ marginTop: 48, fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.3 }}>
            &copy; {new Date().getFullYear()} Safar e Arabian. All rights reserved.
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="login-right">
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Card */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '44px 44px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
            border: '1px solid #ECEEF2',
          }}>
            {/* Header */}
            <div style={{ marginBottom: 34 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0A1628', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Sign in to access your management portal
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
                borderRadius: 10, padding: '12px 16px', marginBottom: 22,
                fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 10,
                animation: 'fadeIn 0.2s ease',
              }}>
                <span style={{ flexShrink: 0 }}><IcoAlert /></span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 8, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focusField === 'email' ? '#B1723C' : '#9CA3AF', transition: 'color 0.15s', pointerEvents: 'none' }}>
                    <IcoMail />
                  </div>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@safararabian.com" required autoComplete="email"
                    onFocus={() => setFocusField('email')}
                    onBlur={() => setFocusField(null)}
                    style={{
                      width: '100%', padding: '12px 14px 12px 42px',
                      border: `1.5px solid ${focusField === 'email' ? '#B1723C' : '#E5E7EB'}`,
                      borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                      background: '#FAFAFA', color: '#111827', outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: focusField === 'email' ? '0 0 0 3px rgba(177,114,60,0.1)' : 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 8, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focusField === 'password' ? '#B1723C' : '#9CA3AF', transition: 'color 0.15s', pointerEvents: 'none' }}>
                    <IcoLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password" required autoComplete="current-password"
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                    style={{
                      width: '100%', padding: '12px 44px 12px 42px',
                      border: `1.5px solid ${focusField === 'password' ? '#B1723C' : '#E5E7EB'}`,
                      borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                      background: '#FAFAFA', color: '#111827', outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: focusField === 'password' ? '0 0 0 3px rgba(177,114,60,0.1)' : 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9CA3AF', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#B1723C'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                  >
                    {showPassword ? <IcoEyeClosed /> : <IcoEyeOpen />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px', marginTop: 26,
                  background: loading ? '#D4904E' : '#B1723C',
                  color: '#fff', border: 'none', borderRadius: 11,
                  fontSize: 14.5, fontWeight: 700, fontFamily: 'inherit',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(177,114,60,0.3)',
                  transition: 'all 0.15s',
                  letterSpacing: '-0.1px',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#9B6234'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#B1723C'; }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login <IcoArrow />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p style={{ textAlign: 'center', fontSize: 13.5, color: '#9CA3AF', marginTop: 24, marginBottom: 0 }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: '#B1723C', fontWeight: 700, textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
          </div>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 22 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{ color: '#9CA3AF' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 12, color: '#9CA3AF', letterSpacing: 0.2 }}>Secured by SSL encryption</span>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
        .login-left { background: linear-gradient(160deg, #07111F 0%, #0D1F38 50%, #112244 100%); display: flex; flex-direction: column; justify-content: center; gap: 48px; padding: 52px 64px; position: relative; overflow: hidden; }
        .login-right { background: #F5F7FA; display: flex; align-items: center; justify-content: center; padding: 40px 32px; }
        @media (max-width: 860px) {
          .login-grid { grid-template-columns: 1fr; }
          .login-left { display: none; }
          .login-right { min-height: 100vh; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
