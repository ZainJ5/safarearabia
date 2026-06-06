/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external domains and uploaded content
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'safarearabiantravel.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
    // Support legacy image formats
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables accessible on the server
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },

  // Redirect trailing slashes to non-trailing (matches Laravel .htaccess)
  trailingSlash: false,

  // Optimize package imports
  experimental: {
    optimizePackageImports: ['react-hot-toast'],
  },

  // Puppeteer must not be bundled by webpack — it has native bindings and
  // spawns a separate Chrome process.
  serverExternalPackages: ['puppeteer-core'],
};

export default nextConfig;
