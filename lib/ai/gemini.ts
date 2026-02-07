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

function getModel(modelName?: string): GenerativeModel {
    // If we have a cached model AND it matches the requested name (or default if not requested), return it.
    // However, the google sdk client is lightweight, so re-creating the model instance object is cheap.
    // The heavyweight part is `genAI` client which is cached.

    // Default model if none specified
    const targetModel = modelName || 'gemini-2.5-flash';

    return getClient().getGenerativeModel({
        model: targetModel,
        generationConfig: {
            temperature: 0.4,
            topP: 0.8,
            maxOutputTokens: 8192,
        },
    })
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

import { logUsage, UsageLogContext } from './usage-logger';

/**
 * Generate a JSON response from Gemini
 * Parses the response and extracts JSON from markdown code blocks if needed
 */
export async function generateJSON<T>(prompt: string, context?: UsageLogContext, modelName?: string): Promise<GeminiResponse<T>> {
    try {
        const geminiModel = getModel(modelName)

        const result = await geminiModel.generateContent(prompt)
        const response = result.response
        const text = response.text()

        // Log usage if available
        if (result.response.usageMetadata) {
            const { promptTokenCount, candidatesTokenCount } = result.response.usageMetadata;
            // Run asynchronously to not block response
            logUsage(
                'gemini',
                geminiModel.model,
                promptTokenCount || 0,
                candidatesTokenCount || 0,
                context
            ).catch(err => console.error('[Gemini] Failed to log usage:', err));
        }

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
