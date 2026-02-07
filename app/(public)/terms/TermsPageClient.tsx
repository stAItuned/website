'use client'

import Link from 'next/link'
import { useLearnLocale, legalTranslations } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/PageTransition'

export default function TermsPageClient() {
    const { locale } = useLearnLocale()
    const t = legalTranslations[locale].terms

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
                        <p className="text-xs text-slate-400">{t.lastUpdate}</p>
                    </header>

                    {t.sections.map((section, idx) => (
                        <section key={idx} className="space-y-4">
                            <h2 className="text-2xl font-bold">{section.title}</h2>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 text-sm text-slate-600 dark:text-slate-400 shadow-sm space-y-4">
                                {section.content && <p>{section.content}</p>}

                                {section.items && (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {section.items.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                )}

                                {section.subsections && section.subsections.map((sub, i) => (
                                    <div key={i} className="space-y-2 pt-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{sub.title}</h3>
                                        {Array.isArray(sub.content) ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {sub.content.map((item, j) => (
                                                    <li key={j}>{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>{sub.content}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    <section className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-6 text-sm shadow-sm">
                        <h2 className="text-xl font-bold">{t.footerTitle}</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t.footerText}
                        </p>
                        <p className="mt-2 text-amber-600 font-medium">
                            <Link href="mailto:info@staituned.com" className="underline">info@staituned.com</Link>
                        </p>
                    </section>
                </div>
            </div>
        </PageTransition>
    )
}
