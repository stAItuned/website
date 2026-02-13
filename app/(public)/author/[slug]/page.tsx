import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ComponentProps } from 'react'
import { allPosts } from '@/lib/contentlayer'
import { getPublicWriter } from '@/lib/writer/firestore'
import { getAuthorBadges } from '@/lib/firebase/badge-service'
import { AuthorPageWithPagination } from '@/components/AuthorPageWithPagination'
import { AdminBadgeControls } from '@/components/admin/AdminBadgeControls'
import { PAGINATION_SIZE } from '@/lib/paginationConfig'

// SEO Structured Data
import { JsonLd } from '@/components/seo/JsonLd'
import { generatePersonSchema, generateBreadcrumbSchema } from '@/lib/seo/seo-schemas'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const dynamic = 'force-dynamic'

interface AuthorPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params

  // Get author data from Firestore
  const writer = await getPublicWriter(slug)

  if (!writer) {
    return {
      title: 'Author Not Found - stAI tuned',
      description: 'The requested author could not be found.'
    }
  }

  const title = writer.title ? `, ${writer.title}` : ''
  const description = writer.bio || `Read all articles written by ${writer.displayName}`
  const ogImageUrl = writer.image?.publicUrl

  return {
    title: `${writer.displayName} - Articles - stAI tuned`,
    description: `Read all articles written by ${writer.displayName}${title}. ${description}`,
    alternates: {
      canonical: `${SITE_URL}/author/${slug}`,
    },
    openGraph: {
      url: `${SITE_URL}/author/${slug}`,
      title: `${writer.displayName} - Articles`,
      description: `Read all articles written by ${writer.displayName}`,
      type: 'profile',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              alt: writer.displayName,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${writer.displayName} - Articles`,
      description: `Read all articles written by ${writer.displayName}`,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    }
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params

  // Get author data from Firestore
  const writer = await getPublicWriter(slug)

  if (!writer) {
    notFound()
  }

  // Fetch author badges from Firestore (Client function or Server?)
  // getAuthorBadges imports from badge-service which imports admin. It is server side.
  const badges = await getAuthorBadges(slug)

  type AuthorData = ComponentProps<typeof AuthorPageWithPagination>['authorData']
  const authorData: AuthorData = {
    name: writer.displayName,
    title: writer.title,
    description: writer.bio,
    linkedin: writer.linkedin,
    website: writer.website,
    avatar: writer.image?.publicUrl,
    badges: badges
  }

  // Find all articles by this author
  // We need to match author name. contentlayer posts use 'author' field.
  // It might be 'Mario Rossi' or 'mario-rossi' depending on how it was saved.
  // getAuthorData used to normalize space vs hyphen.
  // Writers on FS had 'name: Mario Rossi'.
  // We should try to match displayName or Name Surname.
  const authorName = writer.displayName || slug.replaceAll('-', ' ')

  const getDateTime = (date: string): number => {
    const time = new Date(date).getTime()
    return Number.isNaN(time) ? 0 : time
  }

  const authorArticles = allPosts
    .filter(
      (post) =>
        (post.author === authorName || post.author === `${writer.name} ${writer.surname}`) &&
        post.published !== false
    )
    .sort((a, b) => getDateTime(b.date) - getDateTime(a.date))

  // Generate Person schema for E-E-A-T
  const personSchema = generatePersonSchema({
    name: writer.displayName,
    jobTitle: writer.title || undefined,
    url: `/author/${slug}`,
    image: writer.image?.publicUrl || undefined,
    description: writer.bio || undefined,
    knowsAbout: ['Artificial Intelligence', 'GenAI', 'Machine Learning', 'AI Engineering'],
    sameAs: writer.linkedin ? [writer.linkedin] : undefined,
    worksFor: {
      name: 'stAI tuned',
      url: 'https://staituned.com',
    },
  })

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Authors', url: '/author' },
    { name: writer.displayName, url: `/author/${slug}` },
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
