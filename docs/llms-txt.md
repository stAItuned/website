# `llms.txt` and Agentic Search Notes

This repo serves `llms.txt` and `llms-full.txt` from the domain root.

Files:
- `public/llms.txt`
- `public/llms-full.txt`

## Purpose
- Provide a lightweight, LLM-oriented crawl guide for agentic/AI search.
- Complement `robots.txt` and `sitemap.xml` (not replace them).

## Maintenance Rules
- Keep the file stable and low-churn.
- Update the `Last updated` date only when content/paths change meaningfully.
- Keep English and Italian sections aligned (no functional gaps).
- Prefer pointing to canonical entrypoints (sitemap, RSS, hubs) instead of listing hundreds of URLs.

## What To Include
- Sitemap URL and other durable discovery entrypoints (`/learn/articles`, `/topics`, RSS).
- High-level crawl priorities (what matters most).
- Explicit exclusions for private/draft/internal routes.
- Canonical URL preference guidance (avoid query variants).

## What Not To Include
- Secrets, API keys, internal endpoints, or admin-only URLs.
- User-specific routes, session URLs, or anything behind auth.
- Large, frequently changing URL lists (use `sitemap.xml` instead).

