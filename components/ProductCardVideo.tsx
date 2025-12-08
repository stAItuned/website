'use client'

interface ProductCardVideoProps {
  src: string
  className?: string
}

export function ProductCardVideo({ src, className = '' }: ProductCardVideoProps) {
  const handleFullscreen = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const video = e.currentTarget
    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen()
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen()
    }
  }

  return (
    <>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        controls
        controlsList="nodownload"
        className={`cursor-pointer ${className}`}
        onClick={handleFullscreen}
      />
      {/* Fullscreen icon hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      </div>
    </>
  )
}
