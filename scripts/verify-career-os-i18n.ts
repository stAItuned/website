import { careerOSTranslations } from '../lib/i18n/career-os-translations'

const PLACEHOLDER_PATTERNS = [/\[TODO\]/i, /\bTBD\b/i, /\bTODO\b/i, /^\s*\.{3}\s*$/]

function flatten(value: unknown, path: string[] = []): Array<{ path: string; value: unknown }> {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flatten(item, [...path, String(index)]))
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nestedValue]) => flatten(nestedValue, [...path, key]))
  }

  return [{ path: path.join('.'), value }]
}

export function verifyCareerOSI18nParity(): { ok: boolean; issues: string[] } {
  const issues: string[] = []

  const it = flatten(careerOSTranslations.it)
  const en = flatten(careerOSTranslations.en)

  const itMap = new Map(it.map((entry) => [entry.path, entry.value]))
  const enMap = new Map(en.map((entry) => [entry.path, entry.value]))

  for (const path of itMap.keys()) {
    if (!enMap.has(path)) {
      issues.push(`Missing key in en: ${path}`)
    }
  }

  for (const path of enMap.keys()) {
    if (!itMap.has(path)) {
      issues.push(`Missing key in it: ${path}`)
    }
  }

  for (const [path, value] of itMap) {
    if (!enMap.has(path)) continue

    if (typeof value === 'string') {
      const enValue = enMap.get(path)
      if (typeof enValue !== 'string') {
        issues.push(`Type mismatch at ${path}: it=string, en=${typeof enValue}`)
        continue
      }

      if (value.trim().length === 0) {
        issues.push(`Empty string in it at ${path}`)
      }

      if (enValue.trim().length === 0) {
        issues.push(`Empty string in en at ${path}`)
      }

      if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value))) {
        issues.push(`Placeholder-like string in it at ${path}: "${value}"`)
      }

      if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(enValue))) {
        issues.push(`Placeholder-like string in en at ${path}: "${enValue}"`)
      }
    }
  }

  return { ok: issues.length === 0, issues }
}

const isDirectExecution =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1]?.includes('verify-career-os-i18n')

if (isDirectExecution) {
  const result = verifyCareerOSI18nParity()

  if (!result.ok) {
    console.error('[career-os-i18n] parity check failed')
    for (const issue of result.issues) {
      console.error(`- ${issue}`)
    }
    process.exit(1)
  }

  console.log('[career-os-i18n] parity check passed')
}
