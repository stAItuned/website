# DSAR and Account Deletion Coverage Matrix

UpdatedAt: 2026-03-23

## Purpose

Definire in modo operativo la coverage reale tra self-service account deletion e flussi assisted-DSAR.

## Coverage Matrix

| Dataset | Owner key | Delete path | Export path | Mode |
|---|---|---|---|---|
| `users` | `uid` | `POST /api/account/delete` | support export | self-service automatic |
| `preferences` | `uid` | `POST /api/account/delete` | support export | self-service automatic |
| `drafts` | `uid` | `POST /api/account/delete` | support export | self-service automatic |
| `writers` + `badges` | `uid` | `POST /api/account/delete` | support export | self-service automatic |
| `contributions` (unsigned) | `uid` | `POST /api/account/delete` | support export | self-service automatic |
| `contributions.agreement` (signed) | `uid` | pseudonimizzazione + retained evidence only + legal exception review due date | support export | assisted/legal exception aware |
| `role_fit_audit_submissions` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `career_os_waitlist` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `career_os_applications` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `career_os_audit` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `contributor_applications` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `contact_requests` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `feedback_submissions` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `business_demo_requests` | `email` | `POST /api/account/delete` con email auth verificata | support export | self-service automatic |
| `fcm_admin_tokens` | `registeredByUid` | `POST /api/account/delete` | support export | self-service automatic |
| `fcm_tokens` | token tecnico non account-bound | assisted DSAR | support export | assisted |
| `leads_ai_act_tools` | email lead (non account-bound by default) | assisted DSAR | support export | assisted |

## API Output Contract

`POST /api/account/delete` restituisce:
- `summary.deleted`: percorsi eliminati
- `summary.retained`: percorsi trattenuti per eccezione legale
- `summary.errors`: errori durante cleanup
- `summary.datasetCoverage`: mapping machine-readable dataset-level con `owner`, `deletePath`, `exportPath`, `status`, `deletedCount`, `retainedCount`, `notes`
- Gli errori sono tracciati per dataset (`datasetCoverage.<dataset>.status=error`) oltre al log aggregato.

## Operational Notes

- Self-service è affidabile solo su chiavi robuste (`uid`, email verificata in token auth).
- Dataset non account-bound restano in assisted-DSAR per evitare cancellazioni errate.
- Per contributor agreements firmati, la cancellazione completa richiede valutazione legale caso per caso.

## Assisted Export Workflow (Operational)

| Step | Owner | SLA target | Output |
|---|---|---|---|
| Intake richiesta DSAR export (email `info@staituned.com`) | Support/Privacy | entro 2 giorni lavorativi | ticket DSAR aperto con identity check |
| Verifica identita richiedente | Support/Privacy | entro 3 giorni lavorativi | richiesta validata o respinta |
| Estrazione dataset assisted (`fcm_tokens`, `leads_ai_act_tools`, eventuali agreement legal-exception) | Engineering | entro 10 giorni lavorativi | export JSON/CSV cifrato |
| Review privacy/legal pre-consegna | Privacy reviewer | entro 3 giorni lavorativi | pacchetto approvato |
| Consegna sicura al richiedente | Support/Privacy | entro 30 giorni complessivi (Art.12 GDPR) | evidenza consegna + log ticket |

Formato export standard:
- JSON per dati strutturati complessi
- CSV per dataset tabellari
- timestamp ISO UTC
- campi redatti/pseudonimizzati se richiesto da eccezione legale documentata
