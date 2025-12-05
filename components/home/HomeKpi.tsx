'use client'

import { useFastAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useFastAnalytics'
import { ScrollReveal } from '@/components/ui/Animations'

interface HomeKpiProps {
  articleCount: number
  writerCount: number
}

export function HomeKpi({ articleCount, writerCount }: HomeKpiProps) {
  const { data, loading } = useFastAnalytics()
  const users = data?.users ?? 0
  const usersLabel = loading && data === null
    ? '...'
    : formatAnalyticsNumber(users)

  const stats = [
    {
      value: usersLabel,
      label: 'Utenti Attivi',
      description: 'Contenuti su AI e GenAI letti da studenti, professionisti e aziende.'
    },
    {
      value: `${articleCount}`,
      label: 'Articoli Pubblicati',
      description: 'Dalle basi del Machine Learning alle applicazioni concrete per il business.'
    },
    {
      value: `${writerCount}`,
      label: 'Collaboratori',
      description: 'Persone che vogliono portare l’AI nel lavoro di tutti i giorni.'
    },
    {
      value: '10+',
      label: 'Prototipi AI sviluppati',
      description: 'Strumenti reali per testare sul campo cosa può fare l’AI.'
    },
  ]

  return (
    <section className="max-w-7xl mx-auto mt-8 px-4 sm:mt-12">
      <ScrollReveal>
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">stAItuned in numeri</p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 sm:text-4xl">
            Una community e un laboratorio di sperimentazione su AI.
          </h2>
        </div>
      </ScrollReveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 100}>
            <article
              className="h-full space-y-3 rounded-3xl border border-slate-100/80 bg-white/80 p-6 text-center shadow-sm transition-all duration-400 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl hover:-translate-y-1 hover:scale-105 dark:border-slate-800 dark:bg-slate-900/70 group"
            >
              <p className="text-4xl font-semibold text-slate-900 dark:text-slate-50 transition-all duration-300 group-hover:scale-110 group-hover:text-primary-600 dark:group-hover:text-primary-400">{stat.value}</p>
              <p className="text-lg font-semibold text-amber-500 transition-colors duration-300 group-hover:text-amber-600">{stat.label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.description}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
