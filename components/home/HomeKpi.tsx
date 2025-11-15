export function HomeKpi() {
  const stats = [
    {
      value: '10k+',
      label: 'letture degli articoli',
      description: 'Contenuti su AI e Machine Learning letti da studenti, professionisti e aziende.'
    },
    {
      value: '40+',
      label: 'articoli pubblicati',
      description: 'Dalle basi all’expert: guide, casi d’uso e approfondimenti tecnici.'
    },
    {
      value: '3k+',
      label: 'iscritti alla newsletter / community',
      description: 'Persone che vogliono portare l’AI nel lavoro di tutti i giorni.'
    },
    {
      value: '5+',
      label: 'anni di contenuti su AI',
      description: 'Esperienza accumulata su progetti reali, non solo teoria.'
    },
  ]

  return (
    <section className="max-w-7xl mx-auto mt-8 px-4 sm:mt-12">
      <div className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">stAItuned in numeri</p>
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 sm:text-4xl">
          Una community che vive di contenuti e sperimentazione su AI.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="space-y-3 rounded-3xl border border-slate-100/80 bg-white/80 p-6 text-center shadow-sm transition hover:border-slate-200 dark:border-slate-800 hover:shadow-lg dark:bg-slate-900/70"
          >
            <p className="text-4xl font-semibold text-slate-900 dark:text-slate-50">{stat.value}</p>
            <p className="text-lg font-semibold text-amber-500">{stat.label}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
