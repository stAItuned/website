import { useSyncExternalStore } from 'react'

export function useScreenSize() {
  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => undefined
    window.addEventListener('resize', onStoreChange)
    return () => window.removeEventListener('resize', onStoreChange)
  }

  const getSnapshot = () => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= 1024
  }

  const getServerSnapshot = () => true

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
