# Privacy Processing Inventory (Repo-Driven)

UpdatedAt: 2026-03-23

## Purpose

Questo inventario e la baseline operativa per mantenere allineati codice, dataset e disclosure legali.
Ogni modifica a feature con dati personali deve aggiornare questo file nella stessa PR.

## Mandatory Row Schema

Ogni riga del registro deve includere obbligatoriamente:
- endpoint/surface
- data categories
- purpose
- legal basis
- recipients/vendors
- retention
- layered notice

## Changelog

- 2026-03-22: prima versione strutturata (WS4 Strategia A), allineata ai trattamenti ad alto rischio.
- 2026-03-22: sweep di chiusura WS4 completato (matrice P4, normalizzazione wording retention con tagging WS5).
- 2026-03-22: avvio WS5 Strategia A (MVP): retention contract centralizzato + lifecycle runbook + standardizzazione retention su dataset in scope.
- 2026-03-23: WS6 Strategia B avviata con notifiche operative admin-only PWA (metadata-only) e canali terzi ridotti a eventi minimizzati.
- 2026-03-23: WS7-A/B/D avviati: lead flows AI EU Act/Career OS portati in governance retention + minimizzazione Telegram, push editoriali `fcm_tokens` sotto lifecycle, matrice DSAR/account deletion estesa.

## WS4 Closure Sweep Matrix (P4 Alto)

| Flow | Evidence (code/doc) | Outcome |
|---|---|---|
| Role Fit Audit | `app/api/role-fit-audit/submit/route.ts`, `lib/email/roleFitAuditEmail.ts`, `lib/i18n/role-fit-audit-translations.ts`, `lib/i18n/legal-translations.ts` | `OK` |
| Career OS waitlist | `app/api/career-os/waitlist/route.ts`, `app/(public)/career-os/PricingSection.tsx`, `lib/i18n/career-os-translations.ts`, `lib/i18n/legal-translations.ts` | `OK` |
| Business apply | `app/api/business/apply/route.ts`, `lib/i18n/business-translations.ts`, `lib/i18n/legal-translations.ts` | `WS5 Gap` (retention lifecycle tecnica) |
| Contact + feedback | `app/api/contact/route.ts`, `app/api/feedbacks/route.ts`, `lib/i18n/legal-translations.ts` | `WS5 Gap` (retention lifecycle tecnica) |
| Contributors apply | `app/api/contributors/apply/route.ts`, `lib/i18n/contribute-translations.ts`, `lib/i18n/learn-translations.ts`, `lib/i18n/legal-translations.ts` | `OK` (policy-level retention coerente) |
| Analytics (consent + first-party) | `lib/gtag.ts`, `lib/analytics/trackEvent.ts`, `app/api/analytics/page-view/route.ts`, `lib/i18n/legal-translations.ts` | `OK` |

## Processing Register

| Flow | Endpoint / Surface | Data Categories | Purpose | Legal Basis (assumption) | Recipients / Vendors | Retention | Layered Notice |
|---|---|---|---|---|---|---|---|
| Article views first-party | `POST /api/analytics/page-view` | article slug, timestamp, contatore aggregato | metriche editoriali aggregate senza GA | legittimo interesse (misurazione minima) | Firebase/Firestore | contatore cumulativo (no profilo utente) | privacy page (blog visits section) |
| Google Analytics (consent-gated) | client analytics | cookie analytics, eventi navigazione | analisi traffico e performance marketing | consenso | Google Analytics | secondo policy GA/config banner | cookie banner + cookie policy |
| Role Fit Audit submit | `POST /api/role-fit-audit/submit` + `/role-fit-audit` | email, nome opzionale, social opzionale, answers, risultato AI, consenso | generazione report personalizzato e follow-up operativo | consenso (submit/report) + legittimo interesse operativo | Firebase/Firestore, Google Gemini, Resend, Telegram (metadata-only) | 12 mesi (`retentionUntil`) | checkbox privacy + microcopy contestuale |
| Career OS waitlist | `POST /api/career-os/waitlist` + `/career-os` pricing modal | email, intent (tier/mode/objective), consensi privacy/terms/marketing, metadata source/page | gestire lista attesa e ricontatto coerente al consenso | consenso (privacy + terms, marketing opzionale) | Firebase/Firestore, Resend, Telegram (metadata-only), FCM admin-ops (metadata-only) | 12 mesi (`retentionUntil`) | checkbox privacy/terms + notice contestuale |
| Business request | `POST /api/business/apply` + `/business` | email, nome, azienda, messaggio, consenso privacy | gestione richieste commerciali | consenso + legittimo interesse precontrattuale | Firebase/Firestore, Telegram (metadata-only), FCM admin-ops (metadata-only) | 12 mesi (`retentionUntil`) | form consent copy + privacy/terms links |
| Contact / feedback forms | `POST /api/contact`, `POST /api/feedbacks` | dati contatto e testo libero | supporto e risposta richieste | consenso / legittimo interesse a rispondere | Firebase/Firestore, Telegram (metadata-only), Slack (metadata-only, opzionale), FCM admin-ops (metadata-only) | 12 mesi (`retentionUntil`) | notice nel form + privacy policy |
| Contributor applications | `POST /api/contributors/apply` | profilo candidato, portfolio, note | valutazione candidatura collaborazione | misure precontrattuali + consenso informativo | Firebase/Firestore, Telegram (metadata-only), FCM admin-ops (metadata-only) | 12-24 mesi (policy) | disclosure nella pagina contributore |
| Contributor agreement signatures | `POST /api/contributor/save-progress` | legal name, fiscal code, email autore, ip, user-agent, hash accordo, timestamp firma | prova contrattuale e accountability sul ciclo contributor | esecuzione/preparazione contrattuale + obblighi legali di prova | Firebase/Firestore, Resend (invio copia accordo) | legal exception documentata (retained evidence only, review due in 10 years) | contributor agreement policy + privacy policy |
| AI EU Act leads | `POST /api/leads/ai-act` + `/ai-eu-act/risorse` | nome, email, company, ruolo, consensi privacy/marketing, ip hash, token accesso con expiry | gestione lead magnet AI EU Act e accesso risorse gated | consenso + legittimo interesse operativo (antifrode e controllo accessi) | Firebase/Firestore, Telegram (metadata-only), Calendly (follow-up opzionale) | 12 mesi (`retentionUntil`), token accesso 30 giorni (`accessTokenExpiresAt`) | form AI EU Act + privacy policy + doc AI EU Act |
| Career OS applications | `POST /api/career-os/apply` | nome, email, phone opzionale, background, role target, timeline, blocchi, note | intake applicativo Career OS e follow-up orientativo | misure precontrattuali + consenso informativo | Firebase/Firestore, Telegram (metadata-only) | 12 mesi (`retentionUntil`) | form Career OS + privacy policy |
| Career OS audit requests | `POST /api/career-os/audit` | nome, email, phone opzionale, dubbio, disponibilita, consenso privacy | richiesta supporto audit e contatto successivo | misure precontrattuali + consenso informativo | Firebase/Firestore, Telegram (metadata-only) | 12 mesi (`retentionUntil`) | form Career OS audit + privacy policy |
| Editorial push notifications (public) | `/api/notifications/register`, `/api/notifications/subscribe`, `/api/notifications/unsubscribe`, `DELETE /api/notifications/register` | token FCM tecnico, topic editoriale, stato iscrizione, metadata lifecycle | invio notifiche editoriali su nuovi contenuti | consenso browser push + legittimo interesse editoriale | Firebase/Firestore, Firebase Cloud Messaging | 90 giorni (`retentionUntil`) | prompt PWA + cookie/privacy policy |
| Admin operational push notifications | `/api/admin/notifications/*` + `/admin` | token FCM tecnico, email admin allowlist, uid admin, topic tecnico | notifiche operative admin-only con dettaglio in dashboard protetta | legittimo interesse operativo + sicurezza accessi admin | Firebase/Firestore, Firebase Cloud Messaging | 90 giorni (`retentionUntil`) | card admin dedicata + privacy policy |

## DSAR / Account Deletion Mapping Note

- Self-service (`POST /api/account/delete`) copre dataset account-bound via `uid` e dataset email-bound con matching affidabile sull'email autenticata.
- Assisted DSAR resta obbligatorio per dataset non robustamente account-bound (`fcm_tokens`) e per `leads_ai_act_tools`.
- `contributions` applica default `legal_exception` sui contributor agreement firmati (evidenza contrattuale), con pseudonimizzazione account e retention motivata.
- Matrice operativa completa: `docs/runbooks/dsar-account-deletion.md`.

## Governance Rules

1. Ogni nuovo vendor o nuovo dataset deve essere inserito qui prima del deploy.
2. Ogni row deve avere owner tecnico (PR author) e revisore privacy (gate GDPR).
3. Se un flow non ha retention esplicita, va aperto task WS5 prima della release.
4. Le notice contestuali (Strategia C) devono puntare sempre a `/privacy` e `/terms` con testo coerente it/en.

## Verification Checklist

- Codice vs inventory: endpoint e campi reali corrispondono.
- Inventory vs legal translations: vendor, finalita e retention allineati.
- Inventory vs admin compliance hub: documenti presenti e consultabili.
