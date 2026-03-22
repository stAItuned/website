import {
  ArrowRight,
  CheckCircle2,
  Database,
  Monitor,
  Smartphone,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import type { BusinessLocale } from '@/lib/i18n/business-translations'

type NodeKind = 'app' | 'dashboard' | 'database' | 'monitor'

type NodeProps = {
  x: string
  y: string
  title: string
  subtitle: string
  icon: NodeKind
  status: string
  tone: 'blue' | 'indigo' | 'emerald' | 'teal' | 'slate'
  eyebrow?: string
  featured?: boolean
  mobile?: boolean
}

type Copy = {
  eyebrow: string
  title: string
  highlights: [string, string, string, string]
  subtitle: string
  painKillers: [string, string, string]
  swimlanes: [string, string, string, string, string]
  nodes: {
    first: [string, string, string, string, string]
    second: [string]
  }
  engineLabel: string
  sharedDataLabel: string
  syncLabel: string
  exportOutcomeLabel: string
  legendTitle: string
  flowLabel: string
  truthLabel: string
  mobileTitle: string
}

const copy: Record<BusinessLocale, Copy> = {
  it: {
    eyebrow: 'Dopo',
    title: 'Workflow centralizzato stAI tuned',
    highlights: ['Dato unico, viste diverse', 'Stati tracciati', 'Dati sempre sincronizzati', 'Export conseguente'],
    subtitle:
      'Un solo sistema raccoglie inserimento, approvazione, controllo ed export. Web e mobile restano allineati, ogni passaggio ha uno stato e ogni ruolo vede solo quello che gli serve.',
    painKillers: [
      'Nessun copia-incolla tra file',
      'Nessun passaggio perso in chat o mail',
      'Nessun riallineamento manuale tra ruoli',
    ],
    swimlanes: ['Dipendente', 'Manager', 'Admin', 'Ufficio Tecnico', 'Consulente del lavoro'],
    nodes: {
      first: [
        'Inserimento unico',
        'Approvazione con contesto',
        'Pannello di controllo',
        'Vista operativa',
        'Export finale',
      ],
      second: ['Single source of truth'],
    },
    engineLabel: 'Motore condiviso',
    sharedDataLabel: 'Dato unico, viste diverse',
    syncLabel: 'Sincronizzazione continua',
    exportOutcomeLabel: 'L export nasce direttamente dal sistema',
    legendTitle: 'Legenda Criticita:',
    flowLabel: 'Flusso dati automatico',
    truthLabel: 'Single Source of Truth',
    mobileTitle: 'Versione mobile del flusso futuro',
  },
  en: {
    eyebrow: 'After',
    title: 'Centralized stAItuned workflow',
    highlights: ['One data source, different views', 'Tracked states', 'Always synced data', 'Export as an outcome'],
    subtitle:
      'One system handles intake, approval, control and export. Web and mobile stay aligned, every handoff has a status, and each role sees exactly what it needs to act.',
    painKillers: [
      'No copy-paste across files',
      'No missed handoffs in chat or email',
      'No manual realignment across roles',
    ],
    swimlanes: ['Employee', 'Manager', 'Admin', 'Technical Office', 'Payroll consultant'],
    nodes: {
      first: [
        'Single intake',
        'Approval with context',
        'Control panel',
        'Operational view',
        'Final export',
      ],
      second: ['Single source of truth'],
    },
    engineLabel: 'Shared system engine',
    sharedDataLabel: 'One data source, different views',
    syncLabel: 'Continuous sync',
    exportOutcomeLabel: 'Export comes straight from the system',
    legendTitle: 'Critical legend:',
    flowLabel: 'Automated data flow',
    truthLabel: 'Single Source of Truth',
    mobileTitle: 'Mobile version of the future flow',
  },
}

const ICON_MAP: Record<
  NodeKind,
  {
    Icon: LucideIcon
    iconClass: string
    badgeClass: string
  }
> = {
  app: {
    Icon: Smartphone,
    iconClass: 'text-blue-600 dark:text-blue-300',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/12 dark:text-blue-200',
  },
  dashboard: {
    Icon: Activity,
    iconClass: 'text-indigo-600 dark:text-indigo-300',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/12 dark:text-indigo-200',
  },
  database: {
    Icon: Database,
    iconClass: 'text-emerald-600 dark:text-emerald-300',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-200',
  },
  monitor: {
    Icon: Monitor,
    iconClass: 'text-teal-600 dark:text-teal-300',
    badgeClass: 'bg-teal-100 text-teal-700 dark:bg-teal-500/12 dark:text-teal-200',
  },
}

function Node({ x, y, title, subtitle, icon, status, tone, eyebrow, featured = false, mobile = false }: NodeProps) {
  const { Icon, iconClass, badgeClass } = ICON_MAP[icon]
  const toneClasses: Record<NodeProps['tone'], string> = {
    blue: 'border-blue-200 bg-white dark:border-blue-500/30 dark:bg-slate-900/95',
    indigo: 'border-indigo-200 bg-white dark:border-indigo-500/30 dark:bg-slate-900/95',
    emerald: 'border-emerald-200 bg-white dark:border-emerald-500/30 dark:bg-slate-900/95',
    teal: 'border-teal-200 bg-white dark:border-teal-500/30 dark:bg-slate-900/95',
    slate: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/95',
  }

  return (
    <div
      className={`flex flex-col items-center justify-start rounded-xl border-2 p-3 text-center shadow-md transition-all hover:shadow-lg ${toneClasses[tone]} ${
        featured
          ? 'ring-4 ring-emerald-100 shadow-[0_18px_40px_rgba(16,185,129,0.16)] dark:ring-emerald-500/20'
          : ''
      } ${
        mobile ? 'relative w-full max-w-none translate-x-0 translate-y-0' : 'absolute z-10 w-40 -translate-x-1/2 -translate-y-1/2'
      }`}
      style={mobile ? { minHeight: '104px' } : { left: x, top: y, minHeight: '104px' }}
    >
      {eyebrow ? (
        <span className="mb-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          {eyebrow}
        </span>
      ) : null}
      <div className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-full ${badgeClass}`}>
        <Icon size={24} className={iconClass} />
      </div>

      <span className="mb-1 font-bold leading-tight text-[13px] text-slate-800 dark:text-slate-50">{title}</span>
      <span className="mb-2.5 text-[11px] leading-5 text-slate-500 dark:text-slate-300">{subtitle}</span>

      <div className="mt-auto flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-[3px] dark:border-emerald-500/20 dark:bg-slate-950">
        <CheckCircle2 size={11} className="text-emerald-500" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-200">
          {status}
        </span>
      </div>
    </div>
  )
}

export interface ToBeInfographicProps {
  locale?: BusinessLocale
  className?: string
}

export function ToBeInfographic({ locale = 'it', className }: ToBeInfographicProps) {
  const t = copy[locale]
  const mobileSteps = [
    {
      role: t.swimlanes[0],
      title: t.nodes.first[0],
      subtitle: locale === 'it' ? 'Ore, note e assenze da un solo punto' : 'Hours, notes and absences from one place',
      icon: 'app' as const,
      status: locale === 'it' ? 'Inviato' : 'Sent',
      tone: 'blue' as const,
    },
    {
      role: t.swimlanes[1],
      title: t.nodes.first[1],
      subtitle: locale === 'it' ? 'Con storico, contesto e motivazione' : 'With history, context and reason',
      icon: 'app' as const,
      status: locale === 'it' ? 'Approvato' : 'Approved',
      tone: 'indigo' as const,
    },
    {
      role: t.swimlanes[2],
      title: t.nodes.first[2],
      subtitle:
        locale === 'it'
          ? 'Il sistema sincronizza stati, anomalie e ore per tutti i ruoli'
          : 'The system syncs statuses, anomalies and hours across roles',
      icon: 'dashboard' as const,
      status: locale === 'it' ? 'Verificato' : 'Verified',
      tone: 'emerald' as const,
    },
    {
      role: t.swimlanes[3],
      title: t.nodes.first[3],
      subtitle: locale === 'it' ? 'Dati aggiornati in tempo reale' : 'Real-time updated data',
      icon: 'monitor' as const,
      status: locale === 'it' ? 'Sincronizzato' : 'Synced',
      tone: 'teal' as const,
    },
    {
      role: t.swimlanes[4],
      title: t.nodes.first[4],
      subtitle:
        locale === 'it'
          ? 'Generato dal flusso condiviso, senza ricostruzioni manuali'
          : 'Generated from the shared flow, with no manual rebuild',
      icon: 'database' as const,
      status: locale === 'it' ? "Pronto all'uso" : 'Ready to use',
      tone: 'slate' as const,
    },
  ]

  return (
    <section
      className={`rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5 ${className ?? ''}`}
      aria-label={t.title}
    >
      <header className="mb-4 space-y-2 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-500 dark:text-emerald-400">
          {t.eyebrow}
        </p>
        <h3 className="text-xl font-black leading-tight text-slate-900 dark:text-white sm:text-2xl lg:text-[1.9rem]">
          {t.title}
        </h3>
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {t.highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2">
          {t.painKillers.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{t.subtitle}</p>
      </header>

      <div className="space-y-4 md:hidden">
        <div className="rounded-[1.25rem] border border-slate-300 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {t.mobileTitle}
          </p>
          <div className="mt-4 space-y-3">
            {mobileSteps.map((step, index) => (
              <div key={`${step.role}-${step.title}`} className="space-y-3">
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                  {step.role}
                </div>
                <div className="relative">
                  <Node
                    x="50%"
                    y="50%"
                    title={step.title}
                    subtitle={step.subtitle}
                    icon={step.icon}
                    status={step.status}
                    tone={step.tone}
                    eyebrow={index === 2 ? t.engineLabel : undefined}
                    featured={index === 2}
                    mobile
                  />
                </div>
                {index === 2 ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">
                      {t.sharedDataLabel}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-300">{t.syncLabel}</p>
                  </div>
                ) : null}
                {index < mobileSteps.length - 1 ? (
                  <div className="flex justify-center">
                    <ArrowRight className="h-4 w-4 rotate-90 text-emerald-400" aria-hidden />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            {t.truthLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {locale === 'it'
              ? 'Tutti i ruoli lavorano sullo stesso dato, con viste diverse ma senza copie parallele.'
              : 'Every role works on the same data, with different views but no parallel copies.'}
          </p>
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-[1.25rem] border border-slate-300 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 md:block">
        <div className="relative h-[560px] min-w-[960px]">
          <div className="grid h-12 grid-cols-5 bg-emerald-600 text-white shadow-sm">
            {t.swimlanes.map((lane, index) => (
              <div
                key={lane}
                className={`flex items-center justify-center font-bold tracking-wide ${
                  index < t.swimlanes.length - 1 ? 'border-r border-white/20' : ''
                }`}
              >
                {lane}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 top-12 grid grid-cols-5">
            <div className="border-r border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/45" />
            <div className="border-r border-slate-200 dark:border-slate-800 dark:bg-slate-950" />
            <div className="border-r border-slate-200 bg-emerald-50/30 dark:border-slate-800 dark:bg-emerald-950/14" />
            <div className="border-r border-slate-200 dark:border-slate-800 dark:bg-slate-950" />
            <div className="bg-slate-50/20 dark:bg-slate-900/35" />
          </div>

          <div className="absolute inset-0 top-12">
            <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
              <defs>
                <marker
                  id="arrow-sync"
                  markerWidth="10"
                  markerHeight="7"
                  refX="85"
                  refY="3.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
                <marker
                  id="arrow-sync-v"
                  markerWidth="10"
                  markerHeight="7"
                  refX="55"
                  refY="3.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
              </defs>

              <line x1="10%" y1="35%" x2="30%" y2="35%" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-sync)" />
              <line x1="30%" y1="35%" x2="50%" y2="35%" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrow-sync)" />
              <line x1="50%" y1="35%" x2="70%" y2="35%" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrow-sync)" />
              <line x1="50%" y1="35%" x2="50%" y2="70%" stroke="#10b981" strokeWidth="4" />
              <line x1="50%" y1="70%" x2="90%" y2="70%" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrow-sync)" />
              <path d="M 50% 35% C 64% 35%, 72% 35%, 90% 70%" stroke="#34d399" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.8" />
              <path d="M 50% 35% C 50% 48%, 50% 58%, 50% 70%" stroke="#6ee7b7" strokeWidth="8" fill="none" opacity="0.18" />
            </svg>

            <Node
              x="10%"
              y="35%"
              title={t.nodes.first[0]}
              subtitle={locale === 'it' ? 'Ore, note e assenze da un solo punto' : 'Hours, notes and absences from one place'}
              icon="app"
              status={locale === 'it' ? 'Inviato' : 'Sent'}
              tone="blue"
            />
            <Node
              x="30%"
              y="35%"
              title={t.nodes.first[1]}
              subtitle={locale === 'it' ? 'Con storico, contesto e motivazione' : 'With history, context and reason'}
              icon="app"
              status={locale === 'it' ? 'Approvato' : 'Approved'}
              tone="indigo"
            />
            <Node
              x="50%"
              y="35%"
              title={t.nodes.first[2]}
              subtitle={
                locale === 'it'
                  ? 'Il sistema sincronizza stati, anomalie e ore per tutti i ruoli'
                  : 'The system syncs statuses, anomalies and hours across roles'
              }
              icon="dashboard"
              status={locale === 'it' ? 'Verificato' : 'Verified'}
              tone="emerald"
              eyebrow={t.engineLabel}
              featured
            />
            <Node
              x="70%"
              y="35%"
              title={t.nodes.first[3]}
              subtitle={locale === 'it' ? 'Dati aggiornati in tempo reale' : 'Real-time updated data'}
              icon="monitor"
              status={locale === 'it' ? 'Sincronizzato' : 'Synced'}
              tone="teal"
            />
            <Node
              x="90%"
              y="70%"
              title={t.nodes.first[4]}
              subtitle={
                locale === 'it'
                  ? 'Generato dal flusso condiviso, senza ricostruzioni manuali'
                  : 'Generated from the shared flow, with no manual rebuild'
              }
              icon="database"
              status={locale === 'it' ? "Pronto all'uso" : 'Ready to use'}
              tone="slate"
            />

            <Node
              x="50%"
              y="82%"
              title={t.nodes.second[0]}
              subtitle={locale === 'it' ? 'Lo stesso dato, piu viste operative' : 'Same data, more operational views'}
              icon="database"
              status={t.truthLabel}
              tone="emerald"
            />

          </div>
        </div>
      </div>

      <div className="mt-4 hidden flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950 md:flex">
        <span className="font-bold uppercase tracking-wide text-slate-800">{t.legendTitle}</span>

        <div className="flex items-center gap-3">
          <div className="h-1 w-8 rounded border-t-2 border-dashed border-white bg-emerald-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.flowLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <Database size={16} className="text-emerald-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.truthLabel}</span>
        </div>
      </div>

      <div className="mt-3 hidden items-center justify-end gap-2 text-xs text-slate-500 dark:text-slate-400 md:flex">
        <ArrowRight className="h-4 w-4" aria-hidden />
        <span>{locale === 'it' ? 'Scorri orizzontalmente per vedere il flusso' : 'Scroll horizontally to see the flow'}</span>
      </div>
    </section>
  )
}
