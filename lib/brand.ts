import brandPalette from '@/config/brand-palette.json'

/**
 * stAItuned Brand Configuration
 * 
 * Centralized brand constants for consistent styling across the website.
 * Import this file to access brand colors, assets, and configuration.
 */

export const BRAND = {
    // Brand Identity
    name: 'stAItuned',
    tagline: 'AI e GenAI concreta per tutti',
    description: 'Articoli pratici su AI e GenAI, strumenti e playbook per crescere e ottenere risultati. Inizia dal GenAI Fit Check e dal Career OS.',

    // Site URLs
    url: 'https://staituned.com',

    // Social Links (only LinkedIn - no Twitter)
    social: {
        linkedin: 'https://www.linkedin.com/company/stai-tuned/',
    },

    // Assets
    assets: {
        logo: '/assets/general/logo.svg',
        logoText: '/assets/general/logo-text.png',
        logoTextDark: '/assets/general/logo-text-dark.png',
        heroBg: '/assets/general/home_bg.webp',
    },

    // Color Palette (single source: config/brand-palette.json)
    colors: brandPalette.colors,

    // Gradient Definitions (single source: config/brand-palette.json)
    gradients: brandPalette.gradients,

    // Animation Timings (matching Tailwind config)
    animations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        verySlow: '800ms',
    },

    // Contact Information
    contact: {
        email: 'info@staituned.com',
        labEmail: 'lab@staituned.com',
    },
} as const

// Type exports for TypeScript support
export type BrandColors = typeof BRAND.colors
export type BrandGradients = typeof BRAND.gradients

/**
 * Helper function to get gradient class string
 */
export function getBrandGradient(name: keyof typeof BRAND.gradients): string {
    return `bg-gradient-to-r ${BRAND.gradients[name]}`
}

/**
 * Helper function to get text gradient class string
 */
export function getTextGradient(name: keyof typeof BRAND.gradients = 'text'): string {
    return `bg-gradient-to-r ${BRAND.gradients[name]} bg-clip-text text-transparent`
}
