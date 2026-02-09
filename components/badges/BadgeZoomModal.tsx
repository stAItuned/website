'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge, AuthorBadge } from '@/lib/types/badge'
import { cn } from '@/lib/utils'
import { getBadgeImageSource } from '@/lib/badges/badge-utils'

interface BadgeZoomModalProps {
    badge: Badge
    className?: string
    authorName?: string
    earnedBadge?: AuthorBadge
}

/**
 * Interactive badge display with zoom capability.
 * Click to open a fullscreen modal with the badge image.
 */
export function BadgeZoomModal({ badge, className, authorName, earnedBadge }: BadgeZoomModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Use the optimized utility to get the badge image
    const imageSrc = getBadgeImageSource(badge.icon)

    return (
        <>
            {/* Clickable Badge Preview */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "relative group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl",
                    className
                )}
                aria-label={`View ${badge.name.en} badge in full size`}
            >
                {/* Outer Glow */}
                <div className="absolute -inset-3 bg-gradient-to-b from-white/20 to-white/5 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>

                {/* Badge Container */}
                <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 p-3 rounded-2xl shadow-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                    <Image
                        src={imageSrc}
                        alt={badge.name.en}
                        width={300}
                        height={330}
                        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        priority
                        onError={(e) => {
                            e.currentTarget.src = "/badges/contributor.png"
                        }}
                    />

                    {/* ID Overlay if earned */}
                    {earnedBadge?.credentialId && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-700/50">
                            <span className="text-[8px] font-mono text-slate-400 tracking-wider">
                                {earnedBadge.credentialId}
                            </span>
                        </div>
                    )}

                    {/* Zoom Hint */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 rounded-2xl transition-colors">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-lg flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            Click to zoom
                        </span>
                    </div>
                </div>
            </button>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-zoom-out"
                        />

                        {/* Modal Content */}
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div
                                className="relative pointer-events-auto max-w-lg w-full"
                                onClick={() => setIsOpen(false)}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                                    aria-label="Close"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Large Badge Image */}
                                <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl ring-1 ring-white/10">
                                    <Image
                                        src={imageSrc}
                                        alt={badge.name.en}
                                        width={500}
                                        height={550}
                                        className="drop-shadow-2xl mx-auto"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                        priority
                                        onError={(e) => {
                                            e.currentTarget.src = "/badges/contributor.png"
                                        }}
                                    />

                                    {/* Large ID Overlay if earned */}
                                    {earnedBadge?.credentialId && (
                                        <div className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900/90 backdrop-blur-sm rounded-full border border-slate-700/50">
                                            <span className="text-xs sm:text-sm font-mono text-slate-400 tracking-widest font-bold">
                                                ID {earnedBadge.credentialId}
                                            </span>
                                        </div>
                                    )}

                                    {/* Badge Name & Author */}
                                    <div className="mt-6 text-center">
                                        {authorName && (
                                            <p className="text-primary-300 font-medium text-sm uppercase tracking-widest mb-1">
                                                Awarded to {authorName}
                                            </p>
                                        )}
                                        <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                                            {badge.name.en}
                                        </h3>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {badge.description.en}
                                        </p>
                                    </div>
                                </div>

                                {/* Hint */}
                                <p className="text-center text-white/50 text-xs mt-4">
                                    Click anywhere to close
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
