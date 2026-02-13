/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Try to load contentlayer, but don't fail if it's not available (e.g., in Firebase deploy)
let withContentlayer
try {
  const contentlayerModule = require('next-contentlayer')
  withContentlayer = contentlayerModule.withContentlayer
  if (typeof withContentlayer !== 'function') {
    console.warn('next-contentlayer withContentlayer is not a function, skipping')
    withContentlayer = (config) => config
  }
} catch (e) {
  console.warn('next-contentlayer not available, skipping')
  withContentlayer = (config) => config
}

const nextConfig = {
  // Standalone output for minimal production bundle (reduces Firebase deploy from ~240MB to ~80MB)
  output: 'standalone',
  // Keep Turbopack config explicit to avoid Next 16 build errors when webpack config is present.
  turbopack: {},
  // Turbopack is intentionally disabled via env (`NEXT_PRIVATE_TURBOPACK=false`) for Firebase deploy compatibility.
  // NOTE: Avoid externalizing firebase-admin under Turbopack/Frameworks builds, otherwise Next may emit
  // hashed external package aliases (e.g. firebase-admin-<hash>) that are resolved via symlinks that
  // are not reliably preserved in the deployed bundle, causing ERR_MODULE_NOT_FOUND at runtime.
  serverExternalPackages: ['googleapis'],
  outputFileTracingIncludes: {
    '*': ['.next/server/chunks/ssr/**'],
  },
  // eslint configuration removed for Next.js 16 compatibility
  images: {
    formats: ['image/webp'], // Temporarily removed AVIF to reduce CPU load
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 85], // Added supported qualities
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
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
    optimizeCss: process.env.NODE_ENV === 'production',
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
    ]
  },
  // Handle the content submodule
  webpack: (config, { dev, isServer }) => {
    // Exclude Firebase Admin SDK from client-side bundles
    if (!isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'firebase-admin': 'firebase-admin',
        'firebase-admin/app': 'firebase-admin/app',
        'firebase-admin/firestore': 'firebase-admin/firestore',
      })
    }

    // Optimize bundle splitting - AGGRESSIVE OPTIMIZATION
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000,
        cacheGroups: {
          // Framework chunks (React, Next.js)
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          // Libraries usate globalmente ma caricate async
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase',
            priority: 30,
            chunks: 'async',
            enforce: true,
          },
          // Editor libraries (solo writer)
          editor: {
            test: /[\\/]node_modules[\\/](@tiptap|@mdxeditor|prosemirror)[\\/]/,
            name: 'editor',
            priority: 30,
            chunks: 'async',
            enforce: true,
          },
          // Syntax highlighting (solo articoli)
          highlighter: {
            test: /[\\/]node_modules[\\/](react-syntax-highlighter|prismjs|highlight\.js|shiki)[\\/]/,
            name: 'highlighter',
            priority: 30,
            chunks: 'async',
            enforce: true,
          },
          // UI Libraries
          ui: {
            test: /[\\/]node_modules[\\/](@heroicons|lucide-react|framer-motion)[\\/]/,
            name: 'ui',
            priority: 25,
            chunks: 'all',
          },
          // Utilities
          utils: {
            test: /[\\/]node_modules[\\/](date-fns|marked|gray-matter|reading-time)[\\/]/,
            name: 'utils',
            priority: 20,
            chunks: 'all',
          },
          // Vendor rimanenti (ridotto)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            maxSize: 150000, // Max 150KB per chunk vendor
          },
          // Default
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        }
      }
    }

    return config
  },
  transpilePackages: ['contentlayer'],
  // Add cache headers for API routes and static assets
  async headers() {
    return [
      // SEO: Fallback noindex for URLs with internal RSC parameters
      // This is a safety net in case the middleware redirect fails
      {
        source: '/:path*',
        has: [{ type: 'query', key: '_rsc' }],
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' },
        ],
      },
      {
        source: '/:path*',
        has: [{ type: 'query', key: '_rsc_d' }],
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' },
        ],
      },
      // SEO: noindex for private/auth pages
      {
        source: '/signin',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/bookmarks',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/account/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/profile',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // SEO: noindex for dev/debug pages (should not be accessible in production)
      {
        source: '/debug',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/test-firebase',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/article-creator',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // SEO: noindex for demo pages (internal showcases)
      {
        source: '/demo/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
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
      {
        source: '/sw-learn.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/learn',
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
