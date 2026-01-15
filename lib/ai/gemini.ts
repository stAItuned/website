/**
 * Gemini AI Client
 * 
 * Wrapper for Google's Generative AI SDK (Gemini 3 Pro)
 * Provides configured client and helpers for JSON mode responses
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

// =============================================================================
// Configuration
// =============================================================================

const API_KEY = process.env.GOOGLE_AI_API_KEY || ''

if (!API_KEY && process.env.NODE_ENV === 'production') {
    console.warn('[Gemini] GOOGLE_AI_API_KEY not set - AI features will fall back to static generation')
}

// =============================================================================
// Client Initialization
// =============================================================================

let genAI: GoogleGenerativeAI | null = null
let model: GenerativeModel | null = null

function getClient(): GoogleGenerativeAI {
    if (!genAI) {
        if (!API_KEY) {
            throw new Error('GOOGLE_AI_API_KEY is not configured')
        }
        genAI = new GoogleGenerativeAI(API_KEY)
    }
    return genAI
}

function getModel(): GenerativeModel {
    if (!model) {
        model = getClient().getGenerativeModel({
            model: 'gemini-3-pro-preview',
            generationConfig: {
                temperature: 0.4, // Slightly higher for more creative detailed reports
                topP: 0.8,
                maxOutputTokens: 8192, // Increased for detailed PDF content
            },
        })
    }
    return model
}

// =============================================================================
// Types
// =============================================================================

export interface GeminiResponse<T> {
    success: boolean
    data?: T
    error?: string
    rawResponse?: string
}

// =============================================================================
// JSON Generation Helper
// =============================================================================

/**
 * Generate a JSON response from Gemini
 * Parses the response and extracts JSON from markdown code blocks if needed
 */
export async function generateJSON<T>(prompt: string): Promise<GeminiResponse<T>> {
    try {
        const geminiModel = getModel()

        const result = await geminiModel.generateContent(prompt)
        const response = result.response
        const text = response.text()

        // Try to parse JSON from response
        // Gemini might wrap it in ```json ... ``` blocks
        let jsonString = text.trim()

        // Remove markdown code blocks if present
        const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonMatch) {
            jsonString = jsonMatch[1].trim()
        }

        // Parse JSON
        const data = JSON.parse(jsonString) as T

        return {
            success: true,
            data,
            rawResponse: text,
        }
    } catch (error) {
        console.error('------- GEMINI ERROR START -------')
        console.error('[Gemini] Model:', getModel().model)
        console.error('[Gemini] API Key set:', !!API_KEY)
        console.error('[Gemini] Error generating JSON:', error)
        console.error('------- GEMINI ERROR END -------')
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }

}

// =============================================================================
// Health Check
// =============================================================================

/**
 * Check if Gemini is properly configured and available
 */
export function isGeminiAvailable(): boolean {
    return !!API_KEY
}
