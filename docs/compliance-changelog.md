# Compliance Changelog

UpdatedAt: 2026-03-22

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
