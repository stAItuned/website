'use client'

import Image from 'next/image'
import Link from 'next/link'

interface AuthorBioCardProps {
  author: string
  authorData: {
    name: string
    title?: string
    description?: string
    avatar?: string
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  } | null
}

export function AuthorBioCard({ author, authorData }: AuthorBioCardProps) {
  if (!authorData) return null

  const { name, title, description, avatar, linkedin, twitter, github, website } = authorData
  
  // Convert author name to slug format for URL
  const authorSlug = author.replaceAll(' ', '-')

  return (
    <section className="my-8 px-4 py-4 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-primary-100 dark:border-slate-700">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            About the Author
          </h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Link href={`/author/${authorSlug}`} className="block group">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden ring-2 ring-primary-200 dark:ring-primary-800 transition-all duration-300 group-hover:ring-primary-400 dark:group-hover:ring-primary-600">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <span className="text-white text-2xl md:text-3xl font-bold">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Bio Content */}
          <div className="flex-1 min-w-0">
            <Link href={`/author/${authorSlug}`} className="group">
              <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {name}
              </h4>
            </Link>
            
            {title && (
              <p className="text-xs md:text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                {title}
              </p>
            )}

            {description && (
              <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed mb-3 line-clamp-2">
                {description}
              </p>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-2">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0077B5] hover:bg-[#006399] text-white transition-colors duration-200"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}

              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white transition-colors duration-200"
                  aria-label="Twitter Profile"
                  title="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}

              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  aria-label="GitHub Profile"
                  title="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200"
                  aria-label="Website"
                  title="Website"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}

              {/* View all articles by author */}
              <Link
                href={`/author/${authorSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white text-xs font-medium transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>View articles</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
