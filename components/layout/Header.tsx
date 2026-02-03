'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/components/SearchContext'
import { useSafePathname } from '@/components/SafeNavigation'
import { useAuth } from '@/components/auth/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'
import { LearnLocaleToggle } from '@/lib/i18n'


const DISABLE_AUTH = false
import { UserMenu } from '@/components/auth/UserMenu'

import { trackHeaderCTAClicked } from '@/lib/analytics/trackEvent'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { openSearch } = useSearch()
  const { user, loading } = useAuth()
  const { resolvedTheme } = useTheme()
  const pathname = useSafePathname()
  const isHomepage = pathname === '/'

  // Wait for component to mount before determining logo source
  // This prevents hydration mismatch between server and client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use the dark-text logo when in light mode, and the regular logo otherwise.
  // Requested: use /public/assets/general/logo-text-dark.png for light mode.
  // Default to dark theme logo during SSR to match the inline script behavior
  const logoSrc = mounted
    ? (resolvedTheme === 'dark'
      ? "/assets/general/logo-text.png"
      : "/assets/general/logo-text-dark.png")
    : "/assets/general/logo-text.png" // SSR default

  // Mobile drawer should always swap based on theme only (light uses dark text logo).
  const mobileLogoSrc = mounted
    ? (resolvedTheme === 'dark'
      ? "/assets/general/logo-text.png"
      : "/assets/general/logo-text-dark.png")
    : "/assets/general/logo-text.png" // SSR default

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
      name: 'Career OS',
      path: '/career-os',
      icon: <span aria-hidden className="text-lg">🚀</span>
    },
    {
      name: 'Role Fit Audit',
      path: '/role-fit-audit',
      icon: <span aria-hidden className="text-lg">🔎</span>
    },
    // {
    //   name: 'Topics',
    //   path: '/topics',
    //   icon: <span aria-hidden className="text-lg">🧭</span>
    // },
    {
      name: 'Blog',
      path: '/learn/articles',
      icon: <span aria-hidden className="text-lg">📚</span>
    },
    {
      name: 'Contribuisci',
      path: '/contribute',
      icon: <span aria-hidden className="text-lg">✍️</span>
    },
    {
      name: 'Chi siamo',
      path: '/meet',
      icon: <span aria-hidden className="text-lg">🧑‍🤝‍🧑</span>
    }
  ]
  const primaryCta = { name: '🎯', path: '/role-fit-audit' }

  return (
    <>
      <header className={`fixed top-0 z-50 px-4 w-full transition-all duration-500 ease-out ${isScrolled ? 'py-1 sm:py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg' : 'py-1.5 sm:py-3 bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg shadow-sm'}`}>
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="transition-transform duration-300 hover:scale-105">
            <Image
              src={logoSrc}
              alt="stAItuned logo"
              width={360}
              height={80}
              className={`h-auto hover:cursor-pointer transition-all duration-500 ease-out ${isScrolled ? 'w-24 sm:w-28 md:w-32 lg:w-36' : 'w-28 sm:w-32 md:w-36 lg:w-44'}`}
              sizes="(max-width: 640px) 5rem,
                     (max-width: 768px) 7rem,
                     (max-width: 1024px) 9rem,
                     (max-width: 1280px) 11rem,
                     13rem"
              priority={isHomepage}
              loading={isHomepage ? "eager" : "lazy"}
            />
          </Link>

          <nav className="stai-glass-panel stai-nav relative z-10 ml-auto flex items-center gap-1 sm:gap-2 lg:gap-3 rounded-full px-1.5 sm:px-2 py-1.5 font-semibold text-sm border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-slate-900/5 backdrop-blur transition-all duration-400">
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
                        className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ease-out ${active ? 'text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-primary-900/30 shadow-md scale-105' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-primary-600 dark:hover:text-primary-300 hover:scale-110 hover:shadow-md'}`}
                      >
                        <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                          {item.icon}
                        </span>
                        <span className="sr-only">{item.name}</span>
                        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 translate-y-1.5 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-md transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 dark:bg-white dark:text-slate-900 whitespace-nowrap">
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
                    aria-label="Sign In"
                    className="group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ease-out text-slate-800 dark:text-slate-100 hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white hover:scale-110 hover:shadow-lg"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search)
                      }
                    }}
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="sr-only">Sign In</span>
                    <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 translate-y-1.5 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-md transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 dark:bg-white dark:text-slate-900 whitespace-nowrap">
                      Sign In
                    </span>
                  </Link>
                )}
              </div>
            )}

            {!pathname?.includes('/learn/') || pathname.split('/').filter(Boolean).length <= 2 ? (
              <div className="hidden lg:flex items-center mr-2">
                <LearnLocaleToggle />
              </div>
            ) : null}

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

          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-50 lg:hidden flex items-start justify-end transition-all duration-400 ${isMenuOpen ? 'pointer-events-auto bg-slate-900/50 dark:bg-black/80 backdrop-blur-md' : 'pointer-events-none bg-transparent backdrop-blur-0'}`}
          style={{ transitionProperty: 'background,backdrop-filter' }}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`stai-drawer w-full max-w-xs h-full rounded-t-2xl flex flex-col pt-0 pb-8 px-0 relative transform transition-all duration-500 ease-out ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            style={{ transitionProperty: 'transform,opacity', willChange: 'transform' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile Menu Header with Logo and Close Button */}
            <div className="relative flex items-center justify-between px-5 pt-5 pb-3 border-b stai-border animate-slide-down">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 animate-fade-in">Menu</span>
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
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
                className="stai-icon-button w-10 h-10 !p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 transition-transform duration-300 hover:rotate-90"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-7 h-7 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!pathname?.includes('/learn/') || pathname.split('/').filter(Boolean).length <= 2 ? (
              <div className="px-5 pt-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border-b stai-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lingua / Language</span>
                <LearnLocaleToggle />
              </div>
            ) : null}

            <div className="flex flex-col pt-5 gap-2.5 px-5 stai-text">
              {navigation.map((item, index) => {
                const active = pathname === item.path
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`stai-drawer-link flex items-center gap-3 py-4 text-lg font-semibold border-b stai-border rounded-lg px-3 mb-1 transition-all duration-300 hover:translate-x-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 ${active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200 translate-x-1' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'slideRight 0.4s ease-out forwards'
                    }}
                  >
                    <span className="text-xl transition-transform duration-300 hover:scale-125 hover:rotate-12">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              })}


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
                      onClick={() => {
                        setIsMenuOpen(false)
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search)
                        }
                      }}
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
