# stAI tuned Ventures

## Purpose

`/ventures` is the public venture-building showcase for stAI tuned. It is intentionally distinct from `/prodotti`: the Lab page presents experiments and pilot-derived webapps, while Ventures presents the portfolio, operating thesis and the Founding GTM / Venture Builder opportunity.

## Route

- Public route: `/ventures`
- Indexable: yes
- Authentication: none
- Data submission: none

## Architecture

The route remains a Server Component for metadata and page composition. Locale-specific rendering is delegated to `VenturesPageClient`, which reads the existing site-wide `LearnLocaleProvider`.

Feature files:

- `app/(public)/ventures/page.tsx`
- `components/ventures/VenturesPageClient.tsx`
- `components/ventures/VenturesHero.tsx`
- `components/ventures/VentureEngineSection.tsx`
- `components/ventures/VenturePortfolioSection.tsx`
- `components/ventures/VenturePrinciplesSection.tsx`
- `components/ventures/FoundingGtmSection.tsx`
- `components/ventures/VentureVisualMedia.tsx`
- `components/ventures/VentureVisualPlaceholder.tsx`
- `components/ventures/venturesContent.ts`

## UX model

The information hierarchy is:

1. Hero / positioning.
2. Bottleneck thesis.
3. Venture engine.
4. Venture portfolio.
5. Venture decision principles.
6. Technical-vs-commercial complementarity.
7. Founding GTM opportunity and conversation CTA.

Portfolio media is managed through `VentureVisualMedia`. When real assets are available (such as ClosedRoom at `/assets/ventures/closedroom.png`, Harnex at `/assets/ventures/harnex.png`, and Aura Finance at `/assets/ventures/aura-finance.png`), it renders an optimized responsive image with an accessible click-to-zoom modal; when no asset is provided, purpose-built geometry-preserving placeholders (`VentureVisualPlaceholder`) are used as fallback.

## Copy principles

Venture copy should stay short, concrete and human:
- one idea per sentence;
- prefer everyday language over venture jargon;
- keep section intros to one short sentence where possible;
- use short bullets that can be scanned without reading the whole panel;
- avoid repeating the same positioning across hero, thesis, bridge and role;
- explain products by what they do, not by abstract category language.

## Brand decisions

The page follows the existing visual grammar of the stAI tuned Home and Lab surfaces rather than introducing a separate venture-studio aesthetic.

- `primary` is used for institutional navy/blue identity and informational badges.
- Tailwind `amber` is the operational accent for CTAs, highlights and active venture states, matching the site's existing CTA and gradient patterns.
- The brighter `secondary` yellow is not used as a large solid text or surface fill; gold emphasis uses the existing `text-gradient-gold` utility.
- Dark full-width surfaces use `slate-900`, consistent with the homepage hero, rather than near-black `slate-950` as the dominant page color.
- Section headings follow the site's established scale: generally `text-3xl md:text-4xl`; the hero follows `text-4xl md:text-5xl lg:text-6xl`.
- Cards use the site's common `rounded-2xl`, light borders and restrained shadows. Full-page dark panels are limited to the hero and the Founding GTM opportunity.
- Section spacing follows the existing `py-16` / `md:py-20` rhythm and `max-w-5xl/6xl` content widths.

The result should feel like a focused stAI tuned product surface, not a visually separate startup microsite.

## Responsive behavior

- Mobile: all sections become a single vertical flow; venture visuals stay above their text.
- Tablet: spacing and type scale increase without changing information order.
- Desktop: engine steps become horizontal; portfolio alternates visual/content order; GTM section becomes a two-column operating model.
- All primary CTAs remain visible and tappable at small breakpoints.

## Accessibility

- Native anchors are used for page navigation and email contact.
- Visible focus-ring states are defined for primary CTAs.
- Placeholder media uses `role="img"` and accessible labels.
- Heading hierarchy is semantic and sequential.
- Critical information is never encoded only by color.

## Localization

`venturesContent.ts` maintains full Italian and English copies with the same typed information structure. Portfolio venture IDs and engine-step states are intentionally identical across locales and protected by tests.

## SEO / GEO

The route defines unique metadata, canonical URL and OpenGraph copy. The content gives a direct explanation of what stAI tuned Ventures is, what it builds and why it is looking for a Founding GTM / Venture Builder.

The sitemap must include `/ventures` and derive its `lastmod` from the route and feature-content files.

## Privacy / GDPR

The Founding GTM CTA opens a first-party interest form. It collects only name, email, an optional LinkedIn/portfolio URL, a short zero-to-first-customers example and explicit privacy acceptance.

- Endpoint: `POST /api/ventures/gtm-interest`.
- Storage: existing `contact_requests` Firestore dataset with `requestType=ventures_founding_gtm`.
- Retention: 12 months via the existing `contact_requests` retention policy.
- Legal basis: pre-contract steps for evaluating and responding to a collaboration request.
- Marketing: no marketing consent is collected and the submission must not be reused for unrelated marketing.
- Operational notifications remain metadata-only; full form content stays in Firestore.
- Honeypot protection is enabled.
- The form links directly to `/privacy`.
- The public Privacy Policy explicitly documents the Founding GTM flow, its purpose, legal basis, 12-month retention and no-marketing rule.

## AI Act

No new AI system behavior is introduced. The page describes AI products but does not generate, rank, recommend or automate decisions for the visitor.

## Extension points

Future iterations can add:

- video previews or interactive prototypes for portfolio ventures via `VentureVisualMedia`;
- detail routes under `/ventures/[venture]`;
- a dedicated `/ventures/founding-gtm` route;
- a lightweight application funnel after a separate GDPR review;
- verified venture metrics once evidence exists.

Do not add traction, revenue, customer or funding claims without a verifiable source of truth.

## Verification

Required checks when integrated into the repository:

- `npm run lint`
- the relevant Vitest scope including `components/ventures/venturesContent.test.ts`
- production build/typecheck if part of the release gate
- visual QA at xs, md and xl
- anchor navigation to `#portfolio` and `#founding-gtm`
