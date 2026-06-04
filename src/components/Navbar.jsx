'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { defaultSettings } from '@/lib/defaultSettings';
import { useLanguage } from '@/providers/LanguageProvider';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
  { code: 'ar', label: 'Arabic',  flag: '🇸🇦', short: 'SA' },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const activeLang = LANGS.find(l => l.code === lang) || LANGS[0];
  const [langOpen, setLangOpen] = useState(false);
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
      {/* ===== Top Bar ===== */}
      <div className="top-bar style-2">
        {/* Left — Email */}
        <div className="topbar-left">
          <div className="icon">
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

        {/* Center — Language Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 600, padding: '4px 6px',
            }}
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.7 }}>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{activeLang.short}</span>
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{activeLang.flag}</span>
          </button>

          {langOpen && (
            <>
              <div onClick={() => setLangOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8998 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff', borderRadius: '10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                zIndex: 8999, minWidth: '140px', overflow: 'hidden',
                border: '1px solid #f0f0f0',
              }}>
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '13px 18px', border: 'none',
                      background: lang === l.code ? '#fdf5ec' : '#fff',
                      cursor: 'pointer', fontSize: '14px', fontWeight: lang === l.code ? 600 : 400,
                      color: lang === l.code ? '#b07542' : '#333',
                      textAlign: 'left', transition: 'background 0.15s',
                      borderBottom: '1px solid #f5f5f5',
                    }}
                  >
                    <span style={{ fontSize: '20px', lineHeight: 1 }}>{l.flag}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </>
          )}
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
              <Link href="/" onClick={closeMobileMenu}>{t('Home')}</Link>
            </li>
            <li>
              <Link href="/about-us" onClick={closeMobileMenu}>{t('About Us')}</Link>
            </li>
            <li>
              <Link href="/tours" onClick={closeMobileMenu}>{t('Hajj Umrah')}</Link>
            </li>
            <li className="menu-item-has-children">
              <Link href="/all-hotels" onClick={closeMobileMenu}>{t('Hotel Booking')}</Link>
              <ul className="sub-menu">
                <li><Link href="/hotel/category/makkah" onClick={closeMobileMenu}>{t('Makkah')}</Link></li>
                <li><Link href="/hotel/category/madina" onClick={closeMobileMenu}>{t('Madina')}</Link></li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <a href="#">{t('VIP Transport')}</a>
              <ul className="sub-menu">
                <li><Link href="/transport/category/car" onClick={closeMobileMenu}>{t('Car')}</Link></li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <a href="#">{t('Pages')}</a>
              <ul className="sub-menu">
                <li><Link href="/all-visa" onClick={closeMobileMenu}>{t('Umrah Visa')}</Link></li>
                <li><Link href="/about-us" onClick={closeMobileMenu}>{t('About Us')}</Link></li>
                <li><Link href="/faqs" onClick={closeMobileMenu}>{t('FAQs')}</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/contact-us" onClick={closeMobileMenu}>{t('Contact Us')}</Link>
            </li>
          </ul>
        </div>

        {/* Nav Right — hamburger only */}
        <div className="nav-right d-flex align-items-center">
          <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 998 }}
        />
      )}
    </>
  );
}
