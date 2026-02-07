'use client'

import { motion } from 'framer-motion'

interface ValueItem {
    title: string
    desc: string
}

interface ValuePropsSectionProps {
    sectionTitle: string
    translations: {
        authority: ValueItem
        distribution: ValueItem
        ownership: ValueItem
    }
}

/**
 * Value proposition section showing benefits for contributors.
 */
export function ValuePropsSection({ sectionTitle, translations: t }: ValuePropsSectionProps) {
    const items = [
        { ...t.authority, icon: '👔', color: 'blue' },
        { ...t.distribution, icon: '🚀', color: 'purple' },
        { ...t.ownership, icon: '🛡️', color: 'emerald' }
    ]

    return (
        <section className="py-24 relative bg-slate-50/50 dark:bg-slate-900/30">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        {sectionTitle}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="stai-glass-card p-10 rounded-[2.5rem] border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 group hover:border-amber-200 dark:hover:border-amber-900/30"
                        >
                            <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-4xl mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${item.color === 'blue' ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                item.color === 'purple' ? 'bg-purple-50/50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                                    'bg-amber-50/50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                }`}>
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-tight">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
