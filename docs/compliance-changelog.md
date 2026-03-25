# Compliance Changelog

UpdatedAt: 2026-03-24

## Maintenance Rules

- Aggiungere una entry per ogni wave GDPR/privacy-related.
- Ogni entry deve citare workstream e superfici impattate (API, form, legal copy, dataset, vendor).
- Nessuna release privacy-related deve chiudersi senza update di questo file.

## 2026-03-22

- WS2 closed: newsletter dismissed, endpoint tombstone `410`, CTA moved to `/topics`, legacy dataset decommission runbook introduced.
- WS3 hardening (Strategy A): Role Fit Audit server-side privacy enforcement, consent versioning, retention marker, metadata-only internal channels, DPIA screening artifact.
- Admin compliance hub introduced at `/admin/compliance` with protected access to GDPR artifacts.
- WS4 bootstrap (Strategy A + C): processing inventory added and contextual waitlist privacy notice strengthened.

## 2026-03-22 (WS4 closure sweep completed)

- Sweep code-vs-policy completato sui flussi P4 Alto: Role Fit Audit, Career OS waitlist, Business apply, Contact+feedback, Contributors apply, Analytics.
- Esito sweep tracciato in `docs/privacy-processing-inventory.md` con matrice `OK | WS5 Gap`.
- Gap residui formalmente delegati a WS5: standardizzazione tecnica retention lifecycle per Business apply e Contact+feedback.
- Review WS4 aggiornata a `approved` in `docs/gdpr-feature-checklist.md`.

## 2026-03-22 (WS5 strategy A MVP started)

- Introdotto contratto retention condiviso in `lib/privacy/retention.ts`.
- Introdotta policy map dataset in `lib/privacy/retention-policies.ts`.
- Creato job operativo `scripts/retention-lifecycle.ts` con modalita `--dry-run`/`--apply` e audit aggregato.
- Standardizzata metadata retention nelle route in scope MVP:
  - `role_fit_audit_submissions`
  - `career_os_waitlist`
  - `business_demo_requests`
  - `contact_requests`
  - `feedback_submissions`
  - `contributor_applications`

## 2026-03-23 (WS5 operational validation)

- Eseguito `dry-run` retention lifecycle (`dataset=all`) in test/prod con esito:
  - `expiredCount = 0` su tutti i dataset
  - `missingRetentionCount` iniziale rilevato su record legacy
- Introdotto script operativo di backfill metadata:
  - `scripts/backfill-retention-metadata.ts`
  - commit evidenza: `c8b814e`
- Eseguito backfill in apply (test) con allineamento record legacy:
  - `role_fit_audit_submissions`: 20
  - `career_os_waitlist`: 1
  - `contributor_applications`: 1
- Rieseguito dry-run retention post-backfill:
  - `missingRetentionCount = 0` su tutti i dataset.

## 2026-03-23 (WS6 strategy B admin-only operational notifications)

- Introdotto canale notifiche operative admin-only via PWA:
  - topic separato `admin-ops`
  - collection dedicata `fcm_admin_tokens`
  - endpoint protetti `POST /api/admin/notifications/{register,unregister,subscribe,unsubscribe}`
- Aggiunta card opt-in/disattivazione notifiche in dashboard admin (`/admin`).
- Introdotto dispatcher centralizzato metadata-only (`lib/notifications/adminOpsPush.ts`) integrato in tutti i form principali:
  - role fit audit
  - career os waitlist
  - business apply
  - contact
  - feedback
  - contributors apply
- Ridotti payload Telegram/Slack dei form a modalità metadata-only (niente email/nome/free-text).
- Esteso WS5 retention scope con dataset `fcm_admin_tokens` (TTL 90 giorni, hard delete).
- Aggiunto runbook operativo WS6 per activation/smoke/troubleshooting:
  - `docs/runbooks/admin-pwa-operational-notifications.md`

## 2026-03-23 (WS7-A + WS7-D + WS7-B execution wave)

- Estesa governance retention WS5 ai dataset residuali:
  - `leads_ai_act_tools`
  - `career_os_applications`
  - `career_os_audit`
  - `fcm_tokens`
- Hardened `POST /api/leads/ai-act`:
  - metadata retention standard (`createdAt`, `updatedAt`, `retentionUntil`, `status`)
  - token lifecycle esplicito (`accessTokenExpiresAt`)
  - Telegram payload metadata-only (senza PII/free text).
- Hardened `POST /api/career-os/apply` e `POST /api/career-os/audit`:
  - persistenza governata con retention metadata
  - consenso/versioning (`privacyVersion`, `consent.privacy.*`)
  - notifiche Telegram metadata-only.
- Hardened `/api/notifications/*` pubblico:
  - `fcm_tokens` con retention metadata e lifecycle coerente register/subscribe/unsubscribe/unregister
  - stato token esplicito (`subscriptionStatus`, `active`, `retentionUntil`).
- Esteso `POST /api/account/delete`:
  - cleanup dataset account-bound via `uid` e `email` verificata
  - risposta machine-readable con coverage dataset (`datasetCoverage`)
  - distinzione esplicita self-service vs assisted DSAR.
- Contributor agreement lifecycle:
  - default `legal_exception` applicata su agreement firmati durante account deletion (pseudonimizzazione + retention rationale).

## 2026-03-23 (WS7-C contributor agreement legal exception runtime alignment)

- `POST /api/contributor/save-progress` ora persiste metadati espliciti di legal exception sugli agreement firmati:
  - `legal_retention_mode`
  - `legal_retention_rationale`
  - `legal_retention_updated_at`
  - `dsar_delete_mode`
  - `dsar_delete_notes`
- Allineato il contratto dati contributor (`lib/types/contributor.ts`) con i campi di retention/DSAR policy-level.
- Aggiunto test route dedicato per verificare la persistenza dei campi legal exception.

## 2026-03-23 (WS7 pre-rollout package)

- Aggiunta checklist operativa end-to-end per rollout WS7:
  - `docs/runbooks/ws7-rollout-checklist.md`
- Checklist include:
  - ordine deploy `WS7-A -> WS7-D -> WS7-B -> WS7-C`
  - comandi dry-run/apply retention
  - smoke API obbligatori
  - monitoraggio 7 giorni + exit criteria
  - blocker esplicito su credenziali runtime (`FB_SERVICE_ACCOUNT_KEY` / `FB_SERVICE_ACCOUNT_KEY_B64`).

## 2026-03-23 (WS7 retention pre-rollout evidence executed)

- Eseguito dry-run retention `dataset=all` con credenziali runtime attive:
  - esito iniziale: unico gap `fcm_tokens` con `missingRetentionCount=2`
- Eseguito backfill mirato:
  - `scripts/backfill-retention-metadata.ts --apply --dataset fcm_tokens`
  - `updatedCount=2`
- Eseguito dry-run retention di verifica finale:
  - `missingRetentionCount=0` su tutti i dataset, inclusi dataset WS7.

## 2026-03-23 (WS7-E legal hardening implementation)

- `POST /api/account/delete`:
  - minimizzazione record `contributions` in `legal_exception` a sola evidenza agreement probatoria;
  - rimozione campi non essenziali (bozze/interviste/outline/review) nei record retained;
  - error handling dataset-specifico in `summary.datasetCoverage`.
- `POST /api/contributor/save-progress`:
  - aggiunto `legal_retention_review_due_at` per finestra di review eccezione legale.
- Policy/docs allineate:
  - privacy policy `it/en` con sezioni dedicate a Career OS apply/audit e AI EU Act lead;
  - inventory vendor agreement flow allineato a `Resend`;
  - retention schedule e contributor agreement policy aggiornati con finestra eccezione (10 anni) e scope minimizzato.

## 2026-03-23 (WS7-E go/no-go governance package)

- Aggiunto template formale di decisione produzione WS7-E:
  - `docs/runbooks/ws7e-go-no-go-prod.md`
- Estesa checklist rollout WS7 per includere `WS7-E` e gate di sign-off finale.
- Aggiornato `plan.md` con dipendenza esplicita dal go/no-go documentato prima del deploy produzione.

## 2026-03-23 (GDPR gate closure update)

- Privacy policy `it/en` `lastUpdate` riallineata al 23 marzo 2026 dopo remediation WS7-E.
- `docs/gdpr-feature-checklist.md` aggiornato a stato `approved_with_go_live_gate` con screening DPIA esplicito (`not required` per scope attuale).
- Runbook DSAR esteso con workflow assisted-export operativo (owner, SLA, formato output) per chiudere gap accountability su export path.

## 2026-03-24 (Admin compliance hub hardening)

- `/admin/compliance` esteso da sola vista GDPR a hub GDPR + AI Act.
- Added AI Act and accountability artifacts to protected list:
  - `docs/ai-act-feature-checklist.md`
  - `docs/ai-eu-act-landing.md`
  - `docs/runbooks/dsar-account-deletion.md`
  - `docs/runbooks/gdpr-ws1-ws7-test-report-2026-03-23.md`
  - `docs/runbooks/ws7-smoke-test-test-env-2026-03-23.md`
  - `docs/runbooks/ws7e-go-no-go-prod.md`
- Rendering documenti aggiornato: da plain `<pre>` a Markdown renderer con supporto tabelle/checklist.
- Aggiunte azioni operative per audit handoff:
  - `Download .md`
  - `Copy markdown`
- Aggiunta documentazione dedicata hub:
  - `docs/admin-compliance-hub.md`
