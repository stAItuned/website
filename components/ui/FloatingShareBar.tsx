'use client'

import { useState, useEffect } from 'react'
import { event } from '@/lib/gtag'
import { trackArticleShare, trackArticleCopyLink, trackBookmarkAdded, trackBookmarkRemoved, trackLikeAdded, trackLikeRemoved } from '@/lib/analytics'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/components/auth/AuthContext'
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'
import Link from 'next/link'

interface FloatingShareBarProps {
  title: string
  articleSlug: string
  description?: string
  imageUrl?: string | null
  likes?: number
  views?: number
  visitors?: number
  // Controlled props
  isLiked?: boolean
  onLike?: () => void
  isLikeLoading?: boolean
  currentLikes?: number
}

export function FloatingShareBar(props: FloatingShareBarProps) {
  const {
    title,
    articleSlug,
    description = '',
    imageUrl,
    likes = 0,
    views = 0,
    visitors = 0
  } = props
  const [copied, setCopied] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  // Props for controlled mode
  const {
    isLiked: externalIsLiked,
    onLike: externalOnLike,
    isLikeLoading: externalIsLikeLoading,
    currentLikes: externalCurrentLikes
  } = props as any // Using any to avoid type errors since we haven't updated the interface yet in this block, but we should update the interface first. Ideally should have done interface update in same tool call. I'll do a multi-replace to handle interface too.

  // Internal state
  const [internalLiked, setInternalLiked] = useState(false)
  const [internalCurrentLikes, setInternalCurrentLikes] = useState(likes)
  const [internalLikeLoading, setInternalLikeLoading] = useState(false)
  const { user, loading } = useAuth()
  const { showToast } = useToast()

  const isControlled = externalIsLiked !== undefined && externalOnLike !== undefined

  const liked = isControlled ? externalIsLiked : internalLiked
  const currentLikes = externalCurrentLikes !== undefined ? externalCurrentLikes : internalCurrentLikes
  const likeLoading = externalIsLikeLoading !== undefined ? externalIsLikeLoading : internalLikeLoading

  useEffect(() => {
    if (!isControlled) {
      // Check local storage for like status
      if (typeof window !== 'undefined') {
        setInternalLiked(localStorage.getItem(`like_${articleSlug}`) === 'true')
      }
      // Update local likes count if prop changes
      if (likes !== internalCurrentLikes && likes > 0) {
        setInternalCurrentLikes(likes)
      }
    }
  }, [articleSlug, likes, isControlled])

  const handleLike = async () => {
    if (isControlled && externalOnLike) {
      externalOnLike()
      return
    }

    const newLiked = !internalLiked
    setInternalLiked(newLiked)
    setInternalCurrentLikes(prev => newLiked ? prev + 1 : Math.max(0, prev - 1))

    if (typeof window !== 'undefined') {
      localStorage.setItem(`like_${articleSlug}`, newLiked ? 'true' : 'false')
    }

    setInternalLikeLoading(true)
    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: articleSlug, action: newLiked ? 'like' : 'unlike' })
      })

      if (newLiked) {
        trackLikeAdded(articleSlug)
        showToast('Added to favorites! ❤️', 'success')
      } else {
        trackLikeRemoved(articleSlug)
      }
    } catch (error) {
      // Revert on error
      setInternalLiked(!newLiked)
      setInternalCurrentLikes(prev => !newLiked ? prev + 1 : Math.max(0, prev - 1))
      if (typeof window !== 'undefined') {
        localStorage.setItem(`like_${articleSlug}`, (!newLiked) ? 'true' : 'false')
      }
      console.error('Failed to update like:', error)
    } finally {
      setInternalLikeLoading(false)
    }
  }

  useEffect(() => {
    // Check if article is bookmarked (only for authenticated users)
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

    // Fetch bookmark count for this article
    const fetchBookmarkCount = async () => {
      try {
        const db = getFirestore(app)
        const articleStatsRef = doc(db, 'articleStats', articleSlug)
        const articleStatsDoc = await getDoc(articleStatsRef)

        if (articleStatsDoc.exists()) {
          const data = articleStatsDoc.data()
          setBookmarkCount(data.bookmarkCount || 0)
        }
      } catch (error) {
        console.error('Error fetching bookmark count:', error)
      }
    }
    fetchBookmarkCount()
  }, [articleSlug, user])

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      // Track with new analytics
      trackArticleCopyLink(articleSlug)

      event({
        action: 'share_copy_link',
        category: 'engagement',
        label: articleSlug,
        value: 1
      })
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleLinkedInShare = () => {
    const url = window.location.href
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, '_blank', 'width=600,height=600')

    // Track with new analytics
    trackArticleShare(articleSlug, 'linkedin')

    event({
      action: 'share_linkedin',
      category: 'engagement',
      label: articleSlug,
      value: 1
    })
  }

  const handleXShare = () => {
    const url = window.location.href
    const text = `Check out: ${title}`
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(xUrl, '_blank', 'width=600,height=600')

    // Track with new analytics
    trackArticleShare(articleSlug, 'x')

    event({
      action: 'share_x',
      category: 'engagement',
      label: articleSlug,
      value: 1
    })
  }

  const handleBookmark = async () => {
    // Require authentication
    if (!user) {
      // Store current URL before redirecting to signin
      const currentUrl = window.location.pathname
      localStorage.setItem('redirectAfterLogin', currentUrl)
      window.location.href = '/signin'
      return
    }

    try {
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', user.uid)
      const articleStatsRef = doc(db, 'articleStats', articleSlug)

      if (isBookmarked) {
        // Remove bookmark
        await updateDoc(userDocRef, {
          bookmarks: arrayRemove(articleSlug)
        })

        // Decrement bookmark count
        const statsDoc = await getDoc(articleStatsRef)
        if (statsDoc.exists()) {
          await updateDoc(articleStatsRef, {
            bookmarkCount: increment(-1)
          })
        }

        setIsBookmarked(false)
        setBookmarkCount(prev => Math.max(0, prev - 1))

        // Track with new analytics
        trackBookmarkRemoved(articleSlug)

        event({
          action: 'bookmark_remove',
          category: 'engagement',
          label: articleSlug,
          value: 0
        })
      } else {
        // Add bookmark - create document if doesn't exist
        const userDoc = await getDoc(userDocRef)
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            bookmarks: [articleSlug],
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date().toISOString()
          })
        } else {
          await updateDoc(userDocRef, {
            bookmarks: arrayUnion(articleSlug)
          })
        }

        // Increment bookmark count
        const statsDoc = await getDoc(articleStatsRef)
        if (statsDoc.exists()) {
          await updateDoc(articleStatsRef, {
            bookmarkCount: increment(1)
          })
        } else {
          // Create stats document if doesn't exist
          await setDoc(articleStatsRef, {
            bookmarkCount: 1,
            slug: articleSlug,
            updatedAt: new Date().toISOString()
          })
        }

        setIsBookmarked(true)
        setBookmarkCount(prev => prev + 1)

        // Track with new analytics
        trackBookmarkAdded(articleSlug)

        event({
          action: 'bookmark_add',
          category: 'engagement',
          label: articleSlug,
          value: 1
        })
      }
    } catch (error) {
      console.error('Error updating bookmark:', error)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <aside className="sticky top-24 hidden lg:flex flex-col gap-3 w-16">
      {/* Share on LinkedIn */}
      <button
        onClick={handleLinkedInShare}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:scale-110 hover:bg-[#0077B5] hover:border-[#0077B5]"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <svg
          className="w-6 h-6 text-[#0077B5] group-hover:text-white transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold mb-0.5">Share on LinkedIn</div>
          <div className="text-gray-300 dark:text-gray-400">Post to your network</div>
          {/* Arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
        </div>
      </button>

      {/* Share on X (Twitter) */}
      <button
        onClick={handleXShare}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:scale-110 hover:bg-black hover:border-black dark:hover:bg-white"
        aria-label="Share on X"
        title="Share on X (Twitter)"
      >
        <svg
          className="w-5 h-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold mb-0.5">Share on X</div>
          <div className="text-gray-300 dark:text-gray-400">Tweet this article</div>
          {/* Arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
        </div>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:scale-110 hover:bg-primary-600 hover:border-primary-600"
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? (
          <svg
            className="w-6 h-6 text-green-600 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        {copied && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
            Copied!
          </span>
        )}
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold mb-0.5">Copy Link</div>
          <div className="text-gray-300 dark:text-gray-400">Share anywhere</div>
          {/* Arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
        </div>
      </button>

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 dark:bg-slate-700 my-1" />

      {/* Bookmark */}
      <button
        onClick={handleBookmark}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:scale-110"
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <svg
          className={`w-6 h-6 transition-colors ${isBookmarked
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-gray-600 dark:text-gray-300 group-hover:text-yellow-500'
            }`}
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={isBookmarked ? 0 : 2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>

        {/* Bookmark Count Badge */}
        {bookmarkCount >= 1 && (
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
            {formatNumber(bookmarkCount)}
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold mb-0.5">{isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}</div>
          <div className="text-gray-300 dark:text-gray-400">
            {user ? (isBookmarked ? 'Unsave for later' : 'Save for later') : 'Sign in to bookmark'}
          </div>
          {bookmarkCount > 0 && (
            <div className="text-yellow-400 text-xs mt-1">
              {bookmarkCount} {bookmarkCount === 1 ? 'bookmark' : 'bookmarks'}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
        </div>
        {/* Auth Required Prompt */}
        {showAuthPrompt && !user && (
          <div className="absolute left-full ml-3 px-4 py-3 bg-primary-600 text-white text-sm rounded-lg shadow-2xl z-50 w-56 pointer-events-auto">
            <div className="font-semibold mb-1">Sign in required</div>
            <div className="text-primary-100 text-xs mb-3">Please sign in to bookmark articles</div>
            <Link
              href="/signin"
              className="block w-full text-center py-2 px-3 bg-white text-primary-600 rounded-lg font-semibold text-xs hover:bg-primary-50 transition-colors"
              onClick={() => setShowAuthPrompt(false)}
            >
              Sign In Now
            </Link>
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-primary-600"></div>
          </div>
        )}
      </button>

      {/* Stats Divider */}
      <div className="w-full h-px bg-gray-200 dark:bg-slate-700 my-1" />

      {/* Views Counter */}
      {views >= 10 && (
        <div
          className="relative group flex flex-col items-center justify-center w-14 py-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 cursor-help"
          title="Total page views"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {formatNumber(views)}
          </span>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
            <div className="font-semibold mb-0.5">Total Views</div>
            <div className="text-gray-300 dark:text-gray-400">All page visits</div>
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
          </div>
        </div>
      )}

      {/* Unique Visitors Counter */}
      {visitors >= 5 && (
        <div
          className="relative group flex flex-col items-center justify-center w-14 py-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 cursor-help"
          title="Unique visitors"
        >
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {formatNumber(visitors)}
          </span>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
            <div className="font-semibold mb-0.5">Unique Visitors</div>
            <div className="text-gray-300 dark:text-gray-400">Individual readers</div>
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
          </div>
        </div>
      )}

      {/* Interactive Like Button */}
      <button
        onClick={handleLike}
        disabled={likeLoading}
        className={`relative group flex flex-col items-center justify-center w-14 py-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:scale-110 active:scale-95 ${liked ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20' : ''
          }`}
        aria-label={liked ? 'Unlike article' : 'Like article'}
        title={liked ? 'Unlike' : 'Like'}
      >
        <svg
          className={`w-5 h-5 mb-1 transition-colors duration-300 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-red-500'
            }`}
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={liked ? 0 : 2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className={`text-xs font-semibold transition-colors duration-300 ${liked ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400'
          }`}>
          {formatNumber(currentLikes)}
        </span>

        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold mb-0.5">{liked ? 'Liked!' : 'Like this article'}</div>
          <div className="text-gray-300 dark:text-gray-400">
            {liked ? 'Thanks for the support' : 'Show your appreciation'}
          </div>
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
        </div>
      </button>
    </aside>
  )
}
