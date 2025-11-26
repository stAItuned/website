import Link from 'next/link'
import Image from 'next/image'

const tracks = [
  {
    title: 'Per le aziende',
    eyebrow: 'PMI · Strategia & MVP',
    description:
      'Progetti pilota snelli (2–6 settimane) per capire in fretta se un\'idea di AI ha impatto reale su costi, tempi e qualità. Costruiamo soluzioni che possono partire piccole e scalare in base ai risultati.',
    bullets: [
      'Problemi tipici: dati sparsi, processi lenti, clienti poco ingaggiati.',
      'Soluzioni: assistenti AI, automazioni operative, raccomandazioni 1-to-1.',
      'Approccio: sprint brevi, metriche definite prima di iniziare.',
      'Outcome: demo/pilota funzionante + roadmap per scalare o integrare stabilmente.'
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
      'Articoli pratici, mini-demo di webapp, strumenti leggeri per portare l\'AI nelle tue decisioni quotidiane. Molti contenuti nascono da casi reali che abbiamo affrontato con le PMI.',
    bullets: [
      'Guide e articoli aggiornati su AI e GenAI, spesso ispirati da progetti veri.',
      'Mini-tool e webapp demo per mettere le mani in pasta.',
      'Newsletter con insight operativi e casi d\'uso reali.',
      'Community aperta per domande e suggerimenti.',
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
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Partner strategico per portare l'AI nei processi della tua PMI. Spazio di apprendimento e sperimentazione per curiosi e tecnici. Scegli il binario giusto e inizia subito.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {tracks.map((track, index) => {
          const accentColor = track.accent === 'amber'
            ? 'from-amber-50 to-white border-amber-200 hover:border-amber-300'
            : 'from-blue-50 to-white border-blue-200 hover:border-blue-300'
          const badgeColor = track.accent === 'amber'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-blue-100 text-blue-700'
          return (
            <article
              key={track.title}
              className={`group relative flex flex-col rounded-3xl border-2 bg-gradient-to-br ${accentColor} p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-slate-900/50 dark:border-slate-700`}
            >
              {/* Decorative accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-slate-900/5 to-slate-900/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${badgeColor} shadow-sm`}>{track.eyebrow}</div>
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
                    ? 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 font-semibold text-[13px] px-4 py-2 transition shadow-md hover:-translate-y-[1px] hover:shadow-lg'
                    : 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white font-semibold text-[13px] px-4 py-2 transition shadow-md hover:-translate-y-[1px] hover:shadow-lg'}
                >
                  <span>{track.primaryCta}</span>
                  <span aria-hidden className="text-base">→</span>
                </Link>
                {track.secondaryCta && (
                  <Link
                    href={track.secondaryCta.href}
                    className={track.accent === 'amber'
                      ? 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full border-2 border-amber-200 bg-white/90 backdrop-blur-sm text-amber-700 font-semibold text-[13px] px-4 py-2 transition hover:-translate-y-[1px] hover:border-amber-300 hover:shadow-md'
                      : 'inline-flex w-full sm:flex-1 justify-center items-center gap-2 rounded-full border-2 border-blue-300 bg-gradient-to-r from-blue-50 via-white to-blue-50 text-blue-800 font-semibold text-[13px] px-4 py-2 transition hover:-translate-y-[1px] hover:border-blue-400 hover:shadow-md'}
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
