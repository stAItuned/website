'use client'

import React from 'react'
import Image from 'next/image'
import { Badge, AuthorBadge } from '@/lib/types/badge'
import { cn } from '@/lib/utils'
import { getBadgeImageSource } from '@/lib/badges/badge-utils'

interface BadgeCardProps {
    badge: Badge
    earnedBadge?: AuthorBadge  // Contains the credentialId
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    showId?: boolean  // Whether to show the credential ID
}

/**
 * BadgeCard - Displays a badge using the PNG image with an optional credential ID overlay.
 * Use this for displaying earned badges with their unique verification ID.
 */
export function BadgeCard({
    badge,
    earnedBadge,
    size = 'md',
    className,
    showId = true
}: BadgeCardProps) {

    // Size dimensions for the badge image
    const sizes = {
        sm: { width: 80, height: 88, idFontSize: 'text-[8px]' },
        md: { width: 120, height: 132, idFontSize: 'text-[10px]' },
        lg: { width: 180, height: 198, idFontSize: 'text-xs' },
        xl: { width: 280, height: 308, idFontSize: 'text-sm' },
    }

    const { width, height, idFontSize } = sizes[size]

    const imageSrc = getBadgeImageSource(badge.icon)
    const credentialId = earnedBadge?.credentialId

    return (
        <div className={cn("relative inline-flex flex-col items-center", className)}>
            {/* Badge Image */}
            <div className="relative">
                <Image
                    src={imageSrc}
                    alt={badge.name.en}
                    width={width}
                    height={height}
                    className="drop-shadow-xl"
                    priority={size === 'lg' || size === 'xl'}
                    onError={(e) => {
                        // Fallback to a default generic badge if specific PNG missing
                        e.currentTarget.src = "/badges/contributor.png"
                    }}
                />
            </div>

            {/* Credential ID - positioned below the badge */}
            {showId && credentialId && (
                <div
                    className={cn(
                        "mt-1 px-2 py-0.5 rounded-full",
                        "bg-slate-900/80 backdrop-blur-sm",
                        "border border-slate-700/50",
                        idFontSize,
                        "font-mono font-medium text-slate-400",
                        "tracking-wider"
                    )}
                >
                    ID {credentialId}
                </div>
            )}
        </div>
    )
}

/**
 * Utility to get the badge image path for a given badge ID.
 * Useful when you need just the image path without the full component.
 */
export function getBadgeImagePath(badgeId: string): string {
    // Basic fallback logic matching what we do in the component
    // If we wanted to be perfectly consistent, we'd need the badge object or icon mapping here too
    // But for now, let's just return the dynamic path if it's likely to exist, 
    // or rely on the caller to handle 404s if they use this directly.
    // However, since we have the utility, let's try to use it if we can assume badgeId == icon name
    return getBadgeImageSource(badgeId)
}
