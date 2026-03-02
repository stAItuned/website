'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { AiEuActTranslations } from '@/lib/i18n/ai-eu-act-translations'

interface AiEuActLeadFormProps {
  t: AiEuActTranslations['form']
  locale: 'it' | 'en'
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function AiEuActLeadForm({ t, locale }: AiEuActLeadFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [role, setRole] = useState(t.fields.roleOptions[0] ?? 'CEO')
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const [dataProcessingAccepted, setDataProcessingAccepted] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!privacyPolicyAccepted || !dataProcessingAccepted) {
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/leads/ai-act', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') ?? ''),
          email: String(formData.get('email') ?? ''),
          company: String(formData.get('company') ?? ''),
          role,
          source: 'landing',
          privacyPolicyAccepted,
          dataProcessingAccepted,
          marketingConsent,
          locale,
          website: '',
        }),
      })

      const data = (await response.json().catch(() => ({}))) as { redirectUrl?: string; error?: string }

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error ?? t.error)
        return
      }

      setStatus('success')
      setMessage(t.success)
      form.reset()
      setRole(t.fields.roleOptions[0] ?? 'CEO')
      setPrivacyPolicyAccepted(false)
      setDataProcessingAccepted(false)
      setMarketingConsent(false)

      window.setTimeout(() => {
        const destination = typeof data.redirectUrl === 'string' ? data.redirectUrl : '/ai-eu-act/risorse'
        window.location.assign(destination)
      }, 500)
    } catch {
      setStatus('error')
      setMessage(t.error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/15 border-l-4 border-l-amber-500 bg-slate-900/70 p-5 shadow-2xl backdrop-blur md:p-6"
    >
      <div>
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
        <p className="mt-1 text-sm text-slate-300">{t.subtitle}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-200">
          {t.fields.name}
          <input
            required
            name="name"
            type="text"
            className="mt-1 w-full rounded-lg border-white/15 bg-slate-800/90 text-sm text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500"
          />
        </label>
        <label className="text-sm font-medium text-slate-200">
          {t.fields.email}
          <input
            required
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border-white/15 bg-slate-800/90 text-sm text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-200">
          {t.fields.company}
          <input
            name="company"
            type="text"
            className="mt-1 w-full rounded-lg border-white/15 bg-slate-800/90 text-sm text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500"
          />
        </label>
        <label className="text-sm font-medium text-slate-200">
          {t.fields.role}
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-1 w-full rounded-lg border-white/15 bg-slate-800/90 text-sm text-white focus:border-amber-500 focus:ring-amber-500"
          >
            {t.fields.roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-2 rounded-xl border border-white/10 bg-slate-800/60 p-3">
        <label className="flex items-start gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={privacyPolicyAccepted}
            onChange={(event) => setPrivacyPolicyAccepted(event.target.checked)}
            className="mt-0.5 rounded border-white/20 bg-slate-900 text-amber-500 focus:ring-amber-500"
            required
          />
          <span>
            {t.consent.privacyPolicyPrefix}{' '}
            <Link href="/privacy" className="font-semibold text-amber-500 underline">
              {t.consent.privacyPolicyLabel}
            </Link>
            .
          </span>
        </label>

        <label className="flex items-start gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={dataProcessingAccepted}
            onChange={(event) => setDataProcessingAccepted(event.target.checked)}
            className="mt-0.5 rounded border-white/20 bg-slate-900 text-amber-500 focus:ring-amber-500"
            required
          />
          <span>{t.consent.dataProcessing}</span>
        </label>

        <label className="flex items-start gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(event) => setMarketingConsent(event.target.checked)}
            className="mt-0.5 rounded border-white/20 bg-slate-900 text-amber-500 focus:ring-amber-500"
          />
          <span>{t.consent.marketing}</span>
        </label>
      </div>

      <p className="text-xs text-slate-400">{t.consent.helper}</p>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:from-amber-400 hover:via-amber-300 hover:to-amber-400 hover:shadow-amber-500/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'loading' ? t.loading : t.submit}
      </button>

      {status !== 'idle' ? (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
      ) : null}

    </form>
  )
}
