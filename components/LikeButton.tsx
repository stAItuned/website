'use client'


import { useState, useEffect } from 'react'
import { LikeIcon } from './icons/LikeIcon'

interface LikeButtonProps {
  articleSlug: string
  initialLikes?: number
}

export function LikeButton({ articleSlug, initialLikes = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

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
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm text-sm font-semibold transition hover:bg-primary-50 dark:hover:bg-primary-900 ${liked ? 'text-white' : ''}`}
      style={!liked ? { backgroundColor: 'rgb(179,202,251)' } : undefined}
      onClick={handleLike}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike' : 'Like'}
      type="button"
    >
      <LikeIcon
        className={`w-5 h-5 transition-colors duration-200 ${liked ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}
      />
    </button>
  )
}
