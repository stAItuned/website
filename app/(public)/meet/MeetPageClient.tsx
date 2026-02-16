'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'
import { HeroAnimatedBackground } from '@/components/home/HeroAnimatedBackground'
import { PageTransition } from '@/components/ui/PageTransition'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import { BadgeIcon } from '@/components/badges/BadgeIcon'
import { BadgeTooltip } from '@/components/badges/BadgeTooltip'
import { Badge, AuthorBadge } from '@/lib/types/badge'

const DEFAULT_AVATAR_SRC = '/assets/general/avatar.png'

interface AuthorData {
    name: string
    slug: string
    data: {
        name?: string
        title?: string
        description?: string
        website?: string
        avatar?: string
        badges?: AuthorBadge[]
    } | null
    articleCount: number
}

interface MeetPageClientProps {
    topContributors: AuthorData[]
}

const TextParser = ({
    text,
    className = "",
    boldClassName = "font-medium text-slate-900 dark:text-white",
    italicClassName = "italic text-primary-600 dark:text-primary-400 font-medium"
}: {
    text: string,
    className?: string,
    boldClassName?: string,
    italicClassName?: string
}) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <span key={index} className={boldClassName}>{part.slice(2, -2)}</span>;
                } else if (part.startsWith('*') && part.endsWith('*')) {
                    return <span key={index} className={italicClassName}>{part.slice(1, -1)}</span>;
                }
                return part;
            })}
        </span>
    );
};

export default function MeetPageClient({ topContributors }: MeetPageClientProps) {
    const { locale } = useLearnLocale()
    const t = homeTranslations[locale].meet

    const filteredContributors = useMemo(() => {
        let list = [...topContributors]
        list.sort((a, b) => b.articleCount - a.articleCount)
        return list
    }, [topContributors])

    const values = [
        {
            title: t.values.items[0].title,
            description: t.values.items[0].description,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            title: t.values.items[1].title,
            description: t.values.items[1].description,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            ),
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            title: t.values.items[2].title,
            description: t.values.items[2].description,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            ),
            gradient: 'from-violet-500 to-purple-500',
        },
        {
            title: t.values.items[3].title,
            description: t.values.items[3].description,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            ),
            gradient: 'from-emerald-500 to-teal-500',
        },
    ]

    return (
        <PageTransition>
            <section className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 z-0">
                    <HeroAnimatedBackground orbCount={2} showGrid={true} />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm mx-auto animate-fade-in">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                            {t.hero.badge}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in-up">
                        <TextParser
                            text={t.hero.headline}
                            boldClassName="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 bg-clip-text text-transparent"
                        />
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <TextParser
                            text={t.hero.description}
                            boldClassName="font-medium text-white"
                            italicClassName="italic text-primary-400 font-medium"
                        />
                    </p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto mb-32 mt-20 px-4 lg:px-6 space-y-20 text-slate-900 dark:text-slate-100">
                <section className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-900/40 rounded-full">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
                            {t.story.badge}
                        </span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-6">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                <TextParser text={t.story.title} />
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                <TextParser text={t.story.p1} />
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                <TextParser text={t.story.p2} />
                            </p>
                        </div>
                        <div className="relative rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-200/50 dark:border-primary-700/30 p-6 space-y-4">
                            <blockquote className="text-lg italic text-slate-700 dark:text-slate-200 leading-relaxed">
                                "{t.story.quote}"
                            </blockquote>
                            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                {t.story.quoteLabel}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12 text-white overflow-hidden dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>

                    <div className="relative space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                                {t.mission.badge}
                            </span>
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-bold leading-tight">
                            <TextParser
                                text={t.mission.title}
                                boldClassName="font-bold text-white"
                            />
                        </h2>
                        <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                            {t.mission.description}
                        </p>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 rounded-full shadow-lg">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-slate-900">
                                {t.values.badge}
                            </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                            {t.values.title}
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="group relative rounded-2xl bg-white p-6 border-2 border-slate-100 shadow-md hover:shadow-xl hover:border-slate-200 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                            >
                                <div className="relative space-y-4">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.gradient} shadow-lg`}>
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            {value.icon}
                                        </svg>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                            {value.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            <TextParser text={value.description} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-900/40 rounded-full">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
                                {t.contributors.badge}
                            </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                            {t.contributors.title}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                            <TextParser text={t.contributors.description} />
                        </p>
                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredContributors.map((author) => {
                            const earnedBadges = author.data?.badges || [];
                            const badgesToDisplay = earnedBadges
                                .map((eb: AuthorBadge) => {
                                    const def = BADGE_DEFINITIONS.find(d => d.id === eb.badgeId);
                                    return def ? { def, earned: eb } : null;
                                })
                                .filter((b: { def: Badge, earned: AuthorBadge } | null): b is { def: Badge, earned: AuthorBadge } => Boolean(b && b.def.id !== 'contributor'));

                            const tierOrder: Record<string, number> = { gold: 3, silver: 2, bronze: 1, contributor: 0, special: 4 };
                            badgesToDisplay.sort((a: { def: Badge, earned: AuthorBadge }, b: { def: Badge, earned: AuthorBadge }) => (tierOrder[b.def.tier] || 0) - (tierOrder[a.def.tier] || 0));

                            const topBadges = badgesToDisplay.slice(0, 3);

                            return (
                                <Link
                                    key={author.slug}
                                    href={`/author/${author.slug}`}
                                    className="group relative rounded-2xl bg-white p-5 border-2 border-slate-100 shadow-md hover:shadow-xl hover:border-primary-200 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-primary-700 hover:z-20"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <Image
                                            src={author.data?.avatar || DEFAULT_AVATAR_SRC}
                                            alt={author.name}
                                            width={80}
                                            height={80}
                                            className="rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-primary-300 transition-all dark:ring-slate-700 dark:group-hover:ring-primary-600"
                                        />

                                        <div className="space-y-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                                                {author.data?.name || author.name}
                                            </h3>
                                            {author.data?.title && (
                                                <p className="text-sm font-medium text-primary-600 dark:text-primary-400 line-clamp-2">
                                                    {author.data.title}
                                                </p>
                                            )}
                                            {author.data?.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1">
                                                    {author.data.description}
                                                </p>
                                            )}
                                            {author.data?.website && (
                                                <a
                                                    href={author.data.website.startsWith('http') ? author.data.website : `https://${author.data.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center pt-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    Website
                                                </a>
                                            )}
                                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 pt-1">
                                                {author.articleCount} {t.contributors.stats}
                                                {author.articleCount !== 1 && locale === 'it' ? 'i' : ''}
                                                {author.articleCount !== 1 && locale === 'en' ? 's' : ''}
                                            </p>
                                        </div>

                                        {/* Badges row */}
                                        {topBadges.length > 0 && (
                                            <div className="flex flex-wrap justify-center gap-1.5">
                                                {topBadges.map(({ def, earned }: { def: Badge, earned: AuthorBadge }) => (
                                                    <div key={def.id} className="transition-transform hover:scale-110">
                                                        <BadgeTooltip badge={def} earnedBadge={earned}>
                                                            <BadgeIcon badge={def} earnedBadge={earned} size="xs" />
                                                        </BadgeTooltip>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                                                {locale === 'it' ? 'Vedi Profilo' : 'View Profile'} &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="text-center pt-2">
                        <Link
                            href="/author"
                            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                        >
                            {t.contributors.cta}
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </section>

                <section className="relative rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 lg:p-10 space-y-6 overflow-hidden dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

                    <div className="relative space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                                {t.join.badge}
                            </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                            {t.join.title}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                            <TextParser text={t.join.description} />
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/contribute"
                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-105"
                            >
                                {t.join.ctaProgram}
                            </Link>
                            <Link
                                href="/learn/articles"
                                className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-600 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                            >
                                {t.join.ctaArticles}
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="text-center space-y-6">
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        {t.footer.text}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/learn/articles"
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 text-base font-bold text-white hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:scale-105"
                        >
                            {t.footer.ctaArticles}
                        </Link>
                        <Link
                            href="/career-os"
                            className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-600 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                        >
                            {t.footer.ctaCareer}
                        </Link>
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
