import Link from 'next/link'
import type { AiEuActLocale, AiEuActTranslations } from '@/lib/i18n/ai-eu-act-translations'

interface AiEuActLocaleToggleProps {
  locale: AiEuActLocale
  t: AiEuActTranslations['localeToggle']
}

export default function AiEuActLocaleToggle({ locale, t }: AiEuActLocaleToggleProps) {
  return (
    <div
      role="group"
      aria-label={t.label}
      className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur"
    >
      <Link
        href="/ai-eu-act?lang=it"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === 'it' ? 'bg-amber-500 text-slate-900' : 'text-white/80 hover:text-white'
        }`}
      >
        <span aria-hidden="true" className="mr-1">🇮🇹</span>
        <span aria-hidden="true">IT</span>
        <span className="sr-only">{t.italian}</span>
      </Link>
      <Link
        href="/ai-eu-act?lang=en"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === 'en' ? 'bg-amber-500 text-slate-900' : 'text-white/80 hover:text-white'
        }`}
      >
        <span aria-hidden="true" className="mr-1">🇬🇧</span>
        <span aria-hidden="true">EN</span>
        <span className="sr-only">{t.english}</span>
      </Link>
    </div>
  )
}
