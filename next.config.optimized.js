/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { withContentlayer } = require('next-contentlayer')

const nextConfig = {
  // Enhanced webpack optimization
  webpack: (config, { dev, isServer }) => {
    config.resolve.symlinks = false
    
    // Exclude Firebase Admin SDK from client-side bundles
    if (!isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'firebase-admin': 'firebase-admin',
        'firebase-admin/app': 'firebase-admin/app',
        'firebase-admin/firestore': 'firebase-admin/firestore',
      })
    }
    
    // ULTRA-AGGRESSIVE bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 100000, // Reduced from 200KB
        cacheGroups: {
          // Core React (keep small)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 50,
            chunks: 'all',
            enforce: true,
          },
          // Next.js core
          next: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next',
            priority: 45,
            chunks: 'all',
            enforce: true,
          },
          // Analytics & tracking (async only)
          analytics: {
            test: /[\\/]node_modules[\\/](@google-analytics|firebase\/analytics|gtag)[\\/]/,
            name: 'analytics',
            priority: 40,
            chunks: 'async',
            enforce: true,
          },
          // Content processing (async)
          content: {
            test: /[\\/]node_modules[\\/](marked|gray-matter|reading-time|remark|rehype|contentlayer)[\\/]/,
            name: 'content',
            priority: 35,
            chunks: 'async',
            enforce: true,
          },
          // UI components (split by usage)
          uiCore: {
            test: /[\\/]node_modules[\\/](@heroicons\/react|lucide-react)[\\/]/,
            name: 'ui-core',
            priority: 30,
            chunks: 'all',
          },
          uiAnimations: {
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            name: 'ui-animations',
            priority: 25,
            chunks: 'async',
            enforce: true,
          },
          // Editor (writer-only)
          editor: {
            test: /[\\/]node_modules[\\/](@tiptap|@mdxeditor|prosemirror)[\\/]/,
            name: 'editor',
            priority: 20,
            chunks: 'async',
            enforce: true,
          },
          // Syntax highlighting (article-only)
          highlighter: {
            test: /[\\/]node_modules[\\/](react-syntax-highlighter|prismjs|highlight\.js|shiki)[\\/]/,
            name: 'highlighter',
            priority: 15,
            chunks: 'async',
            enforce: true,
          },
          // Small utilities (inline or combine)
          utils: {
            test: /[\\/]node_modules[\\/](date-fns|slugify|clsx|classnames)[\\/]/,
            name: 'utils',
            priority: 10,
            chunks: 'all',
            maxSize: 50000,
          },
          // Remaining vendor code (aggressive splitting)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 5,
            chunks: 'all',
            maxSize: 80000, // Smaller chunks
          },
        }
      }
    }
    
    return config
  },
  
  // Enhanced image optimization
  images: {
    formats: ['image/avif', 'image/webp'], // Re-enable AVIF for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Reduced sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Reduced sizes
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com', 
      'localhost',
      'dev.staituned.com',
      'miro.medium.com',
      'cdn-images-1.medium.com',
      'github.com',
      'raw.githubusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  
  // Enhanced experimental features
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    workerThreads: false, // Disable for better memory usage
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
      'marked',
      'clsx',
      'classnames'
    ],
    serverComponentsExternalPackages: [
      'googleapis',
      'firebase-admin',
      '@google-analytics/data'
    ]
  },

  // Enhanced cache headers
  async headers() {
    return [
      {
        source: '/api/analytics/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=900, stale-while-revalidate=3600', // 15 min cache
          },
        ],
      },
      {
        source: '/content/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
      {
        source: '/(.*\\.(js|css|woff2|png|jpg|jpeg|webp|avif|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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

  // Enhanced compression and output
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
  
  // Remove unused build options
  eslint: {
    ignoreDuringBuilds: false, // Fix linting issues
  },
  
  transpilePackages: ['contentlayer'],
}

module.exports = withBundleAnalyzer(withContentlayer(nextConfig))
