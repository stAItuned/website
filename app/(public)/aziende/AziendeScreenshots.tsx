'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

/**
 * AziendeScreenshots - Tabbed Carousel Proof Screenshots
 * User selects DocuExtract/DocuRoute, then sees auto-scrolling carousel
 */
export function AziendeScreenshots() {
    const [activeTab, setActiveTab] = useState<'extract' | 'route'>('extract')
    const [currentIndex, setCurrentIndex] = useState(0)

    const screenshots = {
        extract: [
            {
                src: '/aziende/use-case-dashboard.png',
                chip: 'Dashboard',
                title: 'Pilot dashboard',
                description: 'Volume, accuracy, tempo/doc e % review. Se non migliora, ci fermiamo.',
            },
            {
                src: '/aziende/use-case-audit.png',
                chip: 'Audit',
                title: 'Human-in-the-loop',
                description: 'Campi estratti, correzioni, conferma → export. Tutto tracciato.',
            },
            {
                src: '/aziende/use-case-master-ledger.png',
                chip: 'Export',
                title: 'Storico + export',
                description: 'Lista documenti, stato, export CSV/Excel pronto.',
            },
        ],
        route: [
            {
                src: '/aziende/use-case-triage.png',
                chip: 'Triage',
                title: 'Coda operativa',
                description: 'Proposta smistamento, livello affidabilità, auto-route o review.',
            },
            {
                src: '/aziende/use-case-audit-log.png',
                chip: 'Audit Log',
                title: 'Decisioni tracciate',
                description: 'Decisione AI, motivazione, azione, conferma umana.',
            },
            {
                src: '/aziende/use-case-system-performance.png',
                chip: 'KPI',
                title: 'Performance routing',
                description: 'Auto-route %, coda review, tempo recuperato, success rate.',
            },
        ],
    }

    const currentScreenshots = screenshots[activeTab]

    // Reset index when tab changes
    useEffect(() => {
        setCurrentIndex(0)
    }, [activeTab])

    // Auto-scroll carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % currentScreenshots.length)
        }, 4000) // 4 seconds per slide

        return () => clearInterval(timer)
    }, [currentScreenshots.length])

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index)
    }, [])

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % currentScreenshots.length)
    }, [currentScreenshots.length])

    const goPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + currentScreenshots.length) % currentScreenshots.length)
    }, [currentScreenshots.length])

    const currentShot = currentScreenshots[currentIndex]

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-3 dark:bg-emerald-900/50 dark:text-emerald-200">
                    🔍 Proof verificabile
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Non semplici demo
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Dashboard, audit log e export: esempi anonimizzati di cosa ricevi nel Pilot.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center">
                <div className="inline-flex rounded-full border border-slate-200 p-1 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('extract')}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'extract'
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        📄 DocuExtract
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('route')}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'route'
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        📬 DocuRoute
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative max-w-3xl mx-auto">
                {/* Main image */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg dark:border-slate-700 dark:bg-slate-900/60">
                    {/* Image container */}
                    <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                        <Image
                            src={currentShot.src}
                            alt={currentShot.title}
                            fill
                            className="object-contain transition-opacity duration-300"
                            sizes="(max-width: 768px) 100vw, 750px"
                            priority
                        />
                        {/* Chip */}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-bold uppercase tracking-wide text-slate-700 shadow-sm dark:bg-slate-800/95 dark:text-slate-200">
                            {currentShot.chip}
                        </span>
                    </div>

                    {/* Caption */}
                    <div className="p-4 sm:p-5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {currentShot.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {currentShot.description}
                        </p>
                    </div>
                </div>

                {/* Navigation arrows */}
                <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    aria-label="Previous slide"
                >
                    ←
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    aria-label="Next slide"
                >
                    →
                </button>

                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mt-4">
                    {currentScreenshots.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-slate-900 scale-110 dark:bg-white'
                                    : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Trust note */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                <strong>Non ti chiediamo di fidarti.</strong> Ti facciamo vedere i numeri.
            </p>
        </section>
    )
}
