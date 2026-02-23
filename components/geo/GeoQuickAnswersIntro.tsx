"use client"

import { Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type QuickAnswerData = {
  title?: string
  bullets?: string[]
  oneThing?: string
}

interface GeoQuickAnswersIntroProps {
  quickAnswer?: QuickAnswerData
  lang?: 'it' | 'en'
  className?: string
}

const normalizeInlineReferences = (text: string): string => {
  return text.replace(/\[(\d+(?:\s*(?:,|-)\s*\d+)*)\](?!\()/g, (_match, group: string) => {
    const ids = group
      .split(/[\s,-]+/)
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index)

    if (ids.length === 0) return _match
    if (ids.length === 1) return `[${ids[0]}](#ref-${ids[0]})`

    const linked = ids.map((id) => `[${id}](#ref-${id})`).join(', ')
    return `[${linked}]`
  })
}

export function GeoQuickAnswersIntro({
  quickAnswer,
  lang = 'en',
  className = ''
}: GeoQuickAnswersIntroProps) {
  const bullets = quickAnswer?.bullets?.filter((bullet) => bullet.trim().length > 0) ?? []
  const hasOneThing = Boolean(quickAnswer?.oneThing?.trim())

  if (!hasOneThing && bullets.length === 0) {
    return null
  }

  const title = quickAnswer?.title?.trim() || (lang === 'it' ? 'Punti chiave' : 'Key Takeaways')
  const normalizedOneThing = quickAnswer?.oneThing ? normalizeInlineReferences(quickAnswer.oneThing) : ''

  return (
    <section className={`not-prose mb-4 ${className}`} aria-label={title}>
      <div className="group relative rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/85 dark:bg-slate-900/45 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_18px_rgba(245,158,11,0.08)] hover:border-amber-500/20">
        <div className="grid grid-cols-[32px,1fr] gap-2.5 px-3.5 py-2.5 border-b border-slate-100/80 dark:border-slate-800/50">
          <span className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50/90 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200/50 dark:ring-amber-800/40">
            <Zap className="w-4 h-4" />
          </span>
          <p className="m-0 pt-1 text-[11px] sm:text-[12px] uppercase tracking-[0.14em] font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {title}
          </p>
        </div>

        <div className="px-3.5 py-3">
          {hasOneThing && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="m-0 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                    {children}
                  </p>
                ),
                a: ({ children, ...props }) => (
                  typeof props.href === 'string' && props.href.startsWith('#ref-')
                    ? (
                      <a
                        {...props}
                        className="font-semibold text-primary-600 dark:text-primary-300 underline underline-offset-2 hover:text-primary-700 dark:hover:text-primary-200"
                      >
                        {children}
                      </a>
                    )
                    : (
                      <a
                        {...props}
                        className="text-amber-700 dark:text-amber-300 underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    )
                ),
                strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>,
              }}
            >
              {normalizedOneThing}
            </ReactMarkdown>
          )}

          {bullets.length > 0 && (
            <ul className={`${hasOneThing ? 'mt-2.5' : ''} space-y-1.5`}>
              {bullets.map((bullet, index) => (
                <li
                  key={`${index}-${bullet.slice(0, 20)}`}
                  className="flex items-start gap-2.5 text-[13px] sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500/70 dark:bg-amber-400/70 shrink-0" />
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="m-0">{children}</p>,
                      a: ({ children, ...props }) => (
                        typeof props.href === 'string' && props.href.startsWith('#ref-')
                          ? (
                            <a
                              {...props}
                              className="font-semibold text-primary-600 dark:text-primary-300 underline underline-offset-2 hover:text-primary-700 dark:hover:text-primary-200"
                            >
                              {children}
                            </a>
                          )
                          : (
                            <a
                              {...props}
                              className="text-amber-700 dark:text-amber-300 underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-200"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          )
                      ),
                      strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>,
                    }}
                  >
                    {normalizeInlineReferences(bullet)}
                  </ReactMarkdown>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
