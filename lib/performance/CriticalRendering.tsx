'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetRef, hasIntersected, options])

  return { isIntersecting, hasIntersected }
}

// Progressive image loading component
interface ProgressiveImageProps {
  src: string
  alt: string
  lowQualitySrc?: string
  className?: string
  priority?: boolean
  onLoad?: () => void
}

export function ProgressiveImage({
  src,
  alt,
  lowQualitySrc,
  className = '',
  priority = false,
  onLoad
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const { hasIntersected } = useIntersectionObserver(imgRef)

  const shouldLoad = priority || hasIntersected

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsError(true)
  }, [])

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Low quality placeholder */}
      {lowQualitySrc && !isLoaded && (
        <Image
          src={lowQualitySrc}
          alt=""
          fill
          className="absolute inset-0 object-cover filter blur-sm scale-110 transition-opacity duration-300"
          aria-hidden="true"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      
      {/* Skeleton loader */}
      {!isLoaded && !lowQualitySrc && (
        <div className="absolute inset-0 skeleton" />
      )}
      
      {/* Main image */}
      {shouldLoad && !isError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      
      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  )
}

// Code splitting with loading states
export function LazyComponent<T extends Record<string, unknown>>({
  importFunc,
  fallback,
  errorFallback,
  ...props
}: {
  importFunc: () => Promise<{ default: React.ComponentType<T> }>
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
} & T) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    importFunc()
      .then(module => {
        setComponent(() => module.default)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err)
        setIsLoading(false)
      })
  }, [importFunc])

  if (error) {
    return errorFallback || <div>Error loading component</div>
  }

  if (isLoading || !Component) {
    return fallback || <div className="skeleton h-32 w-full" />
  }

  return <Component {...(props as unknown as T)} />
}

// Prefetch hook for critical resources
export function usePrefetch() {
  const prefetchedResources = useRef(new Set<string>())

  const prefetch = useCallback((href: string, type: 'script' | 'style' | 'image' = 'script') => {
    if (prefetchedResources.current.has(href)) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    if (type === 'script') link.as = 'script'
    else if (type === 'style') link.as = 'style'
    else if (type === 'image') link.as = 'image'

    document.head.appendChild(link)
    prefetchedResources.current.add(href)
  }, [])

  const preload = useCallback((href: string, type: 'script' | 'style' | 'font' | 'image' = 'script') => {
    if (prefetchedResources.current.has(href)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = type
    if (type === 'font') {
      link.crossOrigin = 'anonymous'
    }

    document.head.appendChild(link)
    prefetchedResources.current.add(href)
  }, [])

  return { prefetch, preload }
}

// Resource priority hints
export function ResourceHints() {
  useEffect(() => {
    // Preconnect to critical domains
    const criticalDomains = [
      'https://www.googletagmanager.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    criticalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      if (domain.includes('fonts')) {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })

    // DNS prefetch for analytics
    const dnsPrefetchDomains = [
      'https://www.google-analytics.com',
      'https://googletagmanager.com'
    ]

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }, [])

  return null
}

// Critical font loading
export function FontOptimization() {
  useEffect(() => {
    // The app uses Google Fonts via `@import` in `app/globals.css` and
    // `next/font/google` in `app/layout.tsx`. Avoid preloading local
    // font files that may not exist in `public/fonts/` to prevent 404s.
    // Instead, ensure we preconnect to Google Fonts which helps
    // performance when loading remote fonts.

    const preconnect = (href: string, crossOrigin = false) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      if (crossOrigin) link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }

    preconnect('https://fonts.googleapis.com')
    preconnect('https://fonts.gstatic.com', true)
  }, [])

  return null
}

// Enhanced viewport management
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768
      })
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewport
}
