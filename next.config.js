/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer')

const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com', 
      'localhost',
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
  transpilePackages: ['contentlayer']
}

module.exports = withContentlayer(nextConfig)
