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


  return (
    <div className="relative top-0 h-screen shadow-2xl flex flex-col justify-center">


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
