'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/components/SearchContext'
import { useSafePathname } from '@/components/SafeNavigation'
import { useAuth } from '@/components/auth/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'

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
  const logoSrc =
    isHomepage || resolvedTheme === 'dark'
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

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Per le aziende', path: '/aziende' },
    { name: 'Blog', path: '/learn' },
    { name: 'Chi siamo', path: '/meet' },
  ]

  return (
    <>
  <header className={`fixed z-50 px-4 py-3 sm:px-8 sm:py-6 w-full transition-transform duration-300 ${!isScrolled ? 'sm:fixed sm:translate-y-0' : 'sm:fixed sm:-translate-y-full'}`}>
        <div className="flex justify-between items-start">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Image
              src={logoSrc}
              alt="stAItuned logo"
              width={600}
              height={133}
              className="h-auto w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 hover:cursor-pointer"
              sizes="(max-width: 640px) 5rem,
                     (max-width: 768px) 7rem,
                     (max-width: 1024px) 9rem,
                     (max-width: 1280px) 11rem,
                     13rem"
              priority={isHomepage}
              loading={isHomepage ? "eager" : "lazy"}
            />
          </Link>

          <nav className="stai-glass-panel stai-nav fixed right-4 top-4 z-50 flex items-center gap-3 lg:gap-6 rounded-2xl px-4 py-2.5 font-semibold text-base">
            <div className="hidden lg:block">
              <ul className="flex items-center space-x-8">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`stai-link ${pathname === item.path ? 'stai-link--active' : ''}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
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
              className="stai-icon-button"
              onClick={openSearch}
              aria-label="Open search"
            >
              <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button
              type="button"
              className="lg:hidden stai-icon-button w-12 h-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
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
            <div className="relative flex items-center justify-between px-6 pt-6 pb-4 border-b stai-border">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                <Image
                  src={logoSrc}
                  alt="stAItuned logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto"
                  priority={isHomepage}
                  loading={isHomepage ? "eager" : "lazy"}
                />
              </Link>
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
            <div className="flex flex-col pt-6 gap-3 px-6 stai-text">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`stai-drawer-link py-5 text-xl font-semibold border-b stai-border rounded-lg px-2 mb-1 ${
                    pathname === item.path ? 'stai-drawer-link--active' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
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
