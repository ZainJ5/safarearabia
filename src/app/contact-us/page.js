import Breadcrumb from '@/components/Breadcrumb';
import { defaultSettings } from '@/lib/defaultSettings';

export const metadata = {
  title: 'Contact Us | Safar E Arabia',
  description: 'Get in touch with us for any inquiries about our Hajj, Umrah, and travel services.',
};

export default function ContactUsPage() {
  return (
    <>
      <Breadcrumb title="Contact Us" currentPage="Contact" />

      <div className="contact-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Contact Info Cards */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Phone */}
                <div style={{
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '30px 25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                }}>
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: 'rgba(177,114,60,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="bi bi-telephone" style={{ fontSize: '22px', color: 'var(--primary-color1)' }}></i>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Phone Number</h5>
                    <a href={`tel:${defaultSettings.hotline_phone}`} style={{ color: 'var(--primary-color1)', fontSize: '15px', fontWeight: 500 }}>
                      {defaultSettings.hotline_phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div style={{
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '30px 25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                }}>
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: 'rgba(177,114,60,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="bi bi-envelope" style={{ fontSize: '22px', color: 'var(--primary-color1)' }}></i>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Email Address</h5>
                    <a href={`mailto:${defaultSettings.email_address}`} style={{ color: 'var(--primary-color1)', fontSize: '15px', fontWeight: 500 }}>
                      {defaultSettings.email_address}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div style={{
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '30px 25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                }}>
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: 'rgba(177,114,60,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="bi bi-geo-alt" style={{ fontSize: '22px', color: 'var(--primary-color1)' }}></i>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Office Address</h5>
                    <p style={{ color: 'var(--text-color, #787878)', fontSize: '14px', lineHeight: 1.6, marginBottom: 0 }}>
                      {defaultSettings.company_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '40px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              }}>
                <div className="section-title mb-30">
                  <span>Get In Touch</span>
                  <h2>Send Us a Message</h2>
                </div>
                <form action="/api/contact" method="POST">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Full Name *</label>
                      <input type="text" name="name" className="form-control" placeholder="Your full name" required style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Email Address *</label>
                      <input type="email" name="email" className="form-control" placeholder="Your email" required style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Phone Number</label>
                      <input type="tel" name="phone" className="form-control" placeholder="Your phone number" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Subject</label>
                      <input type="text" name="subject" className="form-control" placeholder="Message subject" style={{ height: '50px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <div className="col-12 mb-3">
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Message *</label>
                      <textarea name="message" className="form-control" rows={6} placeholder="Write your message..." required style={{ borderRadius: '5px', border: '1px solid #e8e8e8', padding: '15px', resize: 'vertical' }}></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="primary-btn1">
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                          <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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
