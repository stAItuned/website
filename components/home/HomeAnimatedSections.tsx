'use client'

import { ScrollReveal, FadeIn } from '@/components/ui/Animations'
import { HomeDualTracks } from './HomeDualTracks'
import { HomeArticleShortlist } from './HomeArticleShortlist'
import { HomeNextStep } from './HomeNextStep'
import type { Post } from 'contentlayer/generated'

interface ColumnShortlist {
  heading: string
  description: string
  linkLabel: string
  linkHref: string
  secondaryLinkLabel?: string
  secondaryLinkHref?: string
  microCopy?: string
  layout?: 'wide'
  items: any[]
}

interface HomeAnimatedSectionsProps {
  shortlistColumns: ColumnShortlist[]
  posts: Post[]
}

export function HomeAnimatedSections({ shortlistColumns, posts }: HomeAnimatedSectionsProps) {
  return (
    <>
      {/* Dual tracks overview with animation */}
      <ScrollReveal threshold={0.2} triggerOnce={false}>
        <FadeIn duration={600}>
          <HomeDualTracks />
        </FadeIn>
      </ScrollReveal>

      {/* Shortlist per binari with animation */}
      <ScrollReveal threshold={0.2} triggerOnce={false}>
        <FadeIn duration={600} delay={100}>
          <HomeArticleShortlist columns={shortlistColumns} posts={posts} />
        </FadeIn>
      </ScrollReveal>

      {/* Next step micro-block with animation */}
      <ScrollReveal threshold={0.25} triggerOnce={false}>
        <FadeIn duration={600} delay={150}>
          <HomeNextStep />
        </FadeIn>
      </ScrollReveal>
    </>
  )
}
