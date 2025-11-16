'use client'

import Link from 'next/link'
import { createContext, useContext, useEffect, useState } from 'react'

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
  accept: () => {},
  reject: () => {},
  openPreferences: () => {},
}

const CookieConsentContext = createContext<CookieConsentContextValue>(defaultContext)

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>('unknown')
  const [isReady, setIsReady] = useState(false)

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
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(STORAGE_KEY)
    setStatus('unknown')
    setIsReady(true)
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
      {isReady && status === 'unknown' && (
        <CookieConsentBanner onAccept={accept} onReject={reject} />
      )}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  return useContext(CookieConsentContext)
}

function CookieConsentBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <div className="pointer-events-auto fixed inset-x-4 bottom-6 z-[1100] rounded-2xl border border-slate-800/40 bg-slate-900/90 p-5 text-sm text-slate-100 shadow-2xl shadow-slate-900/60 backdrop-blur-lg sm:left-1/2 sm:max-w-3xl sm:-translate-x-1/2">
      <div className="space-y-3">
        <p>
          Per offrire un’esperienza più limpida e sicura tratteniamo solo cookie tecnici finché non ci dai il via libera. Accetta per attivare quelli analitici, oppure rifiuta per mantenere solo quelli necessari. Consulta la <Link href="/cookie-policy" className="font-semibold text-amber-400 underline">Cookie Policy</Link> per le <em>Cookie Information +1</em> e i dettagli dei fornitori.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReject}
            className="rounded-full border border-slate-400/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:border-slate-100"
          >
            Rifiuta
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-500/50 transition hover:bg-amber-300"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  )
}
