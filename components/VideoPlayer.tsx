'use client'

interface VideoPlayerProps {
  src: string
  className?: string
  showFullscreenHint?: boolean
  isPortrait?: boolean
}

export function VideoPlayer({ src, className = '', showFullscreenHint = false, isPortrait = false }: VideoPlayerProps) {
  const handleFullscreen = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen()
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen()
    }
  }

  // Determine the appropriate aspect ratio class
  const aspectRatioClass = isPortrait ? 'aspect-[9/16]' : 'aspect-video'

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
        className={`cursor-pointer ${aspectRatioClass} ${className}`}
        onClick={handleFullscreen}
      />
      {showFullscreenHint && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 md:hidden transition-opacity duration-300">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>Tap to fullscreen</span>
          </div>
        </div>
      )}
    </>
  )
}
