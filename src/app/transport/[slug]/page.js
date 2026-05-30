import Link from 'next/link';
import BookingSidebar from '@/components/BookingSidebar';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Transport: ${slug.replace(/-/g, ' ')}`,
  };
}

export default async function TransportDetailPage({ params }) {
  const { slug } = await params;
  let transport = null;
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/transports/${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        transport = result.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch transport detail:', error);
  }

  if (!transport) {
    transport = {
      _id: 'demo',
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content: '<p>Enjoy a comfortable ride with our VIP transport service.</p>',
      car_price: 350,
      car_type: 'GMC Yukon',
      car_person: 7,
      feature_img: '/uploads/assets/placeholder.jpg',
      location: {
        address: 'Makkah to Madina'
      },
      faqs: []
    };
  }

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>{transport.title}</h2>
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

      <div className="tour-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tour-details-content">
                <img 
                  src={transport.feature_img || '/uploads/assets/placeholder.jpg'} 
                  alt={transport.title} 
                  className="img-fluid rounded mb-4" 
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                />
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">{transport.title}</h3>
                  {transport.car_price && <h4 className="text-primary mb-0">${transport.car_price}</h4>}
                </div>
                
                {transport.location?.address && (
                  <p className="text-muted mb-4">
                    <i className="bi bi-geo-alt"></i> Route: {transport.location.address}
                  </p>
                )}
                
                <div className="overview-section mb-4">
                  <h5>Service Overview</h5>
                  <div dangerouslySetInnerHTML={{ __html: transport.content }} />
                </div>
                
                <div className="info-grid row mb-4">
                  <div className="col-md-6 mb-3">
                    <div className="info-box p-3 border rounded text-center">
                      <i className="bi bi-car-front text-primary fs-3 mb-2 d-block"></i>
                      <strong>Vehicle Type</strong>
                      <p className="mb-0 text-muted">{transport.car_type || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="info-box p-3 border rounded text-center">
                      <i className="bi bi-people text-primary fs-3 mb-2 d-block"></i>
                      <strong>Capacity</strong>
                      <p className="mb-0 text-muted">Up to {transport.car_person || '4'} Passengers</p>
                    </div>
                  </div>
                </div>

                {transport.faqs && transport.faqs.length > 0 && (
                  <div className="faqs-section mb-4">
                    <h5>Frequently Asked Questions</h5>
                    <div className="accordion" id="faqsAccordion">
                      {transport.faqs.map((faq, idx) => (
                        <div className="accordion-item" key={idx}>
                          <h2 className="accordion-header" id={`heading${idx}`}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`}>
                              {faq.title}
                            </button>
                          </h2>
                          <div id={`collapse${idx}`} className="accordion-collapse collapse" data-bs-parent="#faqsAccordion">
                            <div className="accordion-body">
                              {faq.content}
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
                productId={transport._id}
                productType="transport"
                title={transport.title}
                price={transport.car_price}
                priceLabel="/ trip"
                showCheckout
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
