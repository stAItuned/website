# Auth and Private Route Indexing

## Purpose and Scope
Defines the indexing policy for auth-gated and user-specific routes such as `/signin`, `/bookmarks`, `/profile`, and `/account/*`.

## Indexing Policy
- Keep private routes blocked in `public/robots.txt` to reduce crawl waste.
- Also emit `robots` metadata with `index: false` and `follow: true` for auth and private routes.
- Apply the metadata through segment layouts when the page is a client component, so route protection does not depend on client-side rendering.

## Covered Routes
- `/signin`
- `/bookmarks`
- `/profile`
- `/account/settings`
- `/account/writer-profile`

## Why Both Signals Exist
- `robots.txt` blocks crawling of private/auth routes that Google may still discover from internal links or past crawls.
- Page metadata adds an explicit non-indexing signal at the route level and keeps the policy close to the implementation.
- Using both signals avoids treating login or user dashboard URLs as indexable content.

## Architecture Notes
- Shared metadata lives in `lib/seo/privateRouteMetadata.ts`.
- Segment layouts apply the policy for client-heavy route groups:
  - `app/(public)/account/layout.tsx`
  - `app/(public)/bookmarks/layout.tsx`
  - `app/(public)/profile/layout.tsx`
- `/signin` applies the same shared metadata directly in its route metadata export.

## SEO / GEO Impact
- No impact on public canonical pages or sitemap coverage.
- Reduces ambiguity in Search Console when Google discovers private URLs through internal navigation.
- Keeps answer engines and crawlers focused on public, canonical content rather than session-dependent routes.

## Bilingual Impact
- No locale-specific behavior changes.
- The indexing policy remains identical for Italian and English user journeys because these routes are account/auth surfaces rather than localized editorial pages.

## Privacy Notes
- These routes can expose user-specific navigation states or require authentication context.
- Keeping them out of search indexing supports the broader privacy boundary already enforced in product behavior.
