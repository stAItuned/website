'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge, AuthorBadge } from '@/lib/types/badge'
import { BadgeIcon } from './BadgeIcon'
import Link from 'next/link'

interface BadgeDetailModalProps {
    isOpen: boolean
    onClose: () => void
    badge: Badge
    earnedBadge?: AuthorBadge
}

export function BadgeDetailModal({ isOpen, onClose, badge, earnedBadge }: BadgeDetailModalProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
            />

            {/* Modal */}
            <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 pointer-events-auto overflow-hidden relative">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header with Icon */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 flex justify-center border-b border-slate-100 dark:border-slate-800">
                        <BadgeIcon badge={badge} earnedBadge={earnedBadge} size="xl" showGloss />
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-serif">
                            {badge.name.en}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {badge.description.en}
                        </p>

                        <div className="space-y-4 text-left bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 mb-6">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Requirements</h3>
                            <ul className="space-y-2">
                                {badge.criteria.map((c, i) => (
                                    <li key={i} className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-300">{c.label}</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{c.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {earnedBadge ? (
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Earned on {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                                </div>
                                <Link
                                    href={`/verify/${earnedBadge.credentialId}`}
                                    className="block w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/20"
                                >
                                    View Official Certificate
                                </Link>
                            </div>
                        ) : (
                            <div className="text-slate-400 text-sm italic">
                                Keep contributing to earn this badge!
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
