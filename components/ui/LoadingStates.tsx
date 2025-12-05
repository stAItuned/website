'use client'

import { ReactNode } from 'react'

interface LoadingSkeletonProps {
  className?: string
  width?: string
  height?: string
}

/**
 * Basic skeleton loader with shimmer effect
 */
export function Skeleton({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}: LoadingSkeletonProps) {
  return (
    <div 
      className={`skeleton ${width} ${height} ${className}`}
      role="status"
      aria-label="Loading..."
    />
  )
}

/**
 * Article Card Skeleton - matches ArticleCard dimensions
 */
export function ArticleCardSkeleton() {
  return (
    <div className="relative flex flex-col h-full min-h-[480px] max-h-[480px] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 shrink-0">
        <div className="skeleton w-full h-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="relative bg-slate-50 dark:bg-gray-800 rounded-b-2xl p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 items-center">
            <Skeleton width="w-8" height="h-8" className="rounded-full" />
            <Skeleton width="w-24" height="h-4" />
          </div>
          <Skeleton width="w-16" height="h-4" />
        </div>
        
        <div className="space-y-3">
          <Skeleton width="w-full" height="h-6" />
          <Skeleton width="w-5/6" height="h-6" />
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-4/5" height="h-4" />
        </div>
        
        <div className="mt-auto pt-4">
          <Skeleton width="w-full" height="h-10" className="rounded-lg" />
        </div>
      </div>
    </div>
  )
}

/**
 * Grid of Article Card Skeletons
 */
export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Text Loading Skeleton - for paragraphs
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          width={index === lines - 1 ? 'w-4/5' : 'w-full'} 
          height="h-4" 
        />
      ))}
    </div>
  )
}

/**
 * Shimmer Loading Effect - can be overlaid on content
 */
export function ShimmerEffect({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  )
}

/**
 * Pulsing Dot Loader
 */
export function PulsingDots() {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

/**
 * Spinner Loader
 */
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }
  
  return (
    <div 
      className={`${sizeClasses[size]} border-primary-500/30 border-t-primary-500 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading..."
    />
  )
}

/**
 * Page Loading Overlay
 */
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  )
}

/**
 * Button Loading State
 */
export function ButtonLoader({ children, loading = false }: { children: ReactNode, loading?: boolean }) {
  return (
    <>
      {loading && (
        <span className="mr-2">
          <Spinner size="sm" />
        </span>
      )}
      {children}
    </>
  )
}

/**
 * Content Placeholder with Icon
 */
export function ContentPlaceholder({ 
  icon = '📄',
  title = 'Loading content...',
  description 
}: { 
  icon?: string
  title?: string
  description?: string 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="text-6xl animate-bounce-subtle">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-500 text-center max-w-md">{description}</p>
      )}
      <PulsingDots />
    </div>
  )
}

/**
 * Progress Bar
 */
export function ProgressBar({ 
  progress = 0, 
  className = '',
  showPercentage = false 
}: { 
  progress?: number
  className?: string
  showPercentage?: boolean 
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}
