import { BRAND } from '@/lib/brand'
import type { VenturesCopy } from './venturesContent'

interface FoundingGtmSectionProps {
  bridge: VenturesCopy['bridge']
  role: VenturesCopy['role']
}

function CheckList({ items, inverse = false }: { items: string[]; inverse?: boolean }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className={`flex gap-3 text-sm leading-6 sm:text-base ${inverse ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'}`}
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
    <section id="founding-gtm" className="border-t border-slate-200 bg-white px-4 py-16 dark:border-slate-800 dark:bg-slate-950 md:px-6 md:py-20">
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

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-300">
              {bridge.existingTitle}
            </p>
            <CheckList items={bridge.existingItems} />
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {bridge.missingTitle}
            </p>
            <CheckList items={bridge.missingItems} />
          </article>
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-lg font-bold text-slate-900 dark:text-white">
          {bridge.connector}
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white shadow-xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">{role.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">{role.title}</h2>
              <p className="mt-3 text-base font-bold text-amber-400 md:text-lg">{role.roleName}</p>
              <p className="mt-5 text-base leading-7 text-slate-300">{role.intro}</p>

              <div className="mt-7 space-y-3 border-y border-white/10 py-5">
                {role.notThis.map((item) => (
                  <p key={item} className="text-sm font-semibold text-slate-300">
                    {item}
                  </p>
                ))}
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-300 md:text-base">
                <span className="font-bold text-white">{role.ownershipLead}: </span>
                {role.ownership}
              </p>
            </div>

            <div className="p-7 lg:p-10">
              <h3 className="text-xl font-bold">{role.fitTitle}</h3>
              <CheckList items={role.fitItems} inverse />

              <h3 className="mt-8 text-xl font-bold">{role.notFitTitle}</h3>
              <ul className="mt-5 space-y-3">
                {role.notFitItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <span aria-hidden className="mt-2 text-amber-400">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/5 p-7 text-center lg:p-9">
            <h3 className="text-2xl font-bold md:text-3xl">{role.closingTitle}</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{role.closingBody}</p>
            <a href={mailHref} className="btn-brand-primary mt-7">
              <span>{role.cta}</span>
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
