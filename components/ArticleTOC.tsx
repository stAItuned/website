"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

type TocItem = { level: number; text: string; slug: string }

interface ArticleTOCProps {
  toc: TocItem[]
  enableScrollSpy?: boolean
  onLinkClick?: (slug: string) => void
  highlightSlug?: string
  sticky?: boolean
}

export function ArticleTOC({ toc, enableScrollSpy = true, onLinkClick, highlightSlug, sticky = true }: ArticleTOCProps) {
  // Get all heading ids
  const ids = useMemo(() => toc.map(t => t.slug), [toc])
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>(toc[0]?.slug ?? '')

  useEffect(() => {
    if (ids.length) {
      setActive(ids[0])
    }
  }, [ids])

  useEffect(() => {
    if (!enableScrollSpy || !ids.length) return

    let animationFrameId: number | null = null
    let headingPositions: { id: string; top: number }[] = []
    let ticking = false
    let waitingLogShown = false

    // Calculate document-relative position of an element
    const calculateHeadingPositions = (headings: HTMLElement[]) => {
      // Temporarily scroll to top to get accurate positions
      const currentScroll = window.scrollY

      headingPositions = headings.map(h => ({
        id: h.id,
        top: h.getBoundingClientRect().top + currentScroll
      }))

      console.log(`[TOC] Cached heading positions:`, headingPositions.map((p, i) => `${i}: ${p.id} at ${p.top.toFixed(0)}px`))
    }

    const updateActiveFromScroll = () => {
      if (!headingPositions.length) return

      const OFFSET = 150 // Distance from top of viewport to consider a heading "active"
      const scrollTop = window.scrollY
      const triggerPoint = scrollTop + OFFSET

      // Default to first heading
      let currentId = headingPositions[0].id

      // If we're near the top of the page, use first heading
      if (scrollTop < 50) {
        setActive(prev => {
          if (prev !== currentId) {
            console.log(`[TOC] Near top of page, active: ${currentId}`)
            return currentId
          }
          return prev
        })
        return
      }

      // Check if we're at the very bottom of the page
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = documentHeight - windowHeight

      // Only consider "at bottom" if there's scrollable content and we're near the end
      if (maxScroll > 200 && scrollTop >= maxScroll - 50) {
        currentId = headingPositions[headingPositions.length - 1].id
        setActive(prev => {
          if (prev !== currentId) {
            console.log(`[TOC] At bottom of page, active: ${currentId}`)
            return currentId
          }
          return prev
        })
        return
      }

      // Find the last heading that has scrolled past the trigger point
      for (let i = 0; i < headingPositions.length; i++) {
        const pos = headingPositions[i]

        if (pos.top <= triggerPoint) {
          currentId = pos.id
        } else {
          // This heading hasn't been reached yet, stop here
          break
        }
      }

      setActive(prev => {
        if (prev !== currentId) {
          console.log(`[TOC] Scrolled to: ${currentId} (scrollY: ${scrollTop.toFixed(0)}, trigger: ${triggerPoint.toFixed(0)})`)
          return currentId
        }
        return prev
      })
    }

    const handleScroll = () => {
      if (!headingPositions.length || ticking) return
      ticking = true
      requestAnimationFrame(() => {
        updateActiveFromScroll()
        ticking = false
      })
    }

    const handleResize = () => {
      // Recalculate positions on resize
      const root = document.getElementById('article-root')
      if (root) {
        const headings = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
        if (headings.length) {
          calculateHeadingPositions(headings)
        }
      }
      handleScroll()
    }

    const tryInit = () => {
      const root = document.getElementById('article-root')
      if (!root) {
        if (!waitingLogShown) {
          console.log('[TOC] Waiting for #article-root to mount before observing headings')
          waitingLogShown = true
        }
        animationFrameId = requestAnimationFrame(tryInit)
        return
      }

      const headings = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'))

      if (!headings.length) {
        console.warn('[TOC] No h2/h3 headings found in #article-root')
        return
      }

      console.log(`[TOC] Found ${headings.length} headings; initializing scroll spy`)
      console.log(`[TOC] Initial scroll position: ${window.scrollY}px`)

      // Calculate and cache heading positions
      calculateHeadingPositions(headings)

      // Small delay to ensure layout is stable before first activation
      setTimeout(() => {
        updateActiveFromScroll()
      }, 100)

      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)
    }

    tryInit()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [ids, enableScrollSpy])

  // Auto-scroll active TOC item into view (within TOC container only)
  useEffect(() => {
    const container = containerRef.current
    if (!container || !active) return
    const el = container.querySelector(
      `a[href="#${CSS.escape(active)}"]`
    ) as HTMLElement | null
    if (!el) return

    // Only scroll within the TOC container, not the entire page
    const cRect = container.getBoundingClientRect()
    const eRect = el.getBoundingClientRect()
    const padding = 24
    const outOfViewTop = eRect.top < cRect.top + padding
    const outOfViewBottom = eRect.bottom > cRect.bottom - padding

    if (outOfViewTop || outOfViewBottom) {
      // Scroll only the TOC container, not the page
      const elementOffsetTop = el.offsetTop
      const targetScrollTop = elementOffsetTop - container.offsetHeight / 2 + el.offsetHeight / 2

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })
    }
  }, [active])

  if (!toc.length) return null
  const minLevel = Math.min(...toc.map(t => t.level))
  // Only use highlightSlug if scrollspy is disabled (mobile modal)
  const effectiveActive = !enableScrollSpy && highlightSlug ? highlightSlug : active;

  const navClasses = clsx(
    'bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white transition-colors duration-200',
    'max-h-[calc(100vh-8rem)] overflow-y-auto', // Increased offset from 3rem to 8rem to prevent clipping below viewport (assuming top-24 sticky parent)
    sticky ? 'sticky top-8 z-10' : 'w-full',
    'scrollbar-thin scrollbar-thumb-primary-300 dark:scrollbar-thumb-secondary-500 scrollbar-track-gray-100 dark:scrollbar-track-slate-700'
  )

  return (
    <nav
      ref={containerRef}
      aria-label="Table of contents"
      className={navClasses}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-secondary-200">
        <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
        Table of Contents
      </div>
      <hr className="mb-3 border-gray-200 dark:border-slate-700" />
      <ul className="space-y-1.5">
        {toc.map(item => {
          const indent = (item.level - minLevel) * 16
          const isActive = effectiveActive === item.slug
          const linkBaseClasses =
            'block rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900'
          const activeClasses =
            'bg-primary-50 border-primary-500 text-primary-700 shadow-sm dark:bg-slate-800 dark:text-white'
          const inactiveClasses =
            'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-primary-200 dark:hover:border-primary-500 hover:text-primary-700 dark:hover:text-primary-200'
          return (
            <li key={item.slug} style={{ paddingLeft: indent }}>
              <a
                href={`#${item.slug}`}
                aria-current={isActive ? 'true' : undefined}
                className={`${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses
                  }`}
                onClick={e => {
                  if (onLinkClick) {
                    e.preventDefault()
                    onLinkClick(item.slug)
                  }
                  console.log(`[TOC] Clicked TOC link: #${item.slug}`)
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
