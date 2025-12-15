'use client'

import { usePathname } from 'next/navigation'

/**
 * TickerSpacer - Adds bottom spacing only on the home page
 * to prevent the fixed ticker from covering the footer
 */
export function TickerSpacer() {
    const pathname = usePathname()

    // Only show spacer on home page where the fixed ticker is displayed
    if (pathname !== '/') {
        return null
    }

    return <div className="h-24" aria-hidden="true" />
}
