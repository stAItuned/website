import Link from 'next/link'
import Image from 'next/image'

const tracks = [
  {
    title: 'Per le aziende',
    eyebrow: 'PMI · Strategia & MVP',
    description:
      'Percorsi brevi (2–6 settimane) per esplorare l’uso dell’AI su problemi concreti della tua PMI. Lavoriamo su pochi casi d’uso mirati, costruendo prototipi e demo che ti aiutano a decidere se ha senso fare un passo in più',
    bullets: [
      "Problemi tipici: dati sparsi, processi lenti, clienti poco ingaggiati",
      "Cosa facciamo: analizziamo il contesto, proponiamo idee e costruiamo un primo prototipo di AI",
      "Approccio: sprint brevi, metriche definite prima di iniziare",
      "Outcome: demo funzionante + checklist per decidere se e come procedere verso un progetto più grande",
    ],
    href: '/aziende',
    primaryCta: 'Scopri il percorso aziende',
    secondaryCta: { label: 'Prenota mini-call', href: '/aziende#prenota-call' },
    accent: 'amber'
  },
  {
    title: 'Learn / Blog',
    eyebrow: 'Academy · Sperimenta AI',
    description:
      'Articoli pratici, mini-demo di webapp e strumenti leggeri per portare l’AI nelle decisioni di tutti i giorni. I contenuti nascono da esperienze reali sul campo, da prototipi che testiamo e dalle domande che arrivano da PMI, studenti e professionisti.',
    bullets: [
      "Guide e articoli aggiornati su AI e GenAI, con esempi presi da scenari reali",
      "Mini-tool e webapp demo per mettere le mani in pasta in modo guidato",
      "Newsletter con insight operativi e casi d’uso spiegati in modo chiaro",
      "Community aperta per domande, feedback e idee di nuovi esperimenti",
      "E se vuoi fare un passo in più, c’è anche stAItuned Lab: progetti reali, mentorship e possibilità di collaborazioni pagate",
      <>
        E se vuoi fare un passo in più, c&apos;è anche{' '}
        <Link href="/lab" className="font-semibold text-blue-600 underline underline-offset-4 dark:text-blue-400">
          stAItuned Lab
        </Link>
        : progetti reali, mentorship e possibilità di collaborazioni pagate.
      </>
    ],
    href: '/learn',
    primaryCta: 'Vai al blog',
    secondaryCta: { label: 'Entra nel Lab', href: '/lab' },
    accent: 'blue',
    extraNote: {
      text: 'E se vuoi fare un passo in più, c\'è anche stAItuned Lab: progetti reali, mentorship, possibilità di collaborazioni pagate.',
      linkText: 'Scopri il Lab',
      linkHref: '/lab'
    }
  }
]

export function HomeDualTracks() {
  return (
    <section className="max-w-7xl mx-auto mt-16 px-4 pb-8 sm:mt-20 space-y-14">
      {/* Heading Block */}
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 text-white shadow-lg dark:from-slate-800 dark:via-slate-700 dark:to-slate-800">
          {/* <Image
            src="/assets/general/logo-text.png"
            alt="stAItuned"
            width={120}
            height={30}
            className="h-7 w-auto opacity-90"
          />
          <div className="h-4 w-px bg-amber-400/30"></div> */}
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-400 drop-shadow-sm">Due binari chiari</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-slate-50">
          Due percorsi complementari, zero confusione.
        </h2>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
          Un percorso per le PMI che vogliono capire dove l’AI può avere impatto concreto, e uno per chi vuole imparare, sperimentare e mettere le mani in pasta. Scegli il binario giusto per te e inizia da lì.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {tracks.map((track, index) => {
          const accentColor = track.accent === 'amber'
            ? 'from-amber-50 to-white border-amber-200 hover:border-amber-300 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-950 dark:border-amber-900/40 dark:hover:border-amber-700/60'
            : 'from-blue-50 to-white border-blue-200 hover:border-blue-300 dark:from-blue-950/25 dark:via-slate-900 dark:to-slate-950 dark:border-blue-900/40 dark:hover:border-blue-700/60'
          const badgeColor = track.accent === 'amber'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200 dark:border dark:border-amber-800/60'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-100 dark:border dark:border-blue-800/60'
          return (
            <article
              key={track.title}
              className={`group relative flex flex-col rounded-3xl border-2 bg-gradient-to-br ${accentColor} p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:shadow-lg`}
            >
              {/* Decorative accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-slate-900/5 to-slate-900/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${badgeColor} shadow-sm backdrop-blur-sm`}>{track.eyebrow}</div>
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-900/5 text-slate-700 text-sm font-bold dark:bg-slate-700/40 dark:text-slate-200">
                  {index + 1}
                </div>
              </div>
              <h3 className="mt-5 text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-snug">{track.title}</h3>
              <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">{track.description}</p>
              <ul className="mt-6 space-y-3">
                {track.bullets.map((bullet, index) => (
                  <li key={index} className="flex gap-3 text-sm md:text-base text-slate-700 dark:text-slate-300">
                    <span className={track.accent === 'amber' ? 'text-amber-500 mt-0.5' : 'text-blue-500 mt-0.5'}>✓</span>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
              {track.extraNote && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50/80 dark:bg-slate-800/50 border border-blue-200/50 dark:border-slate-700">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {track.extraNote.text}{' '}
                    <Link href={track.extraNote.linkHref} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {track.extraNote.linkText} →
                    </Link>
                  </p>
                </div>
              )}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={track.href}
                  className={track.accent === 'amber'
                    ? 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 font-semibold text-[13px] px-4 py-2 transition shadow-md hover:-translate-y-[1px] hover:shadow-lg dark:from-amber-400 dark:via-amber-300 dark:to-amber-400'
                    : 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white font-semibold text-[13px] px-4 py-2 transition shadow-md hover:-translate-y-[1px] hover:shadow-lg dark:from-blue-500 dark:via-blue-400 dark:to-blue-500 dark:border dark:border-blue-300/60'}
                >
                  <span>{track.primaryCta}</span>
                  <span aria-hidden className="text-base">→</span>
                </Link>
                {track.secondaryCta && (
                  <Link
                    href={track.secondaryCta.href}
                    className={track.accent === 'amber'
                      ? 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full border-2 border-amber-200 bg-white/90 backdrop-blur-sm text-amber-700 font-semibold text-[13px] px-4 py-2 transition hover:-translate-y-[1px] hover:border-amber-300 hover:shadow-md dark:border-amber-500/50 dark:bg-amber-950/30 dark:text-amber-100'
                      : 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full border-2 border-blue-300 bg-gradient-to-r from-blue-50 via-white to-blue-50 text-blue-800 font-semibold text-[13px] px-4 py-2 transition hover:-translate-y-[1px] hover:border-blue-400 hover:shadow-md dark:border-blue-400/60 dark:bg-gradient-to-r dark:from-blue-900/50 dark:via-blue-900/30 dark:to-blue-900/60 dark:text-blue-50'}
                  >
                    <span>{track.secondaryCta.label}</span>
                    <span aria-hidden className="text-base">↗</span>
                  </Link>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
