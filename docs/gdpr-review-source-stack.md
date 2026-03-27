# GDPR Review Source Stack

UpdatedAt: 2026-03-26

## Purpose

Questo documento definisce la gerarchia delle fonti che le skill GDPR devono usare in questo repo.
Serve a evitare review basate solo sugli artefatti locali quando esiste una baseline condivisa piu ampia.

## Source Order

1. Shared baseline pack:
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
2. Repo-specific instantiation:
   - `docs/gdpr-feature-checklist.md`
   - `docs/privacy-processing-inventory.md`
   - `docs/compliance-changelog.md`
   - `lib/i18n/legal-translations.ts`
   - affected route/page/feature/runbook docs
   - code and tests for the touched flow

## Mandatory Shared Files

Every review must consult:
- `README.md`
- `privacy-baseline.md`
- `gdpr-control-matrix.md`

Then add the topic-specific shared files below.

## Topic Mapping

| Review topic | Shared files |
|---|---|
| Broad applicability or governance scope | `gdpr-reference-guide.md`, `gdpr-project-applicability-template.md` |
| Data categories, field scope, inventory | `data-inventory.md` |
| Controller/processor role, lawful basis | `lawful-basis-matrix.md`, `ropa-processor.md` |
| Retention, deletion, lifecycle | `retention-policy.md`, `end-of-contract-data-handling.md` |
| Access, export, deletion, objection workflows | `data-subject-rights.md` |
| Vendors, subprocessors, contracts | `subprocessors.md`, `dpa-checklist.md` |
| Transfers or cleartext vendor/internal access | `transfer-assessment.md` |
| High-risk processing or ambiguous risk posture | `dpia-template.md` |

## Review Modes

### `full_mode`

Use this when the shared baseline pack is available and the mandatory files were actually reviewed.
Only `full_mode` can end in `approved` for new or high-risk processing.

### `degraded_mode`

Use this when one or more shared baseline files are unavailable.
In `degraded_mode`, the gate must not return `approved` for:
- new processing activities
- new vendors or transfers
- new consent patterns
- new retention or DSAR behavior
- high-risk or ambiguous privacy changes

The review output must list the missing files and the resulting decision constraint.

## Divergence Rule

If repo-local docs or behavior diverge from the shared baseline:
- align the repo with the baseline, or
- record a repo-specific justified deviation in the review output and update local docs accordingly

Silent divergence is not acceptable.

## Evidence Expectations

Every GDPR review output should include:
- review mode (`full_mode` or `degraded_mode`)
- shared files reviewed
- touched repo-local files reviewed
- mismatches found
- applied or required fixes
- residual gaps, owner, and next action
