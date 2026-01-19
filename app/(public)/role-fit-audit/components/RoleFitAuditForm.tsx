'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { QUESTIONS, SECTIONS, getQuestionsForSection } from '../lib/questions'
import { calculateAuditResult, type AuditResult } from '../lib/scoring'
import AuditLoading from './AuditLoading'

// ... (existing imports)

import RoleFitAuditResults from './RoleFitAuditResults'
import {
    trackRoleFitAuditStarted,
    trackRoleFitAuditSectionCompleted,
    trackRoleFitAuditCompleted,
    trackEvent,
} from '@/lib/analytics/trackEvent'

// =============================================================================
// Types
// =============================================================================

interface FormState {
    answers: Record<string, number>
    email: string
    name: string
    linkedinUrl: string
    website: string // honeypot
    acceptedPrivacy: boolean
    marketingConsent: boolean
}

// =============================================================================
// Component
// =============================================================================

export default function RoleFitAuditForm({ paypalOrderId }: { paypalOrderId?: string }) {
    // ---------------------------------------------------------------------------
    // LocalStorage Key
    // ---------------------------------------------------------------------------
    const STORAGE_KEY = 'roleFitAudit_progress'

    // ---------------------------------------------------------------------------
    // State
    // ---------------------------------------------------------------------------
    const [currentSection, setCurrentSection] = useState(1)
    const [formState, setFormState] = useState<FormState>({
        answers: {},
        email: '',
        name: '',
        linkedinUrl: '',
        website: '', // honeypot
        acceptedPrivacy: false,
        marketingConsent: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<AuditResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const hasTrackedStart = useRef(false)
    const hasLoadedFromStorage = useRef(false)
    const formRef = useRef<HTMLDivElement>(null)

    // ---------------------------------------------------------------------------
    // Load from LocalStorage on mount
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (hasLoadedFromStorage.current) return
        hasLoadedFromStorage.current = true

        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed.answers && Object.keys(parsed.answers).length > 0) {
                    setFormState(prev => ({
                        ...prev,
                        answers: parsed.answers,
                        email: parsed.email || '',
                        name: parsed.name || '',
                        linkedinUrl: parsed.linkedinUrl || '',
                        marketingConsent: Boolean(parsed.marketingConsent),
                    }))
                    if (parsed.currentSection) {
                        // If user was at the end (contact form), reset to start to allow review
                        if (parsed.currentSection > SECTIONS.length) {
                            setCurrentSection(1)
                        } else {
                            setCurrentSection(parsed.currentSection)
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to load progress from localStorage:', e)
        }
    }, [])

    // ---------------------------------------------------------------------------
    // Save to LocalStorage on change
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!hasLoadedFromStorage.current) return // Don't save before loading

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                answers: formState.answers,
                email: formState.email,
                name: formState.name,
                linkedinUrl: formState.linkedinUrl,
                marketingConsent: formState.marketingConsent,
                currentSection,
            }))
        } catch (e) {
            console.warn('Failed to save progress to localStorage:', e)
        }
    }, [formState.answers, formState.email, formState.name, formState.linkedinUrl, formState.marketingConsent, currentSection])

    // ---------------------------------------------------------------------------
    // Track form start on mount
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!hasTrackedStart.current) {
            trackRoleFitAuditStarted()
            hasTrackedStart.current = true
        }
    }, [])

    // ---------------------------------------------------------------------------
    // Computed
    // ---------------------------------------------------------------------------
    const currentQuestions = useMemo(
        () => getQuestionsForSection(currentSection),
        [currentSection]
    )

    const totalQuestions = QUESTIONS.length
    const answeredQuestions = Object.keys(formState.answers).length
    const progress = Math.round((answeredQuestions / totalQuestions) * 100)

    const isCurrentSectionComplete = currentQuestions.every(
        (q) => formState.answers[q.id] !== undefined
    )

    const isLastSection = currentSection === SECTIONS.length

    // Check if all questions are answered (for the contact section)
    const allQuestionsAnswered = answeredQuestions === totalQuestions

    // ---------------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------------
    const handleAnswerChange = (questionId: string, value: number) => {
        setFormState((prev) => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: value },
        }))
    }

    const handleInputChange = (field: keyof FormState, value: string | boolean) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
    }

    // Scroll to form top helper
    const scrollToForm = () => {
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
    }

    const handleNext = () => {
        // Track section completed
        const section = SECTIONS.find((s) => s.id === currentSection)
        if (section) {
            trackRoleFitAuditSectionCompleted(currentSection, section.title)
        }
        // Always advance, even beyond SECTIONS.length (to show contact form)
        setCurrentSection((prev) => prev + 1)
        scrollToForm()
    }

    const handleBack = () => {
        if (currentSection > 1) {
            setCurrentSection((prev) => prev - 1)
            scrollToForm()
        }
    }

    const handleSubmit = async () => {
        // Honeypot check
        if (formState.website) {
            // Bot detected, silently "succeed" with static calculation
            setResult(calculateAuditResult(formState.answers))
            return
        }

        // Validation
        if (!formState.email) {
            setError('Inserisci la tua email per ricevere il report.')
            return
        }
        if (!formState.acceptedPrivacy) {
            setError('Per procedere, accetta privacy/termini e l\'invio del report via email.')
            return
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formState.email.trim())) {
            setError('L\'email inserita non sembra valida. Controlla e riprova.')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            // Submit to API - server generates the AI result
            const response = await fetch('/api/role-fit-audit/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: formState.answers,
                    email: formState.email,
                    name: formState.name,
                    linkedinUrl: formState.linkedinUrl,
                    marketingConsent: formState.marketingConsent,
                    website: formState.website, // honeypot
                    paypalOrderId,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Errore durante l\'invio')
            }

            // Use server-generated result (AI or static fallback)
            const auditResult = data.result

            // Track completion
            trackRoleFitAuditCompleted(
                auditResult.archetype.id,
                auditResult.normalizedScores.readiness
            )

            // Track standard Lead generation
            trackEvent('generate_lead', {
                category: 'conversion',
                currency: 'EUR',
                value: 0,
                source: 'role_fit_audit',
                label: 'audit_submission'
            })

            // Do NOT clear saved progress so user can retry with same answers
            // localStorage.removeItem(STORAGE_KEY)

            setResult(auditResult)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante l\'invio')
        } finally {
            setIsSubmitting(false)
        }
    }

    // ---------------------------------------------------------------------------
    // Render: Loading State
    // ---------------------------------------------------------------------------
    if (isSubmitting) {
        return <AuditLoading />
    }

    // ---------------------------------------------------------------------------
    // Render: Results
    // ---------------------------------------------------------------------------
    if (result) {
        return <RoleFitAuditResults result={result} />
    }

    // ---------------------------------------------------------------------------
    // Render: Contact Form (after all questions)
    // ---------------------------------------------------------------------------
    if (currentSection > SECTIONS.length) {
        return (
            <div ref={formRef} className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                        <span>Completamento</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="text-center mb-6">
                        <span className="text-4xl mb-4 block">📄</span>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Ricevi il report via email
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Ti invio tutto via email così non lo perdi.
                        </p>
                    </div>

                    {/* What you get */}
                    <div className="bg-slate-50 dark:bg-[#0F1117] rounded-xl p-4 mb-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Cosa ricevi</p>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📄</span>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Report PDF completo</p>
                                <p className="text-xs text-slate-400">Score · Archetipo · Gap analysis · Piano 7 giorni</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                            >
                                Nome (opzionale)
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formState.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition"
                                placeholder="Il tuo nome"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                            >
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formState.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        {/* LinkedIn (optional) */}
                        <div>
                            <label
                                htmlFor="linkedin"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                            >
                                LinkedIn o GitHub (opzionale)
                            </label>
                            <input
                                type="url"
                                id="linkedin"
                                value={formState.linkedinUrl}
                                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition"
                                placeholder="https://linkedin.com/in/..."
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Opzionale: per una review più precisa del tuo profilo.
                            </p>
                        </div>

                        {/* Honeypot - hidden from users */}
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                name="website"
                                id="website"
                                tabIndex={-1}
                                autoComplete="off"
                                value={formState.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                            />
                        </div>

                        {/* Privacy Consent */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="privacy"
                                checked={formState.acceptedPrivacy}
                                onChange={(e) => handleInputChange('acceptedPrivacy', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]"
                            />
                            <label htmlFor="privacy" className="text-sm text-slate-600 dark:text-slate-400">
                                Acconsento al trattamento dei dati per ricevere il report via email. Leggi{' '}
                                <Link href="/privacy" className="text-[#F59E0B] hover:underline" target="_blank">
                                    Privacy
                                </Link>{' '}
                                e{' '}
                                <Link href="/terms" className="text-[#F59E0B] hover:underline" target="_blank">
                                    Terms
                                </Link>
                                .
                            </label>
                        </div>

                        {/* Optional marketing consent */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="marketing"
                                checked={formState.marketingConsent}
                                onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]"
                            />
                            <label htmlFor="marketing" className="text-sm text-slate-600 dark:text-slate-400">
                                Voglio ricevere aggiornamenti e offerte su Career OS via email (facoltativo).
                            </label>
                        </div>

                        {/* Microcopy */}
                        <p className="text-xs text-slate-400 text-center">
                            Niente spam. 1 email con il tuo report PDF (e solo se vuoi, aggiornamenti occasionali).
                        </p>

                        {/* Error */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                ← Indietro
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formState.email || !formState.acceptedPrivacy}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sto preparando il report...' : 'Invia report →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ---------------------------------------------------------------------------
    // Render: Questions
    // ---------------------------------------------------------------------------
    const section = SECTIONS.find((s) => s.id === currentSection)!

    return (
        <div ref={formRef} className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <span>
                        Sezione {currentSection}/{SECTIONS.length}: {section.title}
                    </span>
                    <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">{section.icon}</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
            </div>

            {/* Top Navigation */}
            <div className="flex gap-4 mb-6 justify-end">
                {currentSection > 1 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                        ← Indietro
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isCurrentSectionComplete}
                    className={`
            px-4 py-2 text-sm rounded-lg font-bold transition
            ${isCurrentSectionComplete
                            ? 'bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] hover:shadow-md'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        }
          `}
                >
                    {isLastSection ? 'Continua →' : 'Avanti →'}
                </button>
            </div>

            {/* Questions */}
            <div className="space-y-8">
                {currentQuestions.map((question, qIndex) => (
                    <div
                        key={question.id}
                        className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
                    >
                        <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            {question.question}
                        </p>
                        {question.helpText && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                {question.helpText}
                            </p>
                        )}

                        <div className="space-y-3 mt-4" role="radiogroup" aria-label={question.question}>
                            {question.options.map((option) => {
                                const isSelected = formState.answers[question.id] === option.value
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => handleAnswerChange(question.id, option.value)}
                                        className={`
                      w-full text-left px-4 py-3 rounded-xl border transition-all duration-200
                      ${isSelected
                                                ? 'border-[#F59E0B] bg-[#FFF272]/20 dark:bg-[#F59E0B]/10 text-slate-900 dark:text-white'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`
                          w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition
                          ${isSelected
                                                        ? 'border-[#F59E0B] bg-[#F59E0B]'
                                                        : 'border-slate-300 dark:border-slate-600'
                                                    }
                        `}
                                            >
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                                        <path d="M10.28 2.28L4.25 8.31 1.72 5.78a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l6.75-6.75a.75.75 0 00-1.06-1.06z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm">{option.label}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
                {currentSection > 1 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                        ← Indietro
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isCurrentSectionComplete}
                    className={`
            flex-1 px-6 py-3 rounded-xl font-bold transition
            ${isCurrentSectionComplete
                            ? 'bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] hover:shadow-lg'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        }
          `}
                >
                    {isLastSection ? 'Continua →' : 'Avanti →'}
                </button>
            </div>
        </div>
    )
}
