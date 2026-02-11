import Link from 'next/link'
import { BookMarked } from 'lucide-react'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'

interface DataPrivacySectionProps {
  bookmarksCount: number
  hasUserData: boolean
  onRequestDeleteData: () => void
}

/**
 * Data management section with bookmarks and deletion actions.
 */
export function DataPrivacySection({
  bookmarksCount,
  hasUserData,
  onRequestDeleteData,
}: DataPrivacySectionProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  return (
    <SettingsSectionCard
      id="data"
      title={t.dataPrivacy.title}
      description={t.dataPrivacy.description}
      icon={<BookMarked className="h-5 w-5" />}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.dataPrivacy.bookmarks}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.dataPrivacy.savedArticles.replace('{count}', bookmarksCount.toString())}
            </p>
          </div>
          <Link
            href="/bookmarks"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 hover:shadow-md sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {t.dataPrivacy.view}
          </Link>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-red-200/70 bg-red-50/70 p-4 dark:border-red-900/40 dark:bg-red-900/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xs">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">{t.dataPrivacy.deleteData.title}</p>
            <p className="mt-1 text-xs text-red-600/90 dark:text-red-300/90">
              {t.dataPrivacy.deleteData.description}
            </p>
          </div>
          <button
            onClick={onRequestDeleteData}
            disabled={!hasUserData}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:border-red-800 dark:bg-slate-900 dark:text-red-300"
          >
            {t.dataPrivacy.deleteData.button}
          </button>
        </div>
      </div>
    </SettingsSectionCard>
  )
}
