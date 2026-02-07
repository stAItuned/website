
import { dbDefault } from '@/lib/firebase/admin'

/**
 * Fetches the configured Gemini model ID from Firestore.
 * Caching could be added here if performance becomes an issue.
 */
export async function getConfiguredGeminiModel(): Promise<string> {
    try {
        const snapshot = await dbDefault().collection('config').doc('ai_settings').get()
        if (snapshot.exists) {
            const data = snapshot.data()
            if (data?.geminiModel) {
                return data.geminiModel as string
            }
        }
    } catch (e) {
        console.warn('Failed to fetch AI config, using default', e)
    }
    // Default fallback
    return 'gemini-2.5-flash'
}
