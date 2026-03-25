# SKILLS.md

## Purpose
This file defines execution skills used to implement features consistently in this repository.

Use these skills as checklists. For each feature, apply only the necessary skills, but always include `Documentation` at the end. For every new feature or page, start with `Feature Brainstorming & Confirmation`. For any change with data/privacy impact, include `Privacy & GDPR Readiness` before implementation. For any AI-enabled feature or AI behavior change, include `AI Act Readiness` before implementation. For bug fixes, issue remediation, regressions, and suspicious workarounds, explicitly perform a root-cause pass and an architecture-fit pass before implementation by using the general review skills `root-cause-reviewer` and `repo-architecture-reviewer`.

## Skill 1: Architecture & Modularity
When to use:
- New feature or refactor touching multiple components.
- Existing duplication across UI or logic layers.
- Bug fix or issue resolution that may belong in a shared or lower-level architectural boundary.

Required actions:
1. Map the feature to atomic layers: atom, molecule, organism, page.
2. Extract shared logic into `lib/` and shared UI into `components/ui/`.
3. Keep route files focused on composition, not heavy business logic.
4. Add typed extension points instead of duplicating components.
5. Confirm the change is implemented in the owning layer and does not create new cross-layer leakage or duplicated rules.

Output:
- Clear component boundaries.
- Reduced duplication with reusable primitives and variants.

DoD:
- [ ] No copy-pasted UI blocks when a base component can be extended.
- [ ] Extension implemented via typed props/variants.
- [ ] Logic is placed in the architectural layer that owns the behavior.

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
6. For articles, maintain update trust signals: keep `updatedAt` current, mirror it to structured data (`dateModified`), and append a changelog entry for meaningful changes.
7. For data-driven/snapshot articles, maintain `asOf` as the external-data observation date; when snapshot values change, update both `asOf` and `updatedAt` and append a changelog entry.

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
- Backend function changes and API route updates.

Required actions:
1. For bug fixes and issue remediation, identify the root cause and confirm the proposed change fixes the cause, not only the symptom.
2. Add or update unit tests for transformed/business data.
3. Add backend/API tests for server functions and route handlers.
4. Add component/UI tests for critical interactive and usability behavior.
5. Add/maintain E2E coverage for the most important user journeys.
6. Run `npm run lint` and relevant tests.
7. If agent-assisted: require self-check + evidence (commands + outputs summary).

Output:
- Changes protected against known regressions.

DoD:
- [ ] The fix addresses the identified root cause or the temporary workaround is documented with recurrence risk.
- [ ] Backend/API functions touched by the change are tested.
- [ ] UI usability interactions touched by the change are tested.
- [ ] Critical journey E2E coverage is present or updated.
- [ ] Tests cover key risk points.
- [ ] Lint/tests pass locally for changed scope.

## Skill 10: Documentation
When to use:
- Always, for every meaningful feature or refactor.

Required actions:
1. Create/update feature spec using `spec_dev.md`.
2. Update documentation for every affected page and every affected feature, not only the main implementation area.
3. Document architecture decisions and extension points.
4. Document UX states and responsive behavior.
5. Document PWA impact when relevant.
6. Document SEO/GEO impact and discoverability decisions.
7. Document bilingual `it/en` impact and localization notes.
8. Document privacy/GDPR impact whenever data handling, tracking, consent, retention, export, deletion, or third-party exposure changes.
9. Update `README.md` for user-facing setup or workflow changes.
10. If agent-assisted: record (a) what quality gates were used, (b) what was verified.
11. For article/content updates: bump `updatedAt`, keep `asOf` in sync for snapshot-driven pages, add a changelog entry, and keep `it/en` parity for both metadata and changelog when the article is localized.

Output:
- Feature is maintainable by future contributors without tribal knowledge.

DoD:
- [ ] Documentation updated in the same change.
- [ ] Every affected page/feature document is updated or explicitly created.
- [ ] Rationale captured (why), not only implementation details (what).

## Skill 11: Privacy & GDPR Readiness
When to use:
- Any change that introduces or modifies analytics, tracking, personal data, user identifiers, forms, auth, third-party integrations, storage, retention, deletion, export, consent, or data sharing.

Required actions:
1. Identify the processing activity and the data categories involved.
2. Record purpose, role assumptions (controller/processor where relevant), and lawful basis assumptions.
3. Check consent, disclosure, retention, deletion, export, and user-rights handling impacts.
4. Check vendor/subprocessor exposure, transfers, and telemetry leakage risks.
5. Document the implementation constraints and required privacy artifacts before coding continues.

Output:
- Feature has an explicit GDPR implementation path instead of an implicit post-hoc review.

DoD:
- [ ] GDPR-relevant data flows and obligations are documented before implementation.
- [ ] Open privacy decisions or missing legal/operational inputs are surfaced explicitly.

## Skill 12: AI Act Readiness
When to use:
- Any change that introduces or modifies AI systems, GenAI features, model integrations, recommendations, scoring, automated outputs, agentic workflows, synthetic content, or user-facing AI claims.

Required actions:
1. Identify whether the feature is AI-enabled and what workflow or decision the AI output influences.
2. Record the likely practical posture: prohibited-risk concern, high-risk concern, transparency-limited-risk concern, minimal-risk/internal tooling concern, or unclear-needs-review.
3. Check user transparency, labeling, human oversight, override/fallback, and operational escalation requirements.
4. Check vendor/model dependencies, prompt sensitivity, auditability, and documentation obligations.
5. Document the implementation constraints and required AI Act artifacts before coding continues.

Output:
- Feature has an explicit AI Act implementation path instead of an implicit post-hoc review.

DoD:
- [ ] AI-enabled posture and obligations are documented before implementation.
- [ ] Open AI governance, transparency, or oversight gaps are surfaced explicitly.

## Skill 13: Environments & Deployments (Test vs Prod)
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

## Skill 14: Feature Brainstorming & Confirmation
When to use:
- Every request for a new feature or a new page.

Required actions:
1. Create a brainstorming markdown file at `docs/brainstorms/YYYY-MM-DD-<slug>.md` before implementation.
2. Capture goal, non-goals, assumptions, constraints, affected routes/components/data, SEO/GEO implications, bilingual implications, and testing approach.
3. If the feature touches data/privacy, include the initial GDPR implementation analysis in the brainstorming document.
4. If the feature is AI-enabled, include the initial AI Act implementation analysis in the brainstorming document.
5. Share the proposed direction and ask the user for confirmation before writing implementation code.

Output:
- A reviewable implementation direction with explicit assumptions and risks.

DoD:
- [ ] Brainstorming `.md` created before coding.
- [ ] User confirmation obtained before implementation.

## Recommended Skill Sequence
For most product features:
1. Feature Brainstorming & Confirmation (new feature/page only)
2. Architecture & Modularity
3. Type Safety & Validation
4. Privacy & GDPR Readiness (when data/privacy is involved)
5. AI Act Readiness (when AI-enabled behavior is involved)
6. UX/UI System & Brand Consistency
7. Responsive & Accessible Experience
8. PWA Readiness (if `/learn` scope)
9. SEO + GEO Discoverability
10. Bilingual Localization (`it/en`)
11. Performance Engineering
12. Testing & Regression Safety
13. Documentation
14. Environments & Deployments (when relevant)
