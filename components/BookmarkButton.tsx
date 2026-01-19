'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'
import { trackBookmarkAdded, trackBookmarkRemoved } from '@/lib/analytics'
import { event } from '@/lib/gtag'
import { useToast } from './ui/Toast'

interface BookmarkButtonProps {
    articleSlug: string
    className?: string
    showCount?: boolean
}

export function BookmarkButton({ articleSlug, className = '', showCount = false }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const { showToast } = useToast()

    // Check initial status
    useEffect(() => {
        if (user) {
            const checkBookmark = async () => {
                try {
                    const db = getFirestore(app)
                    const userDocRef = doc(db, 'users', user.uid)
                    const userDoc = await getDoc(userDocRef)

                    if (userDoc.exists()) {
                        const bookmarks = userDoc.data().bookmarks || []
                        setIsBookmarked(bookmarks.includes(articleSlug))
                    }
                } catch (error) {
                    console.error('Error checking bookmark:', error)
                }
            }
            checkBookmark()
        } else {
            setIsBookmarked(false)
        }
    }, [articleSlug, user])

    const handleBookmark = async () => {
        if (!user) {
            // Redirect to login
            const currentUrl = window.location.pathname
            localStorage.setItem('redirectAfterLogin', currentUrl)
            window.location.href = '/signin'
            return
        }

        setLoading(true)
        try {
            const db = getFirestore(app)
            const userDocRef = doc(db, 'users', user.uid)
            const articleStatsRef = doc(db, 'articleStats', articleSlug)

            if (isBookmarked) {
                // Remove
                await updateDoc(userDocRef, { bookmarks: arrayRemove(articleSlug) })

                // Decrement stats
                const statsDoc = await getDoc(articleStatsRef)
                if (statsDoc.exists()) {
                    await updateDoc(articleStatsRef, { bookmarkCount: increment(-1) })
                }

                setIsBookmarked(false)
                trackBookmarkRemoved(articleSlug)
                showToast('Removed from bookmarks', 'info')
            } else {
                // Add
                const userDoc = await getDoc(userDocRef)
                if (!userDoc.exists()) {
                    await setDoc(userDocRef, {
                        bookmarks: [articleSlug],
                        email: user.email,
                        displayName: user?.displayName,
                        createdAt: new Date().toISOString()
                    })
                } else {
                    await updateDoc(userDocRef, { bookmarks: arrayUnion(articleSlug) })
                }

                // Increment stats
                const statsDoc = await getDoc(articleStatsRef)
                if (statsDoc.exists()) {
                    await updateDoc(articleStatsRef, { bookmarkCount: increment(1) })
                } else {
                    await setDoc(articleStatsRef, {
                        bookmarkCount: 1,
                        slug: articleSlug,
                        updatedAt: new Date().toISOString()
                    })
                }

                setIsBookmarked(true)
                trackBookmarkAdded(articleSlug)
                event({
                    action: 'bookmark_add',
                    category: 'engagement',
                    label: articleSlug,
                    value: 1
                })
                showToast('Added to bookmarks! 🔖', 'success')
            }
        } catch (error) {
            console.error('Bookmark error:', error)
            showToast('Error saving bookmark', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleBookmark}
            disabled={loading}
            className={`relative group flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isBookmarked
                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900'
                : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-yellow-400 dark:hover:border-yellow-500 hover:text-yellow-500'
                } ${className}`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
            <svg
                className={`w-5 h-5 transition-colors ${isBookmarked ? 'fill-current' : 'fill-none stroke-current stroke-2'
                    }`}
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-sm font-medium">
                {isBookmarked ? 'Saved' : 'Save'}
            </span>
        </button>
    )
}
