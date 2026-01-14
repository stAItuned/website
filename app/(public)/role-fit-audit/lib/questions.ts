/**
 * Role Fit Audit - Questions Configuration
 * 
 * 20 questions across 5 sections, mapping to 6 scoring dimensions:
 * - Code (0-100)
 * - Data (0-100)
 * - Product (0-100)
 * - GenAI Systems (0-100)
 * - Readiness (0-100)
 * - Proof (0-100)
 */

// =============================================================================
// Types
// =============================================================================

export interface QuestionOption {
    label: string
    value: number
    /** Points to add to each dimension */
    scoring: Partial<Record<Dimension, number>>
}

export interface Question {
    id: string
    section: number
    sectionTitle: string
    question: string
    helpText?: string
    options: QuestionOption[]
}

export type Dimension = 'code' | 'data' | 'product' | 'genai' | 'readiness' | 'proof'

// =============================================================================
// Questions Configuration
// =============================================================================

export const SECTIONS = [
    { id: 1, title: 'Profilo & Obiettivo', icon: '👤' },
    { id: 2, title: 'Engineering', icon: '⚙️' },
    { id: 3, title: 'Data & ML', icon: '📊' },
    { id: 4, title: 'Product & Comunicazione', icon: '💡' },
    { id: 5, title: 'GenAI Systems & Proof', icon: '🤖' },
]

export const ROLE_OPTIONS = [
    'LLM Apps Dev',
    'RAG Dev',
    'GenAI Engineer',
    'Applied GenAI (Eval)',
    'AI Product Engineer',
    'Solutions GenAI',
    'Non lo so ancora',
]

export const QUESTIONS: Question[] = [
    // ==========================================================================
    // Section 1: Profilo & Obiettivo (Q1-Q2)
    // ==========================================================================
    {
        id: 'Q1',
        section: 1,
        sectionTitle: 'Profilo & Obiettivo',
        question: 'Quanti anni di esperienza hai in ambito dev/data?',
        options: [
            { label: '0 (studente/no esperienza)', value: 0, scoring: { readiness: 0 } },
            { label: '1 anno', value: 1, scoring: { readiness: 1 } },
            { label: '2-3 anni', value: 2, scoring: { readiness: 2 } },
            { label: '4-5 anni', value: 3, scoring: { readiness: 3 } },
            { label: '6+ anni', value: 4, scoring: { readiness: 4 } },
        ],
    },
    {
        id: 'Q2',
        section: 1,
        sectionTitle: 'Profilo & Obiettivo',
        question: 'Nei prossimi 3 mesi, qual è il ruolo GenAI che vuoi puntare?',
        helpText: 'Questa risposta viene usata solo per personalizzare i consigli, non influisce sullo score.',
        options: ROLE_OPTIONS.map((role, i) => ({
            label: role,
            value: i,
            scoring: {}, // Does not affect score
        })),
    },

    // ==========================================================================
    // Section 2: Engineering (Q3-Q7) → Code
    // ==========================================================================
    {
        id: 'Q3',
        section: 2,
        sectionTitle: 'Engineering',
        question: 'Quanto ti senti solido/a a scrivere codice "senza tutorial" (feature vere, non esercizi)?',
        options: [
            { label: 'Non mi sento per niente solido', value: 0, scoring: { code: 0 } },
            { label: 'Solo cose semplici', value: 1, scoring: { code: 1 } },
            { label: 'Abbastanza, ma devo cercare spesso', value: 2, scoring: { code: 2 } },
            { label: 'Bene, riesco a costruire feature complete', value: 3, scoring: { code: 3 } },
            { label: 'Molto solido, anche architettura e qualità', value: 4, scoring: { code: 4 } },
        ],
    },
    {
        id: 'Q4',
        section: 2,
        sectionTitle: 'Engineering',
        question: 'Quanta esperienza hai con backend/API (anche semplici)?',
        options: [
            { label: 'Mai fatto', value: 0, scoring: { code: 0 } },
            { label: 'Solo progetti toy/tutorial', value: 1, scoring: { code: 1 } },
            { label: 'API semplici (CRUD base)', value: 2, scoring: { code: 2 } },
            { label: 'API in produzione con auth/db', value: 3, scoring: { code: 3, readiness: 1 } },
            { label: 'Prod + scaling/monitoring', value: 4, scoring: { code: 4, readiness: 2 } },
        ],
    },
    {
        id: 'Q5',
        section: 2,
        sectionTitle: 'Engineering',
        question: 'Quanto sei a tuo agio a costruire una UI "presentabile" (anche minimale)?',
        options: [
            { label: 'Non faccio frontend', value: 0, scoring: { code: 0, product: 0 } },
            { label: 'Copio template/tutorial', value: 1, scoring: { code: 1, product: 1 } },
            { label: 'Costruisco UI funzionali', value: 2, scoring: { code: 1, product: 1 } },
            { label: 'UI polished e responsive', value: 3, scoring: { code: 2, product: 2 } },
            { label: 'Design system + UX thinking', value: 4, scoring: { code: 2, product: 2 } },
        ],
    },
    {
        id: 'Q6',
        section: 2,
        sectionTitle: 'Engineering',
        question: 'Come lavori di solito con Git?',
        options: [
            { label: 'Non uso git', value: 0, scoring: { readiness: 0 } },
            { label: 'Solo commit base', value: 1, scoring: { readiness: 1 } },
            { label: 'Branch + PR', value: 2, scoring: { readiness: 2, code: 1 } },
            { label: 'PR + code review', value: 3, scoring: { readiness: 3, code: 1 } },
            { label: 'PR + CI + release process', value: 4, scoring: { readiness: 4, code: 2 } },
        ],
    },
    {
        id: 'Q7',
        section: 2,
        sectionTitle: 'Engineering',
        question: 'Quanto usi test e pratiche di qualità nel tuo codice?',
        options: [
            { label: 'Mai', value: 0, scoring: { readiness: 0 } },
            { label: 'Sporadico/quando ho tempo', value: 1, scoring: { readiness: 1 } },
            { label: 'Unit test base', value: 2, scoring: { readiness: 2, code: 1 } },
            { label: 'Unit + integration test', value: 3, scoring: { readiness: 3, code: 2 } },
            { label: 'Test + lint + quality gates', value: 4, scoring: { readiness: 4, code: 2 } },
        ],
    },

    // ==========================================================================
    // Section 3: Data/ML (Q8-Q10) → Data
    // ==========================================================================
    {
        id: 'Q8',
        section: 3,
        sectionTitle: 'Data & ML',
        question: 'Quanto sei a tuo agio con SQL e data wrangling?',
        options: [
            { label: 'Non conosco SQL', value: 0, scoring: { data: 0 } },
            { label: 'Query base (SELECT, WHERE)', value: 1, scoring: { data: 1 } },
            { label: 'JOIN, aggregazioni, subquery', value: 2, scoring: { data: 2 } },
            { label: 'Query complesse + ottimizzazione', value: 3, scoring: { data: 3 } },
            { label: 'Expert level + pipeline ETL', value: 4, scoring: { data: 4 } },
        ],
    },
    {
        id: 'Q9',
        section: 3,
        sectionTitle: 'Data & ML',
        question: 'Qual è il tuo livello sui fondamentali ML?',
        helpText: 'Overfitting, bias/variance, embeddings, cosine similarity, ecc.',
        options: [
            { label: 'Non li conosco', value: 0, scoring: { data: 0 } },
            { label: 'Conosco le definizioni base', value: 1, scoring: { data: 1 } },
            { label: 'Ho fatto training base', value: 2, scoring: { data: 2 } },
            { label: 'So usare metriche + CV + debug', value: 3, scoring: { data: 3 } },
            { label: 'Li ho applicati in progetti reali', value: 4, scoring: { data: 4 } },
        ],
    },
    {
        id: 'Q10',
        section: 3,
        sectionTitle: 'Data & ML',
        question: 'Come gestisci esperimenti e misurazione della qualità?',
        options: [
            { label: 'Non misuro', value: 0, scoring: { data: 0 } },
            { label: 'Qualitativo/a sentimento', value: 1, scoring: { data: 1 } },
            { label: 'Metriche base su un set di test', value: 2, scoring: { data: 2 } },
            { label: 'A/B test o eval strutturata', value: 3, scoring: { data: 3, readiness: 1 } },
            { label: 'Eval harness ripetibile + regressioni', value: 4, scoring: { data: 4, readiness: 2 } },
        ],
    },

    // ==========================================================================
    // Section 4: Product & Comunicazione (Q11-Q13) → Product
    // ==========================================================================
    {
        id: 'Q11',
        section: 4,
        sectionTitle: 'Product & Comunicazione',
        question: 'Come gestisci un problema vago o ambiguo?',
        helpText: 'Es: "migliora il supporto clienti"',
        options: [
            { label: 'Mi blocco senza requisiti chiari', value: 0, scoring: { product: 0 } },
            { label: 'Chiedo chiarimenti e procedo', value: 1, scoring: { product: 1 } },
            { label: 'Trasformo in spec (target, scope)', value: 2, scoring: { product: 2 } },
            { label: 'Spec + metriche + rischi', value: 3, scoring: { product: 3 } },
            { label: 'Spec + tradeoff + piano delivery', value: 4, scoring: { product: 4 } },
        ],
    },
    {
        id: 'Q12',
        section: 4,
        sectionTitle: 'Product & Comunicazione',
        question: 'Quanto pensi al valore utente e allo scope quando costruisci?',
        options: [
            { label: 'Faccio quello che mi dicono', value: 0, scoring: { product: 0 } },
            { label: 'Penso al risultato finale', value: 1, scoring: { product: 1 } },
            { label: 'Definisco chi usa e perché', value: 2, scoring: { product: 2 } },
            { label: 'MVP + iterazione + feedback', value: 3, scoring: { product: 3 } },
            { label: 'User research + metriche impatto', value: 4, scoring: { product: 4 } },
        ],
    },
    {
        id: 'Q13',
        section: 4,
        sectionTitle: 'Product & Comunicazione',
        question: 'Quanto sei forte nella comunicazione scritta (doc, README, write-up)?',
        options: [
            { label: 'Evito di scrivere', value: 0, scoring: { product: 0, readiness: 0 } },
            { label: 'Scrivo, ma disorganizzato', value: 1, scoring: { product: 1, readiness: 1 } },
            { label: 'README base, funzionale', value: 2, scoring: { product: 1, readiness: 2 } },
            { label: 'README + decision log', value: 3, scoring: { product: 2, readiness: 3 } },
            { label: 'Write-up chiaro con trade-off', value: 4, scoring: { product: 2, readiness: 4 } },
        ],
    },

    // ==========================================================================
    // Section 5: GenAI Systems + Proof (Q14-Q20) → GenAI, Readiness, Proof
    // ==========================================================================
    {
        id: 'Q14',
        section: 5,
        sectionTitle: 'GenAI Systems & Proof',
        question: 'Hai esperienza pratica con RAG (retrieval augmented generation)?',
        options: [
            { label: 'Mai fatto', value: 0, scoring: { genai: 0 } },
            { label: 'Ho seguito un tutorial', value: 1, scoring: { genai: 1 } },
            { label: 'Progetto toy con chunking + retrieval', value: 2, scoring: { genai: 2 } },
            { label: 'RAG con embeddings + reranking', value: 3, scoring: { genai: 3 } },
            { label: 'RAG + eval + guardrails', value: 4, scoring: { genai: 4 } },
        ],
    },
    {
        id: 'Q15',
        section: 5,
        sectionTitle: 'GenAI Systems & Proof',
        question: 'Come gestisci prompting e structured outputs?',
        options: [
            { label: 'Prompt "a caso"', value: 0, scoring: { genai: 0 } },
            { label: 'Prompt template base', value: 1, scoring: { genai: 1 } },
            { label: 'Template + few-shot', value: 2, scoring: { genai: 2 } },
            { label: 'CoT + structured output (JSON)', value: 3, scoring: { genai: 3 } },
            { label: 'Prompt versioning + A/B testing', value: 4, scoring: { genai: 4 } },
        ],
    },
    {
        id: 'Q16',
        section: 5,
        sectionTitle: 'GenAI Systems & Proof',
        question: 'Hai esperienza con agents e tool calling?',
        options: [
            { label: 'No', value: 0, scoring: { genai: 0 } },
            { label: 'Ho letto/visto demo', value: 1, scoring: { genai: 1 } },
            { label: 'Progetto toy con 1-2 tools', value: 2, scoring: { genai: 2 } },
            { label: 'Agent con fallback e loop control', value: 3, scoring: { genai: 3 } },
            { label: 'Agent + observability + guardrails', value: 4, scoring: { genai: 4 } },
        ],
    },
    {
        id: 'Q17',
        section: 5,
        sectionTitle: 'GenAI Systems & Proof',
        question: 'Come valuti la qualità di un sistema GenAI?',
        options: [
            { label: 'A sentimento', value: 0, scoring: { genai: 0, readiness: 0 } },
            { label: 'Testo io manualmente', value: 1, scoring: { genai: 1, readiness: 1 } },
            { label: 'Dataset di test + metriche base', value: 2, scoring: { genai: 2, readiness: 2 } },
            { label: 'Eval suite con golden set', value: 3, scoring: { genai: 3, readiness: 3 } },
            { label: 'Eval + regression + cost tracking', value: 4, scoring: { genai: 4, readiness: 4 } },
        ],
    },
    {
        id: 'Q18',
        section: 5,
        sectionTitle: 'GenAI Systems & Proof',
        question: 'Quanta esperienza hai con deploy (cloud, env, secrets)?',
        options: [
            { label: 'Mai deployato', value: 0, scoring: { genai: 0, readiness: 0 } },
            { label: 'Deploy manuale occasionale', value: 1, scoring: { genai: 1, readiness: 1 } },
            { label: 'Deploy con env vars + secrets', value: 2, scoring: { genai: 1, readiness: 2 } },
            { label: 'CI/CD + staging + prod', value: 3, scoring: { genai: 2, readiness: 3 } },
            { label: 'CI/CD + monitoring + cost awareness', value: 4, scoring: { genai: 2, readiness: 4 } },
        ],
    },
    {
        id: 'Q19',
        section: 5,
        sectionTitle: 'GenAI Systems & Proof',
        question: 'Quanto consideri security, PII e cost control nelle app GenAI?',
        options: [
            { label: 'Mai pensato', value: 0, scoring: { genai: 0, readiness: 0 } },
            { label: 'So che esistono', value: 1, scoring: { genai: 1, readiness: 1 } },
            { label: 'Li gestisco in modo base', value: 2, scoring: { genai: 1, readiness: 2 } },
            { label: 'Token limit + caching + sanitization', value: 3, scoring: { genai: 2, readiness: 3 } },
            { label: 'Full security + abuse protection + budget', value: 4, scoring: { genai: 2, readiness: 4 } },
        ],
    },
    {
        id: 'Q20',
        section: 5,
        sectionTitle: 'GenAI Systems & Proof',
        question: 'Quanta evidenza pubblica hai oggi (repo, demo, write-up)?',
        options: [
            { label: 'Nulla di pubblico', value: 0, scoring: { proof: 0, readiness: 0 } },
            { label: '1 repo incompleto/privato', value: 1, scoring: { proof: 1, readiness: 1 } },
            { label: '1 repo pubblico decente', value: 2, scoring: { proof: 2, readiness: 2 } },
            { label: 'Repo + README + demo hostata', value: 3, scoring: { proof: 3, readiness: 3 } },
            { label: 'Demo live + eval report + write-up', value: 4, scoring: { proof: 4, readiness: 4 } },
        ],
    },
]

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get questions for a specific section
 */
export function getQuestionsForSection(sectionId: number): Question[] {
    return QUESTIONS.filter((q) => q.section === sectionId)
}

/**
 * Get the maximum possible score for each dimension
 */
export function getMaxScores(): Record<Dimension, number> {
    const maxScores: Record<Dimension, number> = {
        code: 0,
        data: 0,
        product: 0,
        genai: 0,
        readiness: 0,
        proof: 0,
    }

    for (const question of QUESTIONS) {
        // Find the highest scoring option for each dimension
        for (const option of question.options) {
            for (const [dim, points] of Object.entries(option.scoring)) {
                const dimension = dim as Dimension
                // For max scores, we add up the max from each question
                const currentMax = Math.max(...question.options.map((o) => o.scoring[dimension] || 0))
                if (maxScores[dimension] < currentMax) {
                    // Only count once per question
                }
            }
        }
    }

    // Calculate actual max scores based on question structure
    // Code: Q3(4) + Q4(4) + Q5(2) + Q6(2) + Q7(2) = 14
    // Data: Q8(4) + Q9(4) + Q10(4) = 12
    // Product: Q5(2) + Q11(4) + Q12(4) + Q13(2) = 12
    // GenAI: Q14(4) + Q15(4) + Q16(4) + Q17(4) + Q18(2) + Q19(2) = 20
    // Readiness: Q1(4) + Q4(2) + Q6(4) + Q7(4) + Q10(2) + Q13(4) + Q17(4) + Q18(4) + Q19(4) + Q20(4) = 36
    // Proof: Q20(4) = 4

    return {
        code: 14,
        data: 12,
        product: 12,
        genai: 20,
        readiness: 36,
        proof: 4,
    }
}
