'use client';

import Link from 'next/link';
import { useSession, signOut, signIn, getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { defaultSettings } from '@/lib/defaultSettings';
import { useLanguage } from '@/providers/LanguageProvider';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
  { code: 'ar', label: 'Arabic',  flag: '🇸🇦', short: 'SA' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { lang, setLang, t } = useLanguage();
  const activeLang = LANGS.find(l => l.code === lang) || LANGS[0];
  const [langOpen, setLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setShowLoginModal(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (result?.ok) {
        setShowLoginModal(false);
        const sess = await getSession();
        const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/dashboard';
        const dest = Number(sess?.user?.role) === 1
          ? (callbackUrl.startsWith('/admin') ? callbackUrl : '/admin/dashboard')
          : (callbackUrl.startsWith('/admin') ? '/dashboard' : callbackUrl);
        // Hard redirect so the server reads the fresh session cookie correctly
        window.location.href = dest;
      } else {
        setLoginError('Invalid email or password.');
      }
    } catch {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

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
              {/* Backdrop */}
              <div
                onClick={() => setLangOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 8998 }}
              />
              {/* Dropdown card */}
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
                  src={session.user?.image || '/uploads/users/dpa-1750432270.png'}
                  alt="avatar"
                  style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <div className="content" style={{ lineHeight: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 400, display: 'block', marginBottom: '4px' }}>
                  {t('Hello')},
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
            /* Logged-out: Account button → opens login modal */
            <button
              onClick={() => setShowLoginModal(true)}
              className="primary-btn1"
              style={{ padding: '10px 22px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="white">
                <path d="M9 0a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM9 11.25c5.01 0 9 2.015 9 4.5V18H0v-2.25c0-2.485 3.99-4.5 9-4.5z"/>
              </svg>
              {t('Account')}
            </button>
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
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 998 }}
        />
      )}

      {/* ===== Login Modal ===== */}
      {showLoginModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
        >
          <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.35)', position: 'relative' }}>

            {/* Top landscape image */}
            <div style={{ position: 'relative', height: '155px', overflow: 'hidden' }}>
              <img src="/uploads/sliders/egens-GwxliwfgJ4.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Close button */}
              <button
                onClick={() => setShowLoginModal(false)}
                style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#333', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '28px 32px 32px' }}>
              <h3 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 700, fontSize: '22px', textAlign: 'center', color: '#111', marginBottom: '6px' }}>
                {t('Sign in to continue')}
              </h3>
              <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', marginBottom: '22px' }}>
                {t('Enter your email address for Login.')}
              </p>

              {loginError && (
                <div style={{ background: '#fff0f0', color: '#c0392b', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: '#f0f4f8', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ position: 'relative', marginBottom: '18px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ width: '100%', padding: '14px 44px 14px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: '#f0f4f8', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{ width: '100%', padding: '15px', borderRadius: '30px', background: '#111', color: '#fff', border: 'none', fontSize: '16px', fontWeight: 600, cursor: loginLoading ? 'not-allowed' : 'pointer', opacity: loginLoading ? 0.75 : 1, marginBottom: '16px' }}
                >
                  {loginLoading ? (lang === 'ar' ? 'جارٍ الدخول...' : 'Signing in…') : t('Sign In')}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '18px' }}>
                {t("Don't have an account?")}{' '}
                <Link href="/register" onClick={() => setShowLoginModal(false)} style={{ color: '#b07542', fontWeight: 600, textDecoration: 'none' }}>
                  {t('Register Here')}
                </Link>
              </p>

              {/* OR divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
                <span style={{ color: '#aaa', fontSize: '13px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{ width: '100%', padding: '13px 16px', borderRadius: '30px', background: '#fff', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', color: '#333' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                {t('Sign In With Google')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
