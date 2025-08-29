import { NextResponse } from "next/server";
import { allPosts } from "@/lib/contentlayer";

export const runtime = "nodejs";           // ensure Node
export const revalidate = 3600;            // make this route static for 1h

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

// Robust slugify for author URLs, then encode
function authorSlug(name: string) {
  return encodeURIComponent(
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // strip diacritics
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
  );
}

export async function GET() {
  // Only published posts
  const posts = allPosts.filter((p) => p.published !== false);

  // Unique authors
  const authors = Array.from(
    new Set(posts.map((p) => p.author).filter(Boolean) as string[])
  );

  // Build XML chunks
  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/meet/`, changefreq: "monthly", priority: "0.8" },
    { loc: `${baseUrl}/learn/`, changefreq: "weekly", priority: "0.8" },
    { loc: `${baseUrl}/author/`, changefreq: "weekly", priority: "0.7" },
  ]
    .map(
      (u) => `
  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("");

  const authorUrls = authors
    .map((name) => {
      const url = `${baseUrl}/author/${authorSlug(name)}/`;
      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("");

  const postUrls = posts
    .map((post) => {
      const section = (post.target || "general").toLowerCase();
      const url = `${baseUrl}/learn/${section}/${post.slug}/`;

      const last = new Date(
        post.updatedAt || post.date || Date.now()
      ).toISOString();

      const coverUrl = post.cover
        ? post.cover.startsWith("http")
          ? post.cover
          : `${baseUrl}/content/articles/${post.slug}/${post.cover.replace("./", "")}`
        : null;

      // hreflang – only if you truly have alternates; here we just set one language
      const hreflang =
        post.language
          ? `<xhtml:link rel="alternate" hreflang="${post.language === "Italian" ? "it" : "en"}" href="${escapeXml(url)}" />`
          : "";

      const image =
        coverUrl
          ? `<image:image>
      <image:loc>${escapeXml(coverUrl)}</image:loc>
    </image:image>`
          : "";

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${last}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${hreflang}
    ${image}
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
  ${authorUrls}
  ${postUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    },
  });
}
