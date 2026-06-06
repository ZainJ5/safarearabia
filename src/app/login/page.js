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

function LoginForm() {
  const searchParams  = useSearchParams();
  const callbackUrl   = searchParams.get('callbackUrl') || '/dashboard';
  const urlError      = searchParams.get('error');

  const AUTH_ERRORS = {
    account_inactive: 'Your account has been deactivated. Please contact support.',
    no_user_found: 'No account found with this email address.',
    invalid_password: 'Incorrect password. Please try again.',
    CredentialsSignin: 'Invalid email or password. Please try again.',
  };

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState(urlError ? (AUTH_ERRORS[urlError] || 'Invalid credentials. Please try again.') : '');
  const [loading, setLoading]           = useState(false);
  const [focusField, setFocusField]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error || !result?.ok) {
        setError(AUTH_ERRORS[result?.error] || 'Invalid email or password. Please try again.');
        return;
      }
      const session = await getSession();
      if (!session?.user) { setError('Sign-in failed. Please try again.'); return; }
      const role = Number(session?.user?.role);
      // Normalise callbackUrl — strip host if it's a full URL so startsWith('/admin') works
      let safeCb = callbackUrl;
      try { safeCb = new URL(callbackUrl).pathname; } catch { /* already a path */ }
      let dest;
      if (role === 1 || role === 4) {
        // Admins and employees use the management portal
        dest = safeCb.startsWith('/admin') ? safeCb : '/admin/dashboard';
      } else {
        dest = safeCb.startsWith('/admin') ? '/dashboard' : safeCb;
      }
      window.location.href = dest;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F7FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Jost', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: 'clamp(28px, 5vw, 44px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
          border: '1px solid #ECEEF2',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #C8844A 0%, #8B5329 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(177,114,60,0.35)', flexShrink: 0,
            }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.95"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1628', lineHeight: 1.2 }}>Safar e Arabian</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#B1723C', textTransform: 'uppercase', letterSpacing: 1.2 }}>Management Portal</div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0A1628', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
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
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focusField === 'email' ? '#B1723C' : '#9CA3AF', pointerEvents: 'none' }}>
                  <IcoMail />
                </div>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@safararabian.com" required autoComplete="email"
                  onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)}
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
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focusField === 'password' ? '#B1723C' : '#9CA3AF', pointerEvents: 'none' }}>
                  <IcoLock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required autoComplete="current-password"
                  onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)}
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
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}
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
                transition: 'background 0.15s',
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
                <>Login <IcoArrow /></>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{ color: '#9CA3AF' }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 12, color: '#9CA3AF', letterSpacing: 0.2 }}>Secured by SSL encryption</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
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
