'use client'


import { useState, useEffect } from 'react'

interface LikeButtonProps {
  articleSlug: string
  initialLikes?: number
}

export function LikeButton({ articleSlug, initialLikes = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  // Optionally: fetch initial like count from Firestore on mount if not provided
  useEffect(() => {
    if (initialLikes === 0) {
      fetch(`/api/analytics/fast?slug=${encodeURIComponent(articleSlug)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.data?.likes !== undefined) setLikes(data.data.likes)
        })
        .catch(() => {})
    }
    if (typeof window !== 'undefined') {
      setLiked(localStorage.getItem(`like_${articleSlug}`) === 'true')
    }
  }, [articleSlug, initialLikes])

  const handleLike = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: articleSlug, action: liked ? 'unlike' : 'like' })
      })
      const data = await res.json()
      if (data.success) {
        setLikes(data.likes)
        setLiked(!liked)
        if (typeof window !== 'undefined') {
          localStorage.setItem(`like_${articleSlug}`, !liked ? 'true' : 'false')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm text-sm font-semibold transition hover:bg-primary-50 dark:hover:bg-primary-900 ${liked ? 'text-primary-600' : ''}`}
      style={!liked ? { backgroundColor: 'rgb(179,202,251)' } : undefined}
      onClick={handleLike}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike' : 'Like'}
      type="button"
    >
      <svg className={`w-5 h-5 ${liked ? 'fill-primary-500' : 'fill-none'} stroke-current`} viewBox="0 0 24 24" strokeWidth="2">
        <path d="M5 15.5A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1 7-5.5c0-3.5-7-9-7-9s-7 5.5-7 9z" />
      </svg>
      <span>{likes}</span>
    </button>
  )
}
