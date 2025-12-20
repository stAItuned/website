'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLearnLocale } from '@/lib/i18n'

interface LearningPath {
    id: string
    name: string
    slug: string
    description: string
    image: string
    articleCount: number
}

interface LearnLearningPathsProps {
    paths: LearningPath[]
    className?: string
}

/**
 * Learning Paths section - renamed and repositioned lower in the page
 * 
 * Foundation / Applied / Advanced paths for content navigation
 */
export function LearnLearningPaths({ paths, className = '' }: LearnLearningPathsProps) {
    const { t } = useLearnLocale()

    // Map old names to new translations
    const pathNameMapping: Record<string, keyof typeof t.learningPaths.paths> = {
        newbie: 'foundation',
        midway: 'applied',
        expert: 'advanced',
    }

    const gradients = {
        foundation: 'from-emerald-500 to-green-600',
        applied: 'from-amber-500 to-orange-600',
        advanced: 'from-rose-500 to-red-600'
    }

    const icons = {
        foundation: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8V8.5l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z" />
            </svg>
        ),
        applied: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
        advanced: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
            </svg>
        )
    }

    return (
        <section className={`${className}`}>
            {/* Section Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {t.learningPaths.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    {t.learningPaths.subtitle}
                </p>
            </div>

            {/* Path Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {paths.map((path) => {
                    const mappedKey = pathNameMapping[path.slug] || 'foundation'
                    const translatedPath = t.learningPaths.paths[mappedKey]
                    const gradient = gradients[mappedKey]
                    const icon = icons[mappedKey]

                    return (
                        <Link
                            key={path.id}
                            href={`/learn?target=${path.slug}`}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all"
                        >
                            {/* Image */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <Image
                                    src={path.image}
                                    alt={translatedPath.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                {/* Free Badge */}
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase">
                                    {t.common.free}
                                </div>

                                {/* Article Count */}
                                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-xs font-medium text-slate-700 dark:text-slate-300 backdrop-blur-sm">
                                    {path.articleCount} {t.common.articles}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-semibold mb-2`}>
                                    {icon}
                                    {translatedPath.name}
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {translatedPath.description}
                                </p>

                                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                                    {t.learningPaths.cta}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
