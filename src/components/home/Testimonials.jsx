'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const defaultTestimonials = [
  {
    name: 'Ali Muhammad',
    designation: 'Umrah Pilgrim',
    comment: 'Our Umrah experience with Safar e Arabian was exceptional. The VIP transport and hotel proximity to the Haram were perfect. Every detail was taken care of.',
    rating: 5,
  },
  {
    name: 'Fatima Hassan',
    designation: 'Family Tour',
    comment: 'We booked a family package and it was seamless from start to finish. The hotels were comfortable and the guided Ziyarat tours were incredibly informative.',
    rating: 5,
  },
  {
    name: 'Ahmed Khan',
    designation: 'Hajj Package',
    comment: 'The Hajj package was worth every penny. The team was available 24/7 and ensured our spiritual journey was smooth. Highly recommend their VIP services.',
    rating: 5,
  },
];

export default function Testimonials({ testimonials = [] }) {
  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="testimonials-area pt-100 pb-100" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="row mb-50 align-items-end">
          <div className="col-lg-8">
            <div className="section-title">
              <span>Testimonials</span>
              <h2>What Our Clients Say</h2>
            </div>
          </div>
          <div className="col-lg-4 d-flex justify-content-lg-end mt-3 mt-lg-0">
            <div className="slider-btn-grp2">
              <div className="slider-btn testimonial-card-tab-prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"><path d="M8 1L1 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="slider-btn testimonial-card-tab-next">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"><path d="M2 1L9 8L2 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
        </div>

        <Swiper
          className="testimonial-card-slider"
          modules={[Navigation, Autoplay]}
          slidesPerView={3}
          spaceBetween={24}
          speed={1500}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          navigation={{
            nextEl: '.testimonial-card-tab-next',
            prevEl: '.testimonial-card-tab-prev',
          }}
          breakpoints={{
            280: { slidesPerView: 1 },
            576: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            992: { slidesPerView: 3, spaceBetween: 15 },
            1400: { slidesPerView: 3 },
          }}
        >
          {displayTestimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '35px 30px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                height: '100%',
              }}>
                {/* Quote icon */}
                <div style={{ marginBottom: '20px' }}>
                  <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                    <path d="M0 30V17.5C0 12.5 1.04 8.54 3.12 5.63C5.21 2.71 8.33 0.83 12.5 0L15 5C12.5 5.83 10.62 7.08 9.38 8.75C8.12 10.42 7.5 12.29 7.5 14.38V15H15V30H0ZM25 30V17.5C25 12.5 26.04 8.54 28.12 5.63C30.21 2.71 33.33 0.83 37.5 0L40 5C37.5 5.83 35.62 7.08 34.38 8.75C33.12 10.42 32.5 12.29 32.5 14.38V15H40V30H25Z" fill="var(--primary-color1)" opacity="0.15"/>
                  </svg>
                </div>
                {/* Rating */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '15px' }}>
                  {[1,2,3,4,5].map((s) => (
                    <i key={s} className="bi bi-star-fill" style={{ color: s <= t.rating ? '#FBB03B' : '#ddd', fontSize: '14px' }}></i>
                  ))}
                </div>
                {/* Text */}
                <p style={{ 
                  color: 'var(--text-color, #787878)', 
                  fontSize: '15px', 
                  lineHeight: 1.8, 
                  marginBottom: '25px',
                  fontStyle: 'italic',
                }}>
                  &ldquo;{t.comment || t.text}&rdquo;
                </p>
                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color1), var(--primary-color2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h5 style={{ marginBottom: '2px', fontSize: '16px', fontWeight: 600 }}>{t.name}</h5>
                    <span style={{ color: 'var(--text-color, #787878)', fontSize: '13px' }}>{t.designation || t.role}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}