/**
 * HomeWhyDifferent - Uniqueness + Quality section
 * Static business-focused content showing what makes us different.
 */
export function HomeWhyDifferent() {
    const pillars = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Time-to-value',
            description: 'Pilot in settimane, non mesi.',
            details: 'Scope chiaro + metriche definite = sai subito se funziona.',
            accent: 'amber',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Qualità verificabile',
            description: 'Controlli + validazione + log.',
            details: 'Evitiamo risposte inventate. Il team può sempre verificare.',
            accent: 'emerald',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Prodotto, non notebook',
            description: 'Flusso usabile con interfaccia.',
            details: 'Il tuo team lo usa davvero, non resta su un laptop.',
            accent: 'blue',
        },
    ]

    const getAccentClasses = (accent: string) => {
        switch (accent) {
            case 'amber':
                return {
                    border: 'border-amber-200 hover:border-amber-300 dark:border-amber-800/50 dark:hover:border-amber-700',
                    bg: 'bg-amber-50 dark:bg-amber-950/30',
                    icon: 'text-amber-600 dark:text-amber-400',
                    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
                }
            case 'emerald':
                return {
                    border: 'border-emerald-200 hover:border-emerald-300 dark:border-emerald-800/50 dark:hover:border-emerald-700',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                    icon: 'text-emerald-600 dark:text-emerald-400',
                    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
                }
            case 'blue':
            default:
                return {
                    border: 'border-blue-200 hover:border-blue-300 dark:border-blue-800/50 dark:hover:border-blue-700',
                    bg: 'bg-blue-50 dark:bg-blue-950/30',
                    icon: 'text-blue-600 dark:text-blue-400',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
                }
        }
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
            {/* Section header */}
            <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                    Veloci, ma con standard da prodotto{' '}
                    <span className="text-slate-500 dark:text-slate-400">(non da demo).</span>
                </h2>
            </div>

            {/* 3 columns */}
            <div className="grid gap-6 md:grid-cols-3">
                {pillars.map((pillar) => {
                    const classes = getAccentClasses(pillar.accent)
                    return (
                        <article
                            key={pillar.title}
                            className={`group relative rounded-2xl border-2 ${classes.border} ${classes.bg} p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                        >
                            {/* Icon */}
                            <div className={`inline-flex p-3 rounded-xl ${classes.iconBg} ${classes.icon} mb-5`}>
                                {pillar.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                                {pillar.title}
                            </h3>

                            {/* Description */}
                            <p className="text-base font-medium text-slate-800 dark:text-slate-200 mb-2">
                                {pillar.description}
                            </p>

                            {/* Details */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {pillar.details}
                            </p>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}


