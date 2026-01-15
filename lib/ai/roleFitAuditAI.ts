/**
 * Role Fit Audit - AI Generation Service
 * 
 * Uses Gemini 3 Pro to generate personalized audit reports
 * Falls back to static calculation if AI is unavailable
 */

import { generateJSON, isGeminiAvailable } from './gemini'
import { QUESTIONS, SECTIONS, ROLE_OPTIONS } from '@/app/(public)/role-fit-audit/lib/questions'
import { calculateAuditResult, type AuditResult, type Archetype, type Gap, type RoleRecommendation, type Scores } from '@/app/(public)/role-fit-audit/lib/scoring'
import { db } from '@/lib/firebase/admin'
import crypto from 'crypto'

// =============================================================================
// Types
// =============================================================================

export interface AIAuditResult extends AuditResult {
    generatedBy: 'ai' | 'static'
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

interface GeminiAuditResponse {
    scores: {
        code: number
        data: number
        product: number
        genai: number
        readiness: number
        proof: number
    }
    archetype: {
        id: string
        whyThisArchetype: string
        personalizedTagline: string
        personalizedSuperpower: string
        personalizedRisk: string
        personalizedLever: string
    }
    roleRecommendation: {
        now: string
        next: string
        nowRationale: string
        nextRationale: string
        nowReasons: string[]
        requirements: string[]
    }
    topGaps: Array<{
        id: string
        title: string
        whyBlocks: string
        fix7Days: string
        output: string
        personalizedAnalysis: string
        personalizedFix: string
    }>
    readinessLabel: string
    oneLineDiagnosis: string
    nextSteps: string[]
    coachingNote: string
    pdfAnalysis: {
        executiveSummary: string
        strengthsAnalysis: string
        weaknessesAnalysis: string
        careerStrategy: string
    }
}

// =============================================================================
// Archetype Definitions (for Gemini context)
// =============================================================================

const ARCHETYPES_CONTEXT = `
ARCHETIPI DISPONIBILI:
1. BUILDER - "Builder Pragmatico": Spedisci cose che funzionano. Superpower: Execution rapido, prototipi concreti.
2. DATA_DRIVEN - "Data-Driven": Misuri prima di credere. Superpower: Ragionamento per metriche, dataset, valutazione.
3. PRODUCT_MINDED - "Product-Minded": Sai cosa serve davvero all'utente. Superpower: Chiarezza sul problema, UX, scope.
4. FULL_STACK_HYBRID - "Full-Stack Hybrid": Costruisci e sai raccontarlo. Superpower: End-to-end ownership, velocità + chiarezza.
5. ML_ISH_APPLIED - "ML-ish Applied": Tra ML e software: l'incastro giusto. Superpower: Ottimo per pipeline, retrieval, eval.
6. OPERATOR - "Operator": Rendi l'AI utile, senza drama. Superpower: Affidabilità, delivery, organizzazione.
7. EXPLORER - "Explorer": Hai potenziale, ti manca direzione. Superpower: Curiosità, apprendimento rapido.
8. SPECIALIST - "Specialist": Forte in una cosa, da bilanciare. Superpower: Profondità reale in un'area specifica.
`

const GAPS_CONTEXT = `
GAP POSSIBILI (ID e descrizione):
- GAP_PROOF: Non hai evidenza pubblica (repo, demo, write-up)
- GAP_SHIPPING: "Works on my machine" - non sai mettere in produzione
- GAP_GENAI_FOUNDATION: GenAI conoscenza frammentata
- GAP_EVAL_DATA: Non misuri qualità dei sistemi
- GAP_ENGINEERING: Fondamenta engineering deboli
- GAP_STORY_SCOPE: Non sai raccontare cosa hai fatto
- GAP_QUALITY: Mancano test e standard
- GAP_DEPLOY: Niente cloud/deploy
- GAP_NARRATIVE: Sei tecnico ma sembri "solo dev"
- GAP_IMPLEMENTATION: Hai idee ma poca execution
`

const ROLES_CONTEXT = `
RUOLI GENAI POSSIBILI:
- LLM Apps Dev / RAG Dev
- GenAI Engineer (Junior/Mid)
- Applied GenAI (Eval focus)
- AI Product Engineer
- Solutions GenAI
- ML Engineer (Applied)
- Backend Developer con focus AI
`

const CAREER_OS_CONTEXT = `
IL PROGRAMMA "CAREER OS" DI STAITUNED:
È un percorso di 8 settimane per Software Engineer che vogliono passare all'AI Engineering.
Obiettivo: Portarti da "zero proof" a "Offer-Ready" con un portafoglio di progetti reali e una narrativa solida.

STRUTTURA E TIERS:

1. STARTER TRACK ("Credibile e Candidabile")
   - Focus: Fondamenta, Positioning, CV/LinkedIn, Authority Proof.
   - Adatto a chi: Ha bisogno di ordine, vuole candidarsi subito, ma non ha ancora progetti complessi.
   - Include: Role-fit, CV Master, LinkedIn rewrite, Job Feed (4w), Playbook W1-W4.
   - Output chiave: 1 Articolo tecnico "Authority Proof".

2. PRO TRACK ("Offer-Ready" - Il Core Business)
   - Focus: Costruzione "Flagship Project" reale, Eval, Interview Prep.
   - Adatto a chi: Vuole colmare il gap di PROOF e READINESS tecnica. Serve dimostrare di saper spedire AI in produzione.
   - Include: Tutto Starter + Supervised Vibe Coding (GCP/Firebase), Design Review progetto, Eval Kit, 1 Mock Interview con Senior, Job Feed (8w).
   - Output chiave: 1 Progetto End-to-End complesso (Flagship) + Eval Report.

3. ELITE TRACK ("Priorità + Continuità")
   - Focus: Execution assistita, SLA rapidi, supporto esteso.
   - Adatto a chi: Vuole accelerare al massimo con feedback prioritario e supporto continuo.
   - Include: Tutto Pro + Priority Lane (feedback in 24-48h), Mock extra, Article credits extra.

CONCETTI CHIAVE DA CITARE:
- "Flagship Project": Non un giocattolo, un'app AI reale deployata, con utenti, eval e documentazione engineering. (Week 6)
- "Supervised Vibe Coding": Metodologia per codare veloce con AI ma con architettura solida e review umane. (Week 5)
- "Authority Proof": Dimostrare competenza scrivendo (articolo tecnico) prima ancora di essere assunti. (Week 4)
- "Eval-First": Non basta che funzioni, devi misurarlo. (Week 5-6)

Il programma serve a colmare i gap di: 
- Proof (mancanza progetti -> Flagship Project in Pro)
- Narrative (non sapersi vendere -> Positioning & Authority in Starter)
- Readiness (colmare gap tecnici -> Vibe Coding & Eval in Pro)
- Interview (paura dei colloqui -> Mock Interview in Pro)
`

// =============================================================================
// Prompt Builder
// =============================================================================

function buildPrompt(answers: Record<string, number>, userName?: string): string {
    // Format answers with question context
    const formattedAnswers = QUESTIONS.map((q) => {
        const answerValue = answers[q.id]
        const selectedOption = q.options.find(o => o.value === answerValue)
        return `${q.id} (${q.sectionTitle}): "${q.question}"
   Risposta: ${selectedOption?.label || 'Non risposta'} (valore: ${answerValue ?? 'N/A'})`
    }).join('\n\n')

    const userContext = userName ? `Nome utente: ${userName}` : 'Utente anonimo'

    return `Sei un career coach esperto in ruoli GenAI/AI. Analizza le risposte di questo Role Fit Audit e genera un report personalizzato.

${userContext}

---
DOMANDE E RISPOSTE:
${formattedAnswers}

---
${ARCHETYPES_CONTEXT}

---
${GAPS_CONTEXT}

---
---
${ROLES_CONTEXT}

---
${CAREER_OS_CONTEXT}

---
ISTRUZIONI:
1. Calcola gli score (0-100) per ogni dimensione basandoti sulle risposte:
   - code: capacità di coding e engineering
   - data: competenze data/ML
   - product: mentalità product e comunicazione
   - genai: conoscenza sistemi GenAI (RAG, agents, prompting, ecc.)
   - readiness: prontezza generale (esperienza, pratiche, deploy)
   - proof: evidenza pubblica del lavoro

2. Determina l'archetipo più adatto e personalizza i suoi tratti:
   - ID: Scegli dall'elenco statico.
   - Tagline/Superpower/Risk/Lever: NON copiare le definizioni statiche. Riscrivile specificamente per questo utente.
     Esempio: Se il Builder statico ha come rischio "Senza narrativa...", ma questo utente ha già un blog, il rischio diventa "Hai narrativa ma ti manca proof tecnica profonda".
     Sii iper-specifico.

3. Identifica i top 3 gap critici.
   IMPORTANTE: Per ogni gap, nel campo 'personalizedFix', devi CITARE ESPLICITAMENTE quale parte del CAREER OS risolve quel problema (es. "Nella Week 3 del Career OS costruiamo proprio questo asset...", "Il Flagship Project della Week 6 serve a colmare questo gap...").
   Il report deve dimostrare coerenza tra il problema rilevato e la soluzione offerta dal programma.

4. Suggerisci ruoli NOW e NEXT con motivazione specifica.

5. Genera un piano 7 giorni concreto.

6. Scrivi una nota di coaching personale e motivazionale.
   IMPORTANTE: Se rilevi gap significativi che il Career OS può risolvere (specie su Proof, Narrative, Progetti Reali), menziona esplicitamente come il programma aiuterebbe in quel punto specifico (es. "Nella Week 6 del Career OS affronteremmo proprio questo..."). Sii consulenziale, non solo commerciale.

7. Genera una "PDF Deep Dive Analysis" per il report scaricabile:
   - executiveSummary: sintesi professionale del profilo (3-4 righe, tono formale)
   - strengthsAnalysis: analisi dettagliata dei punti di forza (4-5 righe)
   - weaknessesAnalysis: analisi onesta delle debolezze (4-5 righe)
   - careerStrategy: strategia di carriera a medio termine. Spiega come il percorso Career OS (Starter o Advanced) si inserisce in questa strategia per accelerare i risultati.

FORMATTAZIONE MARKDOWN:
- Usa **doppi asterischi** per evidenziare parole chiave importanti in TUTTI i campi testuali
- Esempi: "Hai **ottime basi tecniche** ma ti manca **proof pubblica**"
- Evidenzia: ruoli, skill chiave, gap critici, azioni specifiche, riferimenti al Career OS
- Non esagerare: 2-4 parole in grassetto per frase è l'ideale

RISPONDI SOLO con questo JSON (senza altri commenti):
{
  "scores": {
    "code": <0-100>,
    "data": <0-100>,
    "product": <0-100>,
    "genai": <0-100>,
    "readiness": <0-100>,
    "proof": <0-100>
  },
  "archetype": {
    "id": "<BUILDER|DATA_DRIVEN|PRODUCT_MINDED|FULL_STACK_HYBRID|ML_ISH_APPLIED|OPERATOR|EXPLORER|SPECIALIST>",
    "whyThisArchetype": "<spiegazione personalizzata 2-3 righe, usa **bold** per keyword>",
    "personalizedTagline": "<tagline breve e incisiva su misura>",
    "personalizedSuperpower": "<superpower specifico, usa **bold** per skill chiave>",
    "personalizedRisk": "<rischio specifico, usa **bold** per warning>",
    "personalizedLever": "<leva di crescita specifica, usa **bold** per azione>"
  },
  "roleRecommendation": {
    "now": "<ruolo suggerito ora>",
    "next": "<ruolo evoluzione>",
    "nowRationale": "<perché questo ruolo per te, 2-3 righe, usa **bold**>",
    "nextRationale": "<come arrivarci, 2-3 righe, usa **bold**>",
    "nowReasons": ["<motivo 1>", "<motivo 2>", "<motivo 3>"],
    "requirements": ["<requisito 1>", "<requisito 2>", "<requisito 3>"]
  },
  "topGaps": [
    {
      "id": "<GAP_ID>",
      "title": "<titolo gap>",
      "whyBlocks": "<perché blocca, usa **bold** per impatto>",
      "fix7Days": "<fix in 7 giorni>",
      "output": "<output atteso>",
      "personalizedAnalysis": "<analisi specifica, usa **bold** per insight chiave>",
      "personalizedFix": "<consiglio personalizzato, usa **bold** per azioni e riferimenti Career OS>"
    }
  ],
  "readinessLabel": "<Not Ready Yet|Early Ready|Interview Ready|Production Ready>",
  "oneLineDiagnosis": "<diagnosi in 1-2 righe, usa **bold** per enfasi su punti chiave>",
  "nextSteps": [
    "Giorno 1-2: <azione specifica con **keyword** in bold>",
    "Giorno 3-5: <azione specifica con **keyword** in bold>",
    "Giorno 6-7: <azione specifica con **keyword** in bold>"
  ],
  "coachingNote": "<nota personale motivazionale 3-4 righe, usa **bold** per punti salienti>",
  "pdfAnalysis": {
    "executiveSummary": "<sintesi profilo con **keyword** in bold>",
    "strengthsAnalysis": "<analisi punti forza con **keyword** in bold>",
    "weaknessesAnalysis": "<analisi debolezze con **keyword** in bold>",
    "careerStrategy": "<strategia carriera con **keyword** in bold>"
  }
}`
}

// =============================================================================
// Archetype Lookup (for static data)
// =============================================================================

const ARCHETYPE_STATIC_DATA: Record<string, Omit<Archetype, 'id'>> = {
    BUILDER: {
        name: 'Builder Pragmatico',
        tagline: 'Spedisci cose che funzionano.',
        superpower: 'Execution rapido, prototipi concreti, shipping.',
        risk: 'Senza narrativa e proof, sembri "solo dev".',
        lever: 'Demo live + README con architettura.',
    },
    DATA_DRIVEN: {
        name: 'Data-Driven',
        tagline: 'Misuri prima di credere.',
        superpower: 'Ragionamento per metriche, dataset, valutazione; ottimo su eval.',
        risk: 'Ti blocchi in analisi, poca prova "visibile" (demo/link).',
        lever: 'Report + eval harness (anche semplice) con risultati.',
    },
    PRODUCT_MINDED: {
        name: 'Product-Minded',
        tagline: 'Sai cosa serve davvero all\'utente.',
        superpower: 'Chiarezza sul problema, UX, scope, priorità.',
        risk: 'Senza proof tecnica rischi di sembrare "PM che parla".',
        lever: 'Case study con decisioni + demo semplice.',
    },
    FULL_STACK_HYBRID: {
        name: 'Full-Stack Hybrid',
        tagline: 'Costruisci e sai raccontarlo.',
        superpower: 'End-to-end ownership, velocità + chiarezza.',
        risk: 'Dispersione; se non scegli un ruolo, sembri generalista.',
        lever: '1 flagship project con scope chiaro (non 3 mini-progetti).',
    },
    ML_ISH_APPLIED: {
        name: 'ML-ish Applied',
        tagline: 'Tra ML e software: l\'incastro giusto.',
        superpower: 'Ottimo per pipeline, retrieval, eval, integrazione.',
        risk: 'Puoi cadere nel "tecnico astratto" senza output leggibile.',
        lever: 'Notebook → Report → Demo (trasformare in asset).',
    },
    OPERATOR: {
        name: 'Operator',
        tagline: 'Rendi l\'AI utile, senza drama.',
        superpower: 'Affidabilità, delivery, organizzazione, processi.',
        risk: 'Senza un "pezzo wow" non emergi.',
        lever: 'Playbook + small tool live (anche piccolo, ma polished).',
    },
    EXPLORER: {
        name: 'Explorer',
        tagline: 'Hai potenziale, ti manca direzione.',
        superpower: 'Curiosità, apprendimento rapido.',
        risk: 'Fai tutto e niente; CV generico, portfolio random.',
        lever: 'Scegliere 1 ruolo NOW + 1 progetto.',
    },
    SPECIALIST: {
        name: 'Specialist',
        tagline: 'Forte in una cosa, da bilanciare.',
        superpower: 'Profondità reale in un\'area specifica.',
        risk: 'Mismatch con ruoli end-to-end se mancano le basi degli altri assi.',
        lever: '"Bridge skills" minime per bilanciare il profilo.',
    },
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Generate AI-powered audit result
 * Falls back to static calculation if AI is unavailable or fails
 */
export async function generateAIAuditResult(
    answers: Record<string, number>,
    userName?: string
): Promise<AIAuditResult> {
    // -------------------------------------------------------------------------
    // 1. Check Cache
    // -------------------------------------------------------------------------
    let answersHash: string | null = null
    try {
        // Deterministic hash of answers
        answersHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(answers, Object.keys(answers).sort()))
            .digest('hex')

        const cacheDoc = await db().collection('role_fit_audit_ai_cache_v4').doc(answersHash).get()
        if (cacheDoc.exists) {
            console.log('[RoleFitAudit AI] ⚡️ Cache Hit! Returning cached result.')
            const cachedData = cacheDoc.data() as AIAuditResult
            // Return cached result but ensure generatedBy is 'ai' (it should be)
            return { ...cachedData, generatedBy: 'ai' }
        }
    } catch (e) {
        console.warn('[RoleFitAudit AI] Cache lookup failed:', e)
        // Proceed to generation
    }

    // -------------------------------------------------------------------------
    // 2. Check Gemini Availability
    // -------------------------------------------------------------------------
    if (!isGeminiAvailable()) {
        console.log('[RoleFitAudit AI] ⚠️ Gemini is NOT available (API Key missing). Using static fallback.')
        return {
            ...calculateAuditResult(answers),
            generatedBy: 'static',
        }
    }

    try {
        console.log('[RoleFitAudit AI] 🚀 Starting Gemini generation...')
        const prompt = buildPrompt(answers, userName)

        const response = await generateJSON<GeminiAuditResponse>(prompt)

        if (!response.success || !response.data) {
            console.error('[RoleFitAudit AI] ❌ Gemini generation failed. Reason:', response.error)
            console.log('[RoleFitAudit AI] ↩️ Falling back to static calculation')
            return {
                ...calculateAuditResult(answers),
                generatedBy: 'static',
            }
        }

        const aiData = response.data
        console.log('[RoleFitAudit AI] ✅ Gemini report generated successfully!')

        // Build the result from AI response
        const archetypeId = aiData.archetype.id as keyof typeof ARCHETYPE_STATIC_DATA
        const archetypeStatic = ARCHETYPE_STATIC_DATA[archetypeId] || ARCHETYPE_STATIC_DATA.EXPLORER

        // Construct archetype with AI-enhanced fields
        const archetype: Archetype = {
            id: archetypeId as Archetype['id'],
            name: archetypeStatic.name, // Keep name static for consistency
            tagline: aiData.archetype.personalizedTagline || archetypeStatic.tagline,
            superpower: aiData.archetype.personalizedSuperpower || archetypeStatic.superpower,
            risk: aiData.archetype.personalizedRisk || archetypeStatic.risk,
            lever: aiData.archetype.personalizedLever || archetypeStatic.lever,
        }

        const roleRecommendation: RoleRecommendation = {
            now: aiData.roleRecommendation.now,
            next: aiData.roleRecommendation.next,
            nowReasons: aiData.roleRecommendation.nowReasons,
            requirements: aiData.roleRecommendation.requirements,
        }

        const topGaps: Gap[] = aiData.topGaps.map(gap => ({
            id: gap.id,
            title: gap.title,
            whyBlocks: gap.whyBlocks,
            fix7Days: gap.fix7Days,
            output: gap.output,
        }))

        const normalizedScores: Scores = {
            code: Math.min(100, Math.max(0, aiData.scores.code)),
            data: Math.min(100, Math.max(0, aiData.scores.data)),
            product: Math.min(100, Math.max(0, aiData.scores.product)),
            genai: Math.min(100, Math.max(0, aiData.scores.genai)),
            readiness: Math.min(100, Math.max(0, aiData.scores.readiness)),
            proof: Math.min(100, Math.max(0, aiData.scores.proof)),
        }

        const result: AIAuditResult = {
            scores: normalizedScores, // AI calculates normalized directly
            normalizedScores,
            archetype,
            roleRecommendation,
            topGaps,
            readinessLabel: aiData.readinessLabel,
            oneLineDiagnosis: aiData.oneLineDiagnosis,
            nextSteps: aiData.nextSteps,
            generatedBy: 'ai',
            aiEnhancements: {
                whyThisArchetype: aiData.archetype.whyThisArchetype,
                nowRationale: aiData.roleRecommendation.nowRationale,
                nextRationale: aiData.roleRecommendation.nextRationale,
                personalizedGaps: aiData.topGaps.map(gap => ({
                    id: gap.id,
                    personalizedAnalysis: gap.personalizedAnalysis,
                    personalizedFix: gap.personalizedFix,
                })),
                coachingNote: aiData.coachingNote,
                pdfAnalysis: aiData.pdfAnalysis,
            },
        }

        // -------------------------------------------------------------------------
        // 3. Save to Cache
        // -------------------------------------------------------------------------
        if (answersHash) {
            try {
                // Save asynchronously, don't block return
                db().collection('role_fit_audit_ai_cache_v4').doc(answersHash).set({
                    ...result,
                    cachedAt: new Date().toISOString()
                }).catch((err: any) => console.error('[RoleFitAudit AI] Failed to save cache:', err))
            } catch (e) {
                console.warn('[RoleFitAudit AI] Cache save setup failed:', e)
            }
        }

        return result

    } catch (error) {
        console.error('[RoleFitAudit AI] Unexpected error:', error)
        return {
            ...calculateAuditResult(answers),
            generatedBy: 'static',
        }
    }
}
