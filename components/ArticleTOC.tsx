"use client"
import { useEffect, useMemo, useRef, useState } from 'react'

type TocItem = { level: number; text: string; slug: string }

export function ArticleTOC({ toc }: { toc: TocItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>(toc[0]?.slug ?? '')

  // Get all heading ids
  const ids = useMemo(() => toc.map(t => t.slug), [toc])

  // Scrollspy effect
  useEffect(() => {
    if (!ids.length) return
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        '#article-root h2[id], #article-root h3[id]'
      )
    )
    if (!headings.length) return
    const TOP_OFFSET = 120
    const onScroll = () => {
      const fromTop = window.scrollY + TOP_OFFSET
      let current = headings[0].id
      for (const h of headings) {
        if (h.offsetTop <= fromTop) current = h.id
        else break
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids])

  // Auto-scroll active TOC item into view
  useEffect(() => {
    const container = containerRef.current
    if (!container || !active) return
    const el = container.querySelector(
      `a[href="#${CSS.escape(active)}"]`
    ) as HTMLElement | null
    if (!el) return
    const cRect = container.getBoundingClientRect()
    const eRect = el.getBoundingClientRect()
    const padding = 24
    const outOfViewTop = eRect.top < cRect.top + padding
    const outOfViewBottom = eRect.bottom > cRect.bottom - padding
    if (outOfViewTop || outOfViewBottom) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [active])

  if (!toc.length) return null
  const minLevel = Math.min(...toc.map(t => t.level))

  return (
    <nav
      ref={containerRef}
      aria-label="Table of contents"
      className="sticky top-8 max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-md p-4 border border-gray-200"
    >
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        Table of Contents
      </div>
      <ul className="space-y-1.5">
        {toc.map(item => {
          const indent = (item.level - minLevel) * 16
          const isActive = active === item.slug
          return (
            <li key={item.slug} style={{ paddingLeft: indent }}>
              <a
                href={`#${item.slug}`}
                aria-current={isActive ? 'true' : undefined}
                className={`block rounded px-2 py-1 text-sm font-medium transition-colors duration-150
                  ${isActive
                    ? 'bg-primary-100 text-primary-700 shadow'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-700'}
                `}
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
