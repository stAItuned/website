'use client'

import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { Bug, Lightbulb, MessageCircle, Send, ShieldCheck, X } from 'lucide-react'
import { feedbackPayloadSchema } from '@/lib/validation/feedback'
import { contributeTranslations, ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { useLearnLocale } from '@/lib/i18n'

type FeedbackCategory = 'bug' | 'comment' | 'idea'

type FeedbackFormState = {
    category: FeedbackCategory
    message: string
    email: string
    consent: boolean
    website: string
}

type FeedbackStatus = 'idle' | 'sending' | 'success'

const CATEGORY_ICONS: Record<FeedbackCategory, typeof Bug> = {
    bug: Bug,
    comment: MessageCircle,
    idea: Lightbulb,
}

/**
 * Floating feedback widget for the contribute area.
 */
export function ContributeFeedbackWidget() {
    const { locale } = useLearnLocale()
    const lang = (locale || 'it') as ContributeLanguage
    const t = contributeTranslations[lang].landing.feedbackWidget

    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<FeedbackStatus>('idle')
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState('')
    const [userAgent, setUserAgent] = useState('')
    const [form, setForm] = useState<FeedbackFormState>({
        category: 'comment',
        message: '',
        email: '',
        consent: false,
        website: '',
    })

    useEffect(() => {
        if (typeof window === 'undefined') return
        setPage(window.location.href)
        setUserAgent(navigator.userAgent)
    }, [])

    useEffect(() => {
        if (!open) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    useEffect(() => {
        if (!open) return
        const { body } = document
        const previousOverflow = body.style.overflow
        body.style.overflow = 'hidden'
        return () => {
            body.style.overflow = previousOverflow
        }
    }, [open])

    const categories = useMemo(
        () => [
            { value: 'bug' as const, ...t.categories.bug },
            { value: 'comment' as const, ...t.categories.comment },
            { value: 'idea' as const, ...t.categories.idea },
        ],
        [t.categories]
    )

    const categoryLabel = useMemo(
        () => categories.find((item) => item.value === form.category)?.label ?? t.categories.comment.label,
        [categories, form.category, t.categories.comment.label]
    )

    const resetForm = () => {
        setForm({ category: 'comment', message: '', email: '', consent: false, website: '' })
        setStatus('idle')
        setError(null)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        setStatus('sending')

        const payload = {
            category: form.category,
            message: form.message.trim(),
            email: form.email.trim(),
            page: page || 'unknown',
            userAgent,
            consent: form.consent,
            website: form.website,
        }

        const parsed = feedbackPayloadSchema.safeParse(payload)
        if (!parsed.success) {
            const issues = parsed.error.flatten().fieldErrors
            if (issues.consent) {
                setError(t.errors.consent)
            } else if (issues.message) {
                setError(t.errors.message)
            } else if (issues.email) {
                setError(t.errors.email)
            } else {
                setError(t.errors.generic)
            }
            setStatus('idle')
            return
        }

        try {
            const response = await fetch('/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed.data),
            })

            if (!response.ok) {
                throw new Error(t.errors.network)
            }

            setStatus('success')
            setTimeout(() => {
                setOpen(false)
                resetForm()
            }, 1400)
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : t.errors.network
            setError(message)
            setStatus('idle')
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-[60] xs:bottom-6 xs:right-6">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/80 px-4 py-2 text-sm font-semibold text-primary-600 shadow-lg shadow-primary-600/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                aria-label={t.cta}
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-md shadow-primary-600/30 transition-all duration-300 group-hover:scale-105">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                </span>
                {t.cta}
            </button>

            {open ? (
                <div className="fixed inset-0 z-[70]">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-fade-in"
                        aria-label={t.closeLabel}
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed bottom-20 right-4 w-[calc(100%-2rem)] max-w-md animate-slide-up xs:bottom-24 xs:right-6">
                        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
                                        {t.badge}
                                    </p>
                                    <h2 className="mt-2 text-xl font-semibold text-primary-600">
                                        {t.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {t.subtitle}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:border-slate-300 hover:text-slate-700"
                                    aria-label={t.closeLabel}
                                >
                                    <X className="h-4 w-4" aria-hidden />
                                </button>
                            </div>

                            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                                <div className="grid gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                        {t.typeLabel}
                                    </p>
                                    <div className="grid gap-2 xs:grid-cols-3">
                                        {categories.map((item) => {
                                            const Icon = CATEGORY_ICONS[item.value]
                                            const isActive = form.category === item.value
                                            return (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    onClick={() => setForm((prev) => ({ ...prev, category: item.value }))}
                                                    className={clsx(
                                                        'flex items-center gap-2 rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition-all duration-300',
                                                        isActive
                                                            ? 'border-primary-500 bg-primary-600 text-white shadow-md shadow-primary-600/20'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600'
                                                    )}
                                                >
                                                    <span
                                                        className={clsx(
                                                            'flex h-7 w-7 items-center justify-center rounded-full',
                                                            isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                                                        )}
                                                    >
                                                        <Icon className="h-4 w-4" aria-hidden />
                                                    </span>
                                                    <span>
                                                        {item.label}
                                                        <span className="block text-[10px] font-normal opacity-80">
                                                            {item.description}
                                                        </span>
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                                    {t.messageLabel}
                                    <textarea
                                        value={form.message}
                                        onChange={(event) =>
                                            setForm((prev) => ({ ...prev, message: event.target.value }))
                                        }
                                        className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                        placeholder={t.messagePlaceholder}
                                    />
                                </label>

                                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                                    {t.emailLabel}
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            setForm((prev) => ({ ...prev, email: event.target.value }))
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                        placeholder={t.emailPlaceholder}
                                    />
                                </label>

                                <input
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className="hidden"
                                    value={form.website}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, website: event.target.value }))
                                    }
                                />

                                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600/10 text-primary-600">
                                        <ShieldCheck className="h-4 w-4" aria-hidden />
                                    </span>
                                    <span className="flex-1">
                                        <span className="font-semibold text-slate-700">{t.consentTitle}</span>
                                        <span className="block">{t.consentDescription}</span>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={form.consent}
                                        onChange={(event) =>
                                            setForm((prev) => ({ ...prev, consent: event.target.checked }))
                                        }
                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </label>

                                {error ? (
                                    <p className="text-xs font-semibold text-red-500" role="alert">
                                        {error}
                                    </p>
                                ) : null}

                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-xs text-slate-500">
                                        {t.categoryLabel}{' '}
                                        <span className="font-semibold text-slate-700">{categoryLabel}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className={clsx(
                                            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300',
                                            status === 'sending'
                                                ? 'bg-primary-400'
                                                : 'bg-primary-600 hover:bg-primary-500'
                                        )}
                                    >
                                        <Send className="h-4 w-4" aria-hidden />
                                        {status === 'sending' ? t.sending : t.submit}
                                    </button>
                                </div>

                                {status === 'success' ? (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                        {t.success}
                                    </div>
                                ) : null}
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
