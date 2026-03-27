# Admin Compliance Hub (`/admin/compliance`)

UpdatedAt: 2026-03-27

## Purpose and Scope

Questa pagina admin centralizza gli artefatti operativi GDPR e AI Act usati come evidenza interna/external-audit.
L'accesso e protetto da autenticazione Firebase, session cookie server-side `httpOnly` e controllo `isAdmin`.
Le route `/admin/*` vengono bloccate prima del render tramite enforcement server-side, con Bearer-token auth mantenuta sulle API admin come defense in depth.

## Surfaced Artifacts

La pagina espone documenti Markdown tramite `GET /api/admin/compliance-docs`, raggruppati per categoria.
La tassonomia corrente segue la `Strategia C` del piano GDPR: `shared baseline`, `repo governance`, `operations`, `evidence`, `AI Act related`.

### GDPR Shared Baseline

Documenti letti dal pacchetto condiviso `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/`:

- `README.md`
- `privacy-baseline.md`
- `gdpr-control-matrix.md`
- `gdpr-reference-guide.md`
- `gdpr-project-applicability-template.md`
- `data-inventory.md`
- `lawful-basis-matrix.md`
- `retention-policy.md`
- `data-subject-rights.md`
- `end-of-contract-data-handling.md`
- `subprocessors.md`
- `transfer-assessment.md`
- `dpia-template.md`
- `dpa-checklist.md`
- `ropa-processor.md`

### GDPR Repo Governance

- `docs/gdpr-review-source-stack.md`
- `docs/gdpr-management-review-2026-03-26.md`
- `docs/gdpr-management-execution-plan-2026-03-26.md`
- `docs/privacy-lawful-basis-matrix.md`
- `docs/privacy-subprocessors-register.md`
- `docs/privacy-transfer-assessment.md`
- `docs/privacy-end-of-contract-data-handling.md`
- `docs/privacy-dpia-index.md`
- `docs/gdpr-feature-checklist.md`
- `docs/gdpr-audit-webapp-2026-03-22.md`
- `plan.md`
- `docs/privacy-processing-inventory.md`
- `docs/compliance-changelog.md`

### GDPR Operations

- `docs/privacy-retention-schedule.md`
- `docs/privacy-breach-escalation.md`
- `docs/firestore-default-legacy-decommission-plan.md`
- `docs/runbooks/dsar-account-deletion.md`
- `docs/runbooks/retention-lifecycle.md`

### GDPR Evidence

- `docs/dpia-screening-role-fit-audit.md`
- `docs/runbooks/gdpr-ws1-ws7-test-report-2026-03-23.md`
- `docs/runbooks/ws7-smoke-test-test-env-2026-03-23.md`
- `docs/runbooks/ws7e-go-no-go-prod.md`

### Related AI Act Docs

- `docs/ai-act-feature-checklist.md`
- `docs/ai-eu-act-landing.md`

## Rendering and Shareability

- I documenti `.md` sono renderizzati come Markdown (non testo grezzo).
- Ogni card documento espone:
  - `description`
  - `focus`
  - `objective`
  - path del file
  - categoria (`GDPR Shared Baseline`, `GDPR Repo Governance`, `GDPR Operations`, `GDPR Evidence`, `AI Act Related`)
- Ogni documento puo essere:
  - scaricato come file `.md` (`Download .md`)
  - copiato come Markdown raw (`Copy markdown`)
- Il path del file, la categoria, la source (`shared baseline` o `repo`) e la data di ultimo aggiornamento (`mtime`) sono mostrati nell'header del documento.

## Privacy and Accountability Notes

- Hub pensato per evidenza operativa, non per repository legale definitivo esterno.
- Prima di condivisione esterna verificare che non siano presenti note interne non destinate a terzi.
- La fonte autorevole resta il repository versionato; la pagina admin e una vista protetta di consultazione/esportazione.
- La source stack GDPR dell'hub e intenzionalmente a due livelli:
  - baseline condivisa
  - istanziazione repo-specifica
- A livello operativo, il catalogo e ormai strutturato in quattro layer stabili:
  - `GDPR Shared Baseline`
  - `GDPR Repo Governance`
  - `GDPR Operations`
  - `GDPR Evidence`
- Questo rende `/admin/compliance` il punto unico di consultazione interna per la governance GDPR del repo, mentre la review e il piano restano gli artifact di tracking.
- Per `docs/privacy-lawful-basis-matrix.md`, l'hub espone ora la versione purpose-level usata come riferimento canonico per il lawful-basis split, mentre `docs/privacy-processing-inventory.md` resta il documento flow-level.
- Per `docs/privacy-subprocessors-register.md`, l'hub espone il registro centralizzato dei vendor usato come base di partenza per il successivo workstream su transfer assessment.
- Per `docs/privacy-transfer-assessment.md`, l'hub espone la vista scenario-based dei trasferimenti, con rischio residuo e `TBD` apertamente tracciati.
- Per `docs/privacy-end-of-contract-data-handling.md`, l'hub espone il documento di raccordo che spiega cosa succede ai dati tra account deletion, retention expiry, unsubscribe/offboarding e legal exception.
- Per `docs/privacy-dpia-index.md`, l'hub espone l'indice centrale degli screening DPIA e dei trigger di riapertura, senza duplicare il contenuto dei singoli assessment.
- Per `docs/privacy-breach-escalation.md`, l'hub espone il runbook GDPR per incidenti privacy e breach candidate, con trigger, owner e decision path di escalation.
- Per `docs/firestore-default-legacy-decommission-plan.md`, l'hub espone il piano operativo che governa audit, export finale, go/no-go e delete del Firestore legacy `(default)` rimasto in `NAM5` dopo il cutover EU.

## PWA / SEO / Bilingual Impact

- Nessun impatto su PWA scope `/learn`.
- Nessun impatto su SEO/GEO (route admin non indexabile; `robots` impostato a `noindex, nofollow` nel layout admin).
- Nessun impatto `it/en` pubblico: superficie interna admin.
