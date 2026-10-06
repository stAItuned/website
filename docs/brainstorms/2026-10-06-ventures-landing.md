# Brainstorm — stAI tuned Ventures landing

Date: 2026-10-06
Status: confirmed by user before implementation

## Goal

Create a premium public landing page at `/ventures` that presents stAI tuned as a venture-building engine for AI-native products and makes the Founding GTM / Venture Builder opportunity credible and attractive.

The page preserves the existing stAI tuned brand while feeling more focused, mature and product-led than the editorial/content surfaces.

## Core narrative

The page communicates, in order:

1. Ambition — we build AI products.
2. Proof — real ventures and working software exist.
3. System — product/engineering is already strong; validation/distribution is the missing half.
4. Portfolio — selected ventures: ClosedRoom, Harnex and Aura Finance.
5. Operating model — build enough to learn, test assumptions, double down or kill.
6. Complementarity — what already exists vs what the GTM operator owns.
7. Opportunity — Founding GTM / Venture Builder.
8. Conversion — direct conversation CTA.

## Non-goals

- Do not redesign the stAI tuned homepage.
- Do not replace the existing `/prodotti` / Lab positioning.
- Do not add an application form, auth flow, CRM integration, new tracking event, storage or third-party service.
- Do not imply that stAI tuned is already a mature venture studio.
- Do not add unverified traction or revenue claims.
- Do not ship real venture screenshots yet; reserve the correct visual geometry with placeholders.

## Brand and UX constraints

- Reuse Montserrat and existing Tailwind brand tokens.
- Primary visual language: navy/slate/off-white with stAI tuned yellow-gold accents.
- Reduce emoji usage and excessive orange/red gradients.
- Prefer large typography, whitespace, restrained glass surfaces and purposeful micro-motion.
- Mobile-first; no critical content hidden on mobile.
- Use semantic sections and keyboard-accessible links.

## Architecture

- Route: `app/(public)/ventures/page.tsx`
- Feature components: `components/ventures/*`
- Translation/content contract: `components/ventures/venturesContent.ts`
- Reuse the existing `LearnLocaleProvider` / `useLearnLocale` so the page follows the site-wide IT/EN toggle.
- Keep route metadata server-rendered; only the localized composition requires client context.

## Portfolio content

Initial showcase:

- ClosedRoom — privacy-first, on-device AI for meetings.
- Harnex — local AI harness for Android.
- Aura Finance — AI-native finance venture, described conservatively while positioning remains in discovery.

Each venture includes a stage label, concise proposition, tags and a visual placeholder.

## SEO / GEO

- Unique title, description, canonical and OpenGraph metadata for `/ventures`.
- Clear H1/H2/H3 hierarchy.
- Answer-first copy explaining what stAI tuned Ventures is and what role it is seeking.
- No unsupported superlatives or fabricated metrics.
- Add `/ventures` to the XML sitemap.

## Bilingual impact

- Full Italian and English parity for headings, body copy, venture labels and CTAs.
- Default locale behavior remains governed by the existing site locale provider.

## Privacy / GDPR

No new processing activity is introduced:

- no form;
- no new analytics event;
- no user identifier;
- no new storage;
- no new third-party integration.

The page inherits the site's existing global analytics/consent behavior without modification.

## AI Act

This is a marketing/content surface, not a new AI-enabled workflow or automated decision system. No model integration, automated output, scoring or AI interaction is introduced.

## Testing approach

- Type/lint validation for the new route and components.
- Content parity tests for IT/EN venture IDs and engine states.
- Validate semantic heading hierarchy and internal anchor targets.
- Review responsive Tailwind composition at xs, md and xl.
- Verify all visual areas use placeholders rather than missing asset paths.

## Confirmation

The user reviewed the proposed direction in conversation and explicitly requested implementation on 2026-10-06.
