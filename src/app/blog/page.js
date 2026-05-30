import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Blog & Articles | Safar e Arabian',
  description: 'Read the latest news, updates, and spiritual articles about Hajj, Umrah, and travel.',
};

export default async function BlogPage({ searchParams }) {
  let blogs = [];
  let pagination = { total: 0, page: 1, pages: 1 };

  try {
    const page = searchParams?.page || '1';
    const category = searchParams?.category || '';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const params = new URLSearchParams({ page, limit: '9' });
    if (category) params.set('category', category);

    const res = await fetch(`${appUrl}/api/blogs?${params}`, {
      next: { revalidate: 60 },
    });
    const result = await res.json();

    if (result.success) {
      blogs = result.data;
      pagination = result.pagination || pagination;
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }

  if (!blogs || blogs.length === 0) {
    blogs = [
      {
        _id: '1',
        slug: 'how-to-prepare-for-umrah',
        title: 'How to Prepare for Your First Umrah',
        category: { name: 'Guides' },
        created_at: new Date().toISOString(),
        image: '/uploads/sliders/egens-S8KiKhpF01.webp',
        short_desc: 'A comprehensive guide on spiritual and physical preparation for Umrah.',
      },
      {
        _id: '2',
        slug: 'top-places-to-visit-makkah',
        title: 'Top 5 Historical Places to Visit in Makkah',
        category: { name: 'Travel' },
        created_at: new Date().toISOString(),
        image: '/uploads/sliders/egens-fuD60wAN4P.webp',
        short_desc: 'Discover the rich history of Makkah through these sacred sites.',
      },
      {
        _id: '3',
        slug: 'hajj-preparation-tips',
        title: 'Essential Hajj Preparation Tips for 2026',
        category: { name: 'Tips' },
        created_at: new Date().toISOString(),
        image: '/uploads/sliders/egens-GwxliwfgJ4.webp',
        short_desc: 'A practical checklist for physical, spiritual, and financial preparation for Hajj.',
      },
    ];
  }

  return (
    <>
      <Breadcrumb title="Blog & Articles" subtitle="Travel Insights & News" />

      <div className="blog-list-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-4 col-xl-3">
              <div className="sidebar-area">
                {/* Search Widget */}
                <div className="sidebar-widget mb-30">
                  <h4 className="widget-title">Search Blog</h4>
                  <form action="/blog" method="GET">
                    <div className="sidebar-search-box">
                      <input
                        type="text"
                        name="search"
                        placeholder="Search articles..."
                        className="form-control"
                      />
                      <button type="submit">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Categories Widget */}
                <div className="sidebar-widget mb-30">
                  <h4 className="widget-title">Categories</h4>
                  <ul className="category-list">
                    {[
                      { name: 'All Posts', slug: '' },
                      { name: 'Guides', slug: 'guides' },
                      { name: 'Travel Tips', slug: 'travel' },
                      { name: 'News & Updates', slug: 'news' },
                      { name: 'Spiritual', slug: 'spiritual' },
                    ].map((cat, i) => (
                      <li key={i}>
                        <Link href={cat.slug ? `/blog?category=${cat.slug}` : '/blog'}>
                          <i className="bi bi-chevron-right"></i> {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts Widget */}
                <div className="sidebar-widget mb-30">
                  <h4 className="widget-title">Recent Posts</h4>
                  <ul className="recent-post-list">
                    {blogs.slice(0, 3).map((blog) => (
                      <li key={blog._id} className="recent-post-item">
                        <div className="recent-post-img">
                          <Link href={`/blog/${blog.slug}`}>
                            <img
                              src={blog.image || '/uploads/assets/placeholder.jpg'}
                              alt={blog.title}
                              style={{ width: '70px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                            />
                          </Link>
                        </div>
                        <div className="recent-post-content">
                          <span style={{ fontSize: '12px', color: 'var(--text-color, #787878)' }}>
                            <i className="bi bi-calendar3"></i>{' '}
                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <h6>
                            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                          </h6>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            <div className="col-lg-8 col-xl-9">
              <div className="row g-4">
                {blogs.map((blog) => (
                  <div key={blog._id} className="col-lg-6 col-md-6">
                    <div className="blog-card">
                      <div className="blog-img">
                        <Link href={`/blog/${blog.slug}`}>
                          <img
                            src={blog.image || '/uploads/assets/placeholder.jpg'}
                            alt={blog.title}
                            style={{ width: '100%', height: '230px', objectFit: 'cover' }}
                          />
                        </Link>
                        {blog.category && (
                          <div className="blog-category">
                            <Link href={`/blog?category=${blog.category.slug || blog.category.name?.toLowerCase()}`}>
                              {blog.category.name || blog.category}
                            </Link>
                          </div>
                        )}
                      </div>
                      <div className="blog-content">
                        <ul className="blog-meta">
                          <li>
                            <i className="bi bi-calendar3"></i>{' '}
                            {new Date(blog.created_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </li>
                          {blog.author && (
                            <li>
                              <i className="bi bi-person"></i> {blog.author}
                            </li>
                          )}
                        </ul>
                        <h4>
                          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h4>
                        <p>{blog.short_desc || (blog.description ? blog.description.substring(0, 120) + '...' : '')}</p>
                        <Link href={`/blog/${blog.slug}`} className="read-more-btn">
                          Read More{' '}
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination-area mt-50">
                  <ul className="pagination">
                    {pagination.page > 1 && (
                      <li className="page-item">
                        <Link href={`/blog?page=${pagination.page - 1}`} className="page-link">
                          <i className="bi bi-chevron-left"></i>
                        </Link>
                      </li>
                    )}
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <li key={p} className={`page-item ${p === pagination.page ? 'active' : ''}`}>
                        <Link href={`/blog?page=${p}`} className="page-link">
                          {p}
                        </Link>
                      </li>
                    ))}
                    {pagination.page < pagination.pages && (
                      <li className="page-item">
                        <Link href={`/blog?page=${pagination.page + 1}`} className="page-link">
                          <i className="bi bi-chevron-right"></i>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default async function BlogPage({ searchParams }) {
  let blogs = [];
  let total = 0;
  
  try {
    const page = searchParams.page || '1';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${appUrl}/api/blogs?page=${page}`, { 
      next: { revalidate: 60 } 
    });
    const result = await res.json();
    
    if (result.success) {
      blogs = result.data;
      total = result.pagination.total;
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }

  if (!blogs || blogs.length === 0) {
    blogs = [
      { _id: '1', slug: 'how-to-prepare-for-umrah', title: 'How to Prepare for Your First Umrah', category: { name: 'Guides' }, created_at: new Date().toISOString(), image: '/uploads/assets/placeholder.jpg', description: 'A comprehensive guide on spiritual and physical preparation for Umrah.' },
      { _id: '2', slug: 'top-places-to-visit-makkah', title: 'Top 5 Historical Places to Visit in Makkah', category: { name: 'Travel' }, created_at: new Date().toISOString(), image: '/uploads/assets/placeholder.jpg', description: 'Discover the rich history of Makkah through these sacred sites.' },
    ];
  }

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>Blog & Articles</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li>Blog</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-list-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="sidebar-area">
                <div className="widget sidebar-search mb-4">
                  <h3 className="widget-title">Search Blog</h3>
                  <form>
                    <div className="form-group mb-3">
                      <input type="text" className="form-control" placeholder="Search articles..." />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Search</button>
                  </form>
                </div>
                
                <div className="widget sidebar-category mb-4 p-4 border rounded">
                  <h4 className="widget-title mb-3">Categories</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2"><Link href="/blog?category=guides" className="text-decoration-none text-dark d-flex justify-content-between"><span>Guides</span> <i className="bi bi-chevron-right"></i></Link></li>
                    <li className="mb-2"><Link href="/blog?category=travel" className="text-decoration-none text-dark d-flex justify-content-between"><span>Travel</span> <i className="bi bi-chevron-right"></i></Link></li>
                    <li className="mb-2"><Link href="/blog?category=news" className="text-decoration-none text-dark d-flex justify-content-between"><span>News & Updates</span> <i className="bi bi-chevron-right"></i></Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="row">
                {blogs.map((blog) => (
                  <div key={blog._id} className="col-lg-6 col-md-6 mb-4">
                    <div className="single-blog-card h-100 border rounded overflow-hidden">
                      <div className="blog-image">
                        <Link href={`/blog/${blog.slug}`}>
                          <img 
                            src={blog.image || '/uploads/assets/placeholder.jpg'} 
                            alt={blog.title} 
                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                          />
                        </Link>
                      </div>
                      <div className="blog-content p-4">
                        <div className="blog-meta mb-2 text-muted small">
                          <span className="me-3"><i className="bi bi-calendar3"></i> {new Date(blog.created_at).toLocaleDateString()}</span>
                          {blog.category && <span><i className="bi bi-folder"></i> {blog.category.name}</span>}
                        </div>
                        <h4 className="mb-3">
                          <Link href={`/blog/${blog.slug}`} className="text-decoration-none text-dark">
                            {blog.title}
                          </Link>
                        </h4>
                        <p className="text-muted mb-3">{blog.description ? blog.description.substring(0, 100) + '...' : ''}</p>
                        <Link href={`/blog/${blog.slug}`} className="btn btn-outline-primary btn-sm">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
