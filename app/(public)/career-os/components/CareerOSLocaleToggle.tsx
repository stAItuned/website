'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  careerOSTranslations,
  CAREER_OS_QUERY_PARAM,
  normalizeCareerOSLocale,
  type CareerOSLocale,
} from '@/lib/i18n/career-os-translations'

export default function CareerOSLocaleToggle({ locale }: { locale?: CareerOSLocale }) {
  const searchParams = useSearchParams()
  const activeLocale = normalizeCareerOSLocale(searchParams.get(CAREER_OS_QUERY_PARAM) ?? locale ?? 'it')
  const t = careerOSTranslations[activeLocale].localeToggle
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (nextLocale: CareerOSLocale) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(CAREER_OS_QUERY_PARAM, nextLocale)
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }

  return (
    <div
      className="group inline-flex items-center gap-0.5 p-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all hover:border-slate-300 dark:hover:border-slate-600"
      aria-label={t.label}
      role="group"
    >
      <button
        type="button"
        onClick={() => switchLocale('it')}
        aria-pressed={activeLocale === 'it'}
        aria-label={t.italian}
        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
          activeLocale === 'it'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
        }`}
      >
        <span>🇮🇹</span>
        <span className="hidden sm:inline">IT</span>
      </button>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        aria-pressed={activeLocale === 'en'}
        aria-label={t.english}
        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
          activeLocale === 'en'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
        }`}
      >
        <span>🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  )
}
