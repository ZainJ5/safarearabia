import Link from 'next/link';
import BookingSidebar from '@/components/BookingSidebar';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Activity: ${slug.replace(/-/g, ' ')}` };
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
      _id: 'demo',
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content: '<p>An exciting activity experience during your pilgrimage journey.</p>',
      pricing: { price: 120, child_price: 60 },
      duration_days: 1,
      min_people: 1,
      max_people: 20,
      feature_img: '/uploads/assets/placeholder.jpg',
      location: { address: 'Makkah, Saudi Arabia' },
      includes: [{ title: 'Professional Guide' }, { title: 'Transportation' }],
      excludes: [{ title: 'Personal Expenses' }],
      faqs: [],
    };
  }

  const price = activity.pricing?.sale_price || activity.pricing?.price;

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>{activity.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/activities">Activities</Link></li>
                  <li>{activity.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="tour-details-content">
                <img
                  src={activity.feature_img || '/uploads/assets/placeholder.jpg'}
                  alt={activity.title}
                  className="img-fluid rounded mb-4"
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">{activity.title}</h3>
                  {price && (
                    <h4 style={{ color: 'var(--primary-color1)' }} className="mb-0">
                      ${price} <small className="text-muted fs-6">/ person</small>
                    </h4>
                  )}
                </div>

                {activity.location?.address && (
                  <p className="text-muted mb-4">
                    <i className="bi bi-geo-alt me-1"></i>{activity.location.address}
                  </p>
                )}

                {/* Quick Info */}
                <div className="row mb-4">
                  {activity.duration_days && (
                    <div className="col-md-4 mb-3">
                      <div className="info-box p-3 border rounded text-center">
                        <i className="bi bi-clock fs-3 mb-2 d-block" style={{ color: 'var(--primary-color1)' }}></i>
                        <strong>Duration</strong>
                        <p className="mb-0 text-muted">{activity.duration_days} Day{activity.duration_days > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                  {activity.min_people && (
                    <div className="col-md-4 mb-3">
                      <div className="info-box p-3 border rounded text-center">
                        <i className="bi bi-people fs-3 mb-2 d-block" style={{ color: 'var(--primary-color1)' }}></i>
                        <strong>Group Size</strong>
                        <p className="mb-0 text-muted">{activity.min_people}–{activity.max_people || '∞'} People</p>
                      </div>
                    </div>
                  )}
                  {activity.pricing?.child_price && (
                    <div className="col-md-4 mb-3">
                      <div className="info-box p-3 border rounded text-center">
                        <i className="bi bi-person-hearts fs-3 mb-2 d-block" style={{ color: 'var(--primary-color1)' }}></i>
                        <strong>Child Price</strong>
                        <p className="mb-0 text-muted">${activity.pricing.child_price}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overview */}
                <div className="overview-section mb-4">
                  <h5>Overview</h5>
                  <div dangerouslySetInnerHTML={{ __html: activity.content }} />
                </div>

                {/* Includes / Excludes */}
                {(activity.includes?.length > 0 || activity.excludes?.length > 0) && (
                  <div className="row mb-4">
                    {activity.includes?.length > 0 && (
                      <div className="col-md-6">
                        <div className="bg-light p-4 rounded h-100">
                          <h6 className="mb-3 fw-bold">
                            <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745' }}></i>
                            What&apos;s Included
                          </h6>
                          <ul className="list-unstyled mb-0">
                            {activity.includes.map((inc, i) => (
                              <li key={i} className="mb-2 d-flex align-items-start">
                                <i className="bi bi-check2 me-2 mt-1" style={{ color: '#28a745' }}></i>
                                {inc.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {activity.excludes?.length > 0 && (
                      <div className="col-md-6">
                        <div className="bg-light p-4 rounded h-100">
                          <h6 className="mb-3 fw-bold">
                            <i className="bi bi-x-circle-fill me-2" style={{ color: '#dc3545' }}></i>
                            Not Included
                          </h6>
                          <ul className="list-unstyled mb-0">
                            {activity.excludes.map((exc, i) => (
                              <li key={i} className="mb-2 d-flex align-items-start">
                                <i className="bi bi-x me-2 mt-1" style={{ color: '#dc3545' }}></i>
                                {exc.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FAQs */}
                {activity.faqs?.length > 0 && (
                  <div className="faqs-section mb-4">
                    <h5>Frequently Asked Questions</h5>
                    <div className="accordion" id="faqsAccordion">
                      {activity.faqs.map((faq, idx) => (
                        <div className="accordion-item" key={idx}>
                          <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${idx}`}>
                              {faq.title}
                            </button>
                          </h2>
                          <div id={`faq${idx}`} className="accordion-collapse collapse" data-bs-parent="#faqsAccordion">
                            <div className="accordion-body">{faq.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <BookingSidebar
                productId={activity._id}
                productType="activity"
                title={activity.title}
                price={price}
                priceLabel="/ person"
                showCheckout
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
