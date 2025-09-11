'use client'

import { ProgressiveImage } from '@/lib/performance/CriticalRendering'
import { useState } from 'react'

interface OptimizedArticleImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
  caption?: string
}

export function OptimizedArticleImage({ 
  src, 
  alt, 
  priority = false, 
  className = '',
  caption 
}: OptimizedArticleImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Generate low quality placeholder (you could enhance this)
  const lowQualitySrc = src.includes('?') 
    ? `${src}&w=50&q=20` 
    : `${src}?w=50&q=20`
  
  return (
    <figure className={`my-8 ${className}`}>
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <ProgressiveImage
          src={src}
          alt={alt}
          lowQualitySrc={lowQualitySrc}
          priority={priority}
          className="w-full h-auto"
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default OptimizedArticleImage
