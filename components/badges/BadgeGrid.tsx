'use client'

import React from 'react'
import { Badge, AuthorBadge } from '@/lib/types/badge'
import { BadgeIcon } from './BadgeIcon'
import { BadgeTooltip } from './BadgeTooltip'
import { BadgeDetailModal } from './BadgeDetailModal'
import { cn } from '@/lib/utils'

interface BadgeGridProps {
    badges: Badge[] // All possible badges definition
    earnedBadges: AuthorBadge[]
    className?: string
    showLocked?: boolean
}

export function BadgeGrid({ badges, earnedBadges, className, showLocked = true }: BadgeGridProps) {
    // Map earned badges for quick lookup
    const earnedMap = new Map(earnedBadges.map(b => [b.badgeId, b]));

    // Sort: Earned first, then by tier value (Simple heuristic)
    const sortedBadges = [...badges].sort((a, b) => {
        const aEarned = earnedMap.has(a.id);
        const bEarned = earnedMap.has(b.id);

        if (aEarned && !bEarned) return -1;
        if (!aEarned && bEarned) return 1;

        // If both earned or both locked, sort by tier importance (custom order)
        const tierOrder = { gold: 3, silver: 2, bronze: 1, contributor: 0, special: 4 };
        // @ts-ignore
        return (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
    });

    const [selectedBadge, setSelectedBadge] = React.useState<Badge | null>(null);

    return (
        <>
            <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6", className)}>
                {sortedBadges.map(badge => {
                    const earned = earnedMap.get(badge.id);
                    const isLocked = !earned;

                    if (isLocked && !showLocked) return null;

                    return (
                        <div key={badge.id} onClick={() => setSelectedBadge(badge)}>
                            <BadgeTooltip badge={badge} earnedBadge={earned}>
                                <div className={cn("flex flex-col items-center gap-2", isLocked && "opacity-40 grayscale filter")}>
                                    <BadgeIcon
                                        badge={badge}
                                        earnedBadge={earned} // Correct prop name for new BadgeIcon
                                        size="md"
                                    />
                                    {isLocked && (
                                        <div className="mt-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/50 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                            Not earned
                                        </div>
                                    )}
                                </div>
                            </BadgeTooltip>
                        </div>
                    );
                })}
            </div>

            {selectedBadge && (
                <BadgeDetailModal
                    isOpen={!!selectedBadge}
                    onClose={() => setSelectedBadge(null)}
                    badge={selectedBadge}
                    earnedBadge={earnedMap.get(selectedBadge.id)}
                />
            )}
        </>
    )
}
