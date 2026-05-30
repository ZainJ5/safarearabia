import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Blog: ${slug.replace(/-/g, ' ')}`,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  let blog = null;
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/blogs/${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        blog = result.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch blog detail:', error);
  }

  if (!blog) {
    blog = {
      _id: 'demo',
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: '<p>This is a detailed article providing insights and guidance for your journey.</p><p>Explore more details about historical places, preparations, and tips for making your trip memorable.</p>',
      image: '/uploads/assets/placeholder.jpg',
      category: { name: 'Guides' },
      created_at: new Date().toISOString(),
      tags: ['Umrah', 'Travel', 'Tips'],
      comments: []
    };
  }

  return (
    <>
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>{blog.title}</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li>Article</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-details-content mb-5">
                <img 
                  src={blog.image || '/uploads/assets/placeholder.jpg'} 
                  alt={blog.title} 
                  className="img-fluid rounded mb-4 w-100" 
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
                
                <div className="blog-meta mb-4 text-muted d-flex gap-4 border-bottom pb-3">
                  <span><i className="bi bi-calendar3 text-primary me-2"></i> {new Date(blog.created_at).toLocaleDateString()}</span>
                  {blog.category && <span><i className="bi bi-folder text-primary me-2"></i> {blog.category.name}</span>}
                </div>
                
                <h3 className="mb-4">{blog.title}</h3>
                
                <div className="article-body" dangerouslySetInnerHTML={{ __html: blog.description }} />
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags mt-5 pt-4 border-top">
                    <h5 className="mb-3">Tags:</h5>
                    <div className="d-flex gap-2 flex-wrap">
                      {blog.tags.map((tag, i) => (
                        <span key={i} className="badge bg-light text-dark border p-2">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="comments-section bg-light p-4 rounded mb-5">
                <h4 className="mb-4">Comments ({blog.comments ? blog.comments.length : 0})</h4>
                {blog.comments && blog.comments.length > 0 ? (
                  blog.comments.map((comment, idx) => (
                    <div key={idx} className="single-comment d-flex mb-4 border-bottom pb-3">
                      <div className="comment-avatar me-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                          <i className="bi bi-person fs-4"></i>
                        </div>
                      </div>
                      <div className="comment-content flex-grow-1">
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="mb-0">User</h6>
                          <small className="text-muted">{new Date(comment.created_at).toLocaleDateString()}</small>
                        </div>
                        <p className="mb-0">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No comments yet. Be the first to comment!</p>
                )}
              </div>
              
              <div className="leave-comment-section">
                <h4 className="mb-4">Leave a Reply</h4>
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input type="text" className="form-control p-3" placeholder="Your Name" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input type="email" className="form-control p-3" placeholder="Your Email" required />
                    </div>
                    <div className="col-12 mb-3">
                      <textarea className="form-control p-3" rows="5" placeholder="Write your comment..." required></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary px-5 py-3">Post Comment</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="sidebar-area sticky-top" style={{ top: '100px' }}>
                <div className="widget sidebar-search mb-4 p-4 border rounded">
                  <h4 className="widget-title mb-3">Search</h4>
                  <form>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Search..." />
                      <button className="btn btn-primary" type="submit"><i className="bi bi-search"></i></button>
                    </div>
                  </form>
                </div>
                
                <div className="widget sidebar-category mb-4 p-4 border rounded">
                  <h4 className="widget-title mb-3">Categories</h4>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 pb-2 border-bottom"><Link href="/blog?category=guides" className="text-decoration-none text-dark">Guides</Link></li>
                    <li className="mb-2 pb-2 border-bottom"><Link href="/blog?category=travel" className="text-decoration-none text-dark">Travel & Tours</Link></li>
                    <li className="mb-2 pb-2"><Link href="/blog?category=news" className="text-decoration-none text-dark">News & Updates</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
