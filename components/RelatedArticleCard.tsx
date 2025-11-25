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
    <Link 
      href={`/learn/${target}/${article.slug}`} 
      className="block group w-full touch-manipulation"
    >
      <article className="flex bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 overflow-hidden w-full border border-gray-100 dark:border-gray-700 group-hover:border-primary-300 dark:group-hover:border-primary-600 h-full">
        {imageSrc && (
          <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0">
            <Image
              src={imageSrc}
              alt={article.title}
              width={128}
              height={128}
              className="object-cover group-hover:scale-110 transition-transform duration-300 w-full h-full"
              sizes="(max-width: 475px) 80px, (max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
              loading="lazy"
              priority={false}
            />
          </div>
        )}
        <div className="flex flex-col justify-between p-2.5 xs:p-3 sm:p-4 md:p-5 flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 min-h-0">
            <h3 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 mb-1.5 sm:mb-2 leading-tight sm:leading-snug transition-colors">
              {article.title}
            </h3>
            {article.meta && (
              <p className="text-[11px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {article.meta}
              </p>
            )}
          </div>
          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
            {article.author && (
              <span className="text-[11px] xs:text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-full">
                {article.author}
              </span>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] xs:text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {article.date && (
                <time 
                  dateTime={article.date}
                  className="whitespace-nowrap"
                >
                  {new Date(article.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </time>
              )}
              {article.readingTime && (
                <>
                  {article.date && <span className="hidden xs:inline">•</span>}
                  <span className="whitespace-nowrap">{article.readingTime} min</span>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
