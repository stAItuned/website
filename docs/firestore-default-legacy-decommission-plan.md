# Firestore Legacy `(default)` Decommission Plan

UpdatedAt: 2026-03-27

## Purpose

Questo documento governa il decommission del database Firestore legacy `(default)` rimasto in `NAM5` dopo il cutover del main runtime verso `eu-primary` in `europe-west1`.
L'obiettivo e evitare una cancellazione prematura del datastore US senza audit, export finale, rollback plan ed evidenza operativa.

## Current State

- Main runtime database:
  - `eu-primary`
  - region: `europe-west1`
- Legacy database:
  - `(default)`
  - region: `NAM5`
- Current repo posture:
  - il layer principale server/client punta a `eu-primary`
  - il package `functions` punta a `eu-primary` e blocca `(default)` per il path deployabile
  - il valore `(default)` e bloccato esplicitamente per il main runtime path
  - il database legacy rimane solo come asset infrastrutturale da verificare e decommissionare

## Audit Snapshot (2026-03-27)

- Repo code audit:
  - `main app runtime`: `ok`, punta a `eu-primary`
  - `functions runtime`: `ok`, riallineato a `eu-primary`
  - uso residuo deployabile di `getFirestore()` senza `databaseId`: `not detected` dopo il fix nel package `functions`
- Infrastructure audit:
  - `partial evidence collected`
  - databases observed in project:
    - `(default)` in `nam5`
    - `eu-primary` in `europe-west1`
    - `role-fit-audit` in `europe-west1`
    - `test-editorial-factory` in `europe-west1`
  - latest successful legacy export observed:
    - `gs://staituned-firestore-export-us/firestore-export-final-20260327-121729`
    - copied archive evidence:
      - `gs://staituned-firestore-archive-eu/firestore-export-final-20260327-121729`
  - top-level inventory comparison completed with `scripts/audit-firestore-database.ts`
    - `(default)`: `21` collection paths, `4633` document refs enumerated
    - `eu-primary`: `21` collection paths, `4633` document refs enumerated
    - observed delta at top-level: `none`

Current decommission readiness:

- `repo_runtime_dependency_on_(default)`: `no`
- `infra_evidence_collected`: `yes, partial`
- `safe_to_decommission`: `not yet`
- `next gating action`: completare inventory/final decision e registrare il `go/no-go` formale prima della delete

## Legacy Audit Result

- Audit date: `2026-03-27`
- Auditor: `Codex`
- Project: `staituned-production-163f4`
- Legacy database: `(default)`
- Main runtime database: `eu-primary`

### Database Identity

- `(default)` region: `nam5`
- `eu-primary` region: `europe-west1`

### Legacy Collection Snapshot

- Collection count: `21` top-level collection paths observed on both `(default)` and `eu-primary`
- Key collections observed:
  - `articles`
  - `users`
  - `writers`
  - `analytics`
  - `config`
  - `api_usage`
  - `usage_logs`
  - `badge_evidence`
  - `notifications`
  - `fcm_tokens`
- Collections with recent updates after cutover: `not yet determined at document timestamp level, but no top-level inventory delta observed`

### Runtime Dependency Check

- Repo runtime uses `(default)`: `no`
- External scripts/manual ops still depend on `(default)`: `not detected in repo; external/manual confirmation still required`
- Console/manual operator dependency detected: `not yet determined`

### Export Readiness

- Previous export exists: `yes`
- Final export still required: `no`
- Final export verified:
  - `gs://staituned-firestore-export-us/firestore-export-final-20260327-121729`
  - `gs://staituned-firestore-archive-eu/firestore-export-final-20260327-121729`
- Final export operation:
  - `projects/staituned-production-163f4/databases/(default)/operations/ASBjODBhMTcwODA0OWEtMDNkOC1iNWE0LTI5ZjAtOWRlNTI3OTkkGnNlbmlsZXBpcAkKMxI`
  - status: `SUCCESSFUL`
  - documents: `4651`

### Decision

- safe_to_decommission: `no-go for now`
- blockers:
  - manca conferma esplicita che non esistano manual ops o console habits residue sul `(default)`
- next action:
  - fare una conferma finale manual-ops / console-usage
  - poi chiudere il `go/no-go` formale prima di ogni delete

## Decommission Goal

Chiudere in modo controllato il lifecycle del Firestore `(default)` legacy senza:

- perdita accidentale di dati ancora necessari
- regressioni operative su script o route esterne al repo
- gap di accountability su export, retention o rollback
- ambiguita sul fatto che il runtime principale sia ormai solo EU

## Scope

In scope:

- audit finale del database `(default)`
- conferma che il runtime principale non lo usa piu
- export finale del legacy database
- decisione di retention del dump/export
- finestra operativa di delete/decommission del database live
- evidenza documentale e update `/admin/compliance`

Out of scope:

- migrazione del database `role-fit-audit`
- review contrattuale/DPA Google/Firebase completa
- refactor di data model o di collection gia migrate su `eu-primary`

## Preconditions

Il decommission del legacy `(default)` puo iniziare solo se tutte queste condizioni sono vere:

1. `eu-primary` e il main database canonico in tutti gli ambienti attivi.
2. Smoke test del main layer passato su ambiente test e produzione.
3. Nessuna route o componente del repo usa `(default)` come runtime principale.
4. Nessun job/script operativo ancora necessario dipende dal legacy DB.
5. Esiste almeno un export leggibile e verificato del legacy DB.

## Work Phases

### Phase 1. Freeze

Obiettivo: impedire nuovi rientri accidentali sul database legacy.

Checklist:

- confermare env runtime:
  - `FIRESTORE_MAIN_DATABASE_ID=eu-primary`
  - `NEXT_PUBLIC_FIRESTORE_MAIN_DATABASE_ID=eu-primary`
- bloccare review e merge di nuovi accessi a `(default)` nel main layer
- rieseguire:
  - `npm run smoke:firestore-main`

Exit criteria:

- il main runtime EU e stabile
- nessun nuovo accesso al legacy viene introdotto nel repo

### Phase 2. Legacy Audit

Obiettivo: dimostrare che `(default)` non riceve piu traffico utile o aggiornamenti richiesti.

Checklist:

- inventory delle collection ancora presenti nel legacy DB
- confronto timestamp/volume con `eu-primary`
- verifica di eventuali writes o update recenti dopo il cutover
- verifica di script esterni/manual ops che potrebbero ancora usare `(default)`
- conferma che gli operatori non usano piu Firebase Console sul legacy come sorgente primaria

Evidence minima:

- elenco collection nel legacy
- nota su eventuali documenti aggiornati dopo il cutover
- decisione `safe_to_decommission: yes | no`

Exit criteria:

- nessun segnale credibile di dipendenza attiva dal legacy

### Phase 2A. Legacy Audit Command Sequence

Usare questa sequenza come baseline operativa:

```bash
gcloud firestore databases list --project=staituned-production-163f4
gcloud firestore databases describe --database="(default)" --project=staituned-production-163f4
gcloud firestore databases describe --database=eu-primary --project=staituned-production-163f4
```

Verifiche consigliate aggiuntive:

```bash
gcloud firestore operations list --project=staituned-production-163f4
npm run smoke:firestore-main
```

Se servono evidenze comparative piu forti, raccogliere:

- elenco collection principali presenti nel legacy
- campione di documenti aggiornati piu recentemente
- nota su eventuali mismatch rispetto a `eu-primary`

Nota operativa:

- la CLI Firestore non fornisce da sola un report esaustivo collection-by-collection come inventario funzionale;
- se serve un confronto profondo per collection o timestamp, preparare uno script one-shot di audit prima della delete.

### Phase 2B. Legacy Audit Report Template

Compilare questo blocco prima del go/no-go:

```md
## Legacy Audit Result

- Audit date:
- Auditor:
- Project:
- Legacy database:
- Main runtime database:

### Database Identity
- `(default)` region:
- `eu-primary` region:

### Legacy Collection Snapshot
- Collection count:
- Key collections observed:
- Collections with recent updates after cutover:

### Runtime Dependency Check
- Repo runtime uses `(default)`: yes/no
- External scripts/manual ops still depend on `(default)`: yes/no
- Console/manual operator dependency detected: yes/no

### Export Readiness
- Previous export exists: yes/no
- Final export still required: yes/no

### Decision
- safe_to_decommission: yes/no
- blockers:
- next action:
```

### Phase 3. Final Export And Retention Decision

Obiettivo: chiudere la parte di preservazione/rollback prima di ogni azione distruttiva.

Checklist:

- export finale del database `(default)`
- verifica leggibilita export
- registrazione path bucket e timestamp export
- decisione su retention del dump:
  - retention window
  - owner
  - data classification
- nota esplicita se l export e l unico rollback residuo

Evidence minima:

- bucket/path export
- timestamp export
- owner del dump
- retention/deletion date del dump

Exit criteria:

- export finale verificato
- rollback story documentata

### Phase 4. Go / No-Go

Obiettivo: prendere una decisione esplicita prima della delete.

Decision fields:

- `runtime_cutover_verified`
- `legacy_audit_completed`
- `final_export_verified`
- `rollback_window_defined`
- `privacy/docs_updated`
- `approval_status`

Approval status allowed values:

- `go`
- `no-go`
- `go_with_timeboxed_rollback_window`

### Phase 5. Destructive Decommission

Obiettivo: eseguire la rimozione del database legacy in una finestra controllata.

Checklist:

- conferma export finale immediatamente precedente
- conferma assenza incidenti aperti su Firestore
- finestra operativa comunicata
- delete del database `(default)` eseguita solo dopo final go
- aggiornamento evidenza post-delete

Mandatory follow-up:

- rieseguire smoke test su `eu-primary`
- monitorare errori runtime e support issues
- aggiornare docs con stato `legacy decommissioned`

## Risks

### Main Risks

- dipendenze manuali o script esterni non mappati
- falsa sicurezza dovuta al solo test applicativo locale
- delete del DB live senza export finale verificato
- confusione tra `eu-primary`, `(default)` e `role-fit-audit`

### Mitigations

- audit esplicito prima del delete
- export finale obbligatorio
- go/no-go formale
- smoke post-delete
- evidenza documentale centralizzata in `/admin/compliance`

## Minimal Command Checklist

Comandi da rieseguire o adattare nella finestra finale:

```bash
npm run smoke:firestore-main
gcloud firestore databases list --project=staituned-production-163f4
gcloud firestore databases describe --database="(default)" --project=staituned-production-163f4
gcloud firestore export gs://<legacy-export-bucket>/<final-export-path> --project=staituned-production-163f4 --database="(default)"
gcloud firestore operations list --project=staituned-production-163f4
```

Nota:

- il comando distruttivo di delete non va incorporato qui come default operazionale finche il go/no-go non e formalmente chiuso.
- se i permessi GCP non sono corretti, il decommission non puo essere chiuso solo con evidenza locale/repo.

## Required Documentation Updates At Closure

Alla chiusura del decommission aggiornare:

- `docs/privacy-subprocessors-register.md`
- `docs/privacy-transfer-assessment.md`
- `docs/compliance-changelog.md`
- `docs/gdpr-management-review-2026-03-26.md`
- `docs/gdpr-management-execution-plan-2026-03-26.md`
- `docs/admin-compliance-hub.md`

## Final Closure Criteria

Il workstream si considera chiuso solo quando:

1. `(default)` non e piu necessario operativamente.
2. L export finale e verificato e con retention definita.
3. Il delete/decommission del legacy e completato oppure esplicitamente bloccato con owner e reason.
4. Il main runtime EU continua a passare lo smoke test.
5. La documentazione privacy/ops riflette lo stato finale, non quello intermedio.
