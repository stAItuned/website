# AGENTS.md

## Purpose
This document defines how contributors and coding agents must design, implement, and document features in this repository.

The primary goals are:
- Modular architecture with low coupling and high reusability.
- Consistent UX/UI aligned with stAItuned brand guidelines.
- Mobile-first responsiveness and strong accessibility.
- PWA-ready behavior for the `/learn` experience.
- Strong SEO and GEO (Generative Engine Optimization) coverage.
- Strict bilingual parity for Italian and English (`it/en`).
- Clear, durable feature documentation.

## Stack Baseline
- Next.js 16 (App Router)
- React 19
- TypeScript (`strict: true`)
- Tailwind CSS v3 (JIT)
- Contentlayer (MDX content)
- Vitest + Testing Library

## Deploy Environments (Test vs Prod)
The repo supports two Firebase Hosting deploy targets (same Firebase project, different Hosting sites):
- `development` (test/staging) -> `staituned-dev`
- `production` -> `staituned-production`

Reference files:
- `.firebaserc`: target mapping
- `firebase.json`: hosting targets configuration
- `deploy.yaml`: deploy runbook

Commands:
- `npm run deploy:test` deploys to the `development` hosting target.
- `npm run deploy:prod` deploys to the `production` hosting target.

Rules:
- Do not merge “test” data/config into prod by default; keep env vars and third-party integrations scoped per target.
- If a feature depends on environment-specific behavior, document the expected differences in `spec_dev.md` and `docs/deployments.md`.

## Non-Negotiables
1. No `any` in application code. Use explicit types and Zod validation where external input exists.
2. Default to Server Components; add `'use client'` only when required (state, effects, browser APIs, event handlers).
3. No hardcoded brand colors when a Tailwind theme token exists.
4. New UI must be mobile-first and verified at `xs`, `md`, and `xl` breakpoints.
5. Every non-trivial feature must include documentation updates.
6. Every user-facing feature/content update must preserve `it/en` parity.
7. SEO and GEO requirements are mandatory for discoverable pages/content.

## Project Structure Rules
- `app/`: routes, layouts, server-first page composition.
- `components/`: reusable UI and feature components.
- `components/ui/`: atomic/shared UI primitives.
- `components/<feature>/`: feature-specific compositions.
- `lib/`: domain logic, integrations, utilities, validations.
- `docs/`: durable process and feature documentation.

Use alias imports (`@/...`) for consistency.

## Atomic Component System
Build UI using an atomic hierarchy to avoid duplication:

1. Atoms
- Smallest reusable primitives (buttons, badges, labels, icons, skeletons).
- Live in `components/ui/`.
- Must be style-token driven and variant-based.

2. Molecules
- Compositions of atoms (input + label + helper text, card header blocks, CTA groups).
- Prefer colocating with related feature, promote to shared when reused.

3. Organisms
- Larger feature sections (hero, article rail, install prompt group).
- Compose molecules and atoms without duplicating primitive logic.

4. Templates/Pages
- Route-level assembly in `app/`.
- Keep business logic in `lib/` and presentational logic in components.

### Extension/Override Pattern
When a feature needs custom behavior:
- Extend base atomic components through typed props (`variant`, `size`, `tone`, `intent`).
- Add `className` escape hatches via `clsx` while preserving base accessibility and states.
- Do not fork entire components for minor visual changes.
- If overrides repeat, promote them into first-class variants.

## UX/UI and Brand Alignment
All UI must align with `tailwind.config.cjs` and `lib/brand.ts`.

Required practices:
- Use theme tokens (`primary`, `secondary`, `accent`, `brand`) instead of arbitrary hex values.
- Use `font-sans` (Montserrat variable) consistently.
- Maintain a premium but readable visual language: clear hierarchy, restrained motion, consistent spacing.
- Include meaningful micro-interactions with existing animations (`animate-fade-in`, `animate-slide-up`, etc.) only when they improve comprehension.

## Responsiveness and Accessibility
Minimum acceptance for every UI change:
- Works at `xs` (>=475px), `sm`, `md`, `lg`, `xl`.
- No hidden critical actions on mobile.
- Touch targets are comfortably tappable.
- Keyboard navigation is complete and visible.
- Interactive controls have accessible labels/roles.
- Color contrast is sufficient for text and controls.

## PWA Requirements
The repository supports a scoped PWA for `/learn`.

When touching PWA-related features:
- Preserve learn-scoped manifest behavior (`/learn-manifest.json`).
- Preserve service worker registration and update UX.
- Ensure install prompts are non-blocking and dismissible.
- Validate offline/fallback behavior for core learning flows.
- Keep icons, screenshots, shortcuts, and metadata coherent with brand and product behavior.

## SEO and GEO Requirements
Apply these rules to every indexable route and content page:
- Provide unique metadata (`title`, `description`, canonical, OpenGraph).
- Keep semantic heading hierarchy (`h1` -> `h2` -> `h3`) and descriptive link labels.
- Keep structured data (JSON-LD) accurate when entities/articles are involved.
- Optimize content for both classic search (SEO) and AI answer engines (GEO): clear intent, concise definitions, factual statements, and scannable sections.
- Include trustworthy context signals when relevant: author, publish/update date, source references, and topical scope.
- Avoid thin/duplicate pages and duplicated metadata.

## Bilingual Content Policy (`it/en`)
- Every user-facing content or UI string change must be evaluated for both Italian and English.
- If a page exists in both languages, features and core messaging must remain aligned (no one-language-only functional gaps).
- Locale-specific metadata must be present for both languages when the route/content is localized.
- Translation quality must preserve meaning, tone, and CTA intent; do not ship placeholder untranslated text.
- When adding new docs/specs for product behavior, include language notes if behavior differs by locale.

## Performance Standards
- Prefer server rendering and streaming where possible.
- Use `next/image` for content images unless there is a justified exception.
- Avoid hydration-heavy patterns for static content.
- Defer non-critical client logic.
- Keep component files focused and ideally under ~200 lines; split concerns early.

## Testing Standards
- Unit tests for utilities and non-trivial transformations.
- Backend/API function tests are mandatory for every new/changed server route or business function.
- Component behavior tests for complex interactive UI.
- UI usability tests are mandatory for key interactions (navigation, form submit, feedback/error states, keyboard flow).
- E2E tests are mandatory for the most important user journeys and must verify consistency across critical steps.
- Regression tests when fixing production bugs.
- At minimum, pass `npm run lint` and relevant `npm run test` scope before merge.

## Documentation Standards
For each meaningful feature/change, update docs in the same PR:
- Feature purpose and scope.
- Architecture decisions and extension points.
- Data contracts and validation rules.
- UX states (loading, empty, error, success).
- Mobile behavior and accessibility notes.
- PWA impact (if any).
- SEO/GEO impact.
- Bilingual (`it/en`) impact and translation notes.

Use:
- TSDoc/JSDoc for exported components and complex functions.
- `spec_dev.md` as the canonical feature specification template.
- `SKILLS.md` as the implementation workflow checklist.

## Delivery Checklist (Definition of Done)
A task is complete only when all are true:
- [ ] Reuses or extends atomic components instead of duplicating UI logic.
- [ ] Aligns with brand tokens and visual language.
- [ ] Verified responsive at mobile and desktop breakpoints.
- [ ] Accessibility basics are covered (keyboard, labels, focus, contrast).
- [ ] PWA constraints respected when feature touches `/learn`.
- [ ] SEO/GEO constraints respected for indexable pages/content.
- [ ] Bilingual `it/en` parity preserved for user-facing changes.
- [ ] Backend/API functions are covered by tests.
- [ ] UI usability interactions are covered by tests.
- [ ] Critical E2E journeys are tested and consistent end-to-end.
- [ ] Documentation updated (`docs/`, `README.md`, or feature notes as needed).

## Agent Prompting Protocol
Goal: make agent outputs consistently high-quality and verifiable.

### Required prompt header (use internally)
1) PERSONA (specific): role + years + domain + approach.
2) METHOD: "Take a deep breath and work step by step."
3) QUALITY GATES:
   - Map changes to SKILLS checklist items
   - For code: Red-Green-Refactor when adding behavior
   - After output: self-evaluate confidence (0-1) on correctness, completeness, and regression risk
   - If any score < 0.9: revise once, then stop with missing info list
4) EVIDENCE: include commands run + summaries (tests/lint/typecheck).

### Allowed techniques (internal-only)
- Deep-breath + step-by-step
- Detailed expert persona
- Self-evaluation + retry threshold
- Stakes/challenge language ONLY as internal “effort framing”

### Effectiveness strategies (use when necessary)
Use one or more of these when task complexity, ambiguity, or risk is high:
- Objective framing: restate goal, constraints, and non-goals in 3-5 lines before execution.
- Decomposition-first: split work into small verifiable steps with an explicit checkpoint after each step.
- Assumption log: list assumptions, mark unknowns, and convert high-risk unknowns into verification actions.
- Verification ladder: validate in this order when applicable: types/lint -> unit tests -> integration/API tests -> E2E critical journeys.
- Counterexample pass: explicitly test at least one edge case and one failure path for each critical flow.
- Minimal-diff strategy: prefer the smallest safe change first; expand only if evidence shows it is insufficient.
- Consistency pass: cross-check outcomes against SKILLS DoD, spec acceptance criteria, SEO/GEO constraints, and `it/en` parity.
- Confidence gating: if confidence on correctness/completeness/regression risk is <0.9, do one targeted revision and report remaining gaps.

### Trigger conditions for effectiveness strategies
Activate the strategies above by default if one or more conditions apply:
- Multi-file or cross-layer changes (UI + backend/API + data contracts).
- User-facing journey changes that affect conversion, onboarding, or critical actions.
- Security/privacy/permissions logic changes.
- Production incident fixes or regressions.
- Ambiguous requirements, missing context, or conflicting constraints.
- Significant SEO/GEO or localization (`it/en`) impact.

### Forbidden in user-facing content
- Monetary tipping language, emotional manipulation, “prove you’re better” style challenges
- Any claims that imply real incentives or real-world consequences
