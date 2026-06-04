export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Activities & Experiences',
  description: 'Discover engaging activities and unforgettable experiences across Saudi Arabia.',
};

export default async function ActivitiesPage({ searchParams }) {
  let activities = [];
  
  try {
    const params = await searchParams;
    const page = params?.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/activities?page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      activities = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch activities:', error);
  }

  if (!activities || activities.length === 0) {
    activities = [
      { _id: '1', slug: 'makkah-historical-tour', title: 'Makkah Historical Tour', pricing: { price: 50 }, category: { name: 'City Tour' }, duration_days: 1, feature_img: '/uploads/sliders/egens-S8KiKhpF01.webp', location: { address: 'Makkah, KSA' } },
      { _id: '2', slug: 'desert-safari-jeddah', title: 'Desert Safari in Jeddah', pricing: { price: 80 }, category: { name: 'Adventure' }, duration_days: 1, feature_img: '/uploads/sliders/egens-fuD60wAN4P.webp', location: { address: 'Jeddah Desert' } },
      { _id: '3', slug: 'mount-uhud-visit', title: 'Mount Uhud Historical Visit', pricing: { price: 35 }, category: { name: 'Historical' }, duration_days: 1, feature_img: '/uploads/sliders/egens-GwxliwfgJ4.webp', location: { address: 'Madina, KSA' } },
    ];
  }

  return (
    <>
      <Breadcrumb title="Activities" currentPage="Activities" />

      <div className="package-grid-with-sidebar pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="sidebar-area" style={{ position: 'sticky', top: '100px' }}>
                <div className="widget" style={{ background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-color1)' }}>Search Activities</h4>
                  <form>
                    <div className="form-group mb-3">
                      <input type="text" className="form-control" placeholder="Search by name or category..." style={{ height: '48px', borderRadius: '5px', border: '1px solid #e8e8e8', paddingLeft: '15px' }} />
                    </div>
                    <button type="submit" className="primary-btn1 w-100" style={{ display: 'flex', justifyContent: 'center' }}>Search</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                {activities.map((activity) => (
                  <div key={activity._id} className="col-lg-6 col-md-6 mb-4">
                    <div className="package-card">
                      <div className="package-card-img-wrap">
                        <Link href={`/activity/${activity.slug}`}>
                          <img src={activity.feature_img || '/uploads/placeholder.jpg'} alt={activity.title} />
                        </Link>
                        <div className="batch" style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary-color1)', color: '#fff', padding: '5px 12px', borderRadius: '3px', fontSize: '12px', fontWeight: 500 }}>
                          {activity.category?.name || 'Activity'}
                        </div>
                      </div>
                      <div className="package-card-content">
                        <div className="card-content-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-color, #787878)', fontSize: '14px' }}>
                            <i className="bi bi-geo-alt"></i>
                            <span>{activity.location?.address || 'Saudi Arabia'}</span>
                          </div>
                          {activity.duration_days && (
                            <span style={{ fontSize: '13px', color: 'var(--text-color)' }}>
                              <i className="bi bi-clock"></i> {activity.duration_days} Day{activity.duration_days > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <h3><Link href={`/activity/${activity.slug}`}>{activity.title}</Link></h3>
                        <div className="card-content-bottom">
                          <div className="price-area">
                            <span>Starting From</span>
                            <h6>${activity.pricing?.price || 'N/A'}</h6>
                          </div>
                          <Link href={`/activity/${activity.slug}`} className="primary-btn2">
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
