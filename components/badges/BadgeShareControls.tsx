'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthContext'
import { getAuthorByEmail } from '@/lib/getAuthorByEmail'

interface BadgeShareControlsProps {
    credentialId: string
    title: string
    authorSlug: string
}

/**
 * Share controls for a badge. Visible only to the authenticated badge owner.
 */
export function BadgeShareControls({ credentialId, title, authorSlug }: BadgeShareControlsProps) {
    const { user, loading } = useAuth()
    const [copied, setCopied] = useState(false)

    if (loading) return null

    const authorName = getAuthorByEmail(user?.email)
    const ownerSlug = authorName ? authorName.trim().replaceAll(' ', '-') : null
    const isOwner = Boolean(user && ownerSlug && ownerSlug === authorSlug)

    if (!isOwner) {
        return (
            <div className="flex justify-center">
                {user ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        You can only share your own badge.
                    </p>
                ) : (
                    <Link
                        href="/signin"
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                        Sign in to share your badge
                    </Link>
                )}
            </div>
        )
    }

    const getShareUrl = () => `${window.location.origin}/verify/${encodeURIComponent(credentialId)}`

    const handleCopy = () => {
        const url = getShareUrl()
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleLinkedInShare = () => {
        const url = encodeURIComponent(getShareUrl())
        const text = encodeURIComponent(`I'm excited to share that I've earned the ${title} badge on stAItuned! 🚀\n\nVerify my credential here:`)
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank')
    }

    return (
        <div className="flex justify-center gap-3">
            <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                {copied ? (
                    <>
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Link
                    </>
                )}
            </button>

            <button
                onClick={handleLinkedInShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Share on LinkedIn
            </button>
        </div>
    )
}
