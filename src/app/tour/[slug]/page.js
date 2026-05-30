import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${appUrl}/api/tours/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return { title: result.data.title, description: result.data.seo?.meta_desc || result.data.content?.replace(/<[^>]+>/g, '').slice(0, 160) };
      }
    }
  } catch {}
  return { title: slug.replace(/-/g, ' ') };
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  let tour = null;

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/tours/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const result = await res.json();
      if (result.success) tour = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch tour detail:', error);
  }

  if (!tour) {
    tour = {
      _id: 'demo', slug,
      title: 'Embracing City Lights, Land And Iconic Culture',
      content: '<p>Tour and travel refer to the activities related to planning, organizing, and experiencing trips to various destinations for leisure, exploration, adventure, or relaxation. Choose your destination based on your interests and preferences, whether it\'s a cultural experience, a natural adventure, historical exploration, or a beach vacation.</p><p>Book suitable accommodation, which can range from hotels, hostels, vacation rentals, or even camping depending on your travel style and destination.</p>',
      pricing: { price: 1500, sale_price: 1200 },
      category: { name: 'Premium Package' },
      features_image: '/uploads/assets/placeholder.jpg',
      galleries: [],
      min_people: 1, max_people: 15,
      includes: [
        { title: 'Hotel Accommodation' }, { title: 'Airport Transfers' },
        { title: 'Guided Ziyarat Tours' }, { title: 'Visa Processing' }, { title: 'Daily Breakfast' },
      ],
      excludes: [
        { title: 'International Flights' }, { title: 'Personal Expenses' }, { title: 'Travel Insurance' },
      ],
      highlights: [
        { title: 'Our Team Of Knowledgeable Guides And Travel Experts Are Dedicated To Making Your Journey Memorable And Worry-Free' },
        { title: 'We Take Care Of All The Details, So You Can Focus On Creating Memories' },
        { title: 'From Accommodations To Dining Experiences, We Select The Best Partners' },
      ],
      itinerary: [
        { title: 'Day 1 - Arrival in Jeddah', content: 'Airport pickup and transfer to Makkah hotel. Evening visit to Masjid al-Haram.' },
        { title: 'Day 2-5 - Makkah Stay', content: 'Perform Umrah rituals, visit historical sites, and attend prayers at Masjid al-Haram.' },
        { title: 'Day 6-9 - Madina Visit', content: 'Transfer to Madina. Visit Masjid an-Nabawi, Mount Uhud, and Quba Mosque.' },
        { title: 'Day 10 - Departure', content: 'Transfer to Jeddah airport for departure. End of tour.' },
      ],
      faqs: [
        { title: 'What Services Do You Offer?', content: 'We provide flight bookings, hotel reservations, holiday packages, visa assistance, travel insurance, and customized travel itineraries.' },
        { title: 'How Can I Book A Trip With Your Agency?', content: 'You can book directly through our website or contact our agents.' },
        { title: 'Do You Offer Group Discounts?', content: 'Yes, we offer special group rates for parties of 10 or more.' },
        { title: 'Can I Customize My Travel Itinerary?', content: 'Absolutely! We specialise in creating bespoke travel experiences tailored to your preferences.' },
        { title: 'What Payment Methods Do You Accept?', content: 'We accept all major credit cards, bank transfers, and PayPal.' },
      ],
      location: { address: 'Makkah, Saudi Arabia', coordinates: { lat: 21.4225, lng: 39.8262 } },
    };
  }

  const price = tour.pricing?.sale_price > 0 ? tour.pricing.sale_price : tour.pricing?.price;
  const lat = tour.location?.coordinates?.lat;
  const lng = tour.location?.coordinates?.lng;

  return (
    <>
      {/* Banner */}
      <div className="breadcrumb-area" style={{ backgroundImage: tour.features_image ? `url(${tour.features_image})` : undefined }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>{tour.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li>{tour.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {tour.galleries && tour.galleries.length > 0 && (
        <div className="container" style={{ marginTop: 24, marginBottom: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(tour.galleries.length, 5)}, 1fr)`, gap: 8 }}>
            {tour.galleries.slice(0, 5).map((img, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: 'hidden', height: 180 }}>
                <img src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {tour.category?.name && (
              <span style={{ background: '#B1723C', color: '#fff', fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {tour.category.name}
              </span>
            )}

            <h1 style={{ fontSize: 30, fontWeight: 700, color: '#100C08', lineHeight: 1.3, marginBottom: 16 }}>{tour.title}</h1>

            {/* Price & Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              {price > 0 && (
                <div style={{ background: '#B1723C', color: '#fff', padding: '8px 18px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, opacity: 0.85 }}>Sar</span>
                  <span style={{ fontSize: 22, fontWeight: 700 }}>{price}</span>
                  <span style={{ fontSize: 12, opacity: 0.85 }}>per person</span>
                </div>
              )}
              {tour.max_people > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555', fontSize: 14 }}>
                  <span>&#128101;</span>
                  <span>Max People: {tour.max_people}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ color: '#555', lineHeight: 1.8, fontSize: 15, marginBottom: 30 }} dangerouslySetInnerHTML={{ __html: tour.content }} />

            {/* Include & Exclude */}
            {(tour.includes?.length > 0 || tour.excludes?.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
                {tour.includes?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#100C08', marginBottom: 14 }}>Include Features</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {tour.includes.map((inc, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14, color: '#555' }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <span style={{ color: '#28a745', fontSize: 11, fontWeight: 700 }}>✓</span>
                          </span>
                          {inc.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#100C08', marginBottom: 14 }}>Exclude Features</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {tour.excludes.map((exc, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14, color: '#555' }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <span style={{ color: '#dc3545', fontSize: 13, fontWeight: 700 }}>✗</span>
                          </span>
                          {exc.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Highlights of the Tour</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tour.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f8f4f0', border: '2px solid #B1723C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#B1723C', fontSize: 12 }}>✓</span>
                      </div>
                      {h.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Itinerary</h4>
                <div className="accordion" id="tourItinAccordion">
                  {tour.itinerary.map((day, i) => (
                    <div key={i} style={{ marginBottom: 8, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                      <div data-bs-toggle="collapse" data-bs-target={`#tourItin-${i}`}
                        style={{ background: i === 0 ? '#B1723C' : '#6D4100', color: '#fff', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15 }}>
                        <span>{day.title}</span>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>&#8963;</span>
                      </div>
                      <div id={`tourItin-${i}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} data-bs-parent="#tourItinAccordion">
                        <div style={{ padding: '16px 20px', fontSize: 14, color: '#555', lineHeight: 1.7 }}>{day.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            {lat && lng && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Location Map</h4>
                <div style={{ borderRadius: 10, overflow: 'hidden', height: 280 }}>
                  <iframe
                    title="Location Map"
                    src={`https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`}
                    width="100%" height="280" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* FAQs */}
            {tour.faqs && tour.faqs.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Frequently Asked Questions</h4>
                <div className="accordion" id="tourFaqAccordion">
                  {tour.faqs.map((faq, i) => (
                    <div key={i} style={{ marginBottom: 4, borderBottom: '1px solid #eee' }}>
                      <div data-bs-toggle="collapse" data-bs-target={`#tourFaq-${i}`} style={{ padding: '14px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 500, fontSize: 15, color: '#100C08' }}>
                        <span>{faq.title}</span>
                        <span style={{ fontSize: 18, color: '#B1723C', lineHeight: 1 }}>+</span>
                      </div>
                      <div id={`tourFaq-${i}`} className="accordion-collapse collapse" data-bs-parent="#tourFaqAccordion">
                        <div style={{ padding: '0 0 16px', fontSize: 14, color: '#666', lineHeight: 1.7 }}>{faq.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Booking */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 20 }}>
                <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', padding: '20px 24px', textAlign: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, display: 'block', marginBottom: 4 }}>Starting From</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {tour.pricing?.sale_price > 0 && tour.pricing.sale_price < tour.pricing.price && (
                      <span style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', fontSize: 18 }}>SAR {tour.pricing.price}</span>
                    )}
                    <span style={{ color: '#fff', fontSize: 36, fontWeight: 700 }}>SAR {price || '—'}</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>per person</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Select Date</label>
                    <input type="date" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Adults</label>
                      <input type="number" defaultValue={1} min={1} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Children</label>
                      <input type="number" defaultValue={0} min={0} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none' }} />
                    </div>
                  </div>
                  <Link href={`/checkout/tour/${tour._id}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '14px', background: 'linear-gradient(135deg, #B1723C, #6D4100)', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                    Book Now &#8594;
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '24px' }}>
                <h5 style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>Need Help?</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(177,114,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-telephone" style={{ color: '#B1723C', fontSize: 18 }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#888' }}>Call Us</span>
                    <h6 style={{ marginBottom: 0, fontSize: 14 }}><a href="tel:+923051309051" style={{ color: '#B1723C' }}>+92 305 1309051</a></h6>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(177,114,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-envelope" style={{ color: '#B1723C', fontSize: 18 }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#888' }}>Email Us</span>
                    <h6 style={{ marginBottom: 0, fontSize: 14 }}><a href="mailto:info@safarearabiantravel.com" style={{ color: '#B1723C' }}>info@safarearabiantravel.com</a></h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
