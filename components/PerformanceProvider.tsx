'use client'

import { useEffect, useMemo } from 'react'
import { usePerformanceMonitor } from '@/lib/performance/PerformanceMonitor'
import { ResourceHints, FontOptimization } from '@/lib/performance/CriticalRendering'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'

interface PerformanceProviderProps {
  children: React.ReactNode
  enableMonitoring?: boolean
  sampleRate?: number
}

export function PerformanceProvider({ 
  children, 
  enableMonitoring = true,
  sampleRate = 0.1 // 10% of users by default
}: PerformanceProviderProps) {
  const { hasConsentedToAnalytics } = useCookieConsent()
  const shouldMonitor = enableMonitoring && hasConsentedToAnalytics

  const config = useMemo(
    () => ({
      enableRUM: shouldMonitor,
      enableCoreWebVitals: shouldMonitor,
      enableBundleTracking: shouldMonitor,
      sampleRate: shouldMonitor ? sampleRate : 0,
      endpoint: shouldMonitor ? '/api/analytics/performance' : undefined,
    }),
    [shouldMonitor, sampleRate]
  )

  // Initialize performance monitoring
  const monitor = usePerformanceMonitor(config)

  // Log performance data in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && shouldMonitor && monitor) {
      const logPerformance = () => {
        const metrics = monitor.getMetrics()
        const grades = monitor.getPerformanceGrade()
        
        console.group('🚀 Performance Report')
        console.log('📊 Metrics:', metrics)
        console.log('📈 Grades:', grades)
        console.groupEnd()
      }

      // Log after initial load
      setTimeout(logPerformance, 3000)
      
      // Log on page visibility change (when user comes back to tab)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          setTimeout(logPerformance, 1000)
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [monitor])

  return (
    <>
      <ResourceHints />
      <FontOptimization />
      {children}
    </>
  )
}

export default PerformanceProvider
