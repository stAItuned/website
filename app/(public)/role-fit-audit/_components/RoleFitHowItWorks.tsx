'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'

// =============================================================================
// Data
// =============================================================================

const steps = [
    {
        n: '01',
        title: 'Scopri il tuo Profilo Reale',
        shortTitle: 'Il tuo Profilo',
        bullets: [
            { text: 'Non sei solo un "Dev": vedi il tuo vero posizionamento.', highlight: false },
            { text: 'Il tuo vero punto di forza (la tua leva sul mercato).', highlight: 'punto di forza' },
            { text: 'Cosa ti sta bloccando oggi (e non lo sai).', highlight: 'bloccando' },
        ],
        img: {
            src: '/assets/role-fit-audit/slide_3_1600.webp',
            alt: 'Role Fit Audit - Fase 1: Profilo e posizionamento',
        },
        accent: 'from-violet-500 to-purple-600',
        accentLight: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
    },
    {
        n: '02',
        title: 'Il tuo Punteggio (Score)',
        shortTitle: 'Tuo Punteggio',
        bullets: [
            { text: 'Misurati su 4 assi: Engineering, Product, Data, AI.', highlight: '4 assi' },
            { text: 'Un numero chiaro da 0 a 100.', highlight: false },
            { text: 'Scopri esattamente dove sei carente.', highlight: 'carente' },
        ],
        img: {
            src: '/assets/role-fit-audit/slide_4_1600.webp',
            alt: 'Role Fit Audit - Fase 2: Punteggi e Readiness',
        },
        accent: 'from-blue-500 to-cyan-500',
        accentLight: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    },
    {
        n: '03',
        title: 'I tuoi Gap Tecnici',
        shortTitle: 'I tuoi Gap',
        bullets: [
            { text: 'I 3 ostacoli precisi tra te e il ruolo Senior.', highlight: '3 ostacoli' },
            { text: 'Zero teoria: solo problemi di "Engineering Rigor".', highlight: false },
            { text: 'La soluzione pratica per ogni gap.', highlight: 'soluzione pratica' },
        ],
        img: {
            src: '/assets/role-fit-audit/slide_5_1600.webp',
            alt: 'Role Fit Audit - Fase 3: Gap Analysis',
        },
        accent: 'from-amber-500 to-orange-500',
        accentLight: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    },
    {
        n: '04',
        title: 'Il Piano Operativo',
        shortTitle: 'Piano 7 Giorni',
        bullets: [
            { text: 'Cosa fare domani mattina (Roadmap 7 giorni).', highlight: '7 giorni' },
            { text: 'Consigli su misura per il tuo profilo.', highlight: 'su misura' },
            { text: 'Report PDF gratuito nella tua email.', highlight: 'PDF gratuito' },
        ],
        img: {
            src: '/assets/role-fit-audit/slide_6_1600.webp',
            alt: 'Role Fit Audit - Fase 4: Piano d\'azione',
        },
        accent: 'from-emerald-500 to-teal-500',
        accentLight: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    },
]

// =============================================================================
// Helper: Highlight keywords in text
// =============================================================================

function HighlightedText({ text, highlight }: { text: string; highlight: string | boolean }) {
    if (typeof highlight !== 'string') return <>{text}</>

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className="font-semibold text-white bg-gradient-to-r from-[#FFF272] to-amber-400 bg-clip-text text-transparent">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    )
}

// =============================================================================
// Component
// =============================================================================

export function RoleFitHowItWorks() {
    const [activeStep, setActiveStep] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [expandedImage, setExpandedImage] = useState<string | null>(null)
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0)
    const mobileCarouselRef = useRef<HTMLDivElement>(null)

    // Auto-advance every 5 seconds (desktop only)
    const advanceStep = useCallback(() => {
        if (!expandedImage) {
            setActiveStep((prev) => (prev + 1) % steps.length)
        }
    }, [expandedImage])

    useEffect(() => {
        if (isPaused || expandedImage) return
        const timer = setInterval(advanceStep, 5000)
        return () => clearInterval(timer)
    }, [isPaused, advanceStep, expandedImage])

    // Close lightbox on Esc
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setExpandedImage(null)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

    // Track mobile carousel scroll position
    useEffect(() => {
        const carousel = mobileCarouselRef.current
        if (!carousel) return

        const handleScroll = () => {
            const scrollLeft = carousel.scrollLeft
            const cardWidth = carousel.offsetWidth * 0.85 + 16 // 85% width + gap
            const newIndex = Math.round(scrollLeft / cardWidth)
            setMobileActiveIndex(Math.min(newIndex, steps.length - 1))
        }

        carousel.addEventListener('scroll', handleScroll, { passive: true })
        return () => carousel.removeEventListener('scroll', handleScroll)
    }, [])

    const currentStep = steps[activeStep]

    return (
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Cosa scoprirai nel Report{' '}
                    <span className="text-amber-600 dark:text-[#FFF272]">
                        (Analisi in 4 step)
                    </span>
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    Visualizzerai <strong>subito i risultati</strong> e ti manderemo un PDF con <strong>ulteriori approfondimenti</strong> via mail
                </p>
            </div>

            {/* ================================================================= */}
            {/* MOBILE: Horizontal Scroll Carousel */}
            {/* ================================================================= */}
            <div className="md:hidden">
                <div
                    ref={mobileCarouselRef}
                    className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
                >
                    {steps.map((step, idx) => (
                        <div
                            key={step.n}
                            className={`
                                min-w-[85%] snap-center rounded-2xl p-4
                                bg-gradient-to-br from-slate-900 to-slate-800
                                border border-slate-700/50
                                shadow-xl shadow-black/20
                            `}
                        >
                            {/* Step badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${step.accentLight}`}>
                                <span>Fase {step.n}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-3">
                                {step.title}
                            </h3>

                            <ul className="space-y-2 mb-4">
                                {step.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="text-[#FFF272] mt-0.5">•</span>
                                        <span>
                                            <HighlightedText text={bullet.text} highlight={bullet.highlight} />
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div
                                className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-700/50 shadow-lg cursor-zoom-in"
                                onClick={() => setExpandedImage(step.img.src)}
                            >
                                {/* Badge: Anteprima Report */}
                                <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white/90 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border border-white/10 shadow-sm pointer-events-none text-right leading-tight">
                                    Anteprima<br />Report
                                </div>

                                <Image
                                    src={step.img.src}
                                    alt={step.img.alt}
                                    fill
                                    className="object-cover"
                                    sizes="85vw"
                                />
                                {/* Zoom hint */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                                        Ingrandisci
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scroll indicators */}
                <div className="flex justify-center gap-2 mt-4">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors ${idx === mobileActiveIndex ? 'bg-[#FFF272]' : 'bg-slate-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ================================================================= */}
            {/* DESKTOP: Interactive Step Selector */}
            {/* ================================================================= */}
            <div
                className="hidden md:block"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Progress bar */}
                <div className="relative h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
                    <div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentStep.accent} transition-all duration-300`}
                        style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Step tabs */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {steps.map((step, idx) => (
                        <button
                            key={step.n}
                            onClick={() => setActiveStep(idx)}
                            className={`
                                relative p-4 rounded-xl text-left transition-all duration-300 group
                                ${idx === activeStep
                                    ? 'bg-slate-900 border-2 border-[#FFF272]/50 shadow-[0_0_20px_-5px_theme(colors.amber.500)]'
                                    : 'bg-transparent border border-white/5 hover:border-white/10 hover:bg-white/5'
                                }
                            `}
                        >
                            <div className={`text-xs font-bold mb-1 transition-colors ${idx === activeStep ? 'text-[#FFF272]' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                Fase {step.n}
                            </div>
                            <div className={`font-semibold transition-colors ${idx === activeStep ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                {step.shortTitle}
                            </div>

                            {/* Active indicator */}
                            {idx === activeStep && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rotate-45 bg-slate-800 border-r border-b border-[#FFF272]/50" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Active step content */}
                <div className="grid grid-cols-2 gap-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl">
                    {/* Left: Text content */}
                    <div className="flex flex-col justify-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 w-fit ${currentStep.accentLight}`}>
                            Fase {currentStep.n}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4">
                            {currentStep.title}
                        </h3>

                        <ul className="space-y-3">
                            {currentStep.bullets.map((bullet, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FFF272]/20 flex items-center justify-center text-[#FFF272] text-xs font-bold">
                                        ✓
                                    </span>
                                    <span>
                                        <HighlightedText text={bullet.text} highlight={bullet.highlight} />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Image */}
                    <div className="flex items-center">
                        <div
                            className={`relative aspect-video w-full overflow-hidden rounded-xl border border-slate-700/50 shadow-2xl ring-1 ring-white/5 cursor-zoom-in group`}
                            onClick={() => setExpandedImage(currentStep.img.src)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-tr ${currentStep.accent} opacity-10 pointer-events-none group-hover:opacity-0 transition-opacity`} />

                            {/* Badge: Anteprima Report */}
                            <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white/90 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded border border-white/10 shadow-sm pointer-events-none text-right leading-tight">
                                Anteprima<br />Report
                            </div>

                            <Image
                                src={currentStep.img.src}
                                alt={currentStep.img.alt}
                                fill
                                className="object-cover"
                                sizes="45vw"
                                priority={activeStep === 0}
                            />
                            {/* Zoom indicator */}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                    <path d="M11 8v6" />
                                    <path d="M8 11h6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <Image
                            src={expandedImage}
                            alt="Expanded view"
                            fill
                            className="object-contain"
                            quality={100}
                            sizes="100vw"
                        />
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 backdrop-blur-sm transition-all"
                            onClick={() => setExpandedImage(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

        </section>
    )
}
