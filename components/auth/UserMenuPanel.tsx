import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { User } from 'firebase/auth'
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Crown,
  FilePenLine,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound
} from 'lucide-react'

interface UserMenuPanelProps {
  user: User
  isWriter: boolean
  isAdmin: boolean
  menuId: string
  onClose: () => void
  onSignOut: () => void
}

/**
 * Dropdown panel for authenticated user actions.
 */
export function UserMenuPanel({
  user,
  isWriter,
  isAdmin,
  menuId,
  onClose,
  onSignOut,
}: UserMenuPanelProps) {
  const displayName = user.displayName || 'User'
  const initials = (displayName || user.email || 'U').charAt(0).toUpperCase()
  const baseItemClasses =
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300'

  const MenuLink = ({
    href,
    icon: Icon,
    label,
    tone = 'default',
  }: {
    href: string
    icon: typeof UserRound
    label: string
    tone?: 'default' | 'accent' | 'premium'
  }) => {
    const isPremium = tone === 'premium'

    return (
      <Link
        href={href}
        className={clsx(
          baseItemClasses,
          tone === 'accent' &&
          'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20',
          tone === 'default' &&
          'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/70',
          isPremium &&
          'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-transparent'
        )}
        onClick={onClose}
        role="menuitem"
      >
        <span
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300',
            !isPremium && 'border',
            tone === 'accent' &&
            'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300',
            tone === 'default' &&
            'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
            isPremium && 'bg-white/20 text-slate-900'
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex-1 font-bold">{label}</span>
        <ChevronDown
          className={clsx(
            "h-3.5 w-3.5 -rotate-90 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5",
            isPremium ? "text-slate-900" : ""
          )}
        />
      </Link>
    )
  }

  return (
    <div
      id={menuId}
      role="menu"
      className="absolute right-0 mt-3 w-72 max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 z-50 animate-slide-down"
    >
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800">
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-[2px]">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={displayName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full bg-white object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {initials}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </span>
            {isWriter ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700 dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-primary-300">
                <FilePenLine className="h-3 w-3" />
                Writer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <UserRound className="h-3 w-3" />
                Reader
              </span>
            )}
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
                <Crown className="h-3 w-3" />
                Admin
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Your Space</div>
        <MenuLink href="/account/settings" icon={Settings} label="Account settings" />
        <MenuLink href="/bookmarks" icon={Bookmark} label="Saved bookmarks" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Creator Tools</div>
        {isWriter ? (
          <>
            <MenuLink href="/contribute/draft" icon={FilePenLine} label="Start a new draft" tone="premium" />
            <MenuLink href="/account/writer-profile" icon={UserRound} label="Writer profile" />
          </>
        ) : (
          <MenuLink href="/contribute/become-writer" icon={Sparkles} label="Become a writer" tone="premium" />
        )}
      </div>

      {isAdmin ? (
        <div className="mt-4 space-y-2">
          <div className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Admin</div>
          <MenuLink href="/admin/reviews" icon={ShieldCheck} label="Review drafts" />
        </div>
      ) : null}

      <div className="mt-4 border-t border-slate-200/70 pt-3 dark:border-slate-700/80">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          role="menuitem"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            <LogOut className="h-4 w-4" />
          </span>
          Sign out
        </button>
      </div>
    </div>
  )
}
