# Compliance Changelog

UpdatedAt: 2026-03-27

## Maintenance Rules

- Aggiungere una entry per ogni wave GDPR/privacy-related.
- Ogni entry deve citare workstream e superfici impattate (API, form, legal copy, dataset, vendor).
- Nessuna release privacy-related deve chiudersi senza update di questo file.

## 2026-03-27 (Firestore legacy `(default)` decommission planning)

- Formalizzato il workstream operativo per la chiusura del Firestore legacy `(default)` rimasto in `NAM5` dopo il cutover del main runtime verso `eu-primary`.
- Aggiunto piano dedicato:
  - `docs/firestore-default-legacy-decommission-plan.md`
- Chiuso il blocker di codice residuo nel package `functions`, che inizializzava Firestore senza `databaseId` e avrebbe continuato a usare il `(default)` deployabile.
- Raccolta evidenza GCP completata:
  - `(default)` confermato in `nam5`
  - `eu-primary` confermato in `europe-west1`
  - export finale legacy verificato in `gs://staituned-firestore-export-us/firestore-export-final-20260327-121729`
  - copia archivio EU verificata in `gs://staituned-firestore-archive-eu/firestore-export-final-20260327-121729`
- Aggiunto audit script repo-local per inventory Firestore:
  - `scripts/audit-firestore-database.ts`
- Inventory top-level comparativo eseguito su `(default)` ed `eu-primary`:
  - stesso numero di collection paths (`21`)
  - stesso numero di document refs enumerati (`4633`)
  - nessun delta osservato a livello top-level
- Il gate finale di decommission resta comunque aperto: stato corrente `no-go for now` finche non viene chiuso il deep inventory/manual-ops check prima della delete.
- Aggiornati gli artifact di tracking GDPR:
  - `docs/gdpr-management-execution-plan-2026-03-26.md`
  - `docs/gdpr-management-review-2026-03-26.md`
- Aggiornato `/admin/compliance` per esporre anche il piano di decommission del legacy database come runbook operativo GDPR.

## 2026-03-27 (Firestore main database switch smoke test)

- Aggiunto smoke test operativo read-only per validare il puntamento del database Firestore principale tramite il layer del repo:
  - `scripts/smoke-firestore-main.ts`
- Lo smoke test usa `dbDefault()` e quindi verifica realmente l'effetto di:
  - `FIRESTORE_MAIN_DATABASE_ID`
  - credenziali Admin attive del repo
- Aggiunto comando rapido:
  - `npm run smoke:firestore-main`
- Scope del controllo:
  - `config/ai_settings`
  - `analytics/daily`
  - sample read su collection `articles`
  - sample read su collection `users`

## 2026-03-27 (Firestore EU main-database hard cutover)

- Il layer Firestore principale non usa piu il fallback al database legacy `(default)` in US.
- `lib/firebase/admin.ts` ora tratta `eu-primary` come database main canonico e blocca esplicitamente `FIRESTORE_MAIN_DATABASE_ID=(default)`.
- `lib/firebase/client.ts` ora tratta `eu-primary` come database main canonico e blocca esplicitamente `NEXT_PUBLIC_FIRESTORE_MAIN_DATABASE_ID=(default)`.
- Riallineato lo script operativo di push token test:
  - `scripts/send-test-to-token.js`
- Aggiornati gli artifact GDPR repo-local per riflettere il cambio di residency del datastore principale:
  - `docs/privacy-subprocessors-register.md`
  - `docs/privacy-transfer-assessment.md`

## 2026-03-26 (GDPR governance source-stack hardening)

- La skill locale `gdpr-feature-gate` ora richiede revisione obbligatoria contro il pacchetto condiviso `repo_template/docs/04-privacy-gdpr` prima della verifica repo-specifica.
- Introdotta gerarchia formale delle fonti GDPR con modalita esplicite `full_mode` e `degraded_mode`.
- Aggiunto documento operativo:
  - `docs/gdpr-review-source-stack.md`
- Rafforzato il checklist repo-driven con enforcement su source-stack review e blocco dei cambi high-risk se il pacchetto condiviso non e disponibile.

## 2026-03-26 (GDPR management review and admin compliance hub expansion)

- Aggiunta review end-to-end dello stato GDPR del repo:
  - `docs/gdpr-management-review-2026-03-26.md`
- Aggiunto piano esecutivo di tracciamento per i gap residui:
  - `docs/gdpr-management-execution-plan-2026-03-26.md`
- Avviato `WS1 / Strategia A` con matrice repo-specifica delle basi giuridiche:
  - `docs/privacy-lawful-basis-matrix.md`
- Chiuso `WS1 / Strategia A` con purpose split canonico:
  - inventory flow-level riallineata a riferimenti purpose-level
  - legal copy aggiornata dove il wording aggregato restava ambiguo
- Chiuso `WS2 / Strategia A` con registro repo-specifico vendor/subprocessors:
  - `docs/privacy-subprocessors-register.md`
  - owner, transfer implication e `DPA status` esplicitati anche dove ancora `TBD`
- Chiuso `WS3 / Strategia B` con transfer assessment scenario-based:
  - `docs/privacy-transfer-assessment.md`
  - scenari reali di trasferimento, accesso in chiaro, controlli supplementari, escalation e rischio residuo espliciti
- Chiuso `WS4 / Strategia A` con documento repo-specifico di end-of-contract handling:
  - `docs/privacy-end-of-contract-data-handling.md`
  - distinti account deletion, retention expiry, channel offboarding e legal exception sui contributor agreement
- Chiuso `WS5 / Strategia A` con runbook repo-specifico per incidenti privacy e breach candidate:
  - `docs/privacy-breach-escalation.md`
  - definiti trigger, owner, incident record minimo, severity guidance e decision path privacy/legal
- Chiuso `WS6 / Strategia A` con indice centrale degli screening DPIA:
  - `docs/privacy-dpia-index.md`
  - mappati flow, stato screening, source artifact e trigger di riapertura senza duplicare gli assessment dedicati
- Chiuso `WS7 / Strategia C` con consolidamento dell'hub `/admin/compliance`:
  - tassonomia stabile `baseline / governance / operations / evidence / AI Act related`
  - hub confermato come source-of-truth interno per il source stack GDPR del repo
- `/admin/compliance` ora espone l'intero source stack GDPR necessario:
  - baseline condivisa `repo_template/docs/04-privacy-gdpr`
  - artefatti repo-specifici di governance, operations ed evidence
- Ogni documento dell'hub ora espone anche:
  - `focus`
  - `objective`
  - `category`
  - `source`
- Aggiornata la documentazione dell'hub:
  - `docs/admin-compliance-hub.md`

## 2026-03-26 (Vendor register and notification cleanup)

- Rimossa integrazione runtime Slack dal feedback flow:
  - `app/api/feedbacks/route.ts`
  - `app/api/feedbacks/route.test.ts`
- Riallineati i documenti GDPR correnti rimuovendo `Slack` dal runtime register e dagli scenari di transfer:
  - `docs/privacy-processing-inventory.md`
  - `docs/privacy-subprocessors-register.md`
  - `docs/privacy-transfer-assessment.md`
  - `docs/gdpr-management-review-2026-03-26.md`
- Rimossa `Stripe` dalle note legali/compliance correnti dove non esiste evidenza runtime attiva:
  - `lib/i18n/legal-translations.ts`
  - `docs/gdpr-feature-checklist.md`

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

## 2026-03-25 (Admin surface and prod bundle hardening)

- Rimossa inclusione globale dello script Figma HTML-to-design dal layout pubblico:
  - `app/layout.tsx`
- Hardening route admin:
  - `app/admin/layout.tsx` usa enforcement server-side con session cookie Firebase e render protetto della shell admin.
- Aggiornata documentazione hub compliance con note esplicite su rendering protetto e `noindex`:
  - `docs/admin-compliance-hub.md`

## 2026-03-25 (Admin server-side auth and session gating)

- Introdotti cookie di sessione `httpOnly` Firebase per enforcement server-side delle route `/admin/*`.
- Aggiunti endpoint auth dedicati:
  - `POST /api/auth/session`
  - `POST /api/auth/session/logout`
- `proxy.ts` ora blocca utenti anonimi e utenti autenticati non-admin prima del render delle route admin.
- `app/admin/layout.tsx` verifica la sessione server-side come ulteriore enforcement prima del render.
- Aggiunta deny page dedicata:
  - `app/403/page.tsx`
- Aggiornati inventario privacy, checklist GDPR, legal copy auth/cookie e spec per riflettere il nuovo lifecycle di sessione admin.
