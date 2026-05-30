import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Hajj & Umrah Packages',
  description: 'Explore our tailored Hajj and Umrah packages designed to make your sacred journey comfortable and spiritually fulfilling.',
};

export default async function ToursPage({ searchParams }) {
  let tours = [];
  let total = 0;
  
  try {
    const params = await searchParams;
    const page = params?.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/tours?page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      tours = result.data;
      total = result.pagination.total;
    }
  } catch (error) {
    console.error('Failed to fetch tours:', error);
  }

  if (!tours || tours.length === 0) {
    tours = [
      { _id: '1', slug: '14-days-premium-umrah', title: '14 Days Premium Umrah Package', pricing: { price: 1200, sale_price: 999 }, category: { name: 'Umrah Package' }, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp' },
      { _id: '2', slug: 'vip-hajj-2026', title: 'VIP Hajj Package 2026', pricing: { price: 9500 }, category: { name: 'Hajj Package' }, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp' },
      { _id: '3', slug: 'umrah-ramadan', title: 'Ramadan Special Umrah', pricing: { price: 2100 }, category: { name: 'Umrah Package' }, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp' },
      { _id: '4', slug: 'economy-umrah', title: 'Economy Umrah 7 Days', pricing: { price: 650 }, category: { name: 'Umrah Package' }, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp' },
    ];
  }

  return (
    <>
      <Breadcrumb title="Hajj & Umrah Packages" currentPage="Tours" />

      <div className="package-grid-with-sidebar pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="sidebar-area" style={{ position: 'sticky', top: '100px' }}>
                {/* Search Widget */}
                <div className="widget" style={{ background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color1)' }}>
                    Search Packages
                  </h4>
                  <form action="/tours" method="GET">
                    <div className="form-group mb-3">
                      <input type="text" name="q" className="form-control" placeholder="Search by name..." style={{ height: '48px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <button type="submit" className="primary-btn1 w-100" style={{ display: 'flex', justifyContent: 'center' }}>
                      Search
                    </button>
                  </form>
                </div>

                {/* Categories Widget */}
                <div className="widget" style={{ background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color1)' }}>
                    Categories
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {['Hajj Package', 'Umrah Package', 'Ramadan Special', 'VIP Package'].map((cat, i) => (
                      <li key={i} style={{ marginBottom: '12px' }}>
                        <Link href={`/tours?category=${cat.toLowerCase().replace(/ /g, '-')}`} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 15px',
                          borderRadius: '5px',
                          border: '1px solid #f0f0f0',
                          color: 'var(--title-color, #100C08)',
                          transition: '0.3s',
                          fontSize: '14px',
                        }}>
                          <span>{cat}</span>
                          <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Widget */}
                <div style={{
                  background: `linear-gradient(135deg, var(--primary-color1), var(--primary-color2))`,
                  borderRadius: '10px',
                  padding: '30px',
                  textAlign: 'center',
                }}>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '15px' }}>Need Help?</h4>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>
                    Contact us for custom packages tailored to your needs.
                  </p>
                  <Link href="/contact-us" style={{
                    background: '#fff',
                    color: 'var(--primary-color1)',
                    padding: '12px 25px',
                    borderRadius: '5px',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'inline-block',
                    transition: '0.3s',
                  }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Tour Cards Grid */}
            <div className="col-lg-8">
              <div className="row">
                {tours.map((tour) => (
                  <div key={tour._id} className="col-lg-6 col-md-6 mb-4">
                    <div className="package-card">
                      <div className="package-card-img-wrap">
                        <Link href={`/tour/${tour.slug}`}>
                          <img 
                            src={tour.features_image || '/uploads/placeholder.jpg'} 
                            alt={tour.title}
                          />
                        </Link>
                        <div className="batch" style={{
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          background: 'var(--primary-color1)',
                          color: '#fff',
                          padding: '5px 15px',
                          borderRadius: '3px',
                          fontSize: '13px',
                          fontWeight: 500,
                        }}>
                          {tour.category?.name || 'Package'}
                        </div>
                      </div>
                      <div className="package-card-content">
                        <div className="card-content-top">
                          <div className="location" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-color, #787878)', fontSize: '14px' }}>
                            <i className="bi bi-geo-alt"></i>
                            <span>Saudi Arabia</span>
                          </div>
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {[1,2,3,4,5].map(s => (
                              <i key={s} className="bi bi-star-fill" style={{ color: '#FBB03B', fontSize: '12px' }}></i>
                            ))}
                          </div>
                        </div>
                        <h3>
                          <Link href={`/tour/${tour.slug}`}>{tour.title}</Link>
                        </h3>
                        <div className="card-content-bottom">
                          <div className="price-area">
                            <span>Starting From</span>
                            <h6>${tour.pricing?.sale_price || tour.pricing?.price || 'N/A'}</h6>
                          </div>
                          <Link href={`/tour/${tour.slug}`} className="primary-btn2">
                            Book Now
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
