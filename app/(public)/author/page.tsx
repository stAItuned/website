import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getAuthorData } from '@/lib/authors'
import { getAuthorBadges } from '@/lib/firebase/badge-service'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import { BadgeIcon } from '@/components/badges/BadgeIcon'
import { BadgeTooltip } from '@/components/badges/BadgeTooltip'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 21600 // 6 ore (60*60*6) - increased from 1h to save function calls

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'All Authors - stAI tuned',
  description: 'Meet the talented writers and experts behind stAI tuned articles. Discover their expertise and read their latest publications.',
  alternates: {
    canonical: `${SITE_URL}/author`,
  },
  openGraph: {
    url: `${SITE_URL}/author`,
    title: 'All Authors - stAI tuned',
    description: 'Meet the talented writers and experts behind stAI tuned articles.',
    type: 'website',
  },
}

export default async function AuthorsPage() {
  // Get all unique authors from published posts
  const uniqueAuthors = Array.from(new Set(
    allPosts
      .filter(post => post.published !== false && post.author)
      .map(post => post.author!)
  ))

  // Get author data and article counts
  const authorsWithData = await Promise.all(
    uniqueAuthors.map(async (authorName) => {
      const authorData = await getAuthorData(authorName)
      const slug = authorName.replaceAll(' ', '-')

      const articleCount = allPosts.filter(
        post => post.author === authorName && post.published !== false
      ).length

      const earnedBadges = await getAuthorBadges(slug)

      return {
        name: authorName,
        slug,
        data: authorData,
        articleCount,
        earnedBadges
      }
    })
  )

  // Sort by article count (descending) then by name
  authorsWithData.sort((a, b) => {
    if (b.articleCount !== a.articleCount) {
      return b.articleCount - a.articleCount
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Authors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the talented writers and experts behind stAI tuned. Each author brings unique insights and expertise to help you stay up-to-date with the latest in AI and technology.
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-4 text-primary-500 mb-8">
          <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-base lg:text-xl">Authors</span>
        </nav>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorsWithData.map((author) => {
            const topBadges = (author.earnedBadges || [])
              .map(eb => {
                const def = BADGE_DEFINITIONS.find(d => d.id === eb.badgeId)
                return def ? { def, earned: eb } : null
              })
              .filter((b): b is { def: any, earned: any } => Boolean(b && b.def.id !== 'contributor'))

            topBadges.sort((a, b) => {
              const tierOrder = { gold: 3, silver: 2, bronze: 1, contributor: 0, special: 4 }
              // @ts-ignore
              return (tierOrder[b.def.tier] || 0) - (tierOrder[a.def.tier] || 0)
            })

            const displayBadges = topBadges.slice(0, 3)

            return (
              <Link
                key={author.slug}
                href={`/author/${author.slug}`}
                className="group relative block bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 hover:z-20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={author.data?.avatar || `/content/team/${author.slug}/propic.jpg`}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-primary-200 transition-all shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {author.data?.name || author.name}
                    </h3>
                    {author.data?.title && (
                      <p className="text-sm text-primary-600">
                        {author.data.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badges row */}
                {displayBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {displayBadges.map(({ def, earned }) => (
                      <div key={def.id} className="transition-transform hover:scale-110">
                        <BadgeTooltip badge={def} earnedBadge={earned}>
                          <BadgeIcon badge={def} earnedBadge={earned} size="xs" />
                        </BadgeTooltip>
                      </div>
                    ))}
                  </div>
                )}

                {author.data?.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {author.data.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {author.articleCount} article{author.articleCount !== 1 ? 's' : ''}
                  </span>

                  {author.data?.team && author.data.team.length > 0 && (
                    <div className="flex gap-1">
                      {author.data.team.map((team: string) => (
                        <span
                          key={team}
                          className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded"
                        >
                          {team}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {authorsWithData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No authors found.</p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
