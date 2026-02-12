interface ApiLikePayload {
  [key: string]: unknown
  error?: string
}

function tryParseJson<T extends ApiLikePayload>(raw: string): T | null {
  if (!raw.trim()) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Reads an API response once and returns either parsed JSON or raw text fallback.
 */
export async function readApiResponse<T extends ApiLikePayload>(response: Response): Promise<{
  json: T | null
  rawText: string
}> {
  const rawText = await response.text()
  const json = tryParseJson<T>(rawText)
  return { json, rawText }
}
