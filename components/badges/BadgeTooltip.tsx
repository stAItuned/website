'use client'

import React from 'react'
import { Badge, AuthorBadge } from '@/lib/types/badge'
import { BadgeIcon } from './BadgeIcon'
import Tooltip from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

interface BadgeTooltipProps {
    badge: Badge
    earnedBadge?: AuthorBadge
    children: React.ReactNode
    className?: string
}

export function BadgeTooltip({ badge, earnedBadge, children, className }: BadgeTooltipProps) {

    const tooltipContent = (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-w-xs shadow-xl min-w-[280px]">
            <div className="relative p-4 flex gap-4">
                {/* Mini Icon in Tooltip */}
                <div className="flex-shrink-0">
                    <BadgeIcon badge={badge} size="xs" showGloss={false} />
                </div>

                <div className="space-y-2 flex-1">
                    <div>
                        <h4 className="font-bold text-white text-base leading-tight">{badge.name['en']}</h4>
                        <p className="text-slate-400 text-xs italic mt-0.5">{badge.description['en']}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                        {badge.criteria.map((c, i) => (
                            <div key={i} className="flex justify-between text-xs border-b border-slate-800 pb-1 last:border-0">
                                <span className="text-slate-500">{c.label}</span>
                                <span className="text-primary-400 font-medium">{c.value}</span>
                            </div>
                        ))}
                    </div>

                    {earnedBadge && (
                        <div className="pt-2 mt-1 border-t border-slate-700">
                            <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                                ✓ Earned on {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                            </p>
                            <p className="text-[10px] font-mono text-slate-600 truncate py-0.5">
                                ID: {earnedBadge.credentialId}
                            </p>
                            <a
                                href={`/verify/${earnedBadge.credentialId}`}
                                className="block mt-1 text-[10px] text-primary-400 hover:text-primary-300 underline underline-offset-2"
                            >
                                View Official Credential &rarr;
                            </a>
                        </div>
                    )}
                </div>
            </div>
            {/* Footer strip */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${getTierGradient(badge.tier)}`} />
        </div>
    )

    return (
        <Tooltip
            content={tooltipContent}
            contentClassName="!p-0 !bg-transparent !border-none !shadow-none !rounded-none"
            delayDuration={0}
        >
            <div className={cn("cursor-pointer transition-transform hover:scale-105 inline-block", className)}>
                {children}
            </div>
        </Tooltip>
    )
}

function getTierGradient(tier: string) {
    switch (tier) {
        case 'gold': return 'from-amber-400 to-amber-600';
        case 'silver': return 'from-slate-300 to-slate-500';
        case 'bronze': return 'from-orange-300 to-orange-700';
        case 'special': return 'from-sky-400 to-indigo-500';
        default: return 'from-blue-500 to-blue-800';
    }
}
