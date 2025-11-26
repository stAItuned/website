import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'

export const dynamic = 'force-static'
export const revalidate = 21600 // every 6 hours

export const metadata: Metadata = {
  title: 'stAItuned Lab - Impara l\'AI lavorando su casi reali',
  description: 'Non solo corsi. Entra nei progetti che facciamo per aziende vere, con mentorship e standard reali. Se funziona per entrambi, può diventare anche lavoro pagato.',
  openGraph: {
    title: 'stAItuned Lab - Impara l\'AI lavorando su casi reali',
    description: 'Partecipa a progetti reali di AI con mentorship strutturata e possibilità di collaborazioni pagate.',
    type: 'website',
  },
}

const labOffers = [
  {
    icon: '🚀',
    title: 'Partecipazione a progetti reali',
    description: 'Lavori su parti di progetti che facciamo per aziende vere, con code review e feedback strutturato.'
  },
  {
    icon: '📚',
    title: 'Accesso a repo e template stAItuned',
    description: 'Template, boilerplate e best practice che usiamo nei progetti di produzione.'
  },
  {
    icon: '👨‍🏫',
    title: 'Mentorship strutturata',
    description: 'Feedback settimanale, sessioni di pair programming e revisione del codice da parte del team senior.'
  },
  {
    icon: '💰',
    title: 'Possibilità di collaborazioni pagate',
    description: 'Se c\'è fit e dimostri costanza, alcuni progetti possono trasformarsi in collaborazioni retribuite.'
  }
]

const requirements = [
  {
    icon: '⏱️',
    title: 'Tempo minimo',
    description: '5-10 ore a settimana. Costanza è più importante della quantità.'
  },
  {
    icon: '🐍',
    title: 'Base tecnica',
    description: 'Python, un minimo di ML/AI, basi di sviluppo web. Non serve essere senior, ma saper scrivere codice funzionante.'
  },
  {
    icon: '🔧',
    title: 'Mindset da produzione',
    description: 'Voglia di scrivere codice "da produzione", non solo notebook e esperimenti. Attenzione a test, documentazione e qualità.'
  },
  {
    icon: '🎯',
    title: 'Proattività',
    description: 'Capacità di chiedere quando serve, ma anche di provare a risolvere autonomamente prima.'
  }
]

const howItWorks = [
  {
    step: '1',
    title: 'Candidatura',
    description: 'Compila il form con la tua esperienza, cosa vuoi imparare e quanto tempo puoi dedicare.',
    color: 'blue'
  },
  {
    step: '2',
    title: 'Mini-task tecnico',
    description: 'Un piccolo esercizio pratico (max 2-3 ore) per capire il tuo livello e come lavori.',
    color: 'purple'
  },
  {
    step: '3',
    title: 'Colloquio',
    description: 'Una call informale per conoscerci, capire aspettative e vedere se c\'è fit.',
    color: 'amber'
  },
  {
    step: '4',
    title: 'Inserimento graduale',
    description: 'Parti con un piccolo task interno o una feature di un progetto pilota, con supporto continuo.',
    color: 'green'
  }
]

export default function LabPage() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto mb-32 mt-[120px] px-4 lg:px-6 space-y-24">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-3 text-primary-500 w-full md:w-fit bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl font-medium shadow-sm border border-slate-200/50 dark:bg-slate-900/60 dark:border-slate-800/50 dark:text-primary-400 transition-all hover:shadow-md">
          <Link href="/" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity hover:underline underline-offset-4">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-sm lg:text-base font-semibold truncate">stAItuned Lab</span>
        </nav>

        {/* Hero */}
        <section className="space-y-8 text-slate-900 dark:text-slate-100">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-[1.1]">
                stAItuned Lab
              </h1>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200">
                Impara l'AI lavorando su casi reali
              </h2>
              <div className="flex flex-wrap gap-2.5">
                <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg">
                  Progetti veri
                </span>
                <span className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300">
                  Mentorship inclusa
                </span>
                <span className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300">
                  Lavoro retribuito possibile
                </span>
              </div>
            </div>
            <p className="text-xl lg:text-2xl font-medium text-slate-700 max-w-4xl leading-relaxed dark:text-slate-200">
              Non solo corsi. Entri nei progetti che facciamo per aziende vere, con mentorship e standard reali. Se funziona per entrambi, può diventare anche lavoro pagato.
            </p>
          </div>
          <div className="space-y-4 max-w-4xl pt-4 border-t-2 border-slate-200/50 dark:border-slate-800/50">
            <p className="text-lg text-slate-600 leading-relaxed dark:text-slate-300">
              Il Lab è pensato per junior, studenti e autodidatti che vogliono crescere facendo, non solo studiando.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed dark:text-slate-300">
              Lavorerai su feature reali, riceverai code review dettagliate e imparerai cosa significa portare l'AI in produzione con standard aziendali.
            </p>
          </div>
        </section>

        {/* Cosa offre il Lab */}
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
              💡 Cosa offriamo
            </div>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Il Lab ti offre
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {labOffers.map((offer, index) => (
              <div
                key={index}
                className="group rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/50"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{offer.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                        {offer.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {offer.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cosa chiediamo */}
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
              ✅ Requisiti
            </div>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Cosa chiediamo
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Non serve essere senior, ma serve voglia di imparare e lavorare con standard professionali
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="space-y-3 text-center">
                  <span className="text-4xl block">{req.icon}</span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {req.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {req.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Come funziona */}
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
              🚀 Il processo
            </div>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Come funziona in 4 step
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => {
              const colorClasses = {
                blue: 'from-blue-50 to-blue-100 border-blue-300 text-blue-700',
                purple: 'from-purple-50 to-purple-100 border-purple-300 text-purple-700',
                amber: 'from-amber-50 to-amber-100 border-amber-300 text-amber-700',
                green: 'from-green-50 to-green-100 border-green-300 text-green-700'
              }
              return (
                <div
                  key={index}
                  className="relative rounded-2xl border-2 bg-gradient-to-br p-6 shadow-sm dark:bg-slate-900/40"
                  style={{
                    borderColor: step.color === 'blue' ? '#93c5fd' : 
                                 step.color === 'purple' ? '#c4b5fd' :
                                 step.color === 'amber' ? '#fcd34d' : '#86efac',
                    background: step.color === 'blue' ? 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)' :
                               step.color === 'purple' ? 'linear-gradient(to bottom right, #ede9fe, #ddd6fe)' :
                               step.color === 'amber' ? 'linear-gradient(to bottom right, #fef3c7, #fde68a)' :
                               'linear-gradient(to bottom right, #d1fae5, #a7f3d0)'
                  }}
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-white shadow-md`}
                         style={{
                           color: step.color === 'blue' ? '#2563eb' :
                                  step.color === 'purple' ? '#7c3aed' :
                                  step.color === 'amber' ? '#d97706' : '#059669'
                         }}>
                      {step.step}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="space-y-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl md:text-5xl font-bold">
              Pronto a crescere con noi?
            </h3>
            <p className="text-xl text-blue-100 leading-relaxed">
              Candidati al Lab e inizia a lavorare su progetti reali. Leggi il blog per arrivare preparato e capire come lavoriamo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="https://forms.gle/YOUR_FORM_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-purple-700 font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
              >
                <span>Candidati al Lab</span>
                <span>→</span>
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/60 text-white font-semibold text-lg hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                <span>Vai al Blog</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Info finale */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Nota:</strong> Il Lab non è un corso strutturato, ma un'opportunità di crescita attraverso progetti veri. L'inserimento dipende dalle tue competenze attuali e dai progetti in corso.
          </p>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Per domande: <a href="mailto:lab@staituned.it" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">lab@staituned.it</a>
          </p>
        </section>

      </div>
    </PageTransition>
  )
}
