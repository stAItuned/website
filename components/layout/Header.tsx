'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/components/SearchContext'
import { useSafePathname } from '@/components/SafeNavigation'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openSearch } = useSearch()
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

          <nav className="fixed right-8 py-3 px-8 text-white rounded-full bg-primary-600 font-semibold text-xl flex space-x-0 lg:space-x-16 items-center">
            <div className="hidden lg:block mr-16">
              <ul className="flex flex-col lg:flex-row py-16 lg:py-0 space-y-8 lg:space-y-0 space-x-0 lg:space-x-16">
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
            
            <div className="rounded-full bg-primary-300 absolute right-0 p-4 cursor-pointer hover:bg-primary-400 transition-colors" onClick={openSearch}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button 
              className="lg:hidden text-white pr-12"
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
