'use client'

import { AdminFirstPartyAnalytics } from '@/components/admin/AdminFirstPartyAnalytics'

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold leading-6 text-slate-900 dark:text-white">
          First-Party Public Page Views
        </h1>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
          Internal ranking of tracked public pages using only first-party counters already stored by the app.
        </p>
      </div>

      <AdminFirstPartyAnalytics />
    </div>
  )
}
