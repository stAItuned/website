import type { ChangelogEntry } from '@/lib/contentlayer'
import { cn } from '@/lib/utils'

const formatDate = (isoDate: string, locale: string, variant: 'short' | 'long'): string => {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(locale, variant === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

const MAX_BULLETS = 3

type ArticleChangelogProps = {
  updatedAt?: string
  changelog?: ChangelogEntry[]
  lang: 'it' | 'en'
  className?: string
}

export function ArticleChangelog({ updatedAt, changelog, lang, className }: ArticleChangelogProps) {
  const hasChangelog = (changelog?.length ?? 0) > 0
  const locale = lang === 'it' ? 'it-IT' : 'en-US'
  const labels = lang === 'it'
    ? { title: 'Aggiornamenti', updated: 'Aggiornato il', show: 'Mostra', hide: 'Nascondi', older: 'Aggiornamenti precedenti' }
    : { title: 'Updates', updated: 'Updated on', show: 'Show', hide: 'Hide', older: 'Older updates' }

  if (!hasChangelog) return null

  const latest = changelog![0]!
  const effectiveUpdatedAt = updatedAt ?? latest.date
  const updatedLabel = effectiveUpdatedAt
    ? `${labels.updated} ${formatDate(effectiveUpdatedAt, locale, 'short')}`
    : labels.title

  return (
    <details
      id="changelog"
      className={cn(
        'group not-prose mt-8 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/30',
        className
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 select-none marker:hidden [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-200">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-hidden="true">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H9L7 6v12a2 2 0 002 2z" />
            </svg>
          </span>
          <span className="truncate">
            <span className="font-semibold text-slate-900 dark:text-white">{labels.title}:</span>{' '}
            <span>{updatedLabel}</span>
            {latest.version ? <span className="text-slate-500 dark:text-slate-400"> • v{latest.version}</span> : null}
          </span>
        </div>
        <span className="shrink-0 text-xs font-semibold text-primary-700 dark:text-primary-300">
          <span className="group-open:hidden">{labels.show}</span>
          <span className="hidden group-open:inline">{labels.hide}</span>
        </span>
      </summary>

      <div className="mt-3 space-y-3">
        <div className="rounded-lg border border-slate-200/60 bg-white/70 p-3 dark:border-slate-700/60 dark:bg-slate-950/20">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {[
                latest.version ? `v${latest.version}` : null,
                latest.title ?? null,
              ].filter(Boolean).join(' — ') || (lang === 'it' ? 'Aggiornamento' : 'Update')}
            </div>
            <time className="text-xs text-slate-600 dark:text-slate-300" dateTime={latest.date}>
              {formatDate(latest.date, locale, 'short')}
            </time>
          </div>
          {latest.changes.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {latest.changes.slice(0, MAX_BULLETS).map((change) => (
                <li key={change}>{change}</li>
              ))}
              {latest.changes.length > MAX_BULLETS ? (
                <li className="text-slate-500 dark:text-slate-400">
                  … +{latest.changes.length - MAX_BULLETS} {lang === 'it' ? 'altre' : 'more'}
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>

        {changelog!.length > 1 ? (
          <details className="group">
            <summary className="cursor-pointer select-none text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
              {labels.older}
            </summary>
            <div className="mt-3 space-y-3">
              {changelog!.slice(1).map((entry, idx) => (
                <div key={`${entry.date}-${entry.version ?? 'na'}-${idx}`} className="rounded-lg border border-slate-200/60 bg-white/60 p-3 dark:border-slate-700/60 dark:bg-slate-950/15">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {[
                        entry.version ? `v${entry.version}` : null,
                        entry.title ?? null,
                      ].filter(Boolean).join(' — ') || (lang === 'it' ? 'Aggiornamento' : 'Update')}
                    </div>
                    <time className="text-xs text-slate-600 dark:text-slate-300" dateTime={entry.date}>
                      {formatDate(entry.date, locale, 'short')}
                    </time>
                  </div>
                  {entry.changes.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {entry.changes.slice(0, MAX_BULLETS).map((change) => (
                        <li key={change}>{change}</li>
                      ))}
                      {entry.changes.length > MAX_BULLETS ? (
                        <li className="text-slate-500 dark:text-slate-400">
                          … +{entry.changes.length - MAX_BULLETS} {lang === 'it' ? 'altre' : 'more'}
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </details>
  )
}
