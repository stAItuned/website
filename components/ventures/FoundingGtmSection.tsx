'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { LearnLocale } from '@/lib/i18n'
import type { VenturesCopy } from './venturesContent'

interface FoundingGtmSectionProps {
  bridge: VenturesCopy['bridge']
  role: VenturesCopy['role']
  locale: LearnLocale
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

type GtmFormData = {
  name: string
  email: string
  profileUrl: string
  experience: string
  acceptedPrivacy: boolean
  website: string
}

const INITIAL_FORM_DATA: GtmFormData = {
  name: '',
  email: '',
  profileUrl: '',
  experience: '',
  acceptedPrivacy: false,
  website: '',
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base"
        >
          <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function FoundingGtmSection({ bridge, role, locale }: FoundingGtmSectionProps) {
  const formCopy = role.form
  const [isMounted, setIsMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<GtmFormData>(INITIAL_FORM_DATA)

  const handleChange = (field: keyof GtmFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    if (!formData.name.trim()) return formCopy.errors.nameRequired
    if (!formData.email.trim()) return formCopy.errors.emailRequired

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) return formCopy.errors.invalidEmail
    if (!formData.experience.trim()) return formCopy.errors.experienceRequired
    if (!formData.acceptedPrivacy) return formCopy.errors.privacyRequired

    return ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      const response = await fetch('/api/ventures/gtm-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'ventures_founding_gtm',
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          locale,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: formCopy.errors.submitFailed }))
        throw new Error(typeof payload?.error === 'string' ? payload.error : formCopy.errors.submitFailed)
      }

      setFormData(INITIAL_FORM_DATA)
      setStatus('success')
    } catch {
      setStatus('error')
      setMessage(formCopy.errors.submitFailed)
    }
  }

  const openModal = () => {
    setStatus('idle')
    setMessage('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setStatus('idle')
    setMessage('')
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isModalOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const formContent =
    status === 'success' ? (
      <div className="py-2 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          ✓
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{formCopy.successTitle}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
          {formCopy.successBody}
        </p>
        <button
          type="button"
          onClick={closeModal}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {formCopy.close}
        </button>
      </div>
    ) : (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {formCopy.name}
            <input
              autoFocus
              autoComplete="name"
              value={formData.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {formCopy.email}
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {formCopy.profile}
          <input
            type="url"
            inputMode="url"
            value={formData.profileUrl}
            placeholder={formCopy.profilePlaceholder}
            onChange={(event) => handleChange('profileUrl', event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {formCopy.experience}
          <textarea
            rows={3}
            value={formData.experience}
            placeholder={formCopy.experiencePlaceholder}
            onChange={(event) => handleChange('experience', event.target.value)}
            className="resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
          value={formData.website}
          onChange={(event) => handleChange('website', event.target.value)}
        />

        <label className="flex items-start gap-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={formData.acceptedPrivacy}
            onChange={(event) => handleChange('acceptedPrivacy', event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
          />
          <span>
            {formCopy.privacyPrefix}{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="font-semibold underline underline-offset-2 hover:text-primary-600 dark:hover:text-amber-300"
            >
              {formCopy.privacyPolicy}
            </Link>
            .
          </span>
        </label>

        {status === 'error' && message ? (
          <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-300">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:from-amber-300 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? formCopy.sending : formCopy.submit}
        </button>
      </form>
    )

  return (
    <section
      id="founding-gtm"
      className="border-t border-slate-200 bg-white px-4 py-14 dark:border-slate-800 dark:bg-slate-950 md:px-6 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/20 bg-primary-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden />
            {bridge.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {bridge.title}
          </h2>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-300">
              {bridge.existingTitle}
            </p>
            <CheckList items={bridge.existingItems} />
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {bridge.missingTitle}
            </p>
            <CheckList items={bridge.missingItems} />
          </article>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 text-white shadow-lg sm:px-8 md:py-9">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {role.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">{role.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              {role.intro}
            </p>
            <p className="mt-3 text-xs font-semibold text-amber-300">
              {role.setup}
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {role.fitItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium leading-5 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-7 text-center">
            <button type="button" onClick={openModal} className="btn-brand-primary">
              <span>{role.cta}</span>
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>

      {isMounted && isModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-[140] flex items-center justify-center px-4" aria-modal="true" role="dialog" aria-labelledby="gtm-form-title">
              <button
                type="button"
                className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-sm"
                onClick={closeModal}
                aria-label={formCopy.close}
              />
              <div className="relative z-10 flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-[#0F1117]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                      {role.eyebrow}
                    </p>
                    <h3 id="gtm-form-title" className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                      {formCopy.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {formCopy.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label={formCopy.close}
                  >
                    <span aria-hidden className="block h-5 w-5">✕</span>
                  </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-6">{formContent}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
