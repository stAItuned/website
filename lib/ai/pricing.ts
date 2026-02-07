
export interface ModelPricing {
    inputPer1M: number;
    outputPer1M: number;
    perRequest?: number;
}
export const PRICING: Record<string, ModelPricing> = {
    // Gemini 1.5 Pro (Standard context <= 128k)
    // Nota: Se il contesto supera 128k, i prezzi raddoppiano ($2.50 / $10.00)
    'gemini-3-pro-preview': {
        inputPer1M: 2.00,
        outputPer1M: 12.00
    },
    // Gemini 3 Flash (Preview)
    'gemini-3-flash-preview': {
        inputPer1M: 0.50,
        outputPer1M: 3.00
    },

    // --- GEMINI 2.5 (Stable / GA) ---

    // Gemini 2.5 Pro
    // Il prezzo $10.00 output è corretto per contesti standard (<= 200k).
    'gemini-2.5-pro': {
        inputPer1M: 1.25,
        outputPer1M: 10.00
    },
    // Gemini 2.5 Flash (Standard)
    // Attenzione: questo è più costoso del "Lite"
    'gemini-2.5-flash': {
        inputPer1M: 0.30,
        outputPer1M: 2.50
    },
    // Gemini 2.5 Flash-Lite
    // Questo corrisponde ai prezzi che avevi messo tu (0.10 / 0.40)
    'gemini-2.5-flash-lite': {
        inputPer1M: 0.10,
        outputPer1M: 0.40
    },
    // Perplexity Sonar Pro (llama-3.1-sonar-huge-128k-online)
    'sonar-pro': {
        inputPer1M: 3.00,
        outputPer1M: 15.00,
        perRequest: 0.005 // $5 per 1000 requests
    },
    // Perplexity Sonar (Small) (llama-3.1-sonar-small-128k-online)
    'sonar': {
        inputPer1M: 1.00, // Prezzo tipico per il modello small
        outputPer1M: 1.00,
        perRequest: 0.005
    },
    // Fallback perplexity
    'perplexity-default': {
        inputPer1M: 3.00,
        outputPer1M: 15.00,
        perRequest: 0.005
    },
    // Fallback gemini
    'gemini-default': {
        inputPer1M: 1.25,
        outputPer1M: 10.00
    }
};
