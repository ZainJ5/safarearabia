import { defaultSettings } from '@/lib/defaultSettings';
import dbConnect from '@/lib/dbConnect';
import HeroSlider from '@/components/home/HeroSlider';
import AboutSection from '@/components/home/AboutSection';
import FeaturedTours from '@/components/home/FeaturedTours';
import FunFacts from '@/components/home/FunFacts';
import VisaSection from '@/components/home/VisaSection';
import Testimonials from '@/components/home/Testimonials';
import BlogSection from '@/components/home/BlogSection';
import Newsletter from '@/components/home/Newsletter';

export const metadata = {
  title: 'Home | Safar e Arabian — Tours & Travel',
  description: defaultSettings.footer_desc_en,
};

// Revalidate every 5 minutes
export const revalidate = 300;

async function fetchHomeData() {
  try {
    await dbConnect();

    // Dynamic imports so models are only loaded server-side
    const [
      { default: Tour },
      { default: Hotel },
      { default: Transport },
      { default: Visa },
      { default: Blog },
      { default: Testimonial },
      { default: Slider },
      { default: FunFact },
    ] = await Promise.all([
      import('@/models/Tour'),
      import('@/models/Hotel'),
      import('@/models/Transport'),
      import('@/models/Visa'),
      import('@/models/Blog'),
      import('@/models/Testimonial'),
      import('@/models/Slider'),
      import('@/models/FunFact'),
    ]);

    const [tours, hotels, transports, visas, blogs, testimonials, sliders, funFacts] = await Promise.all([
      Tour.find({ status: 1 }).sort({ created_at: -1 }).limit(6).lean(),
      Hotel.find({ status: 1 }).sort({ created_at: -1 }).limit(6).lean(),
      Transport.find({ status: 1 }).sort({ created_at: -1 }).limit(6).lean(),
      Visa.find({ status: 1 }).sort({ created_at: -1 }).limit(3).lean(),
      Blog.find({ status: 1 }).sort({ created_at: -1 }).limit(3).lean(),
      Testimonial.find({ status: 1 }).sort({ serial: 1, created_at: -1 }).limit(8).lean(),
      Slider.find({ status: 1 }).sort({ serial: 1 }).lean(),
      FunFact.find({ status: 1 }).sort({ serial: 1 }).limit(4).lean(),
    ]);

    // Serialize (remove non-serialisable ObjectId / Date fields)
    const serialize = (arr) => JSON.parse(JSON.stringify(arr));

    return {
      tours: serialize(tours),
      hotels: serialize(hotels),
      transports: serialize(transports),
      visas: serialize(visas),
      blogs: serialize(blogs),
      testimonials: serialize(testimonials),
      sliders: serialize(sliders),
      funFacts: serialize(funFacts),
    };
  } catch (err) {
    console.error('[HomePage] DB fetch error:', err.message);
    return { tours: [], hotels: [], transports: [], visas: [], blogs: [], testimonials: [], sliders: [], funFacts: [] };
  }
}

export default async function HomePage() {
  const { tours, hotels, transports, visas, blogs, testimonials, sliders, funFacts } = await fetchHomeData();

  return (
    <>
      <HeroSlider slides={sliders} />
      <AboutSection />
      <FeaturedTours tours={tours} hotels={hotels} transports={transports} />
      <FunFacts facts={funFacts} />
      <VisaSection visas={visas} />
      <Testimonials testimonials={testimonials} />
      <BlogSection blogs={blogs} />
      <Newsletter />
    </>
  );
}
