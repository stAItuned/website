import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { AziendeUseCases } from './AziendeUseCases'
import { AziendeNotForYou } from './AziendeNotForYou'
import { AziendeMetrics } from './AziendeMetrics'
import { AziendeAuthority } from './AziendeAuthority'
import { AziendeScreenshots } from './AziendeScreenshots'
import { AziendePricing } from './AziendePricing'
import { AziendeFAQ } from './AziendeFAQ'
import { AziendeAfterPilot } from './AziendeAfterPilot'
import { AziendePathSelector } from './AziendePathSelector'
import { AziendeTimeline } from './AziendeTimeline'
import { AziendeStickyFooter } from './AziendeStickyFooter'
import { HomeUrgencyBar } from '@/components/home/HomeUrgencyBar'

export const dynamic = 'force-static'
export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Per le aziende - stAItuned',
  description:
    'Basta copia-incolla da documenti, perdendo ore a correggere errori manuali. Con DocuRoute + DocuExtract, smista e estrai dati da documenti in poche settimane.',
}

export default function AziendePage() {
  return (
    <PageTransition>
      {/* Urgency bar at top */}
      <HomeUrgencyBar />

      <div className="max-w-5xl mx-auto mt-24 mb-32 px-4 space-y-12 text-slate-900 dark:text-slate-100">
        {/* === HERO === */}
        <section className="space-y-6">
          {/* Headline with visual hierarchy */}
          <div className="space-y-3">
            {/* Pain point - crossed out */}
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400">
              <span className="line-through decoration-rose-400 decoration-2">
                Copia-incolla da documenti, ore perse a correggere errori manuali.
              </span>
            </p>

            {/* Solution headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                Smista e estrai dati
              </span>
              <br className="hidden sm:block" />
              <span className="text-slate-900 dark:text-white"> dai tuoi documenti.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
              <strong className="text-slate-900 dark:text-white">DocuRoute + DocuExtract:</strong>{' '}
              da Email/PEC/cartelle al gestionale, con metriche verificabili.
            </p>
          </div>

          {/* Timeline pills inline */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold dark:bg-amber-900/50 dark:text-amber-200">
              📋 10 giorni Assessment
            </span>
            <span className="text-slate-400">→</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold dark:bg-emerald-900/50 dark:text-emerald-200">
              🚀 4 settimane Pilot
            </span>
          </div>

          {/* Value props */}
          <ul className="space-y-2 text-base text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
              <span className="text-emerald-500 flex-shrink-0">✓</span>
              <span><strong>DocuRoute:</strong> smista Email/PEC e allegati (cliente/commessa/tipo)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500 flex-shrink-0">✓</span>
              <span><strong>DocuExtract:</strong> estrae dati e genera export CSV/Excel</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500 flex-shrink-0">✓</span>
              <span><strong>Audit log + review umana</strong> solo quando serve</span>
            </li>
          </ul>

          {/* Value line */}
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            Risultato tipico: meno tempo operativo, meno errori, e tracciabilità (audit) per controlli e team.
          </p>

          {/* In breve (3 pill) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Durata', value: '5–6 settimane' },
              { label: 'Output', value: 'Pilot + scorecard' },
              { label: 'Impegno', value: '1–2 ore/sett' }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-amber-200/50 bg-amber-50/60 px-4 py-3 text-sm shadow-sm dark:border-amber-700/40 dark:bg-amber-900/20">
                <p className="text-[11px] uppercase tracking-[0.15em] text-amber-700 dark:text-amber-200">{item.label}</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === PATH SELECTOR === */}
        <AziendePathSelector />

        {/* === TIMELINE === */}
        <AziendeTimeline />

        {/* === USE CASES === */}
        <AziendeUseCases />

        {/* === PACCHETTI === */}
        <AziendePricing />

        {/* === SCREENSHOTS (tabbed) === */}
        <AziendeScreenshots />

        {/* === COME MISURIAMO === */}
        <AziendeMetrics />

        {/* === AUTORITÀ === */}
        <AziendeAuthority />

        {/* === FIT / NOT FIT === */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Buon fit */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-800/50 dark:bg-emerald-950/20">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-3">✅ Buon fit se...</h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <span>Hai un processo lento/errore-prono (documenti, workflow)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <span>Hai almeno un minimo di dati (PDF, email, cartelle)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <span>Vuoi un pilot breve con metriche, non &quot;AI ovunque&quot;</span>
              </li>
            </ul>
          </div>

          {/* Not for you */}
          <AziendeNotForYou />
        </div>

        {/* === DOPO IL PILOT === */}
        <AziendeAfterPilot />

        {/* === FAQ === */}
        <AziendeFAQ />
      </div>

      {/* === STICKY FOOTER CTA === */}
      <AziendeStickyFooter />
    </PageTransition >
  )
}
