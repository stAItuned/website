import { NextResponse } from "next/server";
import { statSync } from "node:fs";
import path from "node:path";
import { allPosts, allTopics } from "@/lib/contentlayer";
import { getAllProducts } from "@/lib/products";

export const runtime = "nodejs";
export const revalidate = 3600; // Revalidate every hour

const baseUrl = "https://staituned.com";

// Escape special XML chars
function escapeXml(text: string | null | undefined): string {
  const t = String(text ?? "");
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toIsoDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp).toISOString();
}

// Robust slugify for author URLs
function authorSlug(name: string) {
  return encodeURIComponent(
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
  );
}

// Find the most recent post date for a category/section
function getMostRecentPostDate(posts: typeof allPosts, section?: string): string | null {
  const filtered = section
    ? posts.filter(p => (p.target || "general").toLowerCase() === section.toLowerCase())
    : posts;

  if (filtered.length === 0) return null;

  const dates = filtered
    .map((p) => toIsoDate(p.updatedAt || p.date))
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date).getTime());
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates)).toISOString();
}

function getMostRecentPostDateForTopic(posts: typeof allPosts, topicSlug: string): string | null {
  const normalizedTopic = topicSlug.toLowerCase();
  const filtered = posts.filter((post) => {
    const primaryTopic = (post.primaryTopic ?? "").toLowerCase();
    const topics = (post.topics ?? []).map((topic) => topic.toLowerCase());
    return primaryTopic === normalizedTopic || topics.includes(normalizedTopic);
  });

  if (filtered.length === 0) return null;

  const dates = filtered
    .map((post) => toIsoDate(post.updatedAt || post.date))
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date).getTime());
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates)).toISOString();
}

// Helper to get file mtime - returns null if file doesn't exist or error
// Preventing automatic fallback to buildDate unless explicitly desired
function getLatestFileMtime(relativePaths: string[]): string | null {
  const mtimes: number[] = [];

  for (const relativePath of relativePaths) {
    try {
      const absolutePath = path.join(process.cwd(), relativePath);
      const stat = statSync(absolutePath);
      mtimes.push(stat.mtime.getTime());
    } catch {
      // Ignore missing files
    }
  }

  if (mtimes.length === 0) return null;
  return new Date(Math.max(...mtimes)).toISOString();
}

export async function GET() {
  // Include all posts that are not explicitly unpublished.
  // This matches page rendering logic across the Learn routes.
  const posts = allPosts.filter((p) => p.published !== false);

  // Exclude preview/draft routes from sitemap (defense in depth)
  const excludedPathPrefixes = ["/preview", "/contribute/draft"];
  const isExcludedUrl = (loc: string) =>
    excludedPathPrefixes.some((prefix) => {
      const fullPrefix = `${baseUrl}${prefix}`;
      return loc === fullPrefix || loc.startsWith(`${fullPrefix}/`);
    });

  // All products
  const products = getAllProducts();

  // Unique authors
  const authors = Array.from(
    new Set(posts.map((p) => p.author).filter(Boolean) as string[])
  );

  // Calculate dynamic lastmod dates for category pages
  const learnLastmod = getMostRecentPostDate(posts);
  const newbieLastmod = getMostRecentPostDate(posts, "newbie");
  const midwayLastmod = getMostRecentPostDate(posts, "midway");
  const expertLastmod = getMostRecentPostDate(posts, "expert");

  // Static page lastmod values use source file mtimes when available.
  // If unavailable, we omit <lastmod> instead of emitting low-confidence values.
  const staticPageLastmodByPath: Record<string, string | null> = {
    "/": getLatestFileMtime(["app/page.tsx"]),
    "/topics": getLatestFileMtime(["app/(public)/topics/page.tsx"]),
    "/career-os": getLatestFileMtime(["app/(public)/career-os/page.tsx"]),
    "/role-fit-audit": getLatestFileMtime(["app/(public)/role-fit-audit/page.tsx"]),
    "/prodotti": getLatestFileMtime(["app/(public)/prodotti/page.tsx"]),
    "/meet": getLatestFileMtime(["app/(public)/meet/page.tsx"]),
    "/contribute": getLatestFileMtime(["app/(public)/contribute/page.tsx"]),
    "/contributor": getLatestFileMtime(["app/(public)/contributor/page.tsx"]),
    "/author": getLatestFileMtime(["app/(public)/author/page.tsx"]),
    "/terms": getLatestFileMtime(["app/(public)/terms/page.tsx"]),
    "/privacy": getLatestFileMtime(["app/(public)/privacy/page.tsx"]),
    "/cookie-policy": getLatestFileMtime(["app/(public)/cookie-policy/page.tsx"]),
  };

  // Products catalog updates when products file changes
  const productsCatalogLastmod = getLatestFileMtime([
    "lib/products/index.ts",
    "app/(public)/prodotti/page.tsx",
  ]);


  // Static pages with lastmod when available
  const staticUrls = [
    { loc: `${baseUrl}/`, lastmod: learnLastmod ?? staticPageLastmodByPath["/"] },
    { loc: `${baseUrl}/learn/articles`, lastmod: learnLastmod },
    { loc: `${baseUrl}/learn/newbie`, lastmod: newbieLastmod },
    { loc: `${baseUrl}/learn/midway`, lastmod: midwayLastmod },
    { loc: `${baseUrl}/learn/expert`, lastmod: expertLastmod },
    { loc: `${baseUrl}/topics`, lastmod: learnLastmod ?? staticPageLastmodByPath["/topics"] },
    { loc: `${baseUrl}/career-os`, lastmod: staticPageLastmodByPath["/career-os"] },
    { loc: `${baseUrl}/role-fit-audit`, lastmod: staticPageLastmodByPath["/role-fit-audit"] },
    { loc: `${baseUrl}/prodotti`, lastmod: productsCatalogLastmod ?? staticPageLastmodByPath["/prodotti"] },
    { loc: `${baseUrl}/meet`, lastmod: staticPageLastmodByPath["/meet"] },
    { loc: `${baseUrl}/contribute`, lastmod: staticPageLastmodByPath["/contribute"] },
    { loc: `${baseUrl}/contributor`, lastmod: staticPageLastmodByPath["/contributor"] },
    { loc: `${baseUrl}/author`, lastmod: staticPageLastmodByPath["/author"] },
    { loc: `${baseUrl}/terms`, lastmod: staticPageLastmodByPath["/terms"] },
    { loc: `${baseUrl}/privacy`, lastmod: staticPageLastmodByPath["/privacy"] },
    { loc: `${baseUrl}/cookie-policy`, lastmod: staticPageLastmodByPath["/cookie-policy"] },
  ]
    .filter((u) => !isExcludedUrl(u.loc))
    .map((u) => `
  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`)
    .join("");

  // Topic hub pages
  const topicUrls = allTopics
    .filter((topic) =>
      posts.some(
        (p) =>
          p.primaryTopic === topic.slug ||
          (p.topics ?? []).includes(topic.slug)
      )
    )
    .map((topic) => {
      const url = `${baseUrl}/topics/${topic.slug}`;
      if (isExcludedUrl(url)) return "";
      const lastmod = getMostRecentPostDateForTopic(posts, topic.slug);

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
    })
    .join("");

  // Author pages...
  const authorUrls = authors
    .map((name) => {
      const url = `${baseUrl}/author/${authorSlug(name)}`;
      if (isExcludedUrl(url)) return "";
      const authorPosts = posts.filter(p => p.author === name);
      const authorDates = authorPosts
        .map((p) => toIsoDate(p.updatedAt || p.date))
        .filter((date): date is string => Boolean(date))
        .map((date) => new Date(date).getTime());
      const lastmod = authorDates.length > 0
        ? new Date(Math.max(...authorDates)).toISOString()
        : null;

      return `
  <url>
    <loc>${escapeXml(url)}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
    })
    .join("");

  // Article pages - use actual update date.
  // CRITICAL FIX: If no date/updatedAt exists, DO NOT emit <lastmod>.
  // Falling back to Date.now() causes constant churn in sitemap.
  const postUrls = posts
    .map((post) => {
      const section = (post.target || "general").toLowerCase();
      const url = `${baseUrl}/learn/${section}/${post.slug}`;
      if (isExcludedUrl(url)) return "";

      const lastmod = toIsoDate(post.updatedAt || post.date);

      return `
  <url>
    <loc>${escapeXml(url)}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
    })
    .join("");

  // Product pages
  const productUrls = products
    .map((product) => {
      const url = `${baseUrl}/prodotti/${product.slug}`;
      if (isExcludedUrl(url)) return "";

      return `
  <url>
    <loc>${escapeXml(url)}</loc>${productsCatalogLastmod ? `
    <lastmod>${productsCatalogLastmod}</lastmod>` : ""}
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  ${staticUrls}
  ${topicUrls}
  ${authorUrls}
  ${postUrls}
  ${productUrls}
</urlset>`;


  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    },
  });
}
