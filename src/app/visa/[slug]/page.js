import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';
import VisaApplyForm from '@/components/visa/VisaApplyForm';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/visas/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const d = await res.json();
      if (d.success) return { title: `${d.data.title} | Visa`, description: d.data.cost_summary || '' };
    }
  } catch { /* ignore */ }
  return { title: 'Visa Details' };
}

/* ── module-level sub-components ── */

function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 19, fontWeight: 700, color: '#100C08', margin: 0 }}>{children}</h4>
      <div style={{ width: 40, height: 3, background: '#B1723C', borderRadius: 2, marginTop: 8 }} />
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f8f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`bi bi-${icon}`} style={{ color: '#B1723C', fontSize: 14 }}></i>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

/* ── page ── */
export default async function VisaDetailPage({ params }) {
  const { slug } = await params;
  let visa = null;

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/visas/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const d = await res.json();
      if (d.success) visa = d.data;
    }
  } catch (error) {
    console.error('Failed to fetch visa detail:', error);
  }

  if (!visa) {
    return (
      <>
        <div className="breadcrumb-area">
          <div className="container py-5">
            <div className="breadcrumb-content">
              <h2>Visa Not Found</h2>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/all-visa">Visa</Link></li>
                <li>Not Found</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <i className="bi bi-file-earmark-x" style={{ fontSize: 56, color: '#B1723C', opacity: 0.5, display: 'block', marginBottom: 16 }}></i>
          <h4 style={{ color: '#333', marginBottom: 8 }}>This visa is not available</h4>
          <p style={{ color: '#888', marginBottom: 24 }}>It may have been removed or the link is incorrect.</p>
          <Link href="/all-visa" style={{ padding: '12px 32px', background: '#B1723C', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
            Browse All Visas
          </Link>
        </div>
        <Newsletter />
      </>
    );
  }

  const faqs = Array.isArray(visa.faqs) ? visa.faqs.filter(f => f.title) : [];
  const includes = Array.isArray(visa.includes) ? visa.includes.filter(i => i.title) : [];
  const requiredDocs = Array.isArray(visa.required_documents) ? visa.required_documents.filter(d => d.title) : [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <div className="breadcrumb-content">
                <h2>{visa.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/all-visa">Visa</Link></li>
                  <li>{visa.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 56, paddingBottom: 80, background: '#f9f9f9' }}>
        <div className="container">
          {/* Main grid: left 8 cols, right 4 cols */}
          <div className="row" style={{ gap: 0 }}>

            {/* ── Left: main content ── */}
            <div className="col-lg-8" style={{ paddingRight: 24 }}>

              {/* Feature image */}
              {visa.features_image && (
                <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 28, boxShadow: '0 2px 20px rgba(0,0,0,0.1)' }}>
                  <img
                    src={visa.features_image}
                    alt={visa.title}
                    style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              {/* Quick info strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32, padding: '16px 20px', background: '#fff', borderRadius: 10, borderLeft: '4px solid #B1723C', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                {[
                  { icon: 'clock-history', label: 'Processing', value: visa.processing },
                  { icon: 'calendar-check', label: 'Validity', value: visa.validity },
                  { icon: 'house-door', label: 'Max Stay', value: visa.maximum_stay },
                  { icon: 'file-earmark-text', label: 'Mode', value: visa.visa_mode },
                  { icon: 'globe', label: 'Country', value: visa.country },
                ].filter(x => x.value).map(x => (
                  <span key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444', fontWeight: 500, padding: '4px 12px', background: '#f8f4f0', borderRadius: 20 }}>
                    <i className={`bi bi-${x.icon}`} style={{ color: '#B1723C' }}></i>
                    <span style={{ color: '#888', fontSize: 12 }}>{x.label}:</span>
                    <strong>{x.value}</strong>
                  </span>
                ))}
              </div>

              {/* Visa Details card */}
              <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 28, overflow: 'hidden' }}>
                <div style={{ background: '#100C08', padding: '14px 20px' }}>
                  <h5 style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: 15 }}>Visa Details</h5>
                </div>
                <div style={{ padding: '4px 20px 12px' }}>
                  <InfoRow icon="tags" label="Category" value={visa.category?.name} />
                  <InfoRow icon="clock-history" label="Processing Time" value={visa.processing} />
                  <InfoRow icon="calendar-check" label="Validity" value={visa.validity} />
                  <InfoRow icon="house-door" label="Maximum Stay" value={visa.maximum_stay} />
                  <InfoRow icon="file-earmark-text" label="Visa Mode" value={visa.visa_mode} />
                  <InfoRow icon="globe" label="Country" value={visa.country} />
                  {visa.cost && <InfoRow icon="cash" label="Visa Fee" value={`SAR ${visa.cost}`} />}
                  {visa.cost_summary && <InfoRow icon="info-circle" label="Cost Summary" value={visa.cost_summary} />}
                </div>
              </div>

              {/* What's Included */}
              {includes.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 28 }}>
                  <SectionTitle>What&apos;s Included</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {includes.map((inc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: '#f0faf2', borderRadius: 8, border: '1px solid #c8ebd0' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#28a745', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="bi bi-check" style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}></i>
                        </div>
                        <span style={{ fontSize: 13, color: '#1a5c28', fontWeight: 500 }}>{inc.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Documents */}
              {requiredDocs.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 28 }}>
                  <SectionTitle>Required Documents</SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {requiredDocs.map((doc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#faf6f2', borderRadius: 8, border: '1px solid #e8d8c8' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#B1723C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{doc.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 28 }}>
                  <SectionTitle>Frequently Asked Questions</SectionTitle>
                  <div className="accordion" id="visaFaqs">
                    {faqs.map((faq, idx) => (
                      <div className="accordion-item" key={idx} style={{ marginBottom: 8, border: '1px solid #e8d8c8', borderRadius: 8, overflow: 'hidden' }}>
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#faq${idx}`}
                            style={{ fontWeight: 600, fontSize: 14, background: '#faf6f2' }}
                          >
                            {faq.title}
                          </button>
                        </h2>
                        <div id={`faq${idx}`} className="accordion-collapse collapse" data-bs-parent="#visaFaqs">
                          <div className="accordion-body" style={{ fontSize: 14, color: '#555', lineHeight: 1.7, background: '#fff' }}>
                            {faq.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: sidebar ── */}
            <div className="col-lg-4">
              {/* Sticky wrapper */}
              <div style={{ position: 'sticky', top: 100 }}>
                {/* Application form (client component) */}
                <VisaApplyForm
                  visaId={String(visa._id)}
                  visaTitle={visa.title}
                  visaSlug={visa.slug}
                  cost={visa.cost}
                />

                {/* Help CTA */}
                <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', borderRadius: 12, padding: '24px 20px', textAlign: 'center', marginTop: 20 }}>
                  <i className="bi bi-headset" style={{ fontSize: 28, color: '#fff', marginBottom: 10, display: 'block' }}></i>
                  <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: 16 }}>Need Assistance?</h5>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>
                    Our visa specialists are ready to help with your application.
                  </p>
                  <Link href="/contact-us" style={{ display: 'inline-block', padding: '9px 24px', background: '#fff', color: '#B1723C', borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Newsletter />

      <style>{`
        .accordion-button:not(.collapsed) {
          background: #faf6f2 !important;
          color: #B1723C !important;
          box-shadow: none !important;
        }
        .accordion-button:focus {
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
}
