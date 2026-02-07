'use client'

import { motion } from 'framer-motion'

interface EvidenceItem {
    value: string
    label: string
    desc: string
    source: string
    url?: string
}

interface EvidenceSectionProps {
    translations: {
        title: string
        items: EvidenceItem[]
    }
}

/**
 * Evidence section displaying key statistics with sources.
 */
export function EvidenceSection({ translations: t }: EvidenceSectionProps) {
    const icons = ['📈', '🚀', '⚡️']

    return (
        <section className="py-24 border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        {t.title}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {t.items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="stai-glass-card p-8 rounded-[2rem] border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center md:items-start text-center md:text-left group transition-all duration-300"
                        >
                            <div className="flex items-center justify-between w-full mb-6">
                                <span className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                                    {item.value}
                                </span>
                                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-2xl group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-colors shadow-sm">
                                    {icons[i]}
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 leading-tight tracking-tight">
                                {item.label}
                            </h4>

                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow font-medium">
                                {item.desc}
                            </p>

                            <a
                                href={(item as any).url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mt-auto"
                            >
                                <span>{item.source}</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
