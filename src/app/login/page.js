'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginModal() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState(urlError ? 'Invalid credentials. Please try again.' : '');
  const [loading, setLoading]       = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.ok) {
        const session = await getSession();
        const dest = Number(session?.user?.role) === 1
          ? (callbackUrl.startsWith('/admin') ? callbackUrl : '/admin/dashboard')
          : (callbackUrl.startsWith('/admin') ? '/dashboard' : callbackUrl);
        // Hard redirect so the server reads the fresh session cookie correctly
        window.location.href = dest;
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: '#fff', borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        animation: 'modalIn 0.25s ease',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-color1, #B1723C), var(--primary-color2, #6D4100))',
          padding: '32px 32px 28px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🕌</div>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 6px' }}>
            Welcome Back
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 32px 32px' }}>
          {error && (
            <div style={{
              background: '#fff0f0', color: '#c0392b', borderRadius: '8px',
              padding: '12px 16px', fontSize: '13px', marginBottom: '16px', textAlign: 'center',
              border: '1px solid #ffd6d6',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#444' }}>
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" required
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: '8px',
                  border: '1.5px solid #e5e5e5', background: '#f8fafc',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary-color1, #B1723C)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e5e5'; }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#444' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required
                  style={{
                    width: '100%', padding: '13px 46px 13px 16px', borderRadius: '8px',
                    border: '1.5px solid #e5e5e5', background: '#f8fafc',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary-color1, #B1723C)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e5e5'; }}
                />
                <button
                  type="button" onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#999',
                    fontSize: '16px', padding: 0, lineHeight: 1,
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px', borderRadius: '50px',
                background: 'var(--primary-color1, #B1723C)', color: '#fff',
                border: 'none', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1, marginBottom: '16px',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Link href="/forgot-password" style={{ color: 'var(--primary-color1, #B1723C)', fontSize: '13px', textDecoration: 'none' }}>
              Forgot your password?
            </Link>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--primary-color1, #B1723C)', fontWeight: 700, textDecoration: 'none' }}>
              Register Here
            </Link>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
            <span style={{ color: '#bbb', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
          </div>

          <button
            type="button" onClick={handleGoogle}
            style={{
              width: '100%', padding: '13px 16px', borderRadius: '50px',
              background: '#fff', border: '1.5px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', color: '#333', transition: 'border-color 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#bbb'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e0e0e0'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginModal />
    </Suspense>
  );
}
