'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { event } from '@/lib/gtag'

interface MobileOptimizedImageProps {
  src: string
  alt: string
  caption?: string
  priority?: boolean
  articleSlug?: string
  className?: string
}

export function MobileOptimizedImage({
  src,
  alt,
  caption,
  priority = false,
  articleSlug,
  className = ''
}: MobileOptimizedImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, distance: 0 })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (priority) {
      setIsVisible(true)
      return
    }

    // Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observerRef.current?.disconnect()
          }
        })
      },
      {
        rootMargin: '100px', // Load images 100px before they enter viewport
        threshold: 0.1
      }
    )

    if (imageRef.current) {
      observerRef.current.observe(imageRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [priority])

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1])
      setTouchStart({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        distance
      })
    } else if (e.touches.length === 1 && scale > 1) {
      setTouchStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
        distance: 0
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = getDistance(e.touches[0], e.touches[1])
      const newScale = Math.min(Math.max(1, (distance / touchStart.distance) * scale), 4)
      setScale(newScale)
      setIsZoomed(newScale > 1)
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan when zoomed
      const newX = e.touches[0].clientX - touchStart.x
      const newY = e.touches[0].clientY - touchStart.y
      setPosition({ x: newX, y: newY })
    }
  }

  const handleTouchEnd = () => {
    if (scale <= 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setIsZoomed(false)
    }

    if (scale > 1 && articleSlug) {
      event({
        action: 'image_zoom',
        category: 'engagement',
        label: articleSlug,
        value: 1
      })
    }
  }

  const handleDoubleTap = () => {
    if (scale === 1) {
      setScale(2)
      setIsZoomed(true)
      
      if (articleSlug) {
        event({
          action: 'image_zoom',
          category: 'engagement',
          label: articleSlug,
          value: 1
        })
      }
    } else {
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setIsZoomed(false)
    }
  }

  return (
    <div 
      ref={imageRef}
      className={`relative w-full my-6 overflow-hidden ${className}`}
    >
      {isVisible ? (
        <>
          <div
            className={`relative w-full transition-transform duration-200 touch-none ${
              isZoomed ? 'cursor-move' : 'cursor-zoom-in'
            }`}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleTap}
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority={priority}
                unoptimized={src.startsWith('http')}
                loading={priority ? 'eager' : 'lazy'}
              />
            </div>
          </div>

          {/* Zoom Indicator */}
          {isZoomed && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
              {Math.round(scale * 100)}%
            </div>
          )}

          {/* Caption */}
          {caption && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center mt-3 px-4">
              {caption}
            </p>
          )}

          {/* Pinch Hint */}
          {!isZoomed && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-medium opacity-0 hover:opacity-100 transition-opacity lg:hidden pointer-events-none">
              Pinch to zoom
            </div>
          )}
        </>
      ) : (
        // Placeholder while loading
        <div className="w-full aspect-video rounded-lg bg-gray-200 dark:bg-slate-800 animate-pulse" />
      )}
    </div>
  )
}
