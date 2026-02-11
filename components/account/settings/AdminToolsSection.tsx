import clsx from 'clsx'
import { useState } from 'react'
import { ShieldCheck, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SettingsSectionCard } from '@/components/account/settings/SettingsSectionCard'
import { useLearnLocale, accountTranslations } from '@/lib/i18n'
import { CostMonitoringDashboard } from '@/components/admin/CostMonitoringDashboard'
import { AdminContributions } from '@/components/admin/AdminContributions'
import { AdminRoleFitSubmissions } from '@/components/admin/AdminRoleFitSubmissions'
import { AdminBadgeEmailQueue } from '@/components/admin/AdminBadgeEmailQueue'

interface AdminToolsSectionProps {
  activeAdminTab: 'contributions' | 'role_fit'
  onAdminTabChange: (tab: 'contributions' | 'role_fit') => void
}

/**
 * A simpler collapsible wrapper for individual admin tools.
 */
function AdminToolWrapper({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isFullyOpen, setIsFullyOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl mb-4 bg-slate-50/50 dark:bg-slate-800/20">
      <button
        onClick={() => {
          const next = !isOpen
          setIsOpen(next)
          if (!next) setIsFullyOpen(false)
        }}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors rounded-t-xl"
      >
        <span className="font-bold text-slate-700 dark:text-slate-200">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onAnimationComplete={() => {
              if (isOpen) setIsFullyOpen(true)
            }}
            className={clsx(!isFullyOpen && "overflow-hidden")}
          >
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-b-xl">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Admin-only tools embedded in account settings.
 */
export function AdminToolsSection({ activeAdminTab, onAdminTabChange }: AdminToolsSectionProps) {
  const { locale } = useLearnLocale()
  const t = accountTranslations[locale]

  return (
    <SettingsSectionCard
      id="admin"
      title={t.adminTools.title}
      description={t.adminTools.description}
      icon={<ShieldCheck className="h-5 w-5" />}
      isCollapsible={true}
      defaultCollapsed={true}
    >
      <div className="space-y-2">
        <AdminToolWrapper title={t.adminTools.costMonitoring} defaultOpen={false}>
          <CostMonitoringDashboard />
        </AdminToolWrapper>

        <AdminToolWrapper title={t.adminTools.submissionsReview} defaultOpen={false}>
          <div>
            <div className="flex flex-wrap gap-4 border-b border-slate-200 pb-2 text-sm font-semibold dark:border-slate-700">
              <button
                onClick={() => onAdminTabChange('contributions')}
                className={clsx(
                  'pb-2 transition-colors',
                  activeAdminTab === 'contributions'
                    ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {t.adminTools.contributorPath}
              </button>
              <button
                onClick={() => onAdminTabChange('role_fit')}
                className={clsx(
                  'pb-2 transition-colors',
                  activeAdminTab === 'role_fit'
                    ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {t.adminTools.roleFitAudit}
              </button>
            </div>
            <div className="mt-6">
              {activeAdminTab === 'contributions' ? <AdminContributions /> : <AdminRoleFitSubmissions />}
            </div>
          </div>
        </AdminToolWrapper>


        <AdminToolWrapper title={t.adminTools.emailQueue} defaultOpen={false}>
          <AdminBadgeEmailQueue />
        </AdminToolWrapper>
      </div>
    </SettingsSectionCard>
  )
}
