# GDPR Workstreams Test Report (WS1 -> WS7) — 2026-03-23

## Scope
- Repository verification: automated tests + lint + typecheck
- Test environment verification: `https://staituned-test--staituned-production-163f4.europe-west4.hosted.app/`
- Goal: copertura test per ogni workstream GDPR (`WS1` ... `WS7`)

## Global Gates
- `npm run lint`: `pass`
- `npm run typecheck`: `pass`

## WS Matrix

| WS | Focus | Evidence type | Status |
|---|---|---|---|
| WS1 | Analytics consent + first-party views | unit/integration + smoke | `pass` |
| WS2 | Newsletter decommission | unit + smoke | `pass` |
| WS3 | Role Fit hardening | unit/integration + smoke (validation gate) | `pass` |
| WS4 | Transparency/governance surfaces | unit + smoke (auth gate admin surface) | `pass` |
| WS5 | Retention lifecycle | unit + real dry-run retention | `pass` |
| WS6 | Admin notifications minimization | unit/integration + smoke (auth gate) | `pass` |
| WS7 | Residual gaps closure | unit/integration + dedicated smoke report | `pass_with_known_limits` |

## Detailed Evidence by Workstream

### WS1 — Analytics e consenso cookie
- Automated:
  - `pnpm exec vitest run components/PageViewTracker.test.tsx app/api/analytics/page-view/route.test.ts`
  - Result: `2 files passed`, `10 tests passed`.
- Smoke (test env):
  - `POST /api/analytics/page-view` with unknown slug.
  - HTTP `202`, body: `{"ok":true,"skipped":"non_production_origin"}`.
  - Esito: guardrail first-party view attivo su host non produzione.

### WS2 — Dismissione newsletter
- Automated:
  - `pnpm exec vitest run app/api/newsletter/subscribe/route.test.ts`
  - Result: `1 file passed`, `1 test passed`.
- Smoke (test env):
  - `POST /api/newsletter/subscribe`
  - HTTP `410`, body: `{"ok":false,"error":"newsletter_dismissed","message":"Newsletter subscriptions are no longer available."}`
  - Esito: tombstone endpoint confermato.

### WS3 — Role Fit Audit hardening
- Automated:
  - `pnpm exec vitest run app/api/role-fit-audit/submit/route.test.ts lib/email/roleFitAuditEmail.test.ts`
  - Result: `2 files passed`, `4 tests passed`.
- Smoke (test env):
  - `POST /api/role-fit-audit/submit` con payload incompleto.
  - HTTP `400`, body: `{"error":"Risposte mancanti."}`
  - Esito: validazione server-side attiva.

### WS4 — Trasparenza e documentazione
- Automated:
  - `pnpm exec vitest run app/api/admin/compliance-docs/route.test.ts`
  - Result: `1 file passed`, `4 tests passed`.
- Smoke (test env):
  - `GET /api/admin/compliance-docs` senza auth.
  - HTTP `401`, body: `{"success":false,"error":"Unauthorized"}`
  - Esito: admin compliance surface protetta.

### WS5 — Retention, cancellazione, lifecycle
- Automated:
  - `pnpm exec vitest run lib/privacy/retention.test.ts lib/privacy/retention-policies.test.ts`
  - Result: `2 files passed`, `8 tests passed`.
- Operational dry-run (real):
  - `pnpm exec tsx scripts/retention-lifecycle.ts --dry-run --env test --project staituned-production-163f4 --dataset all`
  - Result: `status=completed`, `missingRetentionCount=0` e `expiredCount=0` su tutti i dataset in scope.
  - Log evidence: `/tmp/ws5_retention_dryrun.log`

### WS6 — Minimizzazione verso canali terzi/interni
- Automated:
  - `pnpm exec vitest run lib/notifications/adminOpsPush.test.ts app/api/admin/notifications/register/route.test.ts app/api/admin/notifications/unregister/route.test.ts app/api/admin/notifications/subscribe/route.test.ts app/api/admin/notifications/unsubscribe/route.test.ts components/admin/AdminPushNotificationsCard.test.tsx`
  - Result: `6 files passed`, `16 tests passed`.
- Smoke (test env):
  - `POST /api/admin/notifications/register` senza auth.
  - HTTP `401`, body: `{"success":false,"error":"Unauthorized"}`
  - Esito: gate auth admin-only attivo.

### WS7 — Chiusura gap residui
- Automated:
  - `pnpm exec vitest run app/api/leads/ai-act/route.test.ts app/api/career-os/apply/route.test.ts app/api/career-os/audit/route.test.ts app/api/notifications/register/route.test.ts app/api/notifications/subscribe/route.test.ts app/api/notifications/unsubscribe/route.test.ts app/api/account/delete/route.test.ts app/api/contributor/save-progress/route.test.ts lib/contributor/agreementPolicy.test.ts lib/contributor/agreementAcceptance.test.ts`
  - Result: `10 files passed`, `34 tests passed`.
- Smoke (test env):
  - Detailed trace: [WS7 Smoke Test](/Users/moltisantid/Personal/website/docs/runbooks/ws7-smoke-test-test-env-2026-03-23.md)
  - Status: core routes pass; some success-path checks require real auth/real FCM token.

## Known Limits / Remaining Runtime Checks
1. WS7-B subscribe success-path su device reale: serve token FCM reale (con token fake ritorna errore backend, atteso).
2. WS7-C e WS7-D authenticated success-path: servono sessione utente test + bearer token valido.
3. WS1 first-party view positive increment su slug valido non e stato validato via smoke live in questo pass (coperto da test automatici).

## Final Assessment
- Tutti i workstream (`WS1` ... `WS7`) hanno copertura test documentata in questo report.
- Stato complessivo: `ready_for_test_rollout_monitoring`, con i soli gap runtime residui legati a credenziali/token reali.
