'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  QUESTIONS,
  getQuestionsForSection,
  getLocalizedSections,
} from '../lib/questions'
import { calculateAuditResult, type AuditResult } from '../lib/scoring'
import AuditLoading from './AuditLoading'
import RoleFitAuditResults from './RoleFitAuditResults'
import { roleFitAuditTranslations, type RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'
import {
  trackRoleFitAuditStarted,
  trackRoleFitAuditSectionCompleted,
  trackRoleFitAuditCompleted,
  trackEvent,
} from '@/lib/analytics/trackEvent'

interface FormState {
  answers: Record<string, number>
  email: string
  name: string
  linkedinUrl: string
  website: string
  acceptedPrivacy: boolean
  marketingConsent: boolean
}

export default function RoleFitAuditForm({
  paypalOrderId,
  locale,
}: {
  paypalOrderId?: string
  locale: RoleFitLocale
}) {
  const STORAGE_KEY = `roleFitAudit_progress_${locale}`
  const t = roleFitAuditTranslations[locale]
  const sections = useMemo(() => getLocalizedSections(locale), [locale])

  const [currentSection, setCurrentSection] = useState(1)
  const [formState, setFormState] = useState<FormState>({
    answers: {},
    email: '',
    name: '',
    linkedinUrl: '',
    website: '',
    acceptedPrivacy: false,
    marketingConsent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasTrackedStart = useRef(false)
  const hasLoadedFromStorage = useRef(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasLoadedFromStorage.current) return
    hasLoadedFromStorage.current = true

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (!parsed.answers || Object.keys(parsed.answers).length === 0) return

      setFormState((prev) => ({
        ...prev,
        answers: parsed.answers,
        email: parsed.email || '',
        name: parsed.name || '',
        linkedinUrl: parsed.linkedinUrl || '',
        marketingConsent: Boolean(parsed.marketingConsent),
      }))

      if (parsed.currentSection) {
        setCurrentSection(parsed.currentSection > sections.length ? 1 : parsed.currentSection)
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage:', e)
    }
  }, [STORAGE_KEY, sections.length])

  useEffect(() => {
    if (!hasLoadedFromStorage.current) return

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          answers: formState.answers,
          email: formState.email,
          name: formState.name,
          linkedinUrl: formState.linkedinUrl,
          marketingConsent: formState.marketingConsent,
          currentSection,
        })
      )
    } catch (e) {
      console.warn('Failed to save progress to localStorage:', e)
    }
  }, [STORAGE_KEY, formState, currentSection])

  useEffect(() => {
    if (!hasTrackedStart.current) {
      trackRoleFitAuditStarted()
      hasTrackedStart.current = true
    }
  }, [])

  const currentQuestions = useMemo(() => getQuestionsForSection(currentSection, locale), [currentSection, locale])

  const totalQuestions = QUESTIONS.length
  const answeredQuestions = Object.keys(formState.answers).length
  const progress = Math.round((answeredQuestions / totalQuestions) * 100)

  const isCurrentSectionComplete = currentQuestions.every((q) => formState.answers[q.id] !== undefined)
  const isLastSection = currentSection === sections.length

  const handleAnswerChange = (questionId: string, value: number) => {
    setFormState((prev) => ({ ...prev, answers: { ...prev.answers, [questionId]: value } }))
  }

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handleNext = () => {
    const section = sections.find((s) => s.id === currentSection)
    if (section) {
      trackRoleFitAuditSectionCompleted(currentSection, section.title)
    }
    setCurrentSection((prev) => prev + 1)
    scrollToForm()
  }

  const handleBack = () => {
    if (currentSection <= 1) return
    setCurrentSection((prev) => prev - 1)
    scrollToForm()
  }

  const handleSubmit = async () => {
    if (formState.website) {
      setResult(calculateAuditResult(formState.answers, locale))
      return
    }

    if (!formState.email) {
      setError(t.form.errors.missingEmail)
      return
    }

    if (!formState.acceptedPrivacy) {
      setError(t.form.errors.missingPrivacy)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.email.trim())) {
      setError(t.form.errors.invalidEmail)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/role-fit-audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: formState.answers,
          email: formState.email,
          name: formState.name,
          linkedinUrl: formState.linkedinUrl,
          acceptedPrivacy: formState.acceptedPrivacy,
          marketingConsent: formState.marketingConsent,
          website: formState.website,
          paypalOrderId,
          locale,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || t.form.errors.submitError)
      }

      const auditResult = data.result as AuditResult
      trackRoleFitAuditCompleted(auditResult.archetype.id, auditResult.normalizedScores.readiness)
      trackEvent('generate_lead', {
        category: 'conversion',
        currency: 'EUR',
        value: 0,
        source: 'role_fit_audit',
        label: 'audit_submission',
      })

      setResult(auditResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.form.errors.submitError)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return <AuditLoading locale={locale} />
  }

  if (result) {
    return <RoleFitAuditResults locale={locale} result={result} />
  }

  if (currentSection > sections.length) {
    return (
      <div ref={formRef} className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span>{t.form.completion}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-4xl mb-4 block">📄</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.form.receiveReport}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t.form.receiveReportSubtitle}</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#0F1117] rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{t.form.whatYouGet}</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.form.fullPdfReport}</p>
                <p className="text-xs text-slate-400">{t.form.reportIncludes}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.form.nameLabel}</label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                placeholder={t.form.namePlaceholder}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.form.emailLabel}</label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                placeholder={t.form.emailPlaceholder}
                required
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.form.profileLabel}</label>
              <input
                type="url"
                id="linkedin"
                value={formState.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                placeholder={t.form.profilePlaceholder}
              />
              <p className="text-xs text-slate-500 mt-1">{t.form.profileHelp}</p>
            </div>

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

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={formState.acceptedPrivacy}
                onChange={(e) => handleInputChange('acceptedPrivacy', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]"
              />
              <label htmlFor="privacy" className="text-sm text-slate-600 dark:text-slate-400">
                {t.form.privacyConsent}{' '}
                <Link href="/privacy" className="text-[#F59E0B] hover:underline" target="_blank">Privacy</Link>{' '}
                <Link href="/terms" className="text-[#F59E0B] hover:underline" target="_blank">Terms</Link>.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="marketing"
                checked={formState.marketingConsent}
                onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]"
              />
              <label htmlFor="marketing" className="text-sm text-slate-600 dark:text-slate-400">{t.form.marketingConsent}</label>
            </div>

            <p className="text-xs text-slate-400 text-center">{t.form.microcopy}</p>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handleBack} className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                {t.form.back}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formState.email || !formState.acceptedPrivacy}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.form.preparing : t.form.submit}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const section = sections.find((s) => s.id === currentSection)!

  return (
    <div ref={formRef} className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>
            {t.form.sectionLabel
              .replace('{current}', String(currentSection))
              .replace('{total}', String(sections.length))
              .replace('{title}', section.title)}
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

      <div className="text-center mb-8">
        <span className="text-4xl mb-4 block">{section.icon}</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
      </div>

      <div className="flex gap-4 mb-6 justify-end">
        {currentSection > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {t.form.back}
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!isCurrentSectionComplete}
          className={`px-4 py-2 text-sm rounded-lg font-bold transition ${
            isCurrentSectionComplete
              ? 'bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] hover:shadow-md'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLastSection ? t.form.continue : t.form.next}
        </button>
      </div>

      <div className="space-y-8">
        {currentQuestions.map((question) => (
          <div key={question.id} className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">{question.question}</p>
            {question.helpText && <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{question.helpText}</p>}

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
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#F59E0B] bg-[#FFF272]/20 dark:bg-[#F59E0B]/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1117] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                          isSelected ? 'border-[#F59E0B] bg-[#F59E0B]' : 'border-slate-300 dark:border-slate-600'
                        }`}
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

      <div className="flex gap-4 mt-8">
        {currentSection > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {t.form.back}
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!isCurrentSectionComplete}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition ${
            isCurrentSectionComplete
              ? 'bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] hover:shadow-lg'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLastSection ? t.form.continue : t.form.next}
        </button>
      </div>
    </div>
  )
}
