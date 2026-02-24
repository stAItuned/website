/**
 * Career OS SEO Structured Data Schemas (JSON-LD)
 * 
 * Generates Schema.org structured data for the Career OS landing page
 * to improve search engine understanding and enable rich snippets.
 * 
 * Schemas included:
 * - Course (EducationalCourse) - The mentorship program
 * - FAQPage - Frequently asked questions
 */

import { BRAND } from '@/lib/brand'
import { careerOSTranslations, type CareerOSLocale } from '@/lib/i18n/career-os-translations'

// ============================================================================
// Career OS Course Schema
// ============================================================================

/**
 * Generate Course JSON-LD schema for Career OS
 * Represents the mentorship program as an educational course
 */
export function generateCareerOSCourseSchema(locale: CareerOSLocale) {
    const t = careerOSTranslations[locale]
    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': t.jsonLd.courseName,
        'description': t.jsonLd.courseDescription,
        'url': `${BRAND.url}/career-os`,
        'provider': {
            '@type': 'Organization',
            'name': BRAND.name,
            'url': BRAND.url,
            'logo': `${BRAND.url}${BRAND.assets.logoText}`,
        },
        'educationalLevel': 'Intermediate',
        'audience': {
            '@type': 'Audience',
            'audienceType': t.jsonLd.audienceType,
        },
        'teaches': t.jsonLd.teaches,
        'hasCourseInstance': {
            '@type': 'CourseInstance',
            'courseMode': 'online',
            'duration': 'P8W', // 8 weeks
            'courseWorkload': 'PT6H/W', // ~6 hours per week
            'instructor': {
                '@type': 'Person',
                'name': 'Daniele Moltisanti',
                'jobTitle': 'Principal Data Scientist & GenAI Expert',
            },
        },
        'offers': t.jsonLd.offers.map((offer) => ({
            '@type': 'Offer',
            'name': offer.name,
            'description': offer.description,
            'price': offer.price,
            'priceCurrency': 'EUR',
            'availability': 'https://schema.org/InStock',
            'url': `${BRAND.url}/career-os#pricing`,
        })),
        'inLanguage': locale,
        'isAccessibleForFree': false,
    }
}

// ============================================================================
// Career OS FAQ Schema
// ============================================================================

/**
 * FAQ items for Career OS - used for JSON-LD schema
 * Keep in sync with FAQ.tsx component content
 */
/**
 * Generate FAQ JSON-LD schema for Career OS
 * Enables rich FAQ snippets in search results
 */
export function generateCareerOSFAQSchema(locale: CareerOSLocale) {
    const t = careerOSTranslations[locale]
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': t.jsonLd.faq.map((faq) => ({
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
// Career OS Breadcrumb Schema
// ============================================================================

/**
 * Generate Breadcrumb JSON-LD schema for Career OS
 */
export function generateCareerOSBreadcrumbSchema(locale: CareerOSLocale) {
    const t = careerOSTranslations[locale]
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': t.jsonLd.breadcrumbHome,
                'item': BRAND.url,
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': t.jsonLd.breadcrumbCurrent,
                'item': `${BRAND.url}/career-os`,
            },
        ],
    }
}
