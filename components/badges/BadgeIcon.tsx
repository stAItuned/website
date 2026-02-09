
'use client'

import React from 'react'
import Image from 'next/image'
import { Badge, BadgeTier } from '@/lib/types/badge'
import { cn } from '@/lib/utils'
import { getBadgeImageSource } from '@/lib/badges/badge-utils'

interface BadgeIconProps {
    badge: Badge
    earnedBadge?: any // Using any to be flexible with AuthorBadge type
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    showGloss?: boolean // Kept for API compatibility but unused with PNGs
}

export function BadgeIcon({
    badge,
    earnedBadge,
    size = 'md',
    className,
}: BadgeIconProps) {

    // Dimensions map - adjusted for PNG display
    const sizes = {
        xs: { width: 40, height: 44 },
        sm: { width: 80, height: 88 },
        md: { width: 120, height: 132 },
        lg: { width: 200, height: 220 },
        xl: { width: 300, height: 330 },
    }

    const { width, height } = sizes[size]

    // Use the icon from definition, following naming convention
    const imageSrc = getBadgeImageSource(badge.icon)
    // But Next/Image requires known src at build time or external URL

    const credentialId = earnedBadge?.credentialId

    return (
        <div className={cn("relative inline-flex flex-col items-center justify-center font-sans select-none group", className)}>
            <div className="relative transition-transform duration-300 group-hover:scale-105">
                <Image
                    src={imageSrc}
                    alt={badge.name.en}
                    width={width}
                    height={height}
                    className="drop-shadow-lg"
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                    }}
                    // Add error handling placeholder if needed
                    onError={(e) => {
                        // Fallback to a default generic badge if specific PNG missing
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

