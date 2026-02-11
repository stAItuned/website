import Image from 'next/image'
import Link from 'next/link'
import { User } from 'firebase/auth'
import {
  Bookmark,
  Home,
  ShieldCheck,
  Sparkles,
  UserRound,
  PenLine
} from 'lucide-react'
import { PremiumLink } from '@/components/ui/PremiumLink'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'

interface AccountHeaderProps {
  user: User
  memberSince?: Date | null
  bookmarksCount: number
  isWriter: boolean | null
  isAdmin: boolean
}

/**
 * Top banner for the account settings page with profile summary and quick actions.
 */
export function AccountHeader({
  user,
  memberSince,
  bookmarksCount,
  isWriter,
  isAdmin,
}: AccountHeaderProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  const displayName = user.displayName || user.email || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="mb-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
      >
        <Home className="h-4 w-4" />
        {t.header.backToHome}
      </Link>

      <div className="mt-5 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 p-[2px]">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-2xl bg-white object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-semibold text-white">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {t.header.title}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {displayName}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {t.header.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <UserRound className="h-3 w-3" />
                  {t.header.roles.member}
                </span>
                {isWriter === null ? (
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {t.header.roles.checking}
                  </span>
                ) : isWriter ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700 dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-primary-300">
                    <PenLine className="h-3 w-3" />
                    {t.header.roles.writer}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
                    <Sparkles className="h-3 w-3" />
                    {t.header.roles.reader}
                  </span>
                )}
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
                    <ShieldCheck className="h-3 w-3" />
                    {t.header.roles.admin}
                  </span>
                ) : null}
                {memberSince ? (
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {t.header.memberSince} {memberSince.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/bookmarks"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 hover:shadow-md sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Bookmark className="h-4 w-4" />
              {bookmarksCount} {t.header.bookmarks}
            </Link>
            <PremiumLink href={isWriter ? '/contribute/draft' : '/contribute/become-writer'}>
              {isWriter ? <PenLine className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {isWriter ? t.header.buttons.newDraft : t.header.buttons.becomeWriter}
            </PremiumLink>
          </div>
        </div>
      </div>
    </div>
  )
}
