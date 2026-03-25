# Brainstorming: Admin Server-Side Auth

## 1. Request Snapshot
- Feature/page name: Server-side authentication and authorization for `/admin/*`
- Requested on: 2026-03-25
- Requested by: user
- Status: `approved`
- Related docs/specs:
  - `docs/admin-compliance-hub.md`
  - `docs/compliance-changelog.md`
  - `docs/gdpr-feature-checklist.md`
  - `docs/privacy-processing-inventory.md`
  - `components/auth/AdminGuard.tsx`
  - `app/admin/layout.tsx`
  - `app/api/admin/compliance-docs/route.ts`

## 2. Goal
- What problem are we solving?
  - Today `/admin/*` is protected mainly at the client layer, while `/api/admin/*` is protected server-side. This creates an inconsistent security posture and still exposes admin route shells before auth is resolved in the browser.
- Why now?
  - Production verification on 2026-03-25 showed that `/admin/compliance` was publicly reachable as HTML shell even though admin data stayed protected behind authenticated APIs.
- Expected outcome:
  - Unauthenticated or non-admin users should be rejected before admin pages render.
  - Admin page protection should match API protection.
  - The login flow should still support redirecting back to the intended admin route after successful sign-in.

## 3. Non-Goals
- Replacing Firebase Auth with another auth provider.
- Rebuilding the whole user auth model for all protected user pages.
- Changing public site UX, SEO, or bilingual copy outside what is strictly needed for admin auth.
- Changing GDPR or AI Act business logic for existing admin documents.

## 4. Assumptions
- Assumption 1:
  - Existing admin users are authenticated via Firebase client auth and can obtain valid ID tokens today.
- Assumption 2:
  - A server-verifiable session cookie or equivalent `httpOnly` cookie can be introduced without breaking current public login flows.
- Assumption 3:
  - `/admin/*` should be treated as non-indexable internal surface only.

## 5. Open Questions
- Question 1:
  - Do we want server-side auth only for `/admin/*` in this iteration, or do we also want to generalize the same pattern to other protected user routes later?
- Question 2:
  - Is the preferred denial behavior a redirect to `/signin?redirect=...` for unauthenticated users and `403` for authenticated non-admin users, or should both cases redirect away?
- Question 3:
  - Do we want middleware enforcement, server layout/page enforcement, or both?

## 6. Affected Surfaces
- Routes/pages:
  - `/admin`
  - `/admin/compliance`
  - `/admin/reviews`
  - `/admin/reviews/[id]`
  - `/admin/users`
  - `/admin/badges`
  - `/admin/contributions`
  - `/admin/role-fit`
  - `/signin`
- Components:
  - `components/auth/AdminGuard.tsx`
  - `components/auth/FirebaseAuthProvider.tsx`
  - `components/auth/GoogleSignInButton.tsx`
  - `components/admin/AdminSidebar.tsx`
- APIs/server functions:
  - New server-side auth/session endpoints likely needed for creating and revoking admin session cookies
  - Existing `/api/admin/*` endpoints should remain protected as defense in depth
- Data stores:
  - Auth/session cookies in browser
  - Firebase Auth verification on server
- Third-party services/vendors:
  - Firebase Authentication
  - Firebase Admin SDK
- Existing docs that will need updates:
  - `docs/admin-compliance-hub.md`
  - `docs/compliance-changelog.md`
  - `docs/gdpr-feature-checklist.md`
  - `docs/privacy-processing-inventory.md`
  - likely `spec_dev.md`
  - likely an auth/admin runbook doc if session handling is introduced

## 7. User Experience Direction
- Primary audience:
  - Internal admins only
- Primary journey:
  - User attempts to open `/admin/*` -> server checks admin session -> allow render or redirect/block before page content is served
- Key states: `loading | empty | error | success`
  - Loading should move away from route-level auth gating and be limited to in-page data loads after server authorization succeeds.
  - Error/denied state should be deterministic and not rely on client hydration.
- Mobile considerations:
  - Admin routes remain usable on mobile, but auth gating should not depend on JS timing or viewport behavior.
- Accessibility considerations:
  - Redirect/denial flow should not trap keyboard users.
  - Any `403` page should expose a clear heading and actionable navigation.

## 8. SEO/GEO Direction
- Indexable route: `no`
- Metadata impact:
  - Keep admin routes `noindex, nofollow`.
- Structured data impact:
  - None expected.
- Answer-first / GEO notes:
  - None; internal-only surface.

## 9. Bilingual Scope (`it/en`)
- Affected languages:
  - `/admin/*` is internal-only surface and does not require bilingual parity.
  - If this work changes shared public sign-in messages or shared auth copy outside `/admin/*`, those public strings still require `it/en` parity.
- New UI/content strings:
  - Potentially `403` or admin-session-related copy on internal admin surfaces only.
- Translation risks/notes:
  - No bilingual requirement for admin-only route copy.
  - Translation review is required only if shared public auth strings are changed.

## 10. Data and Privacy Screening
- Personal data involved: `yes`
- Data categories:
  - Auth identifiers, email, uid, technical session cookie identifiers, token/session timestamps
- Purpose of processing:
  - Restrict access to internal admin surfaces and align page access control with current server-side API controls
- Consent/legal basis assumptions:
  - No new consent expected; security/access control is likely covered by legitimate interest and service security requirements
- Retention/deletion/export implications:
  - Session lifetime, renewal, invalidation, and logout behavior must be defined explicitly
- Vendors/subprocessors involved:
  - Firebase Authentication / Firebase Admin SDK
- GDPR follow-up required: `yes`
  - This feature changes auth/session processing and therefore requires the GDPR gate before implementation

## 11. Technical Direction
- Proposed implementation approach:
  - Introduce server-verifiable admin session cookies backed by Firebase Auth.
  - On successful client sign-in, exchange ID token for secure `httpOnly` session cookie via server endpoint.
  - Enforce `/admin/*` access in server layer using cookie verification and `isAdmin`.
  - Keep `/api/admin/*` auth checks in place as defense in depth.
  - Simplify or remove route-level dependence on `AdminGuard` for authorization, keeping it only if needed for client-side UX polish.
- Reuse opportunities:
  - Reuse existing Firebase Admin verification utilities in `lib/firebase/server-auth.ts`
  - Reuse existing `isAdmin` allowlist logic
  - Reuse existing `/signin?redirect=...` redirect contract
- Risks/tradeoffs:
  - Requires auth/session architecture work, not just page-level patching
  - Risk of broken login/logout flows if cookie lifecycle is not fully handled
  - Middleware-based verification may add complexity around cookie parsing and redirects
- Alternative approaches considered:
  - Keep client-only gating plus hardening: lowest effort, but still weaker posture
  - Middleware-only redirect without session cookie: not viable with current Bearer-token-only model
  - Full SSR auth redesign for all protected routes: stronger long-term, but too large for this iteration

## 12. Validation Plan
- Unit/backend tests:
  - Session create/revoke endpoints
  - Server-side admin verification helpers
  - Redirect/forbidden behavior for `/admin/*`
- UI/usability tests:
  - Sign-in then return to requested admin route
  - Logout removes access to `/admin/*`
  - Non-admin authenticated user gets denied cleanly
- E2E/critical journey checks:
  - Anonymous -> `/admin/compliance` -> redirected to `/signin`
  - Admin sign-in -> redirected back to `/admin/compliance`
  - Non-admin sign-in -> receives deny flow, no admin data exposed
- Manual QA notes:
  - Re-run production `curl` checks on `/admin/*`
  - Verify `/api/admin/compliance-docs` still returns `401/403` without proper auth

## 13. Documentation Plan
- Page docs to update:
  - `docs/admin-compliance-hub.md`
- Feature docs to update:
  - auth/admin access documentation if not already present
  - `spec_dev.md`
- Runbook/legal/privacy docs to update:
  - `docs/gdpr-feature-checklist.md`
  - `docs/privacy-processing-inventory.md`
  - `docs/compliance-changelog.md`
  - possibly privacy/legal translations if any user-facing auth/session disclosure changes

## 14. Confirmation Gate
- Summary to share with user:
  - Proposed direction: add Firebase-backed server-verifiable session cookies for `/admin/*`, enforce admin access before page render, keep API protection as defense in depth, and update privacy/compliance docs in the same change.
- Confirmation received: `yes`
- Confirmation date: 2026-03-25
