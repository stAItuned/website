# Tattoo Try-On AI - Assets

This folder contains media assets for the Tattoo Try-On AI product.

## Files:

- **cover_tattoo.mp4** (649KB) - Short cover video for product list/card view
  - Optimized for quick loading in product cards
  - Shows key features at a glance
  
- **tattoo.mp4** (2.2MB) - Full demo video for product detail page
  - Complete demonstration of features
  - Shows AI tattoo placement and before/after comparison

## Usage:

These files are copied to `/public/assets/products/tattoo-try-on-ai/` for web serving.

In the product definition (index.ts):
- image: '/assets/products/tattoo-try-on-ai/cover_tattoo.mp4' (for product cards)
- coverImage: '/assets/products/tattoo-try-on-ai/tattoo.mp4' (for detail page)
- images: [both videos available]

## Video Strategy:

- **Product Cards/List**: Uses cover_tattoo.mp4 (smaller, faster loading)
- **Detail Page**: Uses tattoo.mp4 (full demo with all features)

Both videos will auto-play and loop. Users can tap to view in fullscreen.

## Location:

- Development reference: `lib/products/tattoo-try-on-ai/assets/`
- Public serving: `public/assets/products/tattoo-try-on-ai/`
