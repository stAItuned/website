# Privacy Retention Schedule (WS5 MVP)

UpdatedAt: 2026-03-23

## Scope

Questo schedule definisce il contratto retention applicato nel WS5 Strategia A (MVP strutturale).
Default operativo: `hard_delete` sui record scaduti.

## Dataset Policies

| Dataset | TTL (days) | Action | Rationale | Notes |
|---|---:|---|---|---|
| `role_fit_audit_submissions` | 365 | `hard_delete` | retention standard Role Fit 12 mesi | gia presente `retentionUntil` |
| `career_os_waitlist` | 365 | `hard_delete` | retention standard waitlist 12 mesi | gia presente `retentionUntil` |
| `career_os_applications` | 365 | `hard_delete` | intake Career OS in finestra annuale | WS7-A |
| `career_os_audit` | 365 | `hard_delete` | richieste audit Career OS con lifecycle unificato | WS7-A |
| `leads_ai_act_tools` | 365 | `hard_delete` | lead AI EU Act con access token a vita breve | WS7-A |
| `business_demo_requests` | 365 | `hard_delete` | lead commerciale con lifecycle allineato WS5 | standardizzato in MVP |
| `contact_requests` | 365 | `hard_delete` | richieste contatto con minimizzazione temporale | standardizzato in MVP |
| `feedback_submissions` | 365 | `hard_delete` | feedback operativo non necessario oltre finestra annuale | standardizzato in MVP |
| `contributor_applications` | 540 | `hard_delete` | finestra policy 12-24 mesi (impostata 18 mesi) | midpoint operativo |
| `fcm_tokens` | 90 | `hard_delete` | token push editoriali pubblici | WS7-B |
| `fcm_admin_tokens` | 90 | `hard_delete` | token push tecnici admin-only per notifiche operative | WS6 Strategy B |

## Contract Fields

Ogni record in scope WS5 deve includere:
- `createdAt`
- `updatedAt`
- `retentionUntil`
- `status`
- `deletedAt` (nullable)
- `anonymizedAt` (nullable)

## Exceptions

- Contributor agreements (dataset `contributions.agreement`) usano default `legal_exception` documentata per evidenza contrattuale e difesa legale.
- In account deletion self-service, i record con agreement firmato non vengono hard-deleted di default: vengono pseudonimizzati e marcati con rationale di eccezione.
- Riferimento tecnico: `CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION` in `lib/privacy/retention-policies.ts`.
- Finestra operativa eccezione legale: fino a 10 anni dalla firma (`legal_retention_review_due_at`), salvo obblighi/hold ulteriori formalmente documentati.
- Scope minimizzato eccezione legale: si conserva solo evidenza probatoria agreement (es. versione, timestamp firma, hash, identita legale minima, metadata audit), eliminando campi non essenziali di bozza/intervista.
