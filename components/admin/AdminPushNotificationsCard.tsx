'use client'

import { useState } from 'react'
import { getMessaging, getToken } from 'firebase/messaging'
import { useAuth } from '@/components/auth/AuthContext'
import { app } from '@/lib/firebase/client'
import { ADMIN_EMAILS } from '@/lib/firebase/admin-emails'

type CardStatus = 'idle' | 'enabled' | 'disabled' | 'permission_denied' | 'error'

const ADMIN_PUSH_TOKEN_KEY = 'admin-fcm-token'
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

function supportsWebPush(): boolean {
  return typeof window !== 'undefined'
    && 'Notification' in window
    && 'serviceWorker' in navigator
}

export function AdminPushNotificationsCard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<CardStatus>(() => {
    if (typeof window === 'undefined') return 'idle'
    const hasToken = Boolean(localStorage.getItem(ADMIN_PUSH_TOKEN_KEY))
    return hasToken ? 'enabled' : 'idle'
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const userEmail = user?.email?.toLowerCase() ?? null
  const isEmailAllowed = userEmail ? ADMIN_EMAILS.includes(userEmail) : false
  const isSupported = supportsWebPush()

  async function handleEnable() {
    if (!user || !isSupported || !isEmailAllowed) return

    setLoading(true)
    setErrorMessage(null)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('permission_denied')
        return
      }
      if (!VAPID_KEY) {
        throw new Error('Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY')
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      const messaging = getMessaging(app)
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      })

      if (!token) {
        throw new Error('Failed to obtain FCM token')
      }

      const idToken = await user.getIdToken()
      const response = await fetch('/api/admin/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          token,
          topic: 'admin-ops',
        }),
      })

      if (!response.ok) {
        throw new Error('Admin notifications register failed')
      }

      localStorage.setItem(ADMIN_PUSH_TOKEN_KEY, token)
      setStatus('enabled')
    } catch (error) {
      console.error('[AdminPushNotificationsCard] enable failed', error)
      setStatus('error')
      setErrorMessage('Impossibile attivare le notifiche admin in questo momento.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDisable() {
    if (!user || !isEmailAllowed) return
    const token = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_PUSH_TOKEN_KEY) : null
    if (!token) {
      setStatus('disabled')
      return
    }

    setLoading(true)
    setErrorMessage(null)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch('/api/admin/notifications/unregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error('Admin notifications unregister failed')
      }

      localStorage.removeItem(ADMIN_PUSH_TOKEN_KEY)
      setStatus('disabled')
    } catch (error) {
      console.error('[AdminPushNotificationsCard] disable failed', error)
      setStatus('error')
      setErrorMessage('Impossibile disattivare le notifiche admin in questo momento.')
    } finally {
      setLoading(false)
    }
  }

  if (!isEmailAllowed) return null

  return (
    <section className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 sm:p-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">Notifiche Operative Admin (PWA)</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Abilita notifiche metadata-only per nuovi submit dei form principali. I dettagli restano disponibili solo nella dashboard admin.
      </p>

      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Stato: <span className="font-semibold">{status}</span>
      </div>

      {!isSupported && (
        <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
          Browser/PWA non compatibile con notifiche push.
        </p>
      )}
      {status === 'permission_denied' && (
        <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
          Permesso notifiche negato dal browser.
        </p>
      )}
      {errorMessage && (
        <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">
          {errorMessage}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleEnable}
          disabled={!isSupported || loading}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Attivazione...' : 'Attiva notifiche operative'}
        </button>
        <button
          type="button"
          onClick={handleDisable}
          disabled={loading}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Disattiva
        </button>
      </div>
    </section>
  )
}

export default AdminPushNotificationsCard
