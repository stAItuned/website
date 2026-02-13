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
- Account/data deletion removes user-related Firestore records including contributor agreements and writer profile metadata.
- Collection `articles` is preserved.
