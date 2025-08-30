"use client"
import { useScreenSize } from '@/lib/hooks/useScreenSize'
import { useState } from 'react'
import { ArticleTOC } from '@/components/ArticleTOC'
import { MarkdownContent } from '@/components/MarkdownContent'
import { LikeButton } from '@/components/LikeButton'
import ArticleAnalyticsStats from '@/components/ArticleAnalyticsStats'
import AuthorAvatar from '@/components/AuthorAvatar'
import { BackToTopButton } from '@/components/BackToTopButton'
import { PageTransition } from '@/components/ui/PageTransition'
import { RelatedArticles } from '@/components/RelatedArticles'
import Link from 'next/link'
import Image from 'next/image'

export default function ArticlePageClient({
  coverImage,
  article,
  toc,
  target,
  targetDisplay,
  relatedArticles,
  authorData
}: any) {
  const isLarge = useScreenSize()
  const [showTocModal, setShowTocModal] = useState(false)
  const [modalActiveSlug, setModalActiveSlug] = useState<string | null>(null)
  return (
    <PageTransition>
      <section className="relative">
        {/* Mobile TOC Hamburger Button (below header logo) */}
        {!isLarge && toc.length > 0 && (
          <button
            className="fixed left-4 top-20 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-primary-600 focus:outline-none transition-transform duration-200 active:scale-95 hover:bg-primary-50"
            aria-label="Open Table of Contents"
            onClick={() => {
              setModalActiveSlug(null);
              setShowTocModal(true);
            }}
            style={{ position: 'fixed' }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        )}
        {/* Mobile TOC Modal with animation and blur */}
        {!isLarge && (
          <div
            className={`fixed inset-0 z-50 flex items-start justify-start transition-all duration-300 ${showTocModal ? 'pointer-events-auto bg-black/40 backdrop-blur-sm' : 'pointer-events-none bg-transparent backdrop-blur-0'}`}
            style={{ transitionProperty: 'background,backdrop-filter' }}
            onClick={() => setShowTocModal(false)}
          >
            <div
              className={`w-full max-w-xs h-full bg-white shadow-2xl rounded-t-2xl p-4 overflow-y-auto relative transform transition-all duration-300 ${showTocModal ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
              style={{ transitionProperty: 'transform,opacity' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-primary-50 text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors duration-200 shadow"
                aria-label="Close TOC"
                onClick={() => setShowTocModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="mb-4 text-lg font-bold text-primary-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                Table of Contents
              </div>
              <ArticleTOC 
                toc={toc} 
                enableScrollSpy={false}
                highlightSlug={modalActiveSlug || undefined}
                onLinkClick={slug => {
                  setModalActiveSlug(slug);
                  setShowTocModal(false);
                  setTimeout(() => {
                    requestAnimationFrame(() => {
                      const el = document.getElementById(slug) || document.getElementsByName(slug)[0];
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    });
                  }, 250);
                }}
              />
            </div>
          </div>
        )}
        {/* Cover Image */}
        {coverImage && (
          <div className="relative w-full aspect-[16/9] lg:h-[30rem] overflow-hidden">
            <Image
              src={coverImage}
              alt="Article cover"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              unoptimized={coverImage.startsWith('http')}
            />
          </div>
        )}
        {/* Breadcrumb */}
        <div className="lg:absolute lg:top-96 top-32 p-4 z-10">
          <nav className="flex items-center space-x-2 sm:space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-2 sm:px-8 py-2 sm:py-4 rounded-lg font-semibold overflow-x-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent whitespace-nowrap text-xs sm:text-sm lg:text-base">
            <Link href="/" className="opacity-50 hover:underline hover:opacity-100 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/learn" className="opacity-50 hover:underline hover:opacity-100 transition">
              Learn
            </Link>
            <span>/</span>
            <Link href={`/learn/${target}`} className="opacity-50 hover:underline hover:opacity-100 transition">
              {targetDisplay}
            </Link>
            <span>/</span>
            <span className="truncate max-w-[8rem] sm:max-w-xs md:max-w-md lg:max-w-lg inline-block align-bottom" title={article.title}>{article.title}</span>
          </nav>
        </div>
        {/* Responsive: Only render one article version at a time */}
        {isLarge ? (
          <div className="grid grid-cols-[20rem_1fr_20rem] gap-8 max-w-8xl mx-auto my-8 px-4 items-start">
            {/* Left: TOC Sidebar (Desktop only) */}
            <aside className="h-full min-h-screen">
              <ArticleTOC toc={toc} />
            </aside>
            {/* Center: Main Article Content */}
            <article className="prose prose-xl max-w-4xl text-base lg:text-lg mx-auto">
              {/* Article Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 not-prose border-b border-gray-200 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-2 sm:gap-8">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    {article.author && (
                      <AuthorAvatar author={article.author} authorData={authorData} />
                    )}
                  </div>
                  {/* Meta Info Group */}
                  <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 text-gray-600 text-sm divide-x divide-gray-300">
                    {/* Date */}
                    <div className="flex items-center gap-1 px-2 first:pl-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {/* Reading time */}
                    <div className="flex items-center gap-1 px-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{article.readingTime}m</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto flex justify-end sm:justify-center mt-2 sm:mt-0">
                  <div className="w-full sm:w-auto">
                    <LikeButton articleSlug={article.slug} />
                  </div>
                </div>
              </div>
              {/* Article Analytics */}
              <div className="mb-4">
                <ArticleAnalyticsStats slug={article.slug} />
              </div>
              {/* Article Title */}
              <h1 className="text-4xl font-bold mb-8 text-primary-600">
                {article.title}
              </h1>
              {/* Article Body */}
              <div id="article-root">
                <MarkdownContent 
                  content={article.body.raw}
                  className="prose prose-lg max-w-none"
                  articleSlug={article.slug}
                />
              </div>
            </article>
            {/* Right: Empty for future use or spacing */}
            <div />
          </div>
        ) : (
          <div className="flex flex-col gap-10 max-w-2xl mx-auto my-8 px-4 sm:px-6 md:px-8">
            <article className="prose prose-base sm:prose-lg max-w-2xl w-full mx-auto text-[0.98rem] leading-6 sm:text-base lg:text-lg rounded-2xl bg-white shadow-lg p-5 sm:p-8">
              {/* Article Header */}
              <div className="flex flex-col gap-4 items-center mb-8 not-prose border-b border-gray-200 pb-4 text-center">
                {/* Author */}
                <div className="flex flex-col items-center gap-1 justify-center">
                  {article.author && (
                    <>
                      <AuthorAvatar author={article.author} />
                      {article.author.jobTitle && (
                        <span className="text-xs text-gray-500 mt-1">{article.author.jobTitle}</span>
                      )}
                    </>
                  )}
                </div>
                {/* Article Title */}
                <h1 className="text-2xl sm:text-4xl font-bold text-primary-600 mb-2 mt-2 leading-tight">
                  {article.title}
                </h1>
                {/* Meta Info Group */}
                <div className="flex flex-row flex-wrap items-center justify-center gap-3 text-gray-600 text-sm divide-x divide-gray-300">
                  {/* Date */}
                  <div className="flex items-center gap-1 px-2 first:pl-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {/* Reading time */}
                  <div className="flex items-center gap-1 px-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{article.readingTime}m</span>
                  </div>
                </div>
                {/* Like Button */}
                <div className="flex justify-center mt-2">
                  <LikeButton articleSlug={article.slug} />
                </div>
              </div>
              {/* Article Analytics */}
              <div className="mb-4">
                <ArticleAnalyticsStats slug={article.slug} />
              </div>
              {/* Article Title */}
              <h1 className="text-4xl font-bold mb-8 text-primary-600">
                {article.title}
              </h1>
              {/* Article Body */}
              <div id="article-root">
                <MarkdownContent 
                  content={article.body.raw}
                  className="prose prose-lg max-w-none"
                  articleSlug={article.slug}
                />
              </div>
            </article>
          </div>
        )}
      </section>
      {/* Back to Top Button (client component) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <BackToTopButton />
      </div>
      {/* Related Articles */}
      <RelatedArticles relatedArticles={relatedArticles.map((post: any) => ({
        title: post.title,
        slug: post.slug,
        cover: post.cover,
        author: post.author,
        date: post.date,
        meta: post.meta,
        readingTime: post.readingTime,
        target: post.target,
        topics: post.topics
      }))} />
    </PageTransition>
  )
}
