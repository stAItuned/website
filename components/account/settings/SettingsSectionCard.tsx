import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SettingsSectionCardProps {
  id?: string
  title: string
  description?: string
  icon: ReactNode
  tone?: 'default' | 'danger'
  className?: string
  children: ReactNode
  isCollapsible?: boolean
  defaultCollapsed?: boolean
}

/**
 * Base layout for account settings sections with consistent styling.
 */
export function SettingsSectionCard({
  id,
  title,
  description,
  icon,
  tone = 'default',
  className,
  children,
  isCollapsible = false,
  defaultCollapsed = false,
}: SettingsSectionCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible && defaultCollapsed)
  const [isExpanded, setIsExpanded] = useState(!isCollapsed)

  return (
    <section id={id} className={clsx('scroll-mt-28', className)}>
      <div
        className={clsx(
          'rounded-2xl border bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur transition-all duration-300 dark:bg-slate-900/80',
          tone === 'danger'
            ? 'border-red-200/70 dark:border-red-900/40'
            : 'border-slate-200/70 dark:border-slate-700/60'
        )}
      >
        <div
          className={clsx(
            "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
            isCollapsible && "cursor-pointer select-none"
          )}
          onClick={() => {
            if (isCollapsible) {
              const newCollapsed = !isCollapsed
              setIsCollapsed(newCollapsed)
              if (newCollapsed) setIsExpanded(false)
            }
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className={clsx(
                'flex h-12 w-12 items-center justify-center rounded-2xl border',
                tone === 'danger'
                  ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300'
                  : 'border-primary-100 bg-primary-50 text-primary-600 dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-primary-300'
              )}
            >
              {icon}
            </div>
            <div>
              <h2
                className={clsx(
                  'text-xl font-semibold text-slate-900 dark:text-white',
                  tone === 'danger' && 'text-red-600 dark:text-red-300'
                )}
              >
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
              ) : null}
            </div>
          </div>
          {isCollapsible && (
            <div className="flex items-center justify-center pt-2 sm:pt-4">
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </div>
          )}
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={isCollapsible ? { height: 0, opacity: 0 } : false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onAnimationComplete={() => {
                if (!isCollapsed) setIsExpanded(true)
              }}
              className={clsx(!isExpanded && "overflow-hidden")}
            >
              <div className="mt-6">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
