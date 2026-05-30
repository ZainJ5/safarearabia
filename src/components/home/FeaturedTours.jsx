'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ─── Demo fallback data ─── */
const demoTours = [
  { _id: '1', slug: 'embracing-city-lights', title: 'Embracing City Lights, Land And Iconic Culture.', price: 600, sale_price: 700, features_image: '/uploads/sliders/egens-S8KiKhpF01.webp', sub_destination: ['Rome','Turin','Napoli','Florence'], itinerary: {1:{},2:{},3:{},4:{},5:{},6:{}} },
  { _id: '2', slug: 'immersive-cultural-expirees', title: 'Immersive Cultural Expirees, Local Cuisine', price: 500, sale_price: 700, features_image: '/uploads/sliders/egens-fuD60wAN4P.webp', sub_destination: ['Paris','Lyon','Bordeaux','Lille'], itinerary: {1:{},2:{},3:{},4:{},5:{}} },
  { _id: '3', slug: 'exploring-ancient-ruins', title: 'Exploring Ancient Ruins, History Landmarks, And Cultural', price: 850, sale_price: 900, features_image: '/uploads/sliders/egens-GwxliwfgJ4.webp', sub_destination: ['Québec City','St. John\'s','Winnipeg'], itinerary: {1:{},2:{},3:{}} },
];

const demoHotels = [
  { _id: 'h1', slug: 'grand-makkah-hotel', name: 'Grand Makkah Hotel & Suites', price: 800, feature_img: '/uploads/sliders/egens-S8KiKhpF01.webp', location: { address: 'Makkah, Saudi Arabia' }, category: { name: 'Luxury' }, rating: 5, reviews: 45 },
  { _id: 'h2', slug: 'madina-pearl-hotel',  name: 'Madina Pearl Hotel Near Haram',  price: 650, feature_img: '/uploads/sliders/egens-fuD60wAN4P.webp', location: { address: 'Madina, Saudi Arabia' }, category: { name: 'Premium' }, rating: 4, reviews: 38 },
  { _id: 'h3', slug: 'jeddah-corniche',     name: 'Jeddah Corniche Business Hotel', price: 450, feature_img: '/uploads/sliders/egens-GwxliwfgJ4.webp', location: { address: 'Jeddah, Saudi Arabia' }, category: { name: 'Business' }, rating: 4, reviews: 27 },
];

const demoTransports = [
  { _id: 't1', slug: 'dhaka-to-sajek',       title: 'Dhaka To Sajek',        car_price: 500, distance: '500km', feature_img: '/uploads/transports/features/car-img-1740652966.webp',    reviews: 0, rating: 0 },
  { _id: 't2', slug: 'travel-to-canada',     title: 'Travel To Canada',      car_price: 700, distance: '700km', feature_img: '/uploads/transports/features/tab-big-01-1738243965.webp',  reviews: 0, rating: 0 },
  { _id: 't3', slug: 'travel-paris-monaco',  title: 'Travel Paris To Monaco', car_price: 500, distance: '500km', feature_img: '/uploads/transports/features/car-img-1738243647.webp',    reviews: 0, rating: 0 },
];

/* ─── Helpers ─── */
function getDuration(tour) {
  const count = tour.itinerary
    ? (Array.isArray(tour.itinerary) ? tour.itinerary.length : Object.keys(tour.itinerary).length)
    : 0;
  if (count >= 2) return `${count} Days / ${count - 1} Night`;
  return tour.duration || '4 Days / 3 Night';
}

function getRoute(tour) {
  const subs = tour.sub_destination || tour.sub_destinations || [];
  if (Array.isArray(subs) && subs.length > 0) {
    return subs.slice(0, 5).map(s => s.toUpperCase()).join(' → ') + ' →';
  }
  return null;
}

function getPrices(item) {
  const raw = item.sale_price || item.pricing?.sale_price || 0;
  const original = item.price || item.pricing?.price || item.car_price || 0;
  if (raw > 0 && raw < original) {
    return { current: raw, crossed: original };
  }
  if (raw > 0 && raw > original) {
    // sale_price stored as "original" style in demo
    return { current: original, crossed: raw };
  }
  return { current: original, crossed: null };
}

/* ─── Tab Icons ─── */
function TourTabIcon({ active }) {
  const c = active ? '#b07542' : '#444';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 10c0 5.25 7 12 7 12s7-6.75 7-12c0-3.87-3.13-7-7-7z"/>
      <path d="M5 20h14" strokeDasharray="2 2"/>
    </svg>
  );
}
function HotelTabIcon({ active }) {
  const c = active ? '#b07542' : '#444';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="1"/>
      <path d="M16 22V7a4 4 0 00-8 0v15"/><path d="M2 12h20"/>
      <rect x="9" y="15" width="6" height="7"/>
    </svg>
  );
}
function TransportTabIcon({ active }) {
  const c = active ? '#b07542' : '#444';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="9" width="15" height="9" rx="2"/>
      <path d="M16 13h3l2 3v3h-5V13z"/>
      <circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/>
    </svg>
  );
}

/* ─── Transport type icons ─── */
function CarIcon() {
  return <svg width="28" height="20" viewBox="0 0 24 16" fill="none" stroke="#444" strokeWidth="1.3" strokeLinecap="round"><rect x="1" y="5" width="22" height="9" rx="2"/><path d="M4 5l2-4h12l2 4"/><circle cx="6" cy="14" r="2"/><circle cx="18" cy="14" r="2"/></svg>;
}
function TrainIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.3" strokeLinecap="round"><rect x="4" y="2" width="16" height="16" rx="2"/><path d="M4 10h16M12 2v8"/><circle cx="8" cy="20" r="2"/><circle cx="16" cy="20" r="2"/><path d="M7.5 18l1 2M15.5 18l1 2"/></svg>;
}
function BoatIcon() {
  return <svg width="26" height="22" viewBox="0 0 24 20" fill="none" stroke="#444" strokeWidth="1.3" strokeLinecap="round"><path d="M2 16l2-8h16l2 8z"/><path d="M12 2v6M8 8l4-6 4 6"/><path d="M2 16q5 4 10 0t10 0"/></svg>;
}
function BusIcon() {
  return <svg width="26" height="22" viewBox="0 0 24 20" fill="none" stroke="#444" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="2" width="20" height="14" rx="2"/><path d="M2 8h20M8 16v2M16 16v2"/><circle cx="7" cy="15" r="1.5"/><circle cx="17" cy="15" r="1.5"/></svg>;
}

/* ─── Star rating ─── */
function Stars({ count = 0 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= count ? '#b07542' : 'none'} stroke="#b07542" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

/* ─── Tour Card ─── */
function TourCard({ item }) {
  const href = `/tour/${item.slug}`;
  const duration = getDuration(item);
  const route = getRoute(item);
  const { current, crossed } = getPrices(item);
  const img = item.features_image || item.feature_img || '/uploads/placeholder.jpg';

  return (
    <div className="col-lg-4 col-md-6 mb-25">
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image area */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Link href={href}>
            <img src={img} alt={item.title} style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }} />
          </Link>
          {/* Duration badge */}
          <div style={{ position: 'absolute', top: 0, left: 0, background: '#111', color: '#fff', padding: '6px 12px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.3px', borderBottomRightRadius: '4px' }}>
            {duration.toUpperCase()}
          </div>
          {/* Pin icon box */}
          <div style={{ position: 'absolute', top: '36px', left: 0, background: '#fff', padding: '6px 10px', borderBottomRightRadius: '4px' }}>
            <svg width="14" height="18" viewBox="0 0 14 18" fill="#b07542"><path d="M7 0C3.13 0 0 3.13 0 7c0 4.875 7 11 7 11s7-6.125 7-11c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 114.5 7 2.5 2.5 0 017 9.5z"/></svg>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h5 style={{ fontWeight: 700, fontSize: '16px', color: '#111', marginBottom: '10px', lineHeight: 1.4 }}>
            <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</Link>
          </h5>

          {route && (
            <p style={{ fontSize: '11px', color: '#999', letterSpacing: '0.5px', marginBottom: '12px', lineHeight: 1.4, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {route}
            </p>
          )}

          <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: '14px' }} />

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', gap: '10px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#b07542', fontWeight: 600, marginBottom: '3px' }}>Starting From:</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#b07542', lineHeight: 1 }}>Sar{current}</span>
                {crossed && <span style={{ fontSize: '14px', color: '#aaa', textDecoration: 'line-through' }}>Sar{crossed}</span>}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Taxes Incl/Pers</div>
            </div>
            <Link href={href} style={{ background: '#b07542', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Inquiry Now
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Transport Card ─── */
function TransportCard({ item }) {
  const href = `/transport/${item.slug}`;
  const img = item.feature_img || item.features_image || '/uploads/placeholder.jpg';
  const distance = item.distance || '500km';
  const reviews = item.reviews ?? 0;
  const rating = item.rating ?? 0;

  return (
    <div className="col-lg-4 col-md-6 mb-25">
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Link href={href}>
            <img src={img} alt={item.title} style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }} />
          </Link>
          {/* Distance badge */}
          <div style={{ position: 'absolute', top: 0, left: 0, background: '#b07542', color: '#fff', padding: '6px 12px', fontSize: '13px', fontWeight: 700, borderBottomRightRadius: '6px' }}>
            {distance}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h5 style={{ fontWeight: 700, fontSize: '17px', color: '#111', marginBottom: '10px' }}>
            <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</Link>
          </h5>

          <p style={{ fontSize: '13px', color: '#777', marginBottom: '12px' }}>Available Transport:</p>

          {/* Transport type icons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
            {[
              { Icon: CarIcon,   label: 'Car'   },
              { Icon: TrainIcon, label: 'Train' },
              { Icon: BoatIcon,  label: 'Boat'  },
              { Icon: BusIcon,   label: 'Bus'   },
            ].map(({ Icon, label }) => (
              <div key={label} style={{ border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '56px' }}>
                <Icon />
                <span style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', flexWrap: 'wrap', gap: '10px' }}>
            <Link href={href} style={{ background: '#b07542', color: '#fff', padding: '11px 22px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
              View Details
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
              <Stars count={rating} />
              <span style={{ fontSize: '12px', color: '#aaa' }}>{reviews} Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hotel Card ─── */
function HotelCard({ item }) {
  const href = `/hotel/${item.slug}`;
  const img = item.feature_img || item.features_image || '/uploads/placeholder.jpg';
  const price = item.price || item.pricing?.price || 0;
  const name = item.name || item.title || 'Hotel';
  const loc = typeof item.location === 'string' ? item.location : item.location?.address || 'Saudi Arabia';

  return (
    <div className="col-lg-4 col-md-6 mb-25">
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Link href={href}>
            <img src={img} alt={name} style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }} />
          </Link>
          {item.category?.name && (
            <div style={{ position: 'absolute', top: 0, left: 0, background: '#111', color: '#fff', padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderBottomRightRadius: '4px' }}>
              {item.category.name.toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h5 style={{ fontWeight: 700, fontSize: '16px', color: '#111', marginBottom: '8px', lineHeight: 1.4 }}>
            <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{name}</Link>
          </h5>
          <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="13" height="16" viewBox="0 0 14 18" fill="#b07542"><path d="M7 0C3.13 0 0 3.13 0 7c0 4.875 7 11 7 11s7-6.125 7-11c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 114.5 7 2.5 2.5 0 017 9.5z"/></svg>
            {loc}
          </p>
          <Stars count={item.rating || 0} />
          <div style={{ borderTop: '1px solid #f0f0f0', margin: '14px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#b07542', fontWeight: 600, marginBottom: '3px' }}>Starting From:</div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#b07542' }}>Sar{price}</span>
              <div style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Per Night</div>
            </div>
            <Link href={href} style={{ background: '#b07542', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Book Now
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function FeaturedTours({ tours = [], hotels = [], transports = [] }) {
  const [activeTab, setActiveTab] = useState('tours');

  const displayTours      = tours.length > 0      ? tours      : demoTours;
  const displayHotels     = hotels.length > 0     ? hotels     : demoHotels;
  const displayTransports = transports.length > 0 ? transports : demoTransports;

  const tabs = [
    { key: 'tours',      label: 'Hajj Umrah Package', Icon: TourTabIcon },
    { key: 'hotels',     label: 'Hotel',               Icon: HotelTabIcon },
    { key: 'transports', label: 'Transports',          Icon: TransportTabIcon },
  ];

  const { items, CardComponent } = (() => {
    switch (activeTab) {
      case 'hotels':     return { items: displayHotels,     CardComponent: HotelCard };
      case 'transports': return { items: displayTransports, CardComponent: TransportCard };
      default:           return { items: displayTours,      CardComponent: TourCard };
    }
  })();

  return (
    <section className="pt-100 pb-100" style={{ background: '#fff' }}>
      <div className="container">

        {/* Section Header */}
        <div className="text-center mb-20">
          <p style={{ fontFamily: "'Brush Script MT', cursive", fontStyle: 'italic', color: '#b1723c', fontSize: '18px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <svg width="28" height="10" viewBox="0 0 33 4"><path d="M0 2H33" stroke="#b1723c" strokeWidth="3" strokeLinecap="round"/></svg>
            Hajj Umrah
            <svg width="28" height="10" viewBox="0 0 33 4" style={{ transform: 'rotate(180deg)' }}><path d="M0 2H33" stroke="#b1723c" strokeWidth="3" strokeLinecap="round"/></svg>
          </p>
          <h2 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: '42px', color: '#111', marginBottom: '30px' }}>
            Ultimate Travel Experience
          </h2>

          {/* Tab buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '50px' }}>
            {tabs.map(({ key, label, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: isActive ? '#b07542' : '#333',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '15px',
                    fontFamily: 'Rubik, sans-serif',
                    borderBottom: isActive ? '2px solid #b07542' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon active={isActive} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div className="row">
          {items.slice(0, 6).map((item) => (
            <CardComponent key={item._id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}
