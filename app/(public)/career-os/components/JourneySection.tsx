'use client'

import { useState } from 'react'
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
} from 'lucide-react'

/**
 * Artifact tag types for deliverables
 */
type ArtifactTag = 'DOC' | 'SHEET' | 'REPO' | 'DEMO' | 'REPORT' | 'PROFILE'

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
    why: string // 1 frase "why it matters"
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
    DOC: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    SHEET: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    REPO: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
    DEMO: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    REPORT: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    PROFILE: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
}

/**
 * Journey data - all weeks with artifact-tagged deliverables
 */
const FOUNDATIONAL_WEEKS: WeekNode[] = [
    {
        week: 1,
        title: 'Ruolo Target',
        subtitle: 'Story & Focus',
        icon: Target,
        deliverables: [
            { name: 'Role-Fit Report', tag: 'REPORT', description: 'ruoli consigliati + gap analysis' },
            { name: 'Positioning Pack', tag: 'DOC', description: 'headline + pitch professionale' },
            { name: 'Signal Checklist', tag: 'DOC' },
        ],
        qualityCheck: 'In 30s è chiaro ruolo target + proof da costruire',
        outcome: '→ ruolo + narrative chiari',
        why: 'Se non sei "role-fit", sembri generico e vieni scartato in pochi secondi.',
    },
    {
        week: 2,
        title: 'Aziende & Ruoli',
        subtitle: 'Piano Candidature',
        icon: Briefcase,
        deliverables: [
            { name: 'Target List', tag: 'SHEET', description: '20-40 aziende prioritizzate' },
            { name: 'Job Feed', tag: 'SHEET', description: 'ricorrente, personalizzato' },
            { name: '3 JD Selezionate', tag: 'DOC', description: 'top match per il tuo profilo' },
        ],
        qualityCheck: 'Target coerente col posizionamento',
        outcome: '→ pipeline pronta',
        why: 'Applicare "a caso" abbassa conversione: serve una lista target e un ritmo sostenibile.',
    },
    {
        week: 3,
        title: 'CV/LinkedIn',
        subtitle: 'ATS + Segnali GenAI',
        icon: FileSearch,
        deliverables: [
            { name: 'CV Master', tag: 'DOC', description: '+ variante per track' },
            { name: 'LinkedIn Ottimizzato', tag: 'PROFILE' },
            { name: 'Application Bundle', tag: 'DOC', description: '2-3 candidature gold standard' },
        ],
        qualityCheck: 'Primo terzo CV comunica segnali GenAI',
        outcome: '→ CV ATS-ready',
        why: 'Se il CV non mostra segnali GenAI nei primi secondi, non arrivi al colloquio.',
    },
    {
        week: 4,
        title: 'Colloquio Base',
        subtitle: '+ Prima Proof Pubblica',
        icon: Users,
        deliverables: [
            { name: 'Interview Pack', tag: 'DOC', description: 'generale + 1 JD-specific' },
            { name: 'Micro-Proof Pubblica', tag: 'DEMO', description: 'primo progetto visibile' },
            { name: 'Pipeline Attiva', tag: 'SHEET' },
        ],
        qualityCheck: '1 proof pubblica + colloquio base preparato',
        outcome: '→ 1 proof + interview ready',
        why: 'Una proof pubblica riduce il rischio percepito: "non è teoria, sa fare".',
    },
]

const ADVANCED_WEEKS: WeekNode[] = [
    {
        week: 5,
        title: 'Progetto: Baseline',
        subtitle: 'Misure & Valutazione',
        icon: BrainCircuit,
        deliverables: [
            { name: 'Blueprint Definitivo', tag: 'DOC', description: 'spec + Definition of Done' },
            { name: 'Demo E2E', tag: 'DEMO', description: 'happy path funzionante' },
            { name: 'Eval Harness v0', tag: 'REPO', description: 'baseline misurabile' },
        ],
        qualityCheck: 'Riproducibilità + misurabilità',
        outcome: '→ demo misurabile',
        why: 'Senza misure non stai facendo engineering: stai facendo una demo fragile.',
    },
    {
        week: 6,
        title: 'Progetto: Qualità',
        subtitle: 'Affidabilità & Numeri',
        icon: Zap,
        deliverables: [
            { name: 'Error Analysis', tag: 'REPORT', description: 'iterazioni misurate' },
            { name: 'Guardrails', tag: 'REPO', description: 'fallback + validation' },
            { name: 'Observability', tag: 'REPO', description: 'logging minimo' },
        ],
        qualityCheck: 'Spieghi cosa migliorava cosa, con numeri',
        outcome: '→ affidabilità + numeri',
        why: 'Gli HM cercano tradeoff e affidabilità, non "funziona sul mio PC".',
    },
    {
        week: 7,
        title: 'Portfolio & Pubblicazione',
        subtitle: 'Visibile agli HM',
        icon: TrendingUp,
        deliverables: [
            { name: 'README + Architettura', tag: 'REPO', description: 'professionale, navigabile' },
            { name: 'Write-up Tecnico', tag: 'DOC', description: 'articolo completo' },
            { name: 'Portfolio Aggiornato', tag: 'PROFILE' },
        ],
        qualityCheck: 'HM capisce in 3 min progetto + tradeoff + risultati',
        outcome: '→ proof visibile in 3 min',
        why: 'Se non è comunicabile, è come se non esistesse: devi vendere il progetto in 180s.',
    },
    {
        week: 8,
        title: 'Mock Colloquio',
        subtitle: 'JD-specific + Debrief',
        icon: CheckCircle2,
        deliverables: [
            { name: 'JD-Specific Packs', tag: 'DOC', description: '2-3 JD preparate' },
            { name: 'Mock + Scorecard', tag: 'REPORT', description: 'con Senior AI' },
            { name: 'Playbook 30 Giorni', tag: 'DOC', description: 'piano post-percorso' },
        ],
        qualityCheck: 'Difendi progetto e decisioni tecniche',
        outcome: '→ difendi scelte tecniche',
        why: 'Il colloquio è stress-test: devi reggere domande e difendere decisioni con numeri.',
    },
]

const CHECKPOINTS: Record<'week4' | 'week8', Checkpoint> = {
    week4: {
        title: 'Sei Candidabile',
        emoji: '✅',
        tier: 'Starter+',
        hint: 'Asset base pronti per applicare in modo coerente e credibile.',
        deliverables: [
            { name: 'Role-Fit Report', tag: 'REPORT', description: 'ruolo target + gap chiari' },
            { name: 'CV Master', tag: 'DOC', description: 'ATS-ready + keyword GenAI' },
            { name: 'Target List', tag: 'SHEET', description: '20–40 aziende + pipeline' },
            { name: 'Application Bundle', tag: 'DOC', description: '2–3 candidature gold' },
        ],
    },
    week8: {
        title: 'Offer-Ready',
        emoji: '🎯',
        tier: 'Pro / Elite',
        hint: 'Proof completa + evaluation + mock: sei pronto a difendere scelte e numeri.',
        deliverables: [
            { name: 'Proof Project', tag: 'REPO', description: 'repo pulita + setup' },
            { name: 'Demo Live', tag: 'DEMO', description: 'happy path riproducibile' },
            { name: 'Evaluation Report', tag: 'REPORT', description: 'metriche + error analysis' },
            { name: 'Mock + Scorecard', tag: 'REPORT', description: 'debrief con Senior AI' },
        ],
    },
}

/**
 * DeliverableTag - Visual tag for artifact type
 */
function DeliverableTag({ tag }: { tag: ArtifactTag }) {
    return (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${TAG_COLORS[tag]}`}>
            {tag}
        </span>
    )
}

/**
 * WeekNode - Compact timeline node (no expand)
 */
function WeekNodeCompact({
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
    const Icon = node.icon
    const colorClasses = variant === 'foundational'
        ? 'border-indigo-500/30 hover:border-indigo-500/60'
        : 'border-[#FFF272]/30 hover:border-[#FFF272]/60'
    const bgClasses = variant === 'foundational'
        ? 'bg-indigo-500/5 hover:bg-indigo-500/10'
        : 'bg-[#FFF272]/5 hover:bg-[#FFF272]/10'
    const iconBg = variant === 'foundational'
        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
        : 'bg-[#FFF272]/10 text-[#F59E0B]'
    const weekBadge = variant === 'foundational'
        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
        : 'bg-[#FFF272]/20 text-[#1A1E3B] dark:text-[#FFF272]'
    const selectedRing = variant === 'foundational'
        ? 'ring-indigo-500'
        : 'ring-[#FFF272]'

    return (
        <div className="flex flex-col items-center">
            {/* Node circle */}
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
                {/* Checkpoint badge for milestone weeks */}
                {(node.week === 4 || node.week === 8) && (
                    <span
                        className={`
                            absolute -bottom-3 left-1/2 -translate-x-1/2
                            px-2 py-0.5 rounded-full text-[10px] font-bold
                            ${node.week === 4
                                ? 'bg-indigo-600 text-white'
                                : 'bg-[#FFF272] text-[#1A1E3B]'
                            }
                            shadow-sm
                        `}
                    >
                        GATE
                    </span>
                )}
            </button>

            {/* Title only (no subtitle for compact view) */}
            <h4 className={`${(node.week === 4 || node.week === 8) ? 'mt-6' : 'mt-3'} text-sm font-bold text-[#1A1E3B] dark:text-white text-center max-w-[100px]`}>
                {node.title}
            </h4>
            {/* Micro-outcome - compact */}
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 text-center max-w-[100px]">
                {node.outcome}
            </p>
        </div>
    )
}
/**
 * DetailPanel - Scannable 2-column layout with Outcome+Gate left, Outputs right
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
        <div id="journey-detail" className={`mt-6 p-5 rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${bgGradient} backdrop-blur-sm animate-fadeIn`}>
            {/* Header: Week + Title */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className={`text-2xl font-bold ${accentColor}`}>W{node.week}</span>
                <div>
                    <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white">{node.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{node.subtitle}</p>
                </div>
            </div>

            {/* 2-Column Content */}
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                {/* Left: Outcome + Gate */}
                <div className="space-y-4">
                    {/* Outcome */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Outcome
                        </p>
                        <p className="text-sm font-medium text-[#1A1E3B] dark:text-white">
                            {node.outcome}
                        </p>
                    </div>

                    {/* Gate */}
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">
                            🚪 Gate
                        </p>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300">
                            {node.qualityCheck}
                        </p>
                    </div>
                </div>

                {/* Right: Deliverables as tiles */}
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
                        Output (che ti porti via)
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2">
                        {node.deliverables.map((d, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-1">
                                    <DeliverableTag tag={d.tag} />
                                </div>
                                <p className="text-sm font-semibold text-[#1A1E3B] dark:text-white leading-tight">
                                    {d.name}
                                </p>
                                {d.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {d.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why it matters - single line footer */}
            <p className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Perché conta:</span> {node.why}
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
 */
function DesktopTimeline({
    weeks,
    selectedWeek,
    onSelect,
    variant,
}: {
    weeks: WeekNode[]
    selectedWeek: number
    onSelect: (week: number) => void
    variant: 'foundational' | 'advanced'
}) {
    const total = weeks.length
    const selectedIdx = Math.max(0, weeks.findIndex(w => w.week === selectedWeek))
    const progress = total <= 1 ? 0 : (selectedIdx / (total - 1)) * 100

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
                <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${fillLine} transition-[width] duration-300 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Nodes - z-10 to stay above the rail line */}
            <div className="relative z-10 grid grid-cols-4 gap-6 items-start">
                {weeks.map(node => (
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

            {/* Bridge row: marker under selected node */}
            <div className="grid grid-cols-4 gap-6 mt-3">
                {weeks.map(node => (
                    <div key={node.week} className="flex justify-center">
                        {selectedWeek === node.week ? <BridgeMarker variant={variant} /> : <div className="h-10" />}
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
 * LegendAccordion - Collapsible legend + TLDR (closed by default)
 */
function LegendAccordion() {
    const [isOpen, setIsOpen] = useState(false)
    const tags: ArtifactTag[] = ['DOC', 'SHEET', 'REPO', 'DEMO', 'REPORT', 'PROFILE']

    const TLDR_ITEMS = [
        { weeks: '1–2', label: 'Target & Positioning', variant: 'foundational' as const },
        { weeks: '3–4', label: 'CV & Interview Base', variant: 'foundational' as const },
        { weeks: '5–6', label: 'Proof Project', variant: 'advanced' as const },
        { weeks: '7–8', label: 'Packaging & Mock', variant: 'advanced' as const },
    ]

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <span>📖</span>
                <span>Come leggere</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="mt-3 p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                    {/* Instructions */}
                    <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
                        <span className="font-semibold">Clicca una settimana →</span> vedi gli output che ottieni + il gate qualità.
                    </p>

                    {/* TLDR chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {TLDR_ITEMS.map((item, i) => (
                            <div
                                key={i}
                                className={`
                                    px-3 py-1 rounded-full text-xs font-medium
                                    flex items-center gap-1.5 border
                                    ${item.variant === 'foundational'
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                                        : 'bg-[#FFF272]/10 dark:bg-[#FFF272]/5 border-[#FFF272]/40 text-[#1A1E3B] dark:text-[#FFF272]'
                                    }
                                `}
                            >
                                <span className="font-bold">W{item.weeks}</span>
                                <span className="opacity-60">→</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tag legend */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Tipi di output:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(t => (
                            <DeliverableTag key={t} tag={t} />
                        ))}
                    </div>
                </div>
            )}
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
 * BranchCard - Compact marker between Foundational and Advanced tracks
 */
function BranchCard() {
    return (
        <div className="my-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                ✅ Week 4: Candidabile
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF272]/30 dark:bg-[#FFF272]/15 text-[#1A1E3B] dark:text-[#FFF272] text-sm font-semibold border border-[#FFF272]/40">
                🎯 Week 5+: Offer-Ready
            </div>
        </div>
    )
}

/**
 * JourneySection - Main unified timeline component
 */
export default function JourneySection() {
    // Separate selections for each track - both default to first week of their track
    const [selectedFoundationalWeek, setSelectedFoundationalWeek] = useState<number>(1)
    const [selectedAdvancedWeek, setSelectedAdvancedWeek] = useState<number>(5)

    // Find the selected nodes for each track
    const selectedFoundationalNode = FOUNDATIONAL_WEEKS.find(w => w.week === selectedFoundationalWeek)
    const selectedAdvancedNode = ADVANCED_WEEKS.find(w => w.week === selectedAdvancedWeek)

    return (
        <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-[#0F1117] dark:to-[#151925]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF272]/20 text-[#1A1E3B] dark:text-[#FFF272] text-sm font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Il Percorso Completo
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1E3B] dark:text-white mb-4">
                        Con Career-OS passi da zero a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#383F74] to-[#4d84d4] dark:from-[#FFF272] dark:to-[#F59E0B]">
                            offer-ready
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Seleziona una settimana → vedi gli asset che porti a casa + il gate qualità.
                    </p>
                    <LegendAccordion />
                </div>

                {/* FOUNDATIONAL TRACK */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                            FOUNDATIONAL
                        </div>
                        <div className="flex-1 h-px bg-indigo-200 dark:bg-indigo-500/30" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Week 1-4
                        </span>
                    </div>

                    {/* Timeline nodes - Desktop horizontal */}
                    <DesktopTimeline
                        weeks={FOUNDATIONAL_WEEKS}
                        selectedWeek={selectedFoundationalWeek}
                        onSelect={(w) => setSelectedFoundationalWeek(w)}
                        variant="foundational"
                    />

                    {/* Timeline nodes - Mobile vertical */}
                    <div className="md:hidden space-y-2">
                        {FOUNDATIONAL_WEEKS.map((node) => (
                            <MobileWeekItem
                                key={node.week}
                                node={node}
                                isSelected={selectedFoundationalWeek === node.week}
                                onSelect={() => setSelectedFoundationalWeek(node.week)}
                                variant="foundational"
                            />
                        ))}
                    </div>

                    {/* Detail Panel - Always shows for selected foundational week */}
                    {selectedFoundationalNode && (
                        <DetailPanel node={selectedFoundationalNode} variant="foundational" />
                    )}
                </div>

                {/* Branch marker between tracks */}
                <BranchCard />

                {/* ADVANCED TRACK */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-4 py-2 rounded-full bg-[#FFF272]/20 dark:bg-[#FFF272]/10 text-[#1A1E3B] dark:text-[#FFF272] font-bold text-sm border border-[#FFF272]/50">
                            🚀 ADVANCED
                        </div>
                        <div className="flex-1 h-px bg-[#FFF272]/30" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Week 5-8
                        </span>
                    </div>

                    {/* Timeline nodes - Desktop horizontal */}
                    <DesktopTimeline
                        weeks={ADVANCED_WEEKS}
                        selectedWeek={selectedAdvancedWeek}
                        onSelect={(w) => setSelectedAdvancedWeek(w)}
                        variant="advanced"
                    />

                    {/* Timeline nodes - Mobile vertical */}
                    <div className="md:hidden space-y-2">
                        {ADVANCED_WEEKS.map((node) => (
                            <MobileWeekItem
                                key={node.week}
                                node={node}
                                isSelected={selectedAdvancedWeek === node.week}
                                onSelect={() => setSelectedAdvancedWeek(node.week)}
                                variant="advanced"
                            />
                        ))}
                    </div>

                    {/* Detail Panel - Always shows for selected advanced week */}
                    {selectedAdvancedNode && (
                        <DetailPanel node={selectedAdvancedNode} variant="advanced" />
                    )}
                </div>

                {/* Checkpoint Compare - Always visible */}
                <CheckpointCompare left={CHECKPOINTS.week4} right={CHECKPOINTS.week8} />

                {/* Playbook callout */}
                <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-[#FFF272]/10 dark:from-[#1A1E3B] dark:to-[#151925] border border-slate-200 dark:border-slate-700">
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
        </section>
    )
}
