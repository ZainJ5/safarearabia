import Link from 'next/link';
import { defaultSettings } from '@/lib/defaultSettings';

export default function Footer() {
  return (
    <>
      {/* ===== Footer Marketing Banner ===== */}
      <div className="footer-marketing-area" style={{ 
        background: `linear-gradient(135deg, var(--primary-color1), var(--primary-color2))`,
        padding: '40px 0'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7">
              <h3 style={{ color: '#fff', marginBottom: '5px', fontSize: '24px', fontWeight: 600 }}>
                {defaultSettings.footer_marketing_title || 'Want to take tour packages?'}
              </h3>
            </div>
            <div className="col-lg-4 col-md-5 text-md-end mt-3 mt-md-0">
              <Link href={defaultSettings.footer_marketing_btn_link === 'https://www.triprex-app.egenslab.com/tours' ? '/tours' : (defaultSettings.footer_marketing_btn_link || '/tours')} className="primary-btn1" style={{ backgroundColor: '#fff', color: 'var(--primary-color1)' }}>
                {defaultSettings.footer_marketing_btn_text || 'Explore tours'}
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                  <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Footer ===== */}
      <footer className="footer-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            {/* Logo & About Column */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <div className="widget-logo mb-30">
                  <Link href="/">
                    <img src={defaultSettings.footer_logo || defaultSettings.header_logo || '/assets/logo/footerlogo-1750433879.png'} alt="Safar e Arabian" style={{ maxWidth: '180px' }} />
                  </Link>
                </div>
                <p>{defaultSettings.footer_desc_en?.substring(0, 180) || 'Your trusted partner in fulfilling Hajj & Umrah — tailored packages, visa processing, and guided support.'}...</p>
                <ul className="social-links" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  {defaultSettings.facebook_link && (
                    <li>
                      <a href={defaultSettings.facebook_link} target="_blank" rel="noopener noreferrer" style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bxl-facebook"></i>
                      </a>
                    </li>
                  )}
                  {defaultSettings.instagram_link && (
                    <li>
                      <a href={defaultSettings.instagram_link} target="_blank" rel="noopener noreferrer" style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bxl-instagram"></i>
                      </a>
                    </li>
                  )}
                  {defaultSettings.linkedin_link && (
                    <li>
                      <a href={defaultSettings.linkedin_link} target="_blank" rel="noopener noreferrer" style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bxl-linkedin"></i>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget pl-5">
                <h3>{defaultSettings.footer1_title || 'Quick Links'}</h3>
                <ul className="quick-links">
                  <li><Link href="/about-us">About Us</Link></li>
                  <li><Link href="/tours">Tours</Link></li>
                  <li><Link href="/all-visa">All Visa</Link></li>
                  <li><Link href="/terms-conditions">Terms and Conditions</Link></li>
                  <li><Link href="/contact-us">Contact Us</Link></li>
                </ul>
              </div>
            </div>

            {/* Help & Support Column */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget pl-5">
                <h3>{defaultSettings.footer2_title || 'Help & Support'}</h3>
                <ul className="quick-links">
                  <li><Link href="/terms-conditions">Terms and Conditions</Link></li>
                  <li><Link href="/security-information">Security Information</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact Info Column */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h3>Contact Info</h3>
                <ul className="footer-contact-info" style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px' }}>
                    <i className="bi bi-geo-alt" style={{ color: 'var(--primary-color1)', fontSize: '18px', marginTop: '3px' }}></i>
                    <span>{defaultSettings.footer_address || defaultSettings.company_address}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px' }}>
                    <i className="bi bi-telephone" style={{ color: 'var(--primary-color1)', fontSize: '18px', marginTop: '3px' }}></i>
                    <a href={`tel:${defaultSettings.footer_phone || defaultSettings.hotline_phone}`}>
                      {defaultSettings.footer_phone || defaultSettings.hotline_phone}
                    </a>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px' }}>
                    <i className="bi bi-envelope" style={{ color: 'var(--primary-color1)', fontSize: '18px', marginTop: '3px' }}></i>
                    <a href={`mailto:${defaultSettings.footer_email || defaultSettings.email_address}`}>
                      {defaultSettings.footer_email || defaultSettings.email_address}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Area */}
        <div className="copyright-area" style={{ marginTop: '40px' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6">
                <div dangerouslySetInnerHTML={{ __html: defaultSettings.front_copyright_en || `<p>Copyright ${new Date().getFullYear()} <a href="/">Safar e Arabian</a>. All Rights Reserved.</p>` }} />
              </div>
              <div className="col-lg-6 col-md-6">
                <ul className="copyright-links" style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', listStyle: 'none', padding: 0, margin: 0 }}>
                  <li><Link href="/terms-conditions">Terms of Service</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
