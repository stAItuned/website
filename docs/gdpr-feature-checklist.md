# GDPR Feature Checklist

Use this checklist before implementing any feature or change that introduces or modifies analytics, tracking, auth, forms, personal data processing, storage, sharing, retention, export, deletion, consent, or third-party integrations.

## Latest Completed Review (Admin Server-Side Auth)

### 1. Processing Snapshot
- Feature/change: Firebase-backed server-side auth and authorization for `/admin/*`
- Date: 2026-03-25
- Owner: stAItuned engineering
- Status: `approved`
- Related brainstorming/spec: `docs/brainstorms/2026-03-25-admin-server-side-auth.md`

### 2. Processing Activity
- Trigger: authenticated user attempts to access `/admin/*`
- Purpose: block anonymous and non-admin users before admin page render, align page access control with existing server-side API controls
- Type: auth/session processing hardening
- Systems: Firebase Auth client sign-in, server-side session cookie issuance/revocation, proxy-based admin gating, server-side admin layout verification

### 3. Data Inventory
- Personal data categories: account email, name, profile picture, uid, Firebase ID token, technical session cookie
- Special-category data involved: `no`
- User identifiers involved: email, uid, session cookie identifier
- Free-text fields involved: `no`
- Data source: Google Sign-In / Firebase Authentication

### 4. Role and Legal Basis
- stAItuned role: `controller`
- Legal basis assumption: service authentication + legitimate interest for security and access control on internal admin areas
- Is consent required: `no`
- Consent handling: not applicable; this is security/authentication processing required to operate protected admin routes

### 5. Transparency
- Privacy policy update required: `yes`
- Cookie policy update required: `yes`
- Terms/UX disclosure update required: `no`
- User-facing disclosure copy updated: auth section and technical cookie section now mention secure session cookies for authenticated/reserved areas

### 6. Retention and Lifecycle
- Retention window: session cookie max 12 hours
- Deletion/anonymization rule: immediate cookie clear on logout and on invalidation path
- Export/access implications: none beyond existing account auth data
- Rectification implications: unchanged
- End-of-contract / end-of-purpose handling: no dedicated persistent session datastore introduced in this iteration

### 7. Vendors and Transfers
- Vendors/subprocessors involved: Firebase Authentication, Firebase Admin SDK
- Countries/transfer implications: unchanged from existing Firebase setup
- Cleartext access by vendor/internal team: limited to authentication/session infrastructure already in use
- Additional contracts or DPA checks required: `no` new providers introduced

### 8. Security and Minimization
- Minimum required fields: Firebase session cookie plus existing Firebase user identifiers
- Optional fields removed: none
- Logging/telemetry impact: no new analytics introduced
- Access control requirements: `/admin/*` now gated before render, with `/api/admin/*` checks preserved as defense in depth
- Secrets/config changes: no new secrets beyond existing Firebase Admin credentials

### 9. User Rights and Operations
- DSAR impact: negligible incremental impact; auth/session processing remains bounded and ephemeral
- Support/runbook impact: admin access troubleshooting should consider session cookie creation/logout behavior
- Backfill/migration impact: none
- Monitoring/audit trail needs: rely on existing auth/provider logs; no new session database

### 10. Risk Review
- Main privacy risks: stale or invalid session cookies causing inconsistent access expectations
- Main legal/accountability risks: missing disclosure of secure auth/session cookie usage
- Mitigations required before release: privacy/cookie policy wording updated, session TTL bounded to 12h, logout clears cookie
- DPIA screening needed: `no`
- Blocking unknowns: none

### 11. Documentation Updates
- Docs to update:
  - `docs/privacy-processing-inventory.md`
  - `docs/compliance-changelog.md`
  - `docs/admin-compliance-hub.md`
  - `spec_dev.md`
- Legal text files to update:
  - `lib/i18n/legal-translations.ts`
- Runbooks/specs to update:
  - `docs/gdpr-feature-checklist.md`

### 12. Approval Gate
- Reviewer: GDPR/privacy implementation gate (`gdpr-feature-gate`)
- Decision: `approved`
- Notes: admin-only surface does not require bilingual parity, but public legal/cookie copy remains aligned `it/en`.

## Latest Completed Review (Workstream 7 - Residual Gaps Closure + WS7-E)

### 1. Processing Snapshot
- Feature/change: WS7 execution wave (`A -> D -> B -> C -> E`)
- Date: 2026-03-23
- Owner: stAItuned engineering
- Status: `approved_with_go_live_gate`
- Related spec: `plan.md` -> "Workstream 7 - Chiusura gap residui fuori governance"

### 2. Included Surfaces
- Lead flows:
  - `POST /api/leads/ai-act`
  - `POST /api/career-os/apply`
  - `POST /api/career-os/audit`
- Rights/account:
  - `POST /api/account/delete`
- Public push:
  - `POST /api/notifications/register`
  - `DELETE /api/notifications/register`
  - `POST /api/notifications/subscribe`
  - `POST /api/notifications/unsubscribe`
- Contributor lifecycle:
  - `POST /api/contributor/save-progress` (policy/deletion alignment)

### 3. Data Inventory / Retention Delta
- Added in retention policy map:
  - `leads_ai_act_tools`
  - `career_os_applications`
  - `career_os_audit`
  - `fcm_tokens`
- Added token lifecycle check for AI EU Act access token expiry.
- Added DSAR mapping output in account deletion response (`datasetCoverage`).

### 4. Minimization and Rights
- Telegram payloads in WS7-A flows moved to metadata-only.
- Public push tokens now have explicit retention lifecycle and status transitions.
- Account deletion now separates:
  - self-service automatic cleanup on account-bound datasets
  - assisted DSAR for non account-bound datasets (`fcm_tokens`, `leads_ai_act_tools`).
- Contributor agreement signed evidence follows default `legal_exception`.

### 5. Documentation Artifacts Updated In Wave
- `docs/privacy-processing-inventory.md`
- `docs/privacy-retention-schedule.md`
- `docs/compliance-changelog.md`
- `docs/ai-eu-act-landing.md`
- `docs/contributor-agreement-policy.md`
- `docs/runbooks/dsar-account-deletion.md`

### 6. Open Validation Before Approval
- Completed validations:
  - lint/typecheck and targeted route tests passed for WS7 touched surfaces
  - legal copy parity `it/en` updated on WS7-E impacted sections
  - retention dry-run confirmed `missingRetentionCount=0` on WS7 datasets
  - contributor agreement legal exception metadata persisted with review due date
  - `account/delete` includes evidence-minimum retention and dataset-specific error tracking

### 7. DPIA Screening (WS7-E)
- Screening decision: `DPIA not required (current scope)`
- Rationale:
  - no new high-risk profiling or automated decisioning introduced by WS7-E;
  - changes reduce risk by minimization, retention-bound legal exception, and stronger DSAR accountability;
  - no new special-category processing introduced.
- Re-open trigger:
  - if contributor/legal-evidence flow expands to new categories, large-scale enrichment, or automated high-impact decisions.

### 8. Approval Gate
- Reviewer: GDPR/privacy implementation gate (`gdpr-feature-gate`) + bilingual parity gate (`localized-page-change-check`)
- Decision: `approved_with_go_live_gate`
- Notes: technical/documental GDPR gate passed; production go-live remains conditional on completing `docs/runbooks/ws7e-go-no-go-prod.md`.

## WS4 Enforcement Rule (Blocking for privacy-related PRs)

For any GDPR/privacy-related PR, approval is allowed only if all are true:
- `docs/privacy-processing-inventory.md` is updated for touched high-risk flows.
- `docs/compliance-changelog.md` includes the current wave entry.
- legal/i18n parity checks are completed (including `localized-page-change-check` when user-facing copy changed).

If any item above is missing, gate decision must be `needs changes`.

## Latest Completed Review (Newsletter Decommission)

### 1. Processing Snapshot
- Feature/change: Workstream 2 newsletter decommission + legacy dataset hard delete
- Date: 2026-03-22
- Owner: stAItuned engineering
- Status: `approved`
- Related brainstorming/spec: `plan.md` -> "Workstream 2 - Dismissione newsletter e CTA topics"

### 2. Processing Activity
- Trigger: operational decommission procedure on legacy collection `newsletter_subscribers`
- Purpose: minimization and end-of-purpose closure of newsletter marketing processing
- Type: change to existing processing (decommission)
- Systems: Next.js API tombstone route + Firestore Admin cleanup script + compliance evidence write

### 3. Data Inventory
- Personal data categories: email, user agent, referrer, timestamps (legacy only)
- Special-category data involved: `no`
- User identifiers involved: email
- Free-text fields involved: `no`
- Data source: `user provided` (historical records)

### 4. Role and Legal Basis
- stAItuned role: `controller`
- Legal basis assumption: GDPR art.5 minimization + storage limitation + end-of-purpose handling
- Is consent required: `no` for decommission operation itself (processing shutdown)
- Consent handling: new newsletter consent is no longer collected; `POST /api/newsletter/subscribe` returns `410`

### 5. Transparency
- Privacy policy update required: `yes` (completed in `lib/i18n/legal-translations.ts`)
- Cookie policy update required: `no` (newsletter not cookie-based; cookie section already aligned)
- Terms/UX disclosure update required: `yes` (completed: newsletter dismissed, CTA moved to topics)
- User-facing disclosure copy updated: newsletter inactive; service communications only when user-requested in active flows

### 6. Retention and Lifecycle
- Retention window: none for newsletter dataset after decommission
- Deletion/anonymization rule: hard delete all docs in `newsletter_subscribers`
- Export/access implications: historical newsletter export no longer applicable after deletion
- Rectification implications: no future rectification flow needed for dismissed dataset
- End-of-contract / end-of-purpose handling: completed via irreversible delete (no PII backup)

### 7. Vendors and Transfers
- Vendors/subprocessors involved: Firebase/Firestore only (for cleanup operation)
- Countries/transfer implications: unchanged from existing Firebase setup
- Cleartext access by vendor/internal team: `yes` before delete (legacy operational access), then removed by deletion
- Additional contracts or DPA checks required: `no` additional checks for this closure step

### 8. Security and Minimization
- Minimum required fields: none retained post-delete
- Optional fields removed: all newsletter dataset fields
- Logging/telemetry impact: removed newsletter-specific app flow; only aggregate compliance evidence stored
- Access control requirements: production Firestore admin IAM required for cleanup
- Secrets/config changes: none required

### 9. User Rights and Operations
- DSAR impact: reduced scope (newsletter dataset removed)
- Support/runbook impact: new runbook `docs/runbooks/newsletter-decommission.md`
- Backfill/migration impact: not applicable; decommission operation only
- Monitoring/audit trail needs: aggregate evidence per run in Firestore without PII

### 10. Risk Review
- Main privacy risks: incomplete delete or accidental reactivation of newsletter paths
- Main legal/accountability risks: mismatch between declared dismissal and residual data persistence
- Mitigations required before release: endpoint tombstone `410`, script with safeguards, evidence log, docs alignment
- DPIA screening needed: `no` (processing reduced/eliminated; no new profiling or high-risk expansion)
- Blocking unknowns: none, pending operational execution in production

### 11. Documentation Updates
- Docs to update:
  - `plan.md`
  - `docs/gdpr-audit-webapp-2026-03-22.md` (historical note)
  - `docs/runbooks/newsletter-decommission.md`
- Legal text files to update:
  - `lib/i18n/legal-translations.ts`
- Runbooks/specs to update:
  - `docs/gdpr-feature-checklist.md`

### 12. Approval Gate
- Reviewer: GDPR/privacy implementation gate (`gdpr-feature-gate`) + bilingual parity gate (`localized-page-change-check`)
- Decision: `approved`
- Notes: approval is implementation-complete; production delete execution remains operational step with evidence capture.

## Latest Completed Review (Role Fit Audit - Strategy A Hardening)

### 1. Processing Snapshot
- Feature/change: Workstream 3 Strategy A hardening on `role_fit_audit` flow
- Date: 2026-03-22
- Owner: stAItuned engineering
- Status: `approved`
- Related brainstorming/spec: `plan.md` -> "Workstream 3 - Role Fit Audit conforme e ridotto nel rischio"

### 2. Processing Activity
- Trigger: user submits Role Fit Audit form
- Purpose: generate personalized report and operate follow-up service flow with minimized internal notifications
- Type: hardening of existing processing activity
- Systems: Next.js API submit route + Firestore + AI generation + email delivery + Telegram metadata alerts

### 3. Data Inventory
- Personal data categories: email, optional name, optional social link, questionnaire answers, result scores
- Special-category data involved: `no`
- User identifiers involved: email, submission id
- Free-text fields involved: `limited` (name/link)
- Data source: `user provided` + `inferred` (AI report output)

### 4. Role and Legal Basis
- stAItuned role: `controller`
- Legal basis assumption: consent for Role Fit submission/report + legitimate interest for service operations safeguards
- Is consent required: `yes`
- Consent handling: server enforces `acceptedPrivacy === true`, stores structured consent (`consent.privacy.acceptedAt/version`) and marketing request flag

### 5. Transparency
- Privacy policy update required: `yes` (Role Fit section + retention + minimized internal channels)
- Cookie policy update required: `no`
- Terms/UX disclosure update required: `yes` (form microcopy and legal wording)
- User-facing disclosure copy updated: admin access scope, 12-month retention, revocation/deletion contact

### 6. Retention and Lifecycle
- Retention window: 12 months (`retentionUntil` on each submission)
- Deletion/anonymization rule: lifecycle hook deferred to WS5, retention marker active now
- Export/access implications: unchanged in this wave
- Rectification implications: unchanged in this wave
- End-of-contract / end-of-purpose handling: record-level retention marker applied

### 7. Vendors and Transfers
- Vendors/subprocessors involved: Firebase/Firestore, Resend, Telegram, Google Gemini
- Countries/transfer implications: unchanged from existing vendor stack
- Cleartext access by vendor/internal team: reduced (Telegram moved to metadata-only, no full report CC)
- Additional contracts or DPA checks required: no new providers introduced

### 8. Security and Minimization
- Minimum required fields: consent fields, scores/result summary, operational metadata
- Optional fields that can be removed: future reduction of raw answers (not in this wave per product decision)
- Logging/telemetry impact: internal notifications minimized to metadata-only
- Access control requirements: admin route remains auth+admin guarded
- Secrets/config changes: none required

### 9. User Rights and Operations
- DSAR impact: improved traceability through consent/version/retention metadata
- Support/runbook impact: DPIA screening doc added
- Backfill/migration impact: legacy submissions may lack new compliance fields
- Monitoring/audit trail needs: submission-level compliance fields now persisted

### 10. Risk Review
- Main privacy risks: legacy records without new compliance fields; admin exposure of raw answers
- Main legal/accountability risks: delayed lifecycle deletion job (WS5 dependency)
- Mitigations required before release: API consent enforcement + legal text alignment + metadata-only internal channels
- DPIA screening needed: `yes` (completed screening artifact in repo)
- Blocking unknowns: none for this wave

### 11. Documentation Updates
- Docs to update:
  - `plan.md`
  - `docs/dpia-screening-role-fit-audit.md`
- Legal text files to update:
  - `lib/i18n/legal-translations.ts`
  - `lib/i18n/role-fit-audit-translations.ts`
- Runbooks/specs to update:
  - `docs/gdpr-feature-checklist.md`

### 12. Approval Gate
- Reviewer: GDPR/privacy implementation gate (`gdpr-feature-gate`) + bilingual parity gate (`localized-page-change-check`)
- Decision: `approved`
- Notes: Strategy A hardening completed for current scope; retention lifecycle automation remains in WS5 backlog.

## Latest Completed Review (Workstream 4 - Strategy A + C)

### 1. Processing Snapshot
- Feature/change: repo-driven transparency model + layered notices for high-risk flows
- Date: 2026-03-22
- Owner: stAItuned engineering
- Status: `approved`
- Related brainstorming/spec: `plan.md` -> "Workstream 4. Trasparenza e documentazione"

### 2. Processing Activity
- Trigger: maintenance updates on legal docs, i18n notices and compliance inventory
- Purpose: keep policy/disclosure aligned with real code and vendors
- Type: governance hardening (no new data collection)
- Systems: legal i18n, form copy, compliance docs in admin, inventory docs in repo

### 3. Key Outputs In This Wave
- Added repo-driven inventory: `docs/privacy-processing-inventory.md`
- Added compliance changelog: `docs/compliance-changelog.md`
- Added contextual waitlist notice (`it/en`) in Career OS pricing modal
- Aligned payment providers in legal copy to `Stripe, PayPal`
- Added admin compliance hub entrypoints for operational documents
- Added WS4 blocking enforcement rule for privacy-related PR approvals

### 4. Open Validation Before Approval
- Completed manual code-vs-policy review for all `P4 Alto` flows (see matrix in `docs/privacy-processing-inventory.md`)
- Retention wording normalized for flows without technical lifecycle and explicitly tagged as WS5 tracked
- Final bilingual parity review completed on contextual/legal privacy copy touched in WS4

### 5. Approval Gate
- Reviewer: GDPR/privacy implementation gate (`gdpr-feature-gate`) + bilingual parity gate (`localized-page-change-check`)
- Decision: `approved`
- Notes: WS4 closed for transparency/documentation scope. Residual risk is limited to WS5 lifecycle automation (retention technical standardization), not documentation mismatch.

## Latest In-Progress Review (Workstream 5 - Strategy A MVP)

### 1. Processing Snapshot
- Feature/change: retention lifecycle framework centralization (MVP)
- Date: 2026-03-22
- Owner: stAItuned engineering
- Status: `in-review`
- Related brainstorming/spec: `plan.md` -> "Workstream 5. Retention, cancellazione e lifecycle dei dataset"

### 2. Processing Activity
- Trigger: lifecycle job execution (`dry-run` / `apply`) on in-scope collections
- Purpose: enforce explicit retention and delete expired records
- Type: governance + data lifecycle hardening
- Systems: Firestore collections + retention policy map + lifecycle script + runbook

### 3. Data Inventory (MVP Scope)
- `role_fit_audit_submissions`
- `career_os_waitlist`
- `business_demo_requests`
- `contact_requests`
- `feedback_submissions`
- `contributor_applications`

### 4. Key Outputs In This Wave
- Shared retention contract (`lib/privacy/retention.ts`)
- Dataset policy map (`lib/privacy/retention-policies.ts`)
- Lifecycle job with apply guardrails (`scripts/retention-lifecycle.ts`)
- Runbook + retention schedule docs
- Route writes standardized with `retentionUntil` + lifecycle metadata in scope datasets

### 5. Open Validation Before Approval
- Dry-run eseguito in test/prod e validato (`expiredCount = 0`; mismatch metadata iniziali identificati)
- Backfill metadata retention eseguito in test su record legacy (script dedicato)
- Dry-run post-backfill validato (`missingRetentionCount = 0` su tutti i dataset)
- Route regressions check completato (lint/typecheck/tests mirati verdi)
- Pending: first apply retention run con record effettivamente expired (attualmente nessun record scaduto)

### 6. Approval Gate
- Reviewer: GDPR/privacy implementation gate (`gdpr-feature-gate`) + engineering owner
- Decision: `in-review`
- Notes: default purge policy is hard delete; legal exceptions not active in MVP. Operational validation completed with zero expired records in current snapshot.

## Latest Completed Review (Workstream 6 - Strategy B Admin-Only PWA Notifications)

### 1. Processing Snapshot
- Feature/change: minimizzazione notifiche operative con canale admin-only PWA e dashboard come fonte unica dettaglio
- Date: 2026-03-23
- Owner: stAItuned engineering
- Status: `approved`
- Related brainstorming/spec: `plan.md` -> "Workstream 6. Minimizzazione dei dati verso canali terzi e interni"

### 2. Processing Activity
- Trigger: nuovi submit su form principali (role fit, waitlist, business, contact, feedback, contributors)
- Purpose: notificare il team admin senza propagare dati personali in canali esterni
- Type: hardening di processing esistente con minimizzazione dei payload
- Systems: route API form + FCM topic `admin-ops` + Firestore `fcm_admin_tokens` + dashboard admin

### 3. Data Inventory
- Personal data categories: token tecnico FCM, email admin allowlist, uid admin; eventi form restano in storage applicativo
- Special-category data involved: `no`
- User identifiers involved: token FCM tecnico, submission id
- Free-text fields involved: `no` nei payload notifiche
- Data source: `user provided` (form submit) + `technical generated` (token)

### 4. Role and Legal Basis
- stAItuned role: `controller`
- Legal basis assumption: legittimo interesse operativo con minimizzazione e controllo accessi admin
- Is consent required: `no` per canale operativo admin-only; permesso push browser richiesto lato admin device
- Consent handling: opt-in esplicito nel browser admin, register/unregister protetto da `verifyAdmin`

### 5. Transparency
- Privacy policy update required: `yes` (push admin-only metadata disclosed)
- Cookie policy update required: `yes` (sezione push aggiornata con distinzione editoriale/admin)
- Terms/UX disclosure update required: `yes` (card admin dedicata)
- User-facing disclosure copy updated: admin operational notifications keep metadata-only payloads; details remain in admin dashboard

### 6. Retention and Lifecycle
- Retention window: `fcm_admin_tokens` 90 giorni
- Deletion/anonymization rule: hard delete tramite WS5 lifecycle job
- Export/access implications: accesso limitato a admin autentificati in allowlist
- End-of-purpose handling: unregister imposta token inattivo, lifecycle rimuove record scaduti

### 7. Vendors and Transfers
- Vendors/subprocessors involved: Firebase/Firestore, Firebase Cloud Messaging, Telegram/Slack (metadata-only)
- Countries/transfer implications: invariato rispetto stack esistente
- Cleartext access by vendor/internal team: ridotto; payload notifiche senza PII utente
- Additional contracts or DPA checks required: no nuovi vendor

### 8. Security and Minimization
- Minimum required fields: `eventType`, `entityId`, `source`, `createdAt`, `url`, token tecnico admin
- Optional fields removed: email, nome, testo libero, userAgent dai payload notifiche operative
- Logging/telemetry impact: log tecnici senza PII
- Access control requirements: endpoint admin notifications protetti con bearer token Firebase + allowlist admin
- Secrets/config changes: nessuno oltre chiave VAPID già esistente

### 9. User Rights and Operations
- DSAR impact: ridotte copie in canali terzi; dettaglio concentrato in storage applicativo/admin
- Support/runbook impact: retention WS5 estesa a `fcm_admin_tokens` + runbook operativo WS6 admin push
- Monitoring/audit trail needs: monitor delivery/error rate admin push + verifica assenza PII nei payload

### 10. Risk Review
- Main privacy risks: admin token lifecycle non eseguito in apply finché assenza record expired
- Main legal/accountability risks: regressione futura su payload notifiche se non rispettata policy metadata-only
- Mitigations required before release: test unit payload + test API auth topic allowlist + docs inventory/changelog
- DPIA screening needed: `no` (riduzione del rischio e minimizzazione di processing esistente)
- Blocking unknowns: nessuno

### 11. Documentation Updates
- Docs to update:
  - `plan.md`
  - `docs/privacy-processing-inventory.md`
  - `docs/compliance-changelog.md`
  - `docs/privacy-retention-schedule.md`
  - `docs/runbooks/admin-pwa-operational-notifications.md`
- Legal text files to update:
  - `lib/i18n/legal-translations.ts`

### 12. Approval Gate
- Reviewer: GDPR/privacy implementation gate (`gdpr-feature-gate`) + engineering owner
- Decision: `approved`
- Notes: push utenti `/learn` resta separata (`new-articles`), canale operativo admin-only isolato su topic `admin-ops`.

## 1. Processing Snapshot
- Feature/change:
- Date:
- Owner:
- Status: `draft | in-review | approved | blocked`
- Related brainstorming/spec:

## 2. Processing Activity
- What user or internal action triggers the processing?
- What is the purpose?
- Is this a new processing activity or a change to an existing one?
- Which systems are involved end-to-end?

## 3. Data Inventory
- Personal data categories:
- Special-category data involved: `yes/no`
- User identifiers involved:
- Free-text fields involved: `yes/no`
- Data source: `user provided | inferred | imported | third-party`

## 4. Role and Legal Basis
- stAItuned role: `controller | processor | joint controller | mixed/needs review`
- Legal basis assumption:
- Is consent required? `yes/no`
- If consent is required, how is consent collected, stored, versioned, and revoked?

## 5. Transparency
- Privacy policy update required: `yes/no`
- Cookie policy update required: `yes/no`
- Terms/UX disclosure update required: `yes/no`
- User-facing disclosure copy to add/update:

## 6. Retention and Lifecycle
- Retention window:
- Deletion/anonymization rule:
- Export/access implications:
- Rectification implications:
- End-of-contract / end-of-purpose handling:

## 7. Vendors and Transfers
- Vendors/subprocessors involved:
- Countries/transfer implications:
- Cleartext access by vendor/internal team: `yes/no`
- Additional contracts or DPA checks required:

## 8. Security and Minimization
- Minimum required fields:
- Optional fields that can be removed:
- Logging/telemetry impact:
- Access control requirements:
- Secrets/config changes:

## 9. User Rights and Operations
- DSAR impact:
- Support/runbook impact:
- Backfill/migration impact:
- Monitoring/audit trail needs:

## 10. Risk Review
- Main privacy risks:
- Main legal/accountability risks:
- Mitigations required before release:
- DPIA screening needed: `yes/no`
- Blocking unknowns:

## 11. Documentation Updates
- Docs to update:
- Legal text files to update:
- Runbooks/specs to update:

## 12. Approval Gate
- Reviewer:
- Decision: `approved | needs changes | blocked`
- Notes:
