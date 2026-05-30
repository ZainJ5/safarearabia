import Link from 'next/link';

const demoTransports = [
  { _id: 't1', slug: 'vip-gmc-makkah-madina', title: 'VIP GMC — Makkah to Madina', car_price: 350, car_person: 7, reviews: 24, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', location: 'Makkah' },
  { _id: 't2', slug: 'luxury-sedan-jeddah-makkah', title: 'Luxury Sedan — Jeddah to Makkah', car_price: 200, car_person: 4, reviews: 18, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', location: 'Jeddah' },
  { _id: 't3', slug: 'group-bus-airport-transfer', title: 'Group Bus — Airport Transfer', car_price: 120, car_person: 30, reviews: 41, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', location: 'Jeddah' },
  { _id: 't4', slug: 'vip-van-madina-makkah', title: 'VIP Van — Madina to Makkah', car_price: 280, car_person: 8, reviews: 15, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', location: 'Madina' },
  { _id: 't5', slug: 'private-car-ziyarat-tour', title: 'Private Car — Ziyarat Tour', car_price: 180, car_person: 5, reviews: 29, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', location: 'Makkah' },
  { _id: 't6', slug: 'family-van-hotel-transfer', title: 'Family Van — Hotel Transfers', car_price: 150, car_person: 8, reviews: 22, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', location: 'Madina' },
];

function TransportCard({ transport }) {
  const price = transport.car_price || transport.train_price || 0;
  const locationStr = typeof transport.location === 'string'
    ? transport.location
    : transport.location?.address || 'Saudi Arabia';
  const href = `/transport/${transport.slug}`;

  return (
    <div className="col-lg-4 col-md-6 mb-25">
      <div className="package-card">
        {/* Batch overlay */}
        <div className="batch">
          <span className="date">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            {transport.car_person || 4} Seats
          </span>
          <div className="location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="var(--primary-color1)"/>
            </svg>
            <ul className="location-list">
              <li><a href={href}>{locationStr}</a></li>
            </ul>
          </div>
        </div>

        {/* Image */}
        <div className="package-card-img-wrap">
          <Link href={href} className="card-img">
            <img
              src={transport.features_image || transport.feature_img || '/uploads/placeholder.jpg'}
              alt={transport.title}
              style={{ width: '100%', height: '220px', objectFit: 'cover' }}
            />
          </Link>
        </div>

        {/* Content */}
        <div className="package-card-content">
          <div className="card-content-top">
            <h5><Link href={href}>{transport.title}</Link></h5>
            <div className="location-area">
              <ul className="location-list">
                <li>
                  <a href={href}>
                    <i className="bi bi-car-front" style={{ marginRight: '4px' }}></i>
                    {transport.car_type || 'Vehicle'}
                  </a>
                </li>
                <li>
                  <a href={href}>
                    <i className="bi bi-chat-dots" style={{ marginRight: '4px' }}></i>
                    {transport.reviews || 0} Reviews
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-content-bottom">
            <div className="price-area">
              <h6>Starting From</h6>
              <span>Sar {price}</span>
            </div>
            <Link href={href} className="primary-btn2" style={{ fontSize: '14px', padding: '11px 18px' }}>
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransportSection({ transports = [] }) {
  const displayTransports = transports.length > 0 ? transports : demoTransports;

  return (
    <section className="pt-100 pb-100" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="row mb-50 align-items-end">
          <div className="col-lg-8">
            <div className="section-title">
              <span>Our Fleet</span>
              <h2>Available Transport Services</h2>
            </div>
          </div>
          <div className="col-lg-4 d-flex justify-content-lg-end align-items-end mt-3 mt-lg-0">
            <Link href="/transport" className="primary-btn1">
              View All Transports
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        <div className="row">
          {displayTransports.slice(0, 6).map((transport) => (
            <TransportCard key={transport._id} transport={transport} />
          ))}
        </div>
      </div>
    </section>
  );
}
