'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  FCP: number | null // First Contentful Paint
  LCP: number | null // Largest Contentful Paint
  FID: number | null // First Input Delay
  CLS: number | null // Cumulative Layout Shift
  TTFB: number | null // Time to First Byte
  bundleSize: number | null
  renderTime: number | null
}

interface PerformanceConfig {
  enableRUM: boolean // Real User Monitoring
  enableCoreWebVitals: boolean
  enableBundleTracking: boolean
  sampleRate: number // 0.1 = 10% of users
  endpoint?: string // Your analytics endpoint
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null,
    bundleSize: null,
    renderTime: null
  }

  private config: PerformanceConfig
  private isClient: boolean

  constructor(config: PerformanceConfig) {
    this.config = config
    this.isClient = typeof window !== 'undefined'
    
    if (this.isClient && this.config.enableCoreWebVitals) {
      this.initCoreWebVitals()
    }
  }

  private initCoreWebVitals() {
    if (!this.isClient || !('PerformanceObserver' in window)) return

    try {
      // Track FCP (First Contentful Paint) - When first content appears
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.FCP = lastEntry.startTime
        this.reportMetric('FCP', lastEntry.startTime)
      }).observe({ type: 'paint', buffered: true })

      // Track LCP (Largest Contentful Paint) - When main content loads
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.LCP = lastEntry.startTime
        this.reportMetric('LCP', lastEntry.startTime)
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      // Track FID (First Input Delay) - Responsiveness to user input
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number }
          if (fidEntry.processingStart) {
            const fidValue = fidEntry.processingStart - entry.startTime
            this.metrics.FID = fidValue
            this.reportMetric('FID', fidValue)
          }
        }
      }).observe({ type: 'first-input', buffered: true })

      // Track CLS (Cumulative Layout Shift) - Visual stability
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
          if (clsEntry.value !== undefined && !clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
          }
        }
        this.metrics.CLS = clsValue
        this.reportMetric('CLS', clsValue)
      }).observe({ type: 'layout-shift', buffered: true })

      // Track TTFB (Time to First Byte) - Server response time
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navigationEntry = entry as PerformanceEntry & { 
            responseStart?: number; 
            requestStart?: number 
          }
          if (navigationEntry.responseStart && navigationEntry.requestStart) {
            const ttfbValue = navigationEntry.responseStart - navigationEntry.requestStart
            this.metrics.TTFB = ttfbValue
            this.reportMetric('TTFB', ttfbValue)
          }
        }
      }).observe({ type: 'navigation', buffered: true })

    } catch (error) {
      console.warn('Performance monitoring setup failed:', error)
    }
  }

  // Track bundle size and loading performance
  public trackBundleSize() {
    if (!this.isClient || !this.config.enableBundleTracking) return

    try {
      const resourceEntries = performance.getEntriesByType('resource') as (PerformanceEntry & {
        transferSize?: number;
        name: string;
      })[]
      let totalSize = 0
      let jsSize = 0
      let cssSize = 0
      
      resourceEntries.forEach(entry => {
        if (entry.name.includes('/_next/static/')) {
          const size = entry.transferSize || 0
          totalSize += size
          
          if (entry.name.endsWith('.js')) jsSize += size
          if (entry.name.endsWith('.css')) cssSize += size
        }
      })
      
      this.metrics.bundleSize = totalSize
      this.reportMetric('bundleSize', totalSize)
      this.reportMetric('jsSize', jsSize)
      this.reportMetric('cssSize', cssSize)
    } catch (error) {
      console.warn('Bundle size tracking failed:', error)
    }
  }

  // Report metrics to your analytics endpoint
  private reportMetric(name: string, value: number) {
    if (Math.random() > this.config.sampleRate) return // Sample rate check
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric: ${name} = ${value}ms`)
    }
    
    // Send to analytics endpoint
    if (this.config.endpoint) {
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: name,
          value,
          url: window.location.pathname,
          timestamp: Date.now(),
          userAgent: navigator.userAgent.slice(0, 200)
        })
      }).catch(err => console.warn('Failed to send metric:', err))
    }
  }

  // Get current metrics snapshot
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Get performance grade based on Google's thresholds
  public getPerformanceGrade() {
    const { FCP, LCP, FID, CLS } = this.metrics
    
    const grades = {
      FCP: FCP ? (FCP < 1800 ? 'good' : FCP < 3000 ? 'needs-improvement' : 'poor') : 'unknown',
      LCP: LCP ? (LCP < 2500 ? 'good' : LCP < 4000 ? 'needs-improvement' : 'poor') : 'unknown',
      FID: FID ? (FID < 100 ? 'good' : FID < 300 ? 'needs-improvement' : 'poor') : 'unknown',
      CLS: CLS ? (CLS < 0.1 ? 'good' : CLS < 0.25 ? 'needs-improvement' : 'poor') : 'unknown'
    }
    
    return grades
  }
}

// React hook for easy integration
export function usePerformanceMonitor(config: PerformanceConfig) {
  const monitorRef = useRef<PerformanceMonitor | null>(null)

  useEffect(() => {
    if (!monitorRef.current) {
      monitorRef.current = new PerformanceMonitor(config)
    }

    // Track bundle size after component mount
    const timer = setTimeout(() => {
      monitorRef.current?.trackBundleSize()
    }, 2000) // Wait for resources to load

    return () => clearTimeout(timer)
  }, [config])

  return monitorRef.current
}

export default PerformanceMonitor
