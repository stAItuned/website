'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { contributeTranslations, ContributeLanguage } from '@/lib/i18n/contribute-translations'
import { useLearnLocale } from '@/lib/i18n'
import { useAuth } from '@/components/auth/AuthContext'
import { Contribution } from '@/lib/types/contributor'

export default function ContributePageClient() {
    const { locale } = useLearnLocale()
    const { user } = useAuth()
    const [drafts, setDrafts] = useState<Contribution[]>([])



    const fetchTokenAndLoad = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/contributor/get-progress', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success && json.contributions) {
                setDrafts(json.contributions.filter((c: any) => c.status !== 'published' && c.status !== 'scheduled').slice(0, 3));
            }
        } catch (e) { console.error(e) }
    }

    useEffect(() => {
        fetchTokenAndLoad()
    }, [user])

    const lang = locale as ContributeLanguage
    const t = contributeTranslations[lang].landing

    const paths = [
        {
            key: 'autonomy',
            icon: '⚡️',
            color: 'from-amber-400 to-orange-500',
            ...t.paths.autonomy
        },
        {
            key: 'guided',
            icon: '🧭',
            color: 'from-blue-400 to-indigo-500',
            ...t.paths.guided
        },
        {
            key: 'interview',
            icon: '🎙️',
            color: 'from-emerald-400 to-teal-500',
            ...t.paths.interview
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-3xl mx-auto space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        stAItuned Contributors
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {t.hero.title}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {t.hero.subtitle}
                    </p>
                </motion.div>
            </header>



            {/* Value Props */}
            <section className="py-16 relative">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    {[
                        { ...t.value.authority, icon: '👔', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
                        { ...t.value.distribution, icon: '🚀', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
                        { ...t.value.ownership, icon: '🛡️', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6 ${item.bg} ${item.text}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Pillars Section */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                        >
                            {t.pillars.title}
                        </motion.h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            {t.pillars.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {t.pillars.items.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition duration-300"
                            >
                                <div className="text-4xl mb-6">
                                    {i === 0 ? '🧬' : i === 1 ? '⚖️' : '🛠️'}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-primary-400">{item.title}</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Path Cards */}
            <section className="py-24 px-6 relative">
                <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                        {t.pathSection.title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        {t.pathSection.subtitle}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">

                    <div className="grid md:grid-cols-3 gap-6">
                        {paths.map((path, i) => (
                            <motion.div
                                key={path.key}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group relative flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
                            >
                                {/* Gradient Top Line */}
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${path.color}`} />

                                <div className="mb-6 text-4xl">{path.icon}</div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {path.title}
                                </h3>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                                    {path.description}
                                </p>

                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-6">
                                    <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                                        🕒
                                    </span>
                                    {path.time}
                                </div>

                                <Link
                                    href={`/contribute/wizard?path=${path.key}&lang=${lang}`}
                                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-center transition hover:opacity-90 active:scale-95"
                                >
                                    {path.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resume Section */}
            {drafts.length > 0 && (
                <section className="max-w-4xl mx-auto px-6 mb-12">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-primary-100 dark:border-primary-900/30 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl">📝</div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span>↩️</span> {lang === 'it' ? 'Riprendi da dove eri rimasto' : 'Resume where you left off'}
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {drafts.map(draft => (
                                    <Link key={draft.id} href={`/contribute/wizard?id=${draft.id}`} className="group block bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1 block">
                                            {draft.status} • {draft.path}
                                        </span>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2group-hover:text-primary-600 transition-colors">
                                            {draft.brief?.topic || draft.brief?.thesis || 'Untitled Draft'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {new Date(draft.updatedAt).toLocaleDateString()}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer CTA */}
            <section className="py-20 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-600">
                    Hai domande? Scrivi a <a href="mailto:info@staituned.com" className="underline hover:text-amber-500">info@staituned.com</a>
                </p>
            </section>

        </div>
    )
}
