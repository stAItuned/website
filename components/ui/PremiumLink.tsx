import Link from 'next/link'
import { clsx } from 'clsx'
import { ReactNode } from 'react'

interface PremiumLinkProps {
    href: string
    children: ReactNode
    className?: string
    onClick?: () => void
}

/**
 * A primary Call-to-Action link with the "Premium" Golden Gradient style.
 * Matches the "Start Reading" button on the Home Page.
 */
export function PremiumLink({ href, children, className, onClick }: PremiumLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={clsx(
                'group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-7 py-4 text-base font-bold text-slate-900 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl sm:w-auto',
                className
            )}
        >
            {children}
        </Link>
    )
}
