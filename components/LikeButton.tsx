'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'

interface LikeButtonProps {
  articleSlug: string
}

export function LikeButton({ articleSlug }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLiked(localStorage.getItem(`like_${articleSlug}`) === 'true')
    }
  }, [articleSlug])

  const toggleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`like_${articleSlug}`, newLiked ? 'true' : 'false')
    }
  }

  return (
    <button
      aria-label={liked ? 'Unlike' : 'Like'}
      onClick={toggleLike}
      className={clsx(
        'transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-full',
        liked ? 'bg-pink-100 text-pink-600 scale-110' : 'bg-slate-200 text-gray-500 hover:bg-pink-50 hover:text-pink-500'
      )}
      style={{ outline: 'none', border: 'none' }}
    >
      <svg
        className={clsx('w-6 h-6', liked ? 'fill-pink-500' : 'fill-none')}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
      <span className="text-sm font-semibold select-none">{liked ? 'Liked' : 'Like'}</span>
    </button>
  )
}
