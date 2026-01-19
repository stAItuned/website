'use client'

import { useState, useEffect } from 'react'
import { useToast } from './ui/Toast'
import { event } from '@/lib/gtag'

interface ArticleRatingProps {
    articleSlug: string
    className?: string
}

/**
 * Star rating component for articles (1-5 stars)
 * 
 * Features:
 * - Hover preview for star selection
 * - localStorage persistence to prevent duplicate ratings
 * - Firestore storage via API
 * - Animated micro-interactions
 */
export function ArticleRating({ articleSlug, className = '' }: ArticleRatingProps) {
    const [rating, setRating] = useState<number | null>(null)
    const [hoverRating, setHoverRating] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [averageRating, setAverageRating] = useState<number | null>(null)
    const [totalRatings, setTotalRatings] = useState<number>(0)
    const { showToast } = useToast()

    // Check localStorage for existing rating
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedRating = localStorage.getItem(`rating_${articleSlug}`)
            if (savedRating) {
                setRating(parseInt(savedRating, 10))
            }
        }

        // Fetch current average rating
        fetchAverageRating()
    }, [articleSlug])

    const fetchAverageRating = async () => {
        try {
            const response = await fetch(`/api/rating?slug=${encodeURIComponent(articleSlug)}`)
            if (response.ok) {
                const data = await response.json()
                if (data.success) {
                    setAverageRating(data.average)
                    setTotalRatings(data.count)
                }
            }
        } catch (error) {
            console.error('Failed to fetch rating:', error)
        }
    }

    const handleRate = async (value: number) => {
        if (loading || rating !== null) return

        setLoading(true)
        setRating(value)

        // Save to localStorage immediately
        if (typeof window !== 'undefined') {
            localStorage.setItem(`rating_${articleSlug}`, value.toString())
        }

        try {
            const response = await fetch('/api/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: articleSlug, rating: value })
            })

            const data = await response.json()

            if (data.success) {
                setAverageRating(data.average)
                setTotalRatings(data.count)
                showToast(`Thanks for your feedback! ${value >= 4 ? '⭐' : ''}`, 'success')

                // Track rating event
                event({
                    action: 'article_rating',
                    category: 'engagement',
                    label: articleSlug,
                    value: value
                })
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error('Failed to submit rating:', error)
            showToast('Failed to save rating. Please try again.', 'error')
            // Revert on error
            setRating(null)
            if (typeof window !== 'undefined') {
                localStorage.removeItem(`rating_${articleSlug}`)
            }
        } finally {
            setLoading(false)
        }
    }

    const displayRating = hoverRating ?? rating ?? 0

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            {/* Stars */}
            <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(null)}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => rating === null && setHoverRating(star)}
                        disabled={loading || rating !== null}
                        className={`
              transition-all duration-200 transform
              ${rating === null ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}
              ${loading ? 'animate-pulse' : ''}
            `}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                        <svg
                            className={`w-7 h-7 transition-colors duration-200 ${star <= displayRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                                }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            fill={star <= displayRating ? 'currentColor' : 'none'}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                        </svg>
                    </button>
                ))}
            </div>

            {/* Label */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {rating !== null ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                        You rated {rating} star{rating === 1 ? '' : 's'}
                    </span>
                ) : hoverRating !== null ? (
                    <span>{hoverRating} star{hoverRating === 1 ? '' : 's'}</span>
                ) : (
                    <span>Rate this article</span>
                )}
            </div>

            {/* Average rating display */}
            {averageRating !== null && totalRatings > 0 && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                    Avg: {averageRating.toFixed(1)} ({totalRatings} vote{totalRatings === 1 ? '' : 's'})
                </div>
            )}
        </div>
    )
}
