'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Learn', path: '/learn' },
    { name: 'Meet', path: '/meet' },
  ]

  return (
    <header className={`fixed z-20 px-8 py-6 w-full transition-transform duration-300 ${!isScrolled ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex justify-between items-start">
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <Image
            className="h-[30px] lg:h-[50px] hover:cursor-pointer"
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
          
          <div className="rounded-full bg-primary-300 absolute right-0 p-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button 
            className="lg:hidden text-white pr-12"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  )
}
