'use client'

import { useState, useEffect } from 'react'
import {
    Target,
    Briefcase,
    FileSearch,
    Users,
    BrainCircuit,
    Zap,
    TrendingUp,
    CheckCircle2,
    Sparkles,
    ChevronDown,
    ArrowRight,
    MousePointerClick,
    Lock,
    Check,
} from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { HoverCard } from '@/components/ui/HoverCard'
import { useCareerOS, type ObjectiveType } from '../context/CareerOSContext'

/**
 * Step definitions for the gamified journey
 */
const JOURNEY_STEPS = [
    { id: 1, label: 'Scegli obiettivo', icon: '🎯', targetId: 'step-objective' },
    { id: 2, label: 'Esplora percorso', icon: '📅', targetId: 'step-timeline' },
    { id: 3, label: 'Scegli modalità', icon: '🎓', targetId: 'step-mode' },
    { id: 4, label: 'Vedi prezzi', icon: '💰', targetId: 'pricing' },
]

/**
 * ProgressStepper - Visual progress bar showing journey steps
 * Sticky overlay for better UX
 */
function ProgressStepper({
    currentStep,
    completedSteps
}: {
    currentStep: number
    completedSteps: number[]
}) {
    const { scrollToSection } = useCareerOS()

    return (
        <div className="sticky top-24 z-30 max-w-3xl mx-auto mb-10 py-4 px-6 rounded-full bg-white/80 dark:bg-[#151925]/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-300">
            {/* Desktop stepper */}
            <div className="hidden md:flex items-center justify-between">
                {JOURNEY_STEPS.map((step, i) => {
                    const isCompleted = completedSteps.includes(step.id)
                    const isCurrent = currentStep === step.id
                    const isLocked = step.id > Math.max(...completedSteps, 0) + 1

                    return (
                        <button
                            key={step.id}
                            onClick={() => !isLocked && scrollToSection(step.targetId)}
                            disabled={isLocked}
                            className={`flex items-center group ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {/* Step circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-lg
                                        transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 group-hover:bg-emerald-600'
                                            : isCurrent
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-200 dark:ring-indigo-500/30 scale-110'
                                                : isLocked
                                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                                    : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 group-hover:border-indigo-400'
                                        }
                                    `}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : step.icon}
                                </div>
                                <span className={`mt-1.5 text-[10px] font-medium uppercase tracking-wider ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                                    isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-bold' :
                                        'text-slate-500 dark:text-slate-400'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector line */}
                            {i < JOURNEY_STEPS.length - 1 && (
                                <div className={`
                                    w-12 lg:w-20 h-0.5 mx-2 rounded-full transition-all duration-300
                                    ${completedSteps.includes(step.id)
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                    }
                                `} />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Mobile stepper - compact */}
            <div className="md:hidden flex items-center justify-between w-full">
                <span className="text-sm font-bold text-[#1A1E3B] dark:text-white">
                    Step {currentStep}/4: <span className="text-indigo-600 dark:text-indigo-400">{JOURNEY_STEPS[currentStep - 1].label}</span>
                </span>
                <div className="flex gap-1.5">
                    {JOURNEY_STEPS.map(step => {
                        const isCompleted = completedSteps.includes(step.id)
                        const isCurrent = currentStep === step.id

                        return (
                            <div
                                key={step.id}
                                className={`
                                    w-2 h-2 rounded-full
                                    transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-emerald-500'
                                        : isCurrent
                                            ? 'bg-indigo-600 w-6'
                                            : 'bg-slate-200 dark:bg-slate-700'
                                    }
                                `}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

/**
 * StepCard - Container for each numbered step
 */
function StepCard({
    stepNumber,
    title,
    isActive,
    isCompleted,
    isLocked,
    children
}: {
    stepNumber: number
    title: string
    isActive: boolean
    isCompleted: boolean
    isLocked: boolean
    children: React.ReactNode
}) {
    return (
        <div
            className={`
                relative p-6 rounded-2xl transition-all duration-300
                ${isLocked
                    ? 'opacity-50 pointer-events-none bg-slate-100 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600'
                    : isActive
                        ? 'bg-gradient-to-br from-indigo-50 to-white dark:from-[#1A1E3B] dark:to-[#151925] border-2 border-indigo-400 dark:border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : isCompleted
                            ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }
            `}
        >
            {/* Step badge */}
            <div className={`
                absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                }
            `}>
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
            </div>

            {/* Title */}
            <h4 className={`text-lg font-bold mb-4 ${isLocked ? 'text-slate-400 dark:text-slate-500' : 'text-[#1A1E3B] dark:text-white'
                }`}>
                {isLocked && <Lock className="w-4 h-4 inline mr-2" />}
                {title}
            </h4>

            {/* Content */}
            {children}
        </div>
    )
}


/**
 * Artifact tag types for deliverables (lowercase for readability)
 */
type ArtifactTag = 'Doc' | 'Sheet' | 'Repo' | 'Demo' | 'Report' | 'Profile'

/**
 * Deliverable with artifact tag
 */
interface Deliverable {
    name: string
    tag: ArtifactTag
    description?: string
}

/**
 * Week node data structure
 */
interface WeekNode {
    week: number
    title: string
    subtitle: string
    icon: React.ElementType
    deliverables: Deliverable[]
    qualityCheck: string
    outcome: string // micro-outcome leggibile
    why: React.ReactNode // "why it matters" with formatting support
}

/**
 * Checkpoint data structure - now with artifact-tagged deliverables
 */
interface Checkpoint {
    title: string
    emoji: string
    tier: string
    hint?: string
    deliverables: Deliverable[]
}

/**
 * Tag color mapping
 */
const TAG_COLORS: Record<ArtifactTag, string> = {
    Doc: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    Sheet: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    Repo: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
    Demo: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    Report: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    Profile: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
}

/**
 * Tag glossary for tooltips - explains what each tag type means
 */
const TAG_GLOSSARY: Record<ArtifactTag, string> = {
    Doc: 'Template/documento riutilizzabile',
    Sheet: 'Foglio di calcolo/tracker',
    Repo: 'Repository GitHub con codice',
    Demo: 'App/tool funzionante',
    Report: 'Analisi con metriche',
    Profile: 'Profilo ottimizzato',
}

/**
 * Fit bar chips - quick recognition for target audience
 */
const FIT_CHIPS = [
    { icon: '👨‍💻', label: 'Per dev/data STEM' },
    { icon: '⏱️', label: '4-8h/settimana' },
    { icon: '🤖', label: 'Ruoli Applied GenAI' },
    { icon: '📦', label: 'Output verificabili' },
]

/**
 * Journey data - all weeks with artifact-tagged deliverables
 */
const FOUNDATIONAL_WEEKS: WeekNode[] = [
    {
        week: 1,
        title: 'Obiettivo & Posizionamento',
        subtitle: 'Il punto di partenza',
        icon: Target,
        deliverables: [
            { name: 'Career Goal Statement', tag: 'Doc', description: 'obiettivi + vincoli chiari' },
            { name: 'Role-Fit Snapshot', tag: 'Report', description: 'track primario + secondario' },
            { name: 'Positioning Pack', tag: 'Doc', description: 'headline + pitch 30s/2min' },
        ],
        qualityCheck: 'In 30s è chiaro ruolo target + narrativa personale',
        outcome: 'Obiettivo + storia chiari',
        why: (
            <>
                Senza una meta chiara e una storia credibile, <strong>nessuna candidatura funziona.</strong>
            </>
        ),
    },
    {
        week: 2,
        title: 'Lista Aziende Target',
        subtitle: 'Il Mercato Nascosto',
        icon: Briefcase,
        deliverables: [
            { name: 'Target List (Tier 1-3)', tag: 'Sheet', description: '20-40 aziende prioritizzate' },
            { name: 'Golden JD Analysis', tag: 'Doc', description: '3 JD analizzate in profondità' },
            { name: 'Pipeline Tracker', tag: 'Sheet', description: 'sistema per seguire le application' },
        ],
        qualityCheck: 'Target coerente + Job Feed attivo',
        outcome: 'Pipeline strutturata',
        why: (
            <>
                Applicare "a caso" abbassa la conversione. Servono <strong>strategia e ritmo.</strong>
            </>
        ),
    },
    {
        week: 3,
        title: 'CV & LinkedIn',
        subtitle: 'Filtro automatico + impatto',
        icon: FileSearch,
        deliverables: [
            { name: 'Master CV (Impact Bullets)', tag: 'Doc', description: 'formula azione+tech+outcome' },
            { name: 'LinkedIn V2', tag: 'Profile', description: 'headline + about + featured' },
            { name: 'Application Bundle', tag: 'Doc', description: 'template CV/Cover replicabile' },
        ],
        qualityCheck: 'Primo terzo CV comunica segnali GenAI + numeri',
        outcome: 'CV pronto + LinkedIn ottimizzato',
        why: (
            <>
                Hai 6 secondi per convincere. Il tuo CV deve essere <strong>perfetto e ATS-friendly.</strong>
            </>
        ),
    },
    {
        week: 4,
        title: 'Proof Pubblica + Interview Kit',
        subtitle: 'Articolo + preparazione completa',
        icon: Users,
        deliverables: [
            { name: 'Technical Article (stAItuned)', tag: 'Doc', description: 'articolo pubblicato' },
            { name: 'Interview Manual 360°', tag: 'Doc', description: 'soft + hard + negotiation' },
            { name: 'LinkedIn Share Kit', tag: 'Doc', description: 'strategia di distribuzione' },
        ],
        qualityCheck: 'Articolo live + Interview Manual completo',
        outcome: 'Authority pubblica + prep colloquio',
        why: (
            <>
                Una proof pubblica riduce il rischio percepito: <strong>"non è teoria, sa fare e sa comunicare".</strong>
            </>
        ),
    },
]


const ADVANCED_WEEKS: WeekNode[] = [
    {
        week: 5,
        title: 'Portfolio Live',
        subtitle: 'WebApp su cloud',
        icon: BrainCircuit,
        deliverables: [
            { name: 'Live Showcase WebApp', tag: 'Demo', description: 'deployata su Firebase' },
            { name: 'Cloud Architecture', tag: 'Repo', description: 'project + DB + auth attivi' },
            { name: 'Deploy Guide', tag: 'Doc', description: 'manuale per rifarlo da zero' },
        ],
        qualityCheck: 'Link HTTPS funzionante + GA4 attivo',
        outcome: 'Portfolio live su web',
        why: (
            <>
                Un progetto "school" non basta. Serve un prodotto <strong>che funzioni davvero.</strong>
            </>
        ),
    },
    {
        week: 6,
        title: 'Progetto GenAI Completo',
        subtitle: 'Tool end-to-end',
        icon: Zap,
        deliverables: [
            { name: 'Flagship AI Tool', tag: 'Demo', description: 'funzionante live nella webapp' },
            { name: 'Backend Repo', tag: 'Repo', description: 'strutturata e pulita' },
            { name: 'Demo Video', tag: 'Demo', description: 'screen recording del tool' },
        ],
        qualityCheck: 'Qualsiasi utente può provare il tool e ottenere un risultato WOW',
        outcome: 'Prodotto AI live',
        why: (
            <>
                "Works on my machine" non vale. Devi gestire env vars e secrets <strong>in cloud.</strong>
            </>
        ),
    },
    {
        week: 7,
        title: 'Packaging + 10 Candidature',
        subtitle: 'README + application in massa',
        icon: TrendingUp,
        deliverables: [
            { name: 'CV V2 (Project Injection)', tag: 'Doc', description: 'progetto in cima al CV' },
            { name: 'Killer README', tag: 'Repo', description: 'architettura + demo link' },
            { name: '10 Custom Applications', tag: 'Sheet', description: 'CV tailored inviati' },
        ],
        qualityCheck: '10 candidature "perfette" con link al progetto',
        outcome: '10 application inviate',
        why: (
            <>
                È il momento di aggredire il mercato con il <strong>nuovo profilo potenziato.</strong>
            </>
        ),
    },
    {
        week: 8,
        title: 'Mock + Closing Offerta',
        subtitle: 'Prep mirata + negoziazione',
        icon: CheckCircle2,
        deliverables: [
            { name: '10 JD Intelligence Reports', tag: 'Report', description: 'context + domande custom' },
            { name: 'Mock Interview Scorecard', tag: 'Report', description: 'con Senior Expert' },
            { name: 'Career OS Playbook', tag: 'Doc', description: 'piano prossimi 30 giorni' },
        ],
        qualityCheck: 'Difendi scelte tecniche + conosci i target meglio di loro',
        outcome: 'Pronto per l\'offerta',
        why: (
            <>
                Se arrivi al colloquio impreparato, <strong>bruci l'opportunità</strong> (e i mesi di attesa).
            </>
        ),
    },
]


const CHECKPOINTS: Record<'week4' | 'week8', Checkpoint> = {
    week4: {
        title: 'Sei Candidabile',
        emoji: '✅',
        tier: 'Starter+',
        hint: 'Asset base pronti + authority pubblica + interview prep completo.',
        deliverables: [
            { name: 'Career Goal + Positioning', tag: 'Doc', description: 'narrativa chiara' },
            { name: 'Master CV + LinkedIn V2', tag: 'Doc', description: 'ATS-ready + ottimizzati' },
            { name: 'Technical Article', tag: 'Doc', description: 'pubblicato su stAItuned' },
            { name: 'Interview Manual 360°', tag: 'Doc', description: 'soft + hard + negotiation' },
        ],
    },
    week8: {
        title: 'Offer-Ready',
        emoji: '🎯',
        tier: 'Pro / Elite',
        hint: 'Prodotto live + 10 candidature + intelligence specifica: sei pronto a negoziare.',
        deliverables: [
            { name: 'Flagship Project (Live)', tag: 'Demo', description: 'webapp funzionante' },
            { name: 'CV V2 + 10 Applications', tag: 'Sheet', description: 'candidature perfette' },
            { name: '10 JD Intelligence Reports', tag: 'Report', description: 'context + domande custom' },
            { name: 'Mock Interview Scorecard', tag: 'Report', description: 'debrief con Senior' },
        ],
    },
}


/**
 * DeliverableTag - Visual tag for artifact type with glossary tooltip
 */
function DeliverableTag({ tag }: { tag: ArtifactTag }) {
    return (
        <Tooltip content={TAG_GLOSSARY[tag]} side="top" maxWidth={180}>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide cursor-help ${TAG_COLORS[tag]}`}>
                {tag}
            </span>
        </Tooltip>
    )
}

/**
 * ObjectiveToggle - Let user choose 4 weeks (Start) or 8 weeks (Pro)
 */


function ObjectiveToggle({
    selected,
    onSelect,
}: {
    selected: ObjectiveType
    onSelect: (val: ObjectiveType) => void
}) {
    return (
        <div id="step-objective" className="max-w-2xl mx-auto mb-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-amber-50/50 dark:from-[#1A1E3B] dark:to-[#151925] border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 scroll-mt-32">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">1</span>
                <span className="text-base font-bold text-[#1A1E3B] dark:text-white">
                    Qual è il tuo obiettivo?
                </span>
            </div>

            {/* Toggle buttons with descriptions */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Start option */}
                <button
                    onClick={() => onSelect('start')}
                    className={`
                        p-5 rounded-xl text-left transition-all duration-300
                        ${selected === 'start'
                            ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-[#151925]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md'
                        }
                    `}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🚀</span>
                        <span className="font-bold text-lg">Start</span>
                        <span className={`text-sm ${selected === 'start' ? 'text-white/70' : 'text-slate-500'}`}>(4 sett.)</span>
                    </div>
                    <p className={`text-sm ${selected === 'start' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        CV pronto + profilo ottimizzato per iniziare a candidarti
                    </p>
                </button>

                {/* Pro option */}
                <button
                    onClick={() => onSelect('pro')}
                    className={`
                        p-5 rounded-xl text-left transition-all duration-300
                        ${selected === 'pro'
                            ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-[#151925]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md'
                        }
                    `}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🏆</span>
                        <span className="font-bold text-lg">Pro</span>
                        <span className={`text-sm ${selected === 'pro' ? 'text-white/70' : 'text-slate-500'}`}>(8 sett.)</span>
                    </div>
                    <p className={`text-sm ${selected === 'pro' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        Tutto quello che serve per superare i colloqui (Portfolio + Mock)
                    </p>
                </button>
            </div>
        </div>
    )
}

/**
 * FitBar - Quick recognition chips for target audience
 */
function FitBar() {
    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
            {FIT_CHIPS.map(chip => (
                <span
                    key={chip.label}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                    {chip.icon} {chip.label}
                </span>
            ))}
        </div>
    )
}

/**
 * WeekNodeCompact - Compact timeline node with HoverCard preview
 */
function WeekNodeCompact({
    node,
    isSelected,
    onSelect,
    variant,
    isFirst,
    isLast,
}: {
    node: WeekNode
    isSelected: boolean
    onSelect: () => void
    variant: 'foundational' | 'advanced'
    isFirst?: boolean
    isLast?: boolean
}) {
    const Icon = node.icon
    const colorClasses = variant === 'foundational'
        ? 'border-indigo-500/30 hover:border-indigo-500/60'
        : 'border-[#FFF272]/30 hover:border-[#FFF272]/60'
    const iconBg = variant === 'foundational'
        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
        : 'bg-[#FFF272]/10 text-[#F59E0B]'
    const weekBadge = variant === 'foundational'
        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
        : 'bg-[#FFF272]/20 text-[#1A1E3B] dark:text-[#FFF272]'
    const selectedRing = variant === 'foundational'
        ? 'ring-indigo-500'
        : 'ring-[#FFF272]'

    const nodeButton = (
        <button
            onClick={onSelect}
            className={`
                relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 
                bg-white dark:bg-[#0F1117]
                ${colorClasses}
                transition-all duration-300 flex items-center justify-center
                hover:scale-105 hover:shadow-lg cursor-pointer
                ${isSelected ? `ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0F1117] ${selectedRing}` : ''}
            `}
            aria-pressed={isSelected}
        >
            <div className={`p-3 rounded-full ${iconBg}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            {/* Week badge */}
            <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${weekBadge}`}>
                W{node.week}
            </span>
            {/* Checkpoint badge for milestone weeks - with tooltip */}
            {(node.week === 4 || node.week === 8) && (
                <Tooltip content="Criterio qualità: se non è passato, non si procede" side="bottom" maxWidth={200}>
                    <span
                        className={`
                            absolute -bottom-3 left-1/2 -translate-x-1/2
                            px-2 py-0.5 rounded-full text-[10px] font-bold cursor-help
                            ${node.week === 4
                                ? 'bg-indigo-600 text-white'
                                : 'bg-[#FFF272] text-[#1A1E3B]'
                            }
                            shadow-sm
                        `}
                    >
                        GATE
                    </span>
                </Tooltip>
            )}
        </button>
    )

    return (
        <div className="flex flex-col items-center">
            {/* Desktop: Just the button (preview logic removed as per user request) */}
            <div className="hidden md:block">
                {nodeButton}
            </div>
            {/* Mobile: Just the button */}
            <div className="md:hidden">
                {nodeButton}
            </div>

            {/* Title only (no subtitle for compact view) */}
            <h4 className={`${(node.week === 4 || node.week === 8) ? 'mt-6' : 'mt-3'} text-sm font-bold text-[#1A1E3B] dark:text-white text-center max-w-[100px]`}>
                {node.title}
            </h4>
            {/* Micro-outcome - ONLY on mobile */}
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 text-center max-w-[100px] md:hidden">
                {node.outcome}
            </p>
        </div>
    )
}
/**
 * DetailPanel - Scannable 2-column layout with Outcome+Gate left, Outputs right
 * Deliverable descriptions shown via Tooltip
 */
function DetailPanel({
    node,
    variant,
}: {
    node: WeekNode
    variant: 'foundational' | 'advanced'
}) {
    const borderColor = variant === 'foundational' ? 'border-indigo-500/30' : 'border-[#FFF272]/30'
    const bgGradient = variant === 'foundational' ? 'from-indigo-500/5 to-transparent' : 'from-[#FFF272]/5 to-transparent'
    const accentColor = variant === 'foundational' ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#F59E0B] dark:text-[#FFF272]'

    return (
        <div id="journey-detail" className="w-[100%] min-h-[420px] md:h-[580px] rounded-3xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-In flex flex-col">
            {/* Header: Week Number + Title */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white flex items-center gap-3">
                        <span className={`text-2xl ${accentColor}`}>W{node.week}</span>
                        {node.title}
                    </h3>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                {/* 1. VALUE PROP (Why it matters) - Top */}
                <div className="shrink-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                        <span className="text-amber-500 text-base">💡</span> Focus: {node.subtitle}
                    </p>
                    <p className="text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {node.why}
                    </p>
                </div>

                {/* BOTTOM GROUP: Assets + Outcome + Gate */}
                <div className="flex flex-col gap-6 shrink-0">
                    {/* 2. Outputs */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                            Output Tangibili (Asset)
                        </p>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {node.deliverables.map((d, i) => (
                                <div key={i} className="group p-3 rounded-xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DeliverableTag tag={d.tag} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight mb-1">
                                        {d.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 line-clamp-2">
                                        {d.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Outcome & Gate Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Box 1: Outcome (Primary) */}
                        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20">
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                                Primary Outcome
                            </p>
                            <p className="text-lg font-bold text-[#1A1E3B] dark:text-white leading-tight">
                                {node.outcome}
                            </p>
                        </div>

                        {/* Box 2: Gate (Quality Check) */}
                        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Qualità (Gate)
                            </p>
                            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 italic">
                                "{node.qualityCheck}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * PlaceholderPanel - Shown when no week is selected
 */
function PlaceholderPanel({ variant }: { variant: 'foundational' | 'advanced' }) {
    const borderColor = variant === 'foundational' ? 'border-indigo-500/20' : 'border-[#FFF272]/20'
    const textColor = variant === 'foundational' ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#F59E0B] dark:text-[#FFF272]'

    return (
        <div className={`w-full min-h-[420px] md:h-[580px] flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed ${borderColor} text-center animate-fadeIn`}>
            <MousePointerClick className={`w-10 h-10 mx-auto mb-4 ${textColor} opacity-60`} />
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Seleziona una settimana per scoprire <span className="font-medium text-slate-900 dark:text-white">Outcome, Criteri di Qualità e Output pratici</span>.
            </p>
        </div>
    )
}

/**
 * OutcomeTile - Individual deliverable tile for checkpoint cards
 */
function OutcomeTile({ d }: { d: Deliverable }) {
    return (
        <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1A1E3B]/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[#1A1E3B] dark:text-white leading-snug">
                    {d.name}
                </p>
                <DeliverableTag tag={d.tag} />
            </div>
            {d.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {d.description}
                </p>
            )}
        </div>
    )
}

/**
 * CheckpointCard - Week 4 or Week 8 checkpoint with Outcome Pack grid
 */
function CheckpointCard({ checkpoint, week }: { checkpoint: Checkpoint; week: 4 | 8 }) {
    const isWeek4 = week === 4

    const borderColor = isWeek4
        ? 'border-indigo-500/40 hover:border-indigo-500/70'
        : 'border-[#FFF272]/40 hover:border-[#FFF272]/70'
    const bgGradient = isWeek4
        ? 'from-indigo-500/10 to-transparent'
        : 'from-[#FFF272]/10 to-transparent'
    const tierBg = isWeek4
        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
        : 'bg-[#FFF272]/30 dark:bg-[#FFF272]/20 text-[#1A1E3B] dark:text-[#FFF272]'
    const accent = isWeek4 ? 'text-indigo-700 dark:text-indigo-300' : 'text-[#F59E0B]'

    return (
        <div
            className={`
                p-6 rounded-2xl border-2 ${borderColor}
                bg-gradient-to-br ${bgGradient}
                backdrop-blur-sm transition-all duration-300 hover:shadow-lg
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{checkpoint.emoji}</span>
                    <div>
                        <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white leading-tight">
                            {checkpoint.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Fine Week {week} · <span className={`font-semibold ${accent}`}>Outcome Pack</span>
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierBg}`}>
                    {checkpoint.tier}
                </span>
            </div>

            {/* Hint */}
            {checkpoint.hint && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {checkpoint.hint}
                </p>
            )}

            {/* Deliverable tiles grid */}
            <div className="grid sm:grid-cols-2 gap-3">
                {checkpoint.deliverables.map((d, i) => (
                    <OutcomeTile key={i} d={d} />
                ))}
            </div>
        </div>
    )
}

/**
 * TimelineConnector - Line connecting nodes (legacy, kept for reference)
 */
function TimelineConnector({ variant }: { variant: 'foundational' | 'advanced' }) {
    const color = variant === 'foundational'
        ? 'from-indigo-300 to-indigo-500 dark:from-indigo-500/50 dark:to-indigo-400'
        : 'from-[#FFF272]/50 to-[#F59E0B] dark:from-[#FFF272]/30 dark:to-[#FFF272]'

    return (
        <div className={`
            hidden md:block flex-1 h-0.5 bg-gradient-to-r ${color}
            mx-2 mt-8
        `} />
    )
}

/**
 * BridgeMarker - Minimal indicator pointing to detail panel
 */
function BridgeMarker({ variant }: { variant: 'foundational' | 'advanced' }) {
    const line = variant === 'foundational' ? 'bg-indigo-400' : 'bg-[#FFF272]'

    return (
        <div className="flex flex-col items-center">
            <div className={`w-0.5 h-8 rounded-full ${line}`} />
        </div>
    )
}

/**
 * DesktopTimeline - Grid-based timeline with progress line and bridge markers
 * Now properly handles null selectedWeek for progressive disclosure
 */
function DesktopTimeline({
    weeks,
    selectedWeek,
    onSelect,
    variant,
}: {
    weeks: WeekNode[]
    selectedWeek: number | null
    onSelect: (week: number) => void
    variant: 'foundational' | 'advanced'
}) {
    const total = weeks.length
    // If null, no progress fill
    const selectedIdx = selectedWeek !== null
        ? weeks.findIndex(w => w.week === selectedWeek)
        : -1
    const progress = selectedIdx < 0 || total <= 1
        ? 0
        : (selectedIdx / (total - 1)) * 100

    const baseLine =
        variant === 'foundational'
            ? 'from-indigo-200 via-indigo-300 to-indigo-200 dark:from-indigo-500/20 dark:via-indigo-400/30 dark:to-indigo-500/20'
            : 'from-[#FFF272]/20 via-[#FFF272]/40 to-[#FFF272]/20 dark:from-[#FFF272]/10 dark:via-[#FFF272]/25 dark:to-[#FFF272]/10'

    const fillLine =
        variant === 'foundational'
            ? 'from-indigo-500 to-indigo-400'
            : 'from-[#FFF272] to-[#F59E0B]'

    return (
        <div className="hidden md:block relative">
            {/* Timeline rail + progress - z-0 to stay behind nodes */}
            <div className="absolute left-10 right-10 top-10 md:top-11 h-1 rounded-full overflow-hidden z-0">
                <div className={`absolute inset-0 bg-gradient-to-r ${baseLine}`} />
                {selectedWeek !== null && (
                    <div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${fillLine} transition-[width] duration-300 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                )}
            </div>

            {/* Nodes - z-10 to stay above the rail line */}
            <div className="relative z-10 grid grid-cols-4 gap-6 items-start">
                {weeks.map((node, index) => (
                    <div key={node.week} className="flex flex-col items-center">
                        <WeekNodeCompact
                            node={node}
                            isSelected={selectedWeek === node.week}
                            onSelect={() => onSelect(node.week)}
                            variant={variant}
                        />
                    </div>
                ))}
            </div>


        </div>
    )
}

/**
 * MobileWeekItem - Vertical timeline item for mobile
 */
function MobileWeekItem({
    node,
    isSelected,
    onSelect,
    variant,
}: {
    node: WeekNode
    isSelected: boolean
    onSelect: () => void
    variant: 'foundational' | 'advanced'
}) {
    const iconBg = variant === 'foundational'
        ? 'bg-indigo-500/10 border-indigo-500/30'
        : 'bg-[#FFF272]/10 border-[#FFF272]/30'
    const iconColor = variant === 'foundational'
        ? 'text-indigo-600 dark:text-indigo-400'
        : 'text-[#F59E0B]'
    const lineBg = variant === 'foundational'
        ? 'bg-indigo-200 dark:bg-indigo-500/30'
        : 'bg-[#FFF272]/30'
    const weekBadgeBg = variant === 'foundational'
        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
        : 'bg-[#FFF272]/20 text-[#1A1E3B] dark:text-[#FFF272]'
    const selectedBorder = variant === 'foundational'
        ? 'border-indigo-500'
        : 'border-[#FFF272]'

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full ${iconBg} border-2 flex items-center justify-center`}>
                    <node.icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className={`flex-1 w-0.5 ${lineBg} my-2`} />
            </div>
            <div className="flex-1 pb-4">
                <button
                    onClick={() => {
                        onSelect()
                        // Auto-scroll to detail panel on mobile
                        requestAnimationFrame(() => {
                            document.getElementById('journey-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        })
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${isSelected
                        ? `border-2 ${selectedBorder} bg-white/50 dark:bg-slate-800/50`
                        : 'border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded ${weekBadgeBg} text-xs font-bold`}>
                            W{node.week}
                        </span>
                        <h4 className="font-bold text-[#1A1E3B] dark:text-white">
                            {node.title}
                        </h4>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {node.subtitle}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {node.outcome}
                    </p>
                </button>
            </div>
        </div>
    )
}

/**
 * TimelineGuide - Clean inline guide showing the journey progression
 */
function TimelineGuide({ variant }: { variant: 'foundational' | 'advanced' }) {
    const phases = variant === 'foundational'
        ? [
            { week: '1-2', label: 'Target', icon: '🎯' },
            { week: '3-4', label: 'CV Pronto', icon: '📄' },
        ]
        : [
            { week: '1-2', label: 'Target', icon: '🎯' },
            { week: '3-4', label: 'CV', icon: '📄' },
            { week: '5-6', label: 'Proof', icon: '💻' },
            { week: '7-8', label: 'Offer', icon: '🤝' },
        ]

    return (
        <div className="mb-6">
            {/* Instruction */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                <span className="font-medium">👆 Clicca su una settimana</span> per vedere i deliverable
            </p>

            {/* Mini progress visualization */}
            <div className="flex items-center justify-center gap-1 md:gap-2">
                {phases.map((phase, i) => (
                    <div key={i} className="flex items-center gap-1 md:gap-2">
                        <div className="flex flex-col items-center">
                            <span className="text-lg md:text-xl">{phase.icon}</span>
                            <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                {phase.label}
                            </span>
                        </div>
                        {i < phases.length - 1 && (
                            <div className="w-6 md:w-10 h-0.5 bg-slate-200 dark:bg-slate-700" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * CheckpointCompare - Side-by-side Week 4 vs Week 8 value comparison
 */
function CheckpointCompare({
    left,
    right,
}: {
    left: Checkpoint
    right: Checkpoint
}) {
    return (
        <div className="mt-14">
            <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#1A1E3B] dark:text-white">
                    Il salto di valore: da <span className="text-indigo-600 dark:text-indigo-300">Candidabile</span> a{' '}
                    <span className="text-[#F59E0B] dark:text-[#FFF272]">Offer-Ready</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Non "lezioni": <strong>asset verificabili</strong> che riducono il rischio percepito per l'hiring manager.
                </p>
            </div>

            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                <CheckpointCard checkpoint={left} week={4} />

                <div className="hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                    </div>
                </div>

                <CheckpointCard checkpoint={right} week={8} />
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-3">
                {[
                    {
                        title: 'Rischio ↓',
                        desc: 'Proof + numeri = meno "fiducia", più evidenza.'
                    },
                    {
                        title: 'Credibilità ↑',
                        desc: 'Repo + eval + write-up = segnali da engineer.'
                    },
                    {
                        title: 'Conversione ↑',
                        desc: 'JD-specific prep + mock = performance sotto pressione.'
                    },
                ].map((b, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-bold text-[#1A1E3B] dark:text-white">{b.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{b.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * LockedAdvancedCallout - Shown when user selects 4-week track, prompts upgrade
 */
/**
 * LockedAdvancedCallout - Shown when user selects 4-week track, prompts upgrade
 */
function LockedAdvancedCallout() {
    const { setObjective, scrollToSection } = useCareerOS()

    const handleUpgrade = () => {
        setObjective('pro')
        setTimeout(() => scrollToSection('step-timeline'), 100)
    }

    return (
        <div className="mt-8 p-5 rounded-2xl border-2 border-dashed border-[#FFF272]/40 bg-[#FFF272]/5 dark:bg-[#FFF272]/5">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="text-3xl">🔒</div>
                <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-semibold text-[#1A1E3B] dark:text-white mb-1">
                        Vuoi arrivare a Offer-Ready?
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        Sblocca Week 5–8 (Pro): portfolio live, progetto GenAI, candidature mirate + mock interview.
                    </p>
                </div>
                <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-sm font-bold text-slate-900 shadow-md hover:shadow-lg transition-all"
                >
                    Scopri Pro (8 sett.) →
                </button>
            </div>
        </div>
    )
}

/**
 * ModeSelectionCard - Step 3: Choose delivery mode (Class vs 1:1)
 */
function ModeSelectionCard({ onSelect }: { onSelect: (mode: 'classe' | '1to1') => void }) {
    return (
        <div id="step-mode" className="max-w-4xl mx-auto mb-16 scroll-mt-32">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#1A1E3B] dark:text-white mb-3">
                    Come vuoi affrontare il percorso?
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Scegli l'intensità e il livello di supporto che preferisci.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Class Mode */}
                <button
                    onClick={() => onSelect('classe')}
                    className="group relative p-8 rounded-3xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-xl text-left"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                        🎓
                    </div>
                    <h4 className="text-xl font-bold text-[#1A1E3B] dark:text-white mb-2">Classe (Cohort)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">
                        Impara con altri 8-10 peer selezionati. Scadenze fisse, confronto costante e networking.
                    </p>
                    <ul className="space-y-2 mb-8">
                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-indigo-500" /> Data di inizio fissa
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-indigo-500" /> Supporto di gruppo
                        </li>
                    </ul>
                    <span className="inline-block text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Seleziona Classe →
                    </span>
                </button>

                {/* 1:1 Mode */}
                <button
                    onClick={() => onSelect('1to1')}
                    className="group relative p-8 rounded-3xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all hover:shadow-xl text-left"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                        ⚡
                    </div>
                    <h4 className="text-xl font-bold text-[#1A1E3B] dark:text-white mb-2">1:1 Premium</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">
                        Massima flessibilità e focus su di te. Inizia quando vuoi, vai alla tua velocità.
                    </p>
                    <ul className="space-y-2 mb-8">
                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-amber-500" /> Inizio immediato
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-amber-500" /> Sessioni private dedicate
                        </li>
                    </ul>
                    <span className="inline-block text-amber-600 dark:text-amber-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Seleziona 1:1 →
                    </span>
                </button>
            </div>
        </div>
    )
}

/**
 * JourneySection - Main unified timeline component with progressive disclosure
 * Now with gamified step-by-step journey
 */
export default function JourneySection() {
    // Context State
    const { objective, setObjective, setMode, scrollToSection } = useCareerOS()

    // Local UI State
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState<number[]>([])

    // Handlers
    const handleObjectiveChange = (newObjective: ObjectiveType) => {
        setObjective(newObjective) // updates context
        setSelectedWeek(null)

        // Reset gamified state: whenever objective is clicked/changed, 
        // we reset downstream progress. Step 1 is done, next is Step 2.
        setCompletedSteps([1])
        setCurrentStep(2)

        // Auto-scroll to timeline after short delay
        // DISABLED as per user request (Step 1 details are important)
        // setTimeout(() => scrollToSection('step-timeline'), 100)
    }

    const handleWeekSelect = (week: number) => {
        setSelectedWeek(week)

        // Mark step 2 as partially "explored" 
        // We consider Step 2 fully complete when they scroll to Mode? 
        // Or better: when they make a selection, it's done.

        // We'll mark it complete and move to next ONLY if it's the first interaction
        // to encourage flow, but user might want to explore more.
        // Let's NOT auto-scroll to next step immediately on week click 
        // because they need to read the content.

        // HOWEVER, we update the stepper status:
        if (!completedSteps.includes(2)) {
            setCompletedSteps(prev => [...prev, 2])
        }

        // We advance currentStep to 3 (Mode) so they know what's next,
        // but we don't scroll them away from what they are reading.
        setCurrentStep(3)
    }

    const handleModeSelect = (mode: 'classe' | '1to1') => {
        setMode(mode) // updates context

        if (!completedSteps.includes(3)) {
            setCompletedSteps(prev => [...prev, 3])
        }
        setCurrentStep(4)

        // Scroll to pricing
        setTimeout(() => scrollToSection('pricing'), 100)
    }

    // Determine active weeks based on objective (or default to start if null for preview, but we hide timeline if null)
    // If objective is null, we don't show timeline.
    const activeWeeks = objective === 'pro' ? [...FOUNDATIONAL_WEEKS, ...ADVANCED_WEEKS] : FOUNDATIONAL_WEEKS
    const variant = objective === 'pro' ? 'advanced' : 'foundational'

    // Find the selected node
    const selectedNode = selectedWeek
        ? activeWeeks.find(w => w.week === selectedWeek)
        : undefined

    return (
        <section id="journey" className="py-20 md:py-28 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-[#0F1117] dark:to-[#151925]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF272]/20 text-[#1A1E3B] dark:text-[#FFF272] text-sm font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Il Percorso Completo
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1E3B] dark:text-white mb-4">
                        Cosa ottieni{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#383F74] to-[#4d84d4] dark:from-[#FFF272] dark:to-[#F59E0B]">
                            (in 4 o 8 settimane)
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                        Non "lezioni": <strong>asset verificabili</strong> che riducono il rischio percepito per l'hiring manager.
                    </p>

                    {/* Fit Bar - Quick recognition chips */}
                    <FitBar />
                </div>

                {/* Gamified Progress Stepper */}
                <ProgressStepper currentStep={currentStep} completedSteps={completedSteps} />

                {/* STEP 1: Objective Toggle */}
                <ObjectiveToggle selected={objective ?? 'start'} onSelect={handleObjectiveChange} />

                {/* Progressive Disclosure: Only show timeline if objective is selected */}
                {objective && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Value Proposition based on selection */}
                        <div className="mb-12">
                            {objective === 'start' ? (
                                <CheckpointCard checkpoint={CHECKPOINTS.week4} week={4} />
                            ) : (
                                <CheckpointCompare left={CHECKPOINTS.week4} right={CHECKPOINTS.week8} />
                            )}
                        </div>

                        {/* STEP 2: Timeline Section */}
                        <div id="step-timeline" className="scroll-mt-32">
                            <div className="text-center mb-8">
                                <h3 className="text-xl md:text-2xl font-bold text-[#1A1E3B] dark:text-white mb-2">
                                    Come li costruiamo, settimana per settimana
                                </h3>
                            </div>

                            {/* Timeline Guide */}
                            <TimelineGuide variant={variant} />

                            {/* SPLIT VIEW: Timeline + Detail Panel */}
                            <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-center mb-20">
                                {/* Left: Timeline */}
                                <div>
                                    {/* Track Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`px-4 py-2 rounded-full font-bold text-sm ${objective === 'start'
                                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                                            : 'bg-gradient-to-r from-indigo-100 to-[#FFF272]/30 dark:from-indigo-500/20 dark:to-[#FFF272]/10 text-slate-700 dark:text-slate-200'
                                            }`}>
                                            {objective === 'start' ? 'FOUNDATIONAL' : 'FULL JOURNEY'}
                                        </div>
                                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Week {objective === 'start' ? '1-4' : '1-8'}
                                        </span>
                                    </div>

                                    {/* Desktop Timeline */}
                                    {objective === 'start' ? (
                                        <DesktopTimeline
                                            weeks={FOUNDATIONAL_WEEKS}
                                            selectedWeek={selectedWeek}
                                            onSelect={handleWeekSelect}
                                            variant="foundational"
                                        />
                                    ) : (
                                        <div className="hidden md:block space-y-8">
                                            {/* Foundational (W1-4) */}
                                            <DesktopTimeline
                                                weeks={FOUNDATIONAL_WEEKS}
                                                selectedWeek={selectedWeek && selectedWeek <= 4 ? selectedWeek : null}
                                                onSelect={handleWeekSelect}
                                                variant="foundational"
                                            />
                                            {/* Bridge */}
                                            <div className="flex items-center justify-center gap-2 py-2">
                                                <div className="h-px flex-1 bg-gradient-to-r from-indigo-300 to-[#FFF272]/50" />
                                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                                <div className="h-px flex-1 bg-gradient-to-r from-[#FFF272]/50 to-[#FFF272]" />
                                            </div>
                                            {/* Advanced (W5-8) */}
                                            <DesktopTimeline
                                                weeks={ADVANCED_WEEKS}
                                                selectedWeek={selectedWeek && selectedWeek >= 5 ? selectedWeek : null}
                                                onSelect={handleWeekSelect}
                                                variant="advanced"
                                            />
                                        </div>
                                    )}

                                    {/* Mobile Timeline */}
                                    <div className="md:hidden space-y-2">
                                        {activeWeeks.map((node) => (
                                            <MobileWeekItem
                                                key={node.week}
                                                node={node}
                                                isSelected={selectedWeek === node.week}
                                                onSelect={() => handleWeekSelect(node.week)}
                                                variant={node.week <= 4 ? 'foundational' : 'advanced'}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Detail Panel (Sticky on desktop) */}
                                <div>
                                    {selectedNode ? (
                                        <DetailPanel
                                            node={selectedNode}
                                            variant={selectedNode.week <= 4 ? 'foundational' : 'advanced'}
                                        />
                                    ) : (
                                        <PlaceholderPanel variant={variant} />
                                    )}
                                </div>
                            </div>

                            {/* Playbook callout - moved here to contextually close the timeline section */}
                            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-[#FFF272]/10 dark:from-[#1A1E3B] dark:to-[#151925] border border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="p-4 bg-white dark:bg-[#0F1117] rounded-xl shadow-sm">
                                        <Sparkles className="w-10 h-10 text-indigo-600 dark:text-[#FFF272]" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white mb-2">
                                            + Playbook Library (metodo replicabile)
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Ogni fase include un <strong>documento operativo che resta tuo</strong>: role-fit, targeting, CV tailoring, supervised vibe coding, evaluation, interview prep.
                                            <span className="text-indigo-600 dark:text-[#FFF272] font-medium"> Dopo, puoi replicare da solo.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Locked Advanced Upsell (only for Start selection) */}
                        {objective === 'start' && (
                            <div className="mb-16">
                                <LockedAdvancedCallout />
                            </div>
                        )}

                        {/* STEP 3: Mode Selection */}
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <ModeSelectionCard onSelect={handleModeSelect} />
                        </div>



                        {/* Bridge CTA to Pricing */}
                        <div className="mt-12 text-center">
                            <a
                                href="#pricing"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                Vedi i prezzi →
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

