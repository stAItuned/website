import Link from 'next/link'
import Image from 'next/image'
import { LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/icons/SocialIcons'

const socialLinks = [
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

export function Footer() {
  return (
    <footer className="px-16 py-8 bg-primary-600 lg:grid lg:grid-cols-3 flex flex-col justify-self-end items-center space-y-10 lg:space-y-0">
      <div className="flex flex-col gap-4">
        <div className="flex space-x-8 justify-start">
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
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/assets/general/logo-text.png"
          alt="stAItuned"
          width={200}
          height={50}
          className="h-12 w-auto"
        />
      </div>

      <div className="flex flex-col items-end space-y-4">
        <p className="text-slate-200 text-sm">
          © 2024 stAItuned. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
