import {
  AlertTriangle,
  ArrowRight,
  FileSpreadsheet,
  MessageCircle,
  Monitor,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import type { BusinessLocale } from '@/lib/i18n/business-translations'

type NodeKind = 'monitor' | 'excel' | 'whatsapp' | 'app'

type NodeProps = {
  x: string
  y: string
  title: string
  icon: NodeKind
  isPainPoint?: boolean
  locale: BusinessLocale
  badgeOverride?: string
}

type Copy = {
  eyebrow: string
  title: string
  subtitle: string
  swimlanes: [string, string, string, string, string]
  laneLabels: [string, string, string, string, string]
  nodes: {
    firstRow: [string, string, string, string]
    secondRow: [string, string]
    thirdRow: [string, string, string]
    fourthRow: [string]
  }
  legendTitle: string
  manualFlow: string
  errorRisk: string
  untrackedData: string
}

const copy: Record<BusinessLocale, Copy> = {
  it: {
    eyebrow: 'Situazione attuale',
    title: 'Tre ruoli, nessun filo comune',
    subtitle:
      'Mappatura del flusso As-Is. I nodi evidenziati in rosso mostrano i passaggi manuali e i canali non strutturati che creano colli di bottiglia e rischio di errore nella riconciliazione finale.',
    swimlanes: ['Dipendente', 'Manager', 'Admin', 'Ufficio Tecnico', 'Consulente del lavoro'],
    laneLabels: ['App Dipendente', 'App Manager', 'Sistema HR', 'File Locale', 'File Locale'],
    nodes: {
      firstRow: [
        'Inserisce dati e note',
        'Convalida e approva',
        'Scarica il report',
        'Aggiorna le informazioni',
      ],
      secondRow: ['Copia e incolla i dati nel database', 'Verifica i dati operativi'],
      thirdRow: [
        'Gestisce ferie, permessi e malattie',
        'Compila il foglio presenze',
        'Elabora il cedolino paghe',
      ],
      fourthRow: ['Invia richieste e aggiornamenti'],
    },
    legendTitle: 'Legenda Criticità:',
    manualFlow: 'Flusso dati manuale (Copia-Incolla)',
    errorRisk: 'Rischio errore / Riconciliazione complessa',
    untrackedData: 'Dati in canali non tracciabili',
  },
  en: {
    eyebrow: 'Current state',
    title: 'Three roles, no shared thread',
    subtitle:
      'As-is flow mapping. Red nodes mark the manual handoffs and unstructured channels that create bottlenecks and a high reconciliation error risk.',
    swimlanes: ['Employee', 'Manager', 'Admin', 'Technical Office', 'Payroll consultant'],
    laneLabels: ['App', 'App', 'System', 'Local file', 'Local file'],
    nodes: {
      firstRow: [
        'Enters data and notes',
        'Validates and approves',
        'Downloads the report',
        'Updates the information',
      ],
      secondRow: ['Copies and pastes data into the database', 'Checks operational data'],
      thirdRow: [
        'Manages leave, permissions and sickness',
        'Fills in the attendance sheet',
        'Prepares the payroll slip',
      ],
      fourthRow: ['Sends requests and updates'],
    },
    legendTitle: 'Critical legend:',
    manualFlow: 'Manual data flow (copy-paste)',
    errorRisk: 'Error risk / Complex reconciliation',
    untrackedData: 'Data in untracked channels',
  },
}

const ICON_MAP: Record<
  NodeKind,
  {
    Icon: LucideIcon
    color: string
    badgeText: Record<BusinessLocale, string>
  }
> = {
  monitor: {
    Icon: Monitor,
    color: 'text-slate-600',
    badgeText: {
      it: 'Sistema',
      en: 'System',
    },
  },
  excel: {
    Icon: FileSpreadsheet,
    color: 'text-green-600',
    badgeText: {
      it: 'File Locale',
      en: 'Local file',
    },
  },
  whatsapp: {
    Icon: MessageCircle,
    color: 'text-emerald-500',
    badgeText: {
      it: 'Chat / Vocali',
      en: 'Chat / voice notes',
    },
  },
  app: {
    Icon: Smartphone,
    color: 'text-blue-600',
    badgeText: {
      it: 'App',
      en: 'App',
    },
  },
}

function Node({ x, y, title, icon, isPainPoint, locale, badgeOverride }: NodeProps) {
  const { Icon, color, badgeText } = ICON_MAP[icon]

  return (
    <div
      className={`absolute z-10 flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start rounded-lg border-2 p-3 text-center text-sm shadow-sm transition-all hover:shadow-md ${
        isPainPoint ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
      }`}
      style={{ left: x, top: y, minHeight: '100px' }}
    >
      {isPainPoint ? (
        <div className="absolute -top-3 -right-3 rounded-full bg-red-500 p-1.5 text-white shadow-md animate-pulse">
          <AlertTriangle size={16} />
        </div>
      ) : null}

      <span className="mb-3 font-semibold leading-snug text-slate-800">{title}</span>

      <div className="mt-auto flex flex-col items-center gap-1">
        <Icon size={24} className={color} />
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            isPainPoint ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {badgeText[locale]}
        </span>
        {badgeOverride ? (
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-white dark:text-slate-900">
            {badgeOverride}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export interface AsIsInfographicProps {
  locale?: BusinessLocale
  className?: string
}

export function AsIsInfographic({ locale = 'it', className }: AsIsInfographicProps) {
  const t = copy[locale]

  return (
    <section
      className={`rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5 ${className ?? ''}`}
      aria-label={t.title}
    >
      <header className="mb-6 space-y-3 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-rose-500 dark:text-rose-400">
          {t.eyebrow}
        </p>
        <h3 className="text-xl font-black leading-tight text-slate-900 dark:text-white sm:text-2xl lg:text-[2rem]">
          {t.title}
        </h3>
        <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{t.subtitle}</p>
      </header>

      <div className="overflow-x-auto rounded-[1.25rem] border border-slate-300 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="relative h-[680px] min-w-[960px]">
          <div className="grid h-14 grid-cols-5 bg-[#3b5998] text-white shadow-sm">
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

        <div className="pointer-events-none absolute inset-0 top-14 grid grid-cols-5">
            <div className="border-r border-slate-200 bg-slate-50/50" />
            <div className="border-r border-slate-200" />
            <div className="border-r border-slate-200 bg-slate-50/50" />
            <div className="border-r border-slate-200" />
            <div className="bg-slate-50/20" />
          </div>

          <div className="absolute inset-0 top-14">
            <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
              <defs>
                <marker
                  id="arrow-h"
                  markerWidth="10"
                  markerHeight="7"
                  refX="85"
                  refY="3.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrow-v"
                  markerWidth="10"
                  markerHeight="7"
                  refX="55"
                  refY="3.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrow-red-h"
                  markerWidth="10"
                  markerHeight="7"
                  refX="85"
                  refY="3.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                </marker>
              </defs>

              <line x1="10%" y1="15%" x2="30%" y2="15%" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-h)" />
              <line x1="30%" y1="15%" x2="50%" y2="15%" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-h)" />
              <line x1="50%" y1="15%" x2="50%" y2="38%" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-v)" />
              <line x1="70%" y1="15%" x2="70%" y2="38%" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-v)" />
              <line x1="30%" y1="65%" x2="50%" y2="65%" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-h)" />
              <line x1="10%" y1="85%" x2="50%" y2="85%" stroke="#94a3b8" strokeWidth="2" />
              <line x1="50%" y1="85%" x2="50%" y2="65%" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-v)" />

              <line
                x1="50%"
                y1="38%"
                x2="70%"
                y2="38%"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="6 4"
                markerEnd="url(#arrow-red-h)"
              />
              <circle cx="60%" cy="38%" r="5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <line x1="60%" y1="38%" x2="60%" y2="65%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
              <line
                x1="60%"
                y1="65%"
                x2="90%"
                y2="65%"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="6 4"
                markerEnd="url(#arrow-red-h)"
              />
              <line
                x1="50%"
                y1="38%"
                x2="50%"
                y2="65%"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="6 4"
                markerEnd="url(#arrow-red-h)"
              />
            </svg>

            <Node
              x="10%"
              y="15%"
              title={t.nodes.firstRow[0]}
              icon="app"
              locale={locale}
              badgeOverride={locale === 'it' ? 'App dipendente' : 'Employee app'}
            />
            <Node
              x="30%"
              y="15%"
              title={t.nodes.firstRow[1]}
              icon="app"
              locale={locale}
              badgeOverride={locale === 'it' ? 'App manager' : 'Manager app'}
            />
            <Node x="50%" y="15%" title={t.nodes.firstRow[2]} icon="monitor" locale={locale} />
            <Node x="70%" y="15%" title={t.nodes.firstRow[3]} icon="excel" locale={locale} />

            <Node x="50%" y="38%" title={t.nodes.secondRow[0]} icon="excel" isPainPoint locale={locale} />
            <Node x="70%" y="38%" title={t.nodes.secondRow[1]} icon="excel" locale={locale} />

            <Node x="30%" y="65%" title={t.nodes.thirdRow[0]} icon="whatsapp" isPainPoint locale={locale} />
            <Node x="50%" y="65%" title={t.nodes.thirdRow[1]} icon="excel" isPainPoint locale={locale} />
            <Node x="90%" y="65%" title={t.nodes.thirdRow[2]} icon="excel" isPainPoint locale={locale} />

            <Node x="10%" y="85%" title={t.nodes.fourthRow[0]} icon="whatsapp" isPainPoint locale={locale} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <span className="font-bold text-slate-800 uppercase text-sm tracking-wide">{t.legendTitle}</span>

        <div className="flex items-center gap-3">
          <div className="h-1 w-8 border-t-2 border-dashed border-white bg-red-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.manualFlow}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-red-100 p-1.5 text-red-600">
            <AlertTriangle size={14} />
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.errorRisk}</span>
        </div>

        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-emerald-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.untrackedData}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-500 dark:text-slate-400 md:hidden">
        <ArrowRight className="h-4 w-4" aria-hidden />
        <span>{locale === 'it' ? 'Scorri orizzontalmente per vedere tutto il flusso' : 'Scroll horizontally to see the full flow'}</span>
      </div>
    </section>
  )
}
