"use client"
import Link from 'next/link'

interface AuthorAvatarProps {
  author: string
  authorData?: {
    name?: string
    title?: string
  }
}

export default function AuthorAvatar({ author, authorData }: AuthorAvatarProps) {
  const authorSlug = author.replaceAll(' ', '-')
  return (
    <Link 
      href={`/author/${authorSlug}`}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
    >
      <img
        src={`/content/team/${authorSlug}/propic.jpg`}
        alt={author}
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">
          {authorData?.name || author}
        </div>
        {authorData?.title && (
          <div className="text-xs text-gray-500 mt-0.5">
            {authorData.title}
          </div>
        )}
      </div>
    </Link>
  )
}
