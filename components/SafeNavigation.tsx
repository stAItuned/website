'use client'

import { useSyncExternalStore } from 'react'

/**
 * Hook that safely gets pathname during client-side only
 */
export function useSafePathname(): string | null {
  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => undefined

    window.addEventListener('popstate', onStoreChange)
    window.addEventListener('hashchange', onStoreChange)
    return () => {
      window.removeEventListener('popstate', onStoreChange)
      window.removeEventListener('hashchange', onStoreChange)
    }
  }

  const getSnapshot = () => {
    if (typeof window === 'undefined') return null
    return window.location.pathname
  }

  const getServerSnapshot = () => null

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Component wrapper for safe client-side navigation
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const hasMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  )

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
