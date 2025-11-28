'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/components/SearchContext'
import { useSafePathname } from '@/components/SafeNavigation'
import { useAuth } from '@/components/auth/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'
import { CallModalTrigger } from '@/app/(public)/aziende/CallModalTrigger'

const DISABLE_AUTH = true
  // typeof process !== 'undefined'
  //   ? process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
  //   : false
import { UserMenu } from '@/components/auth/UserMenu'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openSearch } = useSearch()
  const { user, loading } = useAuth()
  const { resolvedTheme } = useTheme()
  const pathname = useSafePathname()
  const isHomepage = pathname === '/'
  // Use the dark-text logo when in light mode, and the regular logo otherwise.
  // Requested: use /public/assets/general/logo-text-dark.png for light mode.
  const logoSrc =
    resolvedTheme === 'dark'
      ? "/assets/general/logo-text.png"
      : "/assets/general/logo-text-dark.png"
  // Mobile drawer should always swap based on theme only (light uses dark text logo).
  const mobileLogoSrc =
    resolvedTheme === 'dark'
      ? "/assets/general/logo-text.png"
      : "/assets/general/logo-text-dark.png"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openSearch])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMenuOpen])

  const navigation = [
    {
      name: 'Per le aziende',
      path: '/aziende',
      icon: <span aria-hidden className="text-lg">🏢</span>
    },
    {
      name: 'Impara',
      path: '/learn',
      icon: <span aria-hidden className="text-lg">📚</span>
    },
    {
      name: 'Prodotti',
      path: '/prodotti',
      icon: <span aria-hidden className="text-lg">🛠️</span>
    },
    {
      name: 'Chi siamo',
      path: '/meet',
      icon: <span aria-hidden className="text-lg">🧑‍🤝‍🧑</span>
    }
  ]
  const primaryCta = { name: 'Prenota call', path: '/aziende#prenota-call' }

  return (
    <>
      <header className={`fixed top-0 z-50 px-4 w-full transition-all duration-300 ${isScrolled ? 'py-1 sm:py-1.5 bg-white/92 dark:bg-slate-900/92 backdrop-blur-md shadow-md' : 'py-1.5 sm:py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm'}`}>
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Image
              src={logoSrc}
              alt="stAItuned logo"
              width={360}
              height={80}
              className={`h-auto hover:cursor-pointer transition-all duration-300 ${isScrolled ? 'w-24 sm:w-28 md:w-32 lg:w-36' : 'w-28 sm:w-32 md:w-36 lg:w-44'}`}
              sizes="(max-width: 640px) 5rem,
                     (max-width: 768px) 7rem,
                     (max-width: 1024px) 9rem,
                     (max-width: 1280px) 11rem,
                     13rem"
              priority={isHomepage}
              loading={isHomepage ? "eager" : "lazy"}
            />
          </Link>

          <nav className="stai-glass-panel stai-nav relative z-10 ml-auto flex items-center gap-2 lg:gap-3 rounded-full px-2 py-1.5 font-semibold text-sm border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-slate-900/5 backdrop-blur">
            <div className="hidden lg:block pr-2 border-r border-slate-200/60 dark:border-slate-700/60">
              <ul className="flex items-center space-x-2">
                {navigation.map((item) => {
                  const active = pathname === item.path
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        aria-label={item.name}
                        aria-current={active ? 'page' : undefined}
                        className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${active ? 'text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-primary-900/30 shadow-sm' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-primary-600 dark:hover:text-primary-300'}`}
                      >
                        {item.icon}
                        <span className="sr-only">{item.name}</span>
                        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 translate-y-1.5 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-sm transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 dark:bg-white dark:text-slate-900 whitespace-nowrap">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Authentication Section */}
            {!DISABLE_AUTH && !loading && (
              <div className="hidden lg:flex items-center">
                {user ? (
                  <UserMenu user={user} />
                ) : (
                  <Link
                    href="/signin"
                    className="px-4 py-2 text-sm font-medium text-primary-600 bg-white rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
            
            <ThemeToggle />
            
            <button
              type="button"
              className="stai-icon-button relative group w-10 h-10"
              onClick={openSearch}
              aria-label="Open search"
            >
              <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 text-white px-2 py-1 text-[10px] font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100 shadow-sm dark:bg-white dark:text-slate-900">
                ⌘K / Ctrl+K
              </span>
            </button>
            
            <button
              type="button"
              className="lg:hidden stai-icon-button w-10 h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <CallModalTrigger className="hidden lg:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5 text-sm font-bold text-slate-900 shadow-md hover:shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
              {primaryCta.name}
            </CallModalTrigger>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-50 lg:hidden flex items-start justify-end transition-all duration-300 ${isMenuOpen ? 'pointer-events-auto bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm' : 'pointer-events-none bg-transparent backdrop-blur-0'}`}
          style={{ transitionProperty: 'background,backdrop-filter' }}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`stai-drawer w-full max-w-xs h-full rounded-t-2xl flex flex-col pt-0 pb-8 px-0 relative transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            style={{ transitionProperty: 'transform,opacity', willChange: 'transform' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile Menu Header with Logo and Close Button */}
            <div className="relative flex items-center justify-between px-5 pt-5 pb-3 border-b stai-border">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Menu</span>
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                <Image
                  src="/assets/general/logo-text-dark.png"
                  alt="stAItuned logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto block dark:hidden"
                  priority={isHomepage}
                  loading={isHomepage ? "eager" : "lazy"}
                />
                <Image
                  src="/assets/general/logo-text.png"
                  alt="stAItuned logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto hidden dark:block"
                  priority={isHomepage}
                  loading={isHomepage ? "eager" : "lazy"}
                />
                </Link>
              </div>
              <button
                type="button"
                className="stai-icon-button w-10 h-10 !p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-7 h-7 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col pt-5 gap-2.5 px-5 stai-text">
              {navigation.map((item) => {
                const active = pathname === item.path
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`stai-drawer-link flex items-center gap-3 py-4 text-lg font-semibold border-b stai-border rounded-lg px-3 mb-1 transition-all ${active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span> {item.name}</span>
                  </Link>
                )
              })}

              <CallModalTrigger
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-2.5 text-base font-bold text-slate-900 shadow-md hover:shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                onOpen={() => setIsMenuOpen(false)}
              >
                {primaryCta.name}
              </CallModalTrigger>
              
              {/* Mobile Authentication */}
              {!DISABLE_AUTH && !loading && (
                <div className="py-4 border-b border-primary-500">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-primary-500 rounded-lg">
                        {user.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-white"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-white text-sm font-semibold">
                              {user.displayName?.charAt(0) || user.email?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {user.displayName || 'User'}
                          </p>
                          <p className="text-primary-200 text-xs truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 px-2">
                        <Link
                          href="/writer"
                          className="flex items-center text-white text-base hover:text-secondary-500 transition p-2 rounded"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Writer Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center text-white text-base hover:text-secondary-500 transition p-2 rounded"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <button
                          onClick={async () => {
                            const { signOutUser } = await import('@/lib/firebase/auth')
                            await signOutUser()
                            setIsMenuOpen(false)
                          }}
                          className="flex items-center w-full text-left text-red-300 text-base hover:text-red-200 transition p-2 rounded"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/signin"
                      className="flex items-center justify-center w-full py-3 px-4 bg-white text-primary-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </Link>
                  )}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => {
                  openSearch()
                  setIsMenuOpen(false)
                }}
                className="flex items-center space-x-3 py-4 stai-drawer-link text-lg font-semibold border-b stai-border"
              >
                <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
