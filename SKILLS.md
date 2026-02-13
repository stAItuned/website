# SKILLS.md

## Purpose
This file defines execution skills used to implement features consistently in this repository.

Use these skills as checklists. For each feature, apply only the necessary skills, but always include `Documentation` at the end.

## Skill 1: Architecture & Modularity
When to use:
- New feature or refactor touching multiple components.
- Existing duplication across UI or logic layers.

Required actions:
1. Map the feature to atomic layers: atom, molecule, organism, page.
2. Extract shared logic into `lib/` and shared UI into `components/ui/`.
3. Keep route files focused on composition, not heavy business logic.
4. Add typed extension points instead of duplicating components.

Output:
- Clear component boundaries.
- Reduced duplication with reusable primitives and variants.

DoD:
- [ ] No copy-pasted UI blocks when a base component can be extended.
- [ ] Extension implemented via typed props/variants.

## Skill 2: UX/UI System & Brand Consistency
When to use:
- Any visual change.

Required actions:
1. Use tokens from Tailwind theme and `lib/brand.ts`.
2. Keep typography and spacing hierarchy consistent.
3. Add only purposeful motion (`animate-fade-in`, `animate-slide-up`, etc.).
4. Validate states: loading, empty, error, success.

Output:
- Cohesive, brand-aligned interface with clear information hierarchy.

DoD:
- [ ] No arbitrary color values if theme token exists.
- [ ] Visual states are complete and consistent.

## Skill 3: Responsive & Accessible Experience
When to use:
- Any component with user interaction or layout changes.

Required actions:
1. Build mobile-first (`xs` upward).
2. Verify layouts at `xs`, `md`, `xl`.
3. Ensure keyboard navigation and visible focus styles.
4. Add ARIA labels/roles where semantic HTML is not enough.

Output:
- Feature is fully usable on mobile and desktop.

DoD:
- [ ] No clipped/overlapping content at target breakpoints.
- [ ] Keyboard-only interaction path works.

## Skill 4: PWA Readiness (Learn Scope)
When to use:
- Any feature inside `/learn` or affecting install/offline/update behavior.

Required actions:
1. Preserve `/learn` scoped manifest behavior.
2. Keep service worker registration stable.
3. Verify install prompt UX does not block primary flows.
4. Check update and offline states for graceful user messaging.

Output:
- PWA-capable behavior remains stable and understandable.

DoD:
- [ ] No regression to install/update/offline flow.
- [ ] Manifest metadata and shortcuts remain coherent.

## Skill 5: SEO + GEO Discoverability
When to use:
- Any indexable page, article, topic page, or content template.

Required actions:
1. Define route metadata (title, description, canonical, OG/Twitter if applicable).
2. Ensure semantic HTML structure and clean heading hierarchy.
3. Add or validate structured data for relevant entities (Article, Organization, FAQ, etc.).
4. Optimize copy for GEO: direct answer-first sections, concise summaries, explicit terminology, and source trust signals.
5. Avoid metadata/content duplication across similar routes.

Output:
- Content discoverable by both traditional search engines and AI answer systems.

DoD:
- [ ] Metadata and canonical signals are correct.
- [ ] Structured data and page semantics are valid and consistent.
- [ ] GEO-oriented content clarity is present (answer-first + context signals).

## Skill 6: Bilingual Localization (`it/en`)
When to use:
- Any user-facing content, UI copy, route, or metadata change.

Required actions:
1. Update both Italian and English versions of affected strings/content.
2. Keep parity in functionality and UX across languages.
3. Ensure locale-specific metadata is complete for both languages when localized.
4. Validate that CTAs and critical instructions preserve meaning in translation.

Output:
- Stable bilingual experience without language drift.

DoD:
- [ ] `it/en` strings/content updated together.
- [ ] No locale-specific feature regressions.
- [ ] No placeholder or partially translated UX text.

## Skill 7: Performance Engineering
When to use:
- New UI sections, image-heavy pages, or client interactivity.

Required actions:
1. Prefer Server Components.
2. Use `next/image` and lazy loading where appropriate.
3. Avoid unnecessary client-side state and effects.
4. Keep component size manageable; split by responsibility.

Output:
- Low-overhead rendering with better Core Web Vitals posture.

DoD:
- [ ] No avoidable hydration-heavy patterns.
- [ ] Non-critical code deferred.

## Skill 8: Type Safety & Validation
When to use:
- API routes, form handling, external integrations, content parsing.

Required actions:
1. Define strict TypeScript contracts.
2. Validate external input with Zod.
3. Normalize and guard data before rendering.

Output:
- Predictable behavior with explicit runtime constraints.

DoD:
- [ ] No `any` introduced.
- [ ] Input boundaries validated.

## Skill 9: Testing & Regression Safety
When to use:
- Utility logic changes, interactive flows, bug fixes.

Required actions:
1. Add or update unit tests for transformed/business data.
2. Add component tests for critical interactive behavior.
3. Run `npm run lint` and relevant tests.

Output:
- Changes protected against known regressions.

DoD:
- [ ] Tests cover key risk points.
- [ ] Lint/tests pass locally for changed scope.

## Skill 10: Documentation
When to use:
- Always, for every meaningful feature or refactor.

Required actions:
1. Create/update feature spec using `spec_dev.md`.
2. Document architecture decisions and extension points.
3. Document UX states and responsive behavior.
4. Document PWA impact when relevant.
5. Document SEO/GEO impact and discoverability decisions.
6. Document bilingual `it/en` impact and localization notes.
7. Update `README.md` for user-facing setup or workflow changes.

Output:
- Feature is maintainable by future contributors without tribal knowledge.

DoD:
- [ ] Documentation updated in the same change.
- [ ] Rationale captured (why), not only implementation details (what).

## Skill 11: Environments & Deployments (Test vs Prod)
When to use:
- Any change that affects config, external integrations, or runtime behavior.
- Any backend route that touches third-party services or secrets.

Required actions:
1. Identify deploy targets impacted: `development` (test) vs `production`.
2. Ensure Firebase Hosting targets remain deployable (`firebase.json`, `.firebaserc`).
3. Confirm env var expectations and secret scopes (no accidental prod secrets in test).
4. Add a minimal smoke-test checklist and a rollback note to the spec/runbook.

Output:
- Predictable deploys with explicit target selection and low risk of configuration drift.

DoD:
- [ ] Deploy target(s) and env var notes documented.
- [ ] Deploy commands verified for the intended target.

## Recommended Skill Sequence
For most product features:
1. Architecture & Modularity
2. Type Safety & Validation
3. UX/UI System & Brand Consistency
4. Responsive & Accessible Experience
5. PWA Readiness (if `/learn` scope)
6. SEO + GEO Discoverability
7. Bilingual Localization (`it/en`)
8. Performance Engineering
9. Testing & Regression Safety
10. Documentation
11. Environments & Deployments (when relevant)
