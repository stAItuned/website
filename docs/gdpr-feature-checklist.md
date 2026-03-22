# GDPR Feature Checklist

Use this checklist before implementing any feature or change that introduces or modifies analytics, tracking, auth, forms, personal data processing, storage, sharing, retention, export, deletion, consent, or third-party integrations.

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
