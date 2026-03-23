# Privacy Retention Schedule (WS5 MVP)

UpdatedAt: 2026-03-22

## Scope

Questo schedule definisce il contratto retention applicato nel WS5 Strategia A (MVP strutturale).
Default operativo: `hard_delete` sui record scaduti.

## Dataset Policies

| Dataset | TTL (days) | Action | Rationale | Notes |
|---|---:|---|---|---|
| `role_fit_audit_submissions` | 365 | `hard_delete` | retention standard Role Fit 12 mesi | gia presente `retentionUntil` |
| `career_os_waitlist` | 365 | `hard_delete` | retention standard waitlist 12 mesi | gia presente `retentionUntil` |
| `business_demo_requests` | 365 | `hard_delete` | lead commerciale con lifecycle allineato WS5 | standardizzato in MVP |
| `contact_requests` | 365 | `hard_delete` | richieste contatto con minimizzazione temporale | standardizzato in MVP |
| `feedback_submissions` | 365 | `hard_delete` | feedback operativo non necessario oltre finestra annuale | standardizzato in MVP |
| `contributor_applications` | 540 | `hard_delete` | finestra policy 12-24 mesi (impostata 18 mesi) | midpoint operativo |

## Contract Fields

Ogni record in scope WS5 deve includere:
- `createdAt`
- `updatedAt`
- `retentionUntil`
- `status`
- `deletedAt` (nullable)
- `anonymizedAt` (nullable)

## Exceptions

Nel MVP non sono previste eccezioni attive.
Se necessaria un’eccezione legale, va aggiunta in `lib/privacy/retention-policies.ts` con `legalException` esplicita.
