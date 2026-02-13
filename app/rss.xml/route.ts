import { NextResponse } from "next/server";
import { allPosts } from "@/lib/contentlayer";

export const runtime = "nodejs";
export const revalidate = 3600; // Regenerate every hour

const SITE_URL = "https://staituned.com";
const SITE_TITLE = "stAItuned | AI e GenAI concreta per tutti";
const SITE_DESCRIPTION = "Articoli pratici su AI e GenAI, strumenti e playbook per crescere e ottenere risultati. Inizia dal GenAI Fit Check e dal Career OS.";

/**
 * Escape special XML characters to prevent XML injection
 */
function escapeXml(text: string | null | undefined): string {
    const t = String(text ?? "");
    return t
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Strip HTML tags and clean text for RSS description
 */
function stripHtml(html: string | null | undefined): string {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\s+/g, " ")    // Normalize whitespace
        .trim()
        .slice(0, 300);          // Limit description length
}

function asOptionalString(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

/**
 * Format date to RFC 822 format required by RSS
 */
function toRfc822Date(date: string | Date | undefined): string {
    const d = date ? new Date(date) : new Date();
    return d.toUTCString();
}

/**
 * GET /rss.xml - Generate RSS 2.0 feed
 */
export async function GET() {
    // Filter only published posts and sort by date (newest first)
    const posts = allPosts
        .filter((p) => p.published !== false)
        .sort((a, b) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 50); // Limit to 50 most recent articles

    // Build RSS items
    const items = posts
        .map((post) => {
            const section = (post.target || "general").toLowerCase();
            const url = `${SITE_URL}/learn/${section}/${post.slug}/`;

            const pubDate = toRfc822Date(post.date);

            // Get description from meta, description, or excerpt
            const description = escapeXml(
                stripHtml(
                    post.meta ||
                    asOptionalString((post as { description?: unknown }).description) ||
                    asOptionalString((post as { excerpt?: unknown }).excerpt) ||
                    ""
                )
            );

            // Author email format for RSS (optional)
            const author = post.author ? `<author>noreply@staituned.com (${escapeXml(post.author)})</author>` : "";

            // Cover image as enclosure
            const coverUrl = post.cover
                ? post.cover.startsWith("http")
                    ? post.cover
                    : `${SITE_URL}/content/articles/${post.slug}/${post.cover.replace("./", "")}`
                : null;

            const enclosure = coverUrl
                ? `<enclosure url="${escapeXml(coverUrl)}" type="image/jpeg" length="0" />`
                : "";

            // Categories/tags
            const categories = [
                post.target ? `<category>${escapeXml(post.target)}</category>` : "",
                ...(post.tags || []).map((tag: string) => `<category>${escapeXml(tag)}</category>`)
            ].filter(Boolean).join("\n        ");

            return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      ${author}
      ${enclosure}
      ${categories}
    </item>`;
        })
        .join("");

    // Build full RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>it</language>
    <lastBuildDate>${toRfc822Date(new Date())}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/assets/general/logo-text.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>
    <copyright>© ${new Date().getFullYear()} stAItuned. All rights reserved.</copyright>
    <managingEditor>noreply@staituned.com (stAItuned Team)</managingEditor>
    <webMaster>noreply@staituned.com (stAItuned Team)</webMaster>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
