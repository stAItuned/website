import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getContentDateTime } from '@/lib/content-date'
import LearnTargetPageClient, { type LearnTargetArticle, type LearnTarget } from './LearnTargetPageClient'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

const VALID_TARGETS: LearnTarget[] = ['newbie', 'midway', 'expert']

const TARGET_CONTENT: Record<LearnTarget, { title: string; description: string }> = {
  newbie: {
    title: 'Newbie AI: guide introduttive e basi pratiche',
    description:
      'Percorso Newbie di stAI tuned: articoli introduttivi su AI e GenAI, spiegazioni chiare e primi passi applicabili.',
  },
  midway: {
    title: 'Midway AI: pattern pratici e implementazione',
    description:
      'Percorso Midway di stAI tuned: guide operative, trade-off e best practice per usare AI e GenAI in progetti reali.',
  },
  expert: {
    title: 'Expert AI: approfondimenti avanzati e research',
    description:
      'Percorso Expert di stAI tuned: deep dive tecnici, ottimizzazioni avanzate e contenuti su architetture AI moderne.',
  },
}

const TARGET_DISPLAY: Record<LearnTarget, LearnTargetArticle['target']> = {
  newbie: 'Newbie',
  midway: 'Midway',
  expert: 'Expert',
}

export const dynamic = 'force-static'
export const revalidate = 3600

export function generateStaticParams(): Array<{ target: LearnTarget }> {
  return VALID_TARGETS.map((target) => ({ target }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ target: string }>
}): Promise<Metadata> {
  const { target } = await params
  const normalizedTarget = target.toLowerCase() as LearnTarget

  if (!VALID_TARGETS.includes(normalizedTarget)) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const content = TARGET_CONTENT[normalizedTarget]
  const canonicalUrl = `${SITE_URL}/learn/${normalizedTarget}`

  return {
    title: `${content.title} | stAI tuned`,
    description: content.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${content.title} | stAI tuned`,
      description: content.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function LearnTargetPage({ params }: { params: Promise<{ target: string }> }) {
  const { target } = await params
  const normalizedTarget = target.toLowerCase() as LearnTarget

  if (!VALID_TARGETS.includes(normalizedTarget)) {
    notFound()
  }

  const allPublishedCount = allPosts.filter((post) => post.published !== false).length

  const targetArticles: LearnTargetArticle[] = allPosts
    .filter(
      (post) =>
        post.published !== false &&
        post.target?.toLowerCase() === normalizedTarget
    )
    .sort((a, b) => getContentDateTime(b.date, b.updatedAt) - getContentDateTime(a.date, a.updatedAt))
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      cover: post.cover,
      author: post.author,
      date: post.date,
      meta: post.meta,
      readingTime: post.readingTime > 0 ? post.readingTime : undefined,
      target: TARGET_DISPLAY[normalizedTarget],
      language: post.language,
      topics: post.topics,
      primaryTopic: post.primaryTopic,
    }))

  return (
    <LearnTargetPageClient
      target={normalizedTarget}
      articles={targetArticles}
      totalPublishedArticles={allPublishedCount}
    />
  )
}
