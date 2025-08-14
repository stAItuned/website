/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer')

const nextConfig = {
  eslint: {
    // Allow production builds to complete even with ESLint errors
    // TODO: Fix ESLint errors and remove this
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com', 
      'localhost',
      'dev.staituned.com',
      'miro.medium.com',
      'cdn-images-1.medium.com',
      'github.com',
      'raw.githubusercontent.com',
      'user-images.githubusercontent.com',
      'assets.website-files.com',
      'upload.wikimedia.org'
    ],
    // Allow all external images as fallback
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Handle the content submodule
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  },
  transpilePackages: ['contentlayer'],
  // Add cache headers for API routes and static assets
  async headers() {
    return [
      {
        source: '/api/analytics',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600', // 5 minutes cache, 10 minutes stale
          },
        ],
      },
      {
        source: '/content/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for static content
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for assets
          },
        ],
      },
    ]
  },
  async rewrites() {
    const rewrites = []
    
    // Serve images from content directory
    rewrites.push({
      source: '/content/:path*',
      destination: '/api/content/:path*',
    })
    
    return rewrites
  },
}

module.exports = withContentlayer(nextConfig)
