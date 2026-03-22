# Runbook: Newsletter Decommission (WS2)

Data: 2026-03-22  
Owner: stAItuned engineering

## Scopo

Dismettere in modo definitivo il dataset legacy `newsletter_subscribers` con approccio privacy-first:
- nessun backup con PII;
- evidenza operativa solo aggregata (senza dati personali);
- hard delete completo in produzione.

## Prerequisiti

- Accesso IAM al progetto Firebase produzione con permessi Firestore read/write/delete.
- Variabili env Firebase Admin configurate (`FB_SERVICE_ACCOUNT_KEY` o `FB_SERVICE_ACCOUNT_KEY_B64`).
- Conferma che endpoint newsletter sia tombstoned (`POST /api/newsletter/subscribe` -> `410`).
- Finestra operativa con monitoraggio attivo.

## Rollback policy

Rollback consentito solo a livello applicativo/configurazione.  
Non e previsto il ripristino dei dati personali cancellati.

## Procedura operativa

### Step 1: Dry-run (conteggio + range date)

```bash
pnpm exec tsx scripts/decommission-newsletter-subscribers.ts --dry-run --env prod --project staituned-production-163f4
```

Confermare:
- `documentsFound` coerente con aspettative;
- nessuna esportazione PII;
- range `subscribedAt` disponibile se presente nei documenti.

### Step 2: Apply (evidenza minima + hard delete)

```bash
pnpm exec tsx scripts/decommission-newsletter-subscribers.ts --apply --env prod --project staituned-production-163f4 --batch-size 300
```

Comportamento atteso:
- scrittura evidenza in `compliance_ops/newsletter_decommission_runs/runs/{runId}`;
- cancellazione batch idempotente di tutti i documenti;
- output finale con `documentsDeleted == documentsFound`.

### Step 3: Verifica post-delete

Rieseguire dry-run:

```bash
pnpm exec tsx scripts/decommission-newsletter-subscribers.ts --dry-run --env prod --project staituned-production-163f4
```

Accettazione:
- `documentsFound: 0`;
- evidenza run presente in Firestore;
- nessuna regressione API/UI (newsletter dismessa).

## Gestione errori e retry

- In caso di errore parziale, rilanciare `--apply` con stessi parametri.
- Lo script e idempotente: elimina solo documenti residui e aggiorna nuova evidenza run.
- Se fallisce la scrittura evidenza, non procedere al delete e risolvere prima i permessi Firestore.

## Audit fields (evidenza minima)

Per ogni run applicativo:
- `runId`
- `executedAt`
- `executor`
- `environment`
- `project`
- `batchSize`
- `documentsFound`
- `documentsDeleted`
- `status` (`running|completed|failed`)
- `durationMs`
- `subscribedAtRange` (`first`, `last` se disponibili)
- `error` (solo in stato `failed`)
