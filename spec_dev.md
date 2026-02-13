# spec_dev.md

## Feature Specification Template
Use this template for every meaningful feature, refactor, or architectural update.

## 1. Overview
- Feature name:
- Owner:
- Date:
- Status: `draft | in-progress | review | done`
- Related issue/PR:

## 2. Problem Statement
- Current behavior:
- Pain points:
- Why this matters for users/business:

## 3. Goals and Non-Goals
### Goals
- 

### Non-Goals
- 

## 4. User Experience Definition
- Primary user persona(s):
- Core user journey:
- Language scope: `it`, `en`, or `it+en` (default: `it+en`)
- Entry points (routes/components):
- UX states required:
  - Loading:
  - Empty:
  - Error:
  - Success:

## 5. Brand and Visual Alignment
- Brand assets/tokens used (`lib/brand.ts`, Tailwind tokens):
- Typography and spacing strategy:
- Motion/micro-interactions plan:
- Content tone requirements:

## 6. Information Architecture and Atomic Design
### Component breakdown
- Atoms:
- Molecules:
- Organisms:
- Route/page composition:

### Reuse strategy
- Existing components reused:
- New components introduced:
- Extension/override strategy (variants/props/className):
- Duplication avoided by:

## 7. Technical Design
- Route scope (`app/...`):
- Server vs Client component split:
- Data flow and state ownership:
- External dependencies/apis:
- Validation strategy (Zod schemas, runtime guards):
- Error handling strategy:

## 8. Responsiveness and Accessibility
- Breakpoints validated: `xs`, `sm`, `md`, `lg`, `xl`
- Mobile-specific behavior:
- Keyboard interaction model:
- ARIA/semantic requirements:
- Contrast/readability constraints:

## 9. PWA Impact (Mandatory for `/learn` Features)
- Affects manifest (`/learn-manifest.json`): `yes/no`
- Affects service worker behavior: `yes/no`
- Install flow impact:
- Offline behavior impact:
- Update prompt/versioning impact:

## 10. SEO and GEO Plan
- Route metadata plan (title, description, canonical, OG):
- Structured data plan (JSON-LD types):
- URL/content deduplication considerations:
- GEO plan (answer-first summaries, terminology clarity, trust signals):
- Indexing constraints (if any):

## 11. Bilingual Localization Plan (`it/en`)
- Affected languages:
- Content parity plan:
- UI string parity plan:
- Locale metadata parity plan:
- Translation ownership and review notes:

## 12. Performance Considerations
- Rendering strategy (RSC/SSR/CSR):
- Image/media optimization (`next/image`, formats, lazy loading):
- Hydration minimization plan:
- Monitoring/telemetry notes:

## 13. Testing Strategy
- Unit tests:
- Component tests:
- Integration/E2E considerations:
- Manual QA scenarios:

## 14. Documentation Deliverables
- Files to update in `docs/`:
- README updates required: `yes/no`
- TSDoc/JSDoc targets:
- Runbook or support notes:

## 15. Rollout and Risk Management
- Rollout plan:
- Deploy target(s): `development` (test) and/or `production`
- Environment config notes (secrets, third-party integrations, analytics):
- Backward compatibility concerns:
- Risk matrix:
  - Risk:
  - Severity:
  - Mitigation:
- Fallback/rollback strategy:

## 16. Acceptance Criteria (Definition of Done)
- [ ] Architecture is modular and atomic; no unnecessary duplication.
- [ ] Reusable components are extended via typed variants/props.
- [ ] Visual design uses approved brand tokens and style conventions.
- [ ] UX is complete across loading/empty/error/success states.
- [ ] Responsive behavior verified on mobile and desktop breakpoints.
- [ ] Accessibility baseline validated (keyboard/focus/labels/contrast).
- [ ] PWA behavior is preserved or improved for `/learn` scope.
- [ ] SEO foundations are complete (metadata, canonical, semantic structure).
- [ ] GEO foundations are complete (answer-first clarity + trust/context signals).
- [ ] Bilingual `it/en` parity is preserved for UX and content scope.
- [ ] Performance impact reviewed and acceptable.
- [ ] Tests cover critical logic and interactive paths.
- [ ] Documentation updated and maintainable.

## 17. Implementation Log (Optional During Execution)
- Decision 1:
- Decision 2:
- Tradeoff notes:
