import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getAuthorData } from '@/lib/authors'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
const REVALIDATE_INTERVAL = 60 * 60 // 1 ora in secondi
export const revalidate = REVALIDATE_INTERVAL

export const metadata: Metadata = {
  title: 'Meet Our Writers - stAItuned',
  description: 'Meet the talented writers and AI experts behind stAItuned. Discover our team of passionate authors sharing knowledge about AI and technology.',
  openGraph: {
    title: 'Meet Our Writers - stAItuned',
    description: 'Meet the talented writers and AI experts behind stAItuned.',
    type: 'website',
  },
}

export default async function MeetPage() {
  // Get all unique authors from published posts (our writers)
  const uniqueAuthors = Array.from(new Set(
    allPosts
      .filter(post => post.published !== false && post.author)
      .map(post => post.author!)
  ))

  // Get author data and article counts
  const authorsWithData = await Promise.all(
    uniqueAuthors.map(async (authorName) => {
      const authorData = await getAuthorData(authorName)
      const articleCount = allPosts.filter(
        post => post.author === authorName && post.published !== false
      ).length
      
      return {
        name: authorName,
        slug: authorName.replaceAll(' ', '-'),
        data: authorData,
        articleCount
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
      <div className="max-w-7xl mx-auto mb-32 mt-[150px] px-4 space-y-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg font-semibold">
          <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-base lg:text-xl truncate">Meet</span>
        </nav>

        {/* Introduction */}
        <section className="text-primary-600 md:text-lg space-y-8">
          <div className="space-y-2">
            <h3 className="font-bold text-2xl">
              Have you always wanted to exchange opinions about AI practical applications?
            </h3>
            <p>Then you&apos;re in the right place.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-2xl">We are stAI tuned</h3>
            <p>
              In January 2022, after years of university spent wishing to find a space for sharing ideas, we wondered if it was the right time for us to create an AI community to share knowledge. As a consequence, stAI tuned was created: an open community in which everyone can share their knowledge, research projects and insights related to the AI topic.
              After the beginning of the project we realized that it’s very common to hear conversations about Artificial Intelligence in many contexts, like work, television, with friends and so on.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-16">
          <h1 className="text-6xl font-bold text-primary-600 text-center uppercase">Our Writers</h1>
          
          {/* Writers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {authorsWithData.map((author) => (
              <Link
                key={author.slug}
                href={`/author/${author.slug}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-6 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Image
                      src={`/content/team/${author.slug}/propic.jpg`}
                      alt={author.name}
                      width={100}
                      height={100}
                      className="rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                      {author.data?.name || author.name}
                    </h3>
                    {author.data?.title && (
                      <p className="text-sm text-primary-600 font-medium">
                        {author.data.title}
                      </p>
                    )}
                  </div>
                  
                  {author.data?.description && (
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {author.data.description}
                    </p>
                  )}
                  
                  <div className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                    {author.articleCount} article{author.articleCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {authorsWithData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No writers found.</p>
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  )
}
