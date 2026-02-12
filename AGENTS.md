# AGENTS.md

## Purpose
This document defines how contributors and coding agents must design, implement, and document features in this repository.

The primary goals are:
- Modular architecture with low coupling and high reusability.
- Consistent UX/UI aligned with stAItuned brand guidelines.
- Mobile-first responsiveness and strong accessibility.
- PWA-ready behavior for the `/learn` experience.
- Clear, durable feature documentation.

## Stack Baseline
- Next.js 16 (App Router)
- React 19
- TypeScript (`strict: true`)
- Tailwind CSS v3 (JIT)
- Contentlayer (MDX content)
- Vitest + Testing Library

## Non-Negotiables
1. No `any` in application code. Use explicit types and Zod validation where external input exists.
2. Default to Server Components; add `'use client'` only when required (state, effects, browser APIs, event handlers).
3. No hardcoded brand colors when a Tailwind theme token exists.
4. New UI must be mobile-first and verified at `xs`, `md`, and `xl` breakpoints.
5. Every non-trivial feature must include documentation updates.

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

## Performance Standards
- Prefer server rendering and streaming where possible.
- Use `next/image` for content images unless there is a justified exception.
- Avoid hydration-heavy patterns for static content.
- Defer non-critical client logic.
- Keep component files focused and ideally under ~200 lines; split concerns early.

## Testing Standards
- Unit tests for utilities and non-trivial transformations.
- Component behavior tests for complex interactive UI.
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
- [ ] Tests updated for critical logic.
- [ ] Documentation updated (`docs/`, `README.md`, or feature notes as needed).
