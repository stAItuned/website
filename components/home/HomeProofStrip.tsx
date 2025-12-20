/**
 * HomeProofStrip - Transversal proof points
 * Works for both blog readers and B2B prospects
 */
export function HomeProofStrip() {
    const points = [
        {
            icon: '✅',
            text: 'Risultati misurabili',
        },
        {
            icon: '🔒',
            text: 'Privacy-first, dati reali',
        },
        {
            icon: '🚫',
            text: 'Zero fuffa, zero lock-in',
        },
    ]

    return (
        <section className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                {points.map((point) => (
                    <div
                        key={point.text}
                        className="flex items-center gap-2 text-sm md:text-base text-slate-600 dark:text-slate-300"
                    >
                        <span className="text-lg">{point.icon}</span>
                        <span className="font-medium">{point.text}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
