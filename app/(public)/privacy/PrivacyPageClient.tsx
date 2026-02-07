'use client'

import Link from 'next/link'
import { useLearnLocale, legalTranslations } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/PageTransition'

export default function PrivacyPageClient() {
    const { locale } = useLearnLocale()
    const t = legalTranslations[locale].privacy

    return (
        <PageTransition>
            <div className="px-4 py-16">
                <div className="mx-auto max-w-5xl space-y-10 text-slate-900 dark:text-slate-100">
                    <header className="space-y-3">
                        <p className="text-sm uppercase tracking-wider text-amber-600 font-semibold">{t.badge}</p>
                        <h1 className="text-3xl font-bold">{t.title}</h1>
                        <p className="text-base text-slate-600 dark:text-slate-400">
                            {t.intro}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                            {t.controller}
                        </p>
                        <p className="text-xs text-slate-400">{t.lastUpdate}</p>
                    </header>

                    <section className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 shadow-sm">
                        <h2 className="text-xl font-semibold">{t.audience.title}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t.audience.intro}
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
                            {t.audience.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">{t.dataCollection.title}</h2>
                        <div className="space-y-4">
                            {t.dataCollection.sections.map((section, idx) => (
                                <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 text-sm text-slate-600 dark:text-slate-400 shadow-sm">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base">{section.title}</h3>
                                    <p>{section.content}</p>
                                    {section.items && (
                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                            {section.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.subsections && section.subsections.map((sub, i) => (
                                        <div key={i} className="mt-4">
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{sub.title}</h4>
                                            <p>{sub.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">{t.legalBase.title}</h2>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                            <p>{t.legalBase.content1}</p>
                            <p>{t.legalBase.content2}</p>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-3">{t.legalBase.recipientsTitle}</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5">
                                    {t.legalBase.recipients.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">{t.retention.title}</h2>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                            <p>{t.retention.content1}</p>
                            <p>{t.retention.content2}</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold">{t.rights.title}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t.rights.content}
                        </p>
                    </section>

                    <section className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-6 text-sm shadow-sm">
                        <h2 className="text-xl font-bold">{t.footerTitle}</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t.footerText}
                        </p>
                        <p className="mt-2">
                            <Link href="mailto:info@staituned.com" className="text-amber-600 underline font-medium">info@staituned.com</Link>
                        </p>
                    </section>
                </div>
            </div>
        </PageTransition>
    )
}
