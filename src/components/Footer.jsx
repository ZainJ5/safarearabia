import Link from 'next/link';
import { defaultSettings } from '@/lib/defaultSettings';

const FOOTER_BG   = 'rgb(29, 35, 31)';
const MUTED       = 'rgba(255,255,255,0.55)';
const HEADING_CLR = '#ffffff';
const ICON_CLR    = '#b07542';

export default function Footer() {
  const phone   = defaultSettings.footer_phone   || defaultSettings.hotline_phone   || '+92 305 1309051';
  const email   = defaultSettings.footer_email   || defaultSettings.email_address   || 'info@safarearabiantravel.com';
  const address = defaultSettings.footer_address || defaultSettings.company_address || 'LG-111 Siddique Trade Center Main Boulevard Lahore, Main Gulberg, Lahore Pakistan';
  const desc    = defaultSettings.footer_desc_en || 'With years of expertise, we offer tailored packages, seamless visa processing, comfortable accommodations, and guided support to ensure every step of your sacred journey is smooth and memorable. Let us be your trusted partner in fulfilling this important pillar of faith.';
  const copyright = defaultSettings.front_copyright_en || `Copyright ${new Date().getFullYear()} <a href="/">Safar e Arabian</a> | Design By <a href="#">ZABS Creatives</a>`;

  const fb = defaultSettings.facebook_link  || defaultSettings.social_facebook;
  const li = defaultSettings.linkedin_link  || defaultSettings.social_linkedin;
  const ig = defaultSettings.instagram_link || defaultSettings.social_instagram;

  // Build quick links: admin-managed (footer_link1..3) + static fallbacks
  const adminLinks = [1, 2, 3].reduce((acc, n) => {
    const label = defaultSettings[`footer_link${n}_label`];
    const href  = defaultSettings[`footer_link${n}_url`];
    if (label && href) acc.push({ label, href });
    return acc;
  }, []);

  const quickLinks = adminLinks.length > 0 ? adminLinks : [
    { label: 'About Us',             href: '/about-us'         },
    { label: 'Hajj Umrah',           href: '/tours'            },
    { label: 'Umrah Visa',           href: '/all-visa'         },
    { label: 'Terms and Conditions', href: '/terms-conditions' },
    { label: 'Contact Us',           href: '/contact-us'       },
  ];

  return (
    <footer style={{ background: FOOTER_BG, paddingTop: '148px' }}>
      {/* ── FOOTER_STYLE ── */}
      <style>{`
        .ft-link { color: ${MUTED}; text-decoration: none; font-size: 14px; line-height: 2; transition: color 0.2s; }
        .ft-link:hover { color: #b07542; }
        .ft-social { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.65); text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .ft-social:hover { border-color: #b07542; color: #b07542; }
        .ft-bar-link { color: ${MUTED}; font-size: 13px; text-decoration: none; transition: color 0.2s; }
        .ft-bar-link:hover { color: #b07542; }
      `}</style>

      <div className="container">
        <div className="row" style={{ paddingBottom: '50px' }}>

          {/* ── Column 1: Logo + CTA ── */}
          <div className="col-lg-3 col-md-6" style={{ marginBottom: '40px' }}>
            {/* Logo row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '26px' }}>
              <img
                src={defaultSettings.footer_logo || '/assets/logo/footerlogo-1750433879.png'}
                alt="Safar e Arabian"
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <h3 style={{
              color: HEADING_CLR,
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '28px',
              fontFamily: 'Rubik, var(--font-rubik), sans-serif',
            }}>
              Want To Take Tour<br />Packages?
            </h3>

            <Link
              href="/tours"
              style={{
                display: 'inline-block',
                background: '#b07542',
                color: '#fff',
                padding: '13px 30px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                fontFamily: 'Rubik, sans-serif',
              }}
            >
              Explore Tours
            </Link>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div className="col-lg-2 col-md-6" style={{ marginBottom: '40px' }}>
            <h4 style={h4}>
              {defaultSettings.footer1_title || 'Quick link'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="ft-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: More Inquiry ── */}
          <div className="col-lg-3 col-md-6" style={{ marginBottom: '40px' }}>
            {/* Phone */}
            <h4 style={h4}>
              <PhoneIcon /> More Inquiry
            </h4>
            <p style={{ color: MUTED, fontSize: '14px', marginBottom: '22px', lineHeight: 1.5 }}>
              <a href={`tel:${phone}`} className="ft-link" style={{ fontSize: '14px' }}>{phone}</a>
            </p>

            {/* Email */}
            <h4 style={h4}>
              <SendIcon /> Send Mail
            </h4>
            <p style={{ color: MUTED, fontSize: '14px', marginBottom: '22px', lineHeight: 1.5 }}>
              <a href={`mailto:${email}`} className="ft-link" style={{ fontSize: '14px' }}>{email}</a>
            </p>

            {/* Address */}
            <h4 style={h4}>
              <PinIcon /> Address
            </h4>
            <p style={{ color: MUTED, fontSize: '13px', lineHeight: 1.75, marginBottom: 0 }}>
              {address}
            </p>
          </div>

          {/* ── Column 4: About + Payment ── */}
          <div className="col-lg-4 col-md-6" style={{ marginBottom: '40px' }}>
            <h4 style={h4}>
              {defaultSettings.footer_latest_title || 'Find About Safar e Arabian'}
            </h4>
            <p style={{ color: MUTED, fontSize: '13px', lineHeight: 1.8, marginBottom: '26px' }}>
              {desc}
            </p>

            <h5 style={{ color: HEADING_CLR, fontSize: '15px', fontWeight: 600, marginBottom: '14px', fontFamily: 'Rubik, sans-serif' }}>
              Payment Partner
            </h5>

            {/* Single consolidated payment logo image */}
            <img
              src="/assets/logo/payment-logo.png"
              alt="Payment Partners"
              style={{ maxWidth: '240px', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '22px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}>
          {/* Social circles */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {fb && (
              <a href={fb} target="_blank" rel="noopener noreferrer" className="ft-social">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
            )}
            {li && (
              <a href={li} target="_blank" rel="noopener noreferrer" className="ft-social">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            )}
            {ig && (
              <a href={ig} target="_blank" rel="noopener noreferrer" className="ft-social">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            )}
          </div>

          {/* Copyright */}
          <div
            style={{ color: MUTED, fontSize: '13px', textAlign: 'center' }}
            dangerouslySetInnerHTML={{ __html: copyright }}
          />

          {/* Terms + Security */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Link href="/terms-conditions"  className="ft-bar-link">Terms and Conditions</Link>
            <span style={{ color: MUTED, fontSize: '13px' }}>&bull;</span>
            <Link href="/privacy-policy"    className="ft-bar-link">Security Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Shared heading style ── */
const h4 = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 700,
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'Rubik, var(--font-rubik), sans-serif',
};

/* ── Inline icon components ── */
function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill={ICON_CLR}>
      <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V21a1 1 0 01-1 1A19 19 0 012 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.24 1.01l-2.21 2.2z"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill={ICON_CLR}>
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill={ICON_CLR}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"/>
    </svg>
  );
}
