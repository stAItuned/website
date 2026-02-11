import Link from 'next/link'
import { BookOpen, FilePenLine, PenLine, Sparkles, UserRound } from 'lucide-react'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { PremiumLink } from '@/components/ui/PremiumLink'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'

interface WriterWorkspaceSectionProps {
  isWriter: boolean | null
}

/**
 * Contributor workspace with writer actions and onboarding.
 */
export function WriterWorkspaceSection({ isWriter }: WriterWorkspaceSectionProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  return (
    <SettingsSectionCard
      id="writer"
      title={t.writerWorkspace.title}
      description={t.writerWorkspace.description}
      icon={<FilePenLine className="h-5 w-5" />}
      className="transition-all duration-500"
    >
      <div id="contributor-section" className="rounded-xl transition-all duration-700">
        {isWriter === null ? (
          <div className="animate-pulse">
            <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        ) : isWriter ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.writerWorkspace.active.text}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contribute"
                className="inline-flex w-full items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-auto dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-primary-200"
              >
                <BookOpen className="h-4 w-4" />
                {t.writerWorkspace.active.contributorArea}
              </Link>
              <PremiumLink href="/contribute/draft">
                <PenLine className="h-4 w-4" />
                {t.writerWorkspace.active.createDraft}
              </PremiumLink>
              <Link
                href="/account/writer-profile"
                className="inline-flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 hover:shadow-md sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <UserRound className="h-4 w-4" />
                {t.writerWorkspace.active.editProfile}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.writerWorkspace.inactive.text}
            </p>
            <PremiumLink href="/contribute/become-writer">
              <Sparkles className="h-4 w-4" />
              {t.writerWorkspace.inactive.becomeWriter}
            </PremiumLink>
          </div>
        )}
      </div>
    </SettingsSectionCard >
  )
}
