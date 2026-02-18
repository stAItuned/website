import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { allPosts, allTeams } from '@/lib/contentlayer'
import { getAuthorBadges } from '@/lib/firebase/badge-service'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import { BadgeIcon } from '@/components/badges/BadgeIcon'
import { BadgeTooltip } from '@/components/badges/BadgeTooltip'
import { PageTransition } from '@/components/ui/PageTransition'
import {
  getPublicWriterAvatarUrl,
  getPublicWriterAvatarUrlByDisplayName,
  getPublicWritersList,
} from '@/lib/writer/firestore'
import { toPreviewText } from '@/lib/text/preview-text'
import type { AuthorBadge, Badge, BadgeTier } from '@/lib/types/badge'

// Force runtime rendering so writers are read from Firestore on request.
export const dynamic = 'force-dynamic'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')
const DEFAULT_AVATAR_SRC = '/assets/general/avatar.png'

type AuthorCardData = {
  name?: string
  team?: string[]
  title?: string
  description?: string
  avatar?: string
}

type AuthorCard = {
  name: string
  slug: string
  data: AuthorCardData
  articleCount: number
  earnedBadges: AuthorBadge[]
}

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
  const normalizeAuthorKey = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, ' ')
  const normalizeTeamKey = (value: string) =>
    value.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ')

  const articleCountByAuthor = new Map<string, number>()
  const displayNameByAuthorKey = new Map<string, string>()
  const teamMetaByAuthorKey = new Map<string, { bio?: string; role?: string }>()

  for (const member of allTeams) {
    const meta = { bio: member.bio || undefined, role: member.role || undefined }
    if (member.name) {
      teamMetaByAuthorKey.set(normalizeTeamKey(member.name), meta)
    }
    if (member.slug) {
      teamMetaByAuthorKey.set(normalizeTeamKey(member.slug), meta)
      teamMetaByAuthorKey.set(normalizeTeamKey(member.slug.replaceAll('-', ' ')), meta)
    }
  }

  for (const post of allPosts) {
    if (post.published === false || !post.author) continue
    const key = normalizeAuthorKey(post.author)
    displayNameByAuthorKey.set(key, post.author)
    articleCountByAuthor.set(key, (articleCountByAuthor.get(key) ?? 0) + 1)
  }

  const writers = await getPublicWritersList()
  const writerKeys = new Set(writers.map((writer) => normalizeAuthorKey(writer.displayName)))

  const firestoreAuthors: AuthorCard[] = await Promise.all(
    writers.map(async (writer) => {
      const articleCount = articleCountByAuthor.get(normalizeAuthorKey(writer.displayName)) ?? 0
      const earnedBadges = await getAuthorBadges(writer.slug)

      return {
        name: writer.displayName,
        slug: writer.slug,
        data: {
          name: writer.displayName,
          team: ['Writers'],
          title: writer.title || teamMetaByAuthorKey.get(normalizeTeamKey(writer.displayName))?.role,
          description: writer.bio || teamMetaByAuthorKey.get(normalizeTeamKey(writer.displayName))?.bio,
          avatar: writer.image?.publicUrl,
        },
        articleCount,
        earnedBadges,
      }
    })
  )

  const fallbackAuthors: AuthorCard[] = await Promise.all(
    Array.from(displayNameByAuthorKey.entries())
      .filter(([authorKey]) => !writerKeys.has(authorKey))
      .map(async ([authorKey, authorName]) => {
        const slug = authorName.replaceAll(' ', '-')
        const earnedBadges = await getAuthorBadges(slug)

        return {
          name: authorName,
          slug,
          data: {
            description: teamMetaByAuthorKey.get(normalizeTeamKey(authorName))?.bio,
          },
          articleCount: articleCountByAuthor.get(authorKey) ?? 0,
          earnedBadges,
        }
      })
  )

  const authorsWithData: AuthorCard[] = [...firestoreAuthors, ...fallbackAuthors]

  // If an avatar is missing (would fallback to the default png), force a direct
  // Firestore read for that specific slug before rendering.
  const authorsWithResolvedAvatars: AuthorCard[] = await Promise.all(
    authorsWithData.map(async (author) => {
      if (author.data?.avatar) return author

      const forcedAvatar =
        (await getPublicWriterAvatarUrl(author.slug)) ??
        (await getPublicWriterAvatarUrlByDisplayName(author.data?.name || author.name))
      if (!forcedAvatar) return author

      return {
        ...author,
        data: {
          ...author.data,
          avatar: forcedAvatar,
        },
      }
    })
  )

  // Sort by article count (descending) then by name
  authorsWithResolvedAvatars.sort((a, b) => {
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
          {authorsWithResolvedAvatars.map((author) => {
            const topBadges = (author.earnedBadges || [])
              .map(eb => {
                const def = BADGE_DEFINITIONS.find(d => d.id === eb.badgeId)
                return def ? { def, earned: eb } : null
              })
              .filter((b): b is { def: Badge; earned: AuthorBadge } => Boolean(b && b.def.id !== 'contributor'))

            topBadges.sort((a, b) => {
              const tierOrder: Record<BadgeTier, number> = { gold: 3, silver: 2, bronze: 1, contributor: 0, special: 4 }
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
                    src={author.data?.avatar || DEFAULT_AVATAR_SRC}
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
                    {toPreviewText(author.data.description)}
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

        {authorsWithResolvedAvatars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No authors found.</p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
