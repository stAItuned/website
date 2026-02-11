'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LinkedInIcon } from '@/components/icons/SocialIcons'
import { trackExternalLinkClicked } from '@/lib/analytics/trackEvent'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'
import { ScrollReveal, FadeIn } from '@/components/ui/Animations'
import { NewsletterSignup } from '@/components/ui/NewsletterSignup'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'

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

// =============================================================================
// Sub-components
// =============================================================================

/**
 * Single navigation column
 */
interface NavColumnProps {
  title: string
  links: Array<{ name: string; href: string; external?: boolean }>
  onCookieClick?: () => void
  showCookieButton?: boolean
  manageCookiesLabel?: string
}

function NavColumn({ title, links, onCookieClick, showCookieButton, manageCookiesLabel }: NavColumnProps) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-slate-400 hover:text-amber-300 transition-colors duration-200 text-xs flex items-center gap-1 group w-fit"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {link.name}
              </span>
              {link.external && (
                <svg className="w-2.5 h-2.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="text-amber-300 hover:text-amber-200 transition-colors duration-200 text-xs font-medium flex items-center gap-1 group w-fit"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {manageCookiesLabel || 'Gestisci cookie'}
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
function SocialLinks({ locale }: { locale: 'en' | 'it' }) {
  return (
    <div className="flex items-center gap-2">
      {socialLinks.map((social) => {
        const IconComponent = social.icon
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={locale === 'it' ? `Seguici su ${social.name}` : `Follow us on ${social.name}`}
            onClick={() => trackExternalLinkClicked('linkedin', social.name)}
            className="group flex items-center gap-2 text-slate-400 hover:text-amber-300 transition-all duration-300"
          >
            <span className="p-1.5 rounded-lg bg-slate-700/50 group-hover:bg-amber-500/20 transition-colors duration-300">
              <IconComponent className="w-4 h-4" />
            </span>
          </a>
        )
      })}
    </div>
  )
}

// =============================================================================
// Main Footer Component
// =============================================================================

export function Footer() {
  const { openPreferences } = useCookieConsent()
  const { locale } = useLearnLocale()
  const t = homeTranslations[locale].footer
  const currentYear = new Date().getFullYear()

  const localizedNavigation = {
    explore: {
      title: t.explore,
      links: [
        { name: t.blog, href: '/learn/articles' },
        { name: t.contribute, href: '/contribute' },
        { name: t.careeros, href: '/career-os' },
        { name: t.meet, href: '/meet' },
      ]
    },
    resources: {
      title: t.resources,
      links: [
        { name: t.audit, href: '/role-fit-audit' },
        { name: t.rss, href: '/rss.xml', external: true },
        { name: t.privacyPolicy, href: '/privacy' },
        { name: t.termsConditions, href: '/terms' },
        { name: t.cookiePolicy, href: '/cookie-policy' },
      ]
    },
    // Merged legal into resources for compactness or kept separate but very tight
    legal: {
      title: t.legal,
      links: [
        // moved to resources above or kept here if we want 3 columns
      ]
    }
  }

  return (
    <footer className="bg-primary-600 text-slate-200 border-t border-slate-500/10">
      <ScrollReveal threshold={0.1} triggerOnce={true}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 lg:py-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">

            {/* Column 1: Brand & Socials */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <Link href="/" className="block w-fit">
                  <Image
                    src="/assets/general/logo-text.png"
                    alt="stAItuned"
                    width={120}
                    height={26}
                    className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </Link>
                <div className="flex flex-col gap-1">
                  {/* Combined disclaimer + copyright + social for max compactness */}
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
                    {t.disclaimer}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-600">
                      © {currentYear}
                    </span>
                    <SocialLinks locale={locale} />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Columns: Navigation Links */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:gap-4">
              <FadeIn delay={100}>
                <NavColumn
                  title={localizedNavigation.explore.title}
                  links={localizedNavigation.explore.links}
                />
              </FadeIn>

              <FadeIn delay={200}>
                <NavColumn
                  title="Risorse & Legale"
                  links={localizedNavigation.resources.links} // Contains merged links
                  onCookieClick={openPreferences}
                  showCookieButton={true}
                  manageCookiesLabel={t.manageCookies}
                />
              </FadeIn>
            </div>

            {/* Right Column: Newsletter (Compact) */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-200 mb-1">
                <span className="text-sm">📬</span>
                <h3 className="text-xs font-semibold uppercase tracking-wider">{t.stayUpdated}</h3>
              </div>
              <div className="w-full">
                <NewsletterSignup source="footer" variant="inline" showHeader={false} className="transform scale-95 origin-top-left" />
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </footer>
  )
}
