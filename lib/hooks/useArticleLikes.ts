import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import { trackLikeAdded, trackLikeRemoved } from '@/lib/analytics'

interface UseArticleLikesProps {
    articleSlug: string
    initialLikes?: number
}

export function useArticleLikes({ articleSlug, initialLikes = 0 }: UseArticleLikesProps) {
    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(initialLikes)
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    // Initialize state from local storage and sync with initialLikes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isLiked = localStorage.getItem(`like_${articleSlug}`) === 'true'
            setLiked(isLiked)
        }

        if (initialLikes > 0) {
            setLikesCount(initialLikes)
        }
    }, [articleSlug, initialLikes])

    const handleLike = async () => {
        const newLiked = !liked
        setLiked(newLiked)
        setLikesCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1))

        if (typeof window !== 'undefined') {
            localStorage.setItem(`like_${articleSlug}`, newLiked ? 'true' : 'false')
        }

        setLoading(true)
        try {
            await fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: articleSlug, action: newLiked ? 'like' : 'unlike' })
            })

            if (newLiked) {
                trackLikeAdded(articleSlug)
                showToast('Added to your favorites! ❤️', 'success')
            } else {
                trackLikeRemoved(articleSlug)
            }
        } catch (error) {
            // Revert on error
            setLiked(!newLiked)
            setLikesCount(prev => !newLiked ? prev + 1 : Math.max(0, prev - 1))

            if (typeof window !== 'undefined') {
                localStorage.setItem(`like_${articleSlug}`, (!newLiked) ? 'true' : 'false')
            }

            showToast('Failed to update. Please try again.', 'error')
            console.error('Failed to update like:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        liked,
        likesCount,
        loading,
        handleLike
    }
}
