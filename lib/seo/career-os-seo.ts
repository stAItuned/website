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

// ============================================================================
// Career OS Course Schema
// ============================================================================

/**
 * Generate Course JSON-LD schema for Career OS
 * Represents the mentorship program as an educational course
 */
export function generateCareerOSCourseSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': 'Career OS - Percorso GenAI Engineer',
        'description': 'Programma di mentorship intensivo per diventare GenAI Engineer in 4-8 settimane. Non un corso teorico: costruisci asset professionali (CV, Proof GitHub, Interview Skills) guidato da chi assume nel settore AI.',
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
            'audienceType': 'Junior developers, Data professionals, Career changers targeting AI roles',
        },
        'teaches': [
            'GenAI Engineering',
            'Applied AI (RAG, Agents)',
            'AI Career Strategy',
            'Technical Interview Preparation',
            'Portfolio Development',
            'GenAI Career Acceleration'
        ],
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
        'offers': [
            {
                '@type': 'Offer',
                'name': 'Starter',
                'description': 'Accesso base al percorso Career OS',
                'price': '590',
                'priceCurrency': 'EUR',
                'availability': 'https://schema.org/InStock',
                'url': `${BRAND.url}/career-os#pricing`,
            },
            {
                '@type': 'Offer',
                'name': 'Pro',
                'description': 'Percorso completo con mentorship 1:1',
                'price': '1190',
                'priceCurrency': 'EUR',
                'availability': 'https://schema.org/InStock',
                'url': `${BRAND.url}/career-os#pricing`,
            },
            {
                '@type': 'Offer',
                'name': 'Premium',
                'description': 'Percorso intensivo con supporto prioritario',
                'price': '1990',
                'priceCurrency': 'EUR',
                'availability': 'https://schema.org/InStock',
                'url': `${BRAND.url}/career-os#pricing`,
            },
        ],
        'inLanguage': 'it',
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
const CAREER_OS_FAQS = [
    {
        question: 'È il percorso adatto a me?',
        answer: 'Sì, se hai background tecnico (dev/data), sei junior/early-career e cerchi ruoli Applied AI (RAG, Agents). No, se parti da zero assoluto col codice, cerchi solo teoria/video passivi, o sei già Senior AI Engineer.',
    },
    {
        question: 'Che requisiti servono?',
        answer: 'Serve familiarità con codice (Python/JS non ti spaventa). Non serve sapere di AI/LLM: quello te lo insegniamo noi. Se sai scrivere una funzione e usare Git, sei pronto.',
    },
    {
        question: 'Perché NON è il solito bootcamp?',
        answer: 'I bootcamp vendono ore di video registrati. Noi vendiamo outcome professionali. In Career OS non guardi lezioni: costruisci asset (CV, GitHub, Proof) e ricevi feedback da chi assume. È un simulatore di lavoro, non un corso.',
    },
    {
        question: 'Garantite il lavoro?',
        answer: 'No. Chi lo promette ti mente. Ti promettiamo però che uscirai con gli asset che servono per essere presi sul serio (Role-fit, Proof tecnica, Interview skill). Ti diamo il "sistema" che ha funzionato per noi e per chi abbiamo assunto.',
    },
    {
        question: 'Quanto impegno richiede?',
        answer: '5-8 ore a settimana. È pensato per chi lavora o studia ancora. Ci sono deadline settimanali per mantenerti in carreggiata, ma il lavoro è asincrono.',
    },
    {
        question: 'Come funziona il pagamento?',
        answer: 'Puoi pagare in un\'unica soluzione o dividere in 2-3 rate mensili senza interessi. Se non sei soddisfatto nei primi 15 giorni (prima del primo deliverable), ti rimborsiamo.',
    },
]

/**
 * Generate FAQ JSON-LD schema for Career OS
 * Enables rich FAQ snippets in search results
 */
export function generateCareerOSFAQSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': CAREER_OS_FAQS.map(faq => ({
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
export function generateCareerOSBreadcrumbSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': BRAND.url,
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Career OS',
                'item': `${BRAND.url}/career-os`,
            },
        ],
    }
}
