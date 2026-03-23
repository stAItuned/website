# Contributor Agreement Policy

## Scope
This document defines how contributor agreements are stored and validated.

## Source of Truth
- Agreements are stored in `contributions` documents.
- No extra agreement collection is introduced, to avoid duplicated data structures.

## Signature Rules
- One user can sign at most one agreement per version.
- One user can have at most two distinct signed versions in total.
- If a user tries to sign again the same version, the request is treated as idempotent and no new signature is persisted.
- If a user tries to sign a third distinct version, the API returns `409`.

## Current Enforcement Point
- API: `POST /api/contributor/save-progress`
- Policy module: `lib/contributor/agreementPolicy.ts`

## Deletion Policy
- Account/data deletion removes user-related Firestore records and writer profile metadata, with one documented default exception.
- Signed contributor agreements inside `contributions.agreement` follow `legal_exception` by default for contractual defense/accountability.
- Runtime behavior on `POST /api/account/delete`:
  - unsigned contribution records: hard delete;
  - signed agreement records: contributor identity is pseudonymized (`contributorId`/`contributorEmail`), agreement evidence is retained with rationale, and non-essential draft/interview fields are removed.
- Legal exception rationale source: `CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION` in `lib/privacy/retention-policies.ts`.
- Legal exception review window: 10 years from agreement acceptance (`legal_retention_review_due_at`), unless a documented legal hold applies.
- Collection `articles` is preserved.
