import GithubSlugger from 'github-slugger';

export function addHeadingIdsToMarkdown(markdown: string): string {
  const slugger = new GithubSlugger();
  // Replace markdown headings (##, ###, etc.) with HTML headings with IDs
  return markdown.replace(/^(#{2,3})\s+(.+)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    const slug = slugger.slug(title.trim());
    return `<h${level} id="${slug}">${title.trim()}</h${level}>`;
  });
}
