/**
 * Hardcoded fallback settings (used when DB is not yet seeded or on client-side)
 * This file is safe to import from client components — no server dependencies.
 *
 * KEY MAPPING (admin settings page keys → defaultSettings keys):
 *   contact_email     → email_address
 *   contact_phone     → hotline_phone
 *   address           → company_address
 *   logo_url          → header_logo
 *   logo_white_url    → footer_logo
 *   social_facebook   → facebook_link
 *   social_instagram  → instagram_link
 *   social_linkedin   → linkedin_link
 *   social_twitter    → twitter_link
 *   social_youtube    → youtube_link
 *   footer_text       → footer_desc_en
 *   copyright_text    → front_copyright_en
 *   marketing_title   → footer_marketing_title
 *   marketing_subtitle→ (new field)
 */
export const defaultSettings = {
  company_name: 'Safar e Arabian',
  // Canonical keys (used in DB via admin settings page)
  contact_email: 'info@safarearabiantravel.com',
  contact_phone: '+92 305 1309051',
  address: 'LG-111 Siddique Trade Center Main Boulevard Lahore, Main Gulberg, Lahore Pakistan',
  logo_url: '/IMG_6483.PNG',
  logo_white_url: '/assets/logo/footerlogo-1750433879.png',
  social_facebook: 'https://www.facebook.com/safarearabiantravel',
  social_instagram: 'https://www.facebook.com/safarearabiantravel',
  social_linkedin: 'https://www.facebook.com/safarearabiantravel',
  social_twitter: '',
  social_youtube: '',
  footer_text: 'With years of expertise, we offer tailored packages, seamless visa processing, comfortable accommodations, and guided support to ensure every step of your sacred journey is smooth and memorable. Let us be your trusted partner in fulfilling this important pillar of faith.',
  copyright_text: 'Copyright 2025 <a href="https://safarearabiantravel.com/">Safar e Arabian</a> | Design By <a href="https://zabscreatives.com/">ZABS Creatives</a>',
  marketing_title: 'Want to take tour packages?',
  marketing_subtitle: 'Explore our exclusive Hajj & Umrah packages',
  stripe_key: '',
  stripe_secret: '',
  paypal_client_id: '',
  paypal_secret: '',

  // Legacy aliases (kept for backward compatibility with components using old keys)
  email_address: 'info@safarearabiantravel.com',
  hotline_phone: '+92 305 1309051',
  hotline_text: 'To More Inquiry',
  company_address: 'LG-111 Siddique Trade Center Main Boulevard Lahore, Main Gulberg, Lahore Pakistan',
  primary_color: '#B1723C',
  secondary_color: '#6D4100',
  header_logo: '/IMG_6483.PNG',
  footer_logo: '/assets/logo/footerlogo-1750433879.png',
  front_favicon: '/assets/logo/favicon-1750432764.png',
  facebook_link: 'https://www.facebook.com/safarearabiantravel',
  instagram_link: 'https://www.facebook.com/safarearabiantravel',
  linkedin_link: 'https://www.facebook.com/safarearabiantravel',
  twitter_link: '',
  youtube_link: '',
  footer_phone: '+92 305 1309051',
  footer_email: 'info@safarearabiantravel.com',
  footer_address: 'LG-111 Siddique Trade Center Main Boulevard Lahore, Main Gulberg, Lahore Pakistan',
  footer_desc_en: 'With years of expertise, we offer tailored packages, seamless visa processing, comfortable accommodations, and guided support to ensure every step of your sacred journey is smooth and memorable. Let us be your trusted partner in fulfilling this important pillar of faith.',
  footer_latest_title: 'Find About Safar e Arabian',
  front_copyright_en: 'Copyright 2025 <a href="https://safarearabiantravel.com/">Safar e Arabian</a> | Design By <a href="https://zabscreatives.com/">ZABS Creatives</a>',
  footer1_title: 'Quick link',
  footer2_title: 'Help & Support',
  footer_marketing_title: 'Want to take tour packages?',
  footer_marketing_btn_text: 'Explore tours',
  footer_marketing_btn_link: '/tours',
  tax_rate: '5',
  default_currency: '2',
  top_header_show: '1',
  topbar_marketing_text: '',
  login_btn: 'Login',
  customer_btn: 'Sign Up',
  marchant_btn: 'Become a Merchant',
};
