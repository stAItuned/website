import { BRAND } from '@/lib/brand'
import type { VenturesCopy } from './venturesContent'

interface FoundingGtmSectionProps {
  bridge: VenturesCopy['bridge']
  role: VenturesCopy['role']
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base"
        >
          <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function FoundingGtmSection({ bridge, role }: FoundingGtmSectionProps) {
  const mailHref = `mailto:${BRAND.contact.email}?subject=${encodeURIComponent(role.ctaSubject)}`

  return (
    <section
      id="founding-gtm"
      className="border-t border-slate-200 bg-white px-4 py-14 dark:border-slate-800 dark:bg-slate-950 md:px-6 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/20 bg-primary-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden />
            {bridge.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {bridge.title}
          </h2>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-300">
              {bridge.existingTitle}
            </p>
            <CheckList items={bridge.existingItems} />
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {bridge.missingTitle}
            </p>
            <CheckList items={bridge.missingItems} />
          </article>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-base font-bold text-slate-900 dark:text-white">
          {bridge.connector}
        </p>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 text-white shadow-lg sm:px-8 md:py-9">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {role.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">{role.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              {role.intro}
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {role.fitItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium leading-5 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-7 text-center">
            <a href={mailHref} className="btn-brand-primary">
              <span>{role.cta}</span>
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
