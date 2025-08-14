import Image from 'next/image'
import Link from 'next/link'

interface Article {
  title: string
  slug: string
  cover?: string
  author?: string
  date?: string
  meta?: string
  readingTime?: number
  target?: string
  topics?: string[]
}

export function RelatedArticleCard({ article }: { article: Article }) {
  const target = article.target?.toLowerCase() || 'general'
  const getValidImageSrc = (cover?: string) => {
    if (!cover) return null
    if (cover.startsWith('http://') || cover.startsWith('https://')) return cover
    if (cover.startsWith('/')) return cover
    const cleanCover = cover.replace(/^\.\//, '')
    return `/content/articles/${article.slug}/${cleanCover}`
  }
  const imageSrc = getValidImageSrc(article.cover)
  return (
    <Link href={`/learn/${target}/${article.slug}`} className="block group">
      <div className="flex bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden max-w-xl w-full">
        {imageSrc && (
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={imageSrc}
              alt={article.title}
              width={128}
              height={128}
              className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full"
              sizes="128px"
              loading="lazy"
              priority={false}
            />
          </div>
        )}
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <h3 className="font-bold text-base text-primary-700 group-hover:text-primary-900 line-clamp-2 mb-1">{article.title}</h3>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{article.meta}</p>
          </div>
          <div className="flex items-center text-xs text-gray-400 gap-2 mt-2">
            {article.author && <span className="font-medium text-gray-600">{article.author}</span>}
            {article.date && <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>}
            {article.readingTime && <span>· {article.readingTime} min</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
