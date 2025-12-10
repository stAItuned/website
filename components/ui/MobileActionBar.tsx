'use client'

import { useState, useEffect } from 'react'
import { LikeButton } from '@/components/LikeButton'
import { event } from '@/lib/gtag'
import { useAuth } from '@/components/auth/AuthContext'
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'
import { useHaptics } from '@/lib/hooks/useHaptics'
import { TimeRemainingIndicator } from './TimeRemainingIndicator'

interface MobileActionBarProps {
  articleSlug: string
  title: string
  description?: string
  imageUrl?: string | null
  onTocClick: () => void
  showToc: boolean
  readingTime?: number
  scrollPercent?: number
  onTextSizeChange?: (size: 'small' | 'normal' | 'large') => void
  currentTextSize?: 'small' | 'normal' | 'large'
  onFontFamilyChange?: (font: 'sans' | 'serif') => void
  currentFontFamily?: 'sans' | 'serif'
  onFocusModeToggle?: () => void
  isFocusMode?: boolean
}

export function MobileActionBar({
  articleSlug,
  title,
  description,
  imageUrl,
  onTocClick,
  showToc,
  readingTime = 5,
  scrollPercent = 0,
  onTextSizeChange,
  currentTextSize = 'normal',
  onFontFamilyChange,
  currentFontFamily = 'sans',
  onFocusModeToggle,
  isFocusMode = false
}: MobileActionBarProps) {
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false)
  const { user, loading } = useAuth()
  const haptics = useHaptics()

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
  }, [articleSlug, user])

  const handleBookmark = async () => {
    haptics.light()

    // Require authentication
    if (!user) {
      setShowAuthPrompt(true)
      setTimeout(() => setShowAuthPrompt(false), 3000)
      return
    }

    try {
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', user.uid)

      if (isBookmarked) {
        // Remove bookmark
        await updateDoc(userDocRef, {
          bookmarks: arrayRemove(articleSlug)
        })
        setIsBookmarked(false)

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
        setIsBookmarked(true)
        haptics.success()

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

  const handleCopyLink = async () => {
    haptics.light()
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      haptics.success()
      setTimeout(() => setCopied(false), 2000)

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

    event({
      action: 'share_linkedin',
      category: 'engagement',
      label: articleSlug,
      value: 1
    })
    setShowShareMenu(false)
  }

  const handleXShare = () => {
    const url = window.location.href
    const text = `Check out: ${title}`
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(xUrl, '_blank', 'width=600,height=600')

    event({
      action: 'share_x',
      category: 'engagement',
      label: articleSlug,
      value: 1
    })
    setShowShareMenu(false)
  }

  const handleTextSizeChange = (size: 'small' | 'normal' | 'large') => {
    haptics.light()
    if (onTextSizeChange) {
      onTextSizeChange(size)
      event({
        action: 'mobile_text_size_change',
        category: 'accessibility',
        label: size,
        value: size === 'small' ? 1 : size === 'normal' ? 2 : 3
      })
    }
    setShowTextSizeMenu(false)
  }

  const handleFontFamilyChange = (font: 'sans' | 'serif') => {
    haptics.light()
    if (onFontFamilyChange) {
      onFontFamilyChange(font)
      event({
        action: 'mobile_font_family_change',
        category: 'accessibility',
        label: font,
        value: font === 'sans' ? 1 : 2
      })
    }
  }

  const handleFocusModeToggle = () => {
    haptics.medium()
    if (onFocusModeToggle) {
      onFocusModeToggle()
      event({
        action: 'focus_mode_toggle',
        category: 'accessibility',
        label: isFocusMode ? 'disable' : 'enable',
        value: isFocusMode ? 0 : 1
      })
    }
  }

  return (
    <>
      {/* Text Size Menu */}
      {showTextSizeMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowTextSizeMenu(false)}
        >
          <div
            className="absolute bottom-20 left-4 right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Text Size</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleTextSizeChange('small')}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${currentTextSize === 'small'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
              >
                <span className="text-sm font-medium">A-</span>
                <span className="text-sm">Small</span>
              </button>

              <button
                onClick={() => handleTextSizeChange('normal')}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${currentTextSize === 'normal'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
              >
                <span className="text-base font-medium">A</span>
                <span className="text-sm">Normal</span>
              </button>

              <button
                onClick={() => handleTextSizeChange('large')}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${currentTextSize === 'large'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
              >
                <span className="text-lg font-medium">A+</span>
                <span className="text-sm">Large</span>
              </button>
            </div>

            {/* Font Family Toggle */}
            {onFontFamilyChange && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-4 mb-3">Font Style</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFontFamilyChange('sans')}
                    className={`flex-1 p-3 rounded-xl transition-colors font-sans ${currentFontFamily === 'sans'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    <span className="text-sm font-medium">Sans-serif</span>
                  </button>
                  <button
                    onClick={() => handleFontFamilyChange('serif')}
                    className={`flex-1 p-3 rounded-xl transition-colors font-serif ${currentFontFamily === 'serif'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    <span className="text-sm font-medium">Serif</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Menu Overlay */}
      {showShareMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowShareMenu(false)}
        >
          <div
            className="absolute bottom-20 left-4 right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLinkedInShare}
                className="flex items-center gap-3 p-4 rounded-xl bg-[#0077B5] text-white hover:bg-[#006399] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="font-semibold">Share on LinkedIn</span>
              </button>

              <button
                onClick={handleXShare}
                className="flex items-center gap-3 p-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-semibold">Share on X</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold text-green-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        {/* Auth Required Prompt */}
        {showAuthPrompt && !user && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-primary-600 text-white text-sm rounded-lg shadow-2xl z-50 whitespace-nowrap animate-slide-up">
            <div className="font-semibold mb-1">Sign in required</div>
            <div className="text-primary-100 text-xs">Please sign in to bookmark articles</div>
          </div>
        )}

        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-700 shadow-2xl">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
              style={{ width: `${scrollPercent}%` }}
            />
          </div>

          {/* Reading Stats */}
          <div className="flex items-center justify-center gap-4 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
            <TimeRemainingIndicator
              readingTime={readingTime}
              scrollPercent={scrollPercent}
              className="text-xs"
            />
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{Math.round(scrollPercent)}% completed</span>
            </div>
          </div>

          <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
            {/* Like Button */}
            <div className="flex-1 flex justify-center">
              <LikeButton articleSlug={articleSlug} />
            </div>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <svg
                className={`w-6 h-6 transition-colors ${isBookmarked
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={isBookmarked ? 0 : 2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
              aria-label="Share article"
            >
              <svg
                className="w-6 h-6 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Share</span>
            </button>

            {/* Text Size Button */}
            {onTextSizeChange && (
              <button
                onClick={() => setShowTextSizeMenu(!showTextSizeMenu)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
                aria-label="Change text size"
              >
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Size</span>
              </button>
            )}

            {/* Focus Mode Button */}
            {onFocusModeToggle && (
              <button
                onClick={handleFocusModeToggle}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors active:scale-95 ${isFocusMode
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                aria-label={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
              >
                <svg
                  className={`w-6 h-6 ${isFocusMode
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className={`text-xs font-medium ${isFocusMode
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
                  }`}>Focus</span>
              </button>
            )}

            {/* TOC Button */}
            {showToc && (
              <button
                onClick={onTocClick}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
                aria-label="Table of contents"
              >
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Contents</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
