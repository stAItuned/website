'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLearnLocale } from '@/lib/i18n'

interface WriterOnboardingTourProps {
  isWriter: boolean | null
}

interface TourStep {
  id: string
  targetSelector: string
  title: string
  description: string
}

const STORAGE_KEY = 'stai_writer_onboarding_tour_v1'

/**
 * Spotlight onboarding for reader users in Account Settings.
 * Guides users to the writer activation entry points.
 */
export function WriterOnboardingTour({ isWriter }: WriterOnboardingTourProps) {
  const searchParams = useSearchParams()
  const { locale } = useLearnLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [viewport, setViewport] = useState({ width: 1280, height: 800 })

  const steps = useMemo<TourStep[]>(() => {
    if (locale === 'en') {
      return [
        {
          id: 'header-cta',
          targetSelector: '[data-tour="writer-header-cta"]',
          title: 'Quick way to activate writer profile',
          description: 'This button opens the writer activation flow immediately.',
        },
        {
          id: 'writer-section',
          targetSelector: '#writer',
          title: 'This is your Writer Workspace section',
          description: 'Here you can monitor your writer status and access writer tools.',
        },
        {
          id: 'writer-activate-cta',
          targetSelector: '[data-tour="writer-activate-cta"]',
          title: 'Click here to become a writer',
          description: 'Use this CTA to start the guided onboarding and activate your writer profile.',
        },
      ]
    }

    return [
      {
        id: 'header-cta',
        targetSelector: '[data-tour="writer-header-cta"]',
        title: 'Attivazione rapida profilo writer',
        description: 'Questo bottone apre subito il flusso di attivazione writer.',
      },
      {
        id: 'writer-section',
        targetSelector: '#writer',
        title: 'Questa e la tua sezione Area Writer',
        description: 'Qui controlli lo stato writer e accedi agli strumenti dedicati.',
      },
      {
        id: 'writer-activate-cta',
        targetSelector: '[data-tour="writer-activate-cta"]',
        title: 'Clicca qui per diventare writer',
        description: 'Usa questa CTA per avviare l onboarding guidato e attivare il profilo writer.',
      },
    ]
  }, [locale])

  useEffect(() => {
    if (isWriter !== false) return

    const forcedTour = searchParams.get('tour') === 'writer'
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null

    if (forcedTour || !saved) {
      const timer = window.setTimeout(() => {
        setIsOpen(true)
        setStepIndex(0)
      }, 0)
      return () => window.clearTimeout(timer)
    }
  }, [isWriter, searchParams])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const step = steps[stepIndex]
    if (!step) return

    const updateTarget = () => {
      const el = document.querySelector(step.targetSelector)
      if (!el) {
        setTargetRect(null)
        return
      }
      const rect = (el as HTMLElement).getBoundingClientRect()
      setTargetRect(rect)
    }

    updateTarget()
    const el = document.querySelector(step.targetSelector) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }

    window.addEventListener('resize', updateTarget)
    window.addEventListener('scroll', updateTarget, true)
    return () => {
      window.removeEventListener('resize', updateTarget)
      window.removeEventListener('scroll', updateTarget, true)
    }
  }, [isOpen, stepIndex, steps])

  if (!isOpen || isWriter !== false) return null

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const saveAndClose = (state: 'dismissed' | 'completed') => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, state)
    }
    setIsOpen(false)
  }

  const nextStep = () => {
    if (isLastStep) {
      saveAndClose('completed')
      return
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const popoverTop = targetRect ? Math.min(targetRect.bottom + 12, viewport.height - 220) : 120
  const popoverLeft = targetRect ? Math.min(Math.max(targetRect.left, 16), viewport.width - 380) : 16

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-slate-950/60" />

      {targetRect ? (
        <div
          className="absolute rounded-2xl border-2 border-secondary-500 shadow-[0_0_0_9999px_rgba(2,6,23,0.6)] transition-all duration-300"
          style={{
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
          }}
        />
      ) : null}

      <div
        className="absolute w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        style={{
          top: `${popoverTop}px`,
          left: `${popoverLeft}px`,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
          {locale === 'en' ? `Step ${stepIndex + 1}/${steps.length}` : `Passo ${stepIndex + 1}/${steps.length}`}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => saveAndClose('dismissed')}
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          >
            {locale === 'en' ? 'Skip' : 'Salta'}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={stepIndex === 0}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {locale === 'en' ? 'Back' : 'Indietro'}
            </button>
            {isLastStep ? (
              <Link
                href="/become-writer"
                onClick={() => saveAndClose('completed')}
                className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
              >
                {locale === 'en' ? 'Activate now' : 'Attiva ora'}
              </Link>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
              >
                {locale === 'en' ? 'Next' : 'Avanti'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
