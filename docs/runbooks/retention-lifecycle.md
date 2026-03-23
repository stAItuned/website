# Retention Lifecycle Runbook (WS5 MVP)

Obiettivo: eseguire purge retention in modo controllato con modalita `dry-run` e `apply`.

Script: `scripts/retention-lifecycle.ts`

Companion script per legacy metadata:
- `scripts/backfill-retention-metadata.ts`

## Prerequisiti

- accesso al progetto Firebase corretto
- service account admin disponibile nel runtime
- policy dataset aggiornata in `lib/privacy/retention-policies.ts`

## Modalita Dry Run (default)

Esegue scansione senza cancellare:

```bash
pnpm exec tsx scripts/retention-lifecycle.ts --dry-run --env test --project <project-id> --dataset all
```

Output:
- `documentsScanned`
- `expiredCount`
- `missingRetentionCount`
- `deletedCount` (sempre 0 in dry-run)

Dataset correnti in scope:
- `role_fit_audit_submissions`
- `career_os_waitlist`
- `career_os_applications` (WS7-A)
- `career_os_audit` (WS7-A)
- `leads_ai_act_tools` (WS7-A)
- `business_demo_requests`
- `contact_requests`
- `feedback_submissions`
- `contributor_applications`
- `fcm_tokens` (WS7-B public editorial push tokens)
- `fcm_admin_tokens` (WS6 admin push tokens)

## Modalita Apply (prod only)

Cancella i record scaduti in batch:

```bash
pnpm exec tsx scripts/retention-lifecycle.ts --apply --env prod --project <project-id> --dataset all --batch-size 300
```

Guardrail:
- `--env prod` obbligatorio in apply
- `--project` obbligatorio in apply

## Esecuzione per dataset singolo

```bash
pnpm exec tsx scripts/retention-lifecycle.ts --dry-run --env test --project <project-id> --dataset business_demo_requests
```

## Evidenze operative

Ogni run `apply` scrive evidenza aggregata in:
- `compliance_ops/retention_runs/runs/{runId}`

Nessun payload PII viene salvato nell’evidenza.

## Error handling

- failure parziale batch: rilanciare lo stesso comando (idempotenza pratica sul subset rimanente)
- `missingRetentionCount > 0`: eseguire backfill metadata:

```bash
pnpm exec tsx scripts/backfill-retention-metadata.ts --dry-run --env test --project <project-id> --dataset all
pnpm exec tsx scripts/backfill-retention-metadata.ts --apply --env test --project <project-id> --dataset all
```

poi rieseguire `dry-run` retention lifecycle per conferma.

## Operational Evidence (current)

- 2026-03-23:
  - dry-run retention eseguito in test/prod (`expiredCount = 0`)
  - backfill metadata legacy applicato in test
  - dry-run post-backfill con `missingRetentionCount = 0` su tutti i dataset
  - WS7 pre-rollout execution:
    - dry-run retention `dataset=all` ha rilevato `missingRetentionCount=2` su `fcm_tokens`
    - backfill mirato `fcm_tokens` eseguito in apply (`updatedCount=2`)
    - dry-run retention di verifica finale `dataset=all`: `missingRetentionCount=0` su tutti i dataset, inclusi WS7 (`leads_ai_act_tools`, `career_os_applications`, `career_os_audit`, `fcm_tokens`)

## Rollback

Per `hard_delete` non esiste rollback dati applicativo.
Rollback consentito solo a livello di deploy/config (disabilitare run successive).
