import Link from 'next/link'

const tracks = [
  {
    title: 'Per le aziende',
    description:
      'Un sales page chiaro per PMI e aziende in crescita: partiamo dalla strategia, selezioniamo i casi d’uso giusti e in 2 settimane mettiamo nelle mani del tuo team una demo/MVP AI funzionante.',
    bullets: [
      'Problemi tipici PMI: dati inutilizzati, processi lenti, clienti poco ingaggiati.',
      'Soluzioni: assistenti AI per il team, automazioni e sistemi di raccomandazione 1-to-1, micro-webapp integrabili nei sistemi esistenti.',
      'Come lavoriamo: sprint brevi da 2 settimane, metriche definite prima di iniziare, iterazioni rapide.',
      'Call gratuita per capire da dove partire e stimare il primo MVP.'
    ],
    href: '/aziende',
    cta: 'Approfondisci il percorso'
  },
  {
    title: 'Learn / Blog',
    description:
      'La tua academy per sperimentare AI e GenAI: guide pratiche, demo di webapp, newsletter e community per nerd curiosi e professionisti.',
    bullets: [
      'Articoli e guide su AI e GenAI aggiornati ad ogni uscita.',
      'Webapp demo e mini-tool per provare i concetti sul campo.',
      'Newsletter con insight e spunti operativi da portare nel lavoro.',
      'Spazio aperto per domande, commenti e suggerimenti.'
    ],
    href: '/learn',
    cta: 'Vai al blog e sperimenta'
  }
]

export function HomeDualTracks() {
  return (
    <section className="max-w-7xl mx-auto mt-12 px-4 py-16 space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-sm tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase">Due binari chiari</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-slate-50">
          Chi viene per l’azienda, chi viene per la curiosità: zero confusione.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          stAItuned è sia partner strategico per PMI che vogliono portare l’AI nei processi, sia community e blog per chi vuole imparare e sperimentare.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {tracks.map((track) => (
          <article
            key={track.title}
            className="relative flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/60"
          >
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-500">Sezione dedicata</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{track.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{track.description}</p>
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              {track.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm md:text-base">
                  <span aria-hidden className="text-amber-500">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Link
              href={track.href}
              className="mt-auto inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-900 hover:bg-slate-800 dark:border-white/40 dark:bg-white dark:text-slate-900 dark:hover:border-white dark:hover:bg-slate-100"
            >
              {track.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
