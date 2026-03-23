# Retention Lifecycle Runbook (WS5 MVP)

Obiettivo: eseguire purge retention in modo controllato con modalita `dry-run` e `apply`.

Script: `scripts/retention-lifecycle.ts`

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
- `missingRetentionCount > 0`: aprire task di backfill metadata per dataset coinvolto

## Rollback

Per `hard_delete` non esiste rollback dati applicativo.
Rollback consentito solo a livello di deploy/config (disabilitare run successive).
