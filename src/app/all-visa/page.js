export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Umrah Visa Services',
  description: 'Apply for Umrah visas with our fast and reliable processing services.',
};

export default async function VisaPage({ searchParams }) {
  let visas = [];

  try {
    const params = await searchParams;
    const page = params?.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const res = await fetch(`${appUrl}/api/visas?page=${page}`, {
      next: { revalidate: 60 },
    });
    const result = await res.json();

    if (result.success) {
      visas = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch visas:', error);
  }

  return (
    <>
      <Breadcrumb title="Visa Services" currentPage="Visa" />

      <div className="package-grid-with-sidebar pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="sidebar-area" style={{ position: 'sticky', top: '100px' }}>
                <div className="widget" style={{ background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #B1723C' }}>Visa Information</h4>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.7 }}>
                    We handle all visa processing requirements for your Hajj and Umrah journey. Fast, reliable, and hassle-free processing.
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', borderRadius: '10px', padding: '30px', textAlign: 'center' }}>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '15px' }}>Need Visa Help?</h4>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>Our visa experts are available to assist with your application.</p>
                  <Link href="/contact-us" style={{ background: '#fff', color: '#B1723C', padding: '12px 25px', borderRadius: '5px', fontWeight: 600, fontSize: '14px', display: 'inline-block', textDecoration: 'none' }}>Contact Us</Link>
                </div>
              </div>
            </div>

            {/* Visa grid */}
            <div className="col-lg-8">
              {visas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
                  <i className="bi bi-file-earmark-x" style={{ fontSize: 48, display: 'block', marginBottom: 16, color: '#B1723C', opacity: 0.5 }}></i>
                  <h5 style={{ color: '#555', marginBottom: 8 }}>No Visas Available</h5>
                  <p style={{ fontSize: 14 }}>Check back soon or contact us for more information.</p>
                  <Link href="/contact-us" style={{ display: 'inline-block', marginTop: 16, padding: '10px 28px', background: '#B1723C', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Contact Us</Link>
                </div>
              ) : (
                <div className="row">
                  {visas.map((visa) => (
                    <div key={visa._id} className="col-lg-6 col-md-6 mb-4">
                      <div className="package-card">
                        <div className="package-card-img-wrap">
                          <Link href={`/visa/${visa.slug}`}>
                            <img src={visa.features_image || '/uploads/assets/placeholder.jpg'} alt={visa.title} />
                          </Link>
                          {visa.category?.name && (
                            <span style={{ position: 'absolute', top: 12, left: 12, background: '#B1723C', color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                              {visa.category.name}
                            </span>
                          )}
                        </div>
                        <div className="package-card-content">
                          <div className="card-content-top">
                            {visa.processing && (
                              <span style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <i className="bi bi-clock-history" style={{ color: '#B1723C' }}></i> {visa.processing}
                              </span>
                            )}
                            {visa.validity && (
                              <span style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <i className="bi bi-calendar-check" style={{ color: '#B1723C' }}></i> {visa.validity}
                              </span>
                            )}
                          </div>
                          <h3><Link href={`/visa/${visa.slug}`}>{visa.title}</Link></h3>
                          <div className="card-content-bottom">
                            <div className="price-area">
                              <span>Visa Fee</span>
                              <h6>{visa.cost ? `SAR ${visa.cost}` : 'Contact Us'}</h6>
                            </div>
                            <Link href={`/visa/${visa.slug}`} className="primary-btn2">
                              Apply Now
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
