'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Maximize2, X } from 'lucide-react'
import { VentureVisualPlaceholder } from './VentureVisualPlaceholder'

interface VentureVisualMediaProps {
  title: string
  label: string
  index: number
  placeholderLabel: string
  imageSrc?: string
  zoomLabel?: string
  closeLabel?: string
}

/**
 * Renders venture product imagery or falls back to geometry-preserving placeholders.
 * When real imagery is available, provides an accessible click-to-zoom modal for inspectability.
 */
export function VentureVisualMedia({
  title,
  label,
  index,
  placeholderLabel,
  imageSrc,
  zoomLabel = 'Zoom',
  closeLabel = 'Close',
}: VentureVisualMediaProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  useEffect(() => {
    if (!isZoomOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isZoomOpen])

  if (!imageSrc) {
    return (
      <VentureVisualPlaceholder
        title={title}
        label={label}
        index={index}
        placeholderLabel={placeholderLabel}
      />
    )
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsZoomOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsZoomOpen(true)
          }
        }}
        className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-slate-700 dark:bg-slate-900"
        aria-label={`${title} - ${zoomLabel}`}
      >
        <Image
          src={imageSrc}
          alt={label}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={index === 0}
        />

        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 opacity-90 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:bg-white group-hover:text-amber-600 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-200 dark:group-hover:text-amber-400">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{zoomLabel}</span>
        </div>
      </div>

      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} - ${zoomLabel}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm animate-fade-in sm:p-6"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full border border-slate-600 bg-slate-800/90 p-2 text-slate-300 shadow-md transition hover:bg-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="relative aspect-video w-full">
              <Image
                src={imageSrc}
                alt={label}
                fill
                className="object-contain"
                sizes="(min-width: 1280px) 1024px, 100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
