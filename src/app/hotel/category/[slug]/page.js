import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Hotels in ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
  };
}

export default async function HotelCategoryPage({ params, searchParams }) {
  const { slug } = await params;
  let hotels = [];
  let total = 0;
  
  try {
    const page = searchParams.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/hotels?category=${slug}&page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      hotels = result.data;
      total = result.pagination.total;
    }
  } catch (error) {
    console.error('Failed to fetch hotels for category:', error);
  }

  if (!hotels || hotels.length === 0) {
    hotels = [
      { _id: '1', slug: 'demo-hotel-1', title: `Demo Hotel in ${slug}`, price: 200, category: { name: slug }, feature_img: '/uploads/assets/placeholder.jpg', location: { address: `Central Area, ${slug}` } }
    ];
  }

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>Hotels in {slug.charAt(0).toUpperCase() + slug.slice(1)}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/all-hotels">Hotels</Link></li>
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
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="col-lg-4 col-md-6 mb-4">
                    <div className="single-tour-card h-100 border rounded overflow-hidden">
                      <div className="tour-image position-relative">
                        <Link href={`/hotel/${hotel.slug}`}>
                          <img 
                            src={hotel.feature_img || '/uploads/assets/placeholder.jpg'} 
                            alt={hotel.title} 
                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                          />
                        </Link>
                        {hotel.price && (
                          <div className="price position-absolute bottom-0 start-0 bg-primary text-white p-2">
                            ${hotel.price} / night
                          </div>
                        )}
                      </div>
                      <div className="tour-content p-3">
                        <h4 className="mb-2">
                          <Link href={`/hotel/${hotel.slug}`} className="text-decoration-none text-dark">
                            {hotel.title}
                          </Link>
                        </h4>
                        {hotel.location?.address && (
                          <p className="text-muted small mb-3">
                            <i className="bi bi-geo-alt"></i> {hotel.location.address}
                          </p>
                        )}
                        <Link href={`/hotel/${hotel.slug}`} className="btn btn-outline-primary btn-sm">
                          View Details
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
