# GDPR Webapp Compliance Retrospective

## 1. Request Snapshot
- Feature/page name: GDPR webapp compliance retrospective and master-plan refresh
- Requested on: 2026-03-23
- Requested by: repository owner
- Status: `approved`
- Related docs/specs:
  - [plan.md](/Users/moltisantid/Personal/website/plan.md)
  - [docs/gdpr-audit-webapp-2026-03-22.md](/Users/moltisantid/Personal/website/docs/gdpr-audit-webapp-2026-03-22.md)
  - [docs/privacy-processing-inventory.md](/Users/moltisantid/Personal/website/docs/privacy-processing-inventory.md)
  - [docs/privacy-retention-schedule.md](/Users/moltisantid/Personal/website/docs/privacy-retention-schedule.md)
  - [docs/gdpr-feature-checklist.md](/Users/moltisantid/Personal/website/docs/gdpr-feature-checklist.md)

## 2. Goal
- Consolidare in un unico artefatto narrativo lo stato reale del programma GDPR della webapp dopo il re-check statico del 2026-03-23.
- Espandere il target da "chiudere i rilievi critici/alti dell'audit 2026-03-22" a "raggiungere un piano GDPR difendibile end-to-end".
- Fornire il contesto decisionale che giustifica l'introduzione del nuovo `WS7` in [plan.md](/Users/moltisantid/Personal/website/plan.md).

## 3. Non-Goals
- Questo documento non implementa remediation tecniche.
- Questo documento non aggiorna ancora inventory, retention schedule, legal policy o route code.
- Questo documento non sostituisce una review legale formale esterna.

## 4. Baseline e fonti
- Audit base: [docs/gdpr-audit-webapp-2026-03-22.md](/Users/moltisantid/Personal/website/docs/gdpr-audit-webapp-2026-03-22.md)
- Tracker operativo principale: [plan.md](/Users/moltisantid/Personal/website/plan.md)
- Registro trattamenti repo-driven: [docs/privacy-processing-inventory.md](/Users/moltisantid/Personal/website/docs/privacy-processing-inventory.md)
- Retention schedule MVP: [docs/privacy-retention-schedule.md](/Users/moltisantid/Personal/website/docs/privacy-retention-schedule.md)
- Gate e review privacy: [docs/gdpr-feature-checklist.md](/Users/moltisantid/Personal/website/docs/gdpr-feature-checklist.md)
- Re-check statico 2026-03-23: review locale di route API, policy pubbliche, dataset in retention scope e superfici rimaste fuori da WS1-WS6.

## 5. Stato corrente consolidato
- `WS1`: chiuso. Analytics non essenziali realmente opt-in e first-party article views separate da GA.
- `WS2`: quasi chiuso. Newsletter dismessa lato prodotto/codice, con decommission prod ancora da completare.
- `WS3`: hardening completato. Role Fit Audit con consenso server-side, retention metadata e canali interni minimizzati; rollout/monitoraggio ancora pending.
- `WS4`: chiuso. Inventory, compliance changelog e trasparenza repo-driven introdotti.
- `WS5`: in-review. Framework retention centralizzato attivo in MVP, ma ancora non esteso a tutti i dataset residuali.
- `WS6`: implementazione chiusa. Admin notifications metadata-only introdotte, rollout operativo ancora pending.

## 6. Miglioramenti gia ottenuti
- Analytics opt-in reale senza bypass lato client.
- Newsletter marketing dismessa con endpoint tombstone e rimozione delle CTA legacy.
- Role Fit Audit hardening con `acceptedPrivacy`, `consent.*`, `retentionUntil` e screening DPIA.
- Career OS waitlist riallineata a consenso, versioning e retention.
- Inventory trattamenti e compliance changelog introdotti come baseline operativa.
- Retention framework MVP e runbook lifecycle introdotti per i dataset in scope.
- Notifiche admin-only metadata-only introdotte per ridurre replica di PII su canali terzi.

## 7. Gap residui emersi dal re-check 2026-03-23

| Gap ID | Severity | Flow / dataset | Current issue | GDPR principle impacted | Target remediation workstream |
|---|---|---|---|---|---|
| `G1` | `Alto` | `leads_ai_act_tools` | dataset e lead flow AI EU Act non governati da inventory, retention e policy repo-driven | trasparenza, limitazione della conservazione, accountability | `WS7-A` |
| `G2` | `Alto` | `career_os_applications` | flow applicativo fuori da WS4/WS5/WS6 con PII persistita e notifiche non riallineate allo standard metadata-only | minimizzazione, retention, accountability | `WS7-A` |
| `G3` | `Alto` | `career_os_audit` | flow Telegram-only senza persistenza governata, retention esplicita o percorso diritti strutturato | minimizzazione, diritti dell'interessato, accountability | `WS7-A` |
| `G4` | `Alto` | `fcm_tokens` | push editoriali pubblici senza retention/lifecycle documentato e senza copertura nel retention schedule | limitazione della conservazione, trasparenza | `WS7-B` |
| `G5` | `Alto` | contributor agreement lifecycle | disclosure troppo generica e assenza di decisione esplicita su eccezione legale vs hard delete per prova contrattuale | limitazione della conservazione, integrita/accountability | `WS7-C` |
| `G6` | `Medio-Alto` | account deletion / DSAR | cancellazione self-service parziale rispetto ai dataset reali e assenza di matrice delete/export path | diritti dell'interessato, accountability | `WS7-D` |
| `G7` | `Alto` | AI EU Act access token lifecycle | token in query string senza expiry/lifecycle documentato e mismatch tra comportamento reale e copy "invalid or expired" | trasparenza, privacy by design, limitazione della conservazione | `WS7-A` |

### Addendum legal review (2026-03-23, post-implementation)

| Gap ID | Severity | Flow / dataset | Current issue | GDPR principle impacted | Target remediation workstream |
|---|---|---|---|---|---|
| `G8` | `Alto` | `contributions` (agreement signed) | eccezione legale applicata con conservazione troppo ampia del documento (campi non strettamente probatori ancora presenti) | minimizzazione, limitazione della finalita | `WS7-E` |
| `G9` | `Alto` | contributor agreement legal exception | retention eccezione legale senza finestra temporale esplicita o trigger di riesame | limitazione della conservazione, accountability | `WS7-E` |
| `G10` | `Medio-Alto` | privacy policy `it/en` | sezione data collection non esplicita su Career OS apply/audit e AI EU Act lead come trattamenti distinti | trasparenza (art. 13), correttezza informativa | `WS7-E` |
| `G11` | `Medio` | `POST /api/account/delete` audit trail | error handling aggregato non sempre dataset-specifico nel report di cancellazione | accountability, tracciabilita operativa DSAR | `WS7-E` |
| `G12` | `Medio` | processing inventory vendor row | agreement flow con recipient generico "provider email" invece di vendor nominato | trasparenza destinatari/sub-processors | `WS7-E` |

## 8. Affected Surfaces
- Routes/pages:
  - `POST /api/leads/ai-act`
  - `POST /api/career-os/apply`
  - `POST /api/career-os/audit`
  - `/api/notifications/register`
  - `/api/notifications/subscribe`
  - `/api/notifications/unsubscribe`
  - `POST /api/account/delete`
  - `POST /api/contributor/save-progress`
- Components:
  - prompt/editorial PWA push UI
  - AI EU Act lead form and resources gate
- APIs/server functions:
  - notification registration/unregistration handlers
  - account deletion handler
  - contributor agreement persistence
- Data stores:
  - `leads_ai_act_tools`
  - `career_os_applications`
  - `career_os_audit` or future replacement dataset
  - `fcm_tokens`
  - contributor agreement data within `contributions`
- Third-party services/vendors:
  - Firebase/Firestore
  - Firebase Cloud Messaging
  - Telegram
  - Calendly
- Existing docs that will need future updates:
  - privacy policy
  - cookie policy
  - processing inventory
  - retention schedule
  - contributor agreement policy
  - AI EU Act landing doc

## 9. Privacy/GDPR screening
- Personal data involved: `yes`
- Data categories:
  - email, name, company, role, phone, LinkedIn/profile links, free-text notes, technical notification tokens, legal name, fiscal code, IP, user agent, contract fingerprint/hash
- Purpose of processing:
  - lead generation, application intake, editorial push notifications, contributor contract evidence, user account deletion
- Consent/legal basis assumptions:
  - several residual flows still need explicit repo-driven confirmation of lawful basis and consent/versioning strategy
- Retention/deletion/export implications:
  - uncovered datasets are outside current WS5 scope
  - contributor agreements need explicit retention-vs-legal-exception decision
  - self-service account deletion does not cover the full treatment surface
- Vendors/subprocessors involved:
  - Firebase/Firestore, Firebase Cloud Messaging, Telegram, Calendly
- GDPR follow-up required: `yes`

### Specific screening themes
- Lawful basis gaps:
  - residual lead flows need explicit mapping between purpose, consent, and pre-contractual basis.
- Retention/deletion/export gaps:
  - AI EU Act leads, Career OS applications, public push tokens, and agreement evidence are not fully covered by current retention governance.
- Vendor/subprocessor exposure gaps:
  - Telegram payload minimization is not uniformly enforced on all residual flows.
- DSAR handling gaps:
  - current delete path is not mapped dataset-by-dataset for self-service vs assisted workflows.
- End-of-contract / legal evidence handling gap:
  - contributor agreement evidence may require a legal exception rather than default hard delete, but no decision is documented yet.

## 10. AI / AI Act overlap note
- `AI EU Act lead` has an overlap with AI governance because it sits on an AI-themed acquisition flow and access-control token model.
- In this retrospective the focus remains GDPR/privacy, not AI Act classification.
- Any future material change to the AI EU Act flow should also re-check [docs/ai-act-feature-checklist.md](/Users/moltisantid/Personal/website/docs/ai-act-feature-checklist.md) to keep privacy and AI governance aligned.

## 11. Decisione operativa
- Introdurre `WS7` in [plan.md](/Users/moltisantid/Personal/website/plan.md) come wave specifica di closure dei residual gaps emersi dal re-check 2026-03-23.
- Ordine raccomandato:
  1. lead flows uncovered
  2. DSAR/account deletion completion
  3. public push tokens
  4. contributor agreement lifecycle
  5. legal hardening post-review (minimizzazione eccezione, durata, trasparenza policy/vendor, audit trail)
- Razionale:
  - i gap non sono regressioni dei workstream chiusi;
  - sono superfici rimaste fuori dal perimetro originario;
  - lasciarli fuori dal piano impedirebbe di sostenere un reale stato "GDPR compliant by design".

## 12. Validation Plan
- Verifica documentale:
  - il brainstorming deve spiegare chiaramente cosa e gia chiuso e cosa e ancora aperto;
  - deve motivare perche nasce `WS7`;
  - deve cross-linkare i documenti compliance centrali.
- Verifica di coerenza piano:
  - `plan.md` deve recepire `WS7` come nuovo workstream aperto;
  - il piano non deve descrivere i gap residuali come risolti.

## 13. Documentation Plan
- Page docs to update in future implementation waves:
  - AI EU Act landing/resources docs
  - privacy and cookie policy pages
- Feature docs to update in future implementation waves:
  - contributor agreement policy
  - writer onboarding/account deletion docs
- Runbook/legal/privacy docs to update in future implementation waves:
  - processing inventory
  - retention schedule
  - GDPR feature checklist
  - eventuali runbook DSAR/account deletion

## 14. Acceptance criteria del brainstorming
- Il documento permette a chi implementa di capire:
  - cosa e gia chiuso;
  - cosa resta aperto;
  - perche i nuovi gap non stanno gia dentro WS1-WS6;
  - come questi gap verranno tracciati in [plan.md](/Users/moltisantid/Personal/website/plan.md).
- Il documento non presenta i gap del 2026-03-23 come gia risolti.
- Il documento funge da source-of-truth decisionale per il nuovo `WS7`.

## 15. Post-review Execution Note
- A valle della legal review, i gap `G8-G12` sono stati instradati nel sotto-track `WS7-E` del piano.
- Le remediation tecniche/documentali sono in corso con approccio "evidence-minimum retention + policy transparency + dataset-specific accountability".
