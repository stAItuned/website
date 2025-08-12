import Image from 'next/image'
import { getAuthorData } from '@/lib/authors'

interface AuthorAvatarProps {
  author: string
}

export default async function AuthorAvatar({ author }: AuthorAvatarProps) {
  const authorData = await getAuthorData(author)
  const authorSlug = author.replaceAll(' ', '-')

  return (
    <div className="flex items-center gap-3">
      <Image
        src={`/cms/team/${authorSlug}/propic.jpg`}
        alt={author}
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      <div>
        <div className="font-medium text-gray-900">
          {authorData?.name || author}
        </div>
        {authorData?.title && (
          <div className="text-sm text-gray-600">
            {authorData.title}
          </div>
        )}
      </div>
    </div>
  )
}
