import type { BusinessTranslations } from '@/lib/i18n/business-translations'

export function BusinessImpactSection({ t }: { t: BusinessTranslations }) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 xs:px-6 lg:py-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-secondary-500">{t.benefits.eyebrow}</p>
          <h2 className="text-2xl font-bold tracking-tight xs:text-3xl">{t.benefits.title}</h2>
          <p className="text-base leading-7 text-slate-200">{t.benefits.lead}</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {t.benefits.items.slice(0, 3).map((item) => (
            <article key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl font-black tracking-tight text-secondary-500">{item.value}</p>
              <h3 className="mt-2 text-base font-semibold text-white">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">{item.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
