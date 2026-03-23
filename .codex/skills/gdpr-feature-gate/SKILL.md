---
name: gdpr-feature-gate
description: Run the mandatory GDPR and privacy implementation gate for this repository when a change introduces or modifies analytics, tracking, auth, forms, personal data, user identifiers, consent, retention, export, deletion, or third-party data sharing. Use this skill to fill or update docs/gdpr-feature-checklist.md context, identify legal and operational gaps before coding, and list the privacy/legal docs that must change.
---

# GDPR Feature Gate

Use this skill whenever a planned change affects data handling or privacy posture.

## WS4 Repo-Driven Maintenance (mandatory)

This skill is the single GDPR gate for WS4 Strategy A + C.  
Do not create parallel GDPR skills for the same governance scope.

### Additional Triggers (blocking for privacy-related PRs)
- changes to forms or APIs that handle personal data
- changes to vendors/subprocessors or data-sharing channels
- changes to retention/consent logic
- changes to legal/privacy copy or contextual notices shown to users

## Inputs
- feature request, brainstorming doc, or diff
- affected APIs, forms, analytics, vendors, or data stores
- existing legal/privacy docs when relevant
- `docs/privacy-processing-inventory.md`
- `docs/compliance-changelog.md`
- `lib/i18n/legal-translations.ts`
- `docs/gdpr-feature-checklist.md`

## Workflow
1. Read the request or brainstorming notes and identify the processing activity.
2. Use `docs/gdpr-feature-checklist.md` as the structure for the review.
3. Record the data categories, identifiers, purpose, role assumptions, legal basis assumptions, consent implications, retention/deletion/export impacts, vendor exposure, and transfer implications.
4. Map flows touched by the diff and update `docs/privacy-processing-inventory.md` for each high-risk flow.
5. Append/update `docs/compliance-changelog.md` for the current privacy wave.
6. Verify `lib/i18n/legal-translations.ts` is consistent with actual code (vendors, retention, channels, claims).
7. If user-facing copy changed, run `localized-page-change-check` and include its outcome in the GDPR gate output.
8. Identify which disclosures and internal docs need updates (policy text, runbooks, page/feature docs).
9. Surface blockers clearly when legal basis, consent capture, retention, or DSAR handling is undefined.
10. Treat unresolved privacy gaps as a stop condition for implementation.

## Required Checks
- Explicitly state whether personal data is involved.
- Explicitly state whether consent is required and how it will be stored and revoked.
- Explicitly state which vendors or subprocessors are involved.
- Explicitly state whether a DPIA screening is needed.
- Every high-risk touched flow has an updated row in `docs/privacy-processing-inventory.md`.
- Vendors declared in legal copy match vendors used in code.
- Retention is explicit or a WS5 gap is clearly tracked.
- Contextual notice is present for high-risk forms where consent is collected.
- `it/en` parity is preserved for all privacy/legal/user-facing text touched.

## Enforcement Rule

For GDPR/privacy-related PRs, this gate is blocking:
- if inventory is not updated -> `needs changes`
- if compliance changelog is not updated -> `needs changes`
- if legal/i18n parity verification is missing or failing -> `needs changes`
- if critical unresolved privacy gap remains -> `blocked`

## Output
- GDPR implementation review summary
- list of mismatches found
- list of required/applied fixes
- list of residual gaps with owner and next action
- gate status: `approved | needs changes | blocked`
