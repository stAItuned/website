'use client'

import Link from 'next/link'

interface ContributorCTAProps {
    /** Component variant style */
    variant?: 'card' | 'inline'
    /** Custom class for container */
    className?: string
    /** Source for analytics tracking (unused in link version but kept for API compat) */
    source?: string
}

/**
 * ContributorCTA - Call-to-action component inviting users to write for stAItuned
 * Links to the /contribute landing page.
 */
export function ContributorCTA({
    variant = 'card',
    className = '',
}: ContributorCTAProps) {

    // Card variant (default - for article end)
    if (variant === 'card') {
        return (
            <div className={`rounded-2xl border-2 border-primary-200 dark:border-primary-800/50 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 shadow-lg ${className}`}>
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-3 animate-pulse">
                        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Condividi la tua esperienza AI
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
                        Diventa un autore per stAItuned. Noi gestiamo editing, SEO e distribuzione. Tu mantieni la firma.
                    </p>

                    <div className="mt-6">
                        <Link
                            href="/contribute"
                            className="inline-block px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Diventa Contributor
                        </Link>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        Processo guidato • Ottimizzazione GEO inclusa
                    </p>
                </div>
            </div>
        )
    }

    // Inline variant (compact)
    return (
        <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-primary-50 dark:bg-slate-800 border border-primary-100 dark:border-slate-700 ${className}`}>
            <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    ✍️ Vuoi scrivere per stAItuned?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Condividi le tue competenze con una audience qualificata
                </p>
            </div>
            <Link
                href="/contribute"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition whitespace-nowrap"
            >
                Scopri di più
            </Link>
        </div>
    )
}
