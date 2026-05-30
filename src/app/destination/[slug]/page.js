import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Destination: ${slug.replace(/-/g, ' ')}`,
  };
}

export default async function DestinationDetailPage({ params }) {
  const { slug } = await params;
  let destination = null;
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/destinations/${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        destination = result.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch destination detail:', error);
  }

  if (!destination) {
    destination = {
      _id: 'demo',
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content: '<p>Discover the beauty and spirituality of this magnificent destination.</p>',
      galleries: ['/uploads/assets/placeholder.jpg', '/uploads/assets/placeholder.jpg']
    };
  }

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>{destination.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/destinations">Destinations</Link></li>
                  <li>{destination.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="destination-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-5">
              <img 
                src={destination.galleries?.[0] || '/uploads/assets/placeholder.jpg'} 
                alt={destination.title} 
                className="img-fluid rounded w-100" 
                style={{ maxHeight: '600px', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-8">
              <div className="destination-content mb-5">
                <h3 className="mb-4">About {destination.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: destination.content }} />
              </div>
              
              {destination.galleries && destination.galleries.length > 1 && (
                <div className="destination-gallery">
                  <h4 className="mb-4">Gallery</h4>
                  <div className="row">
                    {destination.galleries.slice(1).map((img, idx) => (
                      <div key={idx} className="col-md-6 mb-4">
                        <img 
                          src={img} 
                          alt={`${destination.title} gallery ${idx + 1}`} 
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="col-lg-4">
              <div className="sidebar-widget border rounded p-4 sticky-top" style={{ top: '100px' }}>
                <h4 className="widget-title mb-4">Plan Your Trip</h4>
                <p className="text-muted mb-4">Want to visit {destination.title}? Explore our customized packages and tours specifically designed for this destination.</p>
                <div className="d-grid gap-3">
                  <Link href="/tours" className="btn btn-primary w-100">Browse Packages</Link>
                  <Link href="/all-hotels" className="btn btn-outline-primary w-100">Find Hotels</Link>
                  <Link href="/transport" className="btn btn-outline-primary w-100">Book Transport</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
