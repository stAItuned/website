import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'

export const dynamic = 'force-static'
export const revalidate = 21600 // every 6 hours (60 * 60 * 6)

export const metadata: Metadata = {
  title: 'Per le aziende - stAItuned',
  description: 'Soluzioni AI per PMI e professionisti: dalla strategia all’automazione delle operazioni, con prototipi funzionanti e call gratuita di valutazione.',
}

const problems = [
  'Dati sparsi e poco utilizzati per decisioni strategiche.',
  'Processi manuali che richiedono tempo e generano errori.',
  'Mancanza di figure con competenze AI dehors dalle grandi consulenze.',
  'Difficoltà nel tradurre prototipi in servizi stabili e monitorati.',
]

const services = [
  {
    title: 'Assessment strategico',
    description: 'Analizziamo i processi dati, individuiamo opportunità immediate e definiamo metriche condivise.'
  },
  {
    title: 'Prototipi e webapp',
    description: 'Costruiamo MVP funzionanti (chatbot, automazioni, pipeline) pronti per essere testati con utenti reali.'
  },
  {
    title: 'Delivery & mentoring',
    description: 'Affianchiamo il team nei primi sprint di rilascio, monitoriamo i KPI e trasferiamo le competenze necessarie.'
  },
]

const steps = [
  {
    title: '1. Diagnosi rapida',
    description: 'Call gratuita per capire obiettivi, ritmi e criticità, con mappa delle priorità.'
  },
  {
    title: '2. Proposta concreta',
    description: 'Piano operativo con milestone, deliverable e risultati attesi.'
  },
  {
    title: '3. Sviluppo + validazione',
    description: 'Sprint agili, test sul campo, feedback e adattamenti in tempo reale.'
  },
  {
    title: '4. Supporto continuo',
    description: 'Monitoraggio, documentazione e sessioni di mentoring per scalare la soluzione.'
  },
]

export default function AziendePage() {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto mt-[150px] mb-32 px-4 space-y-16">
        <nav className="flex items-center gap-3 text-sm font-semibold text-primary-500 bg-slate-100 px-6 py-4 rounded-xl">
          <Link href="/" className="opacity-60 hover:opacity-100">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900">Per le aziende</span>
        </nav>

        <section className="grid gap-10 lg:grid-cols-[1.3fr,0.7fr] items-start">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Sales page</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900">
              Risolvo problemi reali con l’AI per PMI e professionisti che vogliono entrare nel digitale moderno.
            </h1>
            <p className="text-lg text-slate-700 leading-relaxed">
              Aiuto team con budget reali a capire quali automazioni conviene lanciare, come orchestrare dati e processi, e quali webapp costruire per scalare i servizi.
            </p>
            <p className="text-sm text-slate-500 max-w-3xl">
              Lavoro fianco a fianco con leader di PMI e product team per trasformare insight in strumenti funzionanti, con metriche di impatto chiare e iterazioni rapide.
            </p>
          </div>
          <div className="rounded-3xl border border-white/60 bg-slate-900 p-8 text-slate-50 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-400">Call gratuita</p>
            <p className="mt-4 text-lg font-semibold text-white">
              Prenota una sessione di diagnosi (30’) per valutare opportunità immediate.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Ti mando un’agenda chiara, capiamo insieme le priorità e ti propongo un piano di lavoro con tempi e risultati misurabili.
            </p>
            <Link
              href="mailto:hello@staituned.com"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Scrivimi per prenotare
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-slate-900">Problemi che affrontiamo ogni giorno</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {problems.map((problem) => (
              <div key={problem} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-semibold text-slate-900">{problem}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Servizi</p>
              <h3 className="text-3xl font-semibold text-slate-900">Cosa facciamo insieme</h3>
            </div>
            <p className="text-sm text-slate-500 max-w-xl">
              Portfolio snello e focalizzato: pochi servizi ben definiti che vanno dal concept al rilascio.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h4 className="text-xl font-semibold text-slate-900">{service.title}</h4>
                <p className="text-sm text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Processo</p>
            <h3 className="text-3xl font-semibold text-slate-900">Come lavoriamo</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <article key={step.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">{step.title}</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-900">{step.description}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center">
          <h3 className="text-3xl font-semibold text-slate-900">Pronto a trasformare l’AI in valore?</h3>
          <p className="mt-3 text-slate-700">
            Ti propongo un piano personalizzato, anche se vuoi solo capire da dove partire. La call iniziale è gratuita e serve a mettere sul tavolo idee concrete.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="mailto:hello@staituned.com"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Prenota la call gratuita
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Torna alla homepage
            </Link>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
