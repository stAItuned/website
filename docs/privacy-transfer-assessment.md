# Privacy Transfer Assessment

UpdatedAt: 2026-03-27

## Purpose

Questo documento valuta i principali scenari di trasferimento e accesso potenziale a dati personali nel perimetro del repository `website`.
La struttura e scenario-based: ogni scenario raggruppa uno o piu vendor con rischio e controlli simili, evitando di duplicare il registro vendor di `docs/privacy-subprocessors-register.md`.

## Scope Notes

- Il documento assume come origine primaria i dati raccolti da utenti e sistemi gestiti da stAItuned nel contesto del sito web e delle sue API.
- Quando la regione precisa del vendor o il meccanismo contrattuale non e ancora centralizzato nel repo, la valutazione resta esplicitamente `TBD` e il rischio residuo non viene mascherato.
- Questo documento non sostituisce una review legale formale su SCC, adeguacy, TIA o altri strumenti di trasferimento.

## Transfer Scenarios

| Scenario | Vendors / systems | Origin region | Destination region | Data categories involved | Transfer mechanism | Supplementary controls | Cleartext access required | Legal escalation required | Residual risk | Owner |
|---|---|---|---|---|---|---|---|---|---|---|
| Core app storage and hosting | Firebase Hosting / App Hosting, Google Firebase / Firestore | user browser and stAItuned-managed app systems, primarily EU-facing context | main app datastore `eu-primary` in `europe-west1`; hosting/runtime region still under Google/Firebase infrastructure review; legacy `(default)` Firestore remains in `NAM5` outside the main runtime path | form submissions, account identifiers, contributor data, technical request metadata, aggregate analytics, retention/evidence records | Firestore main runtime region verified as `europe-west1`; broader Google/Firebase contractual posture still `TBD` | data minimization in forms, retention schedule, metadata-only notifications for downstream channels, admin route protection, server-side auth hardening, hard cutover of main app reads/writes away from legacy `(default)` | vendor platform may have infrastructure-level access; routine cleartext operational access not documented in repo | `yes` until contractual mechanism and residual legacy-db handling are documented centrally | `medium` | stAItuned engineering |
| Authentication and session security | Firebase Authentication, Firebase Admin SDK session verification | user browser and server-side auth/session flows | vendor cloud region `TBD`; likely Google infrastructure | email, name, profile picture, uid, ID token, session/auth metadata | `TBD - verify under Firebase contractual posture` | essential-cookie posture, server-side `httpOnly` session cookie, admin allowlist and route protection, limited auth field scope | platform-side processing of auth data is inherent; unrestricted vendor cleartext access not documented | `yes` until mechanism/region are formalized | `medium` | stAItuned engineering |
| Consent-gated analytics and audience measurement | Google Analytics, first-party article views on Firebase | user browser and site analytics flows | Google Analytics region/mechanism `TBD`; first-party article view storage under Firebase posture above | analytics cookies, navigation events, article-view metadata, browser technical context | GA: `TBD`; first-party article views: inherited from Firebase posture | consent gating for GA, separate first-party audience measurement, minimal article-view payload, no marketing cookie in first-party counter | GA receives analytics payload in readable form; first-party counter remains minimized | `yes` for GA transfer posture until documented; `no additional` for first-party beyond Firebase scenario | `medium-high` | stAItuned engineering |
| AI generation and AI-assisted outputs | Google Gemini | server-side prompt/response flows originating from user-submitted forms or editorial systems | vendor cloud region `TBD`; likely Google infrastructure | questionnaire answers, generated outputs, prompt context, potentially person-linkable career or contributor context depending on flow | `TBD - verify AI vendor contractual and transfer posture` | scope-limited prompts per feature, DPIA screening for Role Fit Audit, privacy lawful-basis split, retention controls in primary store | yes, because model provider must process prompt content in readable form to generate outputs | `yes` | `high` | stAItuned engineering |
| Transactional email delivery | Resend | stAItuned systems sending service communications | vendor region/mechanism `TBD` | email addresses, email content, report delivery content, agreement copy content | `TBD - verify vendor terms / DPA / region` | service-only email posture, no active marketing newsletter, metadata minimization in internal alerts, retention in primary systems | yes, email delivery inherently requires readable message content by the provider path | `yes` | `medium-high` | stAItuned engineering |
| Operational notification channels | Telegram | stAItuned backend notification flows | vendor regions `TBD` | metadata-only notifications, submission identifiers/context, limited technical context | `TBD - verify acceptable operational-use and transfer posture` | metadata-only payload policy, no full report/email/free-text payloads for governed flows | yes, providers can read message payloads even if minimized | `yes` | `medium-high` | stAItuned engineering |
| Push notification delivery | Firebase Cloud Messaging | browser/device registration and backend-triggered notification flows | vendor cloud region `TBD`; likely Google infrastructure | technical FCM token, topic, subscription state, admin token metadata | `TBD - verify under Firebase contractual posture` | public/admin channel separation, 90-day retention, metadata-only usage, unsubscribe/unregister lifecycle | yes for token routing and push delivery metadata, but payload scope is technically limited | `yes` until region/mechanism are formalized | `medium` | stAItuned engineering |
| Scheduling and external follow-up | Calendly | user browser or stAItuned follow-up path | vendor region/mechanism `TBD` | contact data, scheduling metadata, request context | `TBD - verify vendor contractual posture` | optional usage only, linked to user-requested flows, keep scheduling data limited to necessary context | yes, scheduling provider needs readable booking data | `yes` | `medium-high` | stAItuned engineering |
| Payments and checkout providers | PayPal | user browser and payment-related flow handoff | vendor regions/mechanisms `TBD` | payment identifiers, billing/payment context, transaction metadata | `TBD - verify provider-specific terms and transfer posture` | payment handling is externalized to provider, legal copy names provider explicitly, app-side payment data scope should remain limited | yes, payment providers necessarily process transaction/billing data | `yes` | `medium-high` | stAItuned engineering |
| Static assets and frontend resource delivery | Google Fonts | user browser requests from site frontend | vendor region/mechanism `TBD` | IP/request metadata, browser technical context | `TBD - verify static-resource posture and whether alternative hosting is needed` | disclosure in legal copy, limited data scope to resource request metadata | yes at HTTP request level | `yes if kept as third-party hosted asset` | `medium` | stAItuned engineering |

## Red Flags Present In Current State

- Più scenari dipendono ancora da `TBD` su regione precisa e meccanismo contrattuale.
- I provider AI e notification channels comportano accesso in chiaro al payload, anche se oggi con minimizzazione migliore rispetto alla baseline audit.
- Analytics e static resources dipendono ancora da vendor esterni con posture contrattuali non centralizzate nel repo.

## Current Repo-Level Mitigations

- Google Analytics e consent-gated.
- Article views first-party sono separate da GA e minimizzate.
- Telegram e ridotto a metadata-only dove governato.
- Push notifications hanno retention breve e canali separati tra pubblico e admin.
- Le route admin sono protette con session cookie server-side `httpOnly` e controllo `isAdmin`.
- I principali flow hanno retention standardizzata e lawful-basis split esplicito.

## Escalation Priorities

1. Confermare per ogni scenario critico (`Firebase`, `Google Analytics`, `Gemini`, `Resend`, `Telegram`, `Calendly`, `PayPal`) regione effettiva e posture contrattuali.
2. Verificare se esistono meccanismi gia accettati a livello organizzativo che non sono ancora riportati nel repo.
3. Rivalutare i casi con `cleartext access required = yes` per capire se servono ulteriori limitazioni di payload o note legali specifiche.

## Interpretation Rules

1. Questo assessment e scenario-based; il dettaglio vendor-per-vendor resta nel `docs/privacy-subprocessors-register.md`.
2. `Residual risk` resta volutamente prudente se il meccanismo di trasferimento non e centralizzato nel repo.
3. Chiudere `WS3` significa avere il documento scenario-based, non dichiarare risolti tutti i `TBD` contrattuali.
4. I `TBD` documentati qui devono guidare eventuali follow-up legal/ops, non essere persi nei successivi workstream.

## Verification Checklist

- Ogni vendor del subprocessors register e coperto da almeno uno scenario qui.
- Gli scenari con accesso in chiaro sono esplicitati.
- Gli scenari ad alto rischio o con meccanismo `TBD` segnano `Legal escalation required`.
- Il documento puo essere usato come input diretto per review legale/ops senza ricostruire il contesto dal codice.
