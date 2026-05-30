import Link from 'next/link';

const defaultActivities = [
  { title: 'Ziyarat Tours', slug: 'ziyarat-tours', icon: 'bi-building', description: 'Visit sacred historical sites in Makkah and Madina with guided tours.' },
  { title: 'Mount Uhud Visit', slug: 'mount-uhud', icon: 'bi-mountain', description: 'Explore the historic battlefield of Uhud and its significance in Islamic history.' },
  { title: 'Cave of Hira', slug: 'cave-hira', icon: 'bi-geo-alt', description: 'Trek to the cave where the first revelation was received by Prophet Muhammad (PBUH).' },
  { title: 'Shopping Tours', slug: 'shopping-tours', icon: 'bi-bag', description: 'Explore local markets, malls, and souvenir shops in Makkah and Madina.' },
];

export default function Activities({ activities = [] }) {
  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <section className="activities-area pt-100 pb-70">
      <div className="container">
        <div className="row mb-50">
          <div className="col-lg-8">
            <div className="section-title">
              <span>Top Activities</span>
              <h2>Explore Holy Historical Places</h2>
            </div>
          </div>
          <div className="col-lg-4 d-flex justify-content-lg-end align-items-end mt-3 mt-lg-0">
            <Link href="/activities" className="primary-btn1">
              View All Activities
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
        <div className="row justify-content-center">
          {displayActivities.map((activity, i) => (
            <div key={i} className="col-lg-3 col-md-6 mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '30px 25px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                transition: '0.4s',
                height: '100%',
                border: '1px solid #f0f0f0',
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(177,114,60,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <i className={`bi ${activity.icon || 'bi-star'}`} style={{ fontSize: '28px', color: 'var(--primary-color1)' }}></i>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                  <Link href={`/activity/${activity.slug}`} style={{ color: 'var(--title-color, #100C08)', transition: '0.3s' }}>
                    {activity.title}
                  </Link>
                </h4>
                <p style={{ color: 'var(--text-color, #787878)', fontSize: '14px', lineHeight: 1.6, marginBottom: 0 }}>
                {activity.description || activity.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}