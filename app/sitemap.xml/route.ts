import { NextResponse } from "next/server";
import { statSync } from "node:fs";
import path from "node:path";
import { allPosts, allTopics } from "@/lib/contentlayer";
import { getAllProducts } from "@/lib/products";

export const runtime = "nodejs";
export const revalidate = 3600; // Revalidate every hour

const baseUrl = "https://staituned.com";

// Current date for static pages (updated on each build/revalidation)
const buildDate = new Date().toISOString();

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
function getMostRecentPostDate(posts: typeof allPosts, section?: string): string {
  const filtered = section
    ? posts.filter(p => (p.target || "general").toLowerCase() === section.toLowerCase())
    : posts;

  if (filtered.length === 0) return buildDate;

  const dates = filtered.map(p => new Date(p.updatedAt || p.date || 0).getTime());
  return new Date(Math.max(...dates)).toISOString();
}

function getMostRecentPostDateForTopic(posts: typeof allPosts, topicSlug: string): string {
  const normalizedTopic = topicSlug.toLowerCase();
  const filtered = posts.filter((post) => {
    const primaryTopic = (post.primaryTopic ?? "").toLowerCase();
    const topics = (post.topics ?? []).map((topic) => topic.toLowerCase());
    return primaryTopic === normalizedTopic || topics.includes(normalizedTopic);
  });

  if (filtered.length === 0) return buildDate;

  const dates = filtered.map((post) => new Date(post.updatedAt || post.date || 0).getTime());
  return new Date(Math.max(...dates)).toISOString();
}

function getLatestFileMtime(relativePaths: string[]): string {
  const mtimes: number[] = [];

  for (const relativePath of relativePaths) {
    try {
      const absolutePath = path.join(process.cwd(), relativePath);
      const stat = statSync(absolutePath);
      mtimes.push(stat.mtime.getTime());
    } catch {
      // Ignore missing files and keep best-effort behavior.
    }
  }

  if (mtimes.length === 0) return buildDate;
  return new Date(Math.max(...mtimes)).toISOString();
}

export async function GET() {
  // Only published posts (explicit true to exclude drafts/null)
  const posts = allPosts.filter((p) => p.published === true);

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
  const careerOsLastmod = getLatestFileMtime(["app/(public)/career-os/page.tsx"]);
  const roleFitAuditLastmod = getLatestFileMtime(["app/(public)/role-fit-audit/page.tsx"]);
  const prodottiLastmod = getLatestFileMtime(["app/(public)/prodotti/page.tsx", "app/(public)/demo/page.tsx"]);
  const meetLastmod = getLatestFileMtime(["app/(public)/meet/page.tsx"]);
  const contributeLastmod = getLatestFileMtime(["app/(public)/contribute/page.tsx"]);
  const contributorLastmod = getLatestFileMtime(["app/(public)/contributor/page.tsx"]);
  const termsLastmod = getLatestFileMtime(["app/(public)/terms/page.tsx"]);
  const privacyLastmod = getLatestFileMtime(["app/(public)/privacy/page.tsx"]);
  const cookiePolicyLastmod = getLatestFileMtime(["app/(public)/cookie-policy/page.tsx"]);
  const productsCatalogLastmod = getLatestFileMtime([
    "app/(public)/prodotti/[slug]/page.tsx",
    "app/(public)/prodotti/page.tsx",
    "lib/products/index.ts",
  ]);


  // Static pages with priority and lastmod
  // Note: changefreq removed as Google ignores it, preferring lastmod
  const staticUrls = [
    // Core pages - highest priority
    { loc: `${baseUrl}/`, priority: "1.0", lastmod: learnLastmod },
    { loc: `${baseUrl}/learn/articles`, priority: "0.9", lastmod: learnLastmod },
    // Section/target pages - dynamically updated when new posts added
    { loc: `${baseUrl}/learn/newbie`, priority: "0.8", lastmod: newbieLastmod },
    { loc: `${baseUrl}/learn/midway`, priority: "0.8", lastmod: midwayLastmod },
    { loc: `${baseUrl}/learn/expert`, priority: "0.8", lastmod: expertLastmod },

    // Secondary pages
    { loc: `${baseUrl}/topics`, priority: "0.8", lastmod: learnLastmod },
    { loc: `${baseUrl}/career-os`, priority: "0.8", lastmod: careerOsLastmod },
    { loc: `${baseUrl}/role-fit-audit`, priority: "0.7", lastmod: roleFitAuditLastmod },
    { loc: `${baseUrl}/prodotti`, priority: "0.8", lastmod: prodottiLastmod },
    { loc: `${baseUrl}/meet`, priority: "0.7", lastmod: meetLastmod },
    { loc: `${baseUrl}/contribute`, priority: "0.7", lastmod: contributeLastmod },
    { loc: `${baseUrl}/contributor`, priority: "0.6", lastmod: contributorLastmod },
    { loc: `${baseUrl}/author`, priority: "0.6", lastmod: learnLastmod },
    { loc: `${baseUrl}/terms`, priority: "0.3", lastmod: termsLastmod },

    // Legal pages - low priority, rarely updated
    { loc: `${baseUrl}/privacy`, priority: "0.3", lastmod: privacyLastmod },
    { loc: `${baseUrl}/cookie-policy`, priority: "0.3", lastmod: cookiePolicyLastmod },
  ]
    .filter((u) => !isExcludedUrl(u.loc))
    .map((u) => `
  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`)
    .join("");

  // Topic hub pages
  const topicUrls = allTopics
    .map((topic) => {
      const url = `${baseUrl}/topics/${topic.slug}`;
      if (isExcludedUrl(url)) return "";
      const lastmod = getMostRecentPostDateForTopic(posts, topic.slug);

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.7</priority>
  </url>`;
    })
    .join("");

  // Author pages - use most recent post by that author
  const authorUrls = authors
    .map((name) => {
      const url = `${baseUrl}/author/${authorSlug(name)}`;
      if (isExcludedUrl(url)) return "";
      const authorPosts = posts.filter(p => p.author === name);
      const lastmod = authorPosts.length > 0
        ? new Date(Math.max(...authorPosts.map(p => new Date(p.updatedAt || p.date || 0).getTime()))).toISOString()
        : buildDate;

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.6</priority>
  </url>`;
    })
    .join("");

  // Article pages - use actual update date
  const postUrls = posts
    .map((post) => {
      const section = (post.target || "general").toLowerCase();
      const url = `${baseUrl}/learn/${section}/${post.slug}`;
      if (isExcludedUrl(url)) return "";
      const lastmod = new Date(post.updatedAt || post.date || Date.now()).toISOString();

      const coverUrl = post.cover
        ? post.cover.startsWith("http")
          ? post.cover
          : `${baseUrl}/content/articles/${post.slug}/${post.cover.replace("./", "")}`
        : null;

      // hreflang for multilingual content
      // Note: Our IT/EN articles are separate content (not translations),
      // so each article only declares its own language.
      const langCode = post.language === "Italian" ? "it" : "en";
      const hreflang = post.language
        ? `<xhtml:link rel="alternate" hreflang="${langCode}" href="${escapeXml(url)}" />`
        : "";

      const image = coverUrl
        ? `<image:image>
      <image:loc>${escapeXml(coverUrl)}</image:loc>
    </image:image>`
        : "";

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.7</priority>
    ${hreflang}
    ${image}
  </url>`;
    })
    .join("");

  // Product pages
  const productUrls = products
    .map((product) => {
      const url = `${baseUrl}/prodotti/${product.slug}`;
      if (isExcludedUrl(url)) return "";

      const imageTag = product.image
        ? `<image:image>
      <image:loc>${escapeXml(product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`)}</image:loc>
      <image:title>${escapeXml(product.title)}</image:title>
    </image:image>`
        : "";

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${productsCatalogLastmod}</lastmod>
    <priority>0.6</priority>
    ${imageTag}
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
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
