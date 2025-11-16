import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { ExamplesSection } from './ExamplesSection'
import { ContactCtaWithModal } from './ContactCtaWithModal'

export const dynamic = 'force-static'
export const revalidate = 21600 // every 6 hours (60 * 60 * 6)

export const metadata: Metadata = {
  title: 'Per le aziende - stAItuned',
  description: 'Soluzioni AI per PMI e professionisti: dalla strategia all’automazione delle operazioni, con prototipi funzionanti e call gratuita di valutazione.',
}

const problems = [
  'Dati sparsi (CRM, gestionale, e-commerce) che non si trasformano in decisioni o azioni concrete.',
  'Processi manuali che consumano tempo, generano errori e non sono misurati.',
  'Nessuna figura con competenze di AI e GenAI che parli sia la lingua del business che quella tecnica, senza dover passare per grandi consulenze.',
  'Prototipi isolati che non arrivano mai in produzione o non si integrano con i sistemi esistenti.',
  'Difficoltà a costruire esperienze 1-to-1 per i clienti: raccomandazioni, contenuti, offerte davvero personalizzate.'
]

const services = [
  {
    title: 'Assessment strategico',
    description:
      'Analizziamo processi e dati, individuiamo opportunità immediate e definiamo 1–3 casi d’uso prioritari, con metriche condivise.'
  },
  {
    title: 'Prototipi e soluzioni AI pronte all’uso',
    description:
      'Costruiamo MVP AI funzionanti (assistenti AI, automazioni, sistemi di raccomandazione 1-to-1, cruscotti intelligenti) già pensati per integrarsi con i sistemi che usi oggi.'
  },
  {
    title: 'Delivery & mentoring',
    description:
      'Affianco il team nei primi sprint di rilascio: monitoriamo KPI, raccogliamo feedback e trasferisco le competenze necessarie per far evolvere la soluzione in autonomia.'
  }
]

const solutionExamples = [
  {
    title: 'Assistente AI per il team commerciale',
    description:
      'Un assistente che legge email, note e storico delle trattative nel CRM e ti aiuta a gestire ogni opportunità rapidamente.',
    bullets: [
      'Prepara risposte personalizzate in pochi secondi.',
      'Suggerisce il prossimo passo per ogni deal.',
      'Aggiorna automaticamente il CRM dopo ogni interazione.'
    ],
    footer:
      'Pensato per PMI con pochi commerciali che coprono tutto il ciclo: dalla prima risposta fino alla firma.'
  },
  {
    title: 'Raccomandazioni 1-to-1 per e-commerce di nicchia',
    description:
      'Un motore che unisce dati di navigazione, acquisti e preferenze per proporre prodotti, contenuti e offerte personalizzate.',
    bullets: [
      'Suggerisce prodotti affini e bundle pensati per ciascun cliente.',
      'Propone contenuti utili per far tornare l’utente.',
      'Aumenta il valore medio del carrello e la retention.'
    ],
    footer: 'Ideale per verticali come moda, sport, hobby e prodotti tecnici.'
  },
  {
    title: 'Cruscotto intelligente per studi e team di servizi',
    description:
      'Una vista unica su email, documenti e ticket per riassumere conversazioni e trovare informazioni chiave senza caos.',
    bullets: [
      'Riassume rapidamente casi e conversazioni con i clienti.',
      'Trova informazioni chiave senza cercare in mille posti.',
      'Genera draft di report, verbali e risposte in pochi click.'
    ],
    footer:
      'Perfetto per studi professionali, agenzie e piccole aziende dove il know-how è distribuito tra più persone.'
  }
]

const catalogItems = [
  {
    title: 'Operation & produttività interna',
    bullets: [
      'Assistenti AI per team operation, customer care e amministrazione.',
      'Automazioni per ridurre attività manuali e copia/incolla tra tool.',
      'Cruscotti intelligenti che aggregano stato, priorità e anomalie.'
    ]
  },
  {
    title: 'Marketing & contenuti',
    bullets: [
      'Generazione assistita di contenuti (email, post, schede prodotto) guidata dai tuoi dati.',
      'Segmentazione dinamica del pubblico e messaggi su misura.',
      'Analisi automatica delle campagne con suggerimenti di ottimizzazione.'
    ]
  },
  {
    title: 'Vendite & customer experience',
    bullets: [
      'Sistemi di raccomandazione 1-to-1 per prodotti, contenuti o servizi.',
      'Assistenti AI che supportano il commerciale prima, durante e dopo le call.',
      'Strumenti per seguire il cliente lungo tutto il ciclo di vita.'
    ]
  },
  {
    title: 'Finanza & controllo di gestione',
    bullets: [
      'Reportistica semi-automatica da gestionale, fogli di calcolo e tool di fatturazione.',
      'Analisi di scenari “what-if” supportata da AI.',
      'Alert intelligenti su KPI critici (costi, margini, ritardi, anomalie).'
    ]
  }
]

const steps = [
  {
    title: '1. Diagnosi rapida',
    description: 'Call gratuita per capire obiettivi, ritmi e criticità, con una mappa delle priorità e 1–2 esperimenti concreti da cui partire.'
  },
  {
    title: '2. Proposta concreta',
    description: 'Piano operativo con milestone, deliverable e risultati attesi. Indichiamo da subito quale MVP ha senso consegnare in 2 settimane.'
  },
  {
    title: '3. Sviluppo + validazione',
    description: 'Sprint agili per arrivare a una demo/MVP funzionante in 2 settimane: test sul campo con persone reali, feedback e adattamenti in tempo reale.'
  },
  {
    title: '4. Supporto continuo',
    description: 'Monitoraggio, documentazione e sessioni di mentoring per scalare la soluzione e integrarla nei sistemi che usi.'
  }
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
            <p className="text-xs uppercase tracking-[0.5em] text-amber-400">AI per PMI · MVP in 2 settimane</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900">
              AI strategica per PMI: dal problema al primo MVP in 2 settimane
            </h1>
            <div className="space-y-3 text-lg text-slate-700 leading-relaxed">
              <p>
                <strong>StAItuned</strong> affianca <strong>PMI e aziende in crescita</strong> come <strong>AI Strategy & Product Lead</strong>. Insieme capiamo quali processi hanno più margine di miglioramento, quali dati stai già producendo e quali soluzioni di <strong>AI e GenAI</strong> hanno senso per il tuo contesto.
              </p>
              <p>
                Dai <strong>sistemi di raccomandazione 1-to-1</strong> agli <strong>assistenti AI per il team</strong>, dalle <strong>automazioni operative</strong> ai <strong>cruscotti intelligenti</strong>, l’obiettivo è trasformare idee e slide in <strong>soluzioni pronte all’uso</strong>, con metriche chiare e integrazione nei sistemi che usi già.
              </p>
              <p>
                Il primo passo è sempre lo stesso: una <strong>demo/MVP funzionante in circa 2 settimane</strong>, da far provare subito a persone reali.
              </p>
            </div>
          </div>
            <div className="rounded-3xl border border-white/60 bg-slate-900 p-8 text-slate-50 shadow-2xl">
              <p className="text-sm uppercase tracking-[0.4em] text-amber-400">Call gratuita</p>
              <p className="mt-4 text-lg font-semibold text-white">
                Prenota una sessione di diagnosi (30’) per valutare opportunità immediate.
              </p>
              <p className="mt-3 text-sm text-slate-300 space-y-2">
                <span>
                  Ti mando un’agenda chiara, capiamo insieme le priorità e ti propongo quale MVP possiamo portare in mano al tuo team nelle prossime 2 settimane.
                </span>
                <span>
                  In uscita dalla call hai 1–2 esperimenti concreti da poter iniziare subito, con una stima dei tempi per arrivare alla prima demo funzionante.
                </span>
              </p>
            <Link
              href="#prenota-call"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Prenota la call gratuita
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
              Portfolio snello e focalizzato: pochi servizi ben definiti che vanno dalla diagnosi al rilascio di un primo MVP in 2 settimane.
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

        <ExamplesSection />

        <section className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Esempi di soluzioni AI</p>
            <h3 className="text-3xl font-semibold text-slate-900">Esempi concreti che possiamo costruire insieme</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {solutionExamples.map((example) => (
              <article key={example.title} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-xl font-semibold text-slate-900">{example.title}</h4>
                <p className="text-sm text-slate-600">{example.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {example.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden className="text-amber-500">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{example.footer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Catalogo di soluzioni</p>
            <h3 className="text-3xl font-semibold text-slate-900">Portfolio strutturato per ogni area del business</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {catalogItems.map((item) => (
              <article key={item.title} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h4 className="text-xl font-semibold text-slate-900">{item.title}</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden className="text-amber-500">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
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
          <p className="text-sm text-slate-600 max-w-3xl">
            La velocità non viene da “scorciatoie magiche”, ma da esperienza su progetti AI reali, uso intensivo di AI e GenAI anche nei nostri workflow e un focus radicale su pochi casi d’uso alla volta.
          </p>
        </section>

        <ContactCtaWithModal />
      </div>
    </PageTransition>
  )
}
