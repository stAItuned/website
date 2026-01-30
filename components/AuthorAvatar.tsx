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
}

export default function AuthorAvatar({ author, authorData }: AuthorAvatarProps) {
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

  return (
    <Link
      href={`/author/${authorSlug}`}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
    >
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-primary-100 dark:border-slate-800 transition-all group-hover:border-primary-300 bg-gradient-to-br from-primary-50 via-white to-secondary-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        {imageErrored ? (
          <div className="flex h-full w-full items-center justify-center text-primary-600 dark:text-primary-200 text-sm font-semibold">
            {initials}
          </div>
        ) : (
          <Image
            src={avatarSrc}
            alt={cleanAuthor}
            fill
            priority
            className="object-cover object-center"
            sizes="56px"
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
