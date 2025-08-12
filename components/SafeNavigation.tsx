'use client'

import { useEffect, useState } from 'react'

/**
 * Hook that safely gets pathname during client-side only
 */
export function useSafePathname(): string | null {
  const [isClient, setIsClient] = useState(false)
  const [pathname, setPathname] = useState<string | null>(null)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    try {
      // Get pathname only on client side
      if (typeof window !== 'undefined') {
        setPathname(window.location.pathname)
      }
    } catch (error) {
      setPathname(null)
    }
  }, [isClient])

  return pathname
}

/**
 * Component wrapper for safe client-side navigation
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
