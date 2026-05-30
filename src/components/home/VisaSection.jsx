'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useLanguage } from '@/providers/LanguageProvider';
import { useSettings } from '@/providers/SettingsProvider';

export default function VisaSection({ visas = [] }) {
  const { lang, t } = useLanguage();
  const { currencySymbol: CUR } = useSettings();
  const isRTL = lang === 'ar';
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!visas || visas.length === 0) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .section-title span {
          color: #bb7442;
          font-family: 'Brush Script MT', cursive, sans-serif;
          font-size: 1.2rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }

        .section-title h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
        }

        .visa-nav-group {
          display: flex;
          gap: 12px;
        }

        .visa-nav-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .visa-nav-btn:hover {
          border-color: #bb7442;
          color: #bb7442;
        }

        .visa-nav-btn.swiper-button-disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .visa-dest-card {
          position: relative;
          display: block;
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
        }

        .visa-dest-card-img img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .visa-dest-card:hover .visa-dest-card-img img {
          transform: scale(1.05);
        }

        .visa-country-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #b07045;
          color: #ffffff;
          font-weight: 800;
          font-size: 1.1rem;
          padding: 15px 30px;
          text-align: center;
          white-space: normal;
          max-width: 85%;
          line-height: 1.2;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(
            0% 5%, 3% 15%, 0% 25%, 3% 35%, 0% 45%, 3% 55%, 0% 65%, 3% 75%, 0% 85%, 3% 95%,
            10% 100%, 20% 97%, 30% 100%, 40% 97%, 50% 100%, 60% 97%, 70% 100%, 80% 97%, 90% 100%,
            100% 95%, 97% 85%, 100% 75%, 97% 65%, 100% 55%, 97% 45%, 100% 35%, 97% 25%, 100% 15%, 97% 5%,
            90% 0%, 80% 3%, 70% 0%, 60% 3%, 50% 0%, 40% 3%, 30% 0%, 20% 3%, 10% 0%
          );
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .visa-card-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          align-items: center;
          background: linear-gradient(90deg, rgba(162, 60, 126, 0.95) 0%, rgba(168, 25, 85, 0.95) 100%);
          color: #ffffff;
          padding: 15px 0;
          transition: background 0.3s ease;
          z-index: 2;
        }

        .visa-dest-card:hover .visa-card-bottom {
          background: rgba(0, 0, 0, 0.65);
        }

        .visa-card-bottom-left,
        .visa-card-bottom-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          text-align: center;
        }

        .visa-card-bottom-left span {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .visa-card-bottom-divider {
          width: 1px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.3);
        }

        .vp-price {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 4px;
        }

        .vp-tax {
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          opacity: 0.85;
        }

        .visa-swiper .swiper-slide {
          height: auto;
        }
      `}} />

      <section className="pt-100 pb-100">
        <div className="container">
          <div className="row mb-50 align-items-end">
            <div className="col-lg-9">
              <div className="section-title">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
                    <path d="M1 6H19M19 6L14 1M19 6L14 11" stroke="#bb7442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('Visa Services')}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M1 6H19M19 6L14 1M19 6L14 11" stroke="#bb7442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <h2>{t('Visa Processing')}</h2>
              </div>
            </div>
            <div className="col-lg-3 d-flex justify-content-lg-end align-items-end mt-3 mt-lg-0">
              <div className="visa-nav-group">
                <button ref={prevRef} className="visa-nav-btn" aria-label="Previous">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button ref={nextRef} className="visa-nav-btn" aria-label="Next">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <Swiper
            className="visa-swiper"
            modules={[Navigation, Autoplay]}
            slidesPerView={3}
            spaceBetween={24}
            speed={600}
            loop={visas.length > 3}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSwiper={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              280: { slidesPerView: 1 },
              576: { slidesPerView: 1, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              992: { slidesPerView: 3, spaceBetween: 15 },
              1400: { slidesPerView: 3 },
            }}
          >
            {visas.map((visa) => {
              const img =
                visa.features_image ||
                visa.banner_img ||
                visa.country_image ||
                visa.feature_img ||
                '';

              return (
                <SwiperSlide key={visa._id}>
                  <Link href={`/visa/${visa.slug}`} className="visa-dest-card">
                    <div className="visa-dest-card-img">
                      {img && (
                        <img
                          src={img}
                          alt={visa.title}
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                        />
                      )}
                    </div>
                    <div className="visa-country-badge">
                      <span>{visa.title}</span>
                    </div>
                    <div className="visa-card-bottom" dir={isRTL ? 'rtl' : 'ltr'}>
                      <div className="visa-card-bottom-left">
                        <span>{visa.subtitle || visa.category?.name || t('Tourist Visa')}</span>
                      </div>
                      <div className="visa-card-bottom-divider" />
                      <div className="visa-card-bottom-right" dir="ltr">
                        <div className="vp-price">{CUR} {visa.cost ?? '0'}</div>
                        <div className="vp-tax">{t('TAXES INCL/PERS')}</div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
    </>
  );
}
