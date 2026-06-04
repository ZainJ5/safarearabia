'use client';

import { useState, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const AUTH_ERRORS = {
  account_inactive: 'Your account has been deactivated. Please contact support.',
  no_user_found: 'No account found with this email address.',
  invalid_password: 'Incorrect password. Please try again.',
  CredentialsSignin: 'Invalid email or password. Please try again.',
};

function UserLoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') || '/dashboard';
  const urlError     = searchParams.get('error');
  const message      = searchParams.get('message');

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState(urlError ? (AUTH_ERRORS[urlError] || 'Invalid credentials. Please try again.') : '');
  const [loading, setLoading]           = useState(false);

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
      if (!session?.user) {
        setError('Sign-in failed. Please try again.');
        return;
      }
      const role = Number(session?.user?.role);
      if (role === 1 || role === 2) {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = callbackUrl.startsWith('/admin') ? '/dashboard' : callbackUrl;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f2ece0 0%, #e8dcc8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      fontFamily: "'Jost', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #C8844A 0%, #8B5329 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(177,114,60,0.35)',
          }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.95"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '-0.4px' }}>
            Safar e Arabian
          </h1>
          <p style={{ fontSize: 13, color: '#8B7355', margin: 0, fontWeight: 500 }}>
            Your journey starts here
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '40px 40px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(139,83,41,0.1)',
          border: '1px solid rgba(200,132,74,0.15)',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0A1628', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 13.5, color: '#6B7280', margin: '0 0 28px' }}>
            Sign in to your account to continue
          </p>

          {/* Success message from registration */}
          {message && !error && (
            <div style={{
              background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D',
              borderRadius: 10, padding: '12px 16px', marginBottom: 22,
              fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/>
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
              borderRadius: 10, padding: '12px 16px', marginBottom: 22,
              fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" required autoComplete="email"
                style={{
                  width: '100%', padding: '12px 16px',
                  border: '1.5px solid #E5E7EB', borderRadius: 10,
                  fontSize: 14, background: '#FAFAFA', color: '#111827',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#C8844A'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required autoComplete="current-password"
                  style={{
                    width: '100%', padding: '12px 44px 12px 16px',
                    border: '1.5px solid #E5E7EB', borderRadius: 10,
                    fontSize: 14, background: '#FAFAFA', color: '#111827',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#C8844A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button
                  type="button" onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9CA3AF', padding: 0, display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#D4904E' : '#B1723C',
                color: '#fff', border: 'none', borderRadius: 11,
                fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
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
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#9CA3AF', marginTop: 22, marginBottom: 0 }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#B1723C', fontWeight: 700, textDecoration: 'none' }}>
              Register now
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense>
      <UserLoginForm />
    </Suspense>
  );
}
