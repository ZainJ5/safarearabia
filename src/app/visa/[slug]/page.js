import Link from 'next/link';
import BookingSidebar from '@/components/BookingSidebar';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Visa: ${slug.replace(/-/g, ' ')}`,
  };
}

export default async function VisaDetailPage({ params }) {
  const { slug } = await params;
  let visa = null;
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/visas/${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        visa = result.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch visa detail:', error);
  }

  if (!visa) {
    visa = {
      _id: 'demo',
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      cost: 150,
      processing: '2-3 Days',
      validity: '30 Days',
      maximum_stay: '30 Days',
      visa_mode: 'E-Visa',
      features_image: '/uploads/assets/placeholder.jpg',
      includes: [{ title: 'Visa Processing Fee' }, { title: 'Health Insurance' }],
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

      <div className="tour-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tour-details-content">
                <img 
                  src={visa.features_image || '/uploads/assets/placeholder.jpg'} 
                  alt={visa.title} 
                  className="img-fluid rounded mb-4" 
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                />
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">{visa.title}</h3>
                  {visa.cost && <h4 className="text-primary mb-0">${visa.cost}</h4>}
                </div>
                
                <div className="info-grid row mb-4">
                  <div className="col-md-4 mb-3">
                    <div className="info-box p-3 border rounded text-center h-100">
                      <i className="bi bi-clock-history text-primary fs-3 mb-2 d-block"></i>
                      <strong>Processing Time</strong>
                      <p className="mb-0 text-muted">{visa.processing || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="info-box p-3 border rounded text-center h-100">
                      <i className="bi bi-calendar-check text-primary fs-3 mb-2 d-block"></i>
                      <strong>Validity</strong>
                      <p className="mb-0 text-muted">{visa.validity || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="info-box p-3 border rounded text-center h-100">
                      <i className="bi bi-file-earmark-text text-primary fs-3 mb-2 d-block"></i>
                      <strong>Visa Mode</strong>
                      <p className="mb-0 text-muted">{visa.visa_mode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {visa.includes && visa.includes.length > 0 && (
                  <div className="includes-section bg-light p-4 rounded mb-4">
                    <h5 className="mb-3">What's Included</h5>
                    <ul className="list-unstyled mb-0">
                      {visa.includes.map((inc, i) => (
                        <li key={i} className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>{inc.title}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {visa.faqs && visa.faqs.length > 0 && (
                  <div className="faqs-section mb-4">
                    <h5>Frequently Asked Questions</h5>
                    <div className="accordion" id="faqsAccordion">
                      {visa.faqs.map((faq, idx) => (
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
                productId={visa._id}
                productType="visa"
                title={visa.title}
                price={visa.cost}
                priceLabel="/ person"
                showCheckout
                extraInfo={[
                  { label: 'Processing', value: visa.processing || 'N/A' },
                  { label: 'Validity', value: visa.validity || 'N/A' },
                  { label: 'Mode', value: visa.visa_mode || 'N/A' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
