'use client'

import Link from 'next/link'
import { useLearnLocale, legalTranslations } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/PageTransition'

export default function CookiePolicyClient() {
    const { locale } = useLearnLocale()
    const t = legalTranslations[locale].cookie

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

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">{t.technicalSection.title}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t.technicalSection.content}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">{t.categoriesSection.title}</h2>
                        <div className="space-y-3">
                            {t.categoriesSection.categories.map((cat, idx) => (
                                <article key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 shadow-sm">
                                    <h3 className="text-base font-semibold">{cat.title}</h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {cat.content}
                                    </p>
                                    {cat.details && (
                                        <dl className="mt-2 text-xs text-slate-500">
                                            <div className="flex gap-1">
                                                <dt className="font-semibold text-slate-700 dark:text-slate-300">{cat.details.label}:</dt>
                                                <dd>{cat.details.value}</dd>
                                            </div>
                                        </dl>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">{t.managementSection.title}</h2>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                            <p>{t.managementSection.content1}</p>
                            <p>{t.managementSection.content2}</p>
                            <p>{t.managementSection.content3}</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">{t.thirdPartiesSection.title}</h2>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                            <p>{t.thirdPartiesSection.content1}</p>
                            <p>{t.thirdPartiesSection.content2}</p>
                        </div>
                    </section>

                    <section className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-6 text-sm shadow-sm">
                        <h2 className="text-xl font-semibold">{t.footerTitle}</h2>
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
