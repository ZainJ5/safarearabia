import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${appUrl}/api/activities/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return { title: result.data.title, description: result.data.seo?.meta_desc || result.data.content?.replace(/<[^>]+>/g, '').slice(0, 160) };
      }
    }
  } catch {}
  return { title: slug.replace(/-/g, ' ') };
}

async function InquiryForm({ activityTitle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', padding: '20px 24px' }}>
        <h5 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: 18 }}>Reserve Your Activity</h5>
        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0', fontSize: 13 }}>Secure your spot for an unforgettable nature adventure now!</p>
      </div>
      <div style={{ padding: '24px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 16 }}>Inquiry Form</p>
        <form action="/api/contact" method="POST">
          <input type="hidden" name="subject" value={`Activity Inquiry: ${activityTitle}`} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 }}>Full Name *</label>
            <input name="name" required placeholder="Enter your full name" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 }}>Email Address *</label>
            <input name="email" type="email" required placeholder="Enter your email address" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 }}>WhatsApp Number *</label>
            <input name="phone" required placeholder="Enter your phone number" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 }}>Write Your Message *</label>
            <textarea name="message" required rows={4} placeholder="Write your spot" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #B1723C, #6D4100)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            Submit Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function ActivityDetailPage({ params }) {
  const { slug } = await params;
  let activity = null;

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/activities/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const result = await res.json();
      if (result.success) activity = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch activity detail:', error);
  }

  if (!activity) {
    activity = {
      _id: 'demo', slug,
      title: 'Embracing City Lights, Land And Iconic Culture',
      content: '<p>Tour and travel refer to the activities related to planning, organizing, and experiencing trips to various destinations for leisure, exploration, adventure, or relaxation. Choose your destination based on your interests and preferences, whether it\'s a cultural experience, a natural adventure, historical exploration, or a beach vacation.</p><p>Book suitable accommodation, which can range from hotels, hostels, vacation rentals, or even camping depending on your travel style and destination. Arrange transportation to and within your destination.</p>',
      pricing: { price: 600, sale_price: 0, child_price: 0 },
      category: { name: 'Adventures' },
      duration_days: 6, duration_nights: 5, min_people: 1, max_people: 3,
      feature_img: '/uploads/assets/placeholder.jpg',
      galleries: [],
      facilities: ['Mountain Bike', 'Satellite Office', 'Staff Lounge', 'WiFi'],
      travel_styles: ['Cultural', 'Festival & Events', 'Independent', 'Marine'],
      includes: [
        { title: 'Meal As Per Hotel And Drinks Free Tru' },
        { title: 'Return Airport And Round Trip Transfers' },
        { title: 'Accommodation On Two Sharing Basis' },
        { title: 'The Above Rates Are On Per Day Disposal Bas' },
        { title: 'Enjoy Brussels Day Tours. Overnight Brussels' },
      ],
      excludes: [
        { title: 'A/C Will Not Be Furnished On Hills Or Slopes' },
        { title: 'Any Other Service Not Mentioned' },
        { title: 'Additional Entry Fees Other Than Specified' },
        { title: 'Amsterdam Canal Cruise Not Included For Basic' },
      ],
      highlights: [
        { title: 'Our Team Of Knowledgeable Guides And Travel Experts Are Dedicated To Making Your Journey Memorable And Worry-Free' },
        { title: 'Our Team Of Knowledgeable Guides And Travel Experts Are Dedicated To Making Your Journey Memorable And Worry-Free' },
        { title: 'We Take Care Of All The Details, So You Can Focus On Creating Memories. Rest Assured That Your Journey Is In Capable Hands' },
        { title: 'Sip Cocktails On The Beach As You Watch The Sun Dip Below The Horizon' },
        { title: 'From Accommodations To Dining Experiences, We Select The Best Partners To Ensure Your Comfort And Enjoyment Throughout Your Journey' },
      ],
      itinerary: [
        { title: 'Day 1: Arrival and Welcome', content: 'Leisure Time To Explore Nearby Attractions Or Relax At The Hotel. Welcome Dinner At A Local Restaurant' },
        { title: 'Day 2: City Tour and Sightseeing', content: 'Full day city tour visiting all major attractions and landmarks.' },
        { title: 'Day 3: Excursion', content: 'Day trip to surrounding areas and natural landmarks.' },
        { title: 'Day 4: Cultural Experience', content: 'Immerse yourself in local culture, arts, and cuisine.' },
        { title: 'Day 5: Adventure Day', content: 'Outdoor activities and adventure sports.' },
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

  const price = activity.pricing?.sale_price > 0 ? activity.pricing.sale_price : activity.pricing?.price;
  const lat = activity.location?.coordinates?.lat;
  const lng = activity.location?.coordinates?.lng;

  const facilityIcons = {
    'Mountain Bike': '🚵', 'Satellite Office': '📡', 'Staff Lounge': '🛋️',
    'WiFi': '📶', 'Swimming Pool': '🏊', 'Gym': '💪',
    'Parking': '🅿️', 'Restaurant': '🍽️', 'Spa': '💆', 'Bar': '🍹',
  };

  return (
    <>
      {/* Banner */}
      <div className="breadcrumb-area" style={{ backgroundImage: activity.feature_img ? `url(${activity.feature_img})` : undefined }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>{activity.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li>{activity.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {activity.galleries && activity.galleries.length > 0 && (
        <div className="container" style={{ marginTop: 24, marginBottom: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(activity.galleries.length, 5)}, 1fr)`, gap: 8 }}>
            {activity.galleries.slice(0, 5).map((img, i) => (
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
            {/* Category badge */}
            {activity.category?.name && (
              <span style={{ background: '#B1723C', color: '#fff', fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {activity.category.name}
              </span>
            )}

            {/* Title */}
            <h1 style={{ fontSize: 30, fontWeight: 700, color: '#100C08', lineHeight: 1.3, marginBottom: 16 }}>{activity.title}</h1>

            {/* Price & Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              {price > 0 && (
                <div style={{ background: '#B1723C', color: '#fff', padding: '8px 18px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, opacity: 0.85 }}>Sar</span>
                  <span style={{ fontSize: 22, fontWeight: 700 }}>{price}</span>
                  <span style={{ fontSize: 12, opacity: 0.85 }}>per person</span>
                </div>
              )}
              {activity.duration_days > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555', fontSize: 14 }}>
                  <span>&#128336;</span>
                  <span>{activity.duration_days} Days{activity.duration_nights > 0 ? ` / ${activity.duration_nights} Nights` : ''}</span>
                </div>
              )}
              {activity.max_people > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555', fontSize: 14 }}>
                  <span>&#128101;</span>
                  <span>Max People: {activity.max_people}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ color: '#555', lineHeight: 1.8, fontSize: 15, marginBottom: 30 }} dangerouslySetInnerHTML={{ __html: activity.content }} />

            {/* Facilities */}
            {activity.facilities && activity.facilities.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Facilities</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {activity.facilities.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8f4f0', border: '1px solid #e8ddd5', borderRadius: 8, padding: '8px 16px', fontSize: 14, color: '#444' }}>
                      <span style={{ fontSize: 18 }}>{facilityIcons[f] || '✓'}</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Styles */}
            {activity.travel_styles && activity.travel_styles.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Travel Styles</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {activity.travel_styles.map((s, i) => (
                    <span key={i} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: '6px 16px', fontSize: 13, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B1723C', display: 'inline-block' }} />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Include & Exclude */}
            {(activity.includes?.length > 0 || activity.excludes?.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
                {activity.includes?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#100C08', marginBottom: 14 }}>Include Features</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {activity.includes.map((inc, i) => (
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
                {activity.excludes?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#100C08', marginBottom: 14 }}>Exclude Features</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {activity.excludes.map((exc, i) => (
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
            {activity.highlights && activity.highlights.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Highlights of the Tour</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {activity.highlights.map((h, i) => (
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
            {activity.itinerary && activity.itinerary.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Itinerary</h4>
                <div className="accordion" id="itinAccordion">
                  {activity.itinerary.map((day, i) => (
                    <div key={i} style={{ marginBottom: 8, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                      <div
                        data-bs-toggle="collapse"
                        data-bs-target={`#itin-${i}`}
                        style={{ background: i === 0 ? '#B1723C' : '#6D4100', color: '#fff', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15 }}
                      >
                        <span>{day.title}</span>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>&#8963;</span>
                      </div>
                      <div id={`itin-${i}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} data-bs-parent="#itinAccordion">
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
            {activity.faqs && activity.faqs.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#100C08', marginBottom: 16 }}>Frequently Asked Questions</h4>
                <div className="accordion" id="faqAccordion">
                  {activity.faqs.map((faq, i) => (
                    <div key={i} style={{ marginBottom: 4, borderBottom: '1px solid #eee' }}>
                      <div data-bs-toggle="collapse" data-bs-target={`#faq-${i}`} style={{ padding: '14px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 500, fontSize: 15, color: '#100C08' }}>
                        <span>{faq.title}</span>
                        <span style={{ fontSize: 18, color: '#B1723C', lineHeight: 1 }}>+</span>
                      </div>
                      <div id={`faq-${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div style={{ padding: '0 0 16px', fontSize: 14, color: '#666', lineHeight: 1.7 }}>{faq.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: 100 }}>
              <InquiryForm activityTitle={activity.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
