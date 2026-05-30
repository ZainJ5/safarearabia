'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { defaultSettings } from '@/lib/defaultSettings';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* ===== Top Bar (style-2 = dark bg) ===== */}
      <div className="top-bar style-2">
        {/* Left — Email */}
        <div className="topbar-left">
          <div className="icon">
            {/* paper-plane / send icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </div>
          <div className="content">
            <span>Email:</span>
            <p>
              <a href={`mailto:${defaultSettings.contact_email}`}>
                {defaultSettings.contact_email}
              </a>
            </p>
          </div>
        </div>

        {/* Center — Language Selector */}
        <div className="topbar-lang">
          <img
            src="/assets/img/flags/gb.png"
            alt="EN"
            width="20"
            height="14"
            style={{ borderRadius: '2px', objectFit: 'cover' }}
          />
          <span>EN</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>

        {/* Right — Social Icons */}
        <div className="topbar-right">
          <div className="social-icon-area">
            <ul>
              {defaultSettings.facebook_link && (
                <li>
                  <a href={defaultSettings.facebook_link} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-facebook"></i>
                  </a>
                </li>
              )}
              {defaultSettings.linkedin_link && (
                <li>
                  <a href={defaultSettings.linkedin_link} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-linkedin"></i>
                  </a>
                </li>
              )}
              {defaultSettings.instagram_link && (
                <li>
                  <a href={defaultSettings.instagram_link} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-instagram"></i>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== Main Header ===== */}
      <header className={`header-area style-1${isSticky ? ' sticky' : ''}`}>
        {/* Logo */}
        <div className="header-logo">
          <Link href="/">
            <img
              src={defaultSettings.header_logo}
              alt="Safar e Arabian"
              style={{ maxHeight: '55px', width: 'auto' }}
            />
          </Link>
        </div>

        {/* Main Menu */}
        <div className={`main-menu ${isMobileMenuOpen ? 'show-menu' : ''}`}>
          <div className="mobile-menu-logo">
            <Link href="/" onClick={closeMobileMenu}>
              <img src={defaultSettings.header_logo} alt="logo" style={{ maxHeight: '45px', width: 'auto' }} />
            </Link>
            <button className="menu-close-btn" onClick={closeMobileMenu}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <ul>
            <li className="active">
              <Link href="/" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li>
              <Link href="/about-us" onClick={closeMobileMenu}>About Us</Link>
            </li>
            <li>
              <Link href="/tours" onClick={closeMobileMenu}>Hajj Umrah</Link>
            </li>
            <li className="menu-item-has-children">
              <Link href="/all-hotels" onClick={closeMobileMenu}>Hotel Booking</Link>
              <ul className="sub-menu">
                <li><Link href="/hotel/category/makkah" onClick={closeMobileMenu}>Makkah</Link></li>
                <li><Link href="/hotel/category/madina" onClick={closeMobileMenu}>Madina</Link></li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <Link href="/transport" onClick={closeMobileMenu}>VIP Transport</Link>
              <ul className="sub-menu">
                <li><Link href="/transport/category/car" onClick={closeMobileMenu}>Car</Link></li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <a href="#">Pages</a>
              <ul className="sub-menu">
                <li><Link href="/all-visa" onClick={closeMobileMenu}>Umrah Visa</Link></li>
                <li><Link href="/about-us" onClick={closeMobileMenu}>About Us</Link></li>
                <li><Link href="/faqs" onClick={closeMobileMenu}>FAQs</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/contact-us" onClick={closeMobileMenu}>Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Nav Right */}
        <div className="nav-right d-flex align-items-center">
          {session ? (
            /* Logged-in: circular logo badge + Hello, NAME */
            <div className="hotline-area" style={{ gap: '12px' }}>
              <div className="icon" style={{
                width: '44px', height: '44px', borderRadius: '50%',
                overflow: 'hidden', background: '#2c2c2c',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <img
                  src={defaultSettings.header_logo}
                  alt="avatar"
                  style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <div className="content" style={{ lineHeight: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 400, display: 'block', marginBottom: '4px' }}>
                  Hello,
                </span>
                <h6 style={{ margin: 0 }}>
                  <Link
                    href={session.user?.role === 1 ? '/admin/dashboard' : '/dashboard'}
                    style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-color1)' }}
                  >
                    {session.user?.name?.split(' ')[0]?.toUpperCase() || 'ACCOUNT'}
                  </Link>
                </h6>
              </div>
            </div>
          ) : (
            /* Logged-out: single Account button */
            <Link
              href="/login"
              className="primary-btn1"
              style={{ padding: '10px 22px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px', borderRadius: '5px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="white">
                <path d="M9 0a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM9 11.25c5.01 0 9 2.015 9 4.5V18H0v-2.25c0-2.485 3.99-4.5 9-4.5z"/>
              </svg>
              Account
            </Link>
          )}

          {/* Mobile menu toggle */}
          <div
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ marginLeft: '15px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="18" viewBox="0 0 25 18">
              <rect width="25" height="2" rx="1" fill="currentColor"/>
              <rect y="8" width="25" height="2" rx="1" fill="currentColor"/>
              <rect y="16" width="25" height="2" rx="1" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 998,
          }}
        />
      )}
    </>
  );
}
