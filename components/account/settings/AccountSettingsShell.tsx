import { User } from 'firebase/auth'
import { AccountHeader } from '@/components/account/settings/AccountHeader'
import { AccountNavigation } from '@/components/account/settings/AccountNavigation'
import { AccountSettingsContent } from '@/components/account/settings/AccountSettingsContent'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'
import {
  AlertTriangle,
  Award,
  BookMarked,
  FilePenLine,
  FileText,
  LayoutList,
  ShieldCheck,
  Sparkles,
  UserRound
} from 'lucide-react'

interface AccountSettingsShellProps {
  user: User
  isWriter: boolean | null
  memberSince?: Date | null
  bookmarksCount: number
  hasUserData: boolean
  isAdmin: boolean
  onOpenAgreement: () => void
  onRequestDeleteData: () => void
  onRequestDeleteAccount: () => void
  agreementData?: any
}

/**
 * Layout shell for the account settings experience.
 */
export function AccountSettingsShell({
  user,
  isWriter,
  memberSince,
  bookmarksCount,
  hasUserData,
  isAdmin,
  onOpenAgreement,
  onRequestDeleteData,
  onRequestDeleteAccount,
  agreementData,
}: AccountSettingsShellProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  const navItems = [
    { id: 'overview', label: t.nav.overview, icon: UserRound },
    { id: 'writer', label: t.nav.writer, icon: FilePenLine },
    { id: 'badges', label: t.nav.badges, icon: Award },
    { id: 'articles', label: t.nav.contributions, icon: LayoutList, hidden: !user.email },
    { id: 'data', label: t.nav.data, icon: BookMarked },
    { id: 'legal', label: t.nav.legal, icon: FileText },
    { id: 'danger', label: t.nav.danger, icon: AlertTriangle },
  ]

  const navActions = [
    { href: '/bookmarks', label: t.nav.actions.bookmarks, icon: BookMarked, tone: 'ghost' as const },
    {
      href: isWriter ? '/contribute/draft' : '/contribute/become-writer',
      label: isWriter ? t.nav.actions.newDraft : t.nav.actions.becomeWriter,
      icon: Sparkles,
      tone: 'primary' as const,
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-32 pb-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/30" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-secondary-200/50 blur-3xl dark:bg-secondary-900/20" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4">
        <AccountHeader
          user={user}
          memberSince={memberSince}
          bookmarksCount={bookmarksCount}
          isWriter={isWriter}
          isAdmin={isAdmin}
        />

        <div className="mb-6 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t.nav.jumpToSection}
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {navItems.filter((item) => !item.hidden).map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AccountNavigation items={navItems} actions={navActions} />
          <AccountSettingsContent
            user={user}
            memberSince={memberSince}
            bookmarksCount={bookmarksCount}
            hasUserData={hasUserData}
            isWriter={isWriter}
            agreementData={agreementData}
            onOpenAgreement={onOpenAgreement}
            onRequestDeleteData={onRequestDeleteData}
            onRequestDeleteAccount={onRequestDeleteAccount}
          />
        </div>
      </div>
    </main>
  )
}
