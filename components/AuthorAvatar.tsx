"use client"
import Link from 'next/link'
import Image from 'next/image'

interface AuthorAvatarProps {
  author: string
  authorData?: {
    name?: string
    title?: string
    avatar?: string
  } | null
}

export default function AuthorAvatar({ author, authorData }: AuthorAvatarProps) {
  // Ensure author name is trimmed and formatted for slug
  const cleanAuthor = (authorData?.name || author).trim()
  const authorSlug = cleanAuthor.replaceAll(' ', '-')

  // Use avatar from authorData if available, otherwise fallback to default path
  const avatarSrc = authorData?.avatar || `/content/team/${authorSlug}/propic.jpg`

  return (
    <Link
      href={`/author/${authorSlug}`}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
    >
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-100 dark:border-slate-800 transition-all group-hover:border-primary-300">
        <Image
          src={avatarSrc}
          alt={cleanAuthor}
          fill
          className="object-cover"
          sizes="48px"
          unoptimized
        />
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

