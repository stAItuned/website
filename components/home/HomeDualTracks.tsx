import Link from 'next/link'

const tracks = [
  {
    title: 'Per le aziende',
    description: 'Un sales page chiaro per PMI: risolviamo problemi concreti, disegniamo servizi su misura e portiamo l’AI dalla strategia al lancio.',
    bullets: [
      'Problemi tipici PMI: dati inutilizzati, processi lenti, necessità di decisioni rapide.',
      'Servizi: consulenza strategica, prototipi di automazione, webapp a impatto reale.',
      'Come lavoriamo: sprint 2 settimane, prototipi testati in produzione con metriche chiare.',
      'Call gratuita per valutare priorità e definire next step.'
    ],
    href: '/aziende',
    cta: 'Approfondisci il percorso'
  },
  {
    title: 'Learn / Blog',
    description: 'La tua academy per sperimentare l’AI: guide pratiche, demo di webapp, newsletter e community per nerd curiosi.',
    bullets: [
      'Articoli e guide aggiornati ad ogni uscita.',
      'Webapp demo per provare i concetti sul campo.',
      'Newsletter con insight e spunti operativi.',
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
        <p className="text-sm tracking-[0.3em] text-slate-500 uppercase">Due binari chiari</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
          Chi viene per l’azienda, chi viene per la curiosità: zero confusione.
        </h2>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Le due sezioni parallele mantengono il messaggio coerente e accompagnano ogni visitatore verso il contenuto su misura per lui.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {tracks.map((track) => (
          <article
            key={track.title}
            className="relative flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-500">Sezione dedicata</p>
              <h3 className="text-2xl font-semibold text-slate-900">{track.title}</h3>
              <p className="text-slate-600 leading-relaxed">{track.description}</p>
            </div>
            <ul className="space-y-2 text-slate-600">
              {track.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm md:text-base">
                  <span aria-hidden className="text-amber-500">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Link
              href={track.href}
              className="mt-auto inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-900 hover:bg-slate-800"
            >
              {track.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
