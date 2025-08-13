'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/components/SearchContext'
import { useSafePathname } from '@/components/SafeNavigation'
import { useAuth } from '@/components/auth/FirebaseAuthProvider'
import { UserMenu } from '@/components/auth/UserMenu'
import { signOutUser } from '@/lib/firebase/auth'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openSearch } = useSearch()
  const { user, loading } = useAuth()
  const pathname = useSafePathname()
  const isHomepage = pathname === '/'

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
    { name: 'Learn', path: '/learn' },
    { name: 'Meet', path: '/meet' },
  ]

  return (
    <>
      <header className={`fixed z-20 px-8 py-6 w-full transition-transform duration-300 ${!isScrolled ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-between items-start">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Image
              className="h-[30px] lg:h-[50px] w-auto hover:cursor-pointer"
              src={isHomepage ? "/assets/general/logo-text.png" : "/assets/general/logo-text-dark.png"}
              alt="stAItuned logo"
              width={200}
              height={50}
              priority
            />
          </Link>

          <nav className="fixed right-8 py-3 px-8 text-white rounded-full bg-primary-600 font-semibold text-xl flex space-x-4 lg:space-x-8 items-center">
            <div className="hidden lg:block">
              <ul className="flex items-center space-x-8">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`hover:text-secondary-500 transition ${
                        pathname === item.path ? 'text-secondary-500' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authentication Section */}
            {!loading && (
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
            
            <div className="rounded-full bg-primary-300 p-3 cursor-pointer hover:bg-primary-400 transition-colors" onClick={openSearch}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button 
              className="lg:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-64 h-full bg-primary-600 shadow-lg">
            <div className="flex flex-col p-8 pt-24">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`py-4 text-white text-lg font-semibold hover:text-secondary-500 transition border-b border-primary-500 ${
                    pathname === item.path ? 'text-secondary-500' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              {!loading && (
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
                onClick={() => {
                  openSearch()
                  setIsMenuOpen(false)
                }}
                className="flex items-center space-x-3 py-4 text-white text-lg font-semibold hover:text-secondary-500 transition border-b border-primary-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
