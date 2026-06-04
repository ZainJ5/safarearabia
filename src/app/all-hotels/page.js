export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Hotels Near Haram',
  description: 'Browse our curated selection of hotels near Masjid al-Haram in Makkah and Masjid an-Nabawi in Madina.',
};

export default async function HotelsPage({ searchParams }) {
  let hotels = [];
  
  try {
    const params = await searchParams;
    const page = params?.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/hotels?page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      hotels = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
  }

  if (!hotels || hotels.length === 0) {
    hotels = [
      { _id: '1', slug: 'hotel-makkah-towers', title: 'Makkah Towers Hotel', star_rating: 5, price_per_night: 280, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', location: { address: 'Near Masjid al-Haram' } },
      { _id: '2', slug: 'madina-grand-hotel', title: 'Madina Grand Hotel', star_rating: 4, price_per_night: 180, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', location: { address: 'Near Masjid an-Nabawi' } },
      { _id: '3', slug: 'jeddah-corniche-hotel', title: 'Jeddah Corniche Hotel', star_rating: 4, price_per_night: 150, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', location: { address: 'Jeddah Corniche Road' } },
      { _id: '4', slug: 'makkah-royal-suites', title: 'Makkah Royal Suites', star_rating: 5, price_per_night: 450, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', location: { address: 'Clock Tower, Makkah' } },
    ];
  }

  return (
    <>
      <Breadcrumb title="Hotels" currentPage="Hotels" />

      <div className="package-grid-with-sidebar pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="sidebar-area" style={{ position: 'sticky', top: '100px' }}>
                <div className="widget" style={{ background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color1)' }}>
                    Search Hotels
                  </h4>
                  <form action="/all-hotels" method="GET">
                    <div className="form-group mb-3">
                      <input type="text" name="q" className="form-control" placeholder="Hotel name or location..." style={{ height: '48px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <button type="submit" className="primary-btn1 w-100" style={{ display: 'flex', justifyContent: 'center' }}>Search</button>
                  </form>
                </div>

                <div className="widget" style={{ background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color1)' }}>
                    Locations
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {['Makkah', 'Madina', 'Jeddah'].map((loc, i) => (
                      <li key={i} style={{ marginBottom: '12px' }}>
                        <Link href={`/all-hotels?location=${loc.toLowerCase()}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderRadius: '5px', border: '1px solid #f0f0f0', color: 'var(--title-color, #100C08)', transition: '0.3s', fontSize: '14px' }}>
                          <span>{loc}</span>
                          <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Hotel Cards */}
            <div className="col-lg-8">
              <div className="row">
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="col-lg-6 col-md-6 mb-4">
                    <div className="package-card">
                      <div className="package-card-img-wrap">
                        <Link href={`/hotel/${hotel.slug}`}>
                          <img src={hotel.features_image || '/uploads/placeholder.jpg'} alt={hotel.title} />
                        </Link>
                        {hotel.star_rating && (
                          <div className="batch" style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary-color1)', color: '#fff', padding: '5px 12px', borderRadius: '3px', fontSize: '12px', fontWeight: 500 }}>
                            {hotel.star_rating} Star
                          </div>
                        )}
                      </div>
                      <div className="package-card-content">
                        <div className="card-content-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-color, #787878)', fontSize: '14px' }}>
                            <i className="bi bi-geo-alt"></i>
                            <span>{hotel.location?.address || 'Saudi Arabia'}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {Array.from({length: hotel.star_rating || 4}).map((_, s) => (
                              <i key={s} className="bi bi-star-fill" style={{ color: '#FBB03B', fontSize: '11px' }}></i>
                            ))}
                          </div>
                        </div>
                        <h3><Link href={`/hotel/${hotel.slug}`}>{hotel.title}</Link></h3>
                        <div className="card-content-bottom">
                          <div className="price-area">
                            <span>Per Night</span>
                            <h6>${hotel.price_per_night || 'N/A'}</h6>
                          </div>
                          <Link href={`/hotel/${hotel.slug}`} className="primary-btn2">
                            View Details
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                              <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </Link>
                        </div>
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
