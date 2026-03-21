'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  BUSINESS_QUERY_PARAM,
  businessTranslations,
  normalizeBusinessLocale,
} from '@/lib/i18n/business-translations'

export default function BusinessLocaleToggle() {
  const searchParams = useSearchParams()
  const locale = normalizeBusinessLocale(searchParams.get(BUSINESS_QUERY_PARAM))
  const isItalian = locale === 'it'
  const t = businessTranslations[locale].localeToggle

  return (
    <div
      className="group inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100 p-1 text-xs font-bold transition-all hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
      aria-label={t.label}
      role="group"
    >
      <Link
        href="/business?lang=it"
        aria-label={t.italian}
        className={`flex items-center gap-1 rounded-full px-2 py-1 transition-all duration-200 ${
          isItalian
            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-slate-700 dark:text-white dark:ring-white/5'
            : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400'
        }`}
      >
        <span aria-hidden="true">🇮🇹</span>
        <span className="hidden sm:inline">IT</span>
        <span className="sr-only">{t.italian}</span>
      </Link>
      <Link
        href="/business?lang=en"
        aria-label={t.english}
        className={`flex items-center gap-1 rounded-full px-2 py-1 transition-all duration-200 ${
          isItalian
            ? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400'
            : 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-slate-700 dark:text-white dark:ring-white/5'
        }`}
      >
        <span aria-hidden="true">🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
        <span className="sr-only">{t.english}</span>
      </Link>
    </div>
  )
}
