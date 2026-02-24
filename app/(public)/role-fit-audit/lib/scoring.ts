/**
 * Role Fit Audit - Scoring Logic
 * 
 * Calculates scores, determines archetype, and generates recommendations
 */

import { QUESTIONS, type Dimension } from './questions'
import type { RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'

// =============================================================================
// Types
// =============================================================================

export interface Scores {
    code: number
    data: number
    product: number
    genai: number
    readiness: number
    proof: number
}

export type ArchetypeId =
    | 'BUILDER'
    | 'DATA_DRIVEN'
    | 'PRODUCT_MINDED'
    | 'FULL_STACK_HYBRID'
    | 'ML_ISH_APPLIED'
    | 'OPERATOR'
    | 'EXPLORER'
    | 'SPECIALIST'

export interface Archetype {
    id: ArchetypeId
    name: string
    tagline: string
    superpower: string
    risk: string
    lever: string
}

export interface RoleRecommendation {
    now: string
    next: string
    nowReasons: string[]
    requirements: string[]
}

export interface Gap {
    id: string
    title: string
    whyBlocks: string
    fix7Days: string
    output: string
}

export interface AuditResult {
    scores: Scores
    normalizedScores: Scores // 0-100
    archetype: Archetype
    roleRecommendation: RoleRecommendation
    topGaps: Gap[]
    readinessLabel: string
    oneLineDiagnosis: string
    nextSteps: string[]
    generatedBy?: 'ai' | 'static'
    aiEnhancements?: {
        whyThisArchetype: string
        nowRationale: string
        nextRationale: string
        personalizedGaps: Array<{
            id: string
            personalizedAnalysis: string
            personalizedFix: string
        }>
        coachingNote: string
        pdfAnalysis?: {
            executiveSummary: string
            strengthsAnalysis: string
            weaknessesAnalysis: string
            careerStrategy: string
        }
    }
}

// =============================================================================
// Archetypes Configuration
// =============================================================================

const ARCHETYPES: Record<ArchetypeId, Archetype> = {
    BUILDER: {
        id: 'BUILDER',
        name: 'Builder Pragmatico',
        tagline: 'Spedisci cose che funzionano.',
        superpower: 'Execution rapido, prototipi concreti, shipping.',
        risk: 'Senza narrativa e proof, sembri "solo dev".',
        lever: 'Demo live + README con architettura.',
    },
    DATA_DRIVEN: {
        id: 'DATA_DRIVEN',
        name: 'Data-Driven',
        tagline: 'Misuri prima di credere.',
        superpower: 'Ragionamento per metriche, dataset, valutazione; ottimo su eval.',
        risk: 'Ti blocchi in analisi, poca prova "visibile" (demo/link).',
        lever: 'Report + eval harness (anche semplice) con risultati.',
    },
    PRODUCT_MINDED: {
        id: 'PRODUCT_MINDED',
        name: 'Product-Minded',
        tagline: 'Sai cosa serve davvero all\'utente.',
        superpower: 'Chiarezza sul problema, UX, scope, priorità.',
        risk: 'Senza proof tecnica rischi di sembrare "PM che parla".',
        lever: 'Case study con decisioni + demo semplice.',
    },
    FULL_STACK_HYBRID: {
        id: 'FULL_STACK_HYBRID',
        name: 'Full-Stack Hybrid',
        tagline: 'Costruisci e sai raccontarlo.',
        superpower: 'End-to-end ownership, velocità + chiarezza.',
        risk: 'Dispersione; se non scegli un ruolo, sembri generalista.',
        lever: '1 flagship project con scope chiaro (non 3 mini-progetti).',
    },
    ML_ISH_APPLIED: {
        id: 'ML_ISH_APPLIED',
        name: 'ML-ish Applied',
        tagline: 'Tra ML e software: l\'incastro giusto.',
        superpower: 'Ottimo per pipeline, retrieval, eval, integrazione.',
        risk: 'Puoi cadere nel "tecnico astratto" senza output leggibile.',
        lever: 'Notebook → Report → Demo (trasformare in asset).',
    },
    OPERATOR: {
        id: 'OPERATOR',
        name: 'Operator',
        tagline: 'Rendi l\'AI utile, senza drama.',
        superpower: 'Affidabilità, delivery, organizzazione, processi.',
        risk: 'Senza un "pezzo wow" non emergi.',
        lever: 'Playbook + small tool live (anche piccolo, ma polished).',
    },
    EXPLORER: {
        id: 'EXPLORER',
        name: 'Explorer',
        tagline: 'Hai potenziale, ti manca direzione.',
        superpower: 'Curiosità, apprendimento rapido.',
        risk: 'Fai tutto e niente; CV generico, portfolio random.',
        lever: 'Scegliere 1 ruolo NOW + 1 progetto.',
    },
    SPECIALIST: {
        id: 'SPECIALIST',
        name: 'Specialist',
        tagline: 'Forte in una cosa, da bilanciare.',
        superpower: 'Profondità reale in un\'area specifica.',
        risk: 'Mismatch con ruoli end-to-end se mancano le basi degli altri assi.',
        lever: '"Bridge skills" minime per bilanciare il profilo.',
    },
}

// =============================================================================
// Gap Definitions
// =============================================================================

const GAPS: Record<string, Gap> = {
    GAP_PROOF: {
        id: 'GAP_PROOF',
        title: 'Non hai evidenza pubblica',
        whyBlocks: 'Senza link sei "teoria", i recruiter non possono valutarti.',
        fix7Days: 'Scegli 1 mini-tool (RAG o agent semplice), crea repo pulito + README.',
        output: 'Repo + README + link demo',
    },
    GAP_SHIPPING: {
        id: 'GAP_SHIPPING',
        title: '"Works on my machine"',
        whyBlocks: 'Non puoi dimostrare che sai mettere in produzione.',
        fix7Days: 'Deploy su Vercel/Firebase/Render + env/secrets + logging base.',
        output: 'URL HTTPS live + env template',
    },
    GAP_GENAI_FOUNDATION: {
        id: 'GAP_GENAI_FOUNDATION',
        title: 'GenAI conoscenza frammentata',
        whyBlocks: 'Non hai le basi per performare su ruoli LLM Apps.',
        fix7Days: '1 RAG end-to-end con chunking + retriever (anche semplice).',
        output: 'Doc architettura + small eval set',
    },
    GAP_EVAL_DATA: {
        id: 'GAP_EVAL_DATA',
        title: 'Non misuri qualità',
        whyBlocks: 'Non puoi dimostrare che il tuo sistema funziona.',
        fix7Days: 'Crea 20 query di test + rubric + metriche base.',
        output: 'Eval sheet + report risultati',
    },
    GAP_ENGINEERING: {
        id: 'GAP_ENGINEERING',
        title: 'Fondamenta engineering deboli',
        whyBlocks: 'Non riesci a costruire cose solide e manutenibili.',
        fix7Days: 'API + struttura progetto + error handling + tests minimi.',
        output: 'Backend repo con test + doc usage',
    },
    GAP_STORY_SCOPE: {
        id: 'GAP_STORY_SCOPE',
        title: 'Non sai raccontare cosa hai fatto',
        whyBlocks: 'Il tuo lavoro non viene capito da chi ti valuta.',
        fix7Days: 'Write-up (problema → approccio → trade-off → risultati).',
        output: '1 pagina case study (blog/README)',
    },
    GAP_QUALITY: {
        id: 'GAP_QUALITY',
        title: 'Mancano test e standard',
        whyBlocks: 'Il codice sembra poco professionale.',
        fix7Days: 'Lint + formatter + unit test su 2 funzioni critiche.',
        output: 'CI pass + badge + test',
    },
    GAP_DEPLOY: {
        id: 'GAP_DEPLOY',
        title: 'Niente cloud',
        whyBlocks: 'Non puoi mostrare niente di live.',
        fix7Days: 'Deploy su Vercel/Firebase/Render + secrets + monitoring base.',
        output: 'Link + deploy guide',
    },
    GAP_NARRATIVE: {
        id: 'GAP_NARRATIVE',
        title: 'Sei tecnico ma sembri "solo dev"',
        whyBlocks: 'Non emerge il tuo impatto e le tue decisioni.',
        fix7Days: 'Evidenzia impatto + decisioni + metriche nel CV e README.',
        output: 'CV bullets + README con decision log',
    },
    GAP_IMPLEMENTATION: {
        id: 'GAP_IMPLEMENTATION',
        title: 'Hai idee ma poca execution',
        whyBlocks: 'Parli bene ma non mostri che sai costruire.',
        fix7Days: 'Skeleton app + feature core + demo.',
        output: 'Demo + repo funzionante',
    },
}

// =============================================================================
// Scoring Functions
// =============================================================================

/**
 * Calculate raw scores from answers
 */
export function calculateRawScores(answers: Record<string, number>): Scores {
    const scores: Scores = {
        code: 0,
        data: 0,
        product: 0,
        genai: 0,
        readiness: 0,
        proof: 0,
    }

    for (const question of QUESTIONS) {
        const answerValue = answers[question.id]
        if (answerValue === undefined) continue

        const selectedOption = question.options.find((o) => o.value === answerValue)
        if (!selectedOption) continue

        for (const [dim, points] of Object.entries(selectedOption.scoring)) {
            scores[dim as Dimension] += points as number
        }
    }

    return scores
}

/**
 * Normalize scores to 0-100
 */
export function normalizeScores(rawScores: Scores): Scores {
    // Max possible scores based on question structure
    const maxScores: Scores = {
        code: 14,
        data: 12,
        product: 12,
        genai: 20,
        readiness: 36,
        proof: 4,
    }

    return {
        code: Math.round((rawScores.code / maxScores.code) * 100),
        data: Math.round((rawScores.data / maxScores.data) * 100),
        product: Math.round((rawScores.product / maxScores.product) * 100),
        genai: Math.round((rawScores.genai / maxScores.genai) * 100),
        readiness: Math.round((rawScores.readiness / maxScores.readiness) * 100),
        proof: Math.round((rawScores.proof / maxScores.proof) * 100),
    }
}

// =============================================================================
// Archetype Determination
// =============================================================================

/**
 * Determine archetype based on normalized scores
 */
export function determineArchetype(scores: Scores): Archetype {
    const { code, data, product, readiness } = scores

    // Step 1: If readiness < 45 → Explorer
    if (readiness < 45) {
        return ARCHETYPES.EXPLORER
    }

    // Find top dimension and second
    const dims = [
        { name: 'code', value: code },
        { name: 'data', value: data },
        { name: 'product', value: product },
    ].sort((a, b) => b.value - a.value)

    const top = dims[0]
    const second = dims[1]
    const gap = top.value - second.value

    // Step 2: Check for Specialist (one very high, others low)
    if (top.value >= 70 && second.value < 50) {
        return ARCHETYPES.SPECIALIST
    }

    // Step 3: Check for Hybrids
    if (code >= 65 && product >= 65) {
        return ARCHETYPES.FULL_STACK_HYBRID
    }
    if (code >= 65 && data >= 65) {
        return ARCHETYPES.ML_ISH_APPLIED
    }

    // Step 4: Check for dominant archetype
    if (gap >= 12) {
        if (top.name === 'code') return ARCHETYPES.BUILDER
        if (top.name === 'data') return ARCHETYPES.DATA_DRIVEN
        if (top.name === 'product') return ARCHETYPES.PRODUCT_MINDED
    }

    // Step 5: Check for Operator (all medium, readiness >= 50)
    const allMedium = code >= 45 && code <= 65 && data >= 45 && data <= 65 && product >= 45 && product <= 65
    if (allMedium && readiness >= 50) {
        return ARCHETYPES.OPERATOR
    }

    // Default: Based on top dimension
    if (top.name === 'code') return ARCHETYPES.BUILDER
    if (top.name === 'data') return ARCHETYPES.DATA_DRIVEN
    if (top.name === 'product') return ARCHETYPES.PRODUCT_MINDED

    return ARCHETYPES.EXPLORER
}

// =============================================================================
// Role Recommendations
// =============================================================================

/**
 * Get role recommendations based on archetype and scores
 */
export function getRoleRecommendation(archetype: Archetype, scores: Scores): RoleRecommendation {
    const { genai, readiness, code, data, product } = scores

    const recommendations: Record<ArchetypeId, RoleRecommendation> = {
        BUILDER: {
            now: genai >= 55 ? 'LLM Apps Dev / RAG Dev' : 'Backend Developer con focus AI',
            next: 'GenAI Engineer (Applied)',
            nowReasons: [
                'Forte capacità di execution e shipping',
                'Sai costruire end-to-end',
                'Background tecnico solido',
            ],
            requirements: [
                'Demo live con RAG o agent',
                'Repo con README architetturale',
                'CV con numeri e risultati',
            ],
        },
        DATA_DRIVEN: {
            now: genai >= 55 ? 'Applied GenAI (Eval/RAG)' : 'Data Analyst con focus ML',
            next: 'GenAI Engineer (Eval focus)',
            nowReasons: [
                'Ragioni per metriche e qualità',
                'Sai valutare sistemi in modo oggettivo',
                'Background data solido',
            ],
            requirements: [
                'Eval harness con risultati',
                'Report pubblico con metriche',
                'Demo o notebook replicabile',
            ],
        },
        PRODUCT_MINDED: {
            now: genai >= 45 ? 'AI Product Engineer (Junior)' : 'Solutions GenAI',
            next: 'GenAI Product Engineer',
            nowReasons: [
                'Chiarezza su problema e scope',
                'Pensi all\'utente e al valore',
                'Sai comunicare trade-off',
            ],
            requirements: [
                'Case study con decisioni',
                'Demo semplice (anche lo-fi)',
                'Write-up con impact',
            ],
        },
        FULL_STACK_HYBRID: {
            now: genai >= 55 ? 'GenAI Engineer (Junior)' : 'AI Product Engineer',
            next: 'GenAI Engineer (Mid)',
            nowReasons: [
                'End-to-end ownership naturale',
                'Bilanci tecnico e product',
                'Velocità + chiarezza',
            ],
            requirements: [
                'Flagship project completo',
                'Demo live + README dettagliato',
                'Storytelling tecnico chiaro',
            ],
        },
        ML_ISH_APPLIED: {
            now: genai >= 60 ? 'RAG Engineer / Applied GenAI' : 'ML Engineer (Applied)',
            next: 'GenAI Engineer',
            nowReasons: [
                'Forte su pipeline e integrazione',
                'Sai ragionare su dati e codice insieme',
                'Ottimo per eval e retrieval',
            ],
            requirements: [
                'Repo con pipeline documentata',
                'Eval con metriche',
                'Demo funzionante',
            ],
        },
        OPERATOR: {
            now: genai >= 45 ? 'Solutions/Implementation GenAI' : 'Technical PM / DeVops',
            next: 'GenAI Engineer (dopo focus tecnico)',
            nowReasons: [
                'Affidabilità e delivery',
                'Sai gestire processi e team',
                'Delivery costante',
            ],
            requirements: [
                'Playbook o processo documentato',
                'Tool piccolo ma polished',
                'CV con risultati quantificabili',
            ],
        },
        EXPLORER: {
            now: 'Start Track: Focus su 1 ruolo specifico',
            next: 'LLM Apps Dev / RAG Dev (dopo focus)',
            nowReasons: [
                'Curiosità e voglia di imparare',
                'Potenziale da sviluppare',
                'Flessibilità',
            ],
            requirements: [
                'Scegliere 1 direzione',
                '1 progetto completato',
                'CV focalizzato (non dispersivo)',
            ],
        },
        SPECIALIST: {
            now: 'Ruolo "bridge" vicino al tuo picco',
            next: 'Profilo più hybrid/completo',
            nowReasons: [
                'Profondità reale in un\'area',
                'Expertise riconoscibile',
                'Differenziazione naturale',
            ],
            requirements: [
                '1-2 bridge skills',
                'Proof nel tuo punto di forza',
                'Positioning chiaro',
            ],
        },
    }

    return recommendations[archetype.id]
}

// =============================================================================
// Gap Analysis
// =============================================================================

/**
 * Identify top 3 gaps based on scores
 */
export function identifyGaps(scores: Scores): Gap[] {
    const gaps: Gap[] = []

    // Priority order based on spec
    if (scores.proof <= 50) gaps.push(GAPS.GAP_PROOF)
    if (scores.genai < 55) gaps.push(GAPS.GAP_GENAI_FOUNDATION)
    if (scores.readiness < 60) gaps.push(GAPS.GAP_SHIPPING)
    if (scores.code < 55) gaps.push(GAPS.GAP_ENGINEERING)
    if (scores.data < 50) gaps.push(GAPS.GAP_EVAL_DATA)
    if (scores.product < 50) gaps.push(GAPS.GAP_STORY_SCOPE)

    // Cross-axis gaps
    if (scores.code >= 60 && scores.product < 50) gaps.push(GAPS.GAP_NARRATIVE)
    if (scores.product >= 60 && scores.code < 50) gaps.push(GAPS.GAP_IMPLEMENTATION)

    // Return top 3
    return gaps.slice(0, 3)
}

// =============================================================================
// Readiness Label
// =============================================================================

export function getReadinessLabel(readiness: number): string {
    if (readiness < 45) return 'Not Ready Yet'
    if (readiness < 60) return 'Early Ready'
    if (readiness < 75) return 'Interview Ready'
    return 'Production Ready'
}

// =============================================================================
// One-Line Diagnosis
// =============================================================================

const DIAGNOSIS_TEMPLATES: Record<ArchetypeId, string> = {
    BUILDER: 'Sei un **Builder Pragmatico**: sai costruire, ora devi trasformare output in **proof pubblica**.',
    DATA_DRIVEN: 'Sei **Data-Driven**: il tuo vantaggio è la **misurabilità**; ti serve un asset più "visibile" (demo/link).',
    PRODUCT_MINDED: 'Sei **Product-Minded**: sai scegliere cosa conta; ti serve 1 progetto che dimostri **execution tecnico**.',
    FULL_STACK_HYBRID: 'Sei **Full-Stack Hybrid**: end-to-end naturale; serve **focus** su un ruolo e un flagship project.',
    ML_ISH_APPLIED: 'Sei **ML-ish Applied**: forte sull\'incastro data+code; spingi su **eval + deploy** per diventare credibile.',
    OPERATOR: 'Sei **Operator**: affidabile e concreto; ti manca un **pezzo wow** per emergere.',
    EXPLORER: 'Sei **Explorer**: potenziale alto, direzione bassa; la priorità è **scegliere 1 ruolo** e costruire 1 proof.',
    SPECIALIST: 'Sei **Specialist**: profondità reale; aggiungi 1-2 bridge skills per essere spendibile su ruoli GenAI applied.',
}

const ARCHETYPES_EN: Record<ArchetypeId, Omit<Archetype, 'id'>> = {
    BUILDER: {
        name: 'Pragmatic Builder',
        tagline: 'You ship working systems.',
        superpower: 'Fast execution, concrete prototypes, shipping mindset.',
        risk: 'Without narrative and proof, your profile looks "just dev".',
        lever: 'Live demo + architecture-focused README.',
    },
    DATA_DRIVEN: {
        name: 'Data-Driven',
        tagline: 'You measure before believing.',
        superpower: 'Metrics-first reasoning and evaluation mindset.',
        risk: 'You can overanalyze and under-show visible proof.',
        lever: 'Public eval report with a replicable harness.',
    },
    PRODUCT_MINDED: {
        name: 'Product-Minded',
        tagline: 'You focus on what users actually need.',
        superpower: 'Problem framing, scope clarity, and prioritization.',
        risk: 'Without technical proof you may look too high-level.',
        lever: 'Case study with decisions + minimal working demo.',
    },
    FULL_STACK_HYBRID: {
        name: 'Full-Stack Hybrid',
        tagline: 'You build and communicate effectively.',
        superpower: 'End-to-end ownership with solid execution and narrative.',
        risk: 'You can appear too general if focus is unclear.',
        lever: 'One flagship project with clear scope and outcomes.',
    },
    ML_ISH_APPLIED: {
        name: 'ML-ish Applied',
        tagline: 'You bridge ML and software execution.',
        superpower: 'Strong on retrieval, eval, and integration workflows.',
        risk: 'You may look abstract without readable artifacts.',
        lever: 'Notebook -> report -> production-style demo.',
    },
    OPERATOR: {
        name: 'Operator',
        tagline: 'You make AI useful and reliable.',
        superpower: 'Operational reliability, delivery consistency, process rigor.',
        risk: 'You need a standout artifact to differentiate.',
        lever: 'Operational playbook + polished micro-tool.',
    },
    EXPLORER: {
        name: 'Explorer',
        tagline: 'High potential, limited direction.',
        superpower: 'Curiosity and learning speed.',
        risk: 'You risk scattered work and a generic profile.',
        lever: 'Pick one role now and one proof project.',
    },
    SPECIALIST: {
        name: 'Specialist',
        tagline: 'Strong depth in one domain.',
        superpower: 'Recognizable expertise in a focused area.',
        risk: 'Mismatch on end-to-end roles without bridge skills.',
        lever: 'Add 1-2 bridge skills to widen fit.',
    },
}

const GAPS_EN: Record<string, Gap> = {
    GAP_PROOF: {
        id: 'GAP_PROOF',
        title: 'No public proof yet',
        whyBlocks: 'Without public artifacts, recruiters cannot verify your level.',
        fix7Days: 'Build one mini-tool and publish repo + clear README.',
        output: 'Public repo + README + demo link',
    },
    GAP_SHIPPING: {
        id: 'GAP_SHIPPING',
        title: '"Works on my machine" risk',
        whyBlocks: 'You cannot demonstrate production readiness.',
        fix7Days: 'Deploy to Vercel/Firebase/Render with env/secrets and basic logs.',
        output: 'Live HTTPS URL + env template',
    },
    GAP_GENAI_FOUNDATION: {
        id: 'GAP_GENAI_FOUNDATION',
        title: 'Fragmented GenAI fundamentals',
        whyBlocks: 'Core foundations are not stable for LLM app roles.',
        fix7Days: 'Ship one end-to-end RAG baseline with simple eval set.',
        output: 'Architecture note + small eval dataset',
    },
    GAP_EVAL_DATA: {
        id: 'GAP_EVAL_DATA',
        title: 'Missing quality measurement',
        whyBlocks: 'You cannot prove system quality objectively.',
        fix7Days: 'Create 20 benchmark queries + rubric + baseline metrics.',
        output: 'Eval sheet + score report',
    },
    GAP_ENGINEERING: {
        id: 'GAP_ENGINEERING',
        title: 'Weak engineering foundations',
        whyBlocks: 'Systems may not be maintainable or production-safe.',
        fix7Days: 'Build API + error handling + minimum tests + docs.',
        output: 'Backend repo with tests and usage docs',
    },
    GAP_STORY_SCOPE: {
        id: 'GAP_STORY_SCOPE',
        title: 'Unclear narrative of your work',
        whyBlocks: 'Your impact is hard to understand for evaluators.',
        fix7Days: 'Write a short case study (problem -> approach -> trade-offs -> results).',
        output: 'Public case-study page/README section',
    },
    GAP_QUALITY: {
        id: 'GAP_QUALITY',
        title: 'Missing quality standards',
        whyBlocks: 'Code quality appears below professional expectations.',
        fix7Days: 'Enable lint + formatter + unit tests on critical functions.',
        output: 'CI passing with test evidence',
    },
    GAP_DEPLOY: {
        id: 'GAP_DEPLOY',
        title: 'No cloud deployment',
        whyBlocks: 'No live artifact to validate execution capability.',
        fix7Days: 'Deploy and document runtime env + monitoring basics.',
        output: 'Live link + deploy guide',
    },
    GAP_NARRATIVE: {
        id: 'GAP_NARRATIVE',
        title: 'Strong tech but weak impact story',
        whyBlocks: 'Technical depth does not translate into perceived business impact.',
        fix7Days: 'Rewrite CV/README with decisions, trade-offs, and measurable impact.',
        output: 'Updated CV bullets + decision-focused README',
    },
    GAP_IMPLEMENTATION: {
        id: 'GAP_IMPLEMENTATION',
        title: 'Strong ideas but weak execution proof',
        whyBlocks: 'Good thinking is not backed by shipped evidence.',
        fix7Days: 'Build a working skeleton app and ship one core feature.',
        output: 'Working demo + repository',
    },
}

const RECOMMENDATIONS_EN: Record<ArchetypeId, RoleRecommendation> = {
    BUILDER: {
        now: 'LLM Apps Dev / RAG Dev',
        next: 'GenAI Engineer (Applied)',
        nowReasons: ['Strong execution and shipping behavior', 'End-to-end implementation capability', 'Solid technical baseline'],
        requirements: ['Live demo with RAG or agents', 'Architecture-focused README', 'CV bullets with metrics'],
    },
    DATA_DRIVEN: {
        now: 'Applied GenAI (Eval/RAG)',
        next: 'GenAI Engineer (Eval focus)',
        nowReasons: ['Metrics-first mindset', 'Objective evaluation capabilities', 'Strong data fundamentals'],
        requirements: ['Eval harness with results', 'Public benchmark report', 'Replicable notebook/demo'],
    },
    PRODUCT_MINDED: {
        now: 'AI Product Engineer (Junior)',
        next: 'GenAI Product Engineer',
        nowReasons: ['Strong problem framing and scope', 'User-value orientation', 'Clear trade-off communication'],
        requirements: ['Decision-oriented case study', 'Simple working demo', 'Impact-focused write-up'],
    },
    FULL_STACK_HYBRID: {
        now: 'GenAI Engineer (Junior)',
        next: 'GenAI Engineer (Mid)',
        nowReasons: ['Natural end-to-end ownership', 'Balanced technical + product judgment', 'Strong execution clarity'],
        requirements: ['One complete flagship project', 'Live demo + detailed README', 'Technical storytelling discipline'],
    },
    ML_ISH_APPLIED: {
        now: 'RAG Engineer / Applied GenAI',
        next: 'GenAI Engineer',
        nowReasons: ['Pipeline and integration strength', 'Strong data+code reasoning', 'Good fit for eval/retrieval workflows'],
        requirements: ['Documented pipeline repository', 'Metric-driven eval report', 'Working production-style demo'],
    },
    OPERATOR: {
        now: 'GenAI Solutions / Implementation',
        next: 'GenAI Engineer (after technical focus)',
        nowReasons: ['Reliable delivery behavior', 'Process and coordination strength', 'Operational consistency'],
        requirements: ['Documented playbook', 'Polished utility tool', 'Quantified results in CV'],
    },
    EXPLORER: {
        now: 'Start Track: pick one focused role',
        next: 'LLM Apps Dev / RAG Dev (after focus)',
        nowReasons: ['High curiosity and growth potential', 'Good adaptability', 'Strong learning capacity'],
        requirements: ['Pick one clear direction', 'Ship one complete project', 'Focused non-generic CV'],
    },
    SPECIALIST: {
        now: 'Bridge role near your strongest axis',
        next: 'More hybrid end-to-end profile',
        nowReasons: ['Recognizable depth in one area', 'Strong differentiator potential', 'Technical credibility'],
        requirements: ['Add 1-2 bridge skills', 'Public proof around your strength', 'Clear positioning statement'],
    },
}

const DIAGNOSIS_TEMPLATES_EN: Record<ArchetypeId, string> = {
    BUILDER: 'You are a **Pragmatic Builder**: strong execution, now convert it into **public proof**.',
    DATA_DRIVEN: 'You are **Data-Driven**: your edge is **measurement**; add a visible artifact (demo/report).',
    PRODUCT_MINDED: 'You are **Product-Minded**: strong prioritization, now prove **technical execution**.',
    FULL_STACK_HYBRID: 'You are **Full-Stack Hybrid**: natural end-to-end ownership; add focus with one flagship project.',
    ML_ISH_APPLIED: 'You are **ML-ish Applied**: strong data+code fit; push **eval + deployment** to increase credibility.',
    OPERATOR: 'You are an **Operator**: reliable and concrete; add one standout artifact to differentiate.',
    EXPLORER: 'You are an **Explorer**: high potential but low direction; pick one role and build one proof artifact.',
    SPECIALIST: 'You are a **Specialist**: deep in one axis; add bridge skills for broader GenAI role fit.',
}

// =============================================================================
// Next Steps Generation
// =============================================================================

function generateNextSteps(archetype: Archetype, gaps: Gap[]): string[] {
    const steps = [
        `Giorno 1-2: ${gaps[0]?.fix7Days || 'Definisci il tuo target role'}`,
        `Giorno 3-5: ${gaps[1]?.fix7Days || 'Costruisci la prima proof pubblica'}`,
        `Giorno 6-7: ${gaps[2]?.fix7Days || 'Aggiorna CV e LinkedIn'}`,
    ]
    return steps
}

function getLocalizedReadinessLabel(readiness: number, locale: RoleFitLocale): string {
    if (locale === 'en') {
        if (readiness < 45) return 'Not Ready Yet'
        if (readiness < 60) return 'Early Ready'
        if (readiness < 75) return 'Interview Ready'
        return 'Production Ready'
    }

    if (readiness < 45) return 'Non pronto'
    if (readiness < 60) return 'Pronto (base)'
    if (readiness < 75) return 'Pronto per colloqui'
    return 'Pronto per produzione'
}

function localizeAuditResult(result: AuditResult, locale: RoleFitLocale): AuditResult {
    if (locale === 'it') {
        return {
            ...result,
            readinessLabel: getLocalizedReadinessLabel(result.normalizedScores.readiness, 'it'),
        }
    }

    const archetypeEn = ARCHETYPES_EN[result.archetype.id]
    const roleRecommendation = RECOMMENDATIONS_EN[result.archetype.id]

    return {
        ...result,
        archetype: {
            ...result.archetype,
            name: archetypeEn.name,
            tagline: archetypeEn.tagline,
            superpower: archetypeEn.superpower,
            risk: archetypeEn.risk,
            lever: archetypeEn.lever,
        },
        roleRecommendation,
        topGaps: result.topGaps.map((gap) => GAPS_EN[gap.id] ?? gap),
        readinessLabel: getLocalizedReadinessLabel(result.normalizedScores.readiness, 'en'),
        oneLineDiagnosis: DIAGNOSIS_TEMPLATES_EN[result.archetype.id],
        nextSteps: [
            `Day 1-2: ${(GAPS_EN[result.topGaps[0]?.id]?.fix7Days) ?? 'Define your target role.'}`,
            `Day 3-5: ${(GAPS_EN[result.topGaps[1]?.id]?.fix7Days) ?? 'Build your first public proof artifact.'}`,
            `Day 6-7: ${(GAPS_EN[result.topGaps[2]?.id]?.fix7Days) ?? 'Update CV and LinkedIn with concrete outcomes.'}`,
        ],
    }
}

// =============================================================================
// Main Calculation Function
// =============================================================================

export function calculateAuditResult(answers: Record<string, number>, locale: RoleFitLocale = 'it'): AuditResult {
    const rawScores = calculateRawScores(answers)
    const normalizedScores = normalizeScores(rawScores)
    const archetype = determineArchetype(normalizedScores)
    const roleRecommendation = getRoleRecommendation(archetype, normalizedScores)
    const topGaps = identifyGaps(normalizedScores)
    const readinessLabel = getLocalizedReadinessLabel(normalizedScores.readiness, 'it')
    const oneLineDiagnosis = DIAGNOSIS_TEMPLATES[archetype.id]
    const nextSteps = generateNextSteps(archetype, topGaps)

    const result: AuditResult = {
        scores: rawScores,
        normalizedScores,
        archetype,
        roleRecommendation,
        topGaps,
        readinessLabel,
        oneLineDiagnosis,
        nextSteps,
    }

    return localizeAuditResult(result, locale)
}
