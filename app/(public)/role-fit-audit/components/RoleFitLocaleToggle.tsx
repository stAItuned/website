'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { roleFitAuditTranslations, type RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'

export default function RoleFitLocaleToggle({ locale }: { locale: RoleFitLocale }) {
  const t = roleFitAuditTranslations[locale].localeToggle
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const switchLocale = (nextLocale: RoleFitLocale) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', nextLocale)
    router.replace(`${pathname}?${params.toString()}`)
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
        aria-pressed={locale === 'it'}
        aria-label={t.italian}
        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
          locale === 'it'
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
        aria-pressed={locale === 'en'}
        aria-label={t.english}
        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
          locale === 'en'
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
