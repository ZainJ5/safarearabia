import Link from 'next/link';

const defaultBlogs = [
  {
    slug: 'guide-to-umrah-2026',
    title: 'Complete Guide to Umrah 2026',
    short_desc: 'Everything you need to know before embarking on your spiritual Umrah journey this year.',
    category: 'Guides',
    created_at: 'Jan 15, 2026',
    image: '/uploads/sliders/egens-S8KiKhpF01.webp',
  },
  {
    slug: 'top-places-makkah',
    title: 'Top 5 Historical Places in Makkah',
    short_desc: 'Discover the rich Islamic history of Makkah through these must-visit sacred landmarks.',
    category: 'Travel',
    created_at: 'Feb 10, 2026',
    image: '/uploads/sliders/egens-fuD60wAN4P.webp',
  },
  {
    slug: 'hajj-preparation-tips',
    title: 'Essential Hajj Preparation Tips',
    short_desc: 'A practical checklist for physical, spiritual, and financial preparation for Hajj.',
    category: 'Tips',
    created_at: 'Mar 5, 2026',
    image: '/uploads/sliders/egens-GwxliwfgJ4.webp',
  },
];

export default function BlogSection({ blogs = [] }) {
  const displayBlogs = blogs.length > 0 ? blogs : defaultBlogs;

  return (
    <section className="blog-area pt-100 pb-70">
      <div className="container">
        <div className="row mb-50 align-items-end">
          <div className="col-lg-8">
            <div className="section-title">
              <span>Travel Insights</span>
              <h2>Latest News & Articles</h2>
            </div>
          </div>
          <div className="col-lg-4 d-flex justify-content-lg-end align-items-end mt-3 mt-lg-0">
            <Link href="/blog" className="primary-btn1">
              View All Posts
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
        <div className="row justify-content-center">
          {displayBlogs.map((blog, i) => (
            <div key={i} className="col-lg-4 col-md-6 mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                transition: '0.4s',
                height: '100%',
              }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Link href={`/blog/${blog.slug}`}>
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      style={{ width: '100%', height: '220px', objectFit: 'cover', transition: '0.5s' }}
                    />
                  </Link>
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    background: 'var(--primary-color1)',
                    color: '#fff',
                    padding: '5px 15px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    {blog.category}
                  </div>
                </div>
                <div style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px', fontSize: '13px', color: 'var(--text-color, #787878)' }}>
                    <span><i className="bi bi-calendar3"></i> {blog.date || (blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')}</span>
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', lineHeight: 1.4 }}>
                    <Link href={`/blog/${blog.slug}`} style={{ color: 'var(--title-color, #100C08)', transition: '0.3s' }}>
                      {blog.title}
                    </Link>
                  </h4>
                  <p style={{ color: 'var(--text-color, #787878)', fontSize: '14px', lineHeight: 1.6, marginBottom: '15px' }}>
                    {blog.excerpt || blog.short_desc}
                  </p>
                  <Link href={`/blog/${blog.slug}`} className="primary-btn2">
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}