/**
 * Convert rich text/markup snippets (HTML/Markdown) into a clean single-line preview.
 */
export function toPreviewText(value: string | null | undefined, maxLength = 220): string {
  if (!value) return ''

  const decoded = decodeHtmlEntities(value)

  const normalized = decoded
    // Remove HTML tags like <p>, <b>, <div>, etc.
    .replace(/<[^>]+>/g, ' ')
    // Convert markdown links [label](url) -> label
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    // Remove common markdown formatting markers
    .replace(/[*_`~>#-]+/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trimEnd()}...`
}

function decodeHtmlEntities(input: string): string {
  const namedEntityMap: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
  }

  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    const lower = entity.toLowerCase()
    if (lower in namedEntityMap) {
      return namedEntityMap[lower]
    }

    if (lower.startsWith('#x')) {
      const code = Number.parseInt(lower.slice(2), 16)
      return Number.isNaN(code) ? match : String.fromCodePoint(code)
    }

    if (lower.startsWith('#')) {
      const code = Number.parseInt(lower.slice(1), 10)
      return Number.isNaN(code) ? match : String.fromCodePoint(code)
    }

    return match
  })
}
