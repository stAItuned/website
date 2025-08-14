'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { clearExpiredCache } from '@/lib/hooks/useAnalytics'

interface CacheContextType {
  clearAllCache: () => void
  clearExpiredCache: () => void
}

const CacheContext = createContext<CacheContextType | undefined>(undefined)

interface CacheProviderProps {
  children: ReactNode
}

export function CacheProvider({ children }: CacheProviderProps) {
  useEffect(() => {
    // Clean expired cache on app start
    clearExpiredCache()
    
    // Set up periodic cache cleanup (every 5 minutes)
    const interval = setInterval(() => {
      clearExpiredCache()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const clearAllCache = () => {
    if (typeof window !== 'undefined') {
      // Clear analytics cache
      const keys = Object.keys(localStorage).filter(key => key.startsWith('analytics_'))
      keys.forEach(key => localStorage.removeItem(key))
      
      // You can add other cache clearing logic here
      console.log('All cache cleared')
    }
  }

  const value: CacheContextType = {
    clearAllCache,
    clearExpiredCache,
  }

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  )
}

export function useCache() {
  const context = useContext(CacheContext)
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider')
  }
  return context
}
