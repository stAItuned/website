'use client'

/**
 * ArticleSkeleton - Skeleton loader for article content
 * Shows during initial load for better perceived performance
 */
export function ArticleSkeleton() {
    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto my-6 px-4 sm:px-6 animate-pulse">
            {/* Cover image skeleton */}
            <div className="w-full aspect-video bg-gray-200 dark:bg-slate-700 rounded-2xl" />

            {/* Article card skeleton */}
            <div className="rounded-2xl bg-white/95 dark:bg-slate-900/90 shadow-lg p-5 sm:p-8">
                {/* Title skeleton */}
                <div className="flex flex-col items-center mb-6 pb-5 border-b border-gray-200 dark:border-slate-700">
                    <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded-lg w-3/4 mb-3" />
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-lg w-1/2 mb-4" />

                    {/* Author skeleton */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24" />
                    </div>

                    {/* Meta info skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-4">
                    {/* Paragraph 1 */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
                    </div>

                    {/* Heading skeleton */}
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mt-6" />

                    {/* Paragraph 2 */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                    </div>

                    {/* Image skeleton */}
                    <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-slate-700 rounded-xl my-4" />

                    {/* Paragraph 3 */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                    </div>

                    {/* List skeleton */}
                    <div className="space-y-2 pl-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full" />
                            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full" />
                            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full" />
                            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * ArticleSkeletonCompact - Smaller skeleton for inline loading states
 */
export function ArticleSkeletonCompact() {
    return (
        <div className="animate-pulse space-y-3 p-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
    )
}
