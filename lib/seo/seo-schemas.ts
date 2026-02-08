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
 * 
 * Enhanced for GEO: includes knowsAbout, areaServed, founder for AI search
 */
export function generateOrganizationSchema(options: OrganizationSchemaOptions = {}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': options.name || BRAND.name,
        'alternateName': options.alternateName || [
            'stAI tuned',
            'Staituned',
            'stay tuned',
            'staytuned',
            'stay tuned AI',
            'stai tuned',
            'staituned AI',
        ],
        'url': BRAND.url,
        'logo': `${BRAND.url}${BRAND.assets.logoText}`,
        'description': BRAND.description,
        'foundingDate': '2023',
        'founder': {
            '@type': 'Person',
            'name': 'Daniele Moltisanti',
            'jobTitle': 'Principal Data Scientist & GenAI Expert',
        },
        'knowsAbout': [
            'Generative AI',
            'GenAI Engineering',
            'Machine Learning',
            'AI Career Development',
            'Applied AI',
            'Applied GenAI',
            'Agentic AI',
            'RAG Systems',
            'AI Agents',
        ],
        'areaServed': {
            '@type': 'Country',
            'name': 'Italy',
        },
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
 * 
 * Enhanced for GEO: includes speakable for voice search
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
            'url': `${BRAND.url}/author/${options.author.toLowerCase().replace(/\\s+/g, '-')}`,
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
        'isAccessibleForFree': true,
        // Speakable specification for voice search / Google Assistant
        'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': ['#geo-quick-answer', '#geo-definition', 'article h1', 'article h2', '.article-summary', 'article p:first-of-type'],
        },
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

export interface ServiceOfferOptions {
    name: string
    price: string
    priceCurrency?: string
    description?: string
}

export interface ServiceSchemaOptions {
    name: string
    description: string
    url: string
    provider?: string
    serviceType?: string
    offers?: ServiceOfferOptions[]
}

/**
 * Generate Service JSON-LD schema
 * Use on service/product pages
 * 
 * Enhanced: includes offers for pricing visibility in search
 */
export function generateServiceSchema(options: ServiceSchemaOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': options.name,
        'description': options.description,
        'url': options.url.startsWith('http') ? options.url : `${BRAND.url}${options.url}`,
        ...(options.serviceType && { 'serviceType': options.serviceType }),
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
        ...(options.offers && options.offers.length > 0 && {
            'offers': options.offers.map(offer => ({
                '@type': 'Offer',
                'name': offer.name,
                'price': offer.price,
                'priceCurrency': offer.priceCurrency || 'EUR',
                ...(offer.description && { 'description': offer.description }),
                'availability': 'https://schema.org/InStock',
            })),
        }),
    }
}

// ============================================================================
// Person Schema (for author pages - E-E-A-T)
// ============================================================================

export interface PersonSchemaOptions {
    /** Person's full name */
    name: string
    /** Job title */
    jobTitle?: string
    /** URL to person's page on the site */
    url?: string
    /** URL to person's image */
    image?: string
    /** Short bio/description */
    description?: string
    /** Areas of expertise */
    knowsAbout?: string[]
    /** Social profile URLs */
    sameAs?: string[]
    /** Works for organization */
    worksFor?: {
        name: string
        url?: string
    }
}

/**
 * Generate Person JSON-LD schema
 * Use on author pages to establish E-E-A-T (Experience, Expertise, Authority, Trust)
 * 
 * Critical for GEO: AI search engines use this to attribute expertise
 */
export function generatePersonSchema(options: PersonSchemaOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': options.name,
        ...(options.jobTitle && { 'jobTitle': options.jobTitle }),
        ...(options.url && { 'url': options.url.startsWith('http') ? options.url : `${BRAND.url}${options.url}` }),
        ...(options.image && {
            'image': {
                '@type': 'ImageObject',
                'url': options.image.startsWith('http') ? options.image : `${BRAND.url}${options.image}`,
            },
        }),
        ...(options.description && { 'description': options.description }),
        ...(options.knowsAbout && options.knowsAbout.length > 0 && { 'knowsAbout': options.knowsAbout }),
        ...(options.sameAs && options.sameAs.length > 0 && { 'sameAs': options.sameAs }),
        ...(options.worksFor && {
            'worksFor': {
                '@type': 'Organization',
                'name': options.worksFor.name,
                ...(options.worksFor.url && { 'url': options.worksFor.url }),
            },
        }),
    }
}

// ============================================================================
// HowTo Schema (for tutorial/guide pages)
// ============================================================================

export interface HowToStep {
    name: string
    text: string
    image?: string
}

export interface HowToSchemaOptions {
    name: string
    description: string
    totalTime?: string  // ISO 8601 duration, e.g., "PT30M" for 30 minutes
    steps: HowToStep[]
}

/**
 * Generate HowTo JSON-LD schema
 * Use on tutorial/guide pages for rich results with step-by-step instructions
 */
export function generateHowToSchema(options: HowToSchemaOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': options.name,
        'description': options.description,
        ...(options.totalTime && { 'totalTime': options.totalTime }),
        'step': options.steps.map((step, index) => ({
            '@type': 'HowToStep',
            'position': index + 1,
            'name': step.name,
            'text': step.text,
            ...(step.image && {
                'image': {
                    '@type': 'ImageObject',
                    'url': step.image.startsWith('http') ? step.image : `${BRAND.url}${step.image}`,
                },
            }),
        })),
    }
}
