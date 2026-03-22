import { type WorkflowScreen } from '@/components/business/WorkflowScreensCarousel'
import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessWorkflowExplorer } from './BusinessWorkflowExplorer'

export const BUSINESS_WORKFLOW_SCREENS: WorkflowScreen[] = [
  {
    id: 'operator-1',
    role: 'operator',
    src: '/assets/business/screens/it/operator-1.png',
    alt: {
      it: 'Vista operatore: compilazione della giornata con commessa, ore e invio del timesheet.',
      en: 'Operator view: daily entry with worksite, hours and timesheet submission.',
    },
  },
  {
    id: 'operator-3',
    role: 'operator',
    src: '/assets/business/screens/it/operator-3.png',
    alt: {
      it: 'Vista operatore: riepilogo mensile con avanzamento, approvate, in attesa e giornate da correggere.',
      en: 'Operator view: monthly summary with progress, approved entries, pending items and days to fix.',
    },
  },
  {
    id: 'manager-3',
    role: 'manager',
    src: '/assets/business/screens/it/manager-3.png',
    alt: {
      it: 'Vista manager: approvazione giornate con filtri, dettaglio operatore e azione approva.',
      en: 'Manager view: day approvals with filters, operator details and approve action.',
    },
  },
  {
    id: 'admin-1',
    role: 'admin',
    src: '/assets/business/screens/it/admin-1.png',
    alt: {
      it: 'Vista admin: consolidamento operativo con completion rate, pending ed eccezioni bloccanti.',
      en: 'Admin view: operational consolidation with completion rate, pending items and blocking exceptions.',
    },
  },
  {
    id: 'admin-2',
    role: 'admin',
    src: '/assets/business/screens/it/admin-2.png',
    alt: {
      it: 'Vista admin: distribuzione workforce con stato consolidamento per area e accesso rapido a export.',
      en: 'Admin view: workforce distribution with consolidation status by area and quick access to export.',
    },
  },
]

export function BusinessWorkflowSection({
  t,
  locale,
}: {
  t: BusinessTranslations
  locale: BusinessLocale
}) {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden border-y border-slate-900/10 bg-[linear-gradient(180deg,_#172033_0%,_#111827_100%)] text-white dark:border-slate-700 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0F1117_100%)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <div className="mx-auto max-w-5xl px-4 py-14 xs:px-6 lg:py-16">
        <div className="relative mb-6 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">{t.flow.eyebrow}</p>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white xs:text-3xl">
            {t.flow.title}
          </h2>
          <p className="text-sm leading-7 text-slate-300">{t.flow.lead}</p>
        </div>
        <div className="relative">
          <BusinessWorkflowExplorer flow={t.flow} locale={locale} screens={BUSINESS_WORKFLOW_SCREENS} />
        </div>
      </div>
    </section>
  )
}
