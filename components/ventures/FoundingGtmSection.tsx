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
          <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function FoundingGtmSection({ bridge, role }: FoundingGtmSectionProps) {
  const mailHref = `mailto:${BRAND.contact.email}?subject=${encodeURIComponent(role.ctaSubject)}`

  return (
    <section id="founding-gtm" className="border-t border-slate-200 bg-slate-50 px-5 py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500 dark:text-secondary-500">
            {bridge.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl">
            {bridge.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-primary-400/30 bg-white p-7 shadow-sm dark:bg-slate-950 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-500 dark:text-primary-300">
              {bridge.existingTitle}
            </p>
            <CheckList items={bridge.existingItems} />
          </article>

          <article className="rounded-3xl border border-secondary-500/40 bg-secondary-500/10 p-7 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700 dark:text-secondary-500">
              {bridge.missingTitle}
            </p>
            <CheckList items={bridge.missingItems} />
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
          {bridge.connector}
        </p>

        <div className="mt-16 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{role.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">{role.title}</h2>
              <p className="mt-3 text-lg font-bold text-secondary-500">{role.roleName}</p>
              <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg">{role.intro}</p>

              <div className="mt-8 space-y-3 border-y border-white/10 py-6">
                {role.notThis.map((item) => (
                  <p key={item} className="text-sm font-semibold text-slate-300 sm:text-base">
                    {item}
                  </p>
                ))}
              </div>

              <p className="mt-7 text-base leading-7 text-slate-300">
                <span className="font-bold text-white">{role.ownershipLead}: </span>
                {role.ownership}
              </p>
            </div>

            <div className="p-7 sm:p-10 lg:p-12">
              <h3 className="text-xl font-bold">{role.fitTitle}</h3>
              <CheckList items={role.fitItems} inverse />

              <h3 className="mt-9 text-xl font-bold">{role.notFitTitle}</h3>
              <ul className="mt-5 space-y-3">
                {role.notFitItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300 sm:text-base">
                    <span aria-hidden className="mt-2 text-secondary-500">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/[0.03] p-7 text-center sm:p-10 lg:p-12">
            <h3 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{role.closingTitle}</h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{role.closingBody}</p>
            <a
              href={mailHref}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-secondary-500 px-7 py-3 text-sm font-bold text-primary-600 transition hover:-translate-y-0.5 hover:bg-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {role.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
