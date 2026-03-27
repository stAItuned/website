---
name: gdpr-feature-gate
description: Run the mandatory GDPR and privacy implementation gate for this repository when a change introduces or modifies analytics, tracking, auth, forms, personal data, user identifiers, consent, retention, export, deletion, or third-party data sharing. Use this skill to fill or update docs/gdpr-feature-checklist.md context, identify legal and operational gaps before coding, and list the privacy/legal docs that must change.
---

# GDPR Feature Gate

Use this skill whenever a planned change affects data handling or privacy posture.

## Source Of Truth Stack (mandatory)

Review privacy changes against both:

1. Shared GDPR baseline pack:
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/README.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/privacy-baseline.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/gdpr-control-matrix.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/gdpr-reference-guide.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/gdpr-project-applicability-template.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/data-inventory.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/lawful-basis-matrix.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/retention-policy.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/data-subject-rights.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/end-of-contract-data-handling.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/subprocessors.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/transfer-assessment.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/dpia-template.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/dpa-checklist.md`
   - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/ropa-processor.md`
2. Repository-specific operational docs:
   - `docs/gdpr-review-source-stack.md`
   - `docs/gdpr-feature-checklist.md`
   - `docs/privacy-processing-inventory.md`
   - `docs/compliance-changelog.md`
   - `lib/i18n/legal-translations.ts`

The shared pack defines the baseline rules and review lenses.
The repository docs define how those rules are instantiated in this codebase.

If the shared pack is unavailable, declare `degraded_mode`, list the missing files, and do not return `approved` for:
- new processing activities
- new vendors or transfers
- new consent patterns
- new retention or DSAR behavior
- high-risk or ambiguous privacy changes

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
- shared GDPR baseline pack in `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/`
- `docs/gdpr-review-source-stack.md`
- `docs/gdpr-feature-checklist.md`
- `docs/privacy-processing-inventory.md`
- `docs/compliance-changelog.md`
- `lib/i18n/legal-translations.ts`
- existing legal/privacy docs when relevant

## Workflow
1. Read the request or brainstorming notes and identify the processing activity.
2. Open `docs/gdpr-review-source-stack.md` and determine which shared-pack files are mandatory for the change type.
3. Review the relevant shared-pack files before assessing repo-local docs. At minimum, always consult:
   - `README.md`
   - `privacy-baseline.md`
   - `gdpr-control-matrix.md`
   - the topic-specific file for the change (`lawful-basis-matrix.md`, `retention-policy.md`, `data-subject-rights.md`, `transfer-assessment.md`, `dpia-template.md`, `subprocessors.md`, `dpa-checklist.md`, `ropa-processor.md`, or `data-inventory.md`)
4. Use `docs/gdpr-feature-checklist.md` as the structure for the repository-specific review.
5. Record the data categories, identifiers, purpose, role assumptions, legal basis assumptions, consent implications, retention/deletion/export impacts, vendor exposure, and transfer implications.
6. Compare repo-local disclosures and controls with the shared baseline. If they diverge, either:
   - update the repo docs/code to align, or
   - document the justified repo-specific deviation explicitly in the review output.
7. Map flows touched by the diff and update `docs/privacy-processing-inventory.md` for each high-risk flow.
8. Append/update `docs/compliance-changelog.md` for the current privacy wave.
9. Verify `lib/i18n/legal-translations.ts` is consistent with actual code and with the declared vendor/retention/rights posture.
10. If user-facing copy changed, run `localized-page-change-check` and include its outcome in the GDPR gate output.
11. Identify which disclosures and internal docs need updates (policy text, runbooks, page/feature docs).
12. Surface blockers clearly when legal basis, consent capture, retention, DSAR handling, vendor accountability, or transfer posture is undefined.
13. Treat unresolved privacy gaps as a stop condition for implementation.

## Topic Mapping

Use this file mapping to avoid shallow reviews:

- lawful basis or controller/processor role -> `lawful-basis-matrix.md`, `ropa-processor.md`
- inventory/field scope/data categories -> `data-inventory.md`
- retention/lifecycle/deletion -> `retention-policy.md`, `end-of-contract-data-handling.md`
- DSAR/export/access/delete flows -> `data-subject-rights.md`
- vendors/subprocessors/contracts -> `subprocessors.md`, `dpa-checklist.md`
- cross-border transfers or vendor access -> `transfer-assessment.md`
- high-risk or unclear processing -> `dpia-template.md`
- broad rule interpretation or control coverage -> `privacy-baseline.md`, `gdpr-control-matrix.md`, `gdpr-reference-guide.md`

## Required Checks
- Explicitly list the shared-pack files reviewed.
- Explicitly state whether review ran in `full_mode` or `degraded_mode`.
- Explicitly state whether personal data is involved.
- Explicitly state whether consent is required and how it will be stored and revoked.
- Explicitly state which vendors or subprocessors are involved.
- Explicitly state whether a DPIA screening is needed.
- Explicitly state whether repo-local docs diverge from the shared baseline and how the divergence is resolved.
- Every high-risk touched flow has an updated row in `docs/privacy-processing-inventory.md`.
- Vendors declared in legal copy match vendors used in code.
- Retention is explicit or a WS5 gap is clearly tracked.
- Contextual notice is present for high-risk forms where consent is collected.
- `it/en` parity is preserved for all privacy/legal/user-facing text touched.

## Enforcement Rule

For GDPR/privacy-related PRs, this gate is blocking:
- if the shared source-stack review is missing -> `needs changes`
- if the review is in `degraded_mode` and the change introduces new or high-risk processing -> `blocked`
- if inventory is not updated -> `needs changes`
- if compliance changelog is not updated -> `needs changes`
- if legal/i18n parity verification is missing or failing -> `needs changes`
- if critical unresolved privacy gap remains -> `blocked`

## Output
- GDPR implementation review summary
- review mode: `full_mode | degraded_mode`
- shared-pack files reviewed
- list of mismatches found
- list of required/applied fixes
- list of repo-specific deviations from shared baseline
- list of residual gaps with owner and next action
- gate status: `approved | needs changes | blocked`
