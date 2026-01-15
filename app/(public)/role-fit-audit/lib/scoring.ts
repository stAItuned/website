/**
 * Role Fit Audit - Scoring Logic
 * 
 * Calculates scores, determines archetype, and generates recommendations
 */

import { QUESTIONS, type Dimension } from './questions'

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

// =============================================================================
// Main Calculation Function
// =============================================================================

export function calculateAuditResult(answers: Record<string, number>): AuditResult {
    const rawScores = calculateRawScores(answers)
    const normalizedScores = normalizeScores(rawScores)
    const archetype = determineArchetype(normalizedScores)
    const roleRecommendation = getRoleRecommendation(archetype, normalizedScores)
    const topGaps = identifyGaps(normalizedScores)
    const readinessLabel = getReadinessLabel(normalizedScores.readiness)
    const oneLineDiagnosis = DIAGNOSIS_TEMPLATES[archetype.id]
    const nextSteps = generateNextSteps(archetype, topGaps)

    return {
        scores: rawScores,
        normalizedScores,
        archetype,
        roleRecommendation,
        topGaps,
        readinessLabel,
        oneLineDiagnosis,
        nextSteps,
    }
}
