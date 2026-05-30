export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // In a real scenario, you'd fetch all your dynamic routes here
  // e.g., const tours = await getTours();

  // Static routes
  const routes = [
    '',
    '/about-us',
    '/contact-us',
    '/terms-conditions',
    '/privacy-policy',
    '/tours',
    '/all-hotels',
    '/transport',
    '/activities',
    '/all-visa',
    '/destinations',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  // Add your dynamic routes from the database mapping over them here
  // const dynamicRoutes = tours.map((tour) => ({
  //   url: `${baseUrl}/tour/${tour.slug}`,
  //   lastModified: tour.updated_at,
  //   changeFrequency: 'weekly',
  //   priority: 0.6,
  // }));

  return [...routes]; // [...routes, ...dynamicRoutes]
}
