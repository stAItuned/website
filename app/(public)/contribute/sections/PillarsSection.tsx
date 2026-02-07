'use client'

import { motion } from 'framer-motion'

interface PillarItem {
    title: string
    desc: string
}

interface PillarsSectionProps {
    translations: {
        title: string
        subtitle: string
        items: PillarItem[]
    }
}

/**
 * Pillars section showing the core principles of contribution.
 */
export function PillarsSection({ translations: t }: PillarsSectionProps) {
    const icons = ['🧬', '⚖️', '🛠️']

    return (
        <section className="py-32 bg-[#020412] text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 tracking-tight"
                    >
                        {t.title}
                    </motion.h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {t.items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group shadow-2xl shadow-black/20"
                        >
                            <div className="text-5xl mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                {icons[i]}
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-amber-500 tracking-tight group-hover:text-amber-400 transition-colors uppercase tracking-[0.05em]">{item.title}</h3>
                            <p className="text-slate-300 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
