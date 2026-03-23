# WS7 Rollout Checklist (Pre-Prod and Prod)

UpdatedAt: 2026-03-23
Owner: stAItuned engineering

## Scope

Questa checklist copre rollout e monitoraggio della wave WS7:
- WS7-A lead flows governance
- WS7-D DSAR/account deletion coverage
- WS7-B public editorial push governance
- WS7-C contributor agreement legal exception
- WS7-E legal hardening post-review

Ordine operativo: `WS7-A -> WS7-D -> WS7-B -> WS7-C -> WS7-E`.

## Prerequisites

- Deploy target allineato (`development` -> `staituned-dev-42883`, `production` -> `staituned-production`).
- Variabile service account disponibile nel runtime:
  - `FB_SERVICE_ACCOUNT_KEY` oppure `FB_SERVICE_ACCOUNT_KEY_B64`.
- Retention policy aggiornata con dataset WS7 in `lib/privacy/retention-policies.ts`.
- Docs aggiornate in:
  - `docs/privacy-processing-inventory.md`
  - `docs/privacy-retention-schedule.md`
  - `docs/runbooks/dsar-account-deletion.md`
  - `docs/contributor-agreement-policy.md`

## Phase 1: Pre-rollout dry-runs (test)

1. Deploy ambiente test:
```bash
npm run deploy:test
```

2. Retention lifecycle dry-run su tutti i dataset:
```bash
pnpm exec tsx scripts/retention-lifecycle.ts --dry-run --env test --project staituned-production-163f4 --dataset all
```

3. Verifica minima output dry-run:
- `missingRetentionCount = 0` sui dataset WS7
- `policyAction = hard_delete`
- dataset presenti: `leads_ai_act_tools`, `career_os_applications`, `career_os_audit`, `fcm_tokens`

4. Smoke API in test (manuale o scripted):
- `POST /api/leads/ai-act`
- `POST /api/career-os/apply`
- `POST /api/career-os/audit`
- `POST /api/account/delete` (modalita `data`)
- `POST /api/notifications/register`
- `POST /api/notifications/subscribe`
- `POST /api/notifications/unsubscribe`
- `DELETE /api/notifications/register`
- `POST /api/contributor/save-progress`

## Phase 2: Production rollout (same order)

1. Deploy produzione:
```bash
npm run deploy:prod
```

2. Retention lifecycle dry-run in prod:
```bash
pnpm exec tsx scripts/retention-lifecycle.ts --dry-run --env prod --project staituned-production-163f4 --dataset all
```

3. Se sono presenti record scaduti, eseguire apply controllato:
```bash
pnpm exec tsx scripts/retention-lifecycle.ts --apply --env prod --project staituned-production-163f4 --dataset all --batch-size 300
```

4. Verifica evidenza run apply:
- Firestore: `compliance_ops/retention_runs/runs/{runId}`

## 7-Day Monitoring Guardrails

- Error rate route:
  - `/api/leads/ai-act`
  - `/api/career-os/apply`
  - `/api/career-os/audit`
  - `/api/account/delete`
  - `/api/notifications/*`
  - `/api/contributor/save-progress`
- Verifica payload minimization:
  - Telegram senza email/nome/free text su flussi WS7-A
- Coerenza policy/runtime:
  - `it/en` legal copy allineata con behavior reale
- DSAR workflow:
  - self-service vs assisted coerente con `docs/runbooks/dsar-account-deletion.md`

## Exit Criteria WS7 Operational

- Dry-run retention senza drift su dataset WS7.
- Inventory + retention schedule allineati ai dataset runtime reali.
- Account deletion restituisce `datasetCoverage` machine-readable senza regressioni.
- `fcm_tokens` governato con retention/lifecycle.
- Contributor agreement con `legal_exception` documentata e consistente tra runtime e policy.
- WS7-E gates validati tramite checklist go/no-go:
  - `docs/runbooks/ws7e-go-no-go-prod.md`

## Current blocker (local execution)

Se il comando retention fallisce con:
- `FB_SERVICE_ACCOUNT_KEY / FB_SERVICE_ACCOUNT_KEY_B64 env variable is required`

allora il runtime locale non ha credenziali admin. Caricare la variabile e rieseguire il dry-run prima di procedere al go-live.
