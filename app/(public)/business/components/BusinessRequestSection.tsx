'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight } from 'lucide-react'
import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

type BusinessRequestFormData = {
  name: string
  email: string
  company: string
  role: string
  processName: string
  mainPain: string
  notes: string
  acceptedPrivacy: boolean
  website: string
}

const INITIAL_FORM_DATA: BusinessRequestFormData = {
  name: '',
  email: '',
  company: '',
  role: '',
  processName: '',
  mainPain: '',
  notes: '',
  acceptedPrivacy: false,
  website: '',
}

export function BusinessRequestSection({
  t,
  locale,
}: {
  t: BusinessTranslations
  locale: BusinessLocale
}) {
  const formT = t.requestSection
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<BusinessRequestFormData>(INITIAL_FORM_DATA)
  const [isMounted, setIsMounted] = useState(false)

  const handleChange = (field: keyof BusinessRequestFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    if (!formData.name.trim()) return formT.errors.nameRequired
    if (!formData.email.trim()) return formT.errors.emailRequired
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) return formT.errors.invalidEmail
    if (!formData.company.trim()) return formT.errors.companyRequired
    if (!formData.processName.trim()) return formT.errors.processNameRequired
    if (!formData.mainPain.trim()) return formT.errors.mainPainRequired
    if (!formData.acceptedPrivacy) return formT.errors.privacyRequired
    return ''
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const error = validate()

    if (error) {
      setStatus('error')
      setMessage(error)
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/business/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'business_page_form',
          page: window.location.pathname,
          locale,
          userAgent: navigator.userAgent,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: formT.errors.submitFailed }))
        throw new Error(typeof payload?.error === 'string' ? payload.error : formT.errors.submitFailed)
      }

      setStatus('success')
      setFormData(INITIAL_FORM_DATA)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : formT.errors.submitFailed)
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    if (status !== 'success') {
      setStatus('idle')
      setMessage('')
    }
  }

  useEffect(() => {
    setIsMounted(true)
    const handler = () => setIsModalOpen(true)
    window.addEventListener('open-business-request-modal', handler)
    return () => window.removeEventListener('open-business-request-modal', handler)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const originalOverflow = document.body.style.overflow

    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isModalOpen, isMounted])

  const formContent =
    status === 'success' ? (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formT.successTitle}</h3>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{formT.successSubtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setStatus('idle')
              setMessage('')
            }}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {formT.resetCta}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            OK
          </button>
        </div>
      </div>
    ) : (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {formT.fields.name}
            <input
              value={formData.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {formT.fields.email}
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {formT.fields.company}
            <input
              value={formData.company}
              onChange={(event) => handleChange('company', event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {formT.fields.role}
            <input
              value={formData.role}
              placeholder={formT.placeholders.role}
              onChange={(event) => handleChange('role', event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {formT.fields.processName}
          <input
            value={formData.processName}
            placeholder={formT.placeholders.processName}
            onChange={(event) => handleChange('processName', event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {formT.fields.mainPain}
          <textarea
            value={formData.mainPain}
            placeholder={formT.placeholders.mainPain}
            onChange={(event) => handleChange('mainPain', event.target.value)}
            className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {formT.fields.notes}
          <textarea
            value={formData.notes}
            placeholder={formT.placeholders.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <input
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={formData.website}
          onChange={(event) => handleChange('website', event.target.value)}
        />

        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={formData.acceptedPrivacy}
            onChange={(event) => handleChange('acceptedPrivacy', event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
          />
          <span>
            {formT.fields.privacyLabelPrefix}{' '}
            <Link href="/privacy" className="font-semibold underline hover:text-primary-600 dark:hover:text-amber-300" target="_blank">
              {formT.fields.privacyPolicy}
            </Link>
            .
          </span>
        </label>

        {status === 'error' && message ? (
          <p className="text-sm font-medium text-rose-600 dark:text-rose-300">{message}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {status === 'loading' ? '...' : formT.fields.submit}
        </button>
      </form>
    )

  return (
    <section id="business-request" className="bg-slate-50/85 py-16 dark:bg-[#151925] lg:py-18">
      <div className="mx-auto max-w-4xl px-4 xs:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-8">
          <div className="space-y-3">
            <BusinessSectionEyebrow>{formT.eyebrow}</BusinessSectionEyebrow>
            <h2 className="max-w-3xl text-2xl font-black tracking-tight text-slate-900 dark:text-white xs:text-3xl">
              {formT.title}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{formT.description}</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {formT.bullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200"
              >
                {bullet}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,247,168,0.22)_100%)] p-5 dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(26,30,59,1)_0%,rgba(15,17,23,1)_100%)] sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{formT.formTitle}</h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{formT.formDescription}</p>
            </div>
            <button
              type="button"
              onClick={openModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {formT.formTitle}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {isMounted && isModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-[140] flex items-center justify-center px-4" aria-modal="true" role="dialog">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeModal} />
              <div className="relative z-10 flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-[#0F1117]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{formT.eyebrow}</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{formT.formTitle}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formT.formDescription}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
                    aria-label="Close"
                  >
                    <span className="block h-5 w-5">✕</span>
                  </button>
                </div>

                <div className="overflow-y-auto px-5 py-4 sm:px-6">{formContent}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
