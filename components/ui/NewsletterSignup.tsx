'use client'

import { useState, FormEvent } from 'react'
import { trackNewsletterSubscribe, trackNewsletterSubscribeSuccess, trackNewsletterSubscribeError } from '@/lib/analytics'

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
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (!email.trim()) return

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
                setMessage('🎉 Iscrizione completata!')
                setEmail('')
                // Track successful subscription
                trackNewsletterSubscribeSuccess(source)
            } else {
                const data = await res.json().catch(() => ({}))
                setStatus('error')
                setMessage(data.error || 'Errore. Riprova.')
                // Track subscription error
                trackNewsletterSubscribeError(source)
            }
        } catch {
            setStatus('error')
            setMessage('Errore di connessione. Riprova.')
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
                    placeholder="La tua email"
                    required
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-60 transition"
                >
                    {status === 'loading' ? '...' : 'Iscriviti'}
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
        return (
            <div className={`rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 shadow-md dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-amber-900/40 ${className}`}>
                {showHeader && (
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            📬 Resta aggiornato
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            Nuovi articoli, tool e casi d\'uso AI direttamente nella tua inbox.
                        </p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="La tua email"
                        required
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                        disabled={status === 'loading'}
                    />
                    {/* Honeypot field - hidden from users */}
                    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 shadow-md transition"
                    >
                        {status === 'loading' ? 'Un momento...' : 'Iscriviti alla newsletter'}
                    </button>
                </form>
                {status !== 'idle' && (
                    <p className={`mt-3 text-sm text-center ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
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
                    📬 Newsletter
                </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="La tua email"
                    required
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                    disabled={status === 'loading'}
                />
                {/* Honeypot field */}
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-60 transition whitespace-nowrap"
                >
                    {status === 'loading' ? '...' : 'Iscriviti'}
                </button>
            </form>
            {status !== 'idle' && (
                <p className={`mt-2 text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
