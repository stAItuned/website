import { FileText } from 'lucide-react'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'

interface LegalAgreementSectionProps {
  onOpenAgreement: () => void
  agreementData?: any
}

/**
 * Agreement access section for contributor legal terms.
 */
export function LegalAgreementSection({ onOpenAgreement, agreementData }: LegalAgreementSectionProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  return (
    <SettingsSectionCard
      id="legal"
      title={t.legal.title}
      description={t.legal.description}
      icon={<FileText className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.legal.contributorAgreement.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {(agreementData?.accepted_at || agreementData?.agreedAt) ? (
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                Signed on {new Date(agreementData.accepted_at || agreementData.agreedAt).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US')}
              </span>
            ) : (
              t.legal.contributorAgreement.description
            )}
          </p>
        </div>
        <button
          onClick={onOpenAgreement}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-auto dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-primary-200"
        >
          <FileText className="h-4 w-4" />
          {t.legal.contributorAgreement.button}
        </button>
      </div>
    </SettingsSectionCard>
  )
}
