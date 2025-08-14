import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getAuthorData } from '@/lib/authors'
import { AuthorPageWithPagination } from '@/components/AuthorPageWithPagination'
import { PAGINATION_SIZE } from '@/lib/paginationConfig'

interface AuthorPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = params
  
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
    openGraph: {
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
  const { slug } = params
  // Convert slug back to author name
  const authorName = slug.replaceAll('-', ' ')
  // Get author data
  const authorData = await getAuthorData(authorName)
  if (!authorData) {
    notFound()
  }
  // Find all articles by this author
  const authorArticles = allPosts.filter((post) => 
    post.author === authorName && post.published !== false
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Pagination logic
  return (
    <AuthorPageWithPagination 
      authorData={authorData} 
      authorArticles={authorArticles} 
      pageSize={PAGINATION_SIZE} 
      slug={slug} 
    />
  )
}
