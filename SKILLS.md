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

## Skill 5: Performance Engineering
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

## Skill 6: Type Safety & Validation
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

## Skill 7: Testing & Regression Safety
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

## Skill 8: Documentation
When to use:
- Always, for every meaningful feature or refactor.

Required actions:
1. Create/update feature spec using `spec_dev.md`.
2. Document architecture decisions and extension points.
3. Document UX states and responsive behavior.
4. Document PWA impact when relevant.
5. Update `README.md` for user-facing setup or workflow changes.

Output:
- Feature is maintainable by future contributors without tribal knowledge.

DoD:
- [ ] Documentation updated in the same change.
- [ ] Rationale captured (why), not only implementation details (what).

## Recommended Skill Sequence
For most product features:
1. Architecture & Modularity
2. Type Safety & Validation
3. UX/UI System & Brand Consistency
4. Responsive & Accessible Experience
5. PWA Readiness (if `/learn` scope)
6. Performance Engineering
7. Testing & Regression Safety
8. Documentation
