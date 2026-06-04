'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [openAcc, setOpenAcc]   = useState(1);
  const [pillTab, setPillTab]   = useState(0);
  const [mobileOpen, setMobile] = useState(false);

  return (
    <>
      {/* ── Fonts via @import (works inside style tag) ── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&display=swap');`}</style>

      <style>{`
        /* ── CSS variables ── */
        :root{
          --brand:#c47a2c;
          --brand-dark:#8a4f15;
          --brand-soft:#fdf3e6;
          --ink:#15110d;
          --ink-2:#4a423b;
          --line:#ece4d8;
          --bg:#fbf7f1;
          --card:#ffffff;
        }

        /* ── Base reset for this page ── */
        .safar-page *{box-sizing:border-box}
        .safar-page,
        .safar-page body{
          background:var(--bg);
          color:var(--ink);
          font-family:'Plus Jakarta Sans',system-ui,sans-serif;
          -webkit-font-smoothing:antialiased;
        }
        .safar-page h1,.safar-page h2,.safar-page h3,.safar-page h4{
          font-family:'Fraunces',Georgia,serif;letter-spacing:-.02em
        }
        .safar-page a{text-decoration:none}

        /* ── Topbar ── */
        .sf-topbar{background:var(--ink);color:#d9d2c8;font-size:.85rem;padding:.5rem 0}
        .sf-topbar a{color:#d9d2c8}
        .sf-topbar a:hover{color:#fff}

        /* ── Navbar ── */
        .sf-nav{background:#fff;box-shadow:0 1px 8px rgba(0,0,0,.07);position:sticky;top:0;z-index:999}
        .sf-nav .sf-brand{
          font-family:'Fraunces',serif;font-weight:800;font-size:1.4rem;
          color:var(--ink);text-decoration:none
        }
        .sf-nav .sf-brand span{color:var(--brand)}
        .sf-nav-inner{
          display:flex;align-items:center;justify-content:space-between;
          padding:.75rem 0;gap:1rem;flex-wrap:nowrap;
        }
        .sf-nav-links{
          display:flex;align-items:center;gap:.1rem;list-style:none;margin:0;padding:0;flex:1;justify-content:center;
        }
        .sf-nav-links a{
          color:var(--ink);font-weight:600;font-size:.95rem;
          padding:.5rem 1rem;display:block;white-space:nowrap;
        }
        .sf-nav-links a:hover{color:var(--brand)}
        .sf-nav-actions{display:flex;align-items:center;gap:.5rem;flex-shrink:0}

        /* dropdown */
        .sf-dropdown{position:relative}
        .sf-dropdown-toggle{cursor:pointer;display:flex;align-items:center;gap:.3rem}
        .sf-dropdown-menu{
          display:none;position:absolute;top:calc(100% + .4rem);left:0;
          background:#fff;border:1px solid var(--line);border-radius:12px;
          padding:.4rem;min-width:190px;box-shadow:0 16px 40px -16px rgba(0,0,0,.2);
          list-style:none;margin:0;z-index:1000;
        }
        .sf-dropdown:hover .sf-dropdown-menu{display:block}
        .sf-dropdown-menu a{
          display:block;padding:.55rem 1rem;border-radius:8px;
          color:var(--ink);font-size:.9rem;font-weight:500;
        }
        .sf-dropdown-menu a:hover{background:var(--brand-soft);color:var(--brand-dark)}

        /* Mobile toggle */
        .sf-toggler{
          display:none;background:none;border:1px solid var(--line);
          border-radius:8px;padding:.4rem .6rem;cursor:pointer;font-size:1.4rem;
          color:var(--ink);line-height:1;
        }

        /* Buttons */
        .sf-btn{border-radius:999px;padding:.65rem 1.3rem;font-weight:600;font-size:.9rem;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;border:none}
        .sf-btn-wa{background:#25d366;color:#fff}
        .sf-btn-wa:hover{background:#1ebe5d;color:#fff}
        .sf-btn-login{background:transparent;border:1.5px solid var(--ink);color:var(--ink)}
        .sf-btn-login:hover{background:var(--ink);color:#fff}

        /* ── Mobile nav ── */
        @media(max-width:991px){
          .sf-toggler{display:block}
          .sf-nav-links,.sf-nav-actions{display:none}
          .sf-nav-links.open,.sf-nav-actions.open{
            display:flex;flex-direction:column;align-items:flex-start;gap:.2rem;width:100%;
          }
          .sf-nav-links.open a{padding:.7rem 1rem;width:100%}
          .sf-dropdown-menu{position:static;box-shadow:none;border:none;padding-left:1rem}
          .sf-dropdown:hover .sf-dropdown-menu{display:none}
          .sf-dropdown.open .sf-dropdown-menu{display:block}
          .sf-nav-inner{flex-wrap:wrap}
        }

        /* ── Eyebrow ── */
        .eyebrow{display:inline-flex;align-items:center;gap:.5rem;color:var(--brand-dark);text-transform:uppercase;letter-spacing:.18em;font-weight:700;font-size:.78rem}
        .eyebrow::before{content:"";width:28px;height:1px;background:var(--brand)}

        /* ── Section spacing ── */
        .section{padding:6rem 0}
        @media(max-width:767px){.section{padding:3.5rem 0}}
        @media(max-width:576px){.section{padding:2.5rem 0}}

        /* ── Hero ── */
        .hero{
          position:relative;border-radius:32px;overflow:hidden;min-height:640px;
          background:linear-gradient(180deg,rgba(15,17,13,.15) 0%,rgba(15,17,13,.75) 100%),
            url('/images/photo-1542816417-0983c9c9ad53.jpg') center/cover;
          color:#fff;isolation:isolate;
        }
        .hero::after{content:"";position:absolute;inset:auto 0 0 0;height:60%;background:radial-gradient(120% 100% at 50% 100%,rgba(196,122,44,.35),transparent 60%);pointer-events:none}
        .hero .hero-pill{display:inline-flex;gap:.5rem;align-items:center;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);padding:.4rem .9rem;border-radius:999px;backdrop-filter:blur(8px);font-size:.85rem}
        .hero h1{font-size:clamp(2.4rem,5vw,4.4rem);font-weight:900;line-height:1.02;font-family:'Fraunces',serif;color:#fff}
        .hero .lede{max-width:640px;color:#e7e0d5}
        .rating-chip{display:inline-flex;align-items:center;gap:.6rem;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);padding:.5rem .9rem;border-radius:999px;color:#fff}
        .rating-chip .stars{color:#ffd166}

        /* ── Service strip ── */
        .service-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}
        .service-strip .s-item{display:flex;gap:.9rem;align-items:center;background:#fff;border:1px solid var(--line);border-radius:18px;padding:1rem 1.1rem}
        .service-strip .s-icon{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--brand-soft);color:var(--brand-dark);font-size:1.2rem;flex-shrink:0}
        @media(max-width:992px){.service-strip{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:576px){.service-strip{grid-template-columns:1fr}}

        /* ── About accordion ── */
        .about-img-wrap{position:relative;border-radius:28px;overflow:hidden}
        .about-img-wrap img{width:100%;height:100%;object-fit:cover;display:block}
        .stat-bubble{position:absolute;left:1.2rem;bottom:1.2rem;background:#fff;border-radius:18px;padding:1rem 1.2rem;display:flex;align-items:center;gap:.8rem;box-shadow:0 20px 40px -20px rgba(0,0,0,.25)}
        .stat-bubble .stat-num{font-family:'Fraunces',serif;font-size:1.8rem;font-weight:800;color:var(--brand-dark);line-height:1}
        .acc-btn{display:flex;justify-content:space-between;align-items:center;width:100%;border:1px solid var(--line);background:#fff;border-radius:14px;padding:1rem 1.2rem;font-weight:700;color:var(--ink);cursor:pointer;font-family:inherit;font-size:1rem}
        .acc-btn.open{background:var(--ink);color:#fff;border-color:var(--ink)}
        .acc-body{padding:.9rem 1.2rem 0;color:var(--ink-2);font-size:.95rem;line-height:1.7}

        /* ── Tour cards ── */
        .tour-card{background:#fff;border-radius:22px;overflow:hidden;border:1px solid var(--line);transition:transform .25s,box-shadow .25s;height:100%;display:flex;flex-direction:column}
        .tour-card:hover{transform:translateY(-4px);box-shadow:0 30px 50px -30px rgba(0,0,0,.25)}
        .tc-img{position:relative;aspect-ratio:4/3;overflow:hidden}
        .tc-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
        .tour-card:hover .tc-img img{transform:scale(1.06)}
        .tc-dur{position:absolute;top:1rem;left:1rem;background:rgba(15,17,13,.8);color:#fff;font-size:.75rem;padding:.35rem .7rem;border-radius:999px;backdrop-filter:blur(6px)}
        .tc-body{padding:1.25rem;display:flex;flex-direction:column;gap:.8rem;flex:1}
        .tc-body h5{font-family:'Fraunces',serif;font-weight:700;font-size:1.15rem;line-height:1.3;color:var(--ink);margin:0}
        .tc-chips{display:flex;flex-wrap:wrap;gap:.35rem}
        .tc-chips span{font-size:.72rem;padding:.25rem .6rem;background:var(--brand-soft);color:var(--brand-dark);border-radius:999px;font-weight:600}
        .tc-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px dashed var(--line);padding-top:.9rem;margin-top:auto}
        .tc-price .new{font-size:1.4rem;font-weight:800;color:var(--ink);font-family:'Fraunces',serif}
        .tc-price .old{text-decoration:line-through;color:var(--ink-2);font-size:.9rem;margin-left:.35rem}

        /* ── Pill tabs ── */
        .pill-tabs{display:inline-flex;background:#fff;border:1px solid var(--line);padding:.3rem;border-radius:999px;gap:.2rem}
        .pill-tabs button{border:0;background:transparent;padding:.55rem 1.1rem;border-radius:999px;font-weight:600;color:var(--ink-2);cursor:pointer;font-family:inherit}
        .pill-tabs button.active{background:var(--ink);color:#fff}

        /* ── Why Choose ── */
        .feature-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:1.75rem;height:100%;transition:.25s}
        .feature-card:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
        .feature-card:hover .ficon{background:var(--brand);color:#fff}
        .feature-card:hover p{color:#cfc8bd}
        .ficon{width:54px;height:54px;border-radius:14px;display:grid;place-items:center;background:var(--brand-soft);color:var(--brand-dark);font-size:1.5rem;margin-bottom:1rem;transition:.25s}
        .feature-card h5{font-family:'Fraunces',serif;font-weight:700;font-size:1.2rem;margin:.4rem 0 .6rem}
        .feature-card p{color:var(--ink-2);font-size:.95rem;line-height:1.65;margin:0}

        /* ── Visa cards ── */
        .visa-card{position:relative;border-radius:24px;overflow:hidden;aspect-ratio:3/4;color:#fff;display:block}
        .visa-card img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
        .visa-card:hover img{transform:scale(1.06)}
        .visa-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(0,0,0,.85) 100%)}
        .vc-body{position:absolute;left:0;right:0;bottom:0;padding:1.3rem;z-index:2}
        .vc-country{font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:#f5d9b3}
        .vc-body h5{font-family:'Fraunces',serif;font-weight:700;font-size:1.25rem;color:#fff;margin:.2rem 0 .4rem}
        .vc-price{font-weight:800;font-size:1.1rem}

        /* ── Newsletter ── */
        .newsletter{background:linear-gradient(135deg,var(--ink) 0%,#2a221a 100%);color:#fff;border-radius:32px;padding:4rem;position:relative;overflow:hidden}
        .newsletter::before{content:"";position:absolute;right:-80px;top:-80px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,var(--brand) 0%,transparent 70%);opacity:.5}
        .nl-input{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#fff;border-radius:999px;padding:1rem 1.4rem;outline:none;font-family:inherit;font-size:.95rem;flex:1}
        .nl-input::placeholder{color:#bbb1a3}
        @media(max-width:992px){.newsletter{padding:2.5rem}}
        @media(max-width:576px){.newsletter{padding:1.75rem 1.25rem;border-radius:20px}}

        /* ── Footer ── */
        .sf-footer{background:#0e0c0a;color:#cfc8bd;padding:5rem 0 2rem;margin-top:5rem}
        .sf-footer h6{color:#fff;font-weight:700;letter-spacing:.04em;margin-bottom:1.2rem}
        .sf-footer a{color:#cfc8bd;font-size:.93rem}
        .sf-footer a:hover{color:var(--brand)}
        .sf-footer ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.55rem}
        .socials a{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.06);color:#fff;margin-right:.4rem}
        .socials a:hover{background:var(--brand)}

        /* ── Section spacing ── */
        @media(max-width:992px){.section{padding:4rem 0}}

        /* ── Outline btn for nav ── */
        .btn-outline-ink{border:1.5px solid var(--ink)!important;color:var(--ink)!important;background:transparent!important;border-radius:999px!important;padding:.6rem 1.2rem!important;font-weight:600!important;font-size:.9rem!important}
        .btn-outline-ink:hover{background:var(--ink)!important;color:#fff!important}
      `}</style>

      {/* ══ TOPBAR ══════════════════════════════════════════ */}
      <div className="sf-topbar">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <span><i className="bi bi-envelope-fill text-warning me-1"></i><a href="mailto:info@safarearabiantravel.com">info@safarearabiantravel.com</a></span>
            <span className="d-none d-md-inline"><i className="bi bi-telephone-fill text-warning me-1"></i>+92 305 1309051</span>
          </div>
          <div className="d-none d-md-flex gap-2">
            <a href="https://www.facebook.com/safarearabiantravel"><i className="bi bi-facebook"></i></a>
            <a href="https://wa.link/gff0e9"><i className="bi bi-whatsapp"></i></a>
          </div>
        </div>
      </div>

      {/* ══ NAVBAR ═══════════════════════════════════════════ */}
      <nav className="sf-nav">
        <div className="container">
          <div className="sf-nav-inner">
            {/* Brand */}
            <a className="sf-brand" href="#">SAFAR<span>·E·</span>ARABIAN</a>

            {/* Mobile toggler */}
            <button className="sf-toggler" onClick={() => setMobile(p => !p)} aria-label="Toggle menu">
              <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>

            {/* Nav links */}
            <ul className={`sf-nav-links${mobileOpen ? ' open' : ''}`}>
              <li><a href="#">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li className={`sf-dropdown${mobileOpen ? ' open' : ''}`}>
                <a href="#" className="sf-dropdown-toggle">
                  Our Services <i className="bi bi-chevron-down" style={{fontSize:'.7rem'}}></i>
                </a>
                <ul className="sf-dropdown-menu">
                  <li><a href="#">Hajj &amp; Umrah</a></li>
                  <li><a href="#">Tours</a></li>
                  <li><a href="#">Hotel Booking</a></li>
                  <li><a href="#">VIP Transport</a></li>
                  <li><a href="#">Air Ticket</a></li>
                  <li><a href="#">Visa Processing</a></li>
                </ul>
              </li>
              <li><a href="#">Team</a></li>
              <li><a href="https://wa.link/gff0e9">Contact Us</a></li>
            </ul>

            {/* CTA buttons */}
            <div className={`sf-nav-actions${mobileOpen ? ' open' : ''}`}>
              <a href="https://wa.link/gff0e9" className="sf-btn sf-btn-wa">
                <i className="bi bi-whatsapp"></i> WhatsApp
              </a>
              <Link href="/login" className="sf-btn sf-btn-login">
                <i className="bi bi-person-circle"></i> Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <header className="container mt-4">
        <div className="hero p-4 p-md-5 d-flex flex-column justify-content-center">
          <div style={{position:'relative',zIndex:2}}>
            <span className="hero-pill"><i className="bi bi-geo-alt-fill text-warning"></i> Saudi Arabia · Worldwide</span>
            <h1 className="mt-4">Let&apos;s go with <em style={{fontStyle:'italic',color:'#f5d9b3'}}>Safar e Arabian</em><br/>and discover a place.</h1>
            <p className="lede mt-3 fs-5">Explore breathtaking destinations, curated experiences, and unforgettable journeys tailored just for you — iconic landmarks, scenic landscapes, and pilgrims walking their path with peace.</p>
            <div className="d-flex flex-wrap gap-3 align-items-center mt-4">
              <a href="#tours" className="sf-btn sf-btn-wa" style={{background:'var(--brand)',fontSize:'1rem',padding:'.85rem 1.6rem'}}>
                <i className="bi bi-suitcase2"></i> Book Your Trip
              </a>
              <span className="rating-chip"><span className="stars">★★★★★</span> 5.0 · Trip Advisor</span>
            </div>
          </div>
        </div>
      </header>

      {/* ══ SERVICES STRIP ══════════════════════════════════ */}
      <section className="container mt-5">
        <div className="service-strip">
          {[
            { icon:'bi-moon-stars', title:'Hajj & Umrah',    sub:'Sacred journeys' },
            { icon:'bi-building',   title:'Hotel Booking',   sub:'Near Haram & worldwide' },
            { icon:'bi-passport',   title:'Visa Processing', sub:'30+ countries' },
            { icon:'bi-car-front',  title:'VIP Transport',   sub:'Car · Bus · Train · Boat' },
          ].map(s => (
            <div className="s-item" key={s.title}>
              <div className="s-icon"><i className={`bi ${s.icon}`}></i></div>
              <div><strong>{s.title}</strong><div className="text-muted small">{s.sub}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ════════════════════════════════════════════ */}
      <section className="section" id="about">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="about-img-wrap" style={{aspectRatio:'4/5'}}>
                <img src="/images/photo-1591604129939-f1efa4d9f7fa.avif" alt="Pilgrims at Haram" />
                <div className="stat-bubble">
                  <div className="stat-num">345+</div>
                  <div><strong>Happy Customers</strong><div className="text-muted small">Reviews across services</div></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="eyebrow">Safar e Arabian Travel &amp; Tours</span>
              <h2 className="display-5 fw-bold mt-3">Let&apos;s know about our journey for <em>Safar e Arabian.</em></h2>
              <div className="d-flex flex-column gap-2 mt-4">
                {[
                  { id:1, title:'Mission & Vision',   body:'Safar e Arabian is a trusted name in spiritual travel, dedicated to providing exceptional Hajj and Umrah services with comfort, care, and integrity. Our mission is to make your sacred journey to the holy cities of Makkah and Madinah smooth, safe, and spiritually fulfilling.' },
                  { id:2, title:'Focus On Customer',  body:'From visa assistance and flight bookings to premium accommodation near Haram, guided ziyarah tours, and round-the-clock support — we take care of every detail so you can focus entirely on your ibadah.' },
                  { id:3, title:'Enjoy with us',      body:'At Safar e Arabian, we don\'t just arrange trips — we guide your spiritual journey. With competitive pricing, reliable service, and a commitment to excellence, we aim to be your lifelong partner.' },
                ].map(acc => (
                  <div key={acc.id}>
                    <button className={`acc-btn${openAcc===acc.id?' open':''}`} onClick={() => setOpenAcc(p => p===acc.id ? null : acc.id)}>
                      {acc.title}
                      <i className={`bi bi-${openAcc===acc.id?'dash':'plus'}-lg`}></i>
                    </button>
                    {openAcc===acc.id && <div className="acc-body">{acc.body}</div>}
                  </div>
                ))}
              </div>
              <a href="#" className="sf-btn sf-btn-login mt-4 d-inline-flex">More About <i className="bi bi-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TOURS ════════════════════════════════════════════ */}
      <section className="section pt-0" id="tours">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-4 gap-3">
            <div>
              <span className="eyebrow">Hajj Umrah</span>
              <h2 className="display-5 fw-bold mt-2 mb-0">Ultimate Travel Experience</h2>
            </div>
            <div className="pill-tabs">
              {['Hajj Umrah Package','Hotel','Transports'].map((tab,i) => (
                <button key={i} className={pillTab===i?'active':''} onClick={() => setPillTab(i)}>{tab}</button>
              ))}
            </div>
          </div>
          <div className="row g-4">
            {[
              { dur:'6 Days / 5 Nights', img:'/images/photo-1531572753322-ad063cecc140.avif', title:'Embracing City Lights, Land and Iconic Culture.', chips:['Rome','Turin','Napoli','Florence','Milan','Venice'], price:'SAR 600', old:'SAR 700' },
              { dur:'5 Days / 4 Nights', img:'/images/photo-1502602898657-3e91760cbb34.avif', title:'Immersive Cultural Experiences, Local Cuisine.',  chips:['Paris','Lyon','Bordeaux','Lille','Montpellier'],   price:'SAR 500', old:'SAR 700' },
              { dur:'3 Days / 2 Nights', img:'/images/photo-1503614472-8c93d56e92ce.avif', title:'Exploring Ancient Ruins, History & Culture.',      chips:['Québec','Winnipeg','Calgary','Regina'],            price:'SAR 850', old:'SAR 900' },
              { dur:'3 Days / 2 Nights', img:'/images/photo-1530122037265-a5f1f91d3b99.avif',title:'Adventure, Art, Architecture & Mediterranean.',   chips:['Bern','Zürich','Geneva','Winterthur'],             price:'SAR 700' },
              { dur:'5 Days / 4 Nights', img:'/images/photo-1543783207-ec64e4d95325.avif', title:'A Journey of Beauty and Inspiration.',              chips:['Barcelona','Madrid','Seville','Valencia'],         price:'SAR 400' },
              { dur:'12 Days / 11 Nights',img:'/images/photo-1509840841025-9088ba78a826.avif',title:'Exploring Energy, Landmarks, and Traditions.',   chips:['Bilbao','Seville','Córdoba','Granada','Almería'], price:'SAR 500', old:'SAR 700' },
            ].map((c,i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="tour-card">
                  <div className="tc-img">
                    <span className="tc-dur"><i className="bi bi-clock"></i> {c.dur}</span>
                    <img src={c.img} alt={c.title} />
                  </div>
                  <div className="tc-body">
                    <h5>{c.title}</h5>
                    <div className="tc-chips">{c.chips.map(ch => <span key={ch}>{ch}</span>)}</div>
                    <div className="tc-footer">
                      <div className="tc-price">
                        <span className="new">{c.price}</span>
                        {c.old && <span className="old">{c.old}</span>}
                      </div>
                      <a href="https://wa.link/gff0e9" className="sf-btn sf-btn-wa" style={{padding:'.45rem .9rem',fontSize:'.83rem'}}>
                        Inquiry <i className="bi bi-arrow-up-right"></i>
                      </a>
                    </div>
                    <small className="text-muted">Taxes incl / person</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE ══════════════════════════════════════ */}
      <section className="section pt-0">
        <div className="container">
          <div className="text-center mb-5">
            <span className="eyebrow">Our Success</span>
            <h2 className="display-5 fw-bold mt-2">Why Choose Safar e Arabian</h2>
          </div>
          <div className="row g-3">
            {[
              { icon:'bi-globe2',         title:'Worldwide Coverage',   desc:'Explore top destinations across the globe with our trusted travel network. From famous landmarks to hidden treasures, we\'ve got your journey covered.' },
              { icon:'bi-tag',            title:'Competitive Pricing',  desc:'Enjoy premium travel experiences at unbeatable prices. We offer the best deals without compromising on quality or comfort.' },
              { icon:'bi-lightning-charge',title:'Fast Booking',        desc:'Book your trip in minutes with our quick and easy reservation system. Travel planning has never been this smooth and hassle-free.' },
              { icon:'bi-compass',        title:'Guided Tours',         desc:'Discover each destination with expert-led tours tailored for a rich, immersive experience. Learn, explore, and enjoy with confidence.' },
              { icon:'bi-headset',        title:'Best Support 24/7',    desc:'Our dedicated team is here for you anytime, anywhere. Get instant assistance before, during, and after your trip — day or night.' },
              { icon:'bi-arrows-move',    title:'Ultimate Flexibility', desc:'Plans change? No problem. We offer flexible booking options and personalized itineraries to fit your schedule and preferences.' },
            ].map((f,i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="feature-card">
                  <div className="ficon"><i className={`bi ${f.icon}`}></i></div>
                  <h5>{f.title}</h5>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VISA ═════════════════════════════════════════════ */}
      <section className="section pt-0" id="visa">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-4 gap-3">
            <div>
              <span className="eyebrow">Visa Services</span>
              <h2 className="display-5 fw-bold mt-2 mb-0">Visa Processing</h2>
            </div>
            <a href="#" className="sf-btn sf-btn-login">All Visas <i className="bi bi-arrow-right ms-1"></i></a>
          </div>
          <div className="row g-4">
            {[
              { img:'/images/photo-1485738422979-f5c462d49f74.avif', country:'United States', title:'Working Visa for USA',  price:'SAR 10,000' },
              { img:'/images/photo-1524492412937-b28074a5d7da.avif', country:'India',         title:'Medical Visa in India', price:'SAR 5,000' },
              { img:'/images/photo-1502602898657-3e91760cbb34.avif', country:'France',        title:'Visit in Paris',        price:'SAR 4,500' },
            ].map((v,i) => (
              <div className="col-md-4" key={i}>
                <a className="visa-card" href="#">
                  <img src={v.img} alt={v.country} />
                  <div className="vc-body">
                    <div className="vc-country">{v.country}</div>
                    <h5>{v.title}</h5>
                    <div className="vc-price">{v.price} <small style={{fontWeight:400,opacity:.75}}>/ pers</small></div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══════════════════════════════════════ */}
      <section className="container" id="contact">
        <div className="newsletter">
          <div className="row align-items-center g-4" style={{position:'relative',zIndex:2}}>
            <div className="col-lg-6">
              <span className="eyebrow" style={{color:'#f5d9b3'}}>Newsletter</span>
              <h2 className="display-5 fw-bold mt-3">Join the journey.</h2>
              <p className="text-light opacity-75 mb-0">Receive our best monthly deals — Hajj packages, hotel offers and curated tours straight to your inbox.</p>
            </div>
            <div className="col-lg-6">
              <form className="d-flex gap-2 flex-wrap" onSubmit={e => e.preventDefault()}>
                <input type="email" className="nl-input" placeholder="Enter your email address" required />
                <button type="submit" className="sf-btn sf-btn-wa" style={{background:'var(--brand)',padding:'.9rem 1.6rem'}}>
                  Subscribe <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </form>
              <small className="text-light opacity-50 d-block mt-2">No spam. Unsubscribe anytime.</small>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="sf-footer">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <a href="#" className="sf-brand" style={{color:'#fff',display:'inline-block',marginBottom:'1rem'}}>
                SAFAR<span>·E·</span>ARABIAN
              </a>
              <p style={{maxWidth:340,color:'#cfc8bd'}}>Your trusted partner for sacred Hajj &amp; Umrah journeys, world tours, hotels, visas and VIP transport.</p>
              <div className="socials mt-3">
                <a href="https://www.facebook.com/safarearabiantravel"><i className="bi bi-facebook"></i></a>
                <a href="https://wa.link/gff0e9"><i className="bi bi-whatsapp"></i></a>
              </div>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Services</h6>
              <ul>
                <li><a href="#">Hajj &amp; Umrah</a></li>
                <li><a href="#">Hotel Booking</a></li>
                <li><a href="#">Visa Processing</a></li>
                <li><a href="#">VIP Transport</a></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Company</h6>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h6>Contact</h6>
              <ul>
                <li><i className="bi bi-envelope me-2 text-warning"></i>info@safarearabiantravel.com</li>
                <li><i className="bi bi-telephone me-2 text-warning"></i>+92 305 1309051</li>
                <li><i className="bi bi-geo-alt me-2 text-warning"></i>LG-111 Siddique Trade Center, Main Gulberg, Lahore, Pakistan</li>
              </ul>
            </div>
          </div>
          <hr className="my-4" style={{borderColor:'rgba(255,255,255,.08)'}} />
          <div className="d-flex flex-wrap justify-content-between gap-2 small opacity-75">
            <span>© 2026 Safar e Arabian Travel &amp; Tours. All rights reserved. Developed by <a href="https://zabscreatives.com/" target="_blank" rel="noopener noreferrer">ZABS Creatives</a></span>
            <div className="d-flex gap-3"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
          </div>
        </div>
      </footer>
                        </>
  );
}
          