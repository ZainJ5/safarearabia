'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const defaultDestinations = [
  { title: 'Makkah', slug: 'makkah', image: '/uploads/sliders/egens-S8KiKhpF01.webp', tour_count: 12 },
  { title: 'Madina', slug: 'madina', image: '/uploads/sliders/egens-fuD60wAN4P.webp', tour_count: 8 },
  { title: 'Jeddah', slug: 'jeddah', image: '/uploads/sliders/egens-GwxliwfgJ4.webp', tour_count: 5 },
  { title: 'Taif', slug: 'taif', image: '/uploads/sliders/egens-S8KiKhpF01.webp', tour_count: 3 },
];

export default function Destinations({ destinations = [] }) {
  const displayDestinations = destinations.length > 0 ? destinations : defaultDestinations;

  return (
    <section className="destination-area pt-100 pb-100" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="row mb-50 align-items-end">
          <div className="col-lg-8">
            <div className="section-title">
              <span>Top Locations</span>
              <h2>Popular Destinations</h2>
            </div>
          </div>
          <div className="col-lg-4 d-flex justify-content-lg-end mt-3 mt-lg-0">
            <div className="slider-btn-grp2">
              <div className="slider-btn destination-card2-prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"><path d="M8 1L1 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="slider-btn destination-card2-next">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"><path d="M2 1L9 8L2 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
        </div>

        <Swiper
          className="destination-card2-slider"
          modules={[Navigation, Autoplay]}
          slidesPerView={4}
          spaceBetween={24}
          speed={1500}
          navigation={{
            nextEl: '.destination-card2-next',
            prevEl: '.destination-card2-prev',
          }}
          breakpoints={{
            280: { slidesPerView: 1 },
            576: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            992: { slidesPerView: 4, spaceBetween: 15 },
            1400: { slidesPerView: 4 },
          }}
        >
          {displayDestinations.map((dest, i) => (
            <SwiperSlide key={i}>
              <div style={{
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                height: '320px',
                transition: '0.4s',
              }}>
                <Link href={`/destination/${dest.slug}`}>
                  <img 
                    src={dest.image} 
                    alt={dest.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '30px 20px 20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  }}>
                    <h4 style={{ color: '#fff', marginBottom: '5px', fontSize: '20px', fontWeight: 600 }}>
                      {dest.title}
                    </h4>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                      {dest.tour_count || dest.count || 0} Packages
                    </span>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}