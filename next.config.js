/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer')

const isDev = process.env.NEXT_PUBLIC_BASE_URL?.includes('dev.staituned.com') || 
             process.env.NODE_ENV === 'development'

// Firebase deployment requires static export
const isFirebaseDeployment = process.env.FIREBASE_DEPLOYMENT === 'true'

const nextConfig = {
  // Enable static export for Firebase deployment
  ...(isFirebaseDeployment && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
    // Skip API routes for static export
    experimental: {
      serverActions: false,
    },
  }),
  
  // Only enable serverActions for non-Firebase deployments
  ...(!isFirebaseDeployment && {
    experimental: {
      serverActions: true,
    },
  }),
  eslint: {
    // Allow production builds to complete even with ESLint errors
    // TODO: Fix ESLint errors and remove this
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable image optimization for Firebase static export
    ...(isFirebaseDeployment && { unoptimized: true }),
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com', 
      'localhost',
      'dev.staituned.com', // Add dev domain
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
  // Handle the CMS submodule
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  },
  transpilePackages: ['contentlayer'],
  // Environment-specific rewrites (only for non-static builds)
  ...(!isFirebaseDeployment && {
    async rewrites() {
      const rewrites = []
      
      // Serve images from content directory
      rewrites.push({
        source: '/content/:path*',
        destination: '/api/content/:path*',
      })
      
      // Use dev robots.txt for development environment
      if (isDev) {
        rewrites.push({
          source: '/robots.txt',
          destination: '/robots.dev.txt',
        })
      }
      
      return rewrites
    },
  }),
}

module.exports = withContentlayer(nextConfig)
