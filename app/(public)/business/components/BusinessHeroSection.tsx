import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { BusinessTranslations } from '@/lib/i18n/business-translations'
import { OpenBusinessRequestButton } from './OpenBusinessRequestButton'

function renderHighlightedText(text: string, highlights: string[]) {
  if (!highlights.length) return text

  const normalizedHighlights = highlights
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (!normalizedHighlights.length) return text

  const pattern = new RegExp(`(${normalizedHighlights.join('|')})`, 'gi')
  const segments = text.split(pattern)

  return segments.map((segment, index) => {
    const isHighlight = highlights.some((item) => item.toLowerCase() === segment.toLowerCase())

    if (!isHighlight) return <span key={`${segment}-${index}`}>{segment}</span>

    return (
      <span
        key={`${segment}-${index}`}
        className="font-semibold text-white sm:bg-gradient-to-r sm:from-[#FFF272] sm:via-[#FCD34D] sm:to-[#F59E0B] sm:bg-clip-text sm:text-transparent"
      >
        {segment}
      </span>
    )
  })
}

export function BusinessHeroSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/10 pt-24 md:pt-28">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute top-1/3 left-1/6 h-72 w-72 rounded-full bg-primary-400/15 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-[#FFF272]/10 blur-3xl" />
      <div className="absolute top-1/2 right-1/6 h-40 w-40 rounded-full bg-[#F59E0B]/15 blur-2xl" />

      <div className="relative mx-auto max-w-5xl px-4 pb-16 xs:px-6 lg:pb-20">
        <div className="mx-auto max-w-4xl space-y-8 text-center lg:space-y-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              {t.hero.badge}
            </span>
          </div>

          <nav className="flex items-center justify-center gap-2 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-amber-300">
              {t.breadcrumb.home}
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden />
            <span className="font-medium text-slate-200">{t.breadcrumb.business}</span>
          </nav>

          <div className="space-y-6 lg:space-y-7">
            <h1 className="text-3xl font-black leading-[1.04] tracking-tight text-white xs:text-4xl lg:text-6xl">
              {t.hero.title}{' '}
              <span className="bg-gradient-to-r from-[#FFF272] via-[#FCD34D] to-[#F59E0B] bg-clip-text text-transparent">
                {t.hero.highlight}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300 xs:text-lg">
              {renderHighlightedText(t.hero.subtitle, t.hero.subtitleHighlights)}
            </p>
            <p className="mx-auto max-w-[52rem] rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-5 text-sm font-medium leading-8 text-slate-100 backdrop-blur-sm xs:text-base">
              {t.hero.positioning}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-center sm:gap-4">
            <a
              href="#workflow"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] px-5 py-3.5 text-sm font-bold text-[#1A1E3B] shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              {t.hero.primaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <OpenBusinessRequestButton
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              {t.hero.secondaryCta}
            </OpenBusinessRequestButton>
          </div>

          <ul className="grid gap-4 pt-2 text-left md:grid-cols-3">
            {t.hero.trustSignals.map((item) => (
              <li
                key={item.title}
                className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.03)_100%)] px-5 py-5 backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">{item.title}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-200">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
