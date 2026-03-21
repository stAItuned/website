'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type CarouselLocale = 'it' | 'en'

export type WorkflowScreenRole = 'operator' | 'manager' | 'admin'

export type WorkflowScreen = {
  id: string
  role: WorkflowScreenRole
  src: string
  alt: {
    it: string
    en: string
  }
}

type WorkflowScreensCarouselProps = {
  screens: WorkflowScreen[]
  locale: CarouselLocale
}

const AUTOPLAY_MS = 4500
const SWIPE_THRESHOLD_PX = 48

const ROLE_LABELS: Record<CarouselLocale, Record<WorkflowScreenRole, string>> = {
  it: {
    operator: 'Vista operatore',
    manager: 'Vista manager/approvatore',
    admin: 'Vista admin',
  },
  en: {
    operator: 'Operator view',
    manager: 'Manager/approver view',
    admin: 'Admin view',
  },
}

export function WorkflowScreensCarousel({ screens, locale }: WorkflowScreensCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [failedScreens, setFailedScreens] = useState<Record<string, true>>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const hasScreens = screens.length > 0

  const localizedUi = useMemo(
    () => ({
      regionLabel: locale === 'it' ? 'Carosello schermate workflow' : 'Workflow screenshots carousel',
      previous: locale === 'it' ? 'Schermata precedente' : 'Previous screenshot',
      next: locale === 'it' ? 'Schermata successiva' : 'Next screenshot',
      pause: locale === 'it' ? 'Metti in pausa autoplay' : 'Pause autoplay',
      resume: locale === 'it' ? 'Riprendi autoplay' : 'Resume autoplay',
      screen: locale === 'it' ? 'Schermata' : 'Screen',
      missingTitle: locale === 'it' ? 'Screenshot non disponibile' : 'Screenshot unavailable',
      missingBody:
        locale === 'it'
          ? 'Carica gli asset esportati da Figma in public/assets/business/screens/it.'
          : 'Upload exported Figma assets in public/assets/business/screens/it.',
    }),
    [locale],
  )

  const scrollToIndex = useCallback((nextIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const container = containerRef.current
    if (!container || !hasScreens) return
    const clamped = ((nextIndex % screens.length) + screens.length) % screens.length
    const targetLeft = clamped * container.clientWidth
    container.scrollTo({ left: targetLeft, behavior })
    startTransition(() => {
      setActiveIndex(clamped)
    })
  }, [hasScreens, screens.length])

  const goToNext = useCallback(() => {
    if (!hasScreens) return
    scrollToIndex(activeIndex + 1)
  }, [activeIndex, hasScreens, scrollToIndex])

  const goToPrevious = useCallback(() => {
    if (!hasScreens) return
    scrollToIndex(activeIndex - 1)
  }, [activeIndex, hasScreens, scrollToIndex])

  useEffect(() => {
    if (!hasScreens || isPaused) return
    const intervalId = window.setInterval(() => {
      scrollToIndex(activeIndex + 1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(intervalId)
  }, [activeIndex, hasScreens, isPaused, scrollToIndex])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !hasScreens) return

    const updateFromScroll = () => {
      if (!container.clientWidth) return
      const nextIndex = Math.round(container.scrollLeft / container.clientWidth)
      const wrapped = ((nextIndex % screens.length) + screens.length) % screens.length
      if (wrapped !== activeIndex) {
        startTransition(() => {
          setActiveIndex(wrapped)
        })
      }
    }

    container.addEventListener('scroll', updateFromScroll, { passive: true })
    return () => container.removeEventListener('scroll', updateFromScroll)
  }, [activeIndex, hasScreens, screens.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !hasScreens) return
    const onResize = () => scrollToIndex(activeIndex, 'auto')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIndex, hasScreens, scrollToIndex])

  const markFailed = (screenId: string, src: string) => {
    console.warn(`[workflow-carousel] Missing screenshot asset: ${src}`)
    setFailedScreens((current) => {
      if (current[screenId]) return current
      return { ...current, [screenId]: true }
    })
  }

  return (
    <section
      aria-label={localizedUi.regionLabel}
      className="relative mx-auto flex h-full w-full max-w-[390px] flex-col rounded-[2rem] border border-slate-200 bg-white/90 p-3 xl:max-w-[410px] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="mb-3 flex items-center justify-between gap-4 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-amber-300">
          {locale === 'it' ? 'Schermate reali' : 'Real screenshots'}
        </p>
        <button
          type="button"
          aria-label={isPaused ? localizedUi.resume : localizedUi.pause}
          onClick={() => setIsPaused((value) => !value)}
          className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-slate-200 bg-white px-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {isPaused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      <div className="relative flex-1">
        <div
          ref={containerRef}
          tabIndex={0}
          className="scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto rounded-[1.5rem] bg-slate-100/70 outline-none dark:bg-slate-950/70"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              goToPrevious()
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              goToNext()
            }
          }}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null
            setIsPaused(true)
          }}
          onTouchEnd={(event) => {
            const startX = touchStartX.current
            const endX = event.changedTouches[0]?.clientX ?? null
            touchStartX.current = null
            setIsPaused(false)
            if (startX === null || endX === null) return
            const delta = endX - startX
            if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
            if (delta > 0) goToPrevious()
            else goToNext()
          }}
        >
          {screens.map((screen, index) => (
            <article
              key={screen.id}
              className="relative flex h-full w-full min-w-full shrink-0 snap-center flex-col px-3 py-3"
              aria-label={`${localizedUi.screen} ${index + 1}`}
            >
              <div className="mb-3 flex items-center justify-end gap-2">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {ROLE_LABELS[locale][screen.role]}
                </span>
              </div>

              <div className="mx-auto flex h-full w-full max-w-[320px] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm xl:max-w-[330px] dark:border-slate-700 dark:bg-slate-900">
                {failedScreens[screen.id] ? (
                  <div className="flex min-h-[420px] w-full flex-1 flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,_rgba(248,250,252,0.95)_0%,_rgba(241,245,249,0.92)_100%)] p-6 text-center lg:min-h-0 dark:bg-[linear-gradient(160deg,_rgba(15,23,42,0.9)_0%,_rgba(2,6,23,0.9)_100%)]">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                      {localizedUi.missingTitle}
                    </p>
                    <p className="max-w-[20rem] text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {localizedUi.missingBody}
                    </p>
                  </div>
                ) : (
                  <div className="relative min-h-[420px] w-full flex-1 bg-slate-50 lg:min-h-0 dark:bg-slate-950">
                    <Image
                      src={screen.src}
                      alt={screen.alt[locale]}
                      width={1080}
                      height={2340}
                      unoptimized
                      className="absolute inset-0 block h-full w-full object-contain"
                      sizes="(max-width: 768px) 82vw, 330px"
                      priority={index === 0}
                      onError={() => markFailed(screen.id, screen.src)}
                      onLoad={(event) => {
                        const image = event.currentTarget
                        // Guard against placeholder/invalid tiny images so the user sees an explicit fallback.
                        if (image.naturalWidth < 100 || image.naturalHeight < 180) {
                          markFailed(screen.id, screen.src)
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              aria-label={localizedUi.previous}
              onClick={goToPrevious}
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={localizedUi.next}
              onClick={goToNext}
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {screens.map((screen, index) => (
          <button
            key={screen.id}
            type="button"
            aria-label={`${localizedUi.screen} ${index + 1}`}
            aria-current={activeIndex === index}
            onClick={() => scrollToIndex(index)}
            className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              activeIndex === index
                ? 'w-8 bg-slate-900 dark:bg-white'
                : 'w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
