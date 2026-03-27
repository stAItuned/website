# Privacy Subprocessors Register

UpdatedAt: 2026-03-27

## Purpose

Questo registro centralizza i vendor e i subprocessors che possono trattare dati personali nel perimetro del repository `website`.
Il documento rende espliciti ruolo operativo, categorie dati, regioni, implicazioni di trasferimento, stato documentale/DPA e owner interno.

## Scope Notes

- Il registro copre i vendor che emergono da codice, inventory, legal copy e review GDPR del repo.
- `DPA status` e `security review status` possono essere `TBD` se la verifica documentale non e ancora chiusa; il registro resta comunque il source-of-truth operativo per WS2.
- Quando un vendor compare solo come integrazione facoltativa o opzionale, la colonna `Notes` deve dirlo esplicitamente.

## Register

| Vendor | Role posture | Service provided | Data categories involved | Regions / residency | Transfer implication | DPA status | Security review status | Owner | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Google Firebase / Firestore | processor / core infrastructure provider | primary app data store for public flows, admin flows, retention lifecycle, evidence storage | account identifiers, form submissions, waitlist data, lead data, contributor data, technical tokens, aggregate analytics | main runtime database `eu-primary` in `europe-west1`; legacy `(default)` database remains in `NAM5` but is no longer the main app datastore | main runtime posture now `EU` for app reads/writes; legacy US database remains a migration/legacy concern until decommissioned | `TBD - verify current contractual/docs posture` | `main runtime DB residency verified; centralized contract review not yet documented` | stAItuned engineering | `dbDefault()` and the client main wrapper now point to `eu-primary`; `(default)` is blocked for the main layer |
| Firebase Authentication | processor / auth provider | user authentication, ID tokens, admin session support | email, name, profile picture, uid, auth/session metadata | Google/Firebase infrastructure | likely yes or region-dependent; assess formally in WS3 transfer assessment | `TBD - verify Firebase terms / DPA mapping` | `baseline accepted in repo` | stAItuned engineering | used for account auth and server-side admin session gating |
| Firebase Cloud Messaging (FCM) | processor / messaging infrastructure | public editorial push notifications and admin operational push notifications | technical FCM token, topic, subscription status, admin token metadata | Google/Firebase infrastructure | likely yes or region-dependent; assess formally in WS3 transfer assessment | `TBD - verify under Firebase contractual umbrella` | `baseline accepted in repo` | stAItuned engineering | public and admin channels are separated; metadata-only posture documented |
| Firebase Hosting / App Hosting | processor / infrastructure provider | application hosting and runtime delivery | technical request metadata, IP/browser request context, app delivery logs | Google/Firebase infrastructure | likely yes or region-dependent; assess formally in WS3 transfer assessment | `TBD - verify under Firebase contractual umbrella` | `baseline accepted in repo` | stAItuned engineering | include runtime infrastructure even where app-level payload is minimal |
| Google Analytics | processor or independent recipient depending on configuration; treat as external analytics vendor for governance | analytics cookies and audience measurement after consent | analytics cookies, browser/navigation events, measurement metadata | Google infrastructure | likely yes; needs explicit treatment in transfer assessment | `TBD - verify current GA contractual posture` | `consent-gated runtime posture reviewed; contractual posture not centralized` | stAItuned engineering | enabled only after consent per current repo posture |
| Google Gemini | external AI vendor / subprocessor candidate | AI generation for Role Fit Audit and AI-related product flows | questionnaire answers, generated outputs, prompt payloads, possible contact-linked context depending on flow | Google infrastructure | likely yes; must be treated in transfer assessment | `TBD - verify AI vendor contractual posture` | `feature-level review exists; centralized vendor review not yet documented` | stAItuned engineering | referenced in GDPR and AI Act artifacts; keep aligned with AI governance docs |
| Resend | processor / email delivery provider | transactional email delivery, reports, agreement copies, service communications | email addresses, email content, limited contact/context data | vendor region not centralized in repo; verify | likely yes or vendor-region dependent; assess formally | `TBD - verify vendor DPA status` | `used in production flows; centralized review not yet documented` | stAItuned engineering | service communications only; no active marketing newsletter flow remains |
| Telegram | external communications vendor / minimized internal alert channel | operational notifications and metadata-only internal alerts | minimized metadata, submission identifiers/context, limited technical context | vendor region not centralized in repo; verify | likely yes; must be considered in transfer assessment | `TBD - verify acceptable internal-use posture` | `payload minimization completed; vendor review not centralized` | stAItuned engineering | repo posture is metadata-only; should not receive full form payloads |
| Calendly | external scheduling vendor | optional scheduling / follow-up path linked to AI EU Act and business flows | contact data, scheduling metadata, request context | vendor region not centralized in repo; verify | likely yes; assess formally | `TBD - verify vendor DPA status` | `usage referenced in docs; centralized review not yet documented` | stAItuned engineering | treat as optional but real external recipient where used |
| PayPal | external payment provider | payment handling for paid flows or external checkout references | payment identifiers, transaction metadata, billing/payment context | vendor region not centralized in repo; verify | likely yes; assess formally | `TBD - verify payment-provider contractual posture` | `legal copy aligned; centralized vendor review not yet documented` | stAItuned engineering | current repo references PayPal in legal copy and historical flow context |
| Google Fonts | external static resource provider | font delivery for frontend rendering | IP/request metadata, browser technical data | Google infrastructure | likely yes or region-dependent; assess formally | `not typically covered as DPA-like processor in repo docs; verify posture` | `not centrally reviewed` | stAItuned engineering | included because legal copy already mentions static resources from Google |

## Exclusions / Not Yet In Scope

- `Perplexity`: cited in product and historical audit context, but not currently evidenced as an active runtime integration in the governed `website` flows inspected for WS2. Re-open this entry if/when user-linked data is actually sent from this repo runtime.
- `Google Fonts` is included for transparency/accountability even if its legal role may differ from classic processor posture.

## Interpretation Rules

1. `TBD` in `DPA status` means the contractual/accountability verification is not yet centralized in repo docs; it does not mean the vendor is unknown.
2. `Role posture` is an operational classification for engineering governance, not a substitute for formal legal qualification.
3. If a vendor receives only metadata-only notifications, it must still appear here if personal data or person-linkable context can be involved.
4. WS3 (`privacy-transfer-assessment`) should consume this register rather than rebuilding the vendor list from scratch.

## Verification Checklist

- Every vendor named in `docs/privacy-processing-inventory.md` is represented here.
- Vendors named in `lib/i18n/legal-translations.ts` are represented here.
- Each row includes owner, transfer implication, and DPA status even if still `TBD`.
- Optional/inactive-by-default integrations are labeled clearly instead of omitted.
