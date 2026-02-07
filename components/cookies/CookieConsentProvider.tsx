'use client'

import Link from 'next/link'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLearnLocale } from '@/lib/i18n'

type ConsentStatus = 'unknown' | 'accepted' | 'rejected'

type CookieConsentContextValue = {
  status: ConsentStatus
  hasConsentedToAnalytics: boolean
  accept: () => void
  reject: () => void
  openPreferences: () => void
}

const STORAGE_KEY = 'staituned_cookie_consent'

const defaultContext: CookieConsentContextValue = {
  status: 'unknown',
  hasConsentedToAnalytics: false,
  accept: () => { },
  reject: () => { },
  openPreferences: () => { },
}

const CookieConsentContext = createContext<CookieConsentContextValue>(defaultContext)

/** Provides cookie consent state and actions across the app. */
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>('unknown')
  const [isReady, setIsReady] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const { locale } = useLearnLocale()
  const language = (locale === 'en' ? 'en' : 'it') as 'it' | 'en'
  const t = useMemo(() => {
    return language === 'it'
      ? {
          banner: {
            body:
              "Per offrire un'esperienza più limpida e sicura tratteniamo solo cookie tecnici finché non ci dai il via libera. Puoi accettare subito i cookie analitici oppure personalizzare la scelta.",
            policy: 'Cookie Policy',
            detailsSuffix: 'per i dettagli.',
            customize: 'Personalizza',
            accept: 'Accetta',
          },
          modal: {
            eyebrow: 'Impostazioni cookie',
            title: 'Scegli i cookie analitici',
            close: 'Chiudi',
            closeAria: 'Chiudi impostazioni cookie',
            intro:
              'Usiamo cookie tecnici per far funzionare il sito. I cookie analitici (Google Analytics) ci aiutano a migliorare i contenuti e vengono attivati solo con il tuo consenso.',
            statusAccepted: 'Hai già accettato i cookie analitici.',
            statusRejected: 'Hai già rifiutato i cookie analitici.',
            statusUnknown: 'Scegli se attivare i cookie analitici.',
            recommended: 'Consigliato',
            recommendedBody:
              "Accetta per attivare i cookie analitici e aiutarci a migliorare l'esperienza.",
            accept: 'Accetta',
            reject: 'Rifiuta',
            policy: 'Cookie Policy',
          },
        }
      : {
          banner: {
            body:
              'To provide a clearer and safer experience, we only keep essential cookies until you give us the green light. You can accept analytics cookies now or customize your choice.',
            policy: 'Cookie Policy',
            detailsSuffix: 'for details.',
            customize: 'Customize',
            accept: 'Accept',
          },
          modal: {
            eyebrow: 'Cookie settings',
            title: 'Choose analytics cookies',
            close: 'Close',
            closeAria: 'Close cookie settings',
            intro:
              'We use essential cookies to keep the site running. Analytics cookies (Google Analytics) help us improve content and are enabled only with your consent.',
            statusAccepted: 'You have already accepted analytics cookies.',
            statusRejected: 'You have already rejected analytics cookies.',
            statusUnknown: 'Choose whether to enable analytics cookies.',
            recommended: 'Recommended',
            recommendedBody:
              'Accept to enable analytics cookies and help us improve the experience.',
            accept: 'Accept',
            reject: 'Reject',
            policy: 'Cookie Policy',
          },
        }
  }, [language])

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsReady(true)
      return
    }

    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue === 'accepted' || storedValue === 'rejected') {
      setStatus(storedValue)
    }
    setIsReady(true)
  }, [])

  const persistStatus = (value: ConsentStatus) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
    setStatus(value)
    setIsReady(true)
  }

  const accept = () => persistStatus('accepted')
  const reject = () => persistStatus('rejected')
  const openPreferences = () => {
    setIsPreferencesOpen(true)
  }
  const closePreferences = () => setIsPreferencesOpen(false)
  const handleAccept = () => {
    accept()
    closePreferences()
  }
  const handleReject = () => {
    reject()
    closePreferences()
  }

  return (
    <CookieConsentContext.Provider
      value={{
        status,
        hasConsentedToAnalytics: status === 'accepted',
        accept,
        reject,
        openPreferences,
      }}
    >
      {children}
      {isReady && status === 'unknown' && !isPreferencesOpen && (
        <CookieConsentBanner
          onAccept={handleAccept}
          onOpenPreferences={openPreferences}
          localeText={t.banner}
        />
      )}
      <CookiePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={closePreferences}
        onAccept={handleAccept}
        onReject={handleReject}
        status={status}
        localeText={t.modal}
      />
    </CookieConsentContext.Provider>
  )
}

/** Access cookie consent state and actions. */
export function useCookieConsent() {
  return useContext(CookieConsentContext)
}

function CookieConsentBanner({
  onAccept,
  onOpenPreferences,
  localeText,
}: {
  onAccept: () => void
  onOpenPreferences: () => void
  localeText: {
    body: string
    policy: string
    detailsSuffix: string
    customize: string
    accept: string
  }
}) {
  return (
    <div className="pointer-events-auto fixed inset-x-2 sm:inset-x-4 bottom-4 sm:bottom-6 z-[1100] rounded-2xl border border-slate-800/40 bg-slate-900/90 p-4 sm:p-5 text-sm text-slate-100 shadow-2xl shadow-slate-900/60 backdrop-blur-lg sm:left-1/2 sm:max-w-3xl sm:-translate-x-1/2">
      <div className="space-y-3">
        <p className="text-xs sm:text-sm leading-relaxed">
          {localeText.body}{' '}
          <Link href="/cookie-policy" className="font-semibold text-amber-400 underline">
            {localeText.policy}
          </Link>{' '}
          {localeText.detailsSuffix}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenPreferences}
            className="rounded-full border border-slate-400/30 px-4 py-2.5 sm:py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:border-slate-100 min-h-[44px] sm:min-h-0"
          >
            {localeText.customize}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-full bg-amber-400 px-4 py-2.5 sm:py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-500/50 transition hover:bg-amber-300 min-h-[44px] sm:min-h-0"
          >
            {localeText.accept}
          </button>
        </div>
      </div>
    </div>
  )
}

function CookiePreferencesModal({
  isOpen,
  onClose,
  onAccept,
  onReject,
  status,
  localeText,
}: {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onReject: () => void
  status: ConsentStatus
  localeText: {
    eyebrow: string
    title: string
    close: string
    closeAria: string
    intro: string
    statusAccepted: string
    statusRejected: string
    statusUnknown: string
    recommended: string
    recommendedBody: string
    accept: string
    reject: string
    policy: string
  }
}) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const statusLabel =
    status === 'accepted'
      ? localeText.statusAccepted
      : status === 'rejected'
        ? localeText.statusRejected
        : localeText.statusUnknown

  return (
    <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-3 py-6">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-950/90 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-slate-700/40 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{localeText.eyebrow}</p>
            <h3 className="text-lg font-semibold text-white">{localeText.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-600/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-300"
            aria-label={localeText.closeAria}
          >
            {localeText.close}
          </button>
        </div>
        <div className="space-y-4 px-5 py-5 text-sm text-slate-200">
          <p className="leading-relaxed">{localeText.intro}</p>
          <p className="text-sm font-medium text-slate-300">{statusLabel}</p>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">{localeText.recommended}</p>
            <p className="mt-1 text-sm text-amber-50">{localeText.recommendedBody}</p>
            <button
              type="button"
              onClick={onAccept}
              className="mt-3 w-full rounded-full bg-amber-400 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-500/40 transition hover:bg-amber-300"
            >
              {localeText.accept}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={onReject}
              className="w-full rounded-full border border-slate-500/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:border-slate-200"
            >
              {localeText.reject}
            </button>
            <Link
              href="/cookie-policy"
              className="w-full rounded-full border border-slate-500/20 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-200"
            >
              {localeText.policy}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
