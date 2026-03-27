# GDPR Management Execution Plan

UpdatedAt: 2026-03-27

## Plan Metadata

- Status: `in-progress`
- Owner: stAItuned engineering
- Source review: `docs/gdpr-management-review-2026-03-26.md`
- Goal: chiudere i gap documentali e di accountability emersi dalla review GDPR del 2026-03-26
- Working rule: questo file va aggiornato nello stesso change set di ogni avanzamento rilevante

## How To Use This Plan

- Ogni workstream deve mantenere `status`, `scope`, `deliverable`, `evidence`, `next step`.
- Quando un task cambia stato, aggiornare:
  - `UpdatedAt`
  - sezione `Progress Log`
  - stato del workstream interessato
- Se emerge un nuovo gap GDPR materiale, aggiungerlo come nuovo workstream o task senza lasciarlo solo nella review.

## Overall Status

| Area | Status | Target Artifact | Priority |
|---|---|---|---|
| Lawful basis formalization | `done` | `docs/privacy-lawful-basis-matrix.md` | `P1` |
| Vendor/subprocessor register | `done` | `docs/privacy-subprocessors-register.md` | `P1` |
| Transfer assessment | `done` | `docs/privacy-transfer-assessment.md` | `P1` |
| End-of-contract handling | `done` | `docs/privacy-end-of-contract-data-handling.md` | `P1` |
| Breach escalation path | `done` | `docs/privacy-breach-escalation.md` or runbook equivalent | `P2` |
| DPIA index and re-open triggers | `done` | `docs/privacy-dpia-index.md` | `P2` |
| Hub/admin alignment | `done` | `/admin/compliance` document set | `P1` |
| Legacy Firestore decommission | `in-progress` | `docs/firestore-default-legacy-decommission-plan.md` | `P1` |

## Workstream 1. Lawful Basis Matrix

- Status: `done`
- Scope: trasformare le basi giuridiche oggi sparse tra inventory, checklist e legal copy in un artifact unico repo-specifico
- Target deliverable: `docs/privacy-lawful-basis-matrix.md`
- Inputs:
  - `docs/privacy-processing-inventory.md`
  - `docs/gdpr-feature-checklist.md`
  - `lib/i18n/legal-translations.ts`
  - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/lawful-basis-matrix.md`
- Definition of done:
  - ogni processing activity principale ha finalita, categorie dati, lawful basis, rationale e note su consenso
  - allineamento verificato con inventory e legal copy
  - documento aggiunto all'hub `/admin/compliance`
- Strategie possibili:
  - `Strategia A - matrice completa per flow`: un documento unico con una riga per ogni processing activity principale. Pro: leggibilita e auditability alte. Contro: piu manutenzione manuale.
  - `Strategia B - matrice minima solo per flow high-risk/public`: coprire subito i flussi pubblici e piu sensibili, lasciando gli altri come follow-up. Pro: delivery piu rapida. Contro: copertura incompleta nel breve.
  - `Strategia C - estrazione semi-derivata dall'inventory`: usare l'inventory come base e aggiungere solo colonne di lawful basis/rationale. Pro: meno duplicazione. Contro: artifact meno autonomo e piu dipendente da un altro doc.
- Strategia consigliata: `Strategia A`, con bootstrap iniziale dai flow gia presenti nell'inventory per ridurre il costo di compilazione.
- Evidence:
  - `docs/privacy-lawful-basis-matrix.md`
  - `docs/privacy-processing-inventory.md`
  - `lib/i18n/legal-translations.ts`
- Next step: nessuno per WS1; usare la matrice purpose-level come riferimento canonico per WS2-WS6

## Workstream 2. Subprocessors Register

- Status: `done`
- Scope: formalizzare vendor, categorie dati, regioni, transfer implication, DPA status e owner
- Target deliverable: `docs/privacy-subprocessors-register.md`
- Inputs:
  - `docs/privacy-processing-inventory.md`
  - `lib/i18n/legal-translations.ts`
  - integrazioni reali nel codice (`Firebase`, `Resend`, `Telegram`, `Google Analytics`, `FCM`, `Calendly`, `PayPal`, `Gemini`, eventuali altre`)
  - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/subprocessors.md`
- Definition of done:
  - ogni vendor rilevante ha una riga propria
  - e chiaro se agisce come processor/subprocessor o come destinatario tecnico
  - esiste owner interno e nota sullo stato documentale/DPA
  - documento aggiunto all'hub `/admin/compliance`
- Strategie possibili:
  - `Strategia A - registro completo per vendor`: un registry centralizzato con vendor, ruoli, regioni, DPA status e owner. Pro: e il formato piu auditabile. Contro: richiede sweep iniziale piu ampio.
  - `Strategia B - appendice all'inventory`: aggiungere una sezione vendor direttamente all'inventory esistente. Pro: minimizza i file. Contro: mescola livelli diversi e rende meno chiari ownership e stato documentale.
  - `Strategia C - registro per classi di vendor`: raggruppare per analytics, infra, messaging, payments, AI. Pro: piu leggibile. Contro: puo nascondere differenze importanti tra vendor della stessa classe.
- Strategia consigliata: `Strategia A`, con eventuali tag di categoria per mantenere leggibilita senza perdere granularita.
- Evidence:
  - `docs/privacy-subprocessors-register.md`
  - `docs/privacy-processing-inventory.md`
  - `lib/i18n/legal-translations.ts`
- Next step: nessuno per WS2; usare il registro come source-of-truth vendor per WS3 transfer assessment

## Workstream 3. Transfer Assessment

- Status: `done`
- Scope: formalizzare i trasferimenti e le implicazioni di accesso in chiaro per i vendor esterni
- Target deliverable: `docs/privacy-transfer-assessment.md`
- Inputs:
  - `docs/privacy-subprocessors-register.md` quando disponibile
  - `docs/privacy-processing-inventory.md`
  - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/transfer-assessment.md`
- Definition of done:
  - ogni scenario di transfer rilevante ha origine, destinazione, categorie dati, meccanismo e rischio residuo
  - sono identificati i casi da escalation legale
  - documento aggiunto all'hub `/admin/compliance`
- Strategie possibili:
  - `Strategia A - assessment per vendor`: una riga per ogni vendor con implicazioni di transfer. Pro: tracciamento preciso. Contro: possibile duplicazione con il subprocessors register.
  - `Strategia B - assessment per scenario di trasferimento`: raggruppare per scenario reale (analytics, messaging, auth, AI, payments). Pro: piu orientato al rischio. Contro: va mantenuto coerente quando entrano nuovi vendor.
  - `Strategia C - colonna transfer nel subprocessors register`: unificare tutto in un solo documento. Pro: meno frammentazione. Contro: il rischio transfer diventa meno visibile e meno approfondito.
- Strategia consigliata: `Strategia B`, con link espliciti dal subprocessors register a ogni scenario per evitare duplicazioni inutili.
- Evidence:
  - `docs/privacy-transfer-assessment.md`
  - `docs/privacy-subprocessors-register.md`
- Next step: nessuno per WS3; usare gli scenari e i `TBD` documentati come input per eventuali follow-up legal/ops

## Workstream 4. End-Of-Contract Data Handling

- Status: `done`
- Scope: rendere esplicito cosa succede ai dati quando termina il rapporto di servizio o il purpose
- Target deliverable: `docs/privacy-end-of-contract-data-handling.md`
- Inputs:
  - `docs/privacy-retention-schedule.md`
  - `docs/runbooks/dsar-account-deletion.md`
  - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/end-of-contract-data-handling.md`
- Definition of done:
  - trigger di chiusura definiti
  - return/delete paths espliciti
  - eventuali residual retained data spiegati
  - backup e follow-up verso vendor considerati
  - documento aggiunto all'hub `/admin/compliance`
- Strategie possibili:
  - `Strategia A - documento dedicato lifecycle/offboarding`: un documento repo-local solo per end-of-contract/end-of-purpose. Pro: perimetro chiaro. Contro: richiede coordinamento con retention e DSAR docs.
  - `Strategia B - estensione della retention schedule`: aggiungere una sezione finale di offboarding alla retention schedule. Pro: unisce lifecycle e retention. Contro: il tema contrattuale rischia di restare nascosto.
  - `Strategia C - runbook operativo senza policy doc separato`: trattarlo solo come procedura. Pro: veloce. Contro: debole sul piano di accountability e meno difendibile in audit.
- Strategia consigliata: `Strategia A`, con riferimenti incrociati a retention schedule e DSAR matrix.
- Evidence:
  - `docs/privacy-end-of-contract-data-handling.md`
  - `docs/privacy-retention-schedule.md`
  - `docs/runbooks/dsar-account-deletion.md`
  - `docs/runbooks/retention-lifecycle.md`
- Next step: nessuno per WS4; usare il documento come raccordo canonico tra retention, DSAR e legal exception handling

## Workstream 5. Breach Escalation Path

- Status: `done`
- Scope: introdurre un artefatto leggero ma esplicito per escalation incidente/breach nel perimetro GDPR
- Target deliverable: `docs/privacy-breach-escalation.md` oppure runbook equivalente
- Inputs:
  - runbook e processi operativi gia esistenti nel repo
  - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/gdpr-control-matrix.md`
  - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/dpa-checklist.md`
- Definition of done:
  - e chiaro chi apre l'escalation
  - e chiaro dove si registra l'incidente
  - e chiaro quando servono legal/privacy review
  - documento aggiunto all'hub `/admin/compliance`
- Strategie possibili:
  - `Strategia A - runbook dedicato GDPR incident`: documento specifico per incidenti con impatto privacy. Pro: chiaro e operativo. Contro: potenziale overlap con eventuali runbook security.
  - `Strategia B - sezione privacy in un incident runbook esistente`: riuso di un eventuale runbook trasversale. Pro: meno duplicazione. Contro: dipende dall'esistenza e dalla qualita del runbook madre.
  - `Strategia C - checklist minima di escalation`: artefatto corto con owner, trigger e decision path. Pro: implementazione rapida. Contro: copertura operativa limitata.
- Strategia consigliata: `Strategia A` se il repo non ha gia un incident runbook forte; altrimenti `Strategia B`.
- Evidence:
  - `docs/privacy-breach-escalation.md`
  - `docs/privacy-processing-inventory.md`
  - `docs/privacy-subprocessors-register.md`
  - `docs/privacy-transfer-assessment.md`
- Next step: nessuno per WS5; usare il runbook come path canonico per incidenti privacy e breach candidate

## Workstream 6. DPIA Index And Re-Open Triggers

- Status: `done`
- Scope: centralizzare gli screening DPIA attivi e i criteri di riapertura
- Target deliverable: `docs/privacy-dpia-index.md`
- Inputs:
  - `docs/dpia-screening-role-fit-audit.md`
  - `docs/gdpr-feature-checklist.md`
  - `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/dpia-template.md`
- Definition of done:
  - elenco dei flow con screening DPIA esistente
  - trigger di riapertura definiti
  - riferimento ai documenti sorgente
  - documento aggiunto all'hub `/admin/compliance`
- Strategie possibili:
  - `Strategia A - indice centrale leggero`: tabella con flow, stato screening, owner e re-open trigger. Pro: semplice e mantenibile. Contro: dipende dai documenti linkati per il dettaglio.
  - `Strategia B - registro completo rischio/DPIA`: documento piu ricco con rationale, misure e revision history. Pro: molto forte per audit. Contro: piu costoso da mantenere.
  - `Strategia C - embedding nel GDPR feature checklist`: aggiungere una sezione nel checklist. Pro: meno file. Contro: si perde la vista trasversale su tutti i flow.
- Strategia consigliata: `Strategia A`, lasciando i dettagli nei singoli screening dedicati.
- Evidence:
  - `docs/privacy-dpia-index.md`
  - `docs/dpia-screening-role-fit-audit.md`
  - `docs/gdpr-feature-checklist.md`
  - `docs/privacy-processing-inventory.md`
- Next step: nessuno per WS6; usare l indice centrale come source-of-truth per screening attivi e trigger di riapertura

## Workstream 7. Hub And Governance Alignment

- Status: `done`
- Scope: mantenere `/admin/compliance` allineato al source stack GDPR richiesto e ai nuovi artifact repo-local
- Target deliverable: catalogo documenti completo e aggiornato in `lib/admin/compliance-docs.ts`
- Done so far:
  - review GDPR aggiunta
  - baseline condivisa esposta nell'hub
  - metadata `focus` e `objective` aggiunti per ogni documento
- Remaining:
  - mantenere il catalogo aggiornato solo quando nasceranno nuovi artifact GDPR o AI Act rilevanti
- Strategie possibili:
  - `Strategia A - hub come source-of-truth completo`: ogni artifact rilevante deve comparire in `/admin/compliance`. Pro: consultazione centralizzata. Contro: il catalogo cresce rapidamente.
  - `Strategia B - hub curato solo per artefatti core`: mostrare solo i documenti piu importanti, lasciando fuori support docs. Pro: interfaccia piu snella. Contro: rischio di incompleta visibilita.
  - `Strategia C - hub a livelli`: baseline, governance, operations, evidence, related docs. Pro: migliora la scalabilita informativa. Contro: richiede disciplina nella categorizzazione.
- Strategia consigliata: `Strategia C`, che e anche quella gia avviata con il catalogo attuale.
- Evidence:
  - `docs/gdpr-management-review-2026-03-26.md`
  - `lib/admin/compliance-docs.ts`
  - `components/admin/AdminComplianceDocs.tsx`
- Next step: nessuno per WS7; trattare `/admin/compliance` come source-of-truth interno a livelli per baseline condivisa, governance, operations ed evidence

## Workstream 8. Legacy Firestore `(default)` Decommission

- Status: `in-progress`
- Scope: chiudere in modo controllato il lifecycle del database Firestore legacy `(default)` rimasto in `NAM5` dopo il cutover del main runtime su `eu-primary`
- Target deliverable: `docs/firestore-default-legacy-decommission-plan.md`
- Inputs:
  - `docs/privacy-subprocessors-register.md`
  - `docs/privacy-transfer-assessment.md`
  - `docs/deployments.md`
  - smoke evidence su `eu-primary`
  - export path e audit finale del database legacy
- Definition of done:
  - il legacy database e auditato
  - esiste export finale verificato
  - esiste decisione go/no-go esplicita prima della delete
  - la documentazione privacy/ops riflette lo stato finale del legacy
  - `/admin/compliance` espone il runbook di decommission
- Strategie possibili:
  - `Strategia A - delete immediata dopo cutover`: chiudere rapidamente il legacy DB appena il main runtime EU e stabile. Pro: riduce subito il rischio di rientro. Contro: troppo fragile se esistono dipendenze manuali o script non mappati.
  - `Strategia B - freeze + audit + export + delete`: introdurre una fase esplicita di audit finale, export verificato e go/no-go prima del delete. Pro: e la strategia piu robusta e auditabile. Contro: richiede una wave operativa in piu.
  - `Strategia C - legacy retained indefinitely`: lasciare il database legacy acceso ma non usato. Pro: zero rischio distruttivo immediato. Contro: lascia aperto un rischio di residency/transfer non necessario e indebolisce la posture GDPR.
- Strategia consigliata: `Strategia B`, con delete solo dopo audit finale e finestra operativa controllata.
- Evidence:
  - `docs/firestore-default-legacy-decommission-plan.md`
  - `scripts/smoke-firestore-main.ts`
  - final export evidence del legacy DB
- Next step:
  - eseguire legacy audit
  - registrare export finale
  - produrre decisione go/no-go prima di qualsiasi delete

## Progress Log

### 2026-03-26

- creato review doc: `docs/gdpr-management-review-2026-03-26.md`
- ampliato `/admin/compliance` con baseline condivisa + metadata `focus` / `objective`
- aperto questo piano esecutivo per tracciare la chiusura dei gap residui passo passo
- aggiunte strategie possibili per ogni workstream, con strategia consigliata e tradeoff
- WS1 avviato con Strategia A: creata matrice repo-specifica `docs/privacy-lawful-basis-matrix.md`
- WS1 chiuso: adottato purpose split canonico, inventory riallineata e legal copy aggiornata dove il wording precedente restava troppo aggregato
- WS2 chiuso con Strategia A: creato registro repo-specifico `docs/privacy-subprocessors-register.md` con owner, transfer implication e DPA status espliciti
- WS3 chiuso con Strategia B: creata transfer assessment scenario-based `docs/privacy-transfer-assessment.md`, con rischio residuo ed escalation espliciti
- WS4 chiuso con Strategia A: creato `docs/privacy-end-of-contract-data-handling.md` per distinguere account deletion, end-of-purpose, channel offboarding e legal exception sui contributor agreement
- WS5 chiuso con Strategia A: creato `docs/privacy-breach-escalation.md` con trigger, owner, incident record minimo e decision path privacy/legal
- WS6 chiuso con Strategia A: creato `docs/privacy-dpia-index.md` per centralizzare screening attivi, stato dei flow e trigger di riapertura
- WS7 chiuso con Strategia C: `/admin/compliance` confermato come hub a livelli completo per baseline condivisa, governance repo, operations ed evidence

### 2026-03-27

- formalizzato `WS8` per il decommission del Firestore legacy `(default)` dopo il cutover del main runtime su `eu-primary`
- aggiunto piano operativo dedicato:
  - `docs/firestore-default-legacy-decommission-plan.md`
- chiuso il blocker di codice sul package `functions`, che prima inizializzava Firestore senza `databaseId` e quindi sarebbe ricaduto sul legacy `(default)`
- raccolta evidenza GCP completata su identita database e export legacy:
  - `(default)` confermato in `nam5`
  - `eu-primary` confermato in `europe-west1`
  - export finale legacy verificato in `gs://staituned-firestore-export-us/firestore-export-final-20260327-121729`
  - copia archivio EU verificata in `gs://staituned-firestore-archive-eu/firestore-export-final-20260327-121729`
- inventory top-level comparativo completato con `scripts/audit-firestore-database.ts`:
  - `(default)` e `eu-primary` mostrano gli stessi `21` collection paths e `4633` document refs enumerati
- decisione corrente: `no-go for now` finche non viene chiusa la conferma finale su manual ops / console usage prima della delete
- `WS8` resta `in-progress` fino a audit finale, export verificato e decisione go/no-go prima della delete

## Update Checklist For Each Future Step

- aggiornare questo file
- aggiornare `docs/compliance-changelog.md` se il cambiamento e materialmente GDPR-related
- aggiornare l'hub `/admin/compliance` se nasce un nuovo artifact rilevante
- verificare allineamento con `docs/gdpr-management-review-2026-03-26.md`
