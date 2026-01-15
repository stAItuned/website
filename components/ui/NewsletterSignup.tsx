'use client'

import { useState, FormEvent } from 'react'
import { trackNewsletterSubscribe, trackNewsletterSubscribeSuccess, trackNewsletterSubscribeError } from '@/lib/analytics'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'

interface NewsletterSignupProps {
    /** Where the signup is placed (for analytics) */
    source?: string
    /** Variant style */
    variant?: 'inline' | 'card' | 'minimal'
    /** Custom class for container */
    className?: string
    /** Show title and description */
    showHeader?: boolean
}

/**
 * Newsletter signup form component
 * 
 * Variants:
 * - inline: Horizontal layout for footer/navbar
 * - card: Full card with background (for sidebar/modals)
 * - minimal: Just input and button
 */
export function NewsletterSignup({
    source = 'website',
    variant = 'inline',
    className = '',
    showHeader = true,
}: NewsletterSignupProps) {
    const { locale } = useLearnLocale()
    const t = homeTranslations[locale]
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [consent, setConsent] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (!email.trim() || !consent) return

        setStatus('loading')
        setMessage('')

        // Track subscribe attempt
        trackNewsletterSubscribe(source)

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    source,
                    website: '', // honeypot field
                }),
            })

            if (res.ok) {
                setStatus('success')
                setMessage(t.newsletter.success)
                setEmail('')
                // Track successful subscription
                trackNewsletterSubscribeSuccess(source)
            } else {
                const data = await res.json().catch(() => ({}))
                setStatus('error')
                setMessage(data.error || t.newsletter.error)
                // Track subscription error
                trackNewsletterSubscribeError(source)
            }
        } catch {
            setStatus('error')
            setMessage(t.newsletter.error)
            // Track subscription error
            trackNewsletterSubscribeError(source)
        }
    }

    // Minimal variant
    if (variant === 'minimal') {
        return (
            <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.newsletter.placeholder}
                    required
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-60 transition"
                >
                    {status === 'loading' ? '...' : t.newsletter.button.split(' ')[0]}
                </button>
                {status !== 'idle' && (
                    <span className={`text-xs self-center ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </span>
                )}
            </form>
        )
    }

    // Card variant
    if (variant === 'card') {
        if (status === 'success') {
            return (
                <div className={`rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-green-50 p-8 shadow-md dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 dark:border-green-900/40 text-center ${className}`}>
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {t.newsletter.success}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Abbiamo appena inviato la mail di conferma. Controlla la tua inbox (e magari la cartella spam)!
                    </p>
                    <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-green-100 dark:border-green-900/20 text-sm text-green-700 dark:text-green-400 font-medium">
                        Benvenuto a bordo! 🚀
                    </div>
                </div>
            )
        }

        return (
            <div className={`rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 shadow-md dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-amber-900/40 ${className}`}>
                {showHeader && (
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span className="text-2xl">📬</span>
                            {t.newsletter.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            {t.newsletter.description}
                        </p>
                    </div>
                )}

                <div className="mb-6 space-y-3">
                    {t.newsletter.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <svg className="w-3 h-3 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            {benefit}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.newsletter.placeholder}
                            required
                            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all shadow-inner"
                            disabled={status === 'loading'}
                        />
                        {/* Honeypot field - hidden from users */}
                        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <input
                            type="checkbox"
                            id="newsletter-consent"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            required
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                        />
                        <label htmlFor="newsletter-consent" className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 cursor-pointer">
                            {t.newsletter.consent}
                            <a href="/terms" className="text-amber-600 dark:text-amber-400 hover:underline mx-1">{t.newsletter.termsConditions}</a>
                            e confermo la <a href="/privacy" className="text-amber-600 dark:text-amber-400 hover:underline mx-1">{t.newsletter.privacyPolicy}</a>.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading' || !consent}
                        className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 shadow-md transition"
                    >
                        {status === 'loading' ? t.newsletter.loading : t.newsletter.button}
                    </button>
                </form>
                {status === 'error' && (
                    <p className="mt-3 text-sm text-center text-red-500">
                        {message}
                    </p>
                )}
                <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                    Niente spam. Puoi disiscriverti quando vuoi.
                </p>
            </div>
        )
    }

    // Inline variant (default)
    return (
        <div className={`${className}`}>
            {showHeader && (
                <p className="text-sm font-semibold text-slate-200 mb-2">
                    📬 {t.newsletter.title}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.newsletter.placeholder}
                        required
                        className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                        disabled={status === 'loading'}
                    />
                    {/* Honeypot field */}
                    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                    <button
                        type="submit"
                        disabled={status === 'loading' || !consent}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-60 transition whitespace-nowrap"
                    >
                        {status === 'loading' ? '...' : t.newsletter.button.split(' ')[0]}
                    </button>
                </div>

                <div className="flex items-start gap-2 max-w-xs">
                    <input
                        type="checkbox"
                        id={`consent-footer-${source}`}
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        required
                        className="mt-1 w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                    />
                    <label htmlFor={`consent-footer-${source}`} className="text-[10px] leading-tight text-slate-400 cursor-pointer">
                        {t.newsletter.consent}
                        <a href="/terms" className="underline hover:text-amber-300 mx-1">{t.newsletter.termsConditions}</a>
                        e la <a href="/privacy" className="underline hover:text-amber-300">Privacy Policy</a>.
                    </label>
                </div>

                {status !== 'idle' && (
                    <p className={`mt-2 text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}
