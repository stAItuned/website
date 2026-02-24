'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  CAREER_OS_QUERY_PARAM,
  isCareerOSLocale,
  type CareerOSLocale,
} from '@/lib/i18n/career-os-translations'

const LOCALE_STORAGE_KEY = 'staituned-locale'

/**
 * Sync Career OS locale from saved user preference when no `lang` query is provided.
 * SEO-safe: no server redirect and no canonical changes.
 */
export default function CareerOSLocaleBootstrap() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const currentLang = searchParams.get(CAREER_OS_QUERY_PARAM)
    if (currentLang) return

    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (!isCareerOSLocale(saved)) return

    const preferredLocale = saved as CareerOSLocale
    // Keep default locale URL clean; only pin query for non-default locale.
    if (preferredLocale === 'it') return

    const params = new URLSearchParams(searchParams.toString())
    params.set(CAREER_OS_QUERY_PARAM, preferredLocale)
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }, [pathname, router, searchParams])

  return null
}
