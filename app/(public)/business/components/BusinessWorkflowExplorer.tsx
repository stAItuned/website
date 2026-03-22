'use client'

import { useMemo, useState } from 'react'
import {
  WorkflowScreensCarousel,
  type WorkflowScreen,
  type WorkflowScreenRole,
} from '@/components/business/WorkflowScreensCarousel'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'

const ROLE_ORDER: WorkflowScreenRole[] = ['operator', 'manager', 'admin']

type BusinessWorkflowExplorerProps = {
  flow: BusinessTranslations['flow']
  locale: BusinessLocale
  screens: WorkflowScreen[]
}

export function BusinessWorkflowExplorer({
  flow,
  locale,
  screens,
}: BusinessWorkflowExplorerProps) {
  const [activeRole, setActiveRole] = useState<WorkflowScreenRole>('operator')

  const filteredScreens = useMemo(
    () => screens.filter((screen) => screen.role === activeRole),
    [activeRole, screens],
  )

  const roleConfig = flow.roles[activeRole]

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.28fr)_minmax(320px,0.72fr)] lg:items-stretch">
      <div className="order-2 lg:order-1">
        <WorkflowScreensCarousel key={activeRole} screens={filteredScreens} locale={locale} />
      </div>

      <article className="order-1 h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 lg:order-2 lg:p-4">
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-amber-300">
              {flow.selectorLabel}
            </p>
            <SegmentedControl
              options={ROLE_ORDER.map((role) => ({
                value: role,
                label: flow.roles[role].label,
              }))}
              value={activeRole}
              onChange={(value) => setActiveRole(value as WorkflowScreenRole)}
              size="sm"
              className="w-full max-w-max"
            />
          </div>

          <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {roleConfig.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {roleConfig.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {roleConfig.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
