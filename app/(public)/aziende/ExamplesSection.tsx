type Example = {
  title: string
  tag: string
  description: string
  bullets: string[]
}

const EXAMPLES: Example[] = [
  {
    title: 'Assistente AI per il team commerciale',
    tag: 'Vendite & CRM',
    description:
      'Un assistente che legge email, note e storico delle trattative dal CRM e aiuta il team a muoversi più veloce.',
    bullets: [
      'Suggerisce il prossimo passo per ogni opportunità.',
      'Prepara risposte personalizzate in pochi secondi.',
      'Aggiorna automaticamente il CRM dopo ogni interazione.'
    ]
  },
  {
    title: 'Raccomandazioni 1-to-1 per e-commerce di nicchia',
    tag: 'Raccomandazione 1-to-1',
    description:
      'Un motore che usa dati di navigazione e acquisto per proporre prodotti e contenuti su misura.',
    bullets: [
      'Consigli di prodotti affini e complementari.',
      'Bundle personalizzati per aumentare il valore medio carrello.',
      'Contenuti utili per far tornare il cliente sul sito.'
    ]
  },
  {
    title: 'Cruscotto intelligente per studi e aziende di servizi',
    tag: 'Operation & Produttività',
    description:
      'Una vista unica che raccoglie email, documenti, ticket e note interne, con ricerca intelligente.',
    bullets: [
      'Riassume in pochi secondi conversazioni e casistiche.',
      'Trova info chiave senza cercare in mille tool diversi.',
      'Genera draft di report, verbali e risposte in pochi click.'
    ]
  }
]

const CATEGORIES = [
  {
    title: 'Operation & produttività interna',
    items: [
      'Assistenti AI per operation, customer care, amministrazione.',
      'Automazioni per ridurre copiaincolla e attività manuali.',
      'Cruscotti intelligenti per avere una vista unica su priorità e anomalie.'
    ]
  },
  {
    title: 'Marketing & contenuti',
    items: [
      'Generazione assistita di contenuti guidata dai tuoi dati.',
      'Segmentazione dinamica del pubblico e messaggi su misura.',
      'Analisi automatica delle campagne con suggerimenti di ottimizzazione.'
    ]
  },
  {
    title: 'Vendite & customer experience',
    items: [
      'Sistemi di raccomandazione 1-to-1 per prodotti, contenuti o servizi.',
      'Assistenti AI che supportano il commerciale prima/durante/dopo le call.',
      'Strumenti per seguire il cliente lungo tutto il ciclo di vita.'
    ]
  },
  {
    title: 'Finanza & controllo di gestione',
    items: [
      'Report semi-automatici a partire dai dati esistenti.',
      'Analisi di scenari “what-if” supportata da AI.',
      'Alert intelligenti su costi, margini, ritardi e anomalie.'
    ]
  }
]

export function ExamplesSection() {
  return (
    <section id="esempi-soluzioni" className="border-t border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Esempi di soluzioni AI
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Cosa può fare l&apos;AI, concretamente, nella tua PMI
          </h2>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            Ogni progetto è su misura, ma i pattern si ripetono. Qui trovi tre esempi di{' '}
            <span className="font-semibold text-amber-600">soluzioni pronte da usare</span> che possiamo costruire rapidamente partendo dai tuoi dati e dai tool che usi già.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {EXAMPLES.map((example) => (
            <article
              key={example.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>{example.tag}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 sm:text-lg">{example.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{example.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {example.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-[6px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-slate-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-10">
          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">Catalogo di soluzioni</h3>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Partiamo sempre da un{' '}
            <span className="font-semibold text-amber-600">MVP in circa 2 settimane</span>, ma le direzioni possibili si concentrano in poche categorie ricorrenti.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {CATEGORIES.map((category) => (
              <div key={category.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h4 className="text-sm font-semibold text-slate-900 sm:text-base">{category.title}</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {category.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[7px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-slate-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
