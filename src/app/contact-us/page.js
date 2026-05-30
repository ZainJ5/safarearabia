'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/Breadcrumb';
import { defaultSettings } from '@/lib/defaultSettings';

const infoCards = [
  {
    icon: 'bi-telephone',
    title: 'Phone Number',
    value: defaultSettings.hotline_phone,
    href: `tel:${defaultSettings.hotline_phone}`,
  },
  {
    icon: 'bi-envelope',
    title: 'Email Address',
    value: defaultSettings.email_address,
    href: `mailto:${defaultSettings.email_address}`,
  },
  {
    icon: 'bi-geo-alt',
    title: 'Office Address',
    value: defaultSettings.company_address,
    href: null,
  },
];

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Your message has been sent! We\'ll get back to you shortly.');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(data.error || data.message || 'Failed to send message. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: '50px', borderRadius: '6px', border: '1px solid #e8e8e8',
    paddingLeft: '15px', width: '100%', outline: 'none', fontSize: '14px',
    transition: 'border-color 0.2s',
  };

  return (
    <>
      <Breadcrumb title="Contact Us" currentPage="Contact" />

      <div className="contact-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Info cards */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {infoCards.map(({ icon, title, value, href }) => (
                  <div key={title} style={{ background: '#fff', borderRadius: '10px', padding: '28px 24px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(177,114,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${icon}`} style={{ fontSize: '22px', color: 'var(--primary-color1)' }}></i>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{title}</h5>
                      {href
                        ? <a href={href} style={{ color: 'var(--primary-color1)', fontSize: '14px', fontWeight: 500 }}>{value}</a>
                        : <p style={{ color: '#787878', fontSize: '14px', lineHeight: 1.6, marginBottom: 0 }}>{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="col-lg-8">
              <div style={{ background: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
                <div className="section-title mb-30">
                  <span>Get In Touch</span>
                  <h2>Send Us a Message</h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Your email" style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Phone Number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone number" style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} placeholder="Message subject" style={inputStyle} />
                    </div>
                    <div className="col-12 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Message *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Write your message..." style={{ ...inputStyle, height: 'auto', padding: '15px', resize: 'vertical' }} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="primary-btn1" disabled={loading} style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Sending...' : 'Send Message'}
                        {!loading && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
