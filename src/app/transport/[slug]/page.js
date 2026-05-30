import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';
import TransportBookingForm from '@/components/transport/TransportBookingForm';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/transports/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const r = await res.json();
      if (r.success && r.data) return { title: r.data.title, description: r.data.content?.replace(/<[^>]+>/g, '').slice(0, 160) };
    }
  } catch {}
  return { title: slug.replace(/-/g, ' ') };
}

/* ── helpers ── */
const hasPrice = (v) => v !== undefined && v !== null && v !== '' && Number(v) > 0;

/* ── Section heading (module-level) ── */
function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 19, fontWeight: 700, color: '#100C08', margin: '0 0 8px' }}>{children}</h4>
      <div style={{ width: 40, height: 3, background: '#B1723C', borderRadius: 2 }} />
    </div>
  );
}

/* ── Sidebar detail card (module-level) ── */
function DetailCard({ rows }) {
  if (!rows.length) return null;
  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', marginTop: 20 }}>
      <div style={{ background: '#100C08', padding: '14px 20px' }}>
        <h6 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: 14 }}>Transport Details</h6>
      </div>
      <div style={{ padding: '4px 0' }}>
        {rows.map(([label, value], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 18px', borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <span style={{ fontSize: 13, color: '#888' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#333', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ── */
export default async function TransportDetailPage({ params }) {
  const { slug } = await params;
  let transport = null;

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/transports/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const r = await res.json();
      if (r.success) transport = r.data;
    }
  } catch {}

  if (!transport) {
    return (
      <>
        <div className="breadcrumb-area">
          <div className="container py-5">
            <div className="breadcrumb-content">
              <h2>Transport Not Found</h2>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/transport">Transport</Link></li>
                <li>Not Found</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <i className="bi bi-car-front" style={{ fontSize: 52, color: '#B1723C', opacity: 0.4, display: 'block', marginBottom: 16 }}></i>
          <h4 style={{ color: '#333', marginBottom: 8 }}>Transport service not found</h4>
          <p style={{ color: '#888', marginBottom: 24 }}>It may have been removed or the link is incorrect.</p>
          <Link href="/transport" style={{ padding: '12px 32px', background: '#B1723C', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
            Browse All Transport
          </Link>
        </div>
        <Newsletter />
      </>
    );
  }

  /* ── Build pricing tabs (only show types with actual prices > 0) ── */
  const pricingTabs = [
    hasPrice(transport.pricing_car?.price) && {
      label: 'Car',
      icon: 'bi-car-front',
      color: '#B1723C',
      price: transport.pricing_car.price,
      salePrice: transport.pricing_car.sale_price,
      sub: [transport.pricing_car.vehicle_type, transport.pricing_car.person ? `${transport.pricing_car.person} seats` : null].filter(Boolean).join(' · ') || null,
      childPrice: null,
      extraService: transport.pricing_car.enable_extra_service,
    },
    hasPrice(transport.pricing_bus?.adult_price) && {
      label: 'Bus',
      icon: 'bi-bus-front',
      color: '#1565c0',
      price: transport.pricing_bus.adult_price,
      salePrice: transport.pricing_bus.adult_sale_price,
      sub: 'Adult price',
      childPrice: hasPrice(transport.pricing_bus.child_price) ? transport.pricing_bus.child_price : null,
      extraService: transport.pricing_bus.enable_extra_service,
    },
    hasPrice(transport.pricing_train?.adult_price) && {
      label: 'Train',
      icon: 'bi-train-front',
      color: '#2e7d32',
      price: transport.pricing_train.adult_price,
      salePrice: transport.pricing_train.adult_sale_price,
      sub: 'Adult price',
      childPrice: hasPrice(transport.pricing_train.child_price) ? transport.pricing_train.child_price : null,
      extraService: transport.pricing_train.enable_extra_service,
    },
    hasPrice(transport.pricing_boat?.adult_price) && {
      label: 'Boat',
      icon: 'bi-water',
      color: '#0277bd',
      price: transport.pricing_boat.adult_price,
      salePrice: transport.pricing_boat.adult_sale_price,
      sub: 'Adult price',
      childPrice: hasPrice(transport.pricing_boat.child_price) ? transport.pricing_boat.child_price : null,
      extraService: transport.pricing_boat.enable_extra_service,
    },
    /* Legacy flat-field fallback */
    !hasPrice(transport.pricing_car?.price) && hasPrice(transport.car_price) && {
      label: 'Car',
      icon: 'bi-car-front',
      color: '#B1723C',
      price: transport.car_price,
      salePrice: null,
      sub: [transport.car_type, transport.car_person ? `${transport.car_person} seats` : null].filter(Boolean).join(' · ') || null,
      childPrice: null,
      extraService: false,
    },
  ].filter(Boolean);

  const lowestPrice = pricingTabs[0]?.price || 0;

  /* ── Icon map for features ── */
  const featureIcons = {
    'FM Radio':          'bi-broadcast',
    'Free Cancellation': 'bi-arrow-counterclockwise',
    'Pay at Pickup':     'bi-cash-coin',
    'Shuttle to Car':    'bi-truck',
    'Steering Wheel':    'bi-circle',
    'Air Conditioning':  'bi-thermometer-snow',
    'GPS':               'bi-geo-alt',
    'WiFi':              'bi-wifi',
  };

  /* ── Data extractions ── */
  const lat = transport.location?.coordinates?.lat;
  const lng = transport.location?.coordinates?.lng;
  const banner = transport.feature_img || transport.galleries?.[0] || null;
  const galleries = Array.isArray(transport.galleries) ? transport.galleries.filter(Boolean) : [];
  const features = Array.isArray(transport.attribute_features) ? transport.attribute_features.filter(Boolean) : [];
  const types = Array.isArray(transport.attribute_type) ? transport.attribute_type.filter(Boolean) : [];
  const includes = Array.isArray(transport.includes) ? transport.includes.filter(i => i?.title) : [];
  const excludes = Array.isArray(transport.excludes) ? transport.excludes.filter(i => i?.title) : [];
  const faqs = Array.isArray(transport.faqs) ? transport.faqs.filter(f => f?.title) : [];

  /* ── Detail card rows ── */
  const detailRows = [
    transport.category?.name            && ['Category',         transport.category.name],
    transport.pricing_car?.vehicle_type && ['Vehicle Type',     transport.pricing_car.vehicle_type],
    transport.pricing_car?.person       && ['Car Capacity',     `${transport.pricing_car.person} persons`],
    transport.destination_name          && ['Destination',      transport.destination_name],
    (transport.distance_km || transport.destination_km) && ['Distance', `${transport.distance_km || transport.destination_km} km`],
    transport.location?.address         && ['Route',            transport.location.address],
    transport.min_advance_reservation   && ['Min. Reservation', `${transport.min_advance_reservation} day(s) ahead`],
  ].filter(Boolean);

  return (
    <>
      {/* ── Banner / Breadcrumb ── */}
      <div
        className="breadcrumb-area"
        style={banner ? { backgroundImage: `url(${banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="breadcrumb-content">
                <h2 style={{ textShadow: banner ? '0 2px 8px rgba(0,0,0,0.45)' : 'none' }}>{transport.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/transport">Transport</Link></li>
                  <li>{transport.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gallery strip ── */}
      {galleries.length > 1 && (
        <div className="container" style={{ marginTop: 20, marginBottom: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(galleries.length, 5)}, 1fr)`, gap: 6, borderRadius: 10, overflow: 'hidden' }}>
            {galleries.slice(0, 5).map((img, i) => (
              <div key={i} style={{ height: 160, overflow: 'hidden' }}>
                <img src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main body ── */}
      <div style={{ background: '#f9f9f9', paddingTop: 40, paddingBottom: 72 }}>
        <div className="container">
          <div className="row" style={{ gap: 0, alignItems: 'flex-start' }}>

            {/* ═══ LEFT COLUMN (col-lg-8) ═══ */}
            <div className="col-lg-8" style={{ paddingRight: 28 }}>

              {/* Category badge + title */}
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                {transport.category?.name && (
                  <span style={{ background: '#B1723C', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {transport.category.name}
                  </span>
                )}
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#100C08', lineHeight: 1.3, margin: '0 0 16px' }}>
                  {transport.title}
                </h1>

                {/* Quick meta pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {(transport.location?.address || transport.destination_name) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555', background: '#f8f4f0', padding: '5px 14px', borderRadius: 20 }}>
                      <i className="bi bi-geo-alt-fill" style={{ color: '#B1723C' }}></i>
                      {transport.location?.address || transport.destination_name}
                    </span>
                  )}
                  {(transport.distance_km || transport.destination_km) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555', background: '#f8f4f0', padding: '5px 14px', borderRadius: 20 }}>
                      <i className="bi bi-signpost-split" style={{ color: '#B1723C' }}></i>
                      {transport.distance_km || transport.destination_km} km
                    </span>
                  )}
                  {transport.min_advance_reservation && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555', background: '#f8f4f0', padding: '5px 14px', borderRadius: 20 }}>
                      <i className="bi bi-clock" style={{ color: '#B1723C' }}></i>
                      Book {transport.min_advance_reservation} day(s) ahead
                    </span>
                  )}
                </div>
              </div>

              {/* Description / Overview */}
              {transport.content && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <SectionTitle>Overview</SectionTitle>
                  <div style={{ color: '#555', lineHeight: 1.85, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: transport.content }} />
                </div>
              )}

              {/* Pricing cards */}
              {pricingTabs.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <SectionTitle>Pricing Options</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                    {pricingTabs.map((tab, i) => (
                      <div key={i} style={{ border: `2px solid ${tab.color}25`, borderRadius: 12, padding: '18px 16px', background: `${tab.color}08`, position: 'relative' }}>
                        {/* Icon circle */}
                        <div style={{ width: 42, height: 42, background: `${tab.color}18`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                          <i className={`bi ${tab.icon}`} style={{ fontSize: 20, color: tab.color }}></i>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#555', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{tab.label}</p>
                        {tab.sub && <p style={{ fontSize: 11, color: '#999', margin: '0 0 10px', lineHeight: 1.4 }}>{tab.sub}</p>}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                          <span style={{ fontSize: 11, color: tab.color, fontWeight: 700 }}>SAR</span>
                          <span style={{ fontSize: 24, fontWeight: 800, color: tab.color, lineHeight: 1 }}>
                            {hasPrice(tab.salePrice) ? tab.salePrice : tab.price}
                          </span>
                        </div>
                        {hasPrice(tab.salePrice) && (
                          <div style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>SAR {tab.price}</div>
                        )}
                        {tab.childPrice && (
                          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Child: SAR {tab.childPrice}</div>
                        )}
                        {tab.extraService && (
                          <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, background: `${tab.color}20`, color: tab.color, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
                            Extra service
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features & Amenities */}
              {features.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <SectionTitle>Features & Amenities</SectionTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#f8f4f0', border: '1px solid #e8ddd5', borderRadius: 10, padding: '9px 16px', fontSize: 13, color: '#444' }}>
                        <div style={{ width: 30, height: 30, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                          <i className={`bi ${featureIcons[f] || 'bi-check-circle'}`} style={{ fontSize: 14, color: '#B1723C' }}></i>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicle Type */}
              {types.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <SectionTitle>Vehicle Type</SectionTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {types.map((t, i) => (
                      <span key={i} style={{ background: '#fff', border: '1.5px solid #B1723C', color: '#B1723C', borderRadius: 8, padding: '7px 20px', fontSize: 13, fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Includes & Excludes */}
              {(includes.length > 0 || excludes.length > 0) && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <SectionTitle>Includes & Excludes</SectionTitle>
                  <div className="row g-3">
                    {includes.length > 0 && (
                      <div className="col-md-6">
                        <div style={{ background: '#f0faf2', borderRadius: 10, padding: '16px 18px', height: '100%', border: '1px solid #c8ebd0' }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#28a745', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <i className="bi bi-check-circle-fill"></i> Included
                          </p>
                          {includes.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 9 }}>
                              <span style={{ width: 20, height: 20, background: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <i className="bi bi-check" style={{ color: '#fff', fontSize: 12 }}></i>
                              </span>
                              <span style={{ fontSize: 13, color: '#2d5a35', lineHeight: 1.5 }}>{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {excludes.length > 0 && (
                      <div className="col-md-6">
                        <div style={{ background: '#fff5f5', borderRadius: 10, padding: '16px 18px', height: '100%', border: '1px solid #f5c6cb' }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#dc3545', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <i className="bi bi-x-circle-fill"></i> Excluded
                          </p>
                          {excludes.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 9 }}>
                              <span style={{ width: 20, height: 20, background: '#dc3545', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <i className="bi bi-x" style={{ color: '#fff', fontSize: 13 }}></i>
                              </span>
                              <span style={{ fontSize: 13, color: '#7b2d35', lineHeight: 1.5 }}>{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Map */}
              {lat && lng && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <SectionTitle>Location</SectionTitle>
                  {transport.location?.address && (
                    <p style={{ color: '#666', fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="bi bi-geo-alt-fill" style={{ color: '#B1723C' }}></i>
                      {[transport.location.address, transport.location.city, transport.location.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <iframe
                      src={`https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`}
                      width="100%" height="300" style={{ border: 0, display: 'block' }}
                      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}

              {/* FAQs — only shown when there are real items */}
              {faqs.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <SectionTitle>Frequently Asked Questions</SectionTitle>
                  <div className="accordion" id="transportFaqs">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="accordion-item" style={{ marginBottom: 8, border: '1px solid #ede8e2', borderRadius: 9, overflow: 'hidden' }}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button${idx !== 0 ? ' collapsed' : ''}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#tfaq${idx}`}
                            style={{ fontWeight: 600, fontSize: 14, background: '#fdf8f4', color: '#100C08' }}
                          >
                            {faq.title}
                          </button>
                        </h2>
                        <div id={`tfaq${idx}`} className={`accordion-collapse collapse${idx === 0 ? ' show' : ''}`} data-bs-parent="#transportFaqs">
                          <div className="accordion-body" style={{ color: '#555', fontSize: 14, lineHeight: 1.75, background: '#fff' }}>
                            {faq.content || ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ═══ RIGHT COLUMN (col-lg-4) ═══ */}
            <div className="col-lg-4">
              <div style={{ position: 'sticky', top: 96 }}>
                {/* Client-side booking form */}
                <TransportBookingForm
                  transportId={String(transport._id)}
                  transportTitle={transport.title}
                  transportSlug={transport.slug}
                  lowestPrice={lowestPrice}
                  pricingTypes={pricingTabs.map(t => ({ label: t.label, sub: t.sub }))}
                />

                {/* Static details card */}
                <DetailCard rows={detailRows} />

                {/* Help CTA */}
                <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', borderRadius: 12, padding: '24px 20px', textAlign: 'center', marginTop: 20 }}>
                  <i className="bi bi-headset" style={{ fontSize: 28, color: '#fff', marginBottom: 10, display: 'block' }}></i>
                  <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Need Help?</h5>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>
                    Our transport specialists are ready to assist you.
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
          background: #fdf8f4 !important;
          color: #B1723C !important;
          box-shadow: none !important;
        }
        .accordion-button:focus { box-shadow: none !important; }
        @media (max-width: 991px) {
          .col-lg-4 > div { position: static !important; }
        }
      `}</style>
    </>
  );
}
