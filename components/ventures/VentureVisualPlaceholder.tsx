interface VentureVisualPlaceholderProps {
  title: string
  label: string
  index: number
  placeholderLabel: string
}

/**
 * Reserved visual area for future product screenshots or motion assets.
 * The placeholder keeps the final media geometry stable without shipping fake imagery.
 */
export function VentureVisualPlaceholder({
  title,
  label,
  index,
  placeholderLabel,
}: VentureVisualPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative min-h-[260px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/30 sm:min-h-[320px] lg:min-h-[390px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 via-slate-950 to-slate-950" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-secondary-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary-300/10 blur-3xl" />

      <div className="absolute inset-5 rounded-2xl border border-white/10 sm:inset-7">
        <div className="flex h-10 items-center gap-2 border-b border-white/10 px-4">
          <span className="h-2 w-2 rounded-full bg-secondary-500/70" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
        </div>
        <div className="grid h-[calc(100%-2.5rem)] grid-cols-[72px_1fr]">
          <div className="border-r border-white/10 p-3">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, itemIndex) => (
                <div
                  key={`${title}-nav-${itemIndex}`}
                  className={`h-2 rounded-full ${itemIndex === index % 5 ? 'bg-secondary-500/60' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-5 h-3 w-28 rounded-full bg-white/20" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-20 rounded-xl border border-white/10 bg-white/5" />
              <div className="h-20 rounded-xl border border-white/10 bg-white/5" />
              <div className="h-24 rounded-xl border border-white/10 bg-white/5 sm:col-span-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-sm sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-500">{placeholderLabel}</p>
          <p className="mt-1 text-sm font-semibold text-white">{title}</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
