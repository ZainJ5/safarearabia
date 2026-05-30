'use client';

import { useState } from 'react';
import Link from 'next/link';

const demoTours = [
  { _id: '1', slug: 'city-lights-islamic-culture', title: 'Embracing City Lights, Land And Islamic Culture', pricing: { price: 600 }, duration: '4 Days / 3 Night', location: 'Makkah', rating: 4, reviews: 18, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', min_people: 2, max_people: 15 },
  { _id: '2', slug: 'cultural-express-local-traditions', title: 'Immersive Cultural Express, Local Traditions, Mediterranean', pricing: { price: 1000 }, duration: '4 Days / 3 Night', location: 'Madina', rating: 4, reviews: 22, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', min_people: 1, max_people: 12 },
  { _id: '3', slug: 'ancient-ruins-history', title: 'Exploring Ancient Ruins, History Landmarks, And Cultural', pricing: { price: 500 }, duration: '4 Days / 3 Night', location: 'Jeddah', rating: 4, reviews: 14, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', min_people: 2, max_people: 20 },
  { _id: '4', slug: 'adventure-art-mediterranean', title: 'Adventure Art, Architecture, And Mediterranean', pricing: { price: 700 }, duration: '5 Days / 4 Night', location: 'Makkah', rating: 4, reviews: 30, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', min_people: 2, max_people: 18 },
  { _id: '5', slug: 'journey-beauty-mediterranean', title: 'A Journey Of Tour Beauty And Mediterranean', pricing: { price: 400 }, duration: '5 Days / 4 Night', location: 'Madina', rating: 4, reviews: 12, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', min_people: 1, max_people: 25 },
  { _id: '6', slug: 'exploring-energy-landmarks', title: 'Exploring Energy, Landmarks, And Traditions', pricing: { price: 500 }, duration: '5 Days / 4 Night', location: 'Taif', rating: 4, reviews: 20, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', min_people: 2, max_people: 15 },
];

const demoHotels = [
  { _id: 'h1', slug: 'grand-makkah-hotel', title: 'Grand Makkah Hotel & Suites', pricing: { price: 800 }, location: 'Makkah', rating: 5, reviews: 45, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', category: { name: 'Luxury' } },
  { _id: 'h2', slug: 'madina-pearl-hotel', title: 'Madina Pearl Hotel Near Haram', pricing: { price: 650 }, location: 'Madina', rating: 4, reviews: 38, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', category: { name: 'Premium' } },
  { _id: 'h3', slug: 'jeddah-corniche-hotel', title: 'Jeddah Corniche Business Hotel', pricing: { price: 450 }, location: 'Jeddah', rating: 4, reviews: 27, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', category: { name: 'Business' } },
  { _id: 'h4', slug: 'royal-palace-makkah', title: 'Royal Palace Makkah Grand Suite', pricing: { price: 1200 }, location: 'Makkah', rating: 5, reviews: 52, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', category: { name: 'Royal' } },
  { _id: 'h5', slug: 'madinah-hilton-hotel', title: 'Madinah Hilton Hotel & Resort', pricing: { price: 900 }, location: 'Madina', rating: 5, reviews: 61, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', category: { name: 'Luxury' } },
  { _id: 'h6', slug: 'haram-view-hotel', title: 'Haram View Hotel Premium Rooms', pricing: { price: 750 }, location: 'Makkah', rating: 4, reviews: 33, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', category: { name: 'Premium' } },
];

const demoTransports = [
  { _id: 't1', slug: 'vip-gmc-makkah-madina', title: 'VIP GMC — Makkah to Madina', car_price: 350, location: 'Makkah', car_type: 'GMC', car_person: 7, reviews: 24, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp' },
  { _id: 't2', slug: 'luxury-sedan-jeddah-makkah', title: 'Luxury Sedan — Jeddah to Makkah', car_price: 200, location: 'Jeddah', car_type: 'Sedan', car_person: 4, reviews: 18, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp' },
  { _id: 't3', slug: 'group-bus-airport-transfer', title: 'Group Bus — Airport Transfer', car_price: 120, location: 'Jeddah', car_type: 'Bus', car_person: 30, reviews: 41, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp' },
  { _id: 't4', slug: 'vip-van-madina-makkah', title: 'VIP Van — Madina to Makkah', car_price: 280, location: 'Madina', car_type: 'Van', car_person: 8, reviews: 15, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp' },
  { _id: 't5', slug: 'private-car-ziyarat-tour', title: 'Private Car — Ziyarat Tour', car_price: 180, location: 'Makkah', car_type: 'SUV', car_person: 5, reviews: 29, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp' },
  { _id: 't6', slug: 'family-van-hotel-transfer', title: 'Family Van — Hotel Transfers', car_price: 150, location: 'Madina', car_type: 'Van', car_person: 8, reviews: 22, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp' },
];

function TourCard({ item, type }) {
  const href = type === 'hotel' ? `/hotel/${item.slug}` : type === 'transport' ? `/transport/${item.slug}` : `/tour/${item.slug}`;
  const price = item.pricing?.sale_price || item.pricing?.price || item.car_price || 0;
  const duration = item.duration || (type === 'hotel' ? 'Per Night' : type === 'transport' ? 'Per Trip' : '3 Days');
  return (
    <div className="col-lg-4 col-md-6 mb-25">
      <div className="package-card">
        {/* Batch/Date badge */}
        <div className="batch">
          <span className="date">{duration}</span>
          <div className="location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="var(--primary-color1)"/>
            </svg>
            <ul className="location-list">
              <li><a href={href}>{typeof item.location === 'string' ? item.location : item.location?.address || 'Saudi Arabia'}</a></li>
            </ul>
          </div>
        </div>

        {/* Image */}
        <div className="package-card-img-wrap">
          <Link href={href} className="card-img">
            <img
              src={item.features_image || item.feature_img || item.image || '/uploads/placeholder.jpg'}
              alt={item.title}
              style={{ width: '100%', height: '220px', objectFit: 'cover' }}
            />
          </Link>
        </div>

        {/* Content */}
        <div className="package-card-content">
          <div className="card-content-top">
            <h5><Link href={href}>{item.title}</Link></h5>
            <div className="location-area">
              <ul className="location-list">
                <li>
                  <a href={href}>
                    <i className="bi bi-people" style={{ marginRight: '4px' }}></i>
                    {item.min_people || item.car_person || 1} - {item.max_people || item.car_person || 15} People
                  </a>
                </li>
                <li>
                  <a href={href}>
                    <i className="bi bi-chat-dots" style={{ marginRight: '4px' }}></i>
                    {item.reviews || 0} Reviews
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-content-bottom">
            <div className="price-area">
              <h6>Starting From</h6>
              <span>Sar{price}</span>
            </div>
            <Link href={href} className="primary-btn2" style={{ fontSize: '14px', padding: '11px 18px' }}>
              Inquiry Now
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedTours({ tours = [], hotels = [], transports = [] }) {
  const [activeTab, setActiveTab] = useState('tours');

  const displayTours = tours.length > 0 ? tours : demoTours;
  const displayHotels = hotels.length > 0 ? hotels : demoHotels;
  const displayTransports = transports.length > 0 ? transports : demoTransports;

  const tabs = [
    { key: 'tours', label: 'Haj Umrah Package' },
    { key: 'hotels', label: 'Hotel' },
    { key: 'transports', label: 'Transports' },
  ];

  const getItems = () => {
    switch (activeTab) {
      case 'hotels': return { items: displayHotels, type: 'hotel' };
      case 'transports': return { items: displayTransports, type: 'transport' };
      default: return { items: displayTours, type: 'tour' };
    }
  };

  const { items, type } = getItems();

  return (
    <section className="package-card-tab-section pt-100 pb-100">
      <div className="container">
        {/* Section Header */}
        <div className="row mb-50 align-items-end">
          <div className="col-lg-8 col-md-8">
            <div className="section-title">
              <span>Hajj Umrah</span>
              <h2>Ultimate Travel Experience</h2>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 d-flex justify-content-lg-end mt-3 mt-md-0">
            <div></div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="package-card-with-tab">
          <ul className="nav nav-pills mb-40" style={{ gap: '0', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <li key={tab.key} className="nav-item">
                <button
                  type="button"
                  className={`nav-link${activeTab === tab.key ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cards Grid */}
        <div className="row">
          {items.slice(0, 6).map((item) => (
            <TourCard key={item._id} item={item} type={type} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-30">
          <Link
            href={activeTab === 'hotels' ? '/all-hotels' : activeTab === 'transports' ? '/transport' : '/tours'}
            className="primary-btn1"
          >
            View All {activeTab === 'hotels' ? 'Hotels' : activeTab === 'transports' ? 'Transports' : 'Packages'}
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
              <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
