import Link from 'next/link';
import BookingSidebar from '@/components/BookingSidebar';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Hotel: ${slug.replace(/-/g, ' ')}`,
  };
}

export default async function HotelDetailPage({ params }) {
  const { slug } = await params;
  let hotel = null;
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/hotels/${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        hotel = result.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch hotel detail:', error);
  }

  if (!hotel) {
    hotel = {
      _id: 'demo',
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content: '<p>A beautiful hotel for a comfortable stay during your pilgrimage.</p>',
      price: 250,
      category: { name: 'Makkah Hotels' },
      feature_img: '/uploads/assets/placeholder.jpg',
      check_in: '14:00',
      check_out: '12:00',
      room_type: 'Double',
      location: {
        address: 'King Abdul Aziz Endowment, Makkah'
      },
      policies: []
    };
  }

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>{hotel.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/all-hotels">Hotels</Link></li>
                  <li>{hotel.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tour-details-content">
                <img 
                  src={hotel.feature_img || '/uploads/assets/placeholder.jpg'} 
                  alt={hotel.title} 
                  className="img-fluid rounded mb-4" 
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                />
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">{hotel.title}</h3>
                  {hotel.price && <h4 className="text-primary mb-0">${hotel.price} <small className="text-muted">/ night</small></h4>}
                </div>
                
                {hotel.location?.address && (
                  <p className="text-muted mb-4">
                    <i className="bi bi-geo-alt"></i> {hotel.location.address}
                  </p>
                )}
                
                <div className="overview-section mb-4">
                  <h5>Overview</h5>
                  <div dangerouslySetInnerHTML={{ __html: hotel.content }} />
                </div>
                
                <div className="info-grid row mb-4">
                  <div className="col-md-4 mb-3">
                    <div className="info-box p-3 border rounded text-center">
                      <i className="bi bi-clock text-primary fs-3 mb-2 d-block"></i>
                      <strong>Check In</strong>
                      <p className="mb-0 text-muted">{hotel.check_in || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="info-box p-3 border rounded text-center">
                      <i className="bi bi-clock-history text-primary fs-3 mb-2 d-block"></i>
                      <strong>Check Out</strong>
                      <p className="mb-0 text-muted">{hotel.check_out || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="info-box p-3 border rounded text-center">
                      <i className="bi bi-door-closed text-primary fs-3 mb-2 d-block"></i>
                      <strong>Room Type</strong>
                      <p className="mb-0 text-muted">{hotel.room_type || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {hotel.policies && hotel.policies.length > 0 && (
                  <div className="policies-section mb-4">
                    <h5>Policies</h5>
                    <div className="accordion" id="policiesAccordion">
                      {hotel.policies.map((policy, idx) => (
                        <div className="accordion-item" key={idx}>
                          <h2 className="accordion-header" id={`heading${idx}`}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`}>
                              {policy.title}
                            </button>
                          </h2>
                          <div id={`collapse${idx}`} className="accordion-collapse collapse" data-bs-parent="#policiesAccordion">
                            <div className="accordion-body">
                              {policy.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-lg-4">
              <BookingSidebar
                productId={hotel._id}
                productType="hotel"
                title={hotel.title}
                price={hotel.price}
                priceLabel="/ night"
                showCheckout
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
