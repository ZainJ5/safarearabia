'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      router.push('/login?message=Registration successful. Please login.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Breadcrumb title="Register" currentPage="Register" />

      <div style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
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
                  <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 600, marginBottom: '5px' }}>Create Account</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: 0 }}>Join us for your spiritual journey</p>
                </div>

                {/* Form */}
                <div style={{ padding: '30px' }}>
                  {error && (
                    <div className="alert alert-danger" role="alert" style={{ fontSize: '14px', borderRadius: '5px' }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>First Name *</label>
                        <input type="text" name="fname" className="form-control" required placeholder="First name" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Last Name *</label>
                        <input type="text" name="lname" className="form-control" required placeholder="Last name" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Email Address *</label>
                      <input type="email" name="email" className="form-control" required placeholder="Your email" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>

                    <div className="mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Phone Number</label>
                      <input type="text" name="phone" className="form-control" placeholder="Your phone number" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>

                    <div className="mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Password *</label>
                      <input type="password" name="password" className="form-control" required minLength={6} placeholder="Create password" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>

                    <div className="mb-4">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Confirm Password *</label>
                      <input type="password" name="password_confirmation" className="form-control" required minLength={6} placeholder="Confirm password" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>

                    <button type="submit" className="primary-btn1 w-100" disabled={loading} style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                      {loading ? 'Creating Account...' : 'Register'}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: 'var(--text-color)' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary-color1)', fontWeight: 600 }}>Login here</Link>
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
