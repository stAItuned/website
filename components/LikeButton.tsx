'use client'


import { useState, useEffect } from 'react'
import { LikeIcon } from './icons/LikeIcon'
import { useToast } from './ui/Toast'
import { trackLikeAdded, trackLikeRemoved } from '@/lib/analytics'

interface LikeButtonProps {
  articleSlug: string
  initialLikes?: number
}

export function LikeButton({ articleSlug, initialLikes = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Optionally: fetch initial like count from Firestore on mount if not provided
  useEffect(() => {
    // No need to fetch likes if not displaying them
    if (typeof window !== 'undefined') {
      setLiked(localStorage.getItem(`like_${articleSlug}`) === 'true')
    }
  }, [articleSlug, initialLikes])

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`like_${articleSlug}`, newLiked ? 'true' : 'false');
    }
    setLoading(true);
    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: articleSlug, action: newLiked ? 'like' : 'unlike' })
      });

      // Show success toast
      showToast(
        newLiked ? 'Added to your favorites! ❤️' : 'Removed from favorites',
        'success'
      )

      // Track like event
      if (newLiked) {
        trackLikeAdded(articleSlug)
      } else {
        trackLikeRemoved(articleSlug)
      }
    } catch (error) {
      // Revert on error
      setLiked(!newLiked);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`like_${articleSlug}`, (!newLiked) ? 'true' : 'false');
      }
      showToast('Failed to update. Please try again.', 'error')
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`
        flex items-center gap-2 px-3 py-1 rounded-full 
        border shadow-sm text-sm font-semibold 
        transition-all duration-300
        ${liked
          ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600'
          : 'bg-primary-100 dark:bg-primary-900/40 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/60'
        }
        ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={handleLike}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike' : 'Like'}
      type="button"
    >
      <LikeIcon
        className={`w-5 h-5 transition-all duration-300 ${liked
            ? 'text-white scale-110'
            : 'text-primary-600 dark:text-primary-400'
          }`}
      />
    </button>
  )
}
