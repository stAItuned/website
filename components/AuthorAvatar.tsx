"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'

interface AuthorAvatarProps {
  author: string
  authorData?: {
    name?: string
    title?: string
    avatar?: string
  } | null
  imageFit?: 'cover' | 'contain'
}

/**
 * Author avatar + metadata for article headers.
 */
export default function AuthorAvatar({
  author,
  authorData,
  imageFit = 'cover'
}: AuthorAvatarProps) {
  const [imageErrored, setImageErrored] = useState(false)

  // Ensure author name is trimmed and formatted for slug
  const cleanAuthor = (authorData?.name || author).trim()
  const authorSlug = cleanAuthor.replaceAll(' ', '-')

  // Use avatar from authorData if available, otherwise fallback to default path
  const avatarSrc = authorData?.avatar || `/content/team/${authorSlug}/propic.jpg`

  const initials = useMemo(() => {
    const parts = cleanAuthor.split(' ').filter(Boolean)
    if (!parts.length) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }, [cleanAuthor])

  const imageClassName = imageFit === 'contain'
    ? 'object-contain'
    : 'object-cover'

  return (
    <Link
      href={`/author/${authorSlug}`}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
    >
      <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary-100 dark:border-slate-800 transition-all group-hover:border-primary-300 bg-gradient-to-br from-primary-50 via-white to-secondary-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-sm">
        {imageErrored ? (
          <div className="flex h-full w-full items-center justify-center text-primary-600 dark:text-primary-200 text-sm font-semibold">
            {initials}
          </div>
        ) : (
          <Image
            src={avatarSrc}
            alt={cleanAuthor}
            width={64}
            height={64}
            priority
            className={`h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/80 dark:bg-slate-900/80 ${imageClassName}`}
            style={{ objectPosition: '50% 35%' }}
            unoptimized
            onError={() => setImageErrored(true)}
          />
        )}
      </div>
      <div className="flex flex-col">
        <div className="font-medium text-gray-900 dark:text-white leading-tight">
          {cleanAuthor}
        </div>
        {authorData?.title && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {authorData.title}
          </div>
        )}
      </div>
    </Link>
  )
}
