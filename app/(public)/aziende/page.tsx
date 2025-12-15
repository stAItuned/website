import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { CallModalTrigger } from './CallModalTrigger'
import { allPosts } from '@/lib/contentlayer'
import { BusinessTicker } from './BusinessTicker'

export const dynamic = 'force-static'
export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Per le aziende - stAItuned',
  description:
    'AI pratica per PMI: in 2–6 settimane esploriamo casi d\'uso rilevanti, costruiamo un prototipo e decidiamo se scalare.',
}

const prototypeReasons = [
  'vedere se i dati che hai sono davvero sufficienti',
  'capire se il team userà davvero lo strumento, non solo sulla carta',
  'misurare un primo impatto su tempi, errori o qualità del lavoro',
  'decidere se fermarti lì, migliorare un po\' o scalare in produzione'
]

const timeline = [
  {
    title: 'Settimana 1 – Allineamento e casi d\'uso',
    items: [
      '1 call di kick-off con le persone chiave (owner del processo, IT/digital se serve)',
      'mappiamo il processo: dov\'è oggi il collo di bottiglia?',
      'raccogliamo quali dati esistono già (anche se sono sparsi: CSV, CRM, strumenti interni)',
      'scegliamo insieme 1 caso d\'uso principale + 1 di backup'
    ]
  },
  {
    title: 'Settimane 2–3 – Prototipo e iterazioni',
    items: [
      'costruiamo un prototipo di AI focalizzato sul problema scelto',
      'condividiamo una prima versione con il tuo team per feedback rapidi',
      'facciamo 1–2 cicli di aggiustamento sull\'esperienza d\'uso',
      'impostiamo 2–3 metriche semplici (es. tempo risparmiato, errori evitati, qualità percepita)'
    ]
  },
  {
    title: 'Settimane 4–6 – Decisione e roadmap leggera',
    items: [
      'ti presentiamo il prototipo finale con una demo guidata',
      'riassumiamo cosa ha funzionato, cosa no e cosa manca per andare oltre',
      'lasciamo una checklist operativa per fermarsi, migliorare o scalare con il tuo team o altri partner'
    ]
  }
]

const typicalProblems = [
  'richieste ripetitive da clienti o colleghi che ti mangiano ore ogni settimana',
  'reportistica manuale fatta copiando/incollando dati da più sistemi',
  'knowledge sparsa tra file, documenti, chat e nessuno che sa dove trovare cosa',
  'decisioni sempre urgenti che si basano su intuizione, non su fatti',
  'processi operativi che dipendono da 1–2 persone "chiave" e non sono replicabili'
]

const doList = [
  'prototipi di assistenti e copilot interni per team operativi',
  'piccole automazioni che collegano strumenti che già usi',
  'analisi di fattibilità su idee di AI emerse nel tuo team',
  'affiancamento a chi decide (founder, COO, responsabile operations/marketing)'
]

const dontList = [
  'non vendiamo "trasformazioni aziendali" generiche',
  'non entriamo nei dettagli dei tuoi contratti o dati sensibili senza motivo',
  'non sostituiamo il tuo team di sviluppo: lo aiutiamo a partire con il piede giusto',
  'non spingiamo progetti grandi se il prototipo dice chiaramente che non ha senso'
]

// Get business articles for the ticker
function getBusinessArticles() {
  return allPosts
    .filter((post) => ((post as any).business === true || post.target?.toLowerCase() === 'business') && post.published !== false)
    .sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime())
    .slice(0, 15)
    .map(post => ({
      title: post.title,
      slug: post.slug,
      cover: post.cover,
      author: post.author,
      date: post.date,
      readingTime: post.readingTime,
      target: post.target || 'business',
      language: post.language,
    }))
}

export default function AziendePage() {
  const tickerArticles = getBusinessArticles()

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto mt-[120px] mb-28 px-4 space-y-20 text-slate-900 dark:text-slate-100">
        {/* Breadcrumb */}
        <nav className="inline-flex w-fit items-center gap-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-sm dark:bg-slate-900/60 dark:border-slate-800">
          <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold dark:text-slate-100">Per le aziende</span>
        </nav>

        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.3fr,0.7fr] items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              AI pratica per PMI che vogliono risultati, non buzzword
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed dark:text-slate-200">
              In 2–6 settimane esploriamo 1–2 casi d\'uso di AI davvero rilevanti, costruiamo un prototipo e ti aiutiamo a decidere se vale la pena scalare.
            </p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed dark:text-slate-300">
              Se sei una PMI o un'azienda in crescita, probabilmente ti hanno già parlato di "trasformazione AI" in modo vago. Noi lavoriamo all'opposto: pochi casi d\'uso, problemi concreti, prototipi leggeri e metriche chiare. Ti affianchi un AI engineer con esperienza reale e usi i risultati per decidere se investire di più, senza legarti a progetti infiniti.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Durata', value: '2–6 settimane' },
                { label: 'Output', value: '1 prototipo + checklist' },
                { label: 'Impegno per te', value: '1–2 ore a settimana' }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-amber-200/50 bg-amber-50/60 px-4 py-3 text-sm shadow-sm dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-50">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">{item.label}</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3" id="mini-call">
              <CallModalTrigger className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-4 py-2 text-[13px] font-semibold text-slate-900 shadow-md transition hover:-translate-y-[1px] hover:shadow-lg dark:from-amber-400 dark:via-amber-300 dark:to-amber-400">
                Parliamone in una mini-call di 30 minuti ↗
              </CallModalTrigger>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3 dark:text-amber-300">
              Cosa succede nella call
            </p>
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              {[
                'ci racconti brevemente azienda, team e processo che ti crea più attrito',
                'facciamo 2–3 ipotesi di casi d\'uso AI realistici(niente "AI ovunque", solo dove ha senso)',
                'ti propongo uno schema di esperimento (prototipo, dati richiesti, metriche base)',
                'se alla fine non ha senso fare nulla, lo diciamo chiaramente e ti rimangono comunque le idee'
              ].map((item) => (
                <div key={item} className="flex gap-2">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Nessun funnel nascosto: l'obiettivo è aiutarti a prendere una decisione lucida se partire con un prototipo oppure no.
            </p>
          </div>
        </section>

        {/* Business Article Ticker */}
        {tickerArticles.length > 0 && (
          <section className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Articoli per decisori aziendali
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Letture pratiche su AI, automazione e decisioni per PMI
              </p>
            </div>
            <BusinessTicker articles={tickerArticles} />
          </section>
        )}

        {/* Perché prototipi */}
        <section className="space-y-5 rounded-3xl border-2 border-slate-200 bg-white/80 p-8 shadow-md dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-3xl font-bold">Perché iniziamo sempre da un prototipo</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed dark:text-slate-300">
            I progetti AI falliscono quando partono troppo grandi, troppo astratti o scollegati dai processi veri. Un prototipo ben disegnato fa il contrario: prende un problema concreto, lo collega ai dati che hai già e lo traduce in un "esperimento" che il tuo team può toccare con mano.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {prototypeReasons.map((item) => (
              <div key={item} className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                <span className="text-amber-500 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold">Come funziona un percorso di 2–6 settimane</h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed dark:text-slate-300">
              Timeline semplice: allineamento, prototipo, decisione. Ogni step consegna qualcosa di tangibile.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {timeline.map((step) => (
              <div key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                <div className="absolute -top-3 -right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold shadow-sm dark:bg-amber-900/40 dark:text-amber-200">
                  {step.title.match(/\d+/)?.[0]}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 leading-relaxed dark:text-slate-300">
                  {step.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Problemi tipici */}
        <section className="space-y-4 rounded-3xl border-2 border-slate-200 bg-white/80 p-8 shadow-md dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-3xl font-bold">Che tipo di problemi ha senso portarci</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed dark:text-slate-300">
            Non serve avere "big data" o un team AI interno. Serve solo un problema chiaro e un minimo di dati disponibili. Alcuni esempi che vediamo spesso:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {typicalProblems.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold dark:bg-amber-900/40 dark:text-amber-200">
                  AI
                </div>
                <span className="text-amber-500 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cosa facciamo / non facciamo */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Cosa facciamo – e cosa non facciamo</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-700/50 dark:bg-slate-900/70">
              <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">Cosa facciamo</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 leading-relaxed dark:text-slate-200">
                {doList.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-rose-200 bg-white p-6 shadow-sm dark:border-rose-700/50 dark:bg-slate-900/70">
              <h3 className="text-xl font-semibold text-rose-800 dark:text-rose-200">Cosa non facciamo</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 leading-relaxed dark:text-slate-200">
                {dontList.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-rose-500 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Come iniziare */}
        <section className="space-y-4 rounded-3xl border-2 border-slate-900/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl text-white dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-200">
              Prossimo passo
            </span>
            <span className="text-sm text-slate-200">Call breve, nessun impegno</span>
          </div>
          <h2 className="text-3xl font-bold">Vuoi capire se ha senso partire?</h2>
          <p className="text-base md:text-lg text-slate-200 leading-relaxed">
            Il modo più semplice per iniziare è una mini-call di 30 minuti. Ci racconti azienda, processo e problema principale; io ti faccio qualche domanda, ti propongo 1–2 possibili esperimenti e ti dico onestamente se secondo me ha senso procedere con un prototipo.
          </p>
          <p className="text-sm text-slate-200/80">
            Se alla fine della call non vediamo un caso d\'uso forte, va benissimo così: avrai una seconda opinione e qualche idea in più, senza nessun impegno.
          </p>
          <div className="flex flex-wrap gap-3">
            <CallModalTrigger className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-[13px] font-semibold text-slate-900 shadow-md transition hover:-translate-y-[1px] hover:shadow-lg">
              Prenota una mini-call ↗
            </CallModalTrigger>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
