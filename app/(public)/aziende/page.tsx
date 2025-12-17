import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { CallModalTrigger } from './CallModalTrigger'
import { AziendeUseCases } from './AziendeUseCases'
import { AziendeNotForYou } from './AziendeNotForYou'
import { AziendeMetrics } from './AziendeMetrics'
import { AziendeAuthority } from './AziendeAuthority'
import { AziendeProofPack } from './AziendeProofPack'
import { AziendeUrgencyBox } from './AziendeUrgencyBox'
import { AziendePricing } from './AziendePricing'
import { AziendeFAQ } from './AziendeFAQ'
import { AziendeCTAFinale } from './AziendeCTAFinale'
import { HomeUrgencyBar } from '@/components/home/HomeUrgencyBar'

export const dynamic = 'force-static'
export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Per le aziende - stAItuned',
  description:
    'AI pratica per PMI: DocAI e automazioni su documenti e workflow. Assessment 10 giorni + Pilot 4 settimane con metriche chiare.',
}

export default function AziendePage() {
  // Dynamic next month for urgency
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const nextMonthName = nextMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
  const capitalizedMonth = nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1)

  return (
    <PageTransition>
      {/* Urgency bar at top */}
      <HomeUrgencyBar />

      <div className="max-w-5xl mx-auto mt-[120px] mb-28 px-4 space-y-12 text-slate-900 dark:text-slate-100">
        {/* Breadcrumb */}
        <nav className="inline-flex w-fit items-center gap-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm dark:bg-slate-900/60 dark:border-slate-800">
          <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold dark:text-slate-100">Per le aziende</span>
        </nav>

        {/* === HERO (sintetico) === */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              AI pratica per PMI: pilot su dati reali, risultati misurabili.
            </h1>
            <p className="text-lg text-slate-700 leading-relaxed dark:text-slate-300">
              In <strong>10 giorni</strong> scegliamo il caso d&apos;uso migliore. In <strong>4 settimane</strong>{' '}
              costruiamo un Pilot end-to-end (DocAI + workflow + UI) con metriche chiare.
            </p>
          </div>

          {/* Value props */}
          <ul className="space-y-2 text-base text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
              <span className="text-emerald-500 flex-shrink-0">✓</span>
              <span><strong>Niente buzzword:</strong> pochi casi d&apos;uso, problemi concreti, scope definito</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500 flex-shrink-0">✓</span>
              <span><strong>Qualità verificabile:</strong> eval + guardrail + audit log + human-in-the-loop</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500 flex-shrink-0">✓</span>
              <span><strong>Output usabile:</strong> dashboard + export + controlli (non un notebook)</span>
            </li>
          </ul>

          {/* CTA + Urgency badge */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center" id="mini-call">
            <CallModalTrigger className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 text-base font-bold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900">
              Candidati per uno slot (15 min) →
            </CallModalTrigger>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p>Risposta entro 48 ore. Se non c&apos;è fit, te lo diciamo subito.</p>
            </div>
          </div>

          {/* Urgency badge inline */}
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-slate-100">2 slot Pilot/mese</strong> per garantire qualità.{' '}
              <span className="text-amber-700 dark:text-amber-300">Prossimo avvio: {capitalizedMonth}</span>
            </span>
          </div>

          {/* In breve (3 pill) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Durata', value: '5–6 settimane' },
              { label: 'Output', value: '1 Pilot + scorecard + roadmap' },
              { label: 'Impegno per te', value: '1–2 ore/settimana' }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-amber-200/50 bg-amber-50/60 px-4 py-3 text-sm shadow-sm dark:border-amber-700/40 dark:bg-amber-900/20">
                <p className="text-[11px] uppercase tracking-[0.15em] text-amber-700 dark:text-amber-200">{item.label}</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === USE CASES === */}
        <AziendeUseCases />

        {/* === PACCHETTI (presto!) === */}
        <AziendePricing />

        {/* === URGENCY BOX === */}
        <AziendeUrgencyBox />

        {/* === PROOF PACK === */}
        <AziendeProofPack />

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
                <span>Hai un processo lento/errore-prono (documenti, workflow, knowledge)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <span>Hai almeno un minimo di dati (PDF, email, cartelle, export gestionale)</span>
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

        {/* === FAQ === */}
        <AziendeFAQ />

        {/* === CTA FINALE === */}
        <AziendeCTAFinale />
      </div>
    </PageTransition>
  )
}
