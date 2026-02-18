
'use client'

import React from 'react'
import Image from 'next/image'
import type { AuthorBadge, Badge } from '@/lib/types/badge'
import { cn } from '@/lib/utils'
import { getBadgeImageSource } from '@/lib/badges/badge-utils'

interface BadgeIconProps {
    badge: Badge
    earnedBadge?: AuthorBadge
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    showGloss?: boolean // Kept for API compatibility but unused with PNGs
}

const BADGE_SIZES = {
    xs: { width: 40, height: 44 },
    sm: { width: 80, height: 88 },
    md: { width: 120, height: 132 },
    lg: { width: 200, height: 220 },
    xl: { width: 300, height: 330 },
} as const

export function BadgeIcon({
    badge,
    earnedBadge,
    size = 'md',
    className,
}: BadgeIconProps) {
    const { width, height } = BADGE_SIZES[size]

    // Use the icon from definition, following naming convention
    const imageSrc = getBadgeImageSource(badge.icon)

    const credentialId = earnedBadge?.credentialId

    return (
        <div className={cn("relative inline-flex flex-col items-center justify-center font-sans select-none group", className)}>
            <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105" style={{ width }}>
                <Image
                    src={imageSrc}
                    alt={badge.name.en}
                    width={width}
                    height={height}
                    className="block h-auto w-full max-w-full drop-shadow-lg"
                    sizes={`${width}px`}
                    priority={size === 'lg' || size === 'xl'}
                    onError={(e) => {
                        // Fallback to a generic badge when a specific PNG is missing.
                        e.currentTarget.src = "/badges/contributor.png"
                    }}
                />
            </div>

            {/* Optional ID display for larger sizes if earned */}
            {(size === 'lg' || size === 'xl') && credentialId && (
                <div className="mt-2 px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-700/50">
                    <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider">
                        {credentialId}
                    </span>
                </div>
            )}
        </div>
    )
}
