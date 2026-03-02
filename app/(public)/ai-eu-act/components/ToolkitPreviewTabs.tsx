'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import type { AiEuActToolkitTab } from '@/lib/i18n/ai-eu-act-translations'

interface ToolkitPreviewTabsProps {
  title: string
  subtitle: string
  unlockMessage: string
  cta: string
  ui: {
    lockedLabel: string
    previousPageAria: string
    nextPageAria: string
    goToPageAriaPrefix: string
  }
  resources: AiEuActToolkitTab[]
}

interface PreviewSlide {
  id: string
  label: string
  kind: 'pdf' | 'excel' | 'locked'
  src?: string
  rows?: string[][]
  message?: string
}

function ExcelPreview({ rows }: { rows: string[][] }) {
  return (
    <div className="h-full rounded-xl border border-white/10 bg-slate-900 p-3">
      <div className="grid grid-cols-4 gap-2 text-[11px]">
        {rows.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`rounded px-2 py-1 ${rowIndex === 0 ? 'bg-amber-500 font-semibold text-slate-900' : 'bg-slate-800 text-slate-200'}`}
            >
              {cell}
            </div>
          )),
        )}
      </div>
    </div>
  )
}

export default function ToolkitPreviewTabs({
  title,
  subtitle,
  unlockMessage,
  cta,
  ui,
  resources,
}: ToolkitPreviewTabsProps) {
  const [tabIndex, setTabIndex] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const activeTab = resources[tabIndex]

  const slides = useMemo<PreviewSlide[]>(() => {
    if (!activeTab) return []

    if (activeTab.kind === 'pdf') {
      return [
        ...activeTab.pages.map((page) => ({
          id: page.id,
          label: page.label,
          kind: 'pdf' as const,
          src: page.src,
        })),
        {
          id: `${activeTab.id}-locked`,
          label: ui.lockedLabel,
          kind: 'locked' as const,
          message: activeTab.locked,
        },
      ]
    }

    return [
      ...activeTab.sheets.map((sheet) => ({
        id: sheet.id,
        label: sheet.label,
        kind: 'excel' as const,
        rows: sheet.rows,
      })),
      {
        id: `${activeTab.id}-locked`,
        label: ui.lockedLabel,
        kind: 'locked' as const,
        message: activeTab.locked,
      },
    ]
  }, [activeTab, ui.lockedLabel])

  const activeSlide = slides[pageIndex]

  useEffect(() => {
    const node = trackRef.current
    if (!node) return

    const width = node.clientWidth
    node.scrollTo({
      left: width * pageIndex,
      behavior: 'smooth',
    })
  }, [pageIndex])

  function handleHorizontalScroll() {
    const node = trackRef.current
    if (!node) return
    const width = node.clientWidth
    if (width === 0) return

    const nextIndex = Math.round(node.scrollLeft / width)
    if (nextIndex !== pageIndex && nextIndex >= 0 && nextIndex < slides.length) {
      setPageIndex(nextIndex)
    }
  }

  function prevPage() {
    setPageIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  function nextPage() {
    setPageIndex((current) => (current === slides.length - 1 ? 0 : current + 1))
  }

  if (!activeTab) {
    return null
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <div role="tablist" aria-label={title} className="mb-4 flex flex-wrap gap-2">
          {resources.map((resource, index) => (
            <button
              key={resource.id}
              type="button"
              role="tab"
              aria-selected={index === tabIndex}
              onClick={() => {
                setPageIndex(0)
                setTabIndex(index)
              }}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${index === tabIndex
                ? 'border-amber-400 bg-amber-500 text-slate-900'
                : 'border-white/20 bg-slate-800 text-slate-200 hover:border-amber-400/70 hover:text-amber-300'
                }`}
            >
              {resource.tabLabel}
            </button>
          ))}
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white">{activeTab.title}</h3>
          <p className="mt-1 text-sm text-slate-300">{activeTab.description}</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900">
          <div
            ref={trackRef}
            onScroll={handleHorizontalScroll}
            className="h-[280px] snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth xs:h-[320px] md:h-[360px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex h-full">
              {slides.map((slide) => (
                <div key={slide.id} className="h-full w-full shrink-0 snap-center">
                  {slide.kind === 'pdf' ? (
                    <iframe
                      title={slide.label}
                      src={slide.src}
                      className="h-full w-full pointer-events-none"
                      loading="lazy"
                    />
                  ) : null}

                  {slide.kind === 'excel' && slide.rows ? <ExcelPreview rows={slide.rows} /> : null}

                  {slide.kind === 'locked' ? (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900 p-6 text-center">
                      <div>
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10">
                          <Lock className="h-5 w-5 text-amber-400" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">{slide.message}</p>
                        <p className="mt-2 text-xs text-slate-200">{unlockMessage}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 bg-slate-900/95 px-3 py-2">
            <p className="max-w-[60%] truncate text-xs font-medium text-slate-300">{activeSlide?.label}</p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevPage}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-slate-800 text-slate-300 transition hover:border-amber-400 hover:bg-slate-700 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label={ui.previousPageAria}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextPage}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-slate-800 text-slate-300 transition hover:border-amber-400 hover:bg-slate-700 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label={ui.nextPageAria}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setPageIndex(idx)}
                aria-label={`${ui.goToPageAriaPrefix} ${slide.label}`}
                className={`rounded-full transition-all ${idx === pageIndex ? 'h-2 w-7 bg-amber-500' : 'h-2 w-2 bg-slate-500 hover:bg-amber-400'}`}
              />
            ))}
          </div>
          <a
            href="#lead-form"
            className="inline-flex rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:border-amber-300 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {cta}
          </a>
        </div>
      </div>
    </section>
  )
}
