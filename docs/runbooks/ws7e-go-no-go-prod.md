# WS7-E Go/No-Go Production Checklist

UpdatedAt: 2026-03-23
Owner: stAItuned engineering + privacy/legal reviewer
Status: `template`

## Decision Summary

- Decision date:
- Environment validated: `test` / `production`
- Final decision: `go` / `no-go`
- Decision owner:
- Legal reviewer:

## Evidence Snapshot

- Deploy test completed: `yes/no`
- Deploy prod completed (if `go`): `yes/no`
- Monitoring window covered: `start` -> `end`
- Related runbooks:
  - `docs/runbooks/ws7-rollout-checklist.md`
  - `docs/runbooks/retention-lifecycle.md`
  - `docs/runbooks/dsar-account-deletion.md`

## Go/No-Go Gates (WS7-E)

Mark each gate with `pass/fail` and add evidence link or command output reference.

| Gate | Status | Evidence |
|---|---|---|
| G1. Legal exception minimization active in `POST /api/account/delete` (retained evidence only) | `pass/fail` | |
| G2. Legal exception review window present (`legal_retention_review_due_at`) | `pass/fail` | |
| G3. Dataset-specific error reporting in `summary.datasetCoverage` | `pass/fail` | |
| G4. Privacy policy `it/en` includes explicit sections for Career OS apply/audit + AI EU Act lead | `pass/fail` | |
| G5. Inventory agreement recipients use named vendor (`Resend`) | `pass/fail` | |
| G6. Retention schedule documents legal exception window and scope | `pass/fail` | |
| G7. Retention dry-run `dataset=all` returns `missingRetentionCount=0` | `pass/fail` | |
| G8. Targeted WS7-E tests/lint/typecheck are green | `pass/fail` | |

## Required Commands (attach outputs)

```bash
npm run lint
npm run typecheck
pnpm exec vitest run app/api/account/delete/route.test.ts app/api/contributor/save-progress/route.test.ts lib/privacy/retention-policies.test.ts
pnpm exec tsx scripts/retention-lifecycle.ts --dry-run --env test --project staituned-production-163f4 --dataset all
```

If production decision is `go`, run and attach:

```bash
pnpm exec tsx scripts/retention-lifecycle.ts --dry-run --env prod --project staituned-production-163f4 --dataset all
```

## Risk Log (if any gate fails)

| Risk ID | Description | Impact | Mitigation | Owner | ETA |
|---|---|---|---|---|---|
| | | | | | |

## Final Notes

- `go` is allowed only if all mandatory gates are `pass`.
- If at least one gate is `fail`, keep decision `no-go`, open remediation task, and re-run this checklist.
