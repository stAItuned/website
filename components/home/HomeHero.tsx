import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/icons/SocialIcons'

interface SocialLink {
  name: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

const socialLinks: SocialLink[] = [
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/company/stai-tuned/',
    icon: LinkedInIcon
  },
  {
    name: 'instagram', 
    url: 'https://www.instagram.com/stai.tuned/',
    icon: InstagramIcon
  },
  {
    name: 'facebook',
    url: 'https://www.facebook.com/stAItuned',
    icon: FacebookIcon
  },
  {
    name: 'tiktok',
    url: 'https://www.tiktok.com/@staituned?lang=en',
    icon: TikTokIcon
  }
]

interface HomeHeroProps {
  totalArticles: number
  totalWriters: number
  activeUsers: number | string
  sessions: number | string
}

export function HomeHero({ totalArticles, totalWriters, activeUsers, sessions }: HomeHeroProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleOpen = () => {
    setShowFeedback(true)
    setSubmitted(false)
    setFeedback('')
  }
  const handleClose = () => {
    setShowFeedback(false)
    setFeedback('')
    setSubmitted(false)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setShowFeedback(false)
      setFeedback('')
      setSubmitted(false)
    }, 1200)
  }

  return (
    <div className="relative top-0 h-screen shadow-2xl flex flex-col justify-center">
      {/* Feedback overlay */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 backdrop-blur-sm transition-all">
          <div className="w-full h-full" onClick={handleClose} />
          <form
            onSubmit={handleSubmit}
            className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-sm flex flex-col gap-4 border border-slate-200 animate-fade-in"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-2 right-3 text-slate-400 hover:text-slate-700 text-2xl font-bold"
              aria-label="Close feedback dialog"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Send us your feedback</h2>
            <textarea
              className="w-full min-h-[80px] rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical text-slate-800 text-base"
              placeholder="Your thoughts, suggestions, or issues..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              required
              disabled={submitted}
              maxLength={1000}
              aria-label="Feedback textarea"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition border border-slate-200"
                disabled={submitted}
              >Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60"
                disabled={submitted || !feedback.trim()}
              >{submitted ? 'Thank you!' : 'Send'}</button>
            </div>
            {submitted && (
              <div className="text-green-600 text-center mt-2">Feedback sent!</div>
            )}
          </form>
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute h-full w-screen bg-slate-900/20 z-10" />
      
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/general/home_bg.webp"
          alt="AI Background"
          fill
          className="object-cover scale-x-[-1]"
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>

      {/* Social icons */}
      <div className="absolute right-16 md:flex flex-col space-y-8 hidden z-20">
        {socialLinks.map((social) => {
          const IconComponent = social.icon
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${social.name} icon`}
              className="w-10 h-10 text-slate-200 opacity-50 hover:opacity-100 transition"
            >
              <IconComponent className="w-10 h-10" />
            </a>
          )
        })}
      </div>


      {/* Main heading */}
      <h1 className="text-4xl px-8 md:px-0 md:text-6xl absolute w-full md:w-1/2 md:left-16 md:right-0 font-semibold text-slate-50 z-20">
        Artificial intelligence within everyone&apos;s reach
      </h1>

      {/* Feedback button */}
      <button
        onClick={handleOpen}
        className="fixed z-40 bottom-8 right-8 md:bottom-10 md:right-12 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition border-2 border-white/70 backdrop-blur-lg flex items-center gap-2"
        aria-label="Send feedback"
        style={{marginTop: 0}}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.5A7.5 7.5 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        Feedback
      </button>

      {/* Bottom stats */}
      <div className="absolute text-center bottom-16 left-8 right-8 md:left-32 md:right-32 font-semibold text-slate-50 flex justify-between space-x-4 z-20">
        <Link href="/learn">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl">{totalArticles}</h3>
            <p className="text-lg md:text-xl">articles</p>
          </div>
        </Link>
        
        <div className="space-y-2">
          <h3 className="text-4xl md:text-5xl">{activeUsers}</h3>
          <div>
            <p className="text-lg md:text-xl">users</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-4xl md:text-5xl">{sessions}</h3>
          <div>
            <p className="text-lg md:text-xl">sessions</p>
          </div>
        </div>
        
        <Link href="/meet">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl">{totalWriters}</h3>
            <p className="text-lg md:text-xl">writers</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
