"use client"
import { useEffect, useMemo, useRef, useState } from 'react'

type TocItem = { level: number; text: string; slug: string }

export function ArticleTOC({ toc, enableScrollSpy = true, onLinkClick, highlightSlug }: { toc: TocItem[]; enableScrollSpy?: boolean; onLinkClick?: (slug: string) => void; highlightSlug?: string }) {
  // Get all heading ids
  const ids = useMemo(() => toc.map(t => t.slug), [toc])
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>(toc[0]?.slug ?? '')

  // Debug: log all heading IDs and TOC slugs after mount
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('#article-root h2[id], #article-root h3[id]'));
    const headingIds = headings.map(h => h.id);
    console.log('[TOC DEBUG] TOC slugs:', ids);
    console.log('[TOC DEBUG] Heading IDs in DOM:', headingIds);
    const missing = ids.filter(id => !headingIds.includes(id));
    if (missing.length > 0) {
      console.warn('[TOC DEBUG] These TOC slugs are missing in the DOM:', missing);
    }
    const extra = headingIds.filter(id => !ids.includes(id));
    if (extra.length > 0) {
      console.warn('[TOC DEBUG] These heading IDs are in the DOM but not in the TOC:', extra);
    }
  }, [ids]);

  // Scrollspy effect
  useEffect(() => {
    if (!enableScrollSpy) return;
    if (!ids.length) return;
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        '#article-root h2[id], #article-root h3[id]'
      )
    );
    if (!headings.length) {
      console.warn('[TOC DEBUG] No headings found in #article-root');
      return;
    }
    console.log('[TOC DEBUG] Found headings:', headings.map(h => ({ id: h.id, offsetTop: h.offsetTop })));
    const TOP_OFFSET = 120;
    const BOTTOM_THRESHOLD = 120; // px from bottom to consider "at bottom"
    const onScroll = () => {
      const fromTop = window.scrollY + TOP_OFFSET;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.offsetTop <= fromTop) current = h.id;
        else break;
      }
      // If near the bottom, force last heading as active
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - BOTTOM_THRESHOLD) {
        current = headings[headings.length - 1].id;
      }
      setActive(current);
      console.log('[TOC DEBUG] Scroll event: fromTop', fromTop, 'active', current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids, enableScrollSpy]);

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
  // Only use highlightSlug if scrollspy is disabled (mobile modal)
  const effectiveActive = !enableScrollSpy && highlightSlug ? highlightSlug : active;

  return (
    <nav
      ref={containerRef}
      aria-label="Table of contents"
      className="sticky top-8 max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-lg p-4 border border-gray-100"
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600">
        <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
        Table of Contents
      </div>
      <hr className="mb-3 border-gray-200" />
      <ul className="space-y-1.5">
        {toc.map(item => {
          const indent = (item.level - minLevel) * 16
          const isActive = effectiveActive === item.slug
          return (
            <li key={item.slug} style={{ paddingLeft: indent }}>
              <a
                href={`#${item.slug}`}
                aria-current={isActive ? 'true' : undefined}
                className={`block rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 border-l-4
                  ${isActive
                    ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-primary-200 hover:text-primary-700'}
                `}
                onClick={e => {
                  if (onLinkClick) {
                    e.preventDefault();
                    onLinkClick(item.slug);
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
