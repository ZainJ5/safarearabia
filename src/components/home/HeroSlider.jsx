'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import SearchBar from '@/components/home/SearchBar';

const defaultSlides = [
  {
    image: '/uploads/sliders/egens-S8KiKhpF01.webp',
    title: "Let's go with Safar e arabian and discover a place",
    subtitle: 'Saudi Arabia',
    description: 'Explore Breathtaking Destinations, Curated Experiences, And Unforgettable Journeys Tailored Just For You. Showcasing Iconic Landmarks, Scenic Landscapes, And Travelers Enjoying Their Experiences.',
    btn_text: 'Book Your Trip',
    btn_link: '/tours',
  },
  {
    image: '/uploads/sliders/egens-fuD60wAN4P.webp',
    title: 'Premium Hotels Near the Holy Haram',
    subtitle: 'Saudi Arabia',
    description: 'Stay in handpicked hotels with the closest proximity to Masjid al-Haram and Masjid an-Nabawi for your sacred journey.',
    btn_text: 'Book Your Trip',
    btn_link: '/all-hotels',
  },
  {
    image: '/uploads/sliders/egens-GwxliwfgJ4.webp',
    title: 'VIP Transport Services Across Saudi Arabia',
    subtitle: 'Saudi Arabia',
    description: 'Luxury GMC, Sedan, And Group Transport Between Makkah, Madina, And Jeddah Airport. Travel In Comfort And Style.',
    btn_text: 'Book Your Trip',
    btn_link: '/transport',
  },
];

export default function HeroSlider({ slides = [] }) {
  const displaySlides = slides.length > 0 ? slides : defaultSlides;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="home1-banner-area">
      <Swiper
        className="home1-banner-slider"
        modules={[Navigation, Autoplay, EffectFade]}
        slidesPerView={1}
        speed={2500}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{ prevEl: prevRef?.current, nextEl: nextRef?.current }}
        loop={true}
      >
        {displaySlides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="home1-banner-wrapper"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="home1-banner-content">
                {/* SVG-masked ribbon badge */}
                <div className="eg-tag">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {slide.subtitle || 'Saudi Arabia'}
                  </span>
                </div>

                {/* Heading */}
                <h2>{slide.title}</h2>

                {/* Description */}
                <p>{slide.description || slide.desc}</p>

                {/* CTAs */}
                <div className="banner-content-bottom">
                  <Link href={slide.btn_link || '/tours'} className="primary-btn1">
                    {slide.btn_text || 'Book Your Trip'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                      <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  {/* TripAdvisor Rating */}
                  <div className="rating-area">
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#34E0A1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {/* TripAdvisor owl icon (simplified) */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="white">
                        <ellipse cx="12" cy="22" rx="5" ry="5" fill="white"/>
                        <ellipse cx="28" cy="22" rx="5" ry="5" fill="white"/>
                        <circle cx="12" cy="22" r="2.5" fill="#34E0A1"/>
                        <circle cx="28" cy="22" r="2.5" fill="#34E0A1"/>
                        <path d="M6 14 Q20 6 34 14" stroke="white" strokeWidth="2.5" fill="none"/>
                        <path d="M10 14 Q20 10 30 14" fill="white"/>
                      </svg>
                    </div>
                    <div className="content">
                      <div className="text-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="16" viewBox="0 0 100 20">
                          <text x="0" y="15" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">TripAdvisor</text>
                        </svg>
                      </div>
                      <div className="rating">
                        <ul>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <li key={s}>
                              <i className="bi bi-circle-fill" style={{ color: '#00AA6C', fontSize: '10px' }}></i>
                            </li>
                          ))}
                        </ul>
                        <span>5/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Prev / Next arrows */}
        <div className="slider-btn-grp">
          <div ref={prevRef} className="slider-btn home1-banner-prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="17" viewBox="0 0 9 17">
              <path d="M8 1L1 8.5L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div ref={nextRef} className="slider-btn home1-banner-next">
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="17" viewBox="0 0 9 17">
              <path d="M1 1L8 8.5L1 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Swiper>

      {/* Search bar sits INSIDE home1-banner-area — matches TripRex DOM structure */}
      <SearchBar />
    </div>
  );
}
