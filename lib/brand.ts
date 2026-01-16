/**
 * stAItuned Brand Configuration
 * 
 * Centralized brand constants for consistent styling across the website.
 * Import this file to access brand colors, assets, and configuration.
 */

export const BRAND = {
    // Brand Identity
    name: 'stAItuned',
    tagline: 'Guide e tutorial su AI e GenAI',
    description: 'Articoli pratici su AI e GenAI, strumenti e playbook per crescere e ottenere risultati. Inizia dal Role Fit Audit e dal Career OS.',

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

    // Color Palette (matching Tailwind config)
    colors: {
        primary: {
            300: '#4d84d4',
            400: '#566096',
            500: '#383F74',
            600: '#1A1E3B',
        },
        secondary: {
            400: '#FFF7A8',
            500: '#FFF272',
            600: '#FFE700',
        },
        accent: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
        },
    },

    // Gradient Definitions
    gradients: {
        brand: 'from-amber-400 via-amber-500 to-orange-500',
        brandSubtle: 'from-amber-400/20 to-orange-500/20',
        hero: 'from-slate-900/75 via-slate-900/85 to-slate-900/75',
        text: 'from-amber-400 via-amber-500 to-orange-600',
        lab: 'from-blue-600 via-purple-600 to-indigo-600',
    },

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
