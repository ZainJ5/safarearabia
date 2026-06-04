export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'VIP Transport Services',
  description: 'Book comfortable VIP transport for your journey across Makkah, Madina, and Jeddah.',
};

export default async function TransportsPage({ searchParams }) {
  let transports = [];
  
  try {
    const params = await searchParams;
    const page = params?.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/transports?page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      transports = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch transports:', error);
  }

  if (!transports || transports.length === 0) {
    transports = [
      { _id: '1', slug: 'makkah-to-madina-vip-gmc', title: 'Makkah to Madina VIP GMC', car_price: 350, car_type: 'GMC Yukon', car_person: 7, feature_img: '/uploads/sliders/egens-S8KiKhpF01.webp', location: { address: 'Makkah to Madina' } },
      { _id: '2', slug: 'jeddah-airport-to-makkah', title: 'Jeddah Airport to Makkah', car_price: 150, car_type: 'Sedan', car_person: 4, feature_img: '/uploads/sliders/egens-fuD60wAN4P.webp', location: { address: 'Jeddah to Makkah' } },
      { _id: '3', slug: 'madina-to-jeddah-airport', title: 'Madina to Jeddah Airport', car_price: 200, car_type: 'SUV', car_person: 5, feature_img: '/uploads/sliders/egens-GwxliwfgJ4.webp', location: { address: 'Madina to Jeddah' } },
    ];
  }

  return (
    <>
      <Breadcrumb title="VIP Transport" currentPage="Transport" />

      <div className="package-grid-with-sidebar pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="sidebar-area" style={{ position: 'sticky', top: '100px' }}>
                <div className="widget" style={{ background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color1)' }}>Search Transport</h4>
                  <form>
                    <div className="form-group mb-3">
                      <input type="text" className="form-control" placeholder="Search route or car type..." style={{ height: '48px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <button type="submit" className="primary-btn1 w-100" style={{ display: 'flex', justifyContent: 'center' }}>Search</button>
                  </form>
                </div>
                <div style={{ background: 'linear-gradient(135deg, var(--primary-color1), var(--primary-color2))', borderRadius: '10px', padding: '30px', textAlign: 'center' }}>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '15px' }}>Custom Route?</h4>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>Contact us for custom transport routes and group bookings.</p>
                  <Link href="/contact-us" style={{ background: '#fff', color: 'var(--primary-color1)', padding: '12px 25px', borderRadius: '5px', fontWeight: 600, fontSize: '14px', display: 'inline-block' }}>Contact Us</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                {transports.map((transport) => (
                  <div key={transport._id} className="col-lg-6 col-md-6 mb-4">
                    <div className="package-card">
                      <div className="package-card-img-wrap">
                        <Link href={`/transport/${transport.slug}`}>
                          <img src={transport.feature_img || '/uploads/placeholder.jpg'} alt={transport.title} />
                        </Link>
                        <div className="batch" style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary-color1)', color: '#fff', padding: '5px 12px', borderRadius: '3px', fontSize: '12px', fontWeight: 500 }}>
                          {transport.car_type || 'Vehicle'}
                        </div>
                      </div>
                      <div className="package-card-content">
                        <div className="card-content-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-color, #787878)', fontSize: '14px' }}>
                            <i className="bi bi-geo-alt"></i>
                            <span>{transport.location?.address || 'Saudi Arabia'}</span>
                          </div>
                          <span style={{ fontSize: '13px', color: 'var(--text-color)' }}><i className="bi bi-people"></i> Up to {transport.car_person || 4} Pax</span>
                        </div>
                        <h3><Link href={`/transport/${transport.slug}`}>{transport.title}</Link></h3>
                        <div className="card-content-bottom">
                          <div className="price-area">
                            <span>Starting From</span>
                            <h6>${transport.car_price || 'N/A'}</h6>
                          </div>
                          <Link href={`/transport/${transport.slug}`} className="primary-btn2">
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
