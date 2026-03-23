# Compliance Changelog

UpdatedAt: 2026-03-23

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
