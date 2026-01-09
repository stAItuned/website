'use client'

import { FormEvent, useCallback, useMemo, useState } from 'react'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const BACKGROUND_OPTIONS = [
    'Studente magistrale',
    'Neolaureato (≤12 mesi)',
    'Junior SWE (0-2y)',
    'Career switcher',
    'Altro',
]

const ROLE_TARGET_OPTIONS = [
    'RAG Engineer',
    'Agent Engineer',
    'GenAI Product Eng',
    'Non so ancora',
]

const TIMELINE_OPTIONS = [
    'Sto cercando ora',
    'Nei prossimi 3 mesi',
    'Più avanti',
]

const BLOCK_OPTIONS = [
    'Non so quale ruolo',
    'CV non converte',
    'No portfolio',
    'Interview anxiety',
    'Altro',
]

const APPLICATIONS_OPTIONS = [
    '0',
    '1-10',
    '11-30',
    '30+',
]

type FormData = {
    name: string
    email: string
    background: string
    roleTarget: string
    timeline: string
    mainBlock: string
    applicationsLastMonth: string
    linkedinUrl: string
    notes: string
    website: string
}

const INITIAL_FORM_DATA: FormData = {
    name: '',
    email: '',
    background: '',
    roleTarget: '',
    timeline: '',
    mainBlock: '',
    applicationsLastMonth: '',
    linkedinUrl: '',
    notes: '',
    website: '',
}

function trackGtagEvent(eventName: string, params: Record<string, string | number | undefined>) {
    if (typeof window === 'undefined' || !window.gtag) return
    window.gtag('event', eventName, params)
}

export default function ApplicationFormSection({
    source = 'homepage/career-os',
}: {
    source?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [status, setStatus] = useState<FormStatus>('idle')
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
    const [lastStep, setLastStep] = useState(1)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const calendlyUrl = process.env.NEXT_PUBLIC_CAREER_OS_CALENDLY_URL || ''

    const resetForm = useCallback(() => {
        setStep(1)
        setStatus('idle')
        setMessage('')
        setFormData(INITIAL_FORM_DATA)
        setLastStep(1)
        setHasSubmitted(false)
    }, [])

    const openModal = useCallback(() => {
        resetForm()
        setIsOpen(true)
        trackGtagEvent('form_start', {
            event_category: 'engagement',
            source,
        })
    }, [resetForm, source])

    const closeModal = useCallback(() => {
        setIsOpen(false)
        if (!hasSubmitted) {
            trackGtagEvent('form_abandon', {
                event_category: 'engagement',
                source,
                last_step: lastStep,
            })
        }
    }, [hasSubmitted, lastStep, source])

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const currentStepLabel = useMemo(() => `Step ${step} di 4`, [step])

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!formData.name.trim()) return 'Inserisci il tuo nome.'
            if (!formData.email.trim()) return 'Inserisci una email valida.'
            if (!formData.background) return 'Seleziona il tuo background.'
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email.trim())) return 'Formato email non valido.'
        }
        if (currentStep === 2) {
            if (!formData.roleTarget) return 'Seleziona il ruolo target.'
            if (!formData.timeline) return 'Seleziona una timeline.'
        }
        if (currentStep === 3) {
            if (!formData.mainBlock) return 'Seleziona il blocco principale.'
            if (!formData.applicationsLastMonth) return 'Seleziona il numero di candidature.'
        }
        return ''
    }

    const handleNext = () => {
        const error = validateStep(step)
        if (error) {
            setStatus('error')
            setMessage(error)
            return
        }

        setStatus('idle')
        setMessage('')
        trackGtagEvent('form_step_complete', {
            event_category: 'engagement',
            source,
            step,
        })
        setLastStep(step)
        setStep(prev => Math.min(prev + 1, 4))
    }

    const handleBack = () => {
        setStatus('idle')
        setMessage('')
        setStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        const error = validateStep(step)
        if (error) {
            setStatus('error')
            setMessage(error)
            return
        }

        if (step === 4) {
            trackGtagEvent('form_step_complete', {
                event_category: 'engagement',
                source,
                step: 4,
            })
            setLastStep(4)
        }

        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch('/api/career-os/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    source,
                    page: window.location.pathname,
                    userAgent: navigator.userAgent,
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || 'Errore nell’invio. Riprova.')
            }

            setStatus('success')
            setHasSubmitted(true)
            trackGtagEvent('form_submit', {
                event_category: 'conversion',
                source,
                background: formData.background,
                role_target: formData.roleTarget,
                urgency: formData.timeline,
            })
        } catch (err) {
            setStatus('error')
            setMessage(err instanceof Error ? err.message : 'Errore nell’invio. Riprova.')
        }
    }

    return (
        <section className="py-24 bg-white dark:bg-[#0F1117]" id="candidati">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF272]/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1E3B]">
                            Application
                        </span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1A1E3B] dark:text-white">
                            Candidati a Career OS in 2 minuti
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Bastano poche info per capire se il percorso fa per te. Se c’è fit, ti
                            proponiamo la call di audit.
                        </p>
                        <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="text-[#F59E0B]">●</span>
                                4 step essenziali, zero frizioni
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#F59E0B]">●</span>
                                Nessun pitch aggressivo, solo fit reale
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#F59E0B]">●</span>
                                Risposta personale entro 48h
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={openModal}
                            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] px-8 py-4 text-base font-bold text-[#1A1E3B] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            Inizia Application →
                        </button>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-[#151925]">
                        <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white">Cosa ti chiediamo</h3>
                        <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 1</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Chi sei</p>
                                <p className="mt-1 text-xs">Nome, email, background.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 2</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Obiettivo</p>
                                <p className="mt-1 text-xs">Ruolo target e timeline.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 3</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Situazione</p>
                                <p className="mt-1 text-xs">Blocco principale e candidature.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1117]">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 4</p>
                                <p className="mt-1 font-medium text-[#1A1E3B] dark:text-white">Contatto</p>
                                <p className="mt-1 text-xs">LinkedIn e note opzionali.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true" role="dialog">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-[#0F1117]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{currentStepLabel}</p>
                                <h3 className="mt-2 text-xl font-bold text-[#1A1E3B] dark:text-white">Application Career OS</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Completa i 4 step. Ci serve solo il minimo per capire il tuo fit.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
                                aria-label="Chiudi"
                            >
                                <span className="block h-5 w-5">✕</span>
                            </button>
                        </div>

                        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] transition-all"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>

                        {status === 'success' ? (
                            <div className="mt-8 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <span className="text-2xl">✓</span>
                                </div>
                                <h4 className="mt-4 text-lg font-bold text-[#1A1E3B] dark:text-white">Application inviata</h4>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    Ti rispondiamo entro 48 ore con i prossimi step.
                                </p>
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                    {calendlyUrl && (
                                        <a
                                            href={`${calendlyUrl}?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.name)}`}
                                            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                        >
                                            Prenota call adesso
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Chiudi
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-name">
                                                Nome
                                            </label>
                                            <input
                                                id="career-name"
                                                type="text"
                                                value={formData.name}
                                                onChange={event => handleChange('name', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-email">
                                                Email
                                            </label>
                                            <input
                                                id="career-email"
                                                type="email"
                                                value={formData.email}
                                                onChange={event => handleChange('email', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-background">
                                                Background
                                            </label>
                                            <select
                                                id="career-background"
                                                value={formData.background}
                                                onChange={event => handleChange('background', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                                required
                                            >
                                                <option value="">Seleziona</option>
                                                {BACKGROUND_OPTIONS.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-role">
                                                Ruolo target
                                            </label>
                                            <select
                                                id="career-role"
                                                value={formData.roleTarget}
                                                onChange={event => handleChange('roleTarget', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                                required
                                            >
                                                <option value="">Seleziona</option>
                                                {ROLE_TARGET_OPTIONS.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-timeline">
                                                Timeline
                                            </label>
                                            <select
                                                id="career-timeline"
                                                value={formData.timeline}
                                                onChange={event => handleChange('timeline', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                                required
                                            >
                                                <option value="">Seleziona</option>
                                                {TIMELINE_OPTIONS.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-block">
                                                Blocco principale
                                            </label>
                                            <select
                                                id="career-block"
                                                value={formData.mainBlock}
                                                onChange={event => handleChange('mainBlock', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                                required
                                            >
                                                <option value="">Seleziona</option>
                                                {BLOCK_OPTIONS.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-applications">
                                                Candidature ultimo mese
                                            </label>
                                            <select
                                                id="career-applications"
                                                value={formData.applicationsLastMonth}
                                                onChange={event => handleChange('applicationsLastMonth', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                                required
                                            >
                                                <option value="">Seleziona</option>
                                                {APPLICATIONS_OPTIONS.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-linkedin">
                                                LinkedIn URL (opzionale)
                                            </label>
                                            <input
                                                id="career-linkedin"
                                                type="url"
                                                value={formData.linkedinUrl}
                                                onChange={event => handleChange('linkedinUrl', event.target.value)}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-notes">
                                                Note aggiuntive (opzionale)
                                            </label>
                                            <textarea
                                                id="career-notes"
                                                value={formData.notes}
                                                onChange={event => handleChange('notes', event.target.value)}
                                                rows={4}
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={event => handleChange('website', event.target.value)}
                                    className="hidden"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                {status === 'error' && (
                                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                        {message}
                                    </p>
                                )}

                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                                    <div className="flex gap-2">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                            >
                                                Indietro
                                            </button>
                                        )}
                                    </div>
                                    {step < 4 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                        >
                                            Continua
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            {status === 'loading' ? 'Invio...' : 'Invia application'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
