'use client'

import { useState } from 'react'
import { useLearnLocale } from '@/lib/i18n'
import { ContributorCTA } from '@/components/ui/ContributorCTA'

interface LearnContributorSectionProps {
    className?: string
}

/**
 * Dedicated Contributor Section - Compelling CTA to become a contributor
 * 
 * Features:
 * - Strong value proposition
 * - Clear benefits with icons
 * - Social proof (contributor testimonials/stats)
 * - Expandable application form
 */
export function LearnContributorSection({ className = '' }: LearnContributorSectionProps) {
    const { locale } = useLearnLocale()
    const [showForm, setShowForm] = useState(false)

    const content = locale === 'it' ? {
        badge: '✍️ Contributor Program',
        title: 'Condividi la tua esperienza AI',
        subtitle: 'Scrivi articoli pratici, costruisci la tua reputazione e raggiungi migliaia di professionisti AI.',
        cta: 'Candidati come Contributor',
        benefits: [
            {
                icon: '📢',
                title: 'Distribuzione massima',
                description: 'Homepage, newsletter, LinkedIn con 10k+ follower'
            },
            {
                icon: '✏️',
                title: 'Supporto editoriale',
                description: 'Review tecnica e editoriale, linee guida chiare'
            },
            {
                icon: '🎯',
                title: 'Portfolio professionale',
                description: 'Articoli pubblicati per il tuo personal brand'
            },
            {
                icon: '🤝',
                title: 'Network AI',
                description: 'Connessioni con altri contributor e aziende'
            }
        ],
        stats: [
            { value: '30+', label: 'Articoli pubblicati' },
            { value: '10+', label: 'Contributor attivi' },
            { value: '50k+', label: 'Lettori mensili' }
        ],
        testimonial: {
            quote: 'Scrivere per stAItuned mi ha permesso di costruire credibilità nel settore AI e ricevere opportunità lavorative.',
            author: 'Contributor stAItuned'
        }
    } : {
        badge: '✍️ Contributor Program',
        title: 'Share your AI expertise',
        subtitle: 'Write practical articles, build your reputation, and reach thousands of AI professionals.',
        cta: 'Apply as Contributor',
        benefits: [
            {
                icon: '📢',
                title: 'Maximum distribution',
                description: 'Homepage, newsletter, LinkedIn with 10k+ followers'
            },
            {
                icon: '✏️',
                title: 'Editorial support',
                description: 'Technical and editorial review, clear guidelines'
            },
            {
                icon: '🎯',
                title: 'Professional portfolio',
                description: 'Published articles for your personal brand'
            },
            {
                icon: '🤝',
                title: 'AI network',
                description: 'Connections with other contributors and companies'
            }
        ],
        stats: [
            { value: '30+', label: 'Articles published' },
            { value: '10+', label: 'Active contributors' },
            { value: '50k+', label: 'Monthly readers' }
        ],
        testimonial: {
            quote: 'Writing for stAItuned helped me build credibility in the AI field and receive job opportunities.',
            author: 'stAItuned Contributor'
        }
    }

    return (
        <section className={`relative overflow-hidden ${className}`}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 rounded-3xl" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full blur-[60px]" />

            <div className="relative px-6 py-16 sm:px-10 sm:py-20 rounded-3xl">
                {/* Badge */}
                <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        {content.badge}
                    </span>
                </div>

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                        {content.title}
                    </h2>
                    <p className="text-lg text-white/80 leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
                    {content.benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-white/20 transition-all duration-300"
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {benefit.icon}
                            </div>
                            <h3 className="font-bold text-white mb-1">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-white/70">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12">
                    {content.stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-white/60 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Testimonial */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <svg className="absolute top-4 left-4 w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-white/90 italic text-center pt-6 pb-2">
                            &ldquo;{content.testimonial.quote}&rdquo;
                        </p>
                        <p className="text-white/60 text-sm text-center font-medium">
                            , {content.testimonial.author}
                        </p>
                    </div>
                </div>

                {/* CTA */}
                {!showForm ? (
                    <div className="text-center">
                        <button
                            onClick={() => setShowForm(true)}
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            {content.cta}
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <p className="mt-4 text-sm text-white/50">
                            {locale === 'it' ? 'Risposta entro 48 ore' : 'Response within 48 hours'}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-300">
                        <ContributorCTA source="learn-contributor-section" className="bg-white dark:bg-slate-900 shadow-2xl" />
                        <button
                            onClick={() => setShowForm(false)}
                            className="w-full mt-4 text-sm text-white/60 hover:text-white/80 transition-colors"
                        >
                            {locale === 'it' ? '← Torna indietro' : '← Go back'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
