import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'About Us | Safar E Arabia',
  description: 'Learn more about Safar E Arabia and our mission to provide the best Hajj and Umrah experiences.',
};

export default function AboutUsPage() {
  return (
    <>
      <Breadcrumb title="About Us" currentPage="About Us" />

      {/* About Section */}
      <div className="about-area pt-100 pb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div style={{ position: 'relative' }}>
                <img src="/uploads/sliders/egens-S8KiKhpF01.webp" alt="About Safar E Arabia" style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '10px' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  right: '-20px',
                  background: 'var(--primary-color1)',
                  color: '#fff',
                  padding: '20px 30px',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}>
                  <h3 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '5px', color: '#fff' }}>10+</h3>
                  <span style={{ fontSize: '14px' }}>Years Experience</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ paddingLeft: '30px' }}>
                <div className="section-title mb-30">
                  <span>About Us</span>
                  <h2>Welcome to Safar E Arabia</h2>
                </div>
                <p style={{ color: 'var(--text-color, #787878)', lineHeight: 1.8, marginBottom: '20px' }}>
                  At Safar E Arabia, our mission is to offer comprehensive and spiritually enriching travel experiences for pilgrims heading to Makkah and Madinah. We specialize in providing customized Hajj and Umrah packages, alongside comprehensive travel, visa, and accommodation solutions.
                </p>
                <p style={{ color: 'var(--text-color, #787878)', lineHeight: 1.8, marginBottom: '30px' }}>
                  With years of expertise, our dedicated team ensures that your journey is seamless, comfortable, and memorable. From luxury transport to guided tours of historical sites, we handle every detail so you can focus entirely on your spiritual goals.
                </p>
                <div className="row">
                  {[
                    { icon: 'bi-award', title: 'Trusted Service' },
                    { icon: 'bi-headset', title: '24/7 Support' },
                    { icon: 'bi-shield-check', title: 'Licensed Agency' },
                    { icon: 'bi-people', title: 'Expert Team' },
                  ].map((item, i) => (
                    <div key={i} className="col-sm-6 mb-3">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(177,114,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`bi ${item.icon}`} style={{ fontSize: '20px', color: 'var(--primary-color1)' }}></i>
                        </div>
                        <h5 style={{ marginBottom: 0, fontSize: '16px', fontWeight: 600 }}>{item.title}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div style={{ background: '#f8f9fa', padding: '100px 0 70px' }}>
        <div className="container">
          <div className="row justify-content-center text-center mb-50">
            <div className="col-lg-8">
              <div className="section-title">
                <span>What Drives Us</span>
                <h2>Our Mission & Vision</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {[
              { icon: 'bi-eye', title: 'Our Vision', desc: 'To be the most reliable and trusted travel agency globally for Hajj, Umrah, and religious tourism in Saudi Arabia.' },
              { icon: 'bi-bullseye', title: 'Our Mission', desc: 'To deliver exceptional hospitality, comfort, and peace of mind for every pilgrim and traveler, ensuring a spiritually uplifting journey.' },
              { icon: 'bi-gem', title: 'Our Values', desc: 'Integrity, devotion, excellence, and customer-first approach define our operations and commitments to our valued guests.' },
            ].map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6 mb-4">
                <div style={{
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '40px 30px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  height: '100%',
                  transition: '0.4s',
                  borderTop: '3px solid var(--primary-color1)',
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
                    <i className={`bi ${item.icon}`} style={{ fontSize: '28px', color: 'var(--primary-color1)' }}></i>
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '15px' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-color, #787878)', fontSize: '14px', lineHeight: 1.7, marginBottom: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
