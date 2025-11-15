import GithubSlugger from 'github-slugger';

function removeManualTOC(markdown: string) {
  return markdown.replace(/##\s+Table of contents[\s\S]*?(?=\n##\s+|$)/i, '\n').replace(/\n{3,}/g, '\n\n');
}

export function processMarkdownWithTOC(markdown: string) {
  const toc: Array<{ level: number; text: string; slug: string }> = [];
  const slugger = new GithubSlugger();
  const sanitizedMarkdown = removeManualTOC(markdown);
  
  // Process markdown and generate TOC in one pass to ensure consistent slugs
  const processedMarkdown = sanitizedMarkdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    const text = title.trim();
    const slug = slugger.slug(text);
    
    // Only add h2 and h3 to TOC for navigation
    if (level >= 2 && level <= 3) {
      toc.push({ level, text, slug });
    }
    
    // Return HTML with ID for all heading levels
    return `<h${level} id="${slug}">${text}</h${level}>`;
  });
  
  return { processedMarkdown, toc };
}

// Legacy function for backward compatibility
export function addHeadingIdsToMarkdown(markdown: string): string {
  return processMarkdownWithTOC(markdown).processedMarkdown;
}

// Legacy function for backward compatibility  
export function extractTOC(markdown: string) {
  return processMarkdownWithTOC(markdown).toc;
}
