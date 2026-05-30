'use client';

import { useEffect, useRef, useState } from 'react';

function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const numericEnd = parseInt(end) || 0;
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numericEnd));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const whyChooseItems = [
  {
    iconSrc: '/assets/img/icon/why_choose/Worldwide Coverage.svg',
    iconBg: '#e8f5e8',
    title: 'Worldwide Coverage',
    desc: 'Explore top destinations across the globe with our trusted travel network. From famous landmarks to hidden treasures, we\'ve got your journey covered.',
  },
  {
    iconSrc: '/assets/img/icon/why_choose/Competitive Pricing.svg',
    iconBg: '#fef6e4',
    title: 'Competitive Pricing',
    desc: 'Enjoy premium travel experiences at unbeatable prices. We offer the best deals without compromising on quality or comfort.',
  },
  {
    iconSrc: '/assets/img/icon/why_choose/Fast Booking.svg',
    iconBg: '#f5f7e6',
    title: 'Fast Booking',
    desc: 'Book your trip in minutes with our quick and easy reservation system. Travel planning has never been this smooth and hassle-free.',
  },
  {
    iconSrc: '/assets/img/icon/why_choose/Guided Tours.svg',
    iconBg: '#e8f5e8',
    title: 'Guided Tours',
    desc: 'Discover each destination with expert-led tours tailored for a rich, immersive experience. Learn, explore, and enjoy with confidence.',
  },
  {
    iconSrc: '/assets/img/icon/why_choose/Best Support.svg',
    iconBg: '#fef6e4',
    title: 'Best Support 24/7',
    desc: 'Our dedicated team is here for you anytime, anywhere. Get instant assistance before, during, and after your trip—day or night.',
  },
  {
    iconSrc: '/assets/img/icon/why_choose/Ultimate flexibility.svg',
    iconBg: '#fef6e4',
    title: 'Ultimate Flexibility',
    desc: 'Plans change? No problem. We offer flexible booking options and personalized itineraries to fit your schedule and preferences.',
  },
];

const defaultFacts = [
  { number: '10', suffix: '+', label: 'Years of Experience', icon: 'bi-award' },
  { number: '150', suffix: '+', label: 'Hotels Worldwide', icon: 'bi-building' },
  { number: '5000', suffix: '+', label: 'Happy Pilgrims', icon: 'bi-people' },
  { number: '24', suffix: '/7', label: 'Customer Support', icon: 'bi-headset' },
];

export default function FunFacts({ facts = [] }) {
  const displayFacts = facts.length > 0 ? facts : defaultFacts;

  return (
    <>
      {/* ===== Fun Facts / Stats Banner ===== */}
      <section style={{
        background: `linear-gradient(135deg, rgba(177,114,60,0.92) 0%, rgba(109,65,0,0.92) 100%), url('/uploads/sliders/egens-fuD60wAN4P.webp') center/cover no-repeat`,
        backgroundAttachment: 'fixed',
        padding: '50px 0',
      }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            {displayFacts.map((fact, i) => (
              <div key={i} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                <div style={{ padding: '20px' }}>
                  <div style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px',
                  }}>
                    <i className={`bi ${fact.icon}`} style={{ fontSize: '30px', color: '#fff' }}></i>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '40px', fontWeight: 700, marginBottom: '8px', lineHeight: 1 }}>
                    <Counter end={fact.number} suffix={fact.suffix} />
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', marginBottom: 0, fontWeight: 500 }}>
                    {fact.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why Choose Section ===== */}
      <section className="pt-100 pb-100">
        <div className="container">
          <div className="row mb-50 justify-content-center text-center">
            <div className="col-lg-7">
              <div className="section-title">
                <span style={{
                  fontFamily: 'cursive, serif',
                  fontStyle: 'italic',
                  color: '#b1723c',
                  fontSize: '16px',
                  fontWeight: 400,
                  display: 'block',
                  marginBottom: '10px',
                }}>
                  &#x2192; Our Success &#x2190;
                </span>
                <h2 style={{ fontWeight: 800, fontSize: '36px', color: '#100C08' }}>
                  Why Choose Safar e Arabian
                </h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {whyChooseItems.map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6 mb-30">
                <div style={{
                  background: '#f8f6f2',
                  borderRadius: '12px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: '18px',
                  height: '100%',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    minWidth: '68px',
                    borderRadius: '50%',
                    background: item.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                      src={item.iconSrc}
                      alt={item.title}
                      width="38"
                      height="38"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#100C08', lineHeight: 1.3 }}>
                      {item.title}
                    </h4>
                    <p style={{ color: '#787878', fontSize: '14px', lineHeight: 1.75, marginBottom: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
