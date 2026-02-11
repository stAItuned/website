'use client'

import ReactMarkdown from 'react-markdown'
import { useLearnLocale } from '@/lib/i18n'
import Link from 'next/link'
import { PageTransition } from '@/components/ui/PageTransition'
import remarkGfm from 'remark-gfm'

interface ContributorProgramClientProps {
    contentIt: string
    contentEn: string
}

export default function ContributorProgramClient({ contentIt, contentEn }: ContributorProgramClientProps) {
    const { locale } = useLearnLocale()

    // Choose content based on locale
    const content = locale === 'it' ? contentIt : contentEn

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-6">

                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
                        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/meet" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            Chi siamo
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            Contributor Program
                        </span>
                    </nav>

                    <article className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:text-slate-900 dark:prose-h1:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-slate-800 dark:prose-h2:text-slate-100
            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
            prose-li:text-slate-600 dark:prose-li:text-slate-300
            prose-code:text-primary-600 dark:prose-code:text-primary-400
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-blockquote:border-l-primary-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </article>

                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                        <Link
                            href="/meet"
                            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Torna a Chi siamo
                        </Link>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
