'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  FCP: number | null
  LCP: number | null
  FID: number | null
  CLS: number | null
  TTFB: number | null
  bundleSize: number | null
  renderTime: number | null
}

interface PerformanceConfig {
  enableRUM: boolean
  enableCoreWebVitals: boolean
  enableBundleTracking: boolean
  sampleRate: number
  endpoint?: string
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
  private observer: PerformanceObserver | null = null
  private startTime: number

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableRUM: true,
      enableCoreWebVitals: true,
      enableBundleTracking: true,
      sampleRate: 1.0,
      endpoint: '/api/analytics/performance',
      ...config
    }
    this.startTime = performance.now()
    this.initialize()
  }

  private initialize() {
    if (typeof window === 'undefined') return
    
    // Should we track this session?
    if (Math.random() > this.config.sampleRate) return

    this.trackCoreWebVitals()
    this.trackResourceMetrics()
    this.trackCustomMetrics()
    this.setupReporting()
  }

  private trackCoreWebVitals() {
    if (!this.config.enableCoreWebVitals) return

    try {
      // Track FCP (First Contentful Paint)
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime
          }
        }
      })
      this.observer.observe({ type: 'paint', buffered: true })

      // Track LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.LCP = lastEntry.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      // Track FID (First Input Delay)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.FID = entry.processingStart - entry.startTime
        }
      }).observe({ type: 'first-input', buffered: true })

      // Track CLS (Cumulative Layout Shift)
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        this.metrics.CLS = clsValue
      }).observe({ type: 'layout-shift', buffered: true })

      // Track TTFB (Time to First Byte)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === location.href) {
            this.metrics.TTFB = entry.responseStart - entry.requestStart
          }
        }
      }).observe({ type: 'navigation', buffered: true })

    } catch (error) {
      console.warn('Core Web Vitals tracking failed:', error)
    }
  }

  private trackResourceMetrics() {
    if (!this.config.enableBundleTracking) return

    try {
      // Track bundle sizes
      new PerformanceObserver((list) => {
        let totalSize = 0
        for (const entry of list.getEntries()) {
          if (entry.name.includes('/_next/static/')) {
            totalSize += entry.transferSize || 0
          }
        }
        this.metrics.bundleSize = totalSize
      }).observe({ type: 'resource', buffered: true })
    } catch (error) {
      console.warn('Resource tracking failed:', error)
    }
  }

  private trackCustomMetrics() {
    // Track React render time
    this.metrics.renderTime = performance.now() - this.startTime

    // Track memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.trackMetric('memory-used', memory.usedJSHeapSize)
      this.trackMetric('memory-total', memory.totalJSHeapSize)
      this.trackMetric('memory-limit', memory.jsHeapSizeLimit)
    }

    // Track connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      this.trackMetric('connection-downlink', connection.downlink)
      this.trackMetric('connection-rtt', connection.rtt)
      this.trackMetric('connection-type', connection.effectiveType)
    }
  }

  private trackMetric(name: string, value: any) {
    if (this.config.enableRUM) {
      // Store custom metrics for reporting
      performance.mark(`custom-${name}-${value}`)
    }
  }

  private setupReporting() {
    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.report()
    })

    // Report after 10 seconds for session tracking
    setTimeout(() => {
      this.report()
    }, 10000)

    // Report on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.report()
      }
    })
  }

  public report() {
    if (!this.config.endpoint) return

    const report = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      customMetrics: this.getCustomMetrics(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    }

    // Use sendBeacon for reliability on page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.config.endpoint,
        JSON.stringify(report)
      )
    } else {
      // Fallback to fetch with keepalive
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
        keepalive: true
      }).catch(console.error)
    }
  }

  private getCustomMetrics() {
    const entries = performance.getEntriesByType('mark')
    return entries
      .filter(entry => entry.name.startsWith('custom-'))
      .reduce((acc, entry) => {
        const [, name, value] = entry.name.split('-')
        acc[name] = value
        return acc
      }, {} as Record<string, any>)
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('staituned-session-id')
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('staituned-session-id', sessionId)
    }
    return sessionId
  }

  private getUserId(): string | null {
    return localStorage.getItem('staituned-user-id')
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public dispose() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// React Hook for performance monitoring
export function usePerformanceMonitor(config?: Partial<PerformanceConfig>) {
  const monitorRef = useRef<PerformanceMonitor | null>(null)

  useEffect(() => {
    monitorRef.current = new PerformanceMonitor(config)
    
    return () => {
      monitorRef.current?.dispose()
    }
  }, [])

  return monitorRef.current
}

// HOC for automatic performance tracking
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  trackingConfig?: Partial<PerformanceConfig>
) {
  return function PerformanceTrackedComponent(props: P) {
    usePerformanceMonitor(trackingConfig)
    return <Component {...props} />
  }
}
