export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Top Destinations in Saudi Arabia',
  description: 'Explore the most popular destinations for your spiritual and tourism journey in Saudi Arabia.',
};

export default async function DestinationsPage({ searchParams }) {
  let destinations = [];
  
  try {
    const params = await searchParams;
    const page = params?.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/destinations?page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      destinations = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch destinations:', error);
  }

  if (!destinations || destinations.length === 0) {
    destinations = [
      { _id: '1', slug: 'makkah', title: 'Makkah', galleries: ['/uploads/sliders/egens-S8KiKhpF01.webp'], description: 'The holiest city in Islam, home to Masjid al-Haram and the Kaaba.' },
      { _id: '2', slug: 'madinah', title: 'Madinah', galleries: ['/uploads/sliders/egens-fuD60wAN4P.webp'], description: 'The second holiest city, home to Masjid an-Nabawi.' },
      { _id: '3', slug: 'jeddah', title: 'Jeddah', galleries: ['/uploads/sliders/egens-GwxliwfgJ4.webp'], description: 'Gateway city with historic old town and Red Sea coastline.' },
      { _id: '4', slug: 'taif', title: 'Taif', galleries: ['/uploads/sliders/egens-S8KiKhpF01.webp'], description: 'Mountain city known for its cool climate and rose gardens.' },
    ];
  }

  return (
    <>
      <Breadcrumb title="Destinations" currentPage="Destinations" />

      <div className="destination-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {destinations.map((dest) => (
              <div key={dest._id} className="col-lg-4 col-md-6 mb-4">
                <div style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '350px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: '0.4s',
                }}>
                  <Link href={`/destination/${dest.slug}`}>
                    <img 
                      src={dest.galleries?.[0] || '/uploads/placeholder.jpg'} 
                      alt={dest.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '40px 25px 25px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    }}>
                      <h3 style={{ color: '#fff', marginBottom: '5px', fontSize: '22px', fontWeight: 600 }}>
                        {dest.title}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: 0 }}>
                        {dest.description?.substring(0, 80) || 'Explore this destination'}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
