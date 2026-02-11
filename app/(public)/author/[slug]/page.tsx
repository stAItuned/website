import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getAuthorData } from '@/lib/authors'
import { getAuthorBadges } from '@/lib/firebase/badge-service'
import { AuthorPageWithPagination } from '@/components/AuthorPageWithPagination'
import { AdminBadgeControls } from '@/components/admin/AdminBadgeControls'
import { PAGINATION_SIZE } from '@/lib/paginationConfig'

// SEO Structured Data
import { JsonLd } from '@/components/seo/JsonLd'
import { generatePersonSchema, generateBreadcrumbSchema } from '@/lib/seo/seo-schemas'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

interface AuthorPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params

  // Convert slug back to author name
  const authorName = slug.replaceAll('-', ' ')

  // Get author data
  const authorData = await getAuthorData(authorName)

  if (!authorData) {
    return {
      title: 'Author Not Found - stAItuned',
      description: 'The requested author could not be found.'
    }
  }

  return {
    title: `${authorData.name} - Articles - stAItuned`,
    description: `Read all articles written by ${authorData.name}${authorData.title ? `, ${authorData.title}` : ''}. ${authorData.description}`,
    alternates: {
      canonical: `${SITE_URL}/author/${slug}`,
    },
    openGraph: {
      url: `${SITE_URL}/author/${slug}`,
      title: `${authorData.name} - Articles`,
      description: `Read all articles written by ${authorData.name}`,
      type: 'profile',
      images: [{
        url: `/cms/team/${slug}/propic.jpg`,
        alt: authorData.name
      }],
    },
    twitter: {
      card: 'summary',
      title: `${authorData.name} - Articles`,
      description: `Read all articles written by ${authorData.name}`,
      images: [`/cms/team/${slug}/propic.jpg`],
    }
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  // Convert slug back to author name
  const authorName = slug.replaceAll('-', ' ')
  // Get author data
  const authorData = await getAuthorData(authorName)
  if (!authorData) {
    notFound()
  }

  // Fetch author badges from Firestore
  const badges = await getAuthorBadges(slug)
  authorData.badges = badges

  // Find all articles by this author
  const authorArticles = allPosts.filter((post) =>
    post.author === authorName && post.published !== false
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Generate Person schema for E-E-A-T
  const personSchema = generatePersonSchema({
    name: authorData.name,
    jobTitle: authorData.title || undefined,
    url: `/author/${slug}`,
    image: authorData.avatar,
    description: authorData.description || undefined,
    knowsAbout: ['Artificial Intelligence', 'GenAI', 'Machine Learning', 'AI Engineering'],
    sameAs: authorData.linkedin ? [authorData.linkedin] : undefined,
    worksFor: {
      name: 'stAItuned',
      url: 'https://staituned.com',
    },
  })

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Authors', url: '/author' },
    { name: authorData.name, url: `/author/${slug}` },
  ])

  // Pagination logic
  return (
    <>
      {/* SEO Structured Data (JSON-LD) */}
      <JsonLd data={personSchema} />
      <JsonLd data={breadcrumbSchema} />

      <AuthorPageWithPagination
        authorData={authorData}
        authorArticles={authorArticles}
        pageSize={PAGINATION_SIZE}
        slug={slug}
      />

      {/* Admin Controls (Calculated for current author) */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdminBadgeControls authorSlug={slug} />
      </div>
    </>
  )
}
