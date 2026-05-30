import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${appUrl}/api/transports/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        const d = result.data;
        return {
          title: d.title,
          description: d.content?.replace(/<[^>]+>/g, '').slice(0, 160),
        };
      }
    }
  } catch {}
  return { title: slug.replace(/-/g, ' ') };
}

/* ─── Booking sidebar (server component) ─── */
function BookingForm({ transport }) {
  const lowestPrice =
    transport.pricing_car?.price ||
    transport.car_price ||
    transport.pricing_bus?.adult_price ||
    transport.pricing_train?.adult_price ||
    transport.pricing_boat?.adult_price ||
    0;

  return (
    <div style={{
      background: '#fff', borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 6px 32px rgba(0,0,0,0.11)', position: 'sticky', top: 84,
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #B1723C 0%, #6D4100 100%)', padding: '22px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>
          Starting From
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>SAR</span>
          <span style={{ color: '#fff', fontSize: 34, fontWeight: 800, lineHeight: 1 }}>
            {lowestPrice || '—'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>/ trip</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: 12 }}>
          Reserve your transport today
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: '22px 24px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
          Inquiry / Booking Form
        </p>
        <form action="/api/contact" method="POST">
          <input type="hidden" name="subject" value={`Transport Booking: ${transport.title}`} />
          {[
            { label: 'Full Name',       name: 'name',    type: 'text',  placeholder: 'Enter your full name'  },
            { label: 'Email Address',   name: 'email',   type: 'email', placeholder: 'Enter your email'       },
            { label: 'WhatsApp Number', name: 'phone',   type: 'tel',   placeholder: 'e.g. +966 5X XXX XXXX' },
            { label: 'Travel Date',     name: 'date',    type: 'date',  placeholder: ''                       },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: 13 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>
                {f.label}
              </label>
              <input
                name={f.name} type={f.type} placeholder={f.placeholder}
                style={{ width: '100%', padding: '10px 13px', border: '1px solid #e2e2e2', borderRadius: 7, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#333', background: '#fafafa' }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>
              Message / Special Requirements
            </label>
            <textarea
              name="message" rows={3} placeholder="Any special requirements or questions?"
              style={{ width: '100%', padding: '10px 13px', border: '1px solid #e2e2e2', borderRadius: 7, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', color: '#333', background: '#fafafa' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #B1723C, #6D4100)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', letterSpacing: 0.3 }}
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Quick info sidebar card ─── */
function InfoCard({ transport, pricingTabs }) {
  const rows = [
    transport.category?.name           && ['Category',        transport.category.name],
    transport.pricing_car?.vehicle_type && ['Vehicle Type',    transport.pricing_car.vehicle_type],
    transport.pricing_car?.person       && ['Car Capacity',    `${transport.pricing_car.person} persons`],
    transport.destination_name          && ['Destination',     transport.destination_name],
    (transport.distance_km || transport.destination_km) && ['Distance', `${transport.distance_km || transport.destination_km} km`],
    transport.location?.address         && ['Route',           transport.location.address],
    transport.min_advance_reservation   && ['Min. Reservation', `${transport.min_advance_reservation} day(s) ahead`],
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginTop: 24 }}>
      <div style={{ background: '#100C08', padding: '14px 20px' }}>
        <h6 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: 14, letterSpacing: 0.3 }}>
          Transport Details
        </h6>
      </div>
      <div style={{ padding: '4px 0' }}>
        {rows.map(([label, value], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 20px', borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <span style={{ fontSize: 13, color: '#888' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#333', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section heading ─── */
function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 20, fontWeight: 700, color: '#100C08', margin: '0 0 8px' }}>{children}</h4>
      <div style={{ width: 40, height: 3, background: '#B1723C', borderRadius: 2 }} />
    </div>
  );
}

/* ─── Page ─── */
export default async function TransportDetailPage({ params }) {
  const { slug } = await params;
  let transport = null;

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/transports/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const result = await res.json();
      if (result.success) transport = result.data;
    }
  } catch {}

  if (!transport) {
    transport = {
      _id: 'demo', slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content: '<p>Enjoy a comfortable, premium ride across Saudi Arabia with our professional transport services. Our vehicles are maintained to the highest standards and driven by experienced chauffeurs.</p>',
      pricing_car:   { vehicle_type: 'GMC Yukon', person: 7, price: 350, sale_price: 0,  enable_extra_service: false },
      pricing_bus:   { adult_price: 120, adult_sale_price: 0, child_price: 60,  enable_extra_service: false },
      pricing_train: { adult_price: 80,  adult_sale_price: 0, child_price: 45,  enable_extra_service: false },
      pricing_boat:  { adult_price: 200, adult_sale_price: 0, child_price: 120, enable_extra_service: false },
      feature_img: '/uploads/assets/placeholder.jpg',
      galleries: [],
      category: { name: 'Private Car' },
      attribute_features: ['FM Radio', 'Free Cancellation', 'Pay at Pickup', 'Steering Wheel'],
      attribute_type: ['Convertibles'],
      includes: [{ title: 'Pickup & Drop-off Service' }, { title: 'Professional Licensed Driver' }, { title: 'Air-Conditioned Vehicle' }],
      excludes: [{ title: 'Personal Expenses' }, { title: 'Entry Fees to Attractions' }],
      faqs: [
        { title: 'Is luggage included?',       content: 'Standard luggage is included at no extra charge. Oversized items may require additional arrangement.' },
        { title: 'Can I cancel my booking?',   content: 'Free cancellation is available up to 24 hours before the scheduled pick-up time.' },
        { title: 'Are child seats available?', content: 'Yes, child seats can be arranged on request. Please mention this when booking.' },
      ],
      location: { address: 'Makkah to Madina', country: 'Saudi Arabia', coordinates: { lat: null, lng: null } },
      destination_name: 'Al Madinah Al Munawwarah',
      distance_km: 450,
    };
  }

  /* Build pricing tab data — only for vehicle types that have prices */
  const pricingTabs = [
    transport.pricing_car?.price && {
      label: 'Car', icon: 'bi-car-front-fill', color: '#B1723C',
      price: transport.pricing_car.price,
      salePrice: transport.pricing_car.sale_price,
      sub: transport.pricing_car.vehicle_type ? `${transport.pricing_car.vehicle_type} · ${transport.pricing_car.person || '—'} seats` : null,
      childPrice: null,
      extraService: transport.pricing_car.enable_extra_service,
    },
    transport.pricing_bus?.adult_price && {
      label: 'Bus', icon: 'bi-bus-front-fill', color: '#2d6a9f',
      price: transport.pricing_bus.adult_price,
      salePrice: transport.pricing_bus.adult_sale_price,
      sub: 'Adult price',
      childPrice: transport.pricing_bus.child_price,
      extraService: transport.pricing_bus.enable_extra_service,
    },
    transport.pricing_train?.adult_price && {
      label: 'Train', icon: 'bi-train-front-fill', color: '#2e7d32',
      price: transport.pricing_train.adult_price,
      salePrice: transport.pricing_train.adult_sale_price,
      sub: 'Adult price',
      childPrice: transport.pricing_train.child_price,
      extraService: transport.pricing_train.enable_extra_service,
    },
    transport.pricing_boat?.adult_price && {
      label: 'Boat', icon: 'bi-water', color: '#0277bd',
      price: transport.pricing_boat.adult_price,
      salePrice: transport.pricing_boat.adult_sale_price,
      sub: 'Adult price',
      childPrice: transport.pricing_boat.child_price,
      extraService: transport.pricing_boat.enable_extra_service,
    },
    /* Legacy fallback */
    !transport.pricing_car?.price && transport.car_price && {
      label: 'Car', icon: 'bi-car-front-fill', color: '#B1723C',
      price: transport.car_price, salePrice: null,
      sub: transport.car_type ? `${transport.car_type} · ${transport.car_person || '—'} seats` : null,
      childPrice: null, extraService: false,
    },
  ].filter(Boolean);

  const featureIcons = {
    'FM Radio':          'bi-broadcast',
    'Free Cancellation': 'bi-arrow-counterclockwise',
    'Pay at Pickup':     'bi-cash-coin',
    'Shuttle to Car':    'bi-car-front-fill',
    'Steering Wheel':    'bi-life-preserver',
    'Air Conditioning':  'bi-thermometer-snow',
    'GPS':               'bi-geo-alt-fill',
    'WiFi':              'bi-wifi',
  };

  const lat = transport.location?.coordinates?.lat;
  const lng = transport.location?.coordinates?.lng;
  const banner = transport.feature_img || transport.galleries?.[0] || null;
  const galleries = Array.isArray(transport.galleries) ? transport.galleries : [];

  return (
    <>
      {/* ── Banner ── */}
      <div
        className="breadcrumb-area"
        style={banner ? { backgroundImage: `url(${banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2 style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{transport.title}</h2>
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
        <div className="container" style={{ marginTop: 24, marginBottom: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(galleries.length, 5)}, 1fr)`, gap: 8, borderRadius: 12, overflow: 'hidden' }}>
            {galleries.slice(0, 5).map((img, i) => (
              <div key={i} style={{ height: 180, overflow: 'hidden' }}>
                <img src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 70 }}>
        <div className="row g-5">

          {/* ── LEFT column ── */}
          <div className="col-lg-8">

            {/* Category + title */}
            {transport.category?.name && (
              <span style={{ background: '#B1723C', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {transport.category.name}
              </span>
            )}
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#100C08', lineHeight: 1.3, marginBottom: 12 }}>
              {transport.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #f0ece8' }}>
              {(transport.location?.address || transport.destination_name) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#666', fontSize: 14 }}>
                  <i className="bi bi-geo-alt-fill" style={{ color: '#B1723C' }} />
                  <span>{transport.location?.address || transport.destination_name}</span>
                </div>
              )}
              {(transport.distance_km || transport.destination_km) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#666', fontSize: 14 }}>
                  <i className="bi bi-signpost-split-fill" style={{ color: '#B1723C' }} />
                  <span>{transport.distance_km || transport.destination_km} km</span>
                </div>
              )}
              {transport.min_advance_reservation && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#666', fontSize: 14 }}>
                  <i className="bi bi-clock-fill" style={{ color: '#B1723C' }} />
                  <span>Book {transport.min_advance_reservation} day(s) ahead</span>
                </div>
              )}
            </div>

            {/* Description */}
            {transport.content && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle>Overview</SectionTitle>
                <div style={{ color: '#555', lineHeight: 1.85, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: transport.content }} />
              </div>
            )}

            {/* Pricing cards */}
            {pricingTabs.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle>Pricing Options</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                  {pricingTabs.map((tab, i) => (
                    <div key={i} style={{ border: `2px solid ${tab.color}22`, borderRadius: 12, padding: '20px 18px', background: `${tab.color}08`, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ width: 44, height: 44, background: `${tab.color}18`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <i className={`bi ${tab.icon}`} style={{ fontSize: 20, color: tab.color }} />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#333', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{tab.label}</p>
                      {tab.sub && <p style={{ fontSize: 11, color: '#888', margin: '0 0 10px', lineHeight: 1.4 }}>{tab.sub}</p>}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <span style={{ fontSize: 11, color: tab.color, fontWeight: 600 }}>SAR</span>
                        <span style={{ fontSize: 26, fontWeight: 800, color: tab.color, lineHeight: 1 }}>
                          {tab.salePrice > 0 ? tab.salePrice : tab.price}
                        </span>
                      </div>
                      {tab.salePrice > 0 && (
                        <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>SAR {tab.price}</span>
                      )}
                      {tab.childPrice > 0 && (
                        <p style={{ fontSize: 12, color: '#666', margin: '6px 0 0' }}>Child: SAR {tab.childPrice}</p>
                      )}
                      {tab.extraService && (
                        <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, background: `${tab.color}22`, color: tab.color, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
                          Extra service available
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {transport.attribute_features?.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle>Features & Amenities</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {transport.attribute_features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8f4f0', border: '1px solid #e8ddd5', borderRadius: 10, padding: '10px 18px', fontSize: 14, color: '#444' }}>
                      <div style={{ width: 34, height: 34, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bi ${featureIcons[f] || 'bi-check-circle-fill'}`} style={{ fontSize: 16, color: '#B1723C' }} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicle Type badges */}
            {transport.attribute_type?.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle>Vehicle Type</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {transport.attribute_type.map((t, i) => (
                    <span key={i} style={{ background: '#fff', border: '1.5px solid #B1723C', color: '#B1723C', borderRadius: 8, padding: '7px 20px', fontSize: 13, fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Includes / Excludes */}
            {(transport.includes?.length > 0 || transport.excludes?.length > 0) && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle>Includes & Excludes</SectionTitle>
                <div className="row g-4">
                  {transport.includes?.length > 0 && (
                    <div className="col-md-6">
                      <div style={{ background: '#f0faf2', borderRadius: 10, padding: '18px 20px', height: '100%' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#28a745', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          ✓ Included
                        </p>
                        {transport.includes.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                            <span style={{ width: 20, height: 20, background: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                              <i className="bi bi-check" style={{ color: '#fff', fontSize: 12, fontWeight: 700 }} />
                            </span>
                            <span style={{ fontSize: 14, color: '#444', lineHeight: 1.5 }}>{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {transport.excludes?.length > 0 && (
                    <div className="col-md-6">
                      <div style={{ background: '#fff5f5', borderRadius: 10, padding: '18px 20px', height: '100%' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#dc3545', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          ✗ Excluded
                        </p>
                        {transport.excludes.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                            <span style={{ width: 20, height: 20, background: '#dc3545', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                              <i className="bi bi-x" style={{ color: '#fff', fontSize: 14, fontWeight: 700 }} />
                            </span>
                            <span style={{ fontSize: 14, color: '#444', lineHeight: 1.5 }}>{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Map */}
            {lat && lng && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle>Location</SectionTitle>
                {transport.location?.address && (
                  <p style={{ color: '#666', fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="bi bi-geo-alt-fill" style={{ color: '#B1723C' }} />
                    {transport.location.address}
                    {transport.location.city && `, ${transport.location.city}`}
                    {transport.location.country && `, ${transport.location.country}`}
                  </p>
                )}
                <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <iframe
                    src={`https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`}
                    width="100%" height="340" style={{ border: 0, display: 'block' }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}

            {/* FAQs */}
            {transport.faqs?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <SectionTitle>Frequently Asked Questions</SectionTitle>
                <div className="accordion" id="transportFaqs">
                  {transport.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="accordion-item"
                      style={{ marginBottom: 10, border: '1px solid #ede8e2', borderRadius: 10, overflow: 'hidden' }}
                    >
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button${idx !== 0 ? ' collapsed' : ''}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#tfaq${idx}`}
                          style={{ fontWeight: 600, fontSize: 15, background: idx === 0 ? '#fdf8f4' : '#fff', color: '#100C08' }}
                        >
                          {faq.title}
                        </button>
                      </h2>
                      <div
                        id={`tfaq${idx}`}
                        className={`accordion-collapse collapse${idx === 0 ? ' show' : ''}`}
                        data-bs-parent="#transportFaqs"
                      >
                        <div className="accordion-body" style={{ color: '#555', fontSize: 14, lineHeight: 1.75 }}>
                          {faq.content || ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT sidebar ── */}
          <div className="col-lg-4">
            <BookingForm transport={transport} />
            <InfoCard transport={transport} pricingTabs={pricingTabs} />
          </div>

        </div>
      </div>

      <Newsletter />
    </>
  );
}
