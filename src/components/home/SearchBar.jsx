'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const tabs = [
  {
    key: 'tours',
    label: 'Hajj Umrah',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    key: 'hotels',
    label: 'Hotel',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
      </svg>
    ),
  },
  {
    key: 'visas',
    label: 'Visa',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
      </svg>
    ),
  },
  {
    key: 'transport',
    label: 'Transport',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
];

const fieldConfig = {
  tours: { dest: 'Destination', type: 'Tour Type', when: 'When', duration: 'Tour Duration' },
  hotels: { dest: 'Destination', type: 'Hotel Type', when: 'Check-In', duration: 'Nights' },
  visas: { dest: 'Country', type: 'Visa Type', when: 'Travel Month', duration: 'Stay Duration' },
  transport: { dest: 'From', type: 'Vehicle', when: 'Travel Date', duration: 'Trip Duration' },
};

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="var(--title-color,#100C08)" style={{ flexShrink: 0, opacity: 0.6 }}>
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState('tours');
  const [destination, setDestination] = useState('');
  const [tourType, setTourType] = useState('');
  const [when, setWhen] = useState('');
  const [duration, setDuration] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const routes = { tours: '/tours', hotels: '/all-hotels', visas: '/all-visa', transport: '/transport' };
    const route = routes[activeTab] || '/tours';
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (tourType) params.set('type', tourType);
    if (when) params.set('when', when);
    if (duration) params.set('duration', duration);
    router.push(`${route}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const fields = fieldConfig[activeTab] || fieldConfig.tours;

  return (
    <div style={{ padding: '0px' }} className="home1-banner-bottom">
      <div className="container-fluid px-0">
        <div className="filter-wrapper">

          <div className="nav-buttons">
            <ul className="nav-pills">
              {tabs.map((tab) => (
                <li key={tab.key} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ paddingBottom: '0px' }} className="filter-group">            <form onSubmit={handleSearch}>
            <div style={{ padding: '0px 40px;' }} className="filter-area">

              <div className="single-search-box">
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div className="searchbox-input">
                  <label>{fields.dest}</label>
                  <div className="custom-select-dropdown">
                    <div className="select-input">
                      <input
                        type="text"
                        placeholder={`Select ${fields.dest}`}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour Type */}
              <div className="single-search-box">
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
                  </svg>
                </div>
                <div className="searchbox-input">
                  <label>{fields.type}</label>
                  <div className="custom-select-dropdown">
                    <div className="select-input">
                      <input
                        type="text"
                        placeholder={`Select ${fields.type}`}
                        value={tourType}
                        onChange={(e) => setTourType(e.target.value)}
                      />
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              </div>

              {/* When */}
              <div className="single-search-box">
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                  </svg>
                </div>
                <div className="searchbox-input">
                  <label>{fields.when}</label>
                  <div className="custom-select-dropdown">
                    <div className="select-input">
                      <input
                        type="text"
                        placeholder="Select Month"
                        value={when}
                        onChange={(e) => setWhen(e.target.value)}
                      />
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour Duration */}
              <div className="single-search-box" style={{ borderRight: 'none' }}>
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
                  </svg>
                </div>
                <div className="searchbox-input">
                  <label>{fields.duration}</label>
                  <div className="custom-select-dropdown">
                    <div className="select-input">
                      <input
                        type="text"
                        placeholder="Select Duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search button */}
            <button type="submit" className="primary-btn1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              Search
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
