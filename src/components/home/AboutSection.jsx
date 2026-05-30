'use client';

import { useState } from 'react';
import Link from 'next/link';

const TABS = [
  {
    key: 'mission',
    label: 'Mission & Vision',
    content:
      'Safar e Arabian is a trusted name in spiritual travel, dedicated to providing exceptional Hajj and Umrah services with comfort, care, and integrity. Based on strong Islamic values, our mission is to make your sacred journey to the holy cities of Makkah and Madinah smooth, safe, and spiritually fulfilling. We understand the importance of this once-in-a-lifetime experience and strive to ensure every aspect is handled with the highest level of professionalism and respect.',
  },
  {
    key: 'focus',
    label: 'Focus On Customer',
    content:
      'From visa assistance and flight bookings to premium accommodation near Haram, guided ziyarah tours, and round-the-clock support—we take care of every detail so you can focus entirely on your ibadah. Our knowledgeable team is experienced in managing individual pilgrims, family groups, and large caravans with personalized attention and hospitality.',
  },
  {
    key: 'enjoy',
    label: 'Enjoy with us',
    content:
      "At Safar e Arabian, we don't just arrange trips—we guide your spiritual journey. With competitive pricing, reliable service, and a commitment to excellence, we aim to be your lifelong partner in your path toward Allah. Choose us for a journey that's not just organized—but truly blessed.",
  },
];

/* Icon: target crosshair (Mission) */
function TargetIcon({ color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

/* Icon: circle-check (Focus / Enjoy) */
function CheckCircleIcon({ color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

export default function AboutSection({ settings = {} }) {
  const [activeTab, setActiveTab] = useState('mission');

  const activeContent = TABS.find((t) => t.key === activeTab)?.content || '';

  return (
    <section className="pt-100 pb-100" style={{ background: '#fff' }}>
      <div className="container">
        <div className="row align-items-center g-5">

          {/* ── Left: Text Content ── */}
          <div className="col-lg-6 col-md-12">

            {/* Subtitle */}
            <p style={{
              fontFamily: "'Brush Script MT', cursive",
              fontStyle: 'italic',
              color: '#b1723c',
              fontSize: '17px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="28" height="10" viewBox="0 0 33 4"><path d="M0 2H33" stroke="#b1723c" strokeWidth="3" strokeLinecap="round"/></svg>
              Safar e Arabian Travel &amp; Tours
              <svg width="28" height="10" viewBox="0 0 33 4" style={{ transform: 'rotate(180deg)' }}><path d="M0 2H33" stroke="#b1723c" strokeWidth="3" strokeLinecap="round"/></svg>
            </p>

            {/* Heading */}
            <h2 style={{
              fontFamily: 'Rubik, var(--font-rubik), sans-serif',
              fontWeight: 800,
              fontSize: '40px',
              lineHeight: 1.2,
              color: '#111',
              marginBottom: '26px',
            }}>
              Let&rsquo;s know About Our<br />Journey For Safar e<br />Arabian.
            </h2>

            {/* Tab buttons */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const iconColor = isActive ? '#b1723c' : '#999';
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      color: isActive ? '#111' : '#777',
                      fontWeight: isActive ? 700 : 400,
                      fontSize: '14px',
                      fontFamily: 'Rubik, sans-serif',
                      transition: 'color 0.2s',
                    }}
                  >
                    {tab.key === 'mission'
                      ? <TargetIcon color={iconColor} />
                      : <CheckCircleIcon color={iconColor} />}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <p style={{
              color: '#555',
              fontSize: '15px',
              lineHeight: 1.85,
              marginBottom: '32px',
              fontFamily: 'Rubik, sans-serif',
            }}>
              {activeContent}
            </p>

            {/* Bottom row: button + customers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
              <Link
                href="/about-us"
                style={{
                  display: 'inline-block',
                  background: '#b07542',
                  color: '#fff',
                  padding: '13px 30px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  fontFamily: 'Rubik, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                More About
              </Link>

              {/* Customer avatars + count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Stacked avatar circles */}
                <div style={{ display: 'flex' }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        marginLeft: i > 0 ? '-14px' : '0',
                        overflow: 'hidden',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        position: 'relative',
                        zIndex: 3 - i,
                      }}
                    >
                      <img
                        src="/uploads/about_content/egens-LvtsX6tAeT.webp"
                        alt="Customer"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: `${i * 33}% center`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: '#111', lineHeight: 1 }}>
                    345+
                  </div>
                  <div style={{ fontSize: '13px', color: '#777', marginTop: '3px' }}>
                    Customer
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Single collage image ── */}
          <div className="col-lg-6 col-md-12">
            <img
              src="/uploads/about_content/egens-CWGGfImwMj.webp"
              alt="About Safar e Arabian"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '14px',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
