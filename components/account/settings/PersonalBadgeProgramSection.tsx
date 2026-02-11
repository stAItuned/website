'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BadgeGrid } from '@/components/badges/BadgeGrid'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { PremiumLink } from '@/components/ui/PremiumLink'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'
import { AdminBadgeControls } from '@/components/admin/AdminBadgeControls'
import { useAuth } from '@/components/auth/AuthContext'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import type { AuthorBadge } from '@/lib/types/badge'
import { Sparkles, Award, ChevronRight } from 'lucide-react'

interface BadgeResponse {
  success: boolean
  badges?: AuthorBadge[]
  isWriter?: boolean
  error?: string
}

/**
 * Personal badge program overview with earned and locked badges.
 */
export function PersonalBadgeProgramSection({ isAdmin }: { isAdmin?: boolean }) {
  const { user } = useAuth()
  const { isWriter } = useWriterStatus()
  const [earnedBadges, setEarnedBadges] = useState<AuthorBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user) {
        setEarnedBadges([])
        setLoading(false)
        return
      }
      if (isWriter === null) {
        setLoading(true)
        return
      }
      if (!isWriter) {
        setEarnedBadges([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const token = await user.getIdToken()
        const res = await fetch('/api/user/badges', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json: unknown = await res.json()

        if (!res.ok || typeof json !== 'object' || json === null) {
          throw new Error('Failed to load badges')
        }

        const data = json as BadgeResponse
        if (data.success) {
          setEarnedBadges(Array.isArray(data.badges) ? data.badges : [])
        } else {
          throw new Error(data.error || 'Failed to load badges')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load badges')
      } finally {
        setLoading(false)
      }
    }

    void fetchBadges()
  }, [user, isWriter])

  const earnedCount = earnedBadges.length
  const totalCount = BADGE_DEFINITIONS.length
  const progressLabel = useMemo(() => {
    if (!isWriter) return t.personalbadges.progress.notWriter
    if (earnedCount === 0) return t.personalbadges.progress.noBadges
    return t.personalbadges.progress.earnedStructure
      .replace('{earned}', earnedCount.toString())
      .replace('{total}', totalCount.toString())
  }, [earnedCount, totalCount, isWriter, t])

  return (
    <SettingsSectionCard
      id="badges"
      title={t.personalbadges.title}
      description={t.personalbadges.description}
      icon={<Award className="h-5 w-5" />}
      isCollapsible={true}
      defaultCollapsed={true}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.personalbadges.progress.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{progressLabel}</p>
          </div>
          {isWriter ? (
            <div className="flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-primary-200">
              <Sparkles className="h-3.5 w-3.5" />
              {earnedCount} / {totalCount} {t.personalbadges.earned}
            </div>
          ) : (
            <PremiumLink href="/contribute/become-writer">
              {t.personalbadges.becomeWriter}
              <ChevronRight className="h-4 w-4" />
            </PremiumLink>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-28 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse dark:border-slate-800 dark:bg-slate-900/60" />
            ))}
            <div className="col-span-full text-center text-sm text-slate-500">
              {t.personalbadges.loading}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        ) : (
          <BadgeGrid badges={BADGE_DEFINITIONS} earnedBadges={earnedBadges} />
        )}

        {isAdmin && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <AdminBadgeControls />
          </div>
        )}
      </div>
    </SettingsSectionCard>
  )
}
