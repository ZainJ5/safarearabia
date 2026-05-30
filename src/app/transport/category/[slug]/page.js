import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Transport Category: ${slug.replace(/-/g, ' ')}`,
  };
}

export default async function TransportCategoryPage({ params, searchParams }) {
  const { slug } = await params;
  let transports = [];
  let total = 0;
  
  try {
    const page = searchParams.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/transports?category=${slug}&page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      transports = result.data;
      total = result.pagination.total;
    }
  } catch (error) {
    console.error('Failed to fetch transports for category:', error);
  }

  if (!transports || transports.length === 0) {
    transports = [
      { _id: '1', slug: 'demo-transport', title: `Demo Transport for ${slug}`, car_price: 250, car_type: 'SUV', car_person: 5, category: { name: slug }, feature_img: '/uploads/assets/placeholder.jpg', location: { address: `Route for ${slug}` } }
    ];
  }

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>Transport: {slug.replace(/-/g, ' ')}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/transport">Transport</Link></li>
                  <li>{slug}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-list-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                {transports.map((transport) => (
                  <div key={transport._id} className="col-lg-4 col-md-6 mb-4">
                    <div className="single-tour-card h-100 border rounded overflow-hidden">
                      <div className="tour-image position-relative">
                        <Link href={`/transport/${transport.slug}`}>
                          <img 
                            src={transport.feature_img || '/uploads/assets/placeholder.jpg'} 
                            alt={transport.title} 
                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                          />
                        </Link>
                        {transport.car_price && (
                          <div className="price position-absolute bottom-0 start-0 bg-primary text-white p-2">
                            From ${transport.car_price}
                          </div>
                        )}
                      </div>
                      <div className="tour-content p-3">
                        <p className="text-muted mb-1">{transport.car_type || 'Vehicle'}</p>
                        <h4 className="mb-2">
                          <Link href={`/transport/${transport.slug}`} className="text-decoration-none text-dark">
                            {transport.title}
                          </Link>
                        </h4>
                        <div className="d-flex mb-3 text-muted small">
                           <span className="me-3"><i className="bi bi-people"></i> Up to {transport.car_person || 4} Pax</span>
                           {transport.location?.address && (
                             <span><i className="bi bi-geo-alt"></i> {transport.location.address}</span>
                           )}
                        </div>
                        <Link href={`/transport/${transport.slug}`} className="btn btn-outline-primary btn-sm">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
