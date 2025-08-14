/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { withContentlayer } = require('next-contentlayer')

const nextConfig = {
  eslint: {
    // Allow production builds to complete even with ESLint errors
    // TODO: Fix ESLint errors and remove this
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
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
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@heroicons/react',
      'react-syntax-highlighter',
      'firebase/auth',
      'firebase/analytics',
      '@tiptap/react',
      '@tiptap/starter-kit',
      'framer-motion',
      'marked'
    ],
    serverComponentsExternalPackages: [
      'googleapis',
      'firebase-admin'
    ]
  },
  // Handle the content submodule
  webpack: (config, { dev, isServer }) => {
    config.resolve.symlinks = false
    
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase',
            priority: 10,
            chunks: 'async', // Load Firebase only when needed
          },
          tiptap: {
            test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
            name: 'tiptap',
            priority: 10,
            chunks: 'async', // Load TipTap only on editor pages
          },
          highlighter: {
            test: /[\\/]node_modules[\\/](react-syntax-highlighter|prismjs|highlight\.js)[\\/]/,
            name: 'highlighter',
            priority: 10,
            chunks: 'async',
          }
        }
      }
    }
    
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
            value: 'public, s-maxage=300, stale-while-revalidate=86400', // 5 minutes cache, 1 day stale
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
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
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

module.exports = withBundleAnalyzer(withContentlayer(nextConfig))
