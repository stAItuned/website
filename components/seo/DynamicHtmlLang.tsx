'use client'

import { useEffect } from 'react'

interface DynamicHtmlLangProps {
    lang: string
}

/**
 * Client component to dynamically update the <html lang="..."> attribute.
 * Next.js App Router root layout shares the <html> tag, so we use this
 * to override the language on specific pages (e.g. English articles).
 */
export function DynamicHtmlLang({ lang }: DynamicHtmlLangProps) {
    useEffect(() => {
        document.documentElement.lang = lang

        // Cleanup: revert to default 'it' when unmounting (navigating away)
        return () => {
            document.documentElement.lang = 'it'
        }
    }, [lang])

    return null
}
