'use client'

import { FormEvent, useCallback, useMemo, useState, useEffect } from 'react'
import { useCareerOS } from '../../context/CareerOSContext'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const BACKGROUND_OPTIONS = [
    'Software Engineer (Frontend/Backend)',
    'Data Scientist / Analyst',
    'Studente STEM / Neolaureato',
    'Product / Design / No-Code',
    'Career Switcher (Non-tech)',
    'Altro',
]

const ROLE_TARGET_OPTIONS = [
    'GenAI/AI Engineer (RAG/Agents)',
    'ML Ops / Data Engineer',
    'Product Manager AI',
    'Founder / CTO',
    'Non so ancora',
]

const TIMELINE_OPTIONS = [
    'Sto cercando ora',
    'Nei prossimi 3 mesi',
    'Più avanti',
]

const BLOCK_OPTIONS = [
    'Manca esperienza pratica (Portfolio)',
    'Voglio ottimizzare le mie candidature',
    'Non passo lo screening CV',
    'Blocco ai colloqui tecnici',
    'Non so cosa studiare (Roadmap)',
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
    phone: string // added
    acceptedPrivacy: boolean // added
    website: string // honeypot
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
    phone: '',
    acceptedPrivacy: false,
    website: '',
}

import { trackFormStart, trackFormStepComplete, trackFormSubmit, trackFormAbandon } from '@/lib/analytics/trackEvent'

export default function ApplicationModal() {
    const { isAppModalOpen, closeAppModal, appModalData } = useCareerOS()
    const [step, setStep] = useState(1)
    const [status, setStatus] = useState<FormStatus>('idle')
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
    const [lastStep, setLastStep] = useState(1)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const calendlyUrl = process.env.NEXT_PUBLIC_CAREER_OS_CALENDLY_URL || ''
    const source = 'modal/career-os'

    // Reset form when modal opens
    useEffect(() => {
        if (isAppModalOpen) {
            // Check if we need to load from local storage again or just keep current if valid?
            // Actually, keep current formData from state (or localStorage loaded on mount), but reset status
            setStatus('idle')
            setMessage('')
            setHasSubmitted(false)
            if (step === 4 && hasSubmitted) {
                setStep(1)
            }
            trackFormStart('career_os_app', source)
        }
    }, [isAppModalOpen])

    const handleClose = useCallback(() => {
        closeAppModal()
        if (!hasSubmitted) {
            trackFormAbandon('career_os_app', lastStep)
        }
    }, [closeAppModal, hasSubmitted, lastStep])

    const handleChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value }
            localStorage.setItem('careeros_app_form', JSON.stringify(next))
            return next
        })
    }

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('careeros_app_form')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setFormData(prev => ({ ...prev, ...parsed }))
            } catch (e) {
                // ignore invalid json
            }
        }
    }, [])


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
        if (currentStep === 4) {
            if (!formData.acceptedPrivacy) return 'Devi accettare la privacy policy per procedere.'
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
        trackFormStepComplete('career_os_app', step, 4)
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

        // If not last step, treat Enter as Next
        if (step < 4) {
            handleNext()
            return
        }

        const error = validateStep(step)
        if (error) {
            setStatus('error')
            setMessage(error)
            return
        }

        if (step === 4) {
            trackFormStepComplete('career_os_app', 4, 4)
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
                    source: appModalData?.source || source,
                    pricingTier: appModalData?.tier || null,
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
            trackFormSubmit('career_os_app')
        } catch (err) {
            setStatus('error')
            setMessage(err instanceof Error ? err.message : 'Errore nell’invio. Riprova.')
        }
    }

    if (!isAppModalOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleClose} />
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
                        onClick={handleClose}
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
                                onClick={handleClose}
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
                                        Nome e Cognome
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
                                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="career-phone">
                                        Telefono (Opzionale)
                                    </label>
                                    <input
                                        id="career-phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={event => handleChange('phone', event.target.value)}
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
                                <div className="flex items-start gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        required
                                        id="privacy-app"
                                        className="mt-1"
                                        checked={formData.acceptedPrivacy}
                                        onChange={e => setFormData(prev => ({ ...prev, acceptedPrivacy: e.target.checked }))}
                                    />
                                    <label htmlFor="privacy-app" className="text-xs text-slate-500 dark:text-slate-400">
                                        Accetto il trattamento dei dati personali come descritto nella <a href="/privacy" className="underline hover:text-amber-500" target="_blank">Privacy Policy</a> e nei <a href="/terms" className="underline hover:text-amber-500" target="_blank">Termini</a>
                                    </label>
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
                                    onClick={(e) => { e.preventDefault(); handleNext() }}
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
    )
}
