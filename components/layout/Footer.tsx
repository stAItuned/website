'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LinkedInIcon } from '@/components/icons/SocialIcons'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'
import { ScrollReveal, StaggerContainer, FadeIn } from '@/components/ui/Animations'
import { NewsletterSignup } from '@/components/ui/NewsletterSignup'

// =============================================================================
// Configuration
// =============================================================================

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/stai-tuned/',
    icon: LinkedInIcon
  },
]

const footerNavigation = {
  explore: {
    title: 'Esplora',
    links: [
      { name: 'Blog', href: '/learn' },
      { name: 'Lab', href: '/lab' },
      { name: 'Chi siamo', href: '/meet' },
      { name: 'Per le aziende', href: '/business' },
    ]
  },
  resources: {
    title: 'Risorse',
    links: [
      { name: 'RSS Feed', href: '/rss.xml', external: true },
      { name: 'Prodotti', href: '/prodotti' },
    ]
  },
  legal: {
    title: 'Legale',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
    ]
  }
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * Newsletter section with value proposition - compact version
 */
function NewsletterSection() {
  return (
    <div className="lg:col-span-2">
      <div className="bg-gradient-to-r from-primary-500/40 to-primary-600/60 rounded-xl p-4 border border-slate-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl">📬</span>
            <h3 className="text-sm font-semibold text-white whitespace-nowrap">
              Newsletter AI
            </h3>
          </div>
          <div className="flex-1">
            <NewsletterSignup source="footer" variant="inline" showHeader={false} />
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center sm:text-left">
          Niente spam · Disiscriviti quando vuoi
        </p>
      </div>
    </div>
  )
}

/**
 * Single navigation column
 */
interface NavColumnProps {
  title: string
  links: Array<{ name: string; href: string; external?: boolean }>
  onCookieClick?: () => void
  showCookieButton?: boolean
}

function NavColumn({ title, links, onCookieClick, showCookieButton }: NavColumnProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-slate-300 hover:text-amber-300 transition-colors duration-200 text-sm flex items-center gap-1 group"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {link.name}
              </span>
              {link.external && (
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </Link>
          </li>
        ))}
        {showCookieButton && onCookieClick && (
          <li>
            <button
              type="button"
              onClick={onCookieClick}
              className="text-amber-300 hover:text-amber-200 transition-colors duration-200 text-sm font-medium flex items-center gap-1 group"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                Gestisci cookie
              </span>
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

/**
 * Social links row
 */
function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((social) => {
        const IconComponent = social.icon
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Seguici su ${social.name}`}
            className="group flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-all duration-300"
          >
            <span className="p-2 rounded-lg bg-slate-700/50 group-hover:bg-amber-500/20 transition-colors duration-300">
              <IconComponent className="w-5 h-5" />
            </span>
            <span className="text-sm font-medium hidden sm:inline">
              {social.name}
            </span>
          </a>
        )
      })}
    </div>
  )
}

/**
 * Bottom bar with logo, copyright, and disclaimer
 */
function BottomBar() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="border-t border-slate-500/30 pt-6 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and copyright */}
        <div className="flex items-center gap-4">
          <Link href="/" className="block">
            <Image
              src="/assets/general/logo-text.png"
              alt="stAItuned"
              width={140}
              height={30}
              className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          <span className="text-sm text-slate-400">
            © {currentYear} stAItuned
          </span>
        </div>

        {/* Social links */}
        <SocialLinks />
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-500 leading-relaxed mt-6 text-center md:text-left max-w-4xl">
        stAItuned è un progetto indipendente di formazione e sperimentazione su AI.
        Le attività vengono svolte al di fuori dell&apos;orario di lavoro dipendente e senza
        utilizzo di informazioni riservate o progetti interni ad altri datori di lavoro.
      </p>
    </div>
  )
}

// =============================================================================
// Main Footer Component
// =============================================================================

export function Footer() {
  const { openPreferences } = useCookieConsent()

  return (
    <footer className="bg-primary-600 text-slate-200">
      <ScrollReveal threshold={0.1} triggerOnce={true}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-14">

          {/* Newsletter Row - separate from nav */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-500/30">
              <div className="flex items-center gap-3">
                <span className="text-xl">📬</span>
                <span className="text-sm font-medium text-white">Resta aggiornato</span>
              </div>
              <div className="flex-1 max-w-md">
                <NewsletterSignup source="footer" variant="inline" showHeader={false} />
              </div>
              <Link
                href="/rss.xml"
                target="_blank"
                className="text-xs text-slate-400 hover:text-amber-300 transition flex items-center gap-1"
              >
                <span>📡</span> RSS Feed
              </Link>
            </div>
          </FadeIn>

          {/* Navigation Grid - 3 columns */}
          <StaggerContainer staggerDelay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">

              <FadeIn>
                <NavColumn
                  title={footerNavigation.explore.title}
                  links={footerNavigation.explore.links}
                />
              </FadeIn>

              <FadeIn delay={100}>
                <NavColumn
                  title={footerNavigation.resources.title}
                  links={footerNavigation.resources.links}
                />
              </FadeIn>

              <FadeIn delay={200}>
                <NavColumn
                  title={footerNavigation.legal.title}
                  links={footerNavigation.legal.links}
                  onCookieClick={openPreferences}
                  showCookieButton={true}
                />
              </FadeIn>

            </div>
          </StaggerContainer>

          {/* Bottom bar */}
          <FadeIn delay={300}>
            <BottomBar />
          </FadeIn>

        </div>
      </ScrollReveal>
    </footer>
  )
}
