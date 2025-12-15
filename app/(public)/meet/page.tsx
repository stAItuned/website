import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getAuthorData } from '@/lib/authors'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'

export const revalidate = 3600 // 1 ora in secondi

export const metadata: Metadata = {
  title: 'Chi c\'è dietro stAItuned',
  description:
    'La guida strategica di stAItuned e la community di contributor: aiuto le PMI a costruire MVP AI in due settimane.',
  openGraph: {
    title: 'Chi c\'è dietro stAItuned',
    description:
      'La guida strategica di stAItuned e la community di contributor che alimenta il blog, con focus su MVP AI per PMI.',
    type: 'website',
  },
}

export default async function MeetPage() {
  // Get all unique authors from published posts (our writers)
  const uniqueAuthors = Array.from(new Set(
    allPosts
      .filter(post => post.published !== false && post.author)
      .map(post => post.author!)
  ))

  // Get author data and article counts
  const authorsWithData = await Promise.all(
    uniqueAuthors.map(async (authorName) => {
      const authorData = await getAuthorData(authorName)
      const articleCount = allPosts.filter(
        post => post.author === authorName && post.published !== false
      ).length

      return {
        name: authorName,
        slug: authorName.replaceAll(' ', '-'),
        data: authorData,
        articleCount
      }
    })
  )

  // Sort by article count (descending) then by name
  authorsWithData.sort((a, b) => {
    if (b.articleCount !== a.articleCount) {
      return b.articleCount - a.articleCount
    }
    return a.name.localeCompare(b.name)
  })
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto mb-32 mt-[120px] px-4 lg:px-6 space-y-24 text-slate-900 dark:text-slate-100">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-3 text-primary-500 w-full md:w-fit bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl font-medium shadow-sm border border-slate-200/50 dark:bg-slate-900/60 dark:border-slate-800/50 dark:text-primary-400 transition-all hover:shadow-md">
          <Link href="/" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity hover:underline underline-offset-4">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-sm lg:text-base font-semibold truncate">Chi c'è dietro stAItuned</span>
        </nav>

        {/* Hero */}
        <section className="space-y-8 text-slate-900 dark:text-slate-100">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent leading-[1.1]">
                Chi c'è dietro stAItuned
              </h1>
              <div className="flex flex-wrap gap-2.5">
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-amber-500/30 dark:shadow-amber-400/20">
                  AI Strategy per PMI
                </span>
                <span className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300">
                  MVP in 2 settimane
                </span>
                <span className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300">
                  Community & Studio
                </span>
              </div>
            </div>
            <p className="text-xl lg:text-2xl font-medium text-slate-700 max-w-4xl leading-relaxed dark:text-slate-200">
              Dal 2022 stAItuned è il posto dove parliamo di AI pratica, senza hype: prima come community di writer, oggi anche come studio che aiuta PMI e aziende in crescita a sperimentare l'AI in modo veloce e concreto.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200 shadow-sm max-w-4xl dark:bg-slate-900/70 dark:border-slate-800">
            <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
              stAItuned è un progetto indipendente di formazione e sperimentazione su AI. Le attività vengono svolte al di fuori dell’orario di lavoro dipendente e senza utilizzo di informazioni riservate o progetti interni ad altri datori di lavoro.
            </p>
          </div>
          <div className="space-y-4 max-w-4xl pt-4 border-t-2 border-slate-200/50 dark:border-slate-800/50">
            <p className="text-lg text-slate-600 leading-relaxed dark:text-slate-300">
              Qui trovi chi guida la parte strategica e chi contribuisce con articoli, ricerca e punti di vista diversi.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed dark:text-slate-300">
              Il blog e la community sono la base su cui costruiamo soluzioni AI pronte all'uso che proponiamo alle aziende: da contenuti pensati per condividere insight, fino a prodotti su misura che magari nascono proprio da un articolo condiviso qui.
            </p>
          </div>
        </section>

        {/* La guida strategica */}
        <section className="grid gap-6 lg:gap-8 lg:grid-cols-[1.3fr,0.7fr] items-start">
          <div className="relative group space-y-8 bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-200 rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 hover:border-primary-300/50 transition-all duration-500 dark:from-slate-900 dark:to-slate-900/50 dark:border-slate-800 dark:shadow-black/30 dark:hover:shadow-black/50 dark:hover:border-primary-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="relative space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-900/40 rounded-full">
                <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8V8.5l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
                  La guida strategica
                </span>
              </div>
            </div>

            <div className="relative space-y-5">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight dark:text-slate-100">
                Il team di AI Strategy & Product Lead per PMI
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed dark:text-slate-200">
                Noi di stAItuned aiutiamo PMI e aziende in crescita a sperimentare l'AI in modo concreto, veloce e trasparente:
              </p>
            </div>

            <div className="relative space-y-4">
              {[
                { icon: '🔍', title: 'Analizziamo', text: 'insieme dove l\'AI può impattare su costi, tempi e qualità' },
                { icon: '⚡', title: 'Progettiamo', text: 'esperimenti rapidi con un primo MVP in circa 2 settimane' },
                { icon: '🚀', title: 'Trasformiamo', text: 'PoC e idee in soluzioni pronte all\'uso, integrabili nei sistemi esistenti' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors duration-300">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <p className="text-base text-slate-700 dark:text-slate-200">
                    <strong className="font-bold text-slate-900 dark:text-white">{item.title}</strong> {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative pt-4 border-t-2 border-slate-200/50 dark:border-slate-700/50">
              <p className="text-base text-slate-700 leading-relaxed mb-5 dark:text-slate-200">
                Facciamo da ponte tra decision maker e team tecnici: parliamo la lingua del business e entriamo nei dettagli di dati, modelli e delivery per consegnare risultati misurabili.
              </p>
              <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-700/30">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Disponibili per:
                </p>
                <ul className="text-sm text-amber-900 dark:text-amber-100 space-y-2 ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span>call di diagnosi per la tua azienda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span>workshop o speech su AI e GenAI per team interni</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:from-slate-900 dark:to-slate-800 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>

            <div className="relative space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 dark:bg-slate-100 rounded-full">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-white dark:text-slate-900">
                  Strategia e delivery
                </span>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">MVP in 2 settimane</h3>
                </div>
                <p className="text-base text-slate-600 leading-relaxed dark:text-slate-300">
                  Ogni progetto parte da una diagnosi con metriche condivise, passa per sprint agili e arriva rapidamente a una demo funzionante da validare sul campo.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {[
                  'roadmap chiara verso soluzioni integrate',
                  'mentoring continuo per il team interno',
                  'trasparenza su limiti, rischi e alternative'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* I nostri valori */}
        <section className="relative rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 lg:p-12 space-y-8 overflow-hidden dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl"></div>

          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 rounded-full shadow-lg">
              <svg className="w-4 h-4 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-slate-900">
                I nostri valori
              </span>
            </div>
          </div>

          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Concreto prima di tutto',
                description: 'Partiamo da problemi reali, dati esistenti e processi che oggi consumano tempo, senza astrazioni futuribili.',
                gradient: 'from-blue-500 to-cyan-500',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              },
              {
                title: 'Linguaggio semplice',
                description: 'Spieghiamo l\'AI in modo accessibile ai decisori non tecnici, mantenendo rigore e trasparenza.',
                gradient: 'from-violet-500 to-purple-500',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              },
              {
                title: 'MVP veloci',
                description: 'Preferiamo un MVP funzionante in 2 settimane piuttosto che progetti lunghi che non arrivano in produzione.',
                gradient: 'from-amber-500 to-orange-500',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              },
              {
                title: 'Trasparenza su limiti e rischi',
                description: 'Usare AI ha senso solo dove ha senso: raccontiamo chiaramente limiti, implicazioni e alternative.',
                gradient: 'from-emerald-500 to-teal-500',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              }
            ].map((value, idx) => (
              <div key={idx} className="group relative rounded-2xl bg-white p-6 border-2 border-slate-100 shadow-md hover:shadow-xl hover:border-slate-200 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>

                <div className="relative space-y-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.gradient} shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {value.icon}
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* La community di contributor */}
        <section className="space-y-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                La community di contributor
              </span>
            </div>
            <p className="text-lg text-slate-700 max-w-4xl leading-relaxed dark:text-slate-200">
              stAItuned nasce come community aperta di persone che lavorano o studiano nel mondo AI, dati e prodotto digitale. Gli articoli del blog sono scritti e revisionati da questo gruppo di <strong>contributor</strong>: data scientist, ML engineer, marketing specialist, studenti e professionisti che portano prospettive diverse.
            </p>
            <p className="text-lg text-slate-700 max-w-4xl leading-relaxed dark:text-slate-200">
              Questo ci permette di mantenere il blog aggiornato su AI e GenAI, mescolare punto di vista business e tecnico e proporre esempi e casi d\'uso concreti che arrivano da settori diversi.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-100 shadow-sm">
              <span className="text-base">✨</span>
              <span>
                Vuoi entrare nell'ecosistema come contributor o junior? <Link href="/lab" className="text-primary-700 hover:text-primary-800 underline underline-offset-4 dark:text-primary-300 dark:hover:text-primary-200">Scopri stAItuned Lab</Link>.
              </span>
            </div>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium">✨ Qui sotto trovi chi ha contribuito finora.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {authorsWithData.map((author) => (
              <Link
                key={author.slug}
                href={`/author/${author.slug}`}
                className="group block relative bg-white rounded-3xl border-2 border-slate-200 shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] hover:border-primary-300 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:shadow-2xl dark:hover:border-primary-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-transparent rounded-3xl transition-all duration-300"></div>
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                    <Image
                      src={`/content/team/${author.slug}/propic.jpg`}
                      alt={author.name}
                      width={110}
                      height={110}
                      className="relative rounded-full object-cover transition-transform duration-300 group-hover:scale-105 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-primary-400 dark:group-hover:ring-primary-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors dark:text-slate-100 dark:group-hover:text-primary-400">
                      {author.data?.name || author.name}
                    </h3>
                    {author.data?.title && (
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {author.data.title}
                      </p>
                    )}
                  </div>
                  {author.data?.speaker && (
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border-2 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zm5 9a5 5 0 0 1-10 0m5 5v3m-4 0h8" />
                      </svg>
                      Available for speech
                    </div>
                  )}
                  {author.data?.description && (
                    <p className="text-xs text-slate-500 line-clamp-3 dark:text-slate-400">
                      {author.data.description}
                    </p>
                  )}
                  <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    {author.articleCount} {author.articleCount === 1 ? 'articolo' : 'articoli'}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {authorsWithData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg dark:text-slate-400">Non ci sono contributor disponibili al momento.</p>
            </div>
          )}
        </section>

        {/* CTA finale */}
        <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 lg:p-12 text-white space-y-8 shadow-2xl overflow-hidden dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl"></div>

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                Per la tua azienda
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
              Vuoi capire se l'AI può aiutare la tua azienda?
            </h2>
            <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
              Se hai una PMI o un'azienda in crescita e vuoi capire da dove ha senso partire, il modo migliore è una call di diagnosi gratuita (30'). Parliamo dei tuoi processi, dei dati che hai già e ti propongo 1–2 esperimenti concreti con un primo MVP in 2 settimane.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/aziende"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-7 py-3 text-sm font-bold text-white hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                Vai alla pagina "Per la tua azienda"
              </Link>
              <Link
                href="/aziende#prenota-call"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3 text-sm font-bold text-slate-900 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105"
              >
                Prenota la call gratuita →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
