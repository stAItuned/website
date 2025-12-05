'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LinkedInIcon } from '@/components/icons/SocialIcons'
import { useCookieConsent } from '@/components/cookies/CookieConsentProvider'
import { ScrollReveal, StaggerContainer, FadeIn } from '@/components/ui/Animations'

const socialLinks = [
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/company/stai-tuned/',
    icon: LinkedInIcon
  },
  // {
  //   name: 'instagram', 
  //   url: 'https://www.instagram.com/stai.tuned/',
  //   icon: InstagramIcon
  // },
  // {
  //   name: 'facebook',
  //   url: 'https://www.facebook.com/stAItuned',
  //   icon: FacebookIcon
  // },
  // {
  //   name: 'tiktok',
  //   url: 'https://www.tiktok.com/@staituned?lang=en',
  //   icon: TikTokIcon
  // }
]

export function Footer() {
  const { openPreferences } = useCookieConsent()

  return (
    <footer className="px-8 py-5 bg-primary-600 text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.name} icon`}
                className="w-8 h-8 text-slate-200 opacity-60 hover:opacity-100 transition"
              >
                <IconComponent className="w-full h-full" />
              </a>
            )
          })}
        </div>
        <div className="flex items-center gap-6 text-xs uppercase tracking-wide text-slate-200/90">
          <Link href="/meet" className="transition hover:text-white">
            Chi siamo
          </Link>
          <Link href="/lab" className="transition hover:text-white">
            Lab
          </Link>
          <Link href="/privacy" className="transition hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/cookie-policy" className="transition hover:text-white">
            Cookie Policy
          </Link>
          <button
            type="button"
            onClick={openPreferences}
            className="font-semibold tracking-[0.2em] text-amber-200 underline-offset-2 transition hover:text-white"
          >
            Gestisci i cookie
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Image
            src="/assets/general/logo-text.png"
            alt="stAItuned"
            width={140}
            height={30}
            className="h-8 w-auto opacity-90"
          />
          <p className="text-slate-200/80">© 2024 stAItuned. All rights reserved.</p>
        </div>
        <p className="w-full text-[11px] text-slate-200/80 leading-relaxed">
          stAItuned è un progetto indipendente di formazione e sperimentazione su AI. Le attività vengono svolte al di fuori dell’orario di lavoro dipendente e senza utilizzo di informazioni riservate o progetti interni ad altri datori di lavoro.
        </p>
      </div>
    </footer>
  )
}
