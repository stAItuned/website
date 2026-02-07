import { marked } from 'marked'
import { processMarkdownWithTOC } from '@/lib/markdown-headings'

/**
 * Server-side markdown rendering to HTML.
 * Uses the same logic as the client-side component but executed during build/ISR.
 */
export function renderMarkdownToHtml(markdown: string) {
    // Configure marked options same as client
    marked.setOptions({
        gfm: true,
        breaks: true,
    })

    // Process markdown to add heading IDs and get processed content
    const { processedMarkdown } = processMarkdownWithTOC(markdown)

    // Render to HTML
    const htmlContent = marked(processedMarkdown) as string

    // Wrap tables in responsive container (matching client behavior)
    return htmlContent
        .replace(/<table>/g, '<div class="table-wrapper"><table>')
        .replace(/<\/table>/g, '</table></div>')
}
