import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Tour: ${slug.replace(/-/g, ' ')}`,
  };
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  let tour = null;
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/tours/${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        tour = result.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch tour detail:', error);
  }

  if (!tour) {
    tour = {
      _id: 'demo',
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content: '<p>Experience a spiritual journey like no other with our carefully curated packages. We provide comprehensive support from visa processing to comfortable accommodations near the Holy Masjid.</p><p>Our experienced team ensures your journey is seamless, allowing you to focus entirely on your spiritual goals. Each package includes guided Ziyarat tours, comfortable hotel stays, and reliable transportation.</p>',
      pricing: { price: 1500, sale_price: 1200 },
      category: { name: 'Premium Package' },
      features_image: '/uploads/sliders/egens-S8KiKhpF01.webp',
      galleries: ['/uploads/sliders/egens-S8KiKhpF01.webp', '/uploads/sliders/egens-fuD60wAN4P.webp', '/uploads/sliders/egens-GwxliwfgJ4.webp'],
      itinerary: [
        { title: 'Day 1 - Arrival in Jeddah', content: 'Airport pickup and transfer to Makkah hotel. Evening visit to Masjid al-Haram.' },
        { title: 'Day 2-5 - Makkah Stay', content: 'Perform Umrah rituals, visit historical sites, and attend prayers at Masjid al-Haram.' },
        { title: 'Day 6-9 - Madina Visit', content: 'Transfer to Madina. Visit Masjid an-Nabawi, Mount Uhud, and Quba Mosque.' },
        { title: 'Day 10 - Departure', content: 'Transfer to Jeddah airport for departure. End of tour.' },
      ],
      includes: [
        { title: 'Hotel Accommodation' },
        { title: 'Airport Transfers' },
        { title: 'Guided Ziyarat Tours' },
        { title: 'Visa Processing' },
        { title: 'Daily Breakfast' },
      ],
      excludes: [
        { title: 'International Flights' },
        { title: 'Personal Expenses' },
        { title: 'Travel Insurance' },
      ],
      faqs: [
        { title: 'What documents are needed?', content: 'Valid passport (6+ months), recent passport photos, and vaccination records.' },
        { title: 'Is travel insurance included?', content: 'Travel insurance is not included but can be arranged upon request.' },
      ],
      min_people: 1,
      max_people: 15,
    };
  }

  return (
    <>
      <Breadcrumb title={tour.title} currentPage="Tour Details" />

      <div className="package-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Gallery */}
              <div className="package-img-wrap mb-40" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <img 
                  src={tour.features_image || '/uploads/placeholder.jpg'} 
                  alt={tour.title}
                  style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                />
              </div>

              {/* Gallery thumbnails */}
              {tour.galleries && tour.galleries.length > 1 && (
                <div className="row mb-40" style={{ gap: '0' }}>
                  {tour.galleries.slice(0, 4).map((img, i) => (
                    <div key={i} className="col-3">
                      <img 
                        src={img} 
                        alt={`Gallery ${i+1}`}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '5px', cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tour Content */}
              <div className="package-content mb-40">
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '20px' }}>{tour.title}</h2>
                <div className="d-flex flex-wrap gap-4 mb-20" style={{ fontSize: '14px', color: 'var(--text-color, #787878)' }}>
                  {tour.category && (
                    <span><i className="bi bi-tag" style={{ color: 'var(--primary-color1)' }}></i> {tour.category.name}</span>
                  )}
                  {tour.min_people && (
                    <span><i className="bi bi-people" style={{ color: 'var(--primary-color1)' }}></i> {tour.min_people}-{tour.max_people} People</span>
                  )}
                  <span>
                    {[1,2,3,4,5].map(s => (
                      <i key={s} className="bi bi-star-fill" style={{ color: '#FBB03B', fontSize: '12px', marginRight: '2px' }}></i>
                    ))}
                  </span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: tour.content }} style={{ color: 'var(--text-color, #787878)', lineHeight: 1.8 }} />
              </div>

              {/* Includes & Excludes */}
              {(tour.includes?.length > 0 || tour.excludes?.length > 0) && (
                <div className="row mb-40">
                  {tour.includes?.length > 0 && (
                    <div className="col-md-6 mb-4">
                      <div style={{ background: '#f8fff5', borderRadius: '10px', padding: '25px', border: '1px solid #e0f0d8' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#28a745' }}>
                          <i className="bi bi-check-circle"></i> Includes
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {tour.includes.map((item, i) => (
                            <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                              <i className="bi bi-check-lg" style={{ color: '#28a745' }}></i>
                              {item.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {tour.excludes?.length > 0 && (
                    <div className="col-md-6 mb-4">
                      <div style={{ background: '#fff5f5', borderRadius: '10px', padding: '25px', border: '1px solid #f0d8d8' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#dc3545' }}>
                          <i className="bi bi-x-circle"></i> Excludes
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {tour.excludes.map((item, i) => (
                            <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                              <i className="bi bi-x-lg" style={{ color: '#dc3545' }}></i>
                              {item.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary?.length > 0 && (
                <div className="mb-40">
                  <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '25px' }}>
                    <i className="bi bi-map" style={{ color: 'var(--primary-color1)', marginRight: '10px' }}></i>
                    Tour Itinerary
                  </h3>
                  <div className="accordion" id="itineraryAccordion">
                    {tour.itinerary.map((item, i) => (
                      <div className="accordion-item" key={i} style={{ marginBottom: '10px', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <h2 className="accordion-header">
                          <button 
                            className={`accordion-button ${i > 0 ? 'collapsed' : ''}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#itinerary-${i}`}
                            style={{ fontWeight: 600, fontSize: '16px' }}
                          >
                            {item.title}
                          </button>
                        </h2>
                        <div id={`itinerary-${i}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} data-bs-parent="#itineraryAccordion">
                          <div className="accordion-body" style={{ color: 'var(--text-color, #787878)', fontSize: '14px', lineHeight: 1.7 }}>
                            {item.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {tour.faqs?.length > 0 && (
                <div className="mb-40">
                  <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '25px' }}>
                    <i className="bi bi-question-circle" style={{ color: 'var(--primary-color1)', marginRight: '10px' }}></i>
                    Frequently Asked Questions
                  </h3>
                  <div className="accordion" id="faqAccordion">
                    {tour.faqs.map((faq, i) => (
                      <div className="accordion-item" key={i} style={{ marginBottom: '10px', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${i}`} style={{ fontWeight: 600, fontSize: '15px' }}>
                            {faq.title}
                          </button>
                        </h2>
                        <div id={`faq-${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body" style={{ color: 'var(--text-color, #787878)', fontSize: '14px', lineHeight: 1.7 }}>
                            {faq.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="col-lg-4">
              <div style={{ position: 'sticky', top: '100px' }}>
                {/* Price Card */}
                <div style={{
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  marginBottom: '25px',
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, var(--primary-color1), var(--primary-color2))',
                    padding: '25px',
                    textAlign: 'center',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Starting From</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      {tour.pricing?.sale_price && tour.pricing.sale_price < tour.pricing.price && (
                        <span style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', fontSize: '20px' }}>
                          ${tour.pricing.price}
                        </span>
                      )}
                      <span style={{ color: '#fff', fontSize: '36px', fontWeight: 700 }}>
                        ${tour.pricing?.sale_price || tour.pricing?.price || 'N/A'}
                      </span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>per person</span>
                  </div>
                  <div style={{ padding: '25px' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Select Date</label>
                      <input type="date" className="form-control" style={{ height: '48px' }} />
                    </div>
                    <div className="row mb-15">
                      <div className="col-6">
                        <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Adults</label>
                        <input type="number" className="form-control" defaultValue={1} min={1} style={{ height: '48px' }} />
                      </div>
                      <div className="col-6">
                        <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Children</label>
                        <input type="number" className="form-control" defaultValue={0} min={0} style={{ height: '48px' }} />
                      </div>
                    </div>
                    <Link 
                      href={`/checkout/tour/${tour._id}`}
                      className="primary-btn1 w-100 mt-3"
                      style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}
                    >
                      Book Now
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                        <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Contact Card */}
                <div style={{
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  padding: '25px',
                }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Need Help?</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(177,114,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-telephone" style={{ color: 'var(--primary-color1)', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-color)' }}>Call Us</span>
                      <h6 style={{ marginBottom: 0, fontSize: '15px' }}><a href="tel:+923051309051" style={{ color: 'var(--primary-color1)' }}>+92 305 1309051</a></h6>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(177,114,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-envelope" style={{ color: 'var(--primary-color1)', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-color)' }}>Email Us</span>
                      <h6 style={{ marginBottom: 0, fontSize: '15px' }}><a href="mailto:info@safarearabiantravel.com" style={{ color: 'var(--primary-color1)' }}>info@safarearabiantravel.com</a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
