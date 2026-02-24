'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { roleFitAuditTranslations, type RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'

const accents = [
  { accent: 'from-violet-500 to-purple-600', accentLight: 'bg-violet-500/10 border-violet-500/30 text-violet-400' },
  { accent: 'from-blue-500 to-cyan-500', accentLight: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { accent: 'from-amber-500 to-orange-500', accentLight: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
  { accent: 'from-emerald-500 to-teal-500', accentLight: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
]

function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="font-semibold text-white bg-gradient-to-r from-[#FFF272] to-amber-400 bg-clip-text text-transparent">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

export function RoleFitHowItWorks({ locale }: { locale: RoleFitLocale }) {
  const t = roleFitAuditTranslations[locale].howItWorks
  const steps = t.steps.map((step, index) => ({ ...step, ...accents[index] }))

  const [activeStep, setActiveStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)
  const mobileCarouselRef = useRef<HTMLDivElement>(null)

  const advanceStep = useCallback(() => {
    if (!expandedImage) setActiveStep((prev) => (prev + 1) % steps.length)
  }, [expandedImage, steps.length])

  useEffect(() => {
    if (isPaused || expandedImage) return
    const timer = setInterval(advanceStep, 5000)
    return () => clearInterval(timer)
  }, [isPaused, advanceStep, expandedImage])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedImage(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    const carousel = mobileCarouselRef.current
    if (!carousel) return
    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft
      const cardWidth = carousel.offsetWidth * 0.85 + 16
      const newIndex = Math.round(scrollLeft / cardWidth)
      setMobileActiveIndex(Math.min(newIndex, steps.length - 1))
    }

    carousel.addEventListener('scroll', handleScroll, { passive: true })
    return () => carousel.removeEventListener('scroll', handleScroll)
  }, [steps.length])

  const currentStep = steps[activeStep]

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t.title} <span className="text-amber-600 dark:text-[#FFF272]">{t.titleAccent}</span>
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="md:hidden">
        <div ref={mobileCarouselRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {steps.map((step) => (
            <div key={step.n} className="min-w-[85%] snap-center rounded-2xl p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl shadow-black/20">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${step.accentLight}`}>
                <span>{t.stepLabel} {step.n}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>

              <ul className="space-y-2 mb-4">
                {step.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-[#FFF272] mt-0.5">•</span>
                    <span><HighlightedText text={bullet.text} highlight={bullet.highlight} /></span>
                  </li>
                ))}
              </ul>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-700/50 shadow-lg cursor-zoom-in" onClick={() => setExpandedImage(step.img.src)}>
                <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white/90 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border border-white/10 shadow-sm pointer-events-none text-right leading-tight whitespace-pre-line">
                  {t.previewLabel}
                </div>

                <Image src={step.img.src} alt={step.img.alt} fill className="object-cover" sizes="85vw" />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold px-2 py-1 rounded bg-black/60 backdrop-blur-sm">{t.zoom}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === mobileActiveIndex ? 'bg-[#FFF272]' : 'bg-slate-600'}`} />
          ))}
        </div>
      </div>

      <div className="hidden md:block" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div className="relative h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentStep.accent} transition-all duration-300`} style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {steps.map((step, idx) => (
            <button
              key={step.n}
              onClick={() => setActiveStep(idx)}
              className={`relative p-4 rounded-xl text-left transition-all duration-300 group ${
                idx === activeStep
                  ? 'bg-slate-900 border-2 border-[#FFF272]/50 shadow-[0_0_20px_-5px_theme(colors.amber.500)]'
                  : 'bg-transparent border border-white/5 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <div className={`text-xs font-bold mb-1 transition-colors ${idx === activeStep ? 'text-[#FFF272]' : 'text-slate-400 group-hover:text-slate-300'}`}>
                {t.stepLabel} {step.n}
              </div>
              <div className={`font-semibold transition-colors ${idx === activeStep ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                {step.shortTitle}
              </div>
              {idx === activeStep && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rotate-45 bg-slate-800 border-r border-b border-[#FFF272]/50" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 w-fit ${currentStep.accentLight}`}>
              {t.stepLabel} {currentStep.n}
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">{currentStep.title}</h3>
            <ul className="space-y-3">
              {currentStep.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-[#FFF272] mt-0.5">•</span>
                  <span><HighlightedText text={bullet.text} highlight={bullet.highlight} /></span>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="relative aspect-video overflow-hidden rounded-xl border border-slate-700/50 shadow-lg cursor-zoom-in"
            onClick={() => setExpandedImage(currentStep.img.src)}
          >
            <Image src={currentStep.img.src} alt={currentStep.img.alt} fill className="object-cover" sizes="50vw" />
          </button>
        </div>
      </div>

      {expandedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center" onClick={() => setExpandedImage(null)}>
          <div className="relative w-full max-w-5xl aspect-video">
            <Image src={expandedImage} alt="Expanded preview" fill className="object-contain" />
          </div>
        </div>
      )}
    </section>
  )
}
