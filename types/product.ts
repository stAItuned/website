/**
 * Product type definitions
 * 
 * This file defines the structure for all products in the system.
 * Each product should implement this interface.
 */

export type ProductStatus = 'coming-soon' | 'live' | 'beta'

export interface ProductFeature {
  title: string
  description: string
  icon?: string
}

export interface ProductCaseStudy {
  company: string
  companySize: string
  industry?: string
  problem: string
  solution: string
  results: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

export interface ProductFAQItem {
  question: string
  answer: string
}

export interface ProductBenefit {
  metric: string
  description: string
}

export interface ProductUseCase {
  title: string
  description: string
  before: string
  after: string
}

export interface ProductTestimonial {
  quote: string
  author: string
  role: string
  company: string
}

export interface ProductCTA {
  text: string
  href: string
}

export interface ProductPricingTier {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

export interface Product {
  // Basic Info
  slug: string
  title: string
  subtitle?: string
  tagline?: string
  description: string
  shortDescription?: string
  longDescription?: string
  metaDescription?: string
  keywords?: string[]
  language?: 'en' | 'it' // Language of the product content
  
  // Visual
  image?: string
  images?: string[]
  coverImage?: string
  videoOrientation?: 'landscape' | 'portrait'
  
  // Status & Availability
  status: ProductStatus
  link?: string
  liveUrl?: string
  demoLink?: string
  demoUrl?: string
  githubLink?: string
  githubUrl?: string
  
  // Categorization
  tags: string[]
  category: 'marketing' | 'automation' | 'analytics' | 'productivity' | 'enterprise' | 'hr' | 'operations' | 'other'
  techStack?: string[]
  
  // Detail Page Content
  problem?: string
  problemStatement?: string
  solution?: string
  solutionDescription?: string
  features?: ProductFeature[]
  benefits?: ProductBenefit[]
  useCases?: ProductUseCase[]
  caseStudy?: ProductCaseStudy
  technicalSpecs?: {
    tech: string[]
    deployment?: string
    apiAvailable?: boolean
  }
  faq?: ProductFAQItem[]
  faqs?: ProductFAQItem[]
  testimonial?: ProductTestimonial
  relatedProducts?: string[]
  
  // Pricing & CTA
  pricing?: {
    model: 'free' | 'freemium' | 'custom' | 'contact' | 'subscription'
    description?: string
    tiers?: ProductPricingTier[]
  }
  cta?: {
    primary: ProductCTA
    secondary?: ProductCTA
  }
  ctaText?: string
  ctaLink?: string
  ctaUrl?: string
  
  // Metadata
  metadata?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  publishedDate?: string
  lastUpdated?: string
  featured?: boolean
}
