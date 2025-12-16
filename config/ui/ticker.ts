/**
 * ArticleTicker Configuration
 * Centralized settings for the article ticker component used across the app.
 */

export const tickerConfig = {
    // Featured article threshold (minimum page views to be featured)
    featuredThreshold: 100,

    // Speed options (pixels per second)
    speed: {
        slow: 30,
        normal: 50,
        fast: 80,
        turbo: 120,
    },

    // Default props for consistency across pages
    defaults: {
        speed: 'normal' as const,
        pauseOnHover: true,
        showCover: true,
        showDate: true,
        showStats: true,
    },

    // Styling configuration
    styles: {
        // Featured article styling (high engagement)
        featured: {
            background: 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800',
            border: 'border-2 border-amber-400/60 dark:border-amber-500/50',
            shadow: 'shadow-lg',
        },
        // Default article styling
        default: {
            background: 'bg-white dark:bg-slate-800',
            border: 'border-2 border-slate-200 dark:border-slate-600',
            shadow: 'shadow-md',
        },
        // Hover state
        hover: {
            background: 'hover:bg-primary-50 dark:hover:bg-primary-900/40',
            border: 'hover:border-primary-400 dark:hover:border-primary-500',
            shadow: 'hover:shadow-xl hover:scale-[1.02]',
        },
    },

    // Badge styling
    badges: {
        new: {
            // Modern dot indicator - subtle but noticeable, follows UX best practices
            className: 'absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-sm z-10 ring-2 ring-white dark:ring-slate-800',
            // Alternative pill style if text is needed
            pillClassName: 'absolute top-1 right-1 px-1 py-px text-[6px] font-medium uppercase bg-emerald-500 text-white rounded-full z-10',
        },
        featured: {
            className: 'absolute top-1 left-1 w-4 h-4 flex items-center justify-center bg-amber-400 text-amber-900 rounded shadow-sm z-10',
        },
    },

    // Number of articles to display
    articleCount: {
        home: 20,
        learn: 15,
    },
} as const

export type TickerSpeed = keyof typeof tickerConfig.speed
