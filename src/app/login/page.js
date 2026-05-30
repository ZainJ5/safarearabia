import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Login | Safar E Arabia',
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  async function handleLogin(formData) {
    'use server';
    const email = formData.get('email');
    const password = formData.get('password');
    const redirectTo = params?.callbackUrl || '/dashboard';

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo,
      });
    } catch (error) {
      if (error.type === 'CredentialsSignin') {
        redirect('/login?error=Invalid+credentials');
      }
      throw error;
    }
  }

  async function handleGoogleLogin() {
    'use server';
    const redirectTo = params?.callbackUrl || '/dashboard';
    await signIn('google', { redirectTo });
  }

  return (
    <>
      <Breadcrumb title="Login" currentPage="Login" />

      <div style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div style={{
                background: '#fff',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              }}>
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary-color1), var(--primary-color2))',
                  padding: '30px',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 600, marginBottom: '5px' }}>Welcome Back</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: 0 }}>Sign in to your account</p>
                </div>

                {/* Form */}
                <div style={{ padding: '30px' }}>
                  {error && (
                    <div className="alert alert-danger" role="alert" style={{ fontSize: '14px', borderRadius: '5px' }}>
                      {error}
                    </div>
                  )}

                  <form action={handleLogin}>
                    <div className="mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Email Address</label>
                      <input type="email" name="email" className="form-control" required placeholder="Enter your email" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <div className="mb-4">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Password</label>
                      <input type="password" name="password" className="form-control" required placeholder="Enter your password" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <button type="submit" className="primary-btn1 w-100" style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                      Login
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--text-color)', fontSize: '14px' }}>
                    — OR —
                  </div>

                  <form action={handleGoogleLogin}>
                    <button type="submit" style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '5px',
                      border: '1px solid #e0e0e0',
                      background: '#fff',
                      color: 'var(--title-color)',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: '0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                    <Link href="/forgot-password" style={{ color: 'var(--primary-color1)', textDecoration: 'underline' }}>
                      Forgot Password?
                    </Link>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: 'var(--text-color)' }}>
                    Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--primary-color1)', fontWeight: 600 }}>Register here</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
