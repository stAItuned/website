/**
 * TransparencySection - "Cosa NON è Career OS" cards for transparency
 * Reduced to 3 key points for cleaner messaging
 */
export default function TransparencySection() {
    const items = [
        { text: 'Non è un bootcamp video', desc: 'Zero ore di video, solo deliverable concreti e feedback reale' },
        { text: 'Non è recruiting', desc: 'Ti rendiamo assumibile, non ti cerchiamo noi il lavoro' },
        { text: 'Non è job guarantee', desc: 'Non etico. Ti diamo sistema + asset, tu esegui' },
    ]

    return (
        <section className="py-16 px-6 bg-slate-100 dark:bg-[#0F1117]">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8 text-[#1A1E3B] dark:text-white">
                    Cosa <span className="text-rose-500">NON</span> è Career OS
                </h2>
                <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
                    Per essere trasparenti fin dall&apos;inizio:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold text-rose-600 dark:text-rose-400 text-sm mb-1">
                                ❌ {item.text}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
