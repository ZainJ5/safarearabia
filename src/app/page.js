import { defaultSettings } from '@/lib/defaultSettings';
import HeroSlider from '@/components/home/HeroSlider';
import AboutSection from '@/components/home/AboutSection';
import FeaturedTours from '@/components/home/FeaturedTours';
import TransportSection from '@/components/home/TransportSection';
import FunFacts from '@/components/home/FunFacts';
import VisaSection from '@/components/home/VisaSection';
import Testimonials from '@/components/home/Testimonials';
import BlogSection from '@/components/home/BlogSection';
import Newsletter from '@/components/home/Newsletter';

export const metadata = {
  title: 'Home | Safar e Arabian — Tours & Travel',
  description: defaultSettings.footer_desc_en,
};

async function fetchHomeData() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const opts = { next: { revalidate: 120 } };

  const [
    toursRes,
    hotelsRes,
    transportsRes,
    visasRes,
    blogsRes,
    testimonialsRes,
    slidersRes,
    funFactsRes,
  ] = await Promise.allSettled([
    fetch(`${base}/api/tours?limit=6&featured=1`, opts),
    fetch(`${base}/api/hotels?limit=6`, opts),
    fetch(`${base}/api/transports?limit=6`, opts),
    fetch(`${base}/api/visas?limit=3`, opts),
    fetch(`${base}/api/blogs?limit=3`, opts),
    fetch(`${base}/api/testimonials?limit=6`, opts),
    fetch(`${base}/api/sliders`, opts),
    fetch(`${base}/api/fun-facts`, opts),
  ]);

  const parse = (res) => {
    if (res.status === 'fulfilled' && res.value.ok) {
      return res.value.json().catch(() => null);
    }
    return null;
  };

  const [tours, hotels, transports, visas, blogs, testimonials, sliders, funFacts] = await Promise.all([
    parse(toursRes),
    parse(hotelsRes),
    parse(transportsRes),
    parse(visasRes),
    parse(blogsRes),
    parse(testimonialsRes),
    parse(slidersRes),
    parse(funFactsRes),
  ]);

  return {
    tours: tours?.data || [],
    hotels: hotels?.data || [],
    transports: transports?.data || [],
    visas: visas?.data || [],
    blogs: blogs?.data || [],
    testimonials: testimonials?.data || [],
    sliders: sliders?.data || [],
    funFacts: funFacts?.data || [],
  };
}

export default async function HomePage() {
  const { tours, hotels, transports, visas, blogs, testimonials, sliders, funFacts } = await fetchHomeData();

  return (
    <>
      <HeroSlider slides={sliders} />
      <AboutSection />
      <FeaturedTours tours={tours} hotels={hotels} transports={transports} />
      <TransportSection transports={transports} />
      <FunFacts facts={funFacts} />
      <VisaSection visas={visas} />
      <Testimonials testimonials={testimonials} />
      <BlogSection blogs={blogs} />
      <Newsletter />
    </>
  );
}
