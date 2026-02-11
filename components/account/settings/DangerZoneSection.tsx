import { AlertTriangle } from 'lucide-react'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'

interface DangerZoneSectionProps {
  onRequestDeleteAccount: () => void
}

/**
 * High-risk actions section for account deletion.
 */
export function DangerZoneSection({ onRequestDeleteAccount }: DangerZoneSectionProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  return (
    <SettingsSectionCard
      id="danger"
      title={t.danger.title}
      description={t.danger.description}
      icon={<AlertTriangle className="h-5 w-5" />}
      tone="danger"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">{t.danger.deleteAccount.title}</p>
          <p className="text-xs text-red-600/90 dark:text-red-300/90">
            {t.danger.deleteAccount.description}
          </p>
        </div>
        <button
          onClick={onRequestDeleteAccount}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg sm:w-auto"
        >
          <AlertTriangle className="h-4 w-4" />
          {t.danger.deleteAccount.button}
        </button>
      </div>
    </SettingsSectionCard>
  )
}
