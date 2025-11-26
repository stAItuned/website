import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { ContactCtaWithModal } from './ContactCtaWithModal'
import { allPosts } from '@/lib/contentlayer'

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
    title: 'Progetto pilota / MVP',
    description:
      'Costruiamo un progetto pilota (MVP) focalizzato: assistenti AI, automazioni o micro-webapp pensate per essere usate da persone reali, non solo demo da slide.'
  },
  {
    title: 'Da pilota a soluzione stabile',
    description:
      'Se il pilota funziona, ti aiuto a decidere se rafforzarlo e integrarlo meglio nei tuoi sistemi oppure trasformare l\'idea in un prodotto più generico (interno o pubblico).'
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
  // Get the last 3 business articles dynamically
  const businessArticles = allPosts
    .filter((post) => ((post as any).business === true || post.target?.toLowerCase() === 'business') && post.published !== false)
    .sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime())
    .slice(0, 3)
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      target: post.target?.toLowerCase() || 'business',
      description: post.meta || post.description || ''
    }))
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto mt-[120px] mb-32 px-4 space-y-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-sm">
          <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">Per le aziende</span>
        </nav>

        {/* Hero Section */}
        <section className="grid gap-12 lg:grid-cols-[1.4fr,0.6fr] items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  🚀 AI per PMI
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  ⚡ MVP in 2 settimane
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                AI strategica per PMI:
                <span className="text-amber-500 block mt-2">
                  progetti pilota rapidi che possono diventare soluzioni stabili
                </span>
              </h1>
            </div>
            <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
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
                      {/* CTA Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-3xl opacity-20 blur-xl"></div>
            <div className="relative rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-slate-50 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm uppercase tracking-[0.4em] text-amber-400 font-semibold">Call gratuita</p>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                Prenota una sessione di diagnosi (30') per valutare opportunità immediate
              </h3>
              <div className="space-y-3 text-sm text-slate-300 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Agenda chiara e priorità definite insieme</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Proposta MVP per le prossime 2 settimane</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>1–2 esperimenti concreti da iniziare subito</span>
                </div>
              </div>
              <Link
                href="#prenota-call"
                className="group relative overflow-hidden inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 text-center font-bold text-slate-900 transition-all duration-300 hover:from-amber-300 hover:to-amber-400 hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10">🚀 Prenota la call gratuita</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              <p className="text-xs text-slate-400 text-center mt-3">
                Nessun impegno • Valore immediato garantito
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
              ⚠️ Problemi comuni
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Problemi che affrontiamo ogni giorno</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Situazioni che riconosciamo in molte PMI e che limitano la crescita e l'efficienza operativa
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {problems.map((problem, index) => (
              <div key={problem} className="group relative rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-md hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-slate-900 leading-relaxed">{problem}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
              🛠️ I nostri servizi
            </div>
            <h3 className="text-4xl font-bold text-slate-900">Cosa facciamo insieme</h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Portfolio snello e focalizzato: pochi servizi ben definiti che vanno dalla diagnosi al rilascio di un primo MVP in 2 settimane.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <article key={service.title} className="group relative space-y-4 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">{service.title}</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="w-6 h-6 bg-blue-500 rounded rotate-12"></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* <ExamplesSection /> */}

        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="bg-amber-100 text-amber-600 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
              💡 Esempi concreti
            </div>
            <h3 className="text-4xl font-bold text-slate-900">Soluzioni che possiamo costruire insieme</h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Progetti reali che hanno già generato valore tangibile per PMI simili alla tua
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {solutionExamples.map((example, index) => (
              <article key={example.title} className="group relative space-y-6 rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-lg hover:-translate-y-1">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xl font-bold text-slate-900 leading-tight">{example.title}</h4>
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{example.description}</p>
                </div>
                <ul className="space-y-3 text-sm">
                  {example.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 items-start">
                      <span className="text-amber-500 text-lg mt-0.5">✓</span>
                      <span className="text-slate-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 bg-slate-50 px-3 py-2 rounded-full">
                    {example.footer}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
              📋 Portfolio completo
            </div>
            <h3 className="text-4xl font-bold text-slate-900">Soluzioni per ogni area del business</h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Catalogo strutturato di interventi AI che coprono tutte le principali funzioni aziendali
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {catalogItems.map((item, index) => (
              <article key={item.title} className="group relative space-y-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                </div>
                <ul className="space-y-3">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 items-start">
                      <span className="text-purple-500 text-lg mt-0.5">▸</span>
                      <span className="text-slate-700 leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>


        {/* Articoli per decisori */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300 shadow-sm">
              Articoli per decisori PMI
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Articoli per la tua azienda</h3>
            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
              Una selezione di articoli pensati per imprenditori, CEO e responsabili di funzione. Tutti nascono da casi reali che abbiamo affrontato con le PMI.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {businessArticles.map((article, index) => (
              <article
                key={article.slug}
                className="group relative flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h4 className="text-lg font-bold text-slate-900 leading-tight">{article.title}</h4>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed flex-1">{article.description}</p>
                <Link
                  href={`/learn/${article.target}/${article.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-600"
                >
                  Leggi l’articolo
                  <span aria-hidden className="text-base">→</span>
                </Link>
              </article>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/learn?target=business"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-md transition hover:bg-amber-400"
            >
              Vedi tutti gli articoli business
              <span aria-hidden className="text-base">→</span>
            </Link>
          </div>
        </section>

        {/* stAItuned Lab Box */}
        <section className="space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-10 shadow-lg">
          <div className="text-center space-y-4">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2">
              💡 stAItuned Lab
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
              Talenti junior, qualità senior
            </h3>
          </div>
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-700 leading-relaxed">
            <p>
              Alcuni dei nostri progetti sono supportati da un piccolo gruppo di <strong>junior selezionati</strong>, formati direttamente sui nostri standard e <strong>supervisionati in ogni fase</strong>.
            </p>
            <p>
              Questo ci permette di <strong>muoverci velocemente</strong>, mantenere <strong>alta la qualità</strong> e far crescere nuove persone nel mondo AI, senza compromessi sull'output per la tua azienda.
            </p>
            <p className="text-base text-slate-600 italic border-l-4 border-blue-400 pl-4">
              La responsabilità finale e il controllo qualità restano sempre in capo al team senior. Per te cambia solo il ritmo di delivery e il costo del progetto.
            </p>
          </div>
        </section>
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
              🚀 Metodologia provata
            </div>
            <h3 className="text-4xl font-bold text-slate-900">Come lavoriamo insieme</h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Un processo strutturato e trasparente che porta dalla diagnosi alla demo funzionante in 2 settimane
            </p>
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
