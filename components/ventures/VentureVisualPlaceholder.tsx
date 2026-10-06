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
      className="relative min-h-[250px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-amber-50 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 sm:min-h-[300px] lg:min-h-[340px]"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary-300/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />

      <div className="absolute inset-5 overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 sm:inset-6">
        <div className="flex h-9 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-700">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="grid h-[calc(100%-2.25rem)] grid-cols-[64px_1fr]">
          <div className="border-r border-slate-200 p-3 dark:border-slate-700">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, itemIndex) => (
                <div
                  key={`${title}-nav-${itemIndex}`}
                  className={`h-2 rounded-full ${itemIndex === index % 5 ? 'bg-amber-400/80' : 'bg-slate-200 dark:bg-slate-700'}`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-4 h-3 w-24 rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-16 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" />
              <div className="h-16 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" />
              <div className="h-20 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-slate-200 bg-white/90 px-5 py-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">{placeholderLabel}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
