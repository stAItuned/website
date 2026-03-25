# Admin Compliance Hub (`/admin/compliance`)

UpdatedAt: 2026-03-25

## Purpose and Scope

Questa pagina admin centralizza gli artefatti operativi GDPR e AI Act usati come evidenza interna/external-audit.
L'accesso e protetto da autenticazione Firebase, session cookie server-side `httpOnly` e controllo `isAdmin`.
Le route `/admin/*` vengono bloccate prima del render tramite enforcement server-side, con Bearer-token auth mantenuta sulle API admin come defense in depth.

## Surfaced Artifacts

La pagina espone documenti Markdown repo-driven tramite `GET /api/admin/compliance-docs`:

- `docs/gdpr-feature-checklist.md`
- `docs/ai-act-feature-checklist.md`
- `docs/dpia-screening-role-fit-audit.md`
- `docs/gdpr-audit-webapp-2026-03-22.md`
- `plan.md`
- `docs/privacy-processing-inventory.md`
- `docs/compliance-changelog.md`
- `docs/privacy-retention-schedule.md`
- `docs/runbooks/dsar-account-deletion.md`
- `docs/runbooks/retention-lifecycle.md`
- `docs/ai-eu-act-landing.md`
- `docs/runbooks/gdpr-ws1-ws7-test-report-2026-03-23.md`
- `docs/runbooks/ws7-smoke-test-test-env-2026-03-23.md`
- `docs/runbooks/ws7e-go-no-go-prod.md`
- `docs/runbooks/admin-pwa-operational-notifications.md`

## Rendering and Shareability

- I documenti `.md` sono renderizzati come Markdown (non testo grezzo).
- Ogni documento puo essere:
  - scaricato come file `.md` (`Download .md`)
  - copiato come Markdown raw (`Copy markdown`)
- Il percorso relativo e la data di ultimo aggiornamento (`mtime`) sono mostrati nell'header del documento.

## Privacy and Accountability Notes

- Hub pensato per evidenza operativa, non per repository legale definitivo esterno.
- Prima di condivisione esterna verificare che non siano presenti note interne non destinate a terzi.
- La fonte autorevole resta il repository versionato; la pagina admin e una vista protetta di consultazione/esportazione.

## PWA / SEO / Bilingual Impact

- Nessun impatto su PWA scope `/learn`.
- Nessun impatto su SEO/GEO (route admin non indexabile; `robots` impostato a `noindex, nofollow` nel layout admin).
- Nessun impatto `it/en` pubblico: superficie interna admin.
