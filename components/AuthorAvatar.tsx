'use client'

import Image from 'next/image'
import Link from 'next/link'

interface AuthorAvatarProps {
  author: string
}

export function AuthorAvatar({ author }: AuthorAvatarProps) {
  return (
    <>
      <Image
        src={`/cms/team/${author.replaceAll(' ', '-')}/propic.jpg`}
        alt="Author avatar"
        width={32}
        height={32}
        className="rounded-full"
        unoptimized
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <Link 
        href={`/meet/member/${author.toLowerCase().replaceAll(' ', '-')}`}
        className="no-underline hover:underline text-primary-600"
      >
        {author}
      </Link>
    </>
  )
}
