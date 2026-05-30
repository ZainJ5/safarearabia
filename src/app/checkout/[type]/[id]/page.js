'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export default function CheckoutPage({ params }) {
  const { type, id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    check_in: '',
    check_out: '',
    adults: 1,
    children: 0,
    special_requests: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?redirect=/checkout/${type}/${id}`);
      return;
    }
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        first_name: session.user.name?.split(' ')[0] || '',
        last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
      }));
    }
  }, [session, status]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiMap = {
          tour: `/api/tours/${id}`,
          hotel: `/api/hotels/${id}`,
          transport: `/api/transports/${id}`,
          activity: `/api/activities/${id}`,
          visa: `/api/visas/${id}`,
        };
        const endpoint = apiMap[type];
        if (!endpoint) return;

        const res = await fetch(endpoint);
        const data = await res.json();
        if (data.success) setProduct(data.data);
      } catch (e) {
        console.error('Failed to fetch product:', e);
      } finally {
        setLoading(false);
      }
    }
    if (id && type) fetchProduct();
  }, [id, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getBasePrice = () => {
    if (!product) return 0;
    return parseFloat(product.price || product.adult_price || 0);
  };

  const getChildPrice = () => {
    if (!product) return 0;
    return parseFloat(product.child_price || getBasePrice() * 0.7);
  };

  const getSubtotal = () => {
    return getBasePrice() * parseInt(form.adults) + getChildPrice() * parseInt(form.children);
  };

  const getServiceFee = () => Math.round(getSubtotal() * 0.05 * 100) / 100;
  const getTotal = () => Math.round((getSubtotal() + getServiceFee()) * 100) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_type: type,
          product_id: id,
          payment_method: paymentMethod,
          adults: form.adults,
          children: form.children,
          check_in: form.check_in,
          check_out: form.check_out,
          customer_info: {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            country: form.country,
          },
          special_requests: form.special_requests,
          subtotal: getSubtotal(),
          service_fee: getServiceFee(),
          total: getTotal(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/bookings?success=1&order=${data.order_id}`);
      } else {
        alert(data.error || 'Booking failed. Please try again.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border" style={{ color: 'var(--primary-color1)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const typeLabel = type?.charAt(0).toUpperCase() + type?.slice(1);

  return (
    <>
      <Breadcrumb title="Checkout" subtitle={`Book Your ${typeLabel}`} />

      <section className="checkout-area pt-100 pb-100">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left: Customer Info */}
              <div className="col-lg-8">
                {/* Personal Information */}
                <div className="checkout-form-wrap mb-30">
                  <h4 className="checkout-title">
                    <i className="bi bi-person-circle me-2"></i>
                    Personal Information
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+966 5XX XXX XXXX"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Your city"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        name="country"
                        className="form-control"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Your country"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="checkout-form-wrap mb-30">
                  <h4 className="checkout-title">
                    <i className="bi bi-calendar3 me-2"></i>
                    Booking Details
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Check-in / Start Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        name="check_in"
                        className="form-control"
                        value={form.check_in}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Check-out / End Date</label>
                      <input
                        type="date"
                        name="check_out"
                        className="form-control"
                        value={form.check_out}
                        onChange={handleChange}
                        min={form.check_in || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Adults <span className="text-danger">*</span></label>
                      <div className="quantity-input">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => setForm((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          name="adults"
                          className="form-control text-center"
                          value={form.adults}
                          onChange={handleChange}
                          min="1"
                          max="20"
                          readOnly
                        />
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => setForm((p) => ({ ...p, adults: Math.min(20, p.adults + 1) }))}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Children</label>
                      <div className="quantity-input">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => setForm((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          name="children"
                          className="form-control text-center"
                          value={form.children}
                          onChange={handleChange}
                          min="0"
                          max="20"
                          readOnly
                        />
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => setForm((p) => ({ ...p, children: Math.min(20, p.children + 1) }))}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Special Requests</label>
                      <textarea
                        name="special_requests"
                        className="form-control"
                        rows="3"
                        value={form.special_requests}
                        onChange={handleChange}
                        placeholder="Any special requirements or requests..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="checkout-form-wrap mb-30">
                  <h4 className="checkout-title">
                    <i className="bi bi-credit-card me-2"></i>
                    Payment Method
                  </h4>
                  <div className="payment-method-list">
                    {[
                      { value: 'wallet', label: 'Wallet Balance', icon: 'bi-wallet2', desc: `Available: $${session?.user?.wallet_balance || '0.00'}` },
                      { value: 'stripe', label: 'Credit / Debit Card', icon: 'bi-credit-card', desc: 'Visa, Mastercard, Amex' },
                      { value: 'paypal', label: 'PayPal', icon: 'bi-paypal', desc: 'Pay securely with PayPal' },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`payment-method-item ${paymentMethod === method.value ? 'active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          padding: '15px 20px',
                          border: `2px solid ${paymentMethod === method.value ? 'var(--primary-color1)' : '#eee'}`,
                          borderRadius: '8px',
                          marginBottom: '12px',
                          cursor: 'pointer',
                          background: paymentMethod === method.value ? 'rgba(177,114,60,0.05)' : '#fff',
                          transition: '0.3s',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={() => setPaymentMethod(method.value)}
                          style={{ display: 'none' }}
                        />
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${paymentMethod === method.value ? 'var(--primary-color1)' : '#ccc'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {paymentMethod === method.value && (
                            <div style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'var(--primary-color1)',
                            }} />
                          )}
                        </div>
                        <i className={`bi ${method.icon}`} style={{ fontSize: '22px', color: 'var(--primary-color1)' }}></i>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '15px' }}>{method.label}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-color, #787878)' }}>{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="col-lg-4">
                <div className="order-summary-wrap" style={{
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '30px',
                  position: 'sticky',
                  top: '100px',
                }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                    Order Summary
                  </h4>

                  {product && (
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <img
                          src={product.image || product.thumbnail || '/uploads/assets/placeholder.jpg'}
                          alt={product.title || product.name}
                          style={{ width: '70px', height: '60px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                        />
                        <div>
                          <h6 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', lineHeight: 1.4 }}>
                            {product.title || product.name}
                          </h6>
                          <span style={{
                            background: 'rgba(177,114,60,0.1)',
                            color: 'var(--primary-color1)',
                            padding: '2px 10px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}>
                            {typeLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-color, #787878)' }}>
                        Adults ({form.adults} × ${getBasePrice().toFixed(2)})
                      </span>
                      <span style={{ fontWeight: 500 }}>${(getBasePrice() * form.adults).toFixed(2)}</span>
                    </div>
                    {form.children > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                        <span style={{ color: 'var(--text-color, #787878)' }}>
                          Children ({form.children} × ${getChildPrice().toFixed(2)})
                        </span>
                        <span style={{ fontWeight: 500 }}>${(getChildPrice() * form.children).toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-color, #787878)' }}>Service Fee (5%)</span>
                      <span style={{ fontWeight: 500 }}>${getServiceFee().toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee',
                      fontSize: '18px',
                      fontWeight: 700,
                    }}>
                      <span>Total</span>
                      <span style={{ color: 'var(--primary-color1)' }}>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Booking Dates Summary */}
                  {(form.check_in || form.check_out) && (
                    <div style={{
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      padding: '12px 15px',
                      marginBottom: '20px',
                      fontSize: '13px',
                    }}>
                      {form.check_in && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ color: 'var(--text-color, #787878)' }}>Check-in</span>
                          <span style={{ fontWeight: 500 }}>{form.check_in}</span>
                        </div>
                      )}
                      {form.check_out && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-color, #787878)' }}>Check-out</span>
                          <span style={{ fontWeight: 500 }}>{form.check_out}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="primary-btn1 w-100"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '14px',
                      fontSize: '16px',
                    }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                          <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>

                  <p style={{ fontSize: '12px', color: 'var(--text-color, #787878)', textAlign: 'center', marginTop: '12px' }}>
                    <i className="bi bi-shield-check me-1"></i>
                    Secure & encrypted payment
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        .checkout-form-wrap {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 30px;
        }
        .checkout-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
          color: var(--title-color, #100C08);
        }
        .quantity-input {
          display: flex;
          align-items: center;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          overflow: hidden;
        }
        .quantity-input .form-control {
          border: none;
          border-radius: 0;
          text-align: center;
          width: 60px;
          flex: 1;
        }
        .qty-btn {
          background: #f8f9fa;
          border: none;
          padding: 8px 14px;
          cursor: pointer;
          font-size: 16px;
          color: var(--primary-color1);
          transition: 0.2s;
        }
        .qty-btn:hover {
          background: var(--primary-color1);
          color: #fff;
        }
      `}</style>
    </>
  );
}
