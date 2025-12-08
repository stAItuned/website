/**
 * Products Central Hub
 * 
 * This file automatically exports all products from individual files.
 * To add a new product:
 * 1. Create a new file in this directory (e.g., my-product.ts)
 * 2. Export your product with a unique slug
 * 3. Import it here
 * 
 * That's it! The product will automatically appear everywhere.
 */

import type { Product } from '@/types/product'

// Import all products
import { editorialPlanner } from './editorial-planner'
import { fundComparison } from './fund-comparison'
import { docAssistant } from './doc-assistant'
import { leaveTracker } from './leave-tracker'
import { mySmartHaircut } from './my-smart-haircut'
import { tattooTryOnAI } from './tattoo-try-on-ai'

/**
 * All products array
 * Add your new product to this array
 */
export const allProducts: Product[] = [
  editorialPlanner,
  fundComparison,
  docAssistant,
  leaveTracker,
  mySmartHaircut,
  tattooTryOnAI,
]

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return allProducts
}

/**
 * Get a product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find(product => product.slug === slug)
}

/**
 * Get products by status
 */
export function getProductsByStatus(status: Product['status']): Product[] {
  return allProducts.filter(product => product.status === status)
}

/**
 * Get featured products
 */
export function getFeaturedProducts(): Product[] {
  return allProducts.filter(product => product.featured === true)
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: Product['category']): Product[] {
  return allProducts.filter(product => product.category === category)
}

/**
 * Get live products (available to use)
 */
export function getLiveProducts(): Product[] {
  return getProductsByStatus('live')
}

/**
 * Get products for homepage shortlist
 */
export function getProductsForHomepage(limit: number = 3): Product[] {
  // Prioritize featured and live products
  const featured = getFeaturedProducts()
  const live = getLiveProducts()
  const beta = getProductsByStatus('beta')
  
  // Combine and deduplicate
  const combined = [...new Set([...featured, ...live, ...beta, ...allProducts])]
  
  return combined.slice(0, limit)
}

/**
 * Get all product slugs for static generation
 */
export function getAllProductSlugs(): string[] {
  return allProducts.map(product => product.slug)
}

/**
 * Search products by query
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return allProducts.filter(product => 
    product.title.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

// Re-export individual products for direct access if needed
export { editorialPlanner, fundComparison, docAssistant }
