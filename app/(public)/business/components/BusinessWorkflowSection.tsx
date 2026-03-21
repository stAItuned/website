import { type WorkflowScreen } from '@/components/business/WorkflowScreensCarousel'
import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'
import { BusinessWorkflowExplorer } from './BusinessWorkflowExplorer'
import { BusinessSectionEyebrow } from './BusinessSectionEyebrow'

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
      className="border-y border-slate-200 bg-[linear-gradient(180deg,_rgba(255,247,168,0.16)_0%,_rgba(248,250,252,1)_60%)] dark:border-slate-800 dark:bg-[linear-gradient(180deg,_rgba(255,242,114,0.06)_0%,_rgba(15,17,23,1)_60%)]"
    >
      <div className="mx-auto max-w-5xl px-4 py-14 xs:px-6 lg:py-16">
        <div className="mb-6 max-w-2xl space-y-3">
          <BusinessSectionEyebrow>{t.flow.eyebrow}</BusinessSectionEyebrow>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white xs:text-3xl">
            {t.flow.title}
          </h2>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{t.flow.lead}</p>
        </div>
        <BusinessWorkflowExplorer flow={t.flow} locale={locale} screens={BUSINESS_WORKFLOW_SCREENS} />
      </div>
    </section>
  )
}
