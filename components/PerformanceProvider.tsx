'use client'

import { useEffect } from 'react'
import { usePerformanceMonitor } from '@/lib/performance/PerformanceMonitor'
import { ResourceHints, FontOptimization } from '@/lib/performance/CriticalRendering'

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
  // Initialize performance monitoring
  const monitor = usePerformanceMonitor({
    enableRUM: enableMonitoring,
    enableCoreWebVitals: true,
    enableBundleTracking: true,
    sampleRate,
    endpoint: '/api/analytics/performance' // You can create this endpoint
  })

  // Log performance data in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && monitor) {
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
