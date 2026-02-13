import Image from 'next/image'
import { User } from 'firebase/auth'
import { BadgeCheck, BookMarked, UserRound } from 'lucide-react'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { resolveProfileIdentity } from '@/lib/auth/profileIdentity'

interface AccountOverviewSectionProps {
  user: User
  memberSince?: Date | null
  bookmarksCount: number
  isWriter: boolean | null
}

/**
 * Summary card with core account details.
 */
export function AccountOverviewSection({
  user,
  memberSince,
  bookmarksCount,
  isWriter,
}: AccountOverviewSectionProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]
  const { writerDisplayName, writerImageUrl } = useWriterStatus()
  const identity = resolveProfileIdentity({
    user,
    writerDisplayName,
    writerImageUrl,
  })
  const displayName = identity.displayName

  return (
    <SettingsSectionCard
      id="overview"
      title={t.overview.title}
      description={t.overview.description}
      icon={<UserRound className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 p-[2px]">
            {identity.imageUrl ? (
              <Image
                src={identity.imageUrl}
                alt={displayName}
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl bg-white object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-semibold text-white">
                {identity.initials}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{displayName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            {memberSince ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t.header.memberSince} {memberSince.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <BadgeCheck className="h-4 w-4" />
              {t.overview.status}
            </div>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">
              {isWriter === null ? t.overview.writerStatus.checking : isWriter ? t.overview.writerStatus.writer : t.overview.writerStatus.reader}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <BookMarked className="h-4 w-4" />
              {t.overview.bookmarks}
            </div>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{bookmarksCount}</p>
          </div>
        </div>
      </div>
    </SettingsSectionCard>
  )
}
