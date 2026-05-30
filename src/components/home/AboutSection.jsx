'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AboutSection({ settings = {} }) {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <section className="home1-about-section pt-100 pb-100">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Content Column */}
          <div className="col-lg-6 col-md-12">
            <div className="about-content">
              <div className="section-title">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="4" viewBox="0 0 33 4">
                    <path d="M0 2H33" stroke="var(--primary-color1)" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Safar e Arabian
                </span>
                <h2>
                  Let&rsquo;s know About Our Journey For Safar e Arabian.
                </h2>
              </div>

              {/* Tab Buttons */}
              <ul className="nav nav-pills">
                <li>
                  <button
                    type="button"
                    className={`nav-link${activeTab === 'mission' ? ' active' : ''}`}
                    onClick={() => setActiveTab('mission')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z"/>
                    </svg>
                    Mission &amp; Vision
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-link${activeTab === 'focus' ? ' active' : ''}`}
                    onClick={() => setActiveTab('focus')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    Focus On Customer
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'mission' && (
                  <div className="tab-pane">
                    {settings.about_mission_en ||
                      'Safar e Arabian is a trusted name in spiritual travel, dedicated to providing exceptional Hajj and Umrah services with comfort, care, and guidance. Rooted in strong Islamic values, we ensure a spiritually enriched journey to the holy cities of Makkah and Madinah, smooth, safe, and spiritually fulfilling. We understand the importance of this sacred experience and strive to ensure every aspect is handled with the highest level of professionalism and respect.'}
                  </div>
                )}
                {activeTab === 'focus' && (
                  <div className="tab-pane">
                    {settings.about_focus_en ||
                      'Our customers are the heart of everything we do. From the moment you begin planning your pilgrimage to the time you return home, our dedicated team provides round-the-clock support. We listen, adapt, and personalize every package to ensure your spiritual journey meets your needs, expectations, and budget. Your satisfaction and peace of mind are our highest priorities.'}
                  </div>
                )}
              </div>

              {/* Bottom: Button + Stats */}
              <div className="about-content-bottom">
                <Link href="/about-us" className="primary-btn1">
                  More About
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                    <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

                <div className="counter-area" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                  {/* Avatar group */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            border: '2px solid #fff',
                            marginLeft: n > 1 ? '-12px' : '0',
                            background: `linear-gradient(135deg, var(--primary-color1), var(--primary-color2))`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 600,
                            overflow: 'hidden',
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginLeft: '12px' }}>
                      <div className="number">
                        <h6>75+</h6>
                      </div>
                      <p>Tour Completed</p>
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '40px', background: 'rgba(0,0,0,0.1)' }}></div>

                  <div className="counter-area">
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(177,114,60,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="var(--primary-color1)">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>
                      </svg>
                    </div>
                    <div className="content" style={{ marginLeft: '10px' }}>
                      <div className="number">
                        <h6>1K+</h6>
                      </div>
                      <p>Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="col-lg-6 col-md-12">
            <div className="about-img">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="/uploads/sliders/egens-S8KiKhpF01.webp"
                    alt="About Safar e Arabian"
                    style={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginTop: '40px',
                    }}
                  />
                </div>
                <div className="col-6">
                  <img
                    src="/uploads/sliders/egens-fuD60wAN4P.webp"
                    alt="Hajj & Umrah Journey"
                    style={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
