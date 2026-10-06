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

Portfolio media is represented by purpose-built placeholders. These reserve final screenshot/video geometry so future assets can replace placeholders without changing layout.

## Brand decisions

The page uses existing Tailwind tokens only:

- `primary` for stAI tuned navy/blue identity;
- `secondary` for the yellow-gold accent;
- slate neutrals for high-contrast product surfaces.

The page deliberately uses fewer emojis, fewer orange/red gradients and more whitespace than the editorial homepage to create a more mature builder/studio feel without introducing a separate brand system.

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

No new first-party data collection, storage, tracking event or third-party vendor is introduced. The only conversion action is a `mailto:` link. Existing global analytics and cookie-consent behavior remain unchanged.

## AI Act

No new AI system behavior is introduced. The page describes AI products but does not generate, rank, recommend or automate decisions for the visitor.

## Extension points

Future iterations can add:

- real product screenshots/videos by replacing `VentureVisualPlaceholder`;
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
