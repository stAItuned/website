import Link from 'next/link'
import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

export interface AccountNavItem {
  id: string
  label: string
  icon: LucideIcon
  hidden?: boolean
}

interface AccountNavAction {
  href: string
  label: string
  icon: LucideIcon
  tone?: 'primary' | 'ghost'
}

interface AccountNavigationProps {
  items: AccountNavItem[]
  actions?: AccountNavAction[]
}

/**
 * Sticky side navigation for the account settings page.
 */
export function AccountNavigation({ items, actions = [] }: AccountNavigationProps) {
  const visibleItems = items.filter((item) => !item.hidden)

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 space-y-6">
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            On this page
          </p>
          <nav className="mt-4 space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>

        {actions.length > 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Quick Actions
            </p>
            <div className="mt-4 space-y-2">
              {actions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={clsx(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300',
                      action.tone === 'primary'
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:-translate-y-0.5 hover:shadow-lg'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
