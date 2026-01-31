import { useState, useEffect } from 'react'
import { useToast } from './ui/Toast'
import { trackLikeAdded, trackLikeRemoved } from '@/lib/analytics'

interface LikeButtonProps {
  articleSlug: string
  initialLikes?: number
  liked?: boolean
  onLike?: () => void
  isLoading?: boolean
  variant?: 'pill' | 'icon'
}

/**
 * Like toggle button. Use `variant="icon"` for compact icon-only usage on tight layouts.
 */
export function LikeButton({
  articleSlug,
  initialLikes = 0,
  liked: externalLiked,
  onLike: externalOnLike,
  isLoading: externalIsLoading,
  variant = 'pill'
}: LikeButtonProps) {
  // Internal state for when used independently
  const [internalLiked, setInternalLiked] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)
  const { showToast } = useToast()

  const isControlled = externalLiked !== undefined && externalOnLike !== undefined

  // Use external or internal state
  const isLiked = isControlled ? externalLiked : internalLiked
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalLoading

  // Initialize internal state if not controlled
  useEffect(() => {
    if (!isControlled && typeof window !== 'undefined') {
      setInternalLiked(localStorage.getItem(`like_${articleSlug}`) === 'true')
    }
  }, [articleSlug, isControlled])

  const handleLike = async () => {
    // If controlled, just call the handler
    if (isControlled && externalOnLike) {
      externalOnLike()
      return
    }

    // Internal logic (legacy/standalone mode)
    const newLiked = !internalLiked;
    setInternalLiked(newLiked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`like_${articleSlug}`, newLiked ? 'true' : 'false');
    }
    setInternalLoading(true);
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
      setInternalLiked(!newLiked);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`like_${articleSlug}`, (!newLiked) ? 'true' : 'false');
      }
      showToast('Failed to update. Please try again.', 'error')
    } finally {
      setInternalLoading(false);
    }
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-1 sm:gap-2
        ${variant === 'icon' ? 'h-11 w-11 sm:h-12 sm:w-12 rounded-full' : 'px-2.5 sm:px-4 py-2 rounded-full'}
        border transition-all duration-300
        ${isLiked
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900'
          : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 hover:text-red-500'
        }
        ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={handleLike}
      disabled={isLoading}
      aria-pressed={isLiked}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      type="button"
    >
      <svg
        className={`w-5 h-5 transition-colors ${isLiked ? 'fill-current' : 'fill-none stroke-current stroke-2'}`}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {variant === 'pill' && (
        <span className="text-sm font-medium">
          {isLiked ? 'Liked' : 'Like'}
        </span>
      )}
    </button>
  )
}
