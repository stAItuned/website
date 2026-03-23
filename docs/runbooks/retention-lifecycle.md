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

## Rollback

Per `hard_delete` non esiste rollback dati applicativo.
Rollback consentito solo a livello di deploy/config (disabilitare run successive).
