import { MyArticles } from '@/components/account/MyArticles'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { LayoutList } from 'lucide-react'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'

interface AccountArticlesSectionProps {
  userEmail?: string | null
}

/**
 * Wrapper for the user contribution dashboard.
 */
export function AccountArticlesSection({ userEmail }: AccountArticlesSectionProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  if (!userEmail) return null

  return (
    <SettingsSectionCard
      id="articles"
      title={t.articles.title}
      description={t.articles.description}
      icon={<LayoutList className="h-5 w-5" />}
      isCollapsible={true}
      defaultCollapsed={true}
    >
      <MyArticles userEmail={userEmail} />
    </SettingsSectionCard>
  )
}
