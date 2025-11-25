'use client'

import { useEffect } from 'react'

const SERVICE_WORKER_PATH = '/sw.js'
export const SW_UPDATE_EVENT = 'staituned-sw-update'

function dispatchUpdateEvent(message: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent(SW_UPDATE_EVENT, {
      detail: { message },
    }),
  )
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let registration: ServiceWorkerRegistration | undefined
    let updateHandler: (() => void) | undefined

    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'SW_VERSION') {
        console.debug('[PWA] service worker version', event.data.version)
      }
    }

    const watchForUpdates = (reg: ServiceWorkerRegistration) => {
      const installing = reg.installing
      if (!installing) return

      const onStateChange = () => {
        if (installing.state === 'installed' && navigator.serviceWorker?.controller) {
          dispatchUpdateEvent('A new version of stAItuned is ready')
        }
      }

      installing.addEventListener('statechange', onStateChange)
    }

    navigator.serviceWorker.addEventListener('message', messageHandler)

    navigator.serviceWorker
      .register(SERVICE_WORKER_PATH)
      .then((reg) => {
        registration = reg
        console.log('[PWA] Service Worker registered:', reg.scope)

        if (reg.waiting) {
          dispatchUpdateEvent('A new version of stAItuned is ready')
        }

        watchForUpdates(reg)

        updateHandler = () => watchForUpdates(reg)
        reg.addEventListener('updatefound', updateHandler)
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error)
      })

    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler)
      if (registration && updateHandler) {
        registration.removeEventListener('updatefound', updateHandler)
      }
    }
  }, [])

  return null
}
