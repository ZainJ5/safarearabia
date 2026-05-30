import { Jost, Rubik, Satisfy } from 'next/font/google';

import '../../public/frontend/css/bootstrap.min.css';
import '../../public/frontend/css/all.min.css';
import '../../public/frontend/css/bootstrap-icons.css';
import '../../public/frontend/css/boxicons.min.css';
import '../../public/frontend/css/animate.min.css';
import '../../public/frontend/css/swiper-bundle.min.css';
import '../../public/frontend/css/slick.css';
import '../../public/frontend/css/slick-theme.css';
import '../../public/frontend/css/nice-select.css';
import '../../public/frontend/css/magnific-popup.css';
import '../../public/frontend/css/select2.min.css';
import '../../public/frontend/css/daterangepicker.css';
import '../../public/frontend/css/rangeSlider.min.css';
import '../../public/frontend/css/style.css';
// dashboard.css omitted - references missing SVG icons; dashboard uses Bootstrap instead

// Import Tailwind last to allow utility overrides
import './globals.css';

import AuthProvider from '@/providers/AuthProvider';
import ToastProvider from '@/providers/ToastProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { SettingsProvider } from '@/providers/SettingsProvider';
import Preloader from '@/components/Preloader';
import ConditionalLayout from '@/components/ConditionalLayout';

// Primary font
const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jost',
  display: 'swap',
});

// Template heading font
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-rubik',
  display: 'swap',
});

// Template decorative font (section titles)
const satisfy = Satisfy({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Safar e Arabian - Tours & Travel',
    template: '%s | Safar e Arabian',
  },
  description: 'With years of expertise, we offer tailored packages, seamless visa processing, comfortable accommodations, and guided support to ensure every step of your sacred journey is smooth and memorable.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jost.variable} ${rubik.variable} ${satisfy.variable}`}>
      <body className={`${jost.variable} ${rubik.variable} ${satisfy.variable}`} style={{ fontFamily: "'Jost', sans-serif" }}>
        <AuthProvider>
          <SettingsProvider>
            <LanguageProvider>
              <Preloader />
              <ToastProvider />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </LanguageProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
