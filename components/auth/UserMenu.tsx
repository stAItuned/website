'use client'

import { useState, useRef, useEffect, useId } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { User } from 'firebase/auth'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { isAdmin } from '@/lib/firebase/admin-emails'
import { resolveProfileIdentity } from '@/lib/auth/profileIdentity'
import { ChevronDown } from 'lucide-react'
import { UserMenuPanel } from '@/components/auth/UserMenuPanel'

interface UserMenuProps {
  user: User
}

/**
 * Authenticated user dropdown with writer/admin shortcuts.
 */
export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const { isWriter, writerDisplayName, writerImageUrl, refresh } = useWriterStatus()
  const admin = isAdmin(user.email)
  const identity = resolveProfileIdentity({
    user,
    writerDisplayName,
    writerImageUrl,
  })

  useEffect(() => {
    if (isOpen) void refresh()
  }, [isOpen, refresh])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSignOut = async () => {
    const { signOutUser } = await import('@/lib/firebase/auth')
    await signOutUser()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
        className={clsx(
          'group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900',
          isOpen ? 'ring-2 ring-primary-200 dark:ring-primary-500/30' : 'hover:border-primary-200'
        )}
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-[2px]">
          {identity.imageUrl ? (
            <Image
              src={identity.imageUrl}
              alt={identity.displayName}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full bg-white object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {identity.initials}
            </span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
        </span>
        <span className="hidden md:block max-w-28 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {identity.shortName}
        </span>
        <ChevronDown className={clsx('h-4 w-4 text-slate-500 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen ? (
        <UserMenuPanel
          user={user}
          isWriter={Boolean(isWriter)}
          isAdmin={admin}
          profileDisplayName={identity.displayName}
          profileImageUrl={identity.imageUrl}
          menuId={menuId}
          onClose={() => setIsOpen(false)}
          onSignOut={handleSignOut}
        />
      ) : null}
    </div>
  )
}
