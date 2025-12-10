/**
 * SEO Structured Data Schemas (JSON-LD)
 * 
 * Generators for various Schema.org structured data types to improve
 * search engine understanding and rich results.
 */

import { BRAND } from '@/lib/brand'

// ============================================================================
// Organization Schema
// ============================================================================

export interface OrganizationSchemaOptions {
    /** Override the default organization name */
    name?: string
    /** Additional alternate names */
    alternateName?: string[]
}

/**
 * Generate Organization JSON-LD schema
 * Use on the homepage to establish brand identity
 */
export function generateOrganizationSchema(options: OrganizationSchemaOptions = {}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': options.name || BRAND.name,
        'alternateName': options.alternateName || ['stAI tuned', 'Staituned'],
        'url': BRAND.url,
        'logo': `${BRAND.url}${BRAND.assets.logoText}`,
        'description': BRAND.description,
        'sameAs': [
            BRAND.social.linkedin,
        ],
        'contactPoint': {
            '@type': 'ContactPoint',
            'email': BRAND.contact.email,
            'contactType': 'customer service',
            'availableLanguage': ['Italian', 'English'],
        },
    }
}

// ============================================================================
// Website Schema
// ============================================================================

/**
 * Generate Website JSON-LD schema
 * Helps search engines understand site structure and search functionality
 */
export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': BRAND.name,
        'url': BRAND.url,
        'description': BRAND.description,
        'potentialAction': {
            '@type': 'SearchAction',
            'target': {
                '@type': 'EntryPoint',
                'urlTemplate': `${BRAND.url}/learn?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }
}

// ============================================================================
// Article Schema
// ============================================================================

export interface ArticleSchemaOptions {
    /** Article title */
    title: string
    /** Article description/meta */
    description: string
    /** Article URL slug */
    slug: string
    /** Author name */
    author: string
    /** Publication date (ISO string) */
    datePublished: string
    /** Last modified date (ISO string) */
    dateModified?: string
    /** Cover image URL */
    image?: string
    /** Article section/category */
    section?: string
    /** Keywords/tags */
    keywords?: string[]
    /** Reading time in minutes */
    readingTime?: number
}

/**
 * Generate Article JSON-LD schema
 * Use on blog post pages for rich snippets
 */
export function generateArticleSchema(options: ArticleSchemaOptions) {
    const articleUrl = `${BRAND.url}/learn/${options.section?.toLowerCase() || 'technical'}/${options.slug}`

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': options.title,
        'description': options.description,
        'url': articleUrl,
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
        'author': {
            '@type': 'Person',
            'name': options.author,
            'url': `${BRAND.url}/author/${options.author.toLowerCase().replace(/\s+/g, '-')}`,
        },
        'publisher': {
            '@type': 'Organization',
            'name': BRAND.name,
            'logo': {
                '@type': 'ImageObject',
                'url': `${BRAND.url}${BRAND.assets.logoText}`,
            },
        },
        'datePublished': options.datePublished,
        'dateModified': options.dateModified || options.datePublished,
        ...(options.image && {
            'image': {
                '@type': 'ImageObject',
                'url': options.image.startsWith('http') ? options.image : `${BRAND.url}${options.image}`,
            },
        }),
        ...(options.keywords && { 'keywords': options.keywords.join(', ') }),
        ...(options.readingTime && { 'timeRequired': `PT${options.readingTime}M` }),
        'articleSection': options.section || 'Technology',
        'inLanguage': 'it-IT',
    }
}

// ============================================================================
// FAQ Schema
// ============================================================================

export interface FAQItem {
    question: string
    answer: string
}

/**
 * Generate FAQ JSON-LD schema
 * Use on pages with FAQ sections for rich snippets in search results
 */
export function generateFAQSchema(faqs: FAQItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer,
            },
        })),
    }
}

// ============================================================================
// Breadcrumb Schema
// ============================================================================

export interface BreadcrumbItem {
    name: string
    url: string
}

/**
 * Generate BreadcrumbList JSON-LD schema
 * Helps search engines understand page hierarchy
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url.startsWith('http') ? item.url : `${BRAND.url}${item.url}`,
        })),
    }
}

// ============================================================================
// Service Schema (for business pages)
// ============================================================================

export interface ServiceSchemaOptions {
    name: string
    description: string
    url: string
    provider?: string
}

/**
 * Generate Service JSON-LD schema
 * Use on service/product pages
 */
export function generateServiceSchema(options: ServiceSchemaOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': options.name,
        'description': options.description,
        'url': options.url.startsWith('http') ? options.url : `${BRAND.url}${options.url}`,
        'provider': {
            '@type': 'Organization',
            'name': options.provider || BRAND.name,
            'url': BRAND.url,
        },
        'areaServed': {
            '@type': 'Country',
            'name': 'Italy',
        },
        'availableLanguage': ['Italian', 'English'],
    }
}
